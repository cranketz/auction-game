import {productArt} from './ui.js';
const root=document.querySelector('#catalog'),content=root.querySelector('.catalog-content');
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let products=null,loading=false;
async function load(){
 if(products||loading)return;
 loading=true;content.setAttribute('aria-busy','true');content.innerHTML='<p role="status">Ürünler yükleniyor…</p>';
 try{
  const response=await fetch('/api/catalog',{signal:AbortSignal.timeout(15000)});
  if(!response.ok)throw Error();const rows=await response.json();if(!Array.isArray(rows))throw Error();products=rows;render();
 }catch{content.innerHTML='<p role="alert">Katalog yüklenemedi. Bağlantını kontrol edip tekrar dene.</p><button class="secondary catalog-retry">Tekrar dene</button>';content.querySelector('button').addEventListener('click',load);}
 finally{loading=false;content.removeAttribute('aria-busy');}
}
function render(){
 content.innerHTML='<div class="catalog-heading"><h2>Ürünleri tanı</h2><p>Tüm ürünler burada. Her maçta rastgele bir kısmı gelir; bazıları hiç gelmeyebilir. Puanlar maç sonunda açılır.</p></div><div class="catalog-filters"><label>Tema<select id="catalogTheme"><option value="kahvalti">Kahvaltı</option><option value="bilgisayar">Bilgisayar</option><option value="corba">Çorba</option></select></label><label>Ürün grubu<select id="catalogGroup"></select></label><label>Alışveriş aşaması<select id="catalogStage"><option value="">Tümü</option><option value="basic">Temel</option><option value="extra">Ekstra</option></select></label><label>Ürün ara<input id="catalogSearch" type="search" placeholder="Ürün adı veya özellik"></label></div><div class="section-title"><p id="catalogCount" role="status" aria-live="polite"></p><button id="catalogClear" class="secondary">Filtreleri temizle</button></div><div id="catalogProducts" class="catalog-grid" role="region" aria-label="Katalog ürünleri" tabindex="0"></div>';
 const theme=content.querySelector('#catalogTheme'),group=content.querySelector('#catalogGroup'),stage=content.querySelector('#catalogStage'),search=content.querySelector('#catalogSearch');
 function draw(){
  const query=search.value.trim().toLocaleLowerCase('tr-TR');
  const rows=products.filter(p=>p.theme===theme.value&&(!group.value||p.group===group.value)&&(!stage.value||p.basic===(stage.value==='basic'))&&`${p.name} ${p.hint} ${p.group}`.toLocaleLowerCase('tr-TR').includes(query));
  content.querySelector('#catalogCount').textContent=`${rows.length} ürün`;
  content.querySelector('#catalogProducts').innerHTML=rows.map(p=>`<article class="card catalog-card"><span class="product-icon" aria-hidden="true">${productArt(p)}</span><div><small>${escape(p.group)} · ${p.basic?'Temel':'Ekstra'}</small><h3>${escape(p.name)}</h3><p>${escape(p.hint)}</p></div></article>`).join('')||'<div class="catalog-empty"><h3>Ürün bulunamadı.</h3><p>Başka bir kelime dene veya filtreleri temizle.</p></div>';
 }
 function groups(){group.innerHTML='<option value="">Tüm gruplar</option>'+[...new Set(products.filter(p=>p.theme===theme.value).map(p=>p.group))].map(g=>`<option value="${escape(g)}">${escape(g)}</option>`).join('');draw();}
 theme.addEventListener('change',()=>{search.value='';stage.value='';groups();});group.addEventListener('change',draw);stage.addEventListener('change',draw);search.addEventListener('input',draw);
 content.querySelector('#catalogClear').addEventListener('click',()=>{search.value='';stage.value='';group.value='';draw();search.focus();});groups();
}
root.addEventListener('toggle',()=>{if(root.open)load();});
