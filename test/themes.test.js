import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {COMPUTER,createComputerKits,scoreComputer} from '../src/computer.js';
import {SOUP,scoreSoup} from '../src/soup.js';
import {computerStatus} from '../public/theme-rules.js';
import {Match,THEMES} from '../src/engine.js';
import {preparationHint,themeResultDetails,scoreChart} from '../public/ui.js';
const pc=(...ids)=>ids.map(id=>({...COMPUTER.find(p=>p.modelId===id)}));
const soup=(...ids)=>ids.map(id=>({...SOUP.find(p=>p.modelId===id)}));
const working=['cpu-a','board-a4','ram-4','disk-1','psu-1','case-1'];
test('computer catalogue and 1000 random pools each provide N disjoint viable systems',()=>{
 assert.equal(COMPUTER.filter(p=>p.basic).length,18);assert.equal(COMPUTER.filter(p=>!p.basic).length,12);
 for(let i=0;i<1000;i++){
  const count=2+i%5,kits=createComputerKits(count);assert.equal(kits.length,count);
  for(const kit of kits){assert.equal(kit.length,6);assert.equal(new Set(kit).size,6);assert.equal(computerStatus(pc(...kit)).complete,true);}
 }
});
test('working computer gains 15 core and 25 completeness; incompatible socket loses CPU and bonuses',()=>{
 const good=scoreComputer(pc(...working));assert.equal(good.points,81);assert.equal(good.breakdown.coreBonus,15);assert.equal(good.breakdown.completeness,25);
 const bad=scoreComputer(pc('cpu-b',...working.slice(1)));assert.equal(bad.complete,false);assert.equal(bad.breakdown.coreBonus,0);assert.equal(bad.breakdown.items[0].points,0);assert.match(bad.breakdown.items[0].reason,/soket/);assert.ok(bad.points>0);
});
test('memory, case size, power and cooling constraints are independently explained',()=>{
 assert.ok(computerStatus(pc('cpu-a','board-a4','ram-5','case-1','psu-1')).messages.some(x=>x.includes('RAM')));
 assert.ok(computerStatus(pc('cpu-b','board-b5','ram-5','case-1','psu-1')).messages.some(x=>x.includes('kasaya')));
 const weak=scoreComputer(pc(...working,'gpu-2'));assert.equal(weak.complete,false);assert.ok(weak.breakdown.messages.some(x=>x.includes('Güç yetersiz')));assert.equal(weak.breakdown.items.find(x=>x.name==='Görüntü 3').points,0);
 const cooled=scoreComputer(pc('cpu-a-fast','board-a5','ram-5-lite','disk-1','psu-2','case-1','cool-0'));assert.equal(cooled.complete,true);assert.equal(cooled.breakdown.items.at(-1).points,0);
});
test('soup fixed positive and negative relationships, duplicates and invalid structure',()=>{
 assert.equal(SOUP.length,24);
 const positive=scoreSoup(soup('lentil','carrot','water','cumin'));assert.equal(positive.points,55);assert.equal(positive.breakdown.triples.length,1);
 const negative=scoreSoup(soup('tomato','milk','lemon'));assert.equal(negative.points,4);assert.equal(negative.breakdown.pairPoints,-12);assert.equal(negative.breakdown.triplePoints,-8);
 assert.equal(scoreSoup(soup('lentil','carrot','water','cumin','cumin')).points,55);
 assert.equal(scoreSoup(soup('lentil','carrot','cumin')).points,0);assert.equal(scoreSoup(soup('water','milk')).points,0);
 const clamped=scoreSoup(soup('tomato','milk','lemon').map(p=>({...p,points:0})));assert.equal(clamped.breakdown.raw,-10);assert.equal(clamped.points,0);
 assert.deepEqual(scoreSoup(soup('cumin','water','carrot','lentil')),positive);
});
test('persisted previous-version matches keep their original scoring',()=>{
 const match=new Match([{id:'a',name:'A'},{id:'b',name:'B'}],{theme:'bilgisayar',budget:100,seconds:8},0);
 delete match.contentVersion;delete match.computerKits;
 match.phase='build';match.deadline=1000;
 for(const p of match.players)p.inventory=pc(...working).map((x,i)=>({...x,id:`${p.id}-${i}`}));
 for(const p of match.players)match.saveBuild(p.id,p.inventory.map(x=>x.id),true,0);
 assert.equal(match.results[0].points,56);assert.equal(match.results[0].breakdown,undefined);
});
test('new themes finish with 2 and 6 players; hidden scores and relationships are absent from all early snapshots',()=>{
 for(const theme of ['bilgisayar','corba'])for(const count of [2,6]){
  let now=0;const match=new Match(Array.from({length:count},(_,i)=>({id:String(i),name:`P${i}`})),{theme,budget:100,seconds:8},now);
  for(let round=0;round<THEMES[theme].groups.length;round++){
   const snap=JSON.stringify(match.snapshot('0'));assert.ok(!snap.includes('"points"'));assert.ok(!snap.includes('computerKits'));assert.ok(!snap.includes('"breakdown"'));
   for(const p of match.players)match.submitBasic(p.id,0,match.products.map(p=>p.id),now);
   now=match.deadline;match.tick(now);
  }
  while(match.phase==='extra'){now=match.deadline;match.tick(now);}
  for(const p of match.players)match.saveBuild(p.id,p.inventory.map(x=>x.id).slice(0,6),true,now);
  assert.equal(match.phase,'results');assert.equal(match.results.length,count);assert.ok(match.results.every(r=>r.breakdown.type===(theme==='bilgisayar'?'computer':'soup')));
 }
});
test('private soup tables are not in static assets; build hints reveal structure only',async()=>{
 for(const name of await readdir(new URL('../public/',import.meta.url)))if(name.endsWith('.js')){const source=await readFile(new URL('../public/'+name,import.meta.url),'utf8');assert.ok(!source.includes("['lentil','carrot','cumin',12]"));assert.ok(!source.includes("from '../src/soup"));}
 const hint=preparationHint('corba',soup('lentil','carrot','water','cumin'));assert.ok(!hint.includes('55'));assert.ok(!hint.includes('Kimyon'));assert.ok(hint.includes('sonuçta'));
 const negative=scoreSoup(soup('tomato','milk','lemon'));const result={name:'Test',...negative};assert.ok(!scoreChart(result).includes('NaN'));assert.ok(!scoreChart(result).includes('width:-'));assert.ok(themeResultDetails(result).includes('-8'));
});
