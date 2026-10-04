import test from 'node:test';
import assert from 'node:assert/strict';
import {productArt,buildBoard,scoreChart} from '../public/ui.js';
import {BREAKFAST} from '../src/breakfast.js';
import {COMPUTER} from '../src/computer.js';
import {SOUP} from '../src/soup.js';
test('every breakfast model has a local illustration and escaped label',()=>{
 for(const p of BREAKFAST){assert.match(productArt(p),/^<svg/);assert.ok(!productArt(p).includes('http'));}
 assert.ok(productArt({name:'<script>',group:'Kasa'}).includes('&lt;script&gt;'));
});
test('build boards only place selected inventory with accessible removal',()=>{
 const inventory=[{id:'1',name:'Simit',group:'Ekmek',modelId:'bread-simit'},{id:'2',name:'Çay',group:'İçecek'}];
 const board=buildBoard('kahvalti',inventory,['1'],false);
 assert.ok(board.includes('Simit seçimini kaldır'));assert.ok(!board.includes('Çay seçimini kaldır'));
 const computer=buildBoard('bilgisayar',[],[],false);assert.match(computer,/Anakart/);assert.match(computer,/Parça seç/);
 assert.match(buildBoard('corba',[],[],true),/Çorba kazanın/);
});
test('empty result chart produces finite widths and readable values',()=>{
 const chart=scoreChart({name:'A',points:0});assert.ok(!chart.includes('NaN'));assert.match(chart,/width:0%/);
});
test('all themes have local illustrations; computer groups differ beyond their labels',()=>{
 for(const p of [...BREAKFAST,...COMPUTER,...SOUP]){
  const svg=productArt(p);assert.match(svg,/^<svg/);assert.ok(!/NaN|undefined|https?:/.test(svg));
 }
 const drawings=[...new Set(COMPUTER.map(p=>p.group))].map(group=>productArt({group,modelId:'same',name:'same'}).replace(/<text[\s\S]*?<\/text>/g,''));
 assert.equal(new Set(drawings).size,10);
});
test('locked board cards never invite changes and retain a stable focus location',()=>{
 const html=buildBoard('corba',[{id:'a',name:'Havuç',group:'Sebze'}],['a'],true);
 assert.match(html,/data-location="board"/);assert.match(html,/Seçimin kilitlendi/);assert.ok(!html.includes('Çıkarmak için dokun'));
});
