import { randomInt, randomUUID } from 'node:crypto';
import { BREAKFAST, scoreBreakfast } from './breakfast.js';
import {COMPUTER,createComputerKits,scoreComputer} from './computer.js';
import {SOUP,scoreSoup} from './soup.js';

export const THEMES = {
  kahvalti: { name: 'Kahvaltı', groups: ['Ekmek', 'Peynir', 'Yumurta', 'İçecek'], extras: ['Zeytin', 'Domates', 'Bal', 'Reçel'] },
  bilgisayar: { name: 'Bilgisayar', groups: ['İşlemci', 'Anakart', 'RAM', 'Depolama', 'Güç kaynağı', 'Kasa'], extras: ['Ekran kartı', 'Monitör', 'Klavye', 'Soğutma'] },
  corba: { name: 'Çorba', groups: ['Sebze', 'Protein / bakliyat', 'Sıvı / taban'], extras: ['Yağ', 'Baharat', 'Kıvam', 'Garnitür'] }
};
function requireRule(condition, message) { if (!condition) throw new Error(message); }
export const OFFER_SECONDS = [20, 30, 45];
export class Match {
  constructor(players, { theme = 'kahvalti', budget = 100, seconds = 30 } = {}, now = Date.now()) {
    requireRule(players.length >= 2 && players.length <= 6, '2–6 oyuncu gerekli.');
    requireRule(new Set(players.map(p => p.id)).size === players.length, 'Oyuncu kimlikleri farklı olmalı.');
    // Existing lobbies may still contain the previous 8/12-second choices.
    requireRule(THEMES[theme] && [50,100,150].includes(budget) && [...OFFER_SECONDS,8,12].includes(seconds), 'Geçersiz maç ayarı.');
    this.buildSeconds = 90;
    this.contentVersion=2;this.computerKits=theme==='bilgisayar'?createComputerKits(players.length):null;
    this.theme = theme; this.seconds = seconds; this.players = players.map(p => ({...p, basic: budget, extra: budget, inventory: []}));
    this.priority = players.map(p => p.id);
    for (let i = this.priority.length - 1; i > 0; i--) { const j = randomInt(i + 1); [this.priority[i], this.priority[j]] = [this.priority[j], this.priority[i]]; }
    this.round = 0; this.extraIndex = 0; this.builds = {}; this.finished = new Set(); this.history = [];
    this.openBasic(now);
  }
  player(id) { const p = this.players.find(p => p.id === id); requireRule(p, 'Oyuncu bulunamadı.'); return p; }
  product(group, index) {
    if (this.theme === 'kahvalti') {
      const pool = BREAKFAST.filter(x => x.group === group);
      return {id:randomUUID(), ...pool[randomInt(pool.length)]};
    }
    if(this.contentVersion===2){const pool=(this.theme==='bilgisayar'?COMPUTER:SOUP).filter(p=>p.group===group);return {id:randomUUID(),...pool[randomInt(pool.length)]};}
    return { id: randomUUID(), group, name: `${group} • ${['Klasik', 'Özel', 'Seçkin'][index % 3]}`, points: 5 + (index % 3) * 3 };
  }
  openBasic(now) {
    this.phase = 'basic'; this.deadline = now + this.seconds * 1000; this.bids = {};
    const group = THEMES[this.theme].groups[this.round];
    this.products = this.players.map((_, i) => this.theme==='bilgisayar'&&this.computerKits?{id:randomUUID(),...COMPUTER.find(p=>p.modelId===this.computerKits[i][this.round])}:this.product(group, randomInt(3)));
  }
  submitBasic(id, amount, preference, now = Date.now()) {
    requireRule(this.phase === 'basic' && now < this.deadline, 'Gizli teklif kapandı.');
    const p = this.player(id); requireRule(Number.isInteger(amount) && amount >= 0 && amount <= p.basic, 'Geçersiz temel teklif.');
    requireRule(Array.isArray(preference) && preference.length === this.products.length && new Set(preference).size === preference.length && preference.every(x => this.products.some(p => p.id === x)), 'Tüm ürünleri bir kez sıralayın.');
    this.bids[id] = { amount, preference: [...preference] };
  }
  resolveBasic(now) {
    const bids = this.players.map(p => ({id: p.id, ...(this.bids[p.id] ?? {amount: 0, preference: this.products.map(x => x.id)})}));
    bids.sort((a,b) => b.amount-a.amount || this.priority.indexOf(a.id)-this.priority.indexOf(b.id));
    const available = new Map(this.products.map(p => [p.id,p])); const advantaged = [];
    const allocation = bids.map((bid,i) => {
      const product = available.get(bid.preference.find(id => available.has(id))); available.delete(product.id);
      const p = this.player(bid.id); p.basic -= bid.amount; p.inventory.push(product);
      if (bids.slice(i+1).some(b => b.amount === bid.amount)) advantaged.push(bid.id);
      return {playerId: bid.id, amount: bid.amount, product};
    });
    this.priority = [...this.priority.filter(id => !advantaged.includes(id)), ...advantaged];
    this.history.push({type:'basic', allocation}); this.round++;
    if (this.round < THEMES[this.theme].groups.length) this.openBasic(now); else this.openExtra(now);
  }
  openExtra(now) {
    this.phase = 'extra'; this.deadline = now + this.seconds * 1000; this.price = 0; this.leader = null; this.bidCount = 0;
    const groups = THEMES[this.theme].extras;
    if(this.theme === 'kahvalti') {
      const extras = BREAKFAST.filter(x=>!x.basic);
      this.products = [{id:randomUUID(), ...extras[randomInt(extras.length)]}];
    } else this.products = [this.product(groups[randomInt(groups.length)], randomInt(3))];
  }
  bidExtra(id, amount, now = Date.now()) {
    requireRule(this.phase === 'extra' && now < this.deadline, 'Açık artırma kapandı.');
    const p = this.player(id); requireRule(id !== this.leader, 'Zaten en yüksek teklif sizde.');
    requireRule(Number.isInteger(amount) && amount > this.price && amount <= p.extra, 'Teklif fiyatı aşmalı ve bütçeye sığmalı.');
    this.price = amount; this.leader = id; this.bidCount++; this.deadline += this.bidCount <= 3 ? 3000 : 1000;
  }
  resolveExtra(now) {
    if (this.leader) { const p = this.player(this.leader); p.extra -= this.price; p.inventory.push(this.products[0]); }
    this.history.push({type:'extra', playerId:this.leader, amount:this.price, product:this.products[0]});
    this.extraIndex++;
    if (this.extraIndex < this.players.length * 2) this.openExtra(now);
    else { this.phase = 'build'; this.deadline = now + (this.buildSeconds ?? 60) * 1000; this.products = []; }
  }
  saveBuild(id, ids, finish = false, now = Date.now()) {
    requireRule(this.phase === 'build' && now < this.deadline && !this.finished.has(id), 'Hazırlama kapandı.');
    const p = this.player(id); const max = this.theme === 'kahvalti' ? 8 : this.theme === 'corba' ? 6 : 10;
    requireRule(Array.isArray(ids) && ids.length <= max && new Set(ids).size === ids.length && ids.every(id => p.inventory.some(x => x.id === id)), 'Geçersiz ürün seçimi.');
    const selected = ids.map(id => p.inventory.find(x => x.id === id));
    if (this.theme === 'bilgisayar') requireRule(new Set(selected.map(x => x.group)).size === selected.length, 'Her yuvaya bir ürün seçin.');
    this.builds[id] = [...ids]; if (finish) this.finished.add(id);
    if (this.finished.size === this.players.length) this.resolveBuild();
  }
  resolveBuild() {
    // Older persisted matches retain their scoring; new matches use version 2 content.
    this.results = this.players.map(p => {
      const selected = p.inventory.filter(x => (this.builds[p.id] ?? []).includes(x.id));
      if(this.theme === 'kahvalti') return {id:p.id,name:p.name,remaining:p.basic+p.extra,selected,...scoreBreakfast(selected)};
      if(this.contentVersion===2){const score=this.theme==='bilgisayar'?scoreComputer(selected):scoreSoup(selected);return {id:p.id,name:p.name,remaining:p.basic+p.extra,selected,...score};}
      const unique = [...new Map(selected.map(x => [x.name,x])).values()];
      let points = unique.reduce((sum,x) => sum+x.points,0);
      const groups = new Set(selected.map(x => x.group));
      const complete = THEMES[this.theme].groups.every(g => groups.has(g));
      if (complete) points += 15;
      if (this.theme === 'corba' && !(groups.has('Sıvı / taban') && (groups.has('Sebze') || groups.has('Protein / bakliyat')))) points = 0;
      return {id:p.id, name:p.name, points, remaining:p.basic+p.extra, selected, complete};
    }).sort((a,b) => b.points-a.points || b.remaining-a.remaining);
    this.phase = 'results'; this.deadline = null;
  }
  tick(now = Date.now()) {
    if (!this.deadline || now < this.deadline) return;
    if (this.phase === 'basic') this.resolveBasic(now);
    else if (this.phase === 'extra') this.resolveExtra(now);
    else if (this.phase === 'build') this.resolveBuild();
  }
  snapshot(viewerId) {
    const visible=value=>this.phase==='results'?value:JSON.parse(JSON.stringify(value,(key,v)=>key==='points'?undefined:v));
    return {theme:this.theme,rulesVersion:this.contentVersion??1, basicTotal:THEMES[this.theme].groups.length, extraTotal:this.players.length*2, phase:this.phase, deadline:this.deadline, serverNow:Date.now(), round:this.round, extraIndex:this.extraIndex, products:visible(this.products),
      players:visible(this.players), priority:this.priority, history:visible(this.history), price:this.price, leader:this.leader,
      ownBid:this.phase === 'basic' ? this.bids[viewerId] ?? null : null, ownBuild:this.builds[viewerId] ?? [], finished:[...this.finished], results:this.results};
  }
}
