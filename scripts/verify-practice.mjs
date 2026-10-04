import assert from 'node:assert/strict';
const base=(process.argv[2]??'').replace(/\/$/,''),theme=process.argv[3]??'kahvalti',bots=Number(process.argv[4]??1);
if(!base)throw Error('Usage: node scripts/verify-practice.mjs https://YOUR-DEPLOYMENT [theme] [1–3]');
const login=await fetch(base+'/api/session',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({name:'Bot pratik denetimi'}),signal:AbortSignal.timeout(15000)});
assert.equal(login.status,200);const cookie=login.headers.get('set-cookie')?.split(';')[0];assert.ok(cookie);const user=await login.json();
async function request(path,data){
 const res=await fetch(base+'/api/'+path,{method:data===undefined?'GET':'POST',headers:{Cookie:cookie,'Content-Type':'application/json'},body:data===undefined?undefined:JSON.stringify(data),signal:AbortSignal.timeout(15000)});
 const result=await res.json();assert.equal(res.status,200,JSON.stringify(result));return result;
}
let created=false,sawBotExtra=false;
try{
 let room=await request('create',{theme,budget:100,seconds:90,practice:true,bots});created=true;
 assert.equal(room.practice,true);assert.equal(room.public,false);assert.equal(room.players.filter(p=>p.bot&&p.ready).length,bots);
 assert.ok(!(await request('rooms')).some(r=>r.code===room.code));
 room=await request('start',{});let key='',sentExtra=false,finished=false;const started=Date.now();
 while(room.match.phase!=='results'){
  assert.ok(Date.now()-started<1800000,'Practice did not finish in 30 minutes');
  const m=room.match,current=m.players.find(p=>p.id===user.id),nextKey=m.phase+':'+m.auctionIndex;
  assert.equal(m.bids,undefined);assert.equal(room.botState,undefined);assert.ok(!JSON.stringify(m).includes('"points"'));
  assert.ok(m.players.every(p=>p.balance>=0));
  if(nextKey!==key){key=nextKey;sentExtra=false;console.log('Verified practice phase',key);}
  if(m.phase==='auction'){
   if(m.leader&&m.leader!==user.id)sawBotExtra=true;
   if(!sentExtra&&m.auctionIndex===0&&!m.passed.includes(user.id)&&m.leader!==user.id&&current.balance>=m.price+1){room=await request('bid',{productId:m.products[0].id,increment:true});sentExtra=true;}
   if(!room.match.passed.includes(user.id)&&room.match.phase==='auction')room=await request('pass',{productId:room.match.products[0].id});
  }
  if(m.phase==='build'&&!finished){
   const unique=theme==='bilgisayar'?[...new Map(current.inventory.map(p=>[p.group,p])).values()]:current.inventory;
   room=await request('build',{ids:unique.slice(0,theme==='corba'?6:theme==='bilgisayar'?10:8).map(p=>p.id),finish:true});finished=true;
  }
  if(room.match.phase!=='results'){await new Promise(resolve=>setTimeout(resolve,1000));room=await request('state');}
 }
 assert.equal(room.match.results.length,bots+1);assert.ok(sawBotExtra,'No bot extra bid observed');
 assert.ok(room.match.results.every(r=>Number.isFinite(r.points)));assert.ok(room.match.results.filter(r=>r.id!==user.id).every(r=>r.selected.length>0));
 room=await request('replay',{});assert.ok(!room.match);assert.ok(room.players.filter(p=>p.bot).every(p=>p.ready));
 assert.equal((await request('start',{})).match.phase,'auction');console.log('BOT PRACTICE PASSED:',theme,bots);
}finally{if(created)await request('leave',{});}
