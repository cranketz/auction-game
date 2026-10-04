import test from 'node:test';
import assert from 'node:assert/strict';
import {MemoryStore} from '../src/store.js';
import {perform} from '../src/service.js';
async function setup(count=2){
  const store=new MemoryStore();const players=[];
  for(let i=0;i<count;i++)players.push(await perform(store,{method:'POST',path:'session',b:{name:`Oyuncu ${i}`},now:0,ip:`test-${i}`}));
  const call=(i,path,b={},now=0,method='POST')=>perform(store,{method,path,b,now,token:players[i].token});
  const room=await call(0,'create',{theme:'kahvalti',budget:100,seconds:20});
  for(let i=1;i<count;i++)await call(i,'join',{code:room.value.code});
  return {store,players,call};
}
test('offline host transfers to connected player and does not reclaim on return',async()=>{
  const {players,call}=await setup();await call(0,'ready',{ready:true});
  const room=await call(1,'state',{},46000,'GET');
  assert.equal(room.value.host,players[1].value.id);
  assert.equal(room.value.players[0].online,false);assert.equal(room.value.players[0].ready,false);
  const resumed=await call(0,'state',{},47000,'GET');
  assert.equal(resumed.value.host,players[1].value.id);assert.equal(resumed.value.players[0].online,true);
  await assert.rejects(call(0,'start',{},47000),/oda sahibi/);
});
test('disconnected lobby player is removed after grace period, empty lobby is cleaned',async()=>{
  const {call,store}=await setup();
  const room=await call(1,'state',{},120001,'GET');assert.equal(room.value.players.length,1);
  await perform(store,{method:'GET',path:'rooms',now:250002});assert.equal(Object.keys((await store.read()).data.rooms).length,0);
});
test('active match retains disconnected inventory and accepts reconnect',async()=>{
  const {players,call}=await setup();await call(1,'ready',{ready:true});await call(0,'start');
  const next=await call(1,'state',{},46000,'GET');assert.equal(next.value.host,players[1].value.id);
  assert.equal(next.value.match.players.length,2);assert.equal(next.value.match.players[0].online,false);
  const resumed=await call(0,'state',{},47000,'GET');assert.equal(resumed.value.match.players[0].online,true);
  assert.deepEqual(resumed.value.match.players[0].inventory,next.value.match.players[0].inventory);
  assert.deepEqual(resumed.value.match.products,next.value.match.products);
});
test('explicit host departure selects connected successor',async()=>{
  const {players,call}=await setup(3);await call(2,'state',{},31000,'GET');
  await call(0,'leave',{},31001);const room=await call(2,'state',{},31002,'GET');
  assert.equal(room.value.host,players[2].value.id);
});
test('five independent six-player rooms allocate every round without cross-room state',async()=>{
  const store=new MemoryStore();const groups=[];let now=1000000;
  const call=(p,path,b={},method='POST')=>perform(store,{method,path,b,now,token:p.token});
  for(let r=0;r<5;r++){
    const players=[];
    for(let i=0;i<6;i++)players.push(await perform(store,{method:'POST',path:'session',b:{name:`Grup ${r} kişi ${i}`},now,ip:`${r}-${i}`}));
    const room=await call(players[0],'create',{theme:'kahvalti',budget:100,seconds:20});
    for(const p of players.slice(1))await call(p,'join',{code:room.value.code});
    await Promise.all(players.slice(1).map(p=>call(p,'ready',{ready:true})));
    await call(players[0],'start');groups.push(players);
  }
  const extra=await perform(store,{method:'POST',path:'session',b:{name:'Fazla oda'},now,ip:'extra'});
  await assert.rejects(call(extra,'create',{theme:'kahvalti',budget:100,seconds:20}),/kapasitesi/);
  for(let round=0;round<36;round++){
    for(const players of groups){
      const room=await call(players[0],'state',{},'GET'),productId=room.value.match.products[0].id;
      assert.equal(room.value.match.auctionIndex,round);
      await call(players[round%6],'bid',{productId,increment:true});
      await Promise.all(players.map(p=>call(p,'pass',{productId})));
    }
    now++;
  }
  for(const players of groups){
    const state=await call(players[0],'state',{},'GET');assert.equal(state.value.match.phase,'build');
    assert.ok(state.value.match.players.every(p=>p.balance===94&&p.inventory.length===6));
    await Promise.all(players.map(p=>call(p,'build',{ids:[],finish:true})));
    const room=await call(players[0],'state',{},'GET');assert.equal(room.value.match.phase,'results');assert.equal(room.value.match.results.length,6);
  }
});
