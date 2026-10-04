import assert from 'node:assert/strict';
const base=process.argv[2];if(!base)throw Error('Usage: node scripts/verify-live.mjs https://YOUR-DEPLOYMENT');
async function login(name){const response=await fetch(base+'/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name})});assert.equal(response.status,200);const cookie=response.headers.get('set-cookie');assert.ok(cookie.includes('HttpOnly'));return {cookie:cookie.split(';')[0],user:await response.json()};}
async function request(player,path,data){const response=await fetch(base+'/api/'+path,{method:data===undefined?'GET':'POST',headers:{Cookie:player.cookie,'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data)});const result=await response.json();assert.equal(response.status,200,JSON.stringify(result));return result;}
const theme=process.argv[3]??'kahvalti';
const a=await login('Yayın testi A'),b=await login('Yayın testi B');
let room=await request(a,'create',{theme,budget:100,seconds:8,public:false});
await request(b,'join',{code:room.code});await request(b,'ready',{ready:true});room=await request(a,'start',{});
let key='';
while(room.match.phase!=='build'){
  const m=room.match,nextKey=m.phase+':'+m.round+':'+m.extraIndex;
  if(nextKey!==key){
    key=nextKey;console.log('Verified phase',key);
    if(m.phase==='basic'){
      assert.ok(!JSON.stringify(m).includes('"points"'));
      const ids=m.products.map(p=>p.id);
      await Promise.all([request(a,'basic',{amount:10,preference:ids}),request(b,'basic',{amount:5,preference:[...ids].reverse()})]);
      const other=await request(b,'state');assert.equal(other.match.ownBid.amount,5);assert.equal(other.match.bids,undefined);
    }else if(m.phase==='extra'&&m.extraIndex===0){await request(a,'bid',{amount:1});const other=await request(b,'state');assert.equal(other.match.price,1);}
  }
  await new Promise(resolve=>setTimeout(resolve,1000));room=await request(a,'state');
}
for(const player of [a,b]){const current=await request(player,'state');const own=current.match.players.find(p=>p.id===player.user.id);await request(player,'build',{ids:own.inventory.map(p=>p.id),finish:true});}
const result=await request(a,'state');assert.equal(result.match.phase,'results');assert.equal(result.match.results.length,2);assert.ok(result.match.results.every(p=>Number.isFinite(p.points)));
if(theme!=='kahvalti')assert.ok(result.match.results.every(p=>p.breakdown.type===(theme==='bilgisayar'?'computer':'soup')));
await request(b,'leave',{});await request(a,'leave',{});console.log('LIVE TWO-PLAYER MATCH PASSED:',theme);
