import assert from 'node:assert/strict';
const base=(process.argv[2]??'').replace(/\/$/,''),theme=process.argv[3]??'kahvalti';
if(!base)throw Error('Usage: node scripts/verify-live.mjs https://YOUR-DEPLOYMENT [theme]');
async function login(name){
 const response=await fetch(base+'/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name}),signal:AbortSignal.timeout(15000)});
 assert.equal(response.status,200);const cookie=response.headers.get('set-cookie');assert.ok(cookie.includes('HttpOnly'));
 return {cookie:cookie.split(';')[0],user:await response.json()};
}
async function request(player,path,data){
 const response=await fetch(base+'/api/'+path,{method:data===undefined?'GET':'POST',headers:{Cookie:player.cookie,'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data),signal:AbortSignal.timeout(15000)});
 const result=await response.json();assert.equal(response.status,200,JSON.stringify(result));return result;
}
const a=await login('Yayın testi A'),b=await login('Yayın testi B'),players=[a,b];let created=false;
try{
 let room=await request(a,'create',{theme,budget:100,public:false});created=true;
 assert.equal(room.settings.seconds,90);assert.equal(room.public,false);
 await request(b,'join',{code:room.code});await request(b,'ready',{ready:true});room=await request(a,'start',{});
 assert.equal(room.match.phase,'auction');assert.ok(room.match.deadline-room.match.serverNow<=90000);
 while(room.match.phase==='auction'){
  const m=room.match,productId=m.products[0].id,buyer=players[m.auctionIndex%2];
  assert.ok(!JSON.stringify(m).includes('"points"'));assert.equal(m.auctionQueue,undefined);
  const bid=await request(buyer,'bid',{productId,increment:true});assert.equal(bid.match.price,1);
  await Promise.all(players.map(player=>request(player,'pass',{productId})));
  room=await request(a,'state');const won=room.match.history.at(-1);
  assert.equal(won.playerId,buyer.user.id);assert.equal(won.amount,1);assert.equal(won.product.id,productId);
  console.log('Verified sale',room.match.history.length+'/'+m.auctionTotal);
 }
 assert.equal(room.match.phase,'build');
 for(const player of players){
  const own=room.match.players.find(p=>p.id===player.user.id);
  const inventory=theme==='bilgisayar'?[...new Map(own.inventory.map(p=>[p.group,p])).values()]:own.inventory;
  await request(player,'build',{ids:inventory.slice(0,theme==='corba'?6:theme==='bilgisayar'?10:8).map(p=>p.id),finish:true});
 }
 const result=await request(a,'state');assert.equal(result.match.phase,'results');assert.equal(result.match.results.length,2);
 for(const row of result.match.results){
  assert.ok(Number.isFinite(row.points));assert.equal(row.remaining,result.match.players.find(p=>p.id===row.id).balance);
 }
 await request(a,'replay',{});const replay=await request(a,'state');assert.ok(!replay.match);assert.equal(replay.settings.seconds,90);
 console.log('LIVE AUCTION MATCH PASSED:',theme);
}finally{
 if(created){
  let room=await request(a,'state');
  while(room?.match?.phase==='auction'){
   const productId=room.match.products[0].id;
   for(const player of players)if(!room.match.passed.includes(player.user.id))await request(player,'pass',{productId});
   room=await request(a,'state');
  }
  if(room?.match?.phase==='build')for(const player of players)if(!room.match.finished.includes(player.user.id))await request(player,'build',{ids:[],finish:true});
  await request(b,'leave',{});await request(a,'leave',{});
 }
}
