import test from 'node:test';
import assert from 'node:assert/strict';
import {Match,OFFER_SECONDS} from '../src/engine.js';
import {MemoryStore,transact} from '../src/store.js';
import {perform,restoreMatch,saveMatch} from '../src/service.js';
const players=[{id:'a',name:'A'},{id:'b',name:'B'}];

test('new duration choices persist through rooms, rounds and the 90-second build phase',async()=>{
 for(const seconds of OFFER_SECONDS){
  const store=new MemoryStore();
  const user=await perform(store,{method:'POST',path:'session',b:{name:'Süre testi'},now:0});
  const call=(path,b={},now=0)=>perform(store,{method:'POST',path,b,token:user.token,now});
  const created=await call('create',{theme:'kahvalti',budget:100,seconds,practice:true,bots:1});
  assert.equal(created.value.settings.seconds,seconds);
  const started=await call('start');assert.equal(started.value.match.deadline,seconds*1000);
  let m=restoreMatch((await store.read()).data.rooms[created.value.code].match),now=0;
  while(m.phase!=='build'){
   now=m.deadline;m.tick(now);m=restoreMatch(saveMatch(m));
   if(['basic','extra'].includes(m.phase))assert.equal(m.deadline-now,seconds*1000);
  }
  assert.equal(m.deadline-now,90000);
 }
 assert.equal(new Match(players,{},0).deadline,30000);
});

test('new rooms reject retired durations while existing lobbies and stored matches remain playable',async()=>{
 const store=new MemoryStore();
 const user=await perform(store,{method:'POST',path:'session',b:{name:'Eski oda'},now:0});
 const call=(path,b={})=>perform(store,{method:'POST',path,b,token:user.token,now:0});
 for(const seconds of [8,12,0,25,60])await assert.rejects(call('create',{theme:'kahvalti',budget:100,seconds}),/Geçersiz/);
 const created=await call('create',{theme:'kahvalti',budget:100,seconds:20,practice:true,bots:1});
 await transact(store,data=>{data.rooms[created.value.code].settings.seconds=12;return {changed:true};});
 assert.equal((await call('start')).value.match.deadline,12000);
 const original=new Match(players,{seconds:8},0),saved=saveMatch(original);delete saved.buildSeconds;
 let restored=restoreMatch(saved),now=0;
 assert.equal(restored.deadline,8000);
 while(restored.phase!=='build'){now=restored.deadline;restored.tick(now);restored=restoreMatch(saveMatch(restored));}
 assert.equal(restored.deadline-now,60000);
});
