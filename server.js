import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {randomUUID, randomBytes} from 'node:crypto';
import {Match, THEMES} from './src/engine.js';
const sessions=new Map(), rooms=new Map(), streams=new Map();
const send=(res,status,value)=>{res.writeHead(status,{'Content-Type':'application/json; charset=utf-8'});res.end(JSON.stringify(value));};
function state(room,id) { return {code:room.code, host:room.host, public:room.public, settings:room.settings, players:room.players, match:room.match?.snapshot(id)}; }
function publish(room) { for(const p of room.players) for(const res of streams.get(p.id)??[]) res.write(`data: ${JSON.stringify(state(room,p.id))}\n\n`); }
function findRoom(id) { return [...rooms.values()].find(r=>r.players.some(p=>p.id===id)); }
function join(room,user) { if(findRoom(user.id)) throw Error('Önce mevcut odadan ayrılın.'); if(room.players.length>=6 || room.match) throw Error('Oda dolu veya maç başladı.'); room.players.push({...user,ready:false}); publish(room); return state(room,user.id); }
async function body(req) {let data='';for await(const chunk of req){data+=chunk;if(data.length>20000)throw Error('İstek çok büyük.');}return JSON.parse(data||'{}');}
const server=http.createServer(async(req,res)=>{
  try {
    const url=new URL(req.url,'http://localhost');
    if(req.method==='GET' && ['/', '/app.js','/style.css'].includes(url.pathname)) {
      const path=url.pathname==='/'?'index.html':url.pathname.slice(1);
      res.writeHead(200,{'Content-Type':path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':'text/html; charset=utf-8'});res.end(await readFile(new URL(`./public/${path}`,import.meta.url)));return;
    }
    if(req.method==='POST' && url.pathname==='/api/session') {
      const b=await body(req);const name=String(b.name??'').trim();if(name.length<2||name.length>20)throw Error('Ad 2–20 karakter olmalı.');
      const token=randomBytes(24).toString('hex'), user={id:randomUUID(),name};sessions.set(token,user);return send(res,200,{token,...user});
    }
    const token=(req.headers.cookie??'').split(';').map(x=>x.trim()).find(x=>x.startsWith('auction='))?.slice(8);
    const user=sessions.get(token);if(!user)return send(res,401,{error:'Önce giriş yapın.'});
    if(req.method==='GET' && url.pathname==='/api/rooms')return send(res,200,[...rooms.values()].filter(r=>r.public).map(r=>({code:r.code,count:r.players.length,settings:r.settings,started:!!r.match})));
    if(req.method==='GET' && url.pathname==='/api/events') {
      res.writeHead(200,{'Content-Type':'text/event-stream','Cache-Control':'no-cache','Connection':'keep-alive'});res.write(': connected\n\n');
      const set=streams.get(user.id)??new Set();set.add(res);streams.set(user.id,set);const room=findRoom(user.id);if(room)res.write(`data: ${JSON.stringify(state(room,user.id))}\n\n`);
      req.on('close',()=>{set.delete(res);if(!set.size)streams.delete(user.id);});return;
    }
    if(req.method!=='POST')return send(res,404,{error:'Bulunamadı.'});
    const b=await body(req);let room=findRoom(user.id);
    if(url.pathname==='/api/create') {
      if(rooms.size>=5)throw Error('Test kapasitesi dolu.');
      if(!THEMES[b.theme]||![50,100,150].includes(b.budget)||![8,12,20].includes(b.seconds))throw Error('Geçersiz ayarlar.');
      const code=randomBytes(4).toString('hex').toUpperCase();room={code,host:user.id,public:b.public!==false,settings:{theme:b.theme,budget:b.budget,seconds:b.seconds},players:[],match:null};
      const result=join(room,user);rooms.set(code,room);return send(res,200,result);
    }
    if(url.pathname==='/api/join') {room=rooms.get(String(b.code).toUpperCase());if(!room)throw Error('Oda bulunamadı.');return send(res,200,join(room,user));}
    if(url.pathname==='/api/quick') {room=[...rooms.values()].find(r=>r.public&&!r.match&&r.players.length<6);if(!room)throw Error('Uygun oda yok; yeni oda kurabilirsiniz.');return send(res,200,join(room,user));}
    if(!room)throw Error('Odada değilsiniz.');
    if(url.pathname==='/api/ready') {if(room.match)throw Error('Maç başladı.');room.players.find(p=>p.id===user.id).ready=!!b.ready;}
    else if(url.pathname==='/api/start') {if(room.players.length<2)throw Error('Yeterli oyuncu yok. Maçı başlatmak için en az 2 oyuncu gerekli.');if(room.host!==user.id)throw Error('Maçı yalnızca oda sahibi başlatabilir.');if(room.match)throw Error('Maç zaten başladı.');if(!room.players.filter(p=>p.id!==room.host).every(p=>p.ready))throw Error('Maçı başlatmak için diğer oyuncular hazır olmalı.');room.match=new Match(room.players,room.settings);}
    else if(url.pathname==='/api/basic')room.match.submitBasic(user.id,b.amount,b.preference);
    else if(url.pathname==='/api/bid')room.match.bidExtra(user.id,b.amount);
    else if(url.pathname==='/api/build')room.match.saveBuild(user.id,b.ids,!!b.finish);
    else if(url.pathname==='/api/replay') {if(room.host!==user.id||room.match?.phase!=='results')throw Error('Yeniden maç açılamaz.');room.match=null;room.players.forEach(p=>p.ready=false);}
    else if(url.pathname==='/api/leave') {if(room.match&&room.match.phase!=='results')throw Error('Bu prototipte devam eden maçtan çıkış kapalı; sekmeyi kapatıp geri dönebilirsiniz.');room.players=room.players.filter(p=>p.id!==user.id);if(room.host===user.id)room.host=room.players[0]?.id;if(!room.players.length)rooms.delete(room.code);return send(res,200,{left:true});}
    else return send(res,404,{error:'Bulunamadı.'});
    publish(room);send(res,200,state(room,user.id));
  } catch(error){send(res,400,{error:error.message});}
});
setInterval(()=>{for(const room of rooms.values())if(room.match){const before=room.match.phase+':'+room.match.round+':'+room.match.extraIndex;room.match.tick();if(before!==room.match.phase+':'+room.match.round+':'+room.match.extraIndex)publish(room);}},100);
server.listen(Number(process.env.PORT??3000),'127.0.0.1',()=>console.log('Auction Game: http://127.0.0.1:3000'));
