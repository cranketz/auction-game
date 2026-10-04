import {getStore} from './store.js';
import {perform} from './service.js';
import {catalog} from './catalog.js';
export async function handleApi(req,res){
  res.setHeader('Cache-Control','no-store');res.setHeader('Content-Type','application/json; charset=utf-8');
  try{
    const url=new URL(req.url,'http://localhost');
    if(req.method==='GET'&&url.pathname==='/api/catalog'){res.setHeader('Cache-Control','public, max-age=300');res.end(JSON.stringify(catalog()));return;}
    if(req.method==='POST'&&req.headers.origin&&new URL(req.headers.origin).host!==req.headers.host){res.statusCode=403;res.end(JSON.stringify({error:'Geçersiz istek kaynağı.'}));return;}
    let b={};if(req.method==='POST'){
      if(req.body){b=typeof req.body==='string'?JSON.parse(req.body):req.body;if(JSON.stringify(b).length>20000)throw Error('İstek çok büyük.');}
      else{let text='';for await(const chunk of req){text+=chunk;if(text.length>20000)throw Error('İstek çok büyük.');}b=JSON.parse(text||'{}');}
    }
    const token=(req.headers.cookie??'').split(';').map(x=>x.trim()).find(x=>x.startsWith('auction='))?.slice(8);
    const result=await perform(getStore(),{method:req.method,path:url.pathname.replace(/^\/api\//,''),token,b,ip:process.env.VERCEL?String(req.headers['x-forwarded-for']??'unknown').split(',')[0]:req.socket.remoteAddress});
    if(result.token)res.setHeader('Set-Cookie',`auction=${result.token}; HttpOnly; SameSite=Strict; Path=/; Max-Age=604800${process.env.VERCEL?'; Secure':''}`);
    res.statusCode=result.status??200;res.end(JSON.stringify(result.value));
  }catch(e){const storageError=e.name==='NeonDbError'||e.message.includes('fetch failed');res.statusCode=storageError?503:400;res.end(JSON.stringify({error:storageError?'Sunucuya geçici olarak ulaşılamıyor. Tekrar deneyin.':e.message.includes('DATABASE_URL')?'Oyun henüz yapılandırılmadı.':e.message}));}
}
