import test from 'node:test';
import assert from 'node:assert/strict';
import {Match} from '../src/engine.js';
import {matchProgress,resultSummary} from '../public/match-ui.js';
test('progress exposes totals without revealing upcoming products',()=>{
 const m=new Match([{id:'a',name:'A'},{id:'b',name:'B'}],{theme:'corba'});
 const snapshot=m.snapshot('a');
 assert.equal(snapshot.basicTotal,3);assert.equal(snapshot.extraTotal,4);
 assert.match(matchProgress(snapshot),/Tur 1\/3/);
 snapshot.phase='extra';snapshot.extraIndex=3;
 assert.match(matchProgress(snapshot),/Ürün 4\/4/);
 assert.match(matchProgress(snapshot),/0 ekstra kaldı/);
});
test('personal result uses money tie breaker and shared ranks',()=>{
 const results=[{id:'a',name:'<A>',points:20,remaining:10},{id:'b',name:'B',points:20,remaining:10},{id:'c',name:'C',points:20,remaining:5}];
 assert.match(resultSummary({results},'b'),/Birinciliği paylaştın/);
 assert.match(resultSummary({results},'c'),/3. sıra/);
 assert.match(resultSummary({results},'a'),/&lt;A&gt;/);
});
