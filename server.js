import http from 'node:http';
import {readFile} from 'node:fs/promises';
import {handleApi} from './src/handler.js';
const server=http.createServer(async(req,res)=>{
 const url=new URL(req.url,'http://localhost');
 if(url.pathname.startsWith('/api/'))return handleApi(req,res);
 if(req.method==='GET'&&['/','/app.js','/ui.js','/catalog.js','/match-ui.js','/style.css','/theme-rules.js'].includes(url.pathname)){
  const path=url.pathname==='/'?'index.html':url.pathname.slice(1);
  res.writeHead(200,{'Content-Type':path.endsWith('.js')?'text/javascript':path.endsWith('.css')?'text/css':'text/html; charset=utf-8'});
  res.end(await readFile(new URL(`./public/${path}`,import.meta.url)));return;
 }
 res.writeHead(404);res.end('Bulunamadı.');
});
server.listen(Number(process.env.PORT??3000),'127.0.0.1',()=>console.log(`Auction Game: http://127.0.0.1:${process.env.PORT??3000}`));
