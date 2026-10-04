import test from 'node:test';
import assert from 'node:assert/strict';
import {Match,LegacyMatch} from '../src/engine.js';
import {MemoryStore,transact} from '../src/store.js';
import {perform,restoreMatch,saveMatch} from '../src/service.js';
const players=[{id:'a',name:'A'},{id:'b',name:'B'}];
test('new rooms and old lobbies start auction-only matches with fixed 90-second rounds',async()=>{
 const store=new MemoryStore(),user=await perform(store,{method:'POST',path:'session',b:{name:'Süre testi'},now:0});
 const call=(path,b={})=>perform(store,{method:'POST',path,b,token:user.token,now:0});
 const created=await call('create',{theme:'kahvalti',budget:100,seconds:12,practice:true,bots:1});
 assert.equal(created.value.settings.seconds,90);
 await transact(store,data=>{data.rooms[created.value.code].settings.seconds=12;return {changed:true};});
 const started=await call('start');assert.equal(started.value.match.deadline,90000);assert.equal(started.value.settings.seconds,90);
 let m=new Match(players,{},0),now=0;
 while(m.phase==='auction'){now=m.deadline;m.tick(now);m=restoreMatch(saveMatch(m));assert.equal(m.deadline-now,90000);}
 assert.equal(m.phase,'build');assert.equal(m.buildSeconds,90);
});
test('stored older matches keep their deadline and previous preparation duration',()=>{
 const original=new LegacyMatch(players,{seconds:8},0),saved=saveMatch(original);delete saved.buildSeconds;
 let m=restoreMatch(saved),now=0;assert.equal(m.deadline,8000);
 while(m.phase!=='build'){now=m.deadline;m.tick(now);m=restoreMatch(saveMatch(m));}
 assert.equal(m.deadline-now,60000);
 assert.equal(m.auctionVersion,undefined);
});
