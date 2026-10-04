import test from 'node:test';
import assert from 'node:assert/strict';
import {nextSelection,validAmount,bidChanged,resultRank} from '../public/interactions.js';
test('selection limits prevent excess and allow removal or same-slot replacement',()=>{
 const inventory=Array.from({length:11},(_,i)=>({id:String(i),group:i<2?'İşlemci':String(i)}));
 assert.throws(()=>nextSelection('corba',inventory,['0','1','2','3','4','5'],'6'),/6 ürün/);
 assert.deepEqual(nextSelection('corba',inventory,['0','1'],'0'),['1']);
 assert.deepEqual(nextSelection('bilgisayar',inventory,['0','2'],'1'),['2','1']);
 assert.throws(()=>nextSelection('kahvalti',inventory,[],'unknown'),/envanter/);
});
test('custom amounts reject blank, fractional, out of budget and below minimum',()=>{
 for(const value of ['', ' ', '1.5','-1','101','NaN'])assert.equal(validAmount(value,100),false);
 assert.equal(validAmount('0',0),true);
 assert.equal(validAmount('10',100,11),false);
 assert.equal(validAmount('11',100,11),true);
});
test('saved bids become dirty when order or amount changes',()=>{
 const bid={amount:0,preference:['a','b']};
 assert.equal(bidChanged(bid,'0',['a','b']),false);
 assert.equal(bidChanged(bid,'',['a','b']),true);
 assert.equal(bidChanged(bid,' ',['a','b']),true);
 assert.equal(bidChanged(bid,'1',['a','b']),true);
 assert.equal(bidChanged(bid,'0',['b','a']),true);
});
test('visible ranking matches money tie breaker and shared place',()=>{
 const rows=[{points:10,remaining:5},{points:10,remaining:5},{points:10,remaining:0}];
 assert.equal(resultRank(rows,rows[1]),1);assert.equal(resultRank(rows,rows[2]),3);
});
