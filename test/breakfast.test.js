import test from 'node:test';
import assert from 'node:assert/strict';
import {BREAKFAST,scoreBreakfast} from '../src/breakfast.js';
import {LegacyMatch as Match} from '../src/engine.js';
const meal=(...names)=>names.map(name=>{const p=BREAKFAST.find(p=>p.name===name);assert.ok(p,name);return {...p,id:name};});
test('catalog has 16 basic and 16 extras with unique identities and hints',()=>{
 assert.equal(BREAKFAST.filter(x=>x.basic).length,16);assert.equal(BREAKFAST.filter(x=>!x.basic).length,16);
 assert.equal(new Set(BREAKFAST.map(x=>x.modelId)).size,32);assert.ok(BREAKFAST.every(x=>x.hint));
});
test('approved worked meals score 84 and random full meal scores 44',()=>{
 assert.equal(scoreBreakfast(meal('Simit','Beyaz peynir','Haşlanmış yumurta','Çay','Siyah zeytin','Domates')).points,84);
 assert.equal(scoreBreakfast(meal('Bazlama','Lor','Sade omlet','Süt','Bal','Tereyağı')).points,84);
 assert.equal(scoreBreakfast(meal('Simit','Kaşar','Haşlanmış yumurta','Süt')).points,44);
});
test('duplicate copies add no base, diversity or combination points',()=>{
 const selected=meal('Bazlama','Tereyağı','Bal');const score=scoreBreakfast(selected);
 assert.deepEqual(scoreBreakfast([...selected,{...selected[0],id:'second-copy'}]).points,score.points);
 assert.equal(scoreBreakfast([...selected,{...selected[0],id:'second-copy'}]).breakdown.duplicates,1);
 assert.equal(scoreBreakfast([]).points,0);
});
test('pair bonus caps at 24 and scoring ignores selection order',()=>{
 const selected=meal('Bazlama','Lor','Süt','Bal','Tereyağı','Kaymak','Ceviz','Kayısı reçeli');
 const a=scoreBreakfast(selected);assert.ok(a.breakdown.pairs.length>6);assert.equal(a.breakdown.pairPoints,24);
 assert.equal(scoreBreakfast([...selected].reverse()).points,a.points);
});
test('kahvalti engine uses actual catalog and returns score breakdown',()=>{
 const m=new Match([{id:'a',name:'A'},{id:'b',name:'B'}],{},0);
 assert.ok(m.products.every(x=>x.modelId&&x.hint));
 while(m.phase!=='build')m.tick(m.deadline);
 const now=m.deadline-1;
 for(const p of m.players)m.saveBuild(p.id,p.inventory.map(x=>x.id),true,now);
 assert.ok(m.results.every(r=>r.breakdown&&Number.isFinite(r.points)));
});
