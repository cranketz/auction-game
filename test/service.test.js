import test from 'node:test';
import assert from 'node:assert/strict';
import {MemoryStore,transact} from '../src/store.js';
import {perform,restoreMatch,saveMatch} from '../src/service.js';

export async function verifyLifecycle(store){
  const call=(token,path,b={},now=1000000,method='POST')=>perform(store,{token,path,b,now,method});
  const a=await call(null,'session',{name:'Birinci'});
  const b=await call(null,'session',{name:'İkinci'});
  const created=await call(a.token,'create',{theme:'kahvalti',budget:100,seconds:8});
  const code=created.value.code;
  await assert.rejects(call(a.token,'start'),/Yeterli oyuncu/);
  await call(b.token,'join',{code});await call(b.token,'ready',{ready:true});
  let started=await call(a.token,'start');let now=1000001;
  for(let round=0;round<4;round++){
    const ids=started.value.match.products.map(p=>p.id);
    await Promise.all([call(a.token,'basic',{amount:10,preference:ids},now),call(b.token,'basic',{amount:5,preference:[...ids].reverse()},now)]);
    const other=await call(b.token,'state',{},now,'GET');assert.equal(other.value.match.ownBid.amount,5);assert.equal(other.value.match.bids,undefined);
    now=other.value.match.deadline;
    started=await call(a.token,'state',{},now,'GET');now++;
  }
  assert.equal(started.value.match.phase,'extra');
  await Promise.allSettled([call(a.token,'bid',{amount:10},now),call(b.token,'bid',{amount:15},now)]);
  let current=await call(a.token,'state',{},now,'GET');assert.equal(current.value.match.price,15);
  for(let i=0;i<4;i++){now=current.value.match.deadline;current=await call(a.token,'state',{},now,'GET');}
  assert.equal(current.value.match.phase,'build');
  const idsA=current.value.match.players.find(p=>p.id===a.value.id).inventory.map(p=>p.id);
  const idsB=current.value.match.players.find(p=>p.id===b.value.id).inventory.map(p=>p.id);
  await call(a.token,'build',{ids:idsA,finish:true},now+1);
  const result=await call(b.token,'build',{ids:idsB,finish:true},now+1);
  assert.equal(result.value.match.phase,'results');assert.equal(result.value.match.finished.length,2);
  await call(b.token,'leave',{},now+2);await call(a.token,'leave',{},now+2);
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
