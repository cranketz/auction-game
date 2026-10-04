import test from 'node:test';
import assert from 'node:assert/strict';
import {createBots,botObservation,planBot} from '../src/bots.js';
import {perform,restoreMatch} from '../src/service.js';
import {MemoryStore} from '../src/store.js';

async function practice(theme='kahvalti',bots=1){
 const store=new MemoryStore(),user=await perform(store,{method:'POST',path:'session',b:{name:'Pratik oyuncusu'},now:0});
 const call=(path,b={},now=0,method='POST',token=user.token)=>perform(store,{method,path,b,now,token});
 const created=await call('create',{theme,budget:100,seconds:8,practice:true,bots,public:true});
 return {store,user,call,created};
}
test('practice validates bot counts, remains private and rejects other humans',async()=>{
 for(const count of [0,4,-1,1.5,'2',undefined])assert.throws(()=>createBots(count),/1–3 bot/);
 const {store,call,created}=await practice('kahvalti',3);
 assert.equal(created.value.practice,true);assert.equal(created.value.public,false);assert.equal(created.value.players.length,4);
 assert.equal(created.value.players.filter(p=>p.bot&&p.ready&&p.online).length,3);
 const other=await perform(store,{method:'POST',path:'session',b:{name:'Başka oyuncu'},now:0,ip:'other'});
 assert.deepEqual((await call('rooms',{},0,'GET',other.token)).value,[]);
 await assert.rejects(call('join',{code:created.value.code},0,'POST',other.token),/yalnızca kurucusu/);
 await assert.rejects(call('quick',{},0,'POST',other.token),/Uygun oda yok/);
 assert.equal(created.value.botState,undefined);
});
test('bot observation and decisions ignore secret bids, points and future pools',async()=>{
 const {store,call}=await practice();await call('start');
 const room=Object.values((await store.read()).data.rooms)[0],match=restoreMatch(room.match),bot=match.players.find(p=>p.bot);
 const before=botObservation(match,bot.id),plan=planBot(before,'same-seed');
 match.bids[match.players[0].id]={amount:99,preference:match.products.map(p=>p.id).reverse()};
 match.computerKits=[['secret-future']];match.hiddenSoupRelations={a:999};
 for(const p of match.products)Object.defineProperty(p,'points',{get(){throw Error('Private points accessed');}});
 assert.deepEqual(botObservation(match,bot.id),before);assert.deepEqual(planBot(botObservation(match,bot.id),'same-seed'),plan);
 assert.ok(!JSON.stringify(before).includes('points'));assert.ok(!('bids' in before));
 assert.ok(plan.amount>=0&&plan.amount<=bot.basic);assert.deepEqual(new Set(plan.preference),new Set(match.products.map(p=>p.id)));
});
test('computer bot uses public socket and RAM compatibility; build excludes duplicates',()=>{
 const inventory=[{id:'cpu',modelId:'cpu',group:'İşlemci',socket:'A',watts:65}];
 const products=[{id:'bad',modelId:'bad',group:'Anakart',socket:'B',memory:'D5'},{id:'good',modelId:'good',group:'Anakart',socket:'A',memory:'D4'}];
 const o={theme:'bilgisayar',phase:'basic',basic:100,round:1,basicTotal:6,products,inventory};
 assert.equal(planBot(o,'seed').preference[0],'good');
 const items=[...inventory,products[1],{id:'ram',modelId:'ram',group:'RAM',memory:'D4'},...Array.from({length:15},(_,i)=>({id:'extra'+i,modelId:'extra'+i,group:'Klavye'}))];
 const ids=planBot({...o,phase:'build',inventory:items},'seed').ids;
 assert.equal(new Set(ids.map(id=>items.find(p=>p.id===id).group)).size,ids.length);assert.ok(ids.length<=10);
});
test('bot plans survive reload; simultaneous polls apply a sealed bid once',async()=>{
 const {store,call}=await practice('kahvalti',3);await call('start');
 const saved=await store.read();store.data=JSON.parse(JSON.stringify(saved.data));
 const plans=Object.values(store.data.rooms)[0].botState;
 await Promise.all(Array.from({length:20},()=>call('state',{},5000,'GET')));
 const room=Object.values((await store.read()).data.rooms)[0],match=restoreMatch(room.match);
 assert.equal(Object.keys(match.bids).length,3);assert.equal(store.version,saved.version+1);
 for(const bot of match.players.filter(p=>p.bot)){assert.equal(match.bids[bot.id].amount,plans[bot.id].amount);assert.equal(room.botState[bot.id].done,true);}
 const state=(await call('state',{},5001,'GET')).value;
 assert.equal(state.botState,undefined);assert.equal(state.match.bids,undefined);assert.equal(state.match.ownBid,null);
});
test('practice bots cannot become host; orphaned lobbies and active leave release room capacity',async()=>{
 const {store,user,call}=await practice('corba',2);
 const outsider=await perform(store,{method:'POST',path:'session',b:{name:'Dışarıdaki'},now:0,ip:'outside'});
 await call('rooms',{},46000,'GET',outsider.token);
 assert.equal(Object.values((await store.read()).data.rooms)[0].host,user.value.id);
 await call('rooms',{},120001,'GET',outsider.token);assert.equal(Object.keys((await store.read()).data.rooms).length,0);
 await call('create',{theme:'corba',budget:50,seconds:8,practice:true,bots:1},120002);await call('start',{},120002);await call('leave',{},120003);
 assert.equal(Object.keys((await store.read()).data.rooms).length,0);assert.equal((await call('state',{},120004,'GET')).value,null);
});
test('bot sealed plans may settle at deadline; extras never retroactively extend an expired auction',async()=>{
 const {store,call}=await practice();let state=(await call('start')).value,now=state.match.deadline;
 state=(await call('state',{},now,'GET')).value;
 assert.ok(state.match.history[0].allocation.some(a=>a.playerId!==state.host&&a.amount>0));
 while(state.match.phase==='basic'){now=state.match.deadline;state=(await call('state',{},now,'GET')).value;}
 const before=Object.values((await store.read()).data.rooms)[0].botState;
 now=state.match.deadline;state=(await call('state',{},now,'GET')).value;
 assert.equal(state.match.history.at(-1).type,'extra');assert.equal(state.match.history.at(-1).amount,0);
 assert.ok(Object.values(before).every(plan=>plan.cap>=0));
});
test('all three themes finish with one or three bots under normal budgets and persisted deadlines',async()=>{
 for(const theme of ['kahvalti','bilgisayar','corba'])for(const bots of [1,3]){
  const {store,call}=await practice(theme,bots);let state=(await call('start')).value,now=0,iterations=0;
  while(state.match.phase!=='results'&&iterations++<1200){
   now+=1000;state=(await call('state',{},now,'GET')).value;
   const m=state.match,own=m.players.find(p=>p.id===state.host);
   assert.ok(m.players.every(p=>p.basic>=0&&p.basic<=100&&p.extra>=0&&p.extra<=100));
   if(m.phase==='basic'&&!m.ownBid)state=(await call('basic',{amount:0,preference:m.products.map(p=>p.id)},now)).value;
   if(m.phase==='build'&&!m.finished.includes(state.host))state=(await call('build',{ids:[],finish:true},now)).value;
  }
  assert.equal(state.match.phase,'results',theme+' '+bots);assert.equal(state.match.results.length,bots+1);
  assert.ok(state.match.results.filter(r=>r.id!==state.host).every(r=>r.selected.length>0&&Number.isFinite(r.points)));
  const replay=(await call('replay',{},now)).value;assert.ok(!replay.match);assert.equal(replay.players.filter(p=>p.bot&&p.ready).length,bots);
  assert.equal((await call('start',{},now)).value.match.phase,'basic');await call('leave',{},now);assert.equal(Object.keys((await store.read()).data.rooms).length,0);
 }
});
