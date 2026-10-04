import test from 'node:test';
import assert from 'node:assert/strict';
import {LegacyMatch as Match} from '../src/engine.js';
const players = [{id:'a',name:'A'},{id:'b',name:'B'},{id:'c',name:'C'}];
test('basic allocation pays each own bid and keeps wallets separate', () => {
  const m = new Match(players, {}, 0); m.priority = ['a','b','c']; const pref = m.products.map(p => p.id);
  m.submitBasic('a',20,pref,1); m.submitBasic('b',10,pref,1); m.tick(30000);
  assert.deepEqual(m.players.map(p=>p.basic),[80,90,100]); assert.ok(m.players.every(p=>p.extra===100 && p.inventory.length===1));
  assert.equal(new Set(m.players.map(p=>p.inventory[0].id)).size,3);
});
test('multiway ties rotate advantage and sealed data stays private', () => {
  const m = new Match(players,{},0); m.priority=['a','b','c'];
  m.submitBasic('a',0,m.products.map(p=>p.id),1);
  assert.equal(m.snapshot('b').ownBid,null); assert.equal('bids' in m.snapshot('b'),false);
  m.tick(30000); assert.deepEqual(m.priority,['c','a','b']);
});
test('deadline rejects late bids and invalid preferences', () => {
  const m = new Match(players,{},0); const pref=m.products.map(p=>p.id);
  assert.throws(()=>m.submitBasic('a',1,pref,30000));
  assert.throws(()=>m.submitBasic('a',101,pref,1));
  assert.throws(()=>m.submitBasic('a',1,[pref[0],pref[0],pref[0]],1));
});
test('extra extensions are 3,3,3,1; rejected bids do not extend', () => {
  const m = new Match(players,{},0); m.openExtra(0);
  m.bidExtra('a',1,1); m.bidExtra('b',2,2); m.bidExtra('a',3,3); m.bidExtra('c',4,4);
  assert.equal(m.deadline,40000); assert.throws(()=>m.bidExtra('c',5,5)); assert.equal(m.deadline,40000);
  m.tick(40000); assert.equal(m.player('c').extra,96); assert.equal(m.player('a').extra,100);
});
test('complete lifecycle remains finite and build cannot select unowned products', () => {
  const m = new Match(players,{},0);
  while (m.phase !== 'build') m.tick(m.deadline);
  assert.equal(m.history.length,10); assert.throws(()=>m.saveBuild('a',['fake'],false,m.deadline-1));
  for (const p of players) m.saveBuild(p.id,m.player(p.id).inventory.map(x=>x.id),true,m.deadline-1);
  assert.equal(m.phase,'results'); assert.equal(m.results.length,3);
});
