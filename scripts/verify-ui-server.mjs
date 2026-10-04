// Local UI review fixtures. This script is never imported by production routes.
import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {randomUUID} from 'node:crypto';
import {handleApi} from '../src/handler.js';
import {getStore,MemoryStore,transact} from '../src/store.js';
import {Match,THEMES} from '../src/engine.js';
import {saveMatch} from '../src/service.js';
if(process.env.DATABASE_URL||process.env.VERCEL)throw Error('Fixtures require an isolated local memory server.');
const store=getStore();if(!(store instanceof MemoryStore))throw Error('Memory store required.');
const assets=new Set(['index.html','app.js','ui.js','catalog.js','match-ui.js','network-policy.js','interactions.js','style.css','theme-rules.js']);
let fault=null;
const server=http.createServer(async(req,res)=>{
 try{
  const url=new URL(req.url,'http://localhost');
  if(req.method==='POST'&&url.pathname==='/__ui_fault'){
   let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>1000)throw Error('Oversize fault');}
   const input=JSON.parse(raw);if(input.route&&!/^\/api\/(state|rooms|catalog|basic|bid|build)$/.test(input.route))throw Error('Invalid fault route');
   fault=input.route?{route:input.route,delay:Math.min(2000,Math.max(0,Number(input.delay)||0)),fail:!!input.fail}:null;res.end('Fault configured');return;
  }
  const requestFault=fault?.route===url.pathname?fault:null;
  if(requestFault){
   if(requestFault.delay)await new Promise(resolve=>setTimeout(resolve,requestFault.delay));
   if(requestFault.fail){res.writeHead(503,{'Content-Type':'application/json'});res.end(JSON.stringify({error:'Sunucuya geçici olarak ulaşılamıyor. Tekrar deneyin.'}));return;}
  }
  if(req.method==='POST'&&url.pathname==='/__ui_fixture'){
   let raw='';for await(const chunk of req){raw+=chunk;if(raw.length>1000)throw Error('Oversize fixture');}
   const {theme='kahvalti',phase='basic',count=6,tie=false}=JSON.parse(raw);
   if(!THEMES[theme]||!['lobby','basic','extra','build','results'].includes(phase)||![2,6].includes(count))throw Error('Invalid fixture');
   await transact(store,data=>{
    const user=Object.values(data.sessions)[0];if(!user)throw Error('Log in via browser first.');
    const now=Date.now(),players=[{id:user.id,name:user.name,ready:true,lastSeen:now},...Array.from({length:count-1},(_,i)=>({id:randomUUID(),name:i===0?'Uzun Adlı Test Oyuncusu':`Oyuncu ${i+2}`,ready:true,lastSeen:now}))];
    const settings={theme,budget:100,seconds:20},room={code:'UITEST01',host:user.id,public:true,players,settings,updatedAt:now,match:null};
    if(phase!=='lobby'){
     const match=new Match(players,settings,now);
     if(['extra','build','results'].includes(phase))while(match.phase==='basic')match.resolveBasic(now);
     if(['build','results'].includes(phase)){
      while(match.phase==='extra'){match.bidExtra(user.id,1,now);match.resolveExtra(now);}
     }
     if(phase==='results'){
      for(const p of match.players){const selected=theme==='bilgisayar'?[...new Map(p.inventory.map(x=>[x.group,x])).values()]:p.inventory.slice(0,theme==='corba'?6:8);match.builds[p.id]=tie?[]:selected.map(p=>p.id);}
      match.resolveBuild();
     }else match.deadline=now+600000;
     room.match=saveMatch(match);
    }
    data.rooms={UITEST01:room};return {changed:true};
   });res.end('Fixture ready');return;
  }
  if(url.pathname.startsWith('/api/'))return handleApi(req,res);
  const file=url.pathname==='/'?'index.html':url.pathname.slice(1);
  if(req.method==='GET'&&assets.has(file)){res.setHeader('Content-Type',file.endsWith('.js')?'text/javascript':file.endsWith('.css')?'text/css':'text/html; charset=utf-8');res.end(await readFile(new URL('../public/'+file,import.meta.url)));return;}
  res.writeHead(404);res.end('Not found');
 }catch(error){res.writeHead(400);res.end(error.message);}
});
server.listen(Number(process.env.PORT??3122),'127.0.0.1',()=>console.log('Isolated UI review: http://127.0.0.1:'+(process.env.PORT??3122)));
