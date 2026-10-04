import {randomUUID,randomBytes,createHash} from 'node:crypto';
import {Match,THEMES} from './engine.js';
import {transact} from './store.js';
const roomFor=(data,id)=>Object.values(data.rooms).find(r=>r.players.some(p=>p.id===id));
export function restoreMatch(value){if(!value)return null;const match=Object.assign(Object.create(Match.prototype),value);match.finished=new Set(value.finished);return match;}
export function saveMatch(match){return match?{...match,finished:[...match.finished]}:null;}
function view(room,id,now){
  if(!room)return null;
  const players=room.players.map(({lastSeen,...p})=>({...p,online:now-(lastSeen??room.updatedAt)<30000}));
  const match=restoreMatch(room.match)?.snapshot(id);
  if(match)match.players=match.players.map(({lastSeen,...p})=>({...p,online:players.find(x=>x.id===p.id)?.online??false}));
  return {code:room.code,host:room.host,public:room.public,settings:room.settings,players,match};
}
function join(data,room,user,now){if(roomFor(data,user.id))throw Error('Önce mevcut odadan ayrılın.');if(room.players.length>=6||room.match)throw Error('Oda dolu veya maç başladı.');room.players.push({id:user.id,name:user.name,ready:false,lastSeen:now});}
export async function perform(store,{method,path,token,b={},ip='local',now=Date.now()}){
  return transact(store,data=>{
    let changed=false;
    for(const r of Object.values(data.rooms))for(const p of r.players)if(p.lastSeen===undefined){p.lastSeen=r.updatedAt??now;changed=true;}
    const user=Object.hasOwn(data.sessions,token)?data.sessions[token]:null;
    const activeUser=user&&user.expires>now;
    const currentRoom=activeUser?roomFor(data,user.id):null;
    const currentPlayer=currentRoom?.players.find(p=>p.id===user.id);
    if(currentPlayer&&now-currentRoom.updatedAt<=6*3600000&&now-(currentPlayer.lastSeen??0)>=10000){currentPlayer.lastSeen=now;currentRoom.updatedAt=now;changed=true;}
    for(const [code,r] of Object.entries(data.rooms)){
      if(now-(r.updatedAt??0)>6*3600000){delete data.rooms[code];changed=true;continue;}
      const match=restoreMatch(r.match);
      if(!match){
        const remaining=r.players.filter(p=>now-(p.lastSeen??r.updatedAt)<120000);
        if(remaining.length!==r.players.length){r.players=remaining;changed=true;}
        if(!remaining.length){delete data.rooms[code];changed=true;continue;}
        for(const p of remaining)if(now-(p.lastSeen??r.updatedAt)>=30000&&p.ready){p.ready=false;changed=true;}
      }
      const host=r.players.find(p=>p.id===r.host);
      if(!host||now-(host.lastSeen??r.updatedAt)>=45000){
        const successor=r.players.find(p=>now-(p.lastSeen??r.updatedAt)<30000);
        if(successor&&r.host!==successor.id){r.host=successor.id;changed=true;}
      }
      if(match?.deadline&&now>=match.deadline){match.tick(now);r.match=saveMatch(match);r.updatedAt=now;changed=true;}
    }
    if(method==='POST'&&path==='session'){
      const name=String(b.name??'').trim();if(name.length<2||name.length>20)throw Error('Ad 2–20 karakter olmalı.');
      const key=createHash('sha256').update(ip).digest('hex');data.rates??={};const rate=data.rates[key];
      if(rate&&now-rate.start<600000&&rate.count>=20)throw Error('Çok fazla giriş denemesi. Biraz bekleyin.');
      data.rates[key]=rate&&now-rate.start<600000?{...rate,count:rate.count+1}:{start:now,count:1};
      for(const [k,v] of Object.entries(data.rates))if(now-v.start>=600000)delete data.rates[k];
      for(const [k,u] of Object.entries(data.sessions))if(u.expires<=now)delete data.sessions[k];
      if(Object.keys(data.sessions).length>=1000)throw Error('Oyuncu kapasitesi dolu.');
      const token=randomBytes(24).toString('hex'),user={id:randomUUID(),name,expires:now+7*86400000};data.sessions[token]=user;
      return {changed:true,value:{id:user.id,name:user.name},token};
    }
    if(!activeUser)return {changed,status:401,value:{error:'Önce giriş yapın.'}};
    if(method==='GET'&&path==='rooms')return {changed,value:Object.values(data.rooms).filter(r=>r.public).map(r=>({code:r.code,count:r.players.length,settings:r.settings,started:!!r.match}))};
    if(method==='GET'&&path==='state')return {changed,value:view(roomFor(data,user.id),user.id,now)};
    if(method!=='POST')return {changed,status:404,value:{error:'Bulunamadı.'}};
    let room=roomFor(data,user.id);
    if(path==='create'){
      if(room)throw Error('Önce mevcut odadan ayrılın.');if(Object.keys(data.rooms).length>=5)throw Error('Test kapasitesi dolu.');
      if(!THEMES[b.theme]||![50,100,150].includes(b.budget)||![8,12,20].includes(b.seconds))throw Error('Geçersiz ayarlar.');
      const code=randomBytes(4).toString('hex').toUpperCase();room={code,host:user.id,public:b.public!==false,settings:{theme:b.theme,budget:b.budget,seconds:b.seconds},players:[],match:null,updatedAt:now};join(data,room,user,now);data.rooms[code]=room;
    }else if(path==='join'||path==='quick'){
      const code=String(b.code).toUpperCase();
      room=path==='join'?(Object.hasOwn(data.rooms,code)?data.rooms[code]:null):Object.values(data.rooms).find(r=>r.public&&!r.match&&r.players.length<6);
      if(!room)throw Error(path==='join'?'Oda bulunamadı.':'Uygun oda yok; yeni oda kurabilirsiniz.');join(data,room,user,now);
    }else{
      if(!room)throw Error('Odada değilsiniz.');const match=restoreMatch(room.match);
      if(path==='ready'){if(match)throw Error('Maç başladı.');room.players.find(p=>p.id===user.id).ready=!!b.ready;}
      else if(path==='start'){
        if(room.players.length<2)throw Error('Yeterli oyuncu yok. Maçı başlatmak için en az 2 oyuncu gerekli.');if(room.host!==user.id)throw Error('Maçı yalnızca oda sahibi başlatabilir.');if(match)throw Error('Maç zaten başladı.');if(!room.players.filter(p=>p.id!==room.host).every(p=>p.ready&&now-(p.lastSeen??room.updatedAt)<30000))throw Error('Diğer oyuncular hazır olmalı.');room.match=saveMatch(new Match(room.players,room.settings,now));
      }else if(['basic','bid','build'].includes(path)){
        if(!match)throw Error('Maç başlamadı.');if(path==='basic')match.submitBasic(user.id,b.amount,b.preference,now);if(path==='bid')match.bidExtra(user.id,b.amount,now);if(path==='build')match.saveBuild(user.id,b.ids,!!b.finish,now);room.match=saveMatch(match);
      }else if(path==='replay'){if(room.host!==user.id||match?.phase!=='results')throw Error('Yeniden maç açılamaz.');room.match=null;room.players.forEach(p=>p.ready=false);}
      else if(path==='leave'){
        if(match&&match.phase!=='results')throw Error('Devam eden maçtan çıkış kapalı; sekmeyi kapatıp geri dönebilirsiniz.');room.players=room.players.filter(p=>p.id!==user.id);if(room.host===user.id)room.host=room.players.find(p=>now-(p.lastSeen??room.updatedAt)<30000)?.id??room.players[0]?.id;if(!room.players.length)delete data.rooms[room.code];return {changed:true,value:{left:true}};
      }else return {changed,status:404,value:{error:'Bulunamadı.'}};
    }
    room.updatedAt=now;return {changed:true,value:view(room,user.id,now)};
  });
}
