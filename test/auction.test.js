import test from 'node:test';
import assert from 'node:assert/strict';
import {Match,THEMES} from '../src/engine.js';
import {perform,restoreMatch,saveMatch} from '../src/service.js';
import {MemoryStore} from '../src/store.js';
const players=[{id:'a',name:'A'},{id:'b',name:'B'},{id:'c',name:'C'}];

test('every theme offers all product types in one randomized auction queue with one wallet',()=>{
 for(const theme of Object.keys(THEMES))for(const count of [2,6]){
  const m=new Match(Array.from({length:count},(_,i)=>({id:String(i),name:'P'+i})),{theme,budget:50},0);
  assert.equal(m.phase,'auction');assert.equal(m.products.length,1);assert.equal(m.deadline,90000);
  assert.equal(m.auctionTotal,count*(THEMES[theme].groups.length+2));
  assert.ok(m.players.every(p=>p.balance===50&&!('basic' in p)&&!('extra' in p)));
  assert.equal(m.auctionQueue.filter(p=>p.basic).length,count*THEMES[theme].groups.length);
  assert.equal(m.auctionQueue.filter(p=>!p.basic).length,count*2);
  assert.equal(new Set(m.auctionQueue.map(p=>p.id)).size,m.auctionTotal);
  const snap=JSON.stringify(m.snapshot('0'));for(const secret of ['auctionQueue','computerKits','"points"','priority','"bids"'])assert.ok(!snap.includes(secret));
 }
});
test('one-click raises use the latest price, custom offers validate, and rejected actions never extend time',()=>{
 const m=new Match(players,{},0),productId=m.products[0].id;
 m.bidAuction('a',{productId,increment:true},1);assert.equal(m.price,1);
 m.bidAuction('b',{productId,increment:true},2);assert.equal(m.price,2);
 m.bidAuction('a',{productId,amount:15},3);m.bidAuction('c',{productId,increment:true},4);
 assert.equal(m.price,16);assert.equal(m.deadline,100000);
 for(const request of [{productId,amount:16},{productId,amount:101},{productId,amount:16.5},{productId:'stale',increment:true}])assert.throws(()=>m.bidAuction('b',request,5));
 assert.throws(()=>m.bidAuction('c',{productId,increment:true},5));assert.equal(m.deadline,100000);
 assert.ok(m.players.every(p=>p.balance===100));
});
test('all players including the leader pass; winner pays once and the next lot starts immediately',()=>{
 let m=new Match(players,{},0),productId=m.products[0].id;
 m.bidAuction('a',{productId,amount:12},1);m.passAuction('a',productId,2);
 m=restoreMatch(saveMatch(m));assert.deepEqual(m.passed,['a']);
 assert.throws(()=>m.bidAuction('a',{productId,increment:true},3));
 m.bidAuction('b',{productId,amount:13},3);m.passAuction('c',productId,4);
 assert.equal(m.auctionIndex,0);m.passAuction('b',productId,5);
 assert.equal(m.auctionIndex,1);assert.equal(m.deadline,90005);assert.deepEqual(m.passed,[]);
 assert.equal(m.player('a').balance,100);assert.equal(m.player('b').balance,87);
 assert.equal(m.player('b').inventory[0].id,productId);assert.equal(m.history.length,1);
 assert.throws(()=>m.passAuction('b',productId,6));assert.throws(()=>m.bidAuction('c',{productId,increment:true},6));
 assert.equal(m.history.length,1);
});
test('all-pass without bids skips unsold, and timeout awards the last bid without any pass requirement',()=>{
 const m=new Match(players,{},0),first=m.products[0].id;
 for(const p of players)m.passAuction(p.id,first,1);
 assert.equal(m.history[0].playerId,null);assert.ok(m.players.every(p=>p.inventory.length===0&&p.balance===100));
 const second=m.products[0].id;m.bidAuction('c',{productId:second,amount:100},2);
 assert.throws(()=>m.bidAuction('a',{productId:second,amount:101},3));
 assert.throws(()=>m.passAuction('a',second,m.deadline));m.tick(m.deadline);
 assert.equal(m.player('c').balance,0);assert.equal(m.player('c').inventory[0].id,second);
 assert.equal(m.history.length,2);m.passAuction('c',m.products[0].id,m.deadline-1);
});

async function roomSetup(){
 const store=new MemoryStore(),users=[];
 for(let i=0;i<3;i++)users.push(await perform(store,{method:'POST',path:'session',b:{name:'Oyuncu '+i},now:0,ip:String(i)}));
 const call=(i,path,b={})=>perform(store,{method:'POST',path,b,token:users[i].token,now:1});
 const created=await call(0,'create',{theme:'kahvalti',budget:100});
 for(let i=1;i<3;i++){await call(i,'join',{code:created.value.code});await call(i,'ready',{ready:true});}
 const started=await call(0,'start');return {store,users,call,productId:started.value.match.products[0].id};
}
test('simultaneous +1 offers serialize against the server price, and concurrent passes allocate once',async()=>{
 const {store,users,call,productId}=await roomSetup();
 await Promise.all([call(0,'bid',{productId,increment:true}),call(1,'bid',{productId,increment:true})]);
 let m=restoreMatch(Object.values((await store.read()).data.rooms)[0].match);assert.equal(m.price,2);assert.equal(m.bidCount,2);
 const winner=m.leader;
 await Promise.all(users.map((_,i)=>call(i,'pass',{productId})));
 m=restoreMatch(Object.values((await store.read()).data.rooms)[0].match);
 assert.equal(m.auctionIndex,1);assert.equal(m.history.length,1);assert.equal(m.player(winner).balance,98);
 assert.equal(m.players.reduce((sum,p)=>sum+p.inventory.length,0),1);
 await assert.rejects(call(0,'pass',{productId}),/Ürün değişti/);
 await assert.rejects(call(0,'bid',{productId,increment:true}),/Ürün değişti/);
});
test('duplicate passes and bids from passed players are rejected before early settlement',async()=>{
 const {call,productId}=await roomSetup();await call(0,'pass',{productId});
 await assert.rejects(call(0,'pass',{productId}),/zaten pas/);
 await assert.rejects(call(0,'bid',{productId,increment:true}),/pas geçtiniz/);
 await assert.rejects(call(1,'basic',{amount:0,preference:[productId]}),/kaldırıldı/);
});
test('full auction lifecycle uses remaining single-wallet money in final ranking',()=>{
 const m=new Match(players.slice(0,2),{theme:'corba',budget:50},0);let now=1;
 while(m.phase==='auction'){
  const productId=m.products[0].id;m.bidAuction('a',{productId,increment:true},now);
  for(const p of m.players)m.passAuction(p.id,productId,now);now++;
 }
 assert.equal(m.phase,'build');assert.equal(m.player('a').balance,40);
 m.saveBuild('a',m.player('a').inventory.slice(0,6).map(p=>p.id),true,now);
 m.saveBuild('b',[],true,now);assert.equal(m.phase,'results');
 assert.equal(m.results.find(p=>p.id==='a').remaining,40);assert.equal(m.results.find(p=>p.id==='b').remaining,50);
 assert.ok(m.results.every(p=>Number.isFinite(p.points)&&p.breakdown.type==='soup'));
});
