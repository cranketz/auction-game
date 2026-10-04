import {createHash,randomUUID} from 'node:crypto';

const names=['Mira','Atlas','Piko'];
const groups={kahvalti:['Ekmek','Peynir','Yumurta','İçecek'],bilgisayar:['İşlemci','Anakart','RAM','Depolama','Güç kaynağı','Kasa'],corba:['Sebze','Protein / bakliyat','Sıvı / taban']};
const normalize=value=>String(value??'').toLocaleLowerCase('tr-TR');
const noise=seed=>createHash('sha256').update(seed).digest().readUInt32BE(0)/0x100000000;
const delay=seed=>1800+Math.floor(noise(seed)*1800);

export function createBots(count){
 if(!Number.isInteger(count)||count<1||count>3)throw Error('Pratik için 1–3 bot seçin.');
 return names.slice(0,count).map(name=>({id:randomUUID(),name,bot:true,ready:true}));
}
// Explicit public-field boundary: no points, hidden bids, soup relations or future pools.
const publicProduct=p=>{
 const result={};for(const key of ['id','modelId','group','name','hint','basic','socket','memory','size','watts','capacity'])if(p[key]!==undefined)result[key]=p[key];return result;
};
export function botObservation(match,id){
 const p=match.player(id);
 return {theme:match.theme,phase:match.phase,round:match.round,basicTotal:groups[match.theme].length,extraIndex:match.extraIndex,
  products:match.products.map(publicProduct),inventory:p.inventory.map(publicProduct),basic:p.basic,extra:p.extra,price:match.price??0,leader:match.leader??null};
}
function fit(theme,p,inventory,seed){
 if(inventory.some(x=>x.modelId===p.modelId&&x.modelId))return -30;
 let value=5+noise(seed+':'+p.id);
 if(!inventory.some(x=>x.group===p.group))value+=2;
 if(theme==='kahvalti')for(const x of inventory){
  if(normalize(p.hint).includes(normalize(x.name))||normalize(x.hint).includes(normalize(p.name)))value+=4;
 }
 if(theme==='bilgisayar'){
  const part=g=>inventory.find(x=>x.group===g),cpu=part('İşlemci'),board=part('Anakart'),psu=part('Güç kaynağı'),gpu=part('Ekran kartı');
  if(p.group==='İşlemci')value+=(120-(p.watts??120))/40;
  if(p.group==='Anakart'&&cpu)value+=p.socket===cpu.socket?20:-50;
  if(p.group==='RAM'&&board)value+=p.memory===board.memory?20:-50;
  if(p.group==='Kasa'&&board)value+=p.size==='L'||board.size==='S'?12:-50;
  if(p.group==='Güç kaynağı')value+=(p.capacity??0)>=50+(cpu?.watts??0)+(gpu?.watts??0)?12:-50;
  if(p.group==='Ekran kartı'&&psu)value+=(psu.capacity??0)>=50+(cpu?.watts??0)+(p.watts??0)?5:-50;
  if(p.group==='Soğutma'&&cpu)value+=(p.capacity??0)>=(cpu.watts??0)?6:-30;
 }
 return value;
}
export function planBot(observation,seed){
 const o=observation,rank=items=>[...items].sort((a,b)=>fit(o.theme,b,o.inventory,seed)-fit(o.theme,a,o.inventory,seed));
 if(o.phase==='basic')return {amount:Math.min(o.basic,Math.floor(o.basic/(o.basicTotal-o.round)*(0.4+noise(seed)*0.3))),preference:rank(o.products).map(p=>p.id)};
 if(o.phase==='extra'){
  const value=fit(o.theme,o.products[0],o.inventory,seed);
  return {cap:value<0?0:Math.min(o.extra,Math.max(1,Math.floor(o.extra*(0.12+noise(seed)*0.14)+(value>10?4:0))))};
 }
 if(o.phase==='build'){
  const selected=[],seen=new Set(),add=p=>{if(p&&!seen.has(p.modelId??p.name)){selected.push(p);seen.add(p.modelId??p.name);}};
  // Public structure and compatibility only; never optimize against secret scores.
  for(const group of groups[o.theme])add(rank(o.inventory.filter(p=>p.group===group))[0]);
  const extra=rank(o.inventory.filter(p=>!groups[o.theme].includes(p.group))),limit={kahvalti:8,corba:6,bilgisayar:10}[o.theme];
  for(const p of extra){
   if(selected.length>=limit)break;
   if(o.theme==='bilgisayar'&&(selected.some(x=>x.group===p.group)||fit(o.theme,p,selected,seed)<0))continue;
   add(p);
  }
  return {ids:selected.map(p=>p.id)};
 }
 return {};
}
// Runs inside the room transaction, driven by the human's existing requests.
// Plans and due times survive process restarts and compare-and-set retries.
export function advanceBots(room,match,now){
 if(!room.practice||!match||match.phase==='results')return false;
 const key=`${match.phase}:${match.round}:${match.extraIndex}`,states=room.botState??={},bots=match.players.filter(p=>p.bot);
 let changed=false,extraAction=false;
 for(const bot of bots){
  let state=states[bot.id];const seed=bot.id+':'+key;
  if(state?.key!==key){state=states[bot.id]={key,nextAt:now+delay(seed),done:false,...planBot(botObservation(match,bot.id),seed)};changed=true;}
  if(state.done||now<state.nextAt)continue;
  if(match.phase==='extra'){
   if(extraAction||now>=match.deadline||match.leader===bot.id||match.price>=state.cap)continue;
   const amount=Math.min(state.cap,match.price+1+Math.floor(noise(seed+':'+match.price)*5));
   match.bidExtra(bot.id,amount,now);state.nextAt=now+delay(seed+':'+amount);changed=true;extraAction=true;
  }else{
   const actionAt=Math.min(now,match.deadline-1);
   if(match.phase==='basic')match.submitBasic(bot.id,state.amount,state.preference,actionAt);
   else if(match.phase==='build')match.saveBuild(bot.id,state.ids,true,actionAt);
   state.done=true;changed=true;
  }
 }
 room.botState=states;return changed;
}
