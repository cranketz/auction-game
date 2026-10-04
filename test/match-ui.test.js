import test from 'node:test';
import assert from 'node:assert/strict';
import {Match} from '../src/engine.js';
import {matchProgress,resultSummary} from '../public/match-ui.js';
test('progress exposes totals without revealing upcoming products',()=>{
 const m=new Match([{id:'a',name:'A'},{id:'b',name:'B'}],{theme:'corba'});
 const snapshot=m.snapshot('a');
 assert.equal(snapshot.auctionTotal,10);assert.equal(snapshot.auctionQueue,undefined);
 assert.match(matchProgress(snapshot),/Ürün 1\/10/);
 snapshot.auctionIndex=9;
 assert.match(matchProgress(snapshot),/Ürün 10\/10/);
 assert.match(matchProgress(snapshot),/0 ürün kaldı/);
});
test('personal result uses money tie breaker and shared ranks',()=>{
 const results=[{id:'a',name:'<A>',points:20,remaining:10},{id:'b',name:'B',points:20,remaining:10},{id:'c',name:'C',points:20,remaining:5}];
 assert.match(resultSummary({results},'b'),/Birinciliği paylaştın/);
 assert.match(resultSummary({results},'c'),/3. sıra/);
 assert.match(resultSummary({results},'a'),/&lt;A&gt;/);
 assert.match(resultSummary({results},'c'),/sıralamayı kalan para belirledi/);
 assert.ok(!resultSummary({results},'a',false).includes('winner-list'));
});
