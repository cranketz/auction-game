import test from 'node:test';
import assert from 'node:assert/strict';
import {MemoryStore,transact} from '../src/store.js';
import {perform,restoreMatch,saveMatch} from '../src/service.js';

export async function verifyLifecycle(store){
 const call=(token,path,b={},now=1000000,method='POST')=>perform(store,{token,path,b,now,method});
 const a=await call(null,'session',{name:'Birinci'}),b=await call(null,'session',{name:'İkinci'});
 const created=await call(a.token,'create',{theme:'kahvalti',budget:100});
 await assert.rejects(call(a.token,'start'),/Yeterli oyuncu/);
 await call(b.token,'join',{code:created.value.code});await call(b.token,'ready',{ready:true});
 let state=await call(a.token,'start'),now=1000001,round=0;
 assert.equal(state.value.match.phase,'auction');
 while(state.value.match.phase==='auction'){
  const productId=state.value.match.products[0].id;
  assert.ok(!JSON.stringify(state.value.match).includes('"points"'));assert.equal(state.value.match.auctionQueue,undefined);
  const buyer=round++%2?a:b;
  await call(buyer.token,'bid',{productId,increment:true},now);
  state=await call(a.token,'state',{},now,'GET');assert.equal(state.value.match.price,1);
  await Promise.all([call(a.token,'pass',{productId},now),call(b.token,'pass',{productId},now)]);
  state=await call(a.token,'state',{},++now,'GET');
 }
 assert.equal(state.value.match.phase,'build');assert.equal(state.value.match.history.length,12);
 for(const player of [a,b]){
  const p=state.value.match.players.find(p=>p.id===player.value.id);
  assert.equal(p.balance,94);assert.equal(p.inventory.length,6);
  await call(player.token,'build',{ids:p.inventory.map(p=>p.id),finish:true},now);
 }
 const result=await call(a.token,'state',{},now,'GET');assert.equal(result.value.match.phase,'results');assert.equal(result.value.match.finished.length,2);
 await call(b.token,'leave',{},now+1);await call(a.token,'leave',{},now+1);
}

test('stored match survives all phases, concurrent bids and finished Set restoration',async()=>verifyLifecycle(new MemoryStore()));
test('atomic retries do not lose simultaneous updates',async()=>{
  const store=new MemoryStore();await Promise.all(Array.from({length:6},()=>transact(store,data=>{data.count=(data.count??0)+1;return {changed:true};})));
  assert.equal((await store.read()).data.count,6);
});
test('expired sessions cannot authorize actions',async()=>{
  const store=new MemoryStore();const user=await perform(store,{method:'POST',path:'session',b:{name:'Test'},now:0});
  const result=await perform(store,{method:'GET',path:'state',token:user.token,now:7*86400000});assert.equal(result.status,401);
});
test('forged prototype session tokens cannot authenticate',async()=>{
  const store=new MemoryStore();
  for(const token of ['__proto__','constructor','toString']){
    const result=await perform(store,{method:'GET',path:'state',token});assert.equal(result.status,401);
  }
});
