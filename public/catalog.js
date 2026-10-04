import {productArt} from './ui.js';
const root=document.querySelector('#catalog');
const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let products=null,loading=false;
root.addEventListener('toggle',async()=>{
 if(!root.open||products||loading)return;
 loading=true;
 const content=root.querySelector('.catalog-content');
 content.innerHTML='<p role="status">Ürünler yükleniyor…</p>';
 try{
  const response=await fetch('/api/catalog');
  if(!response.ok)throw Error();
  products=await response.json();
  content.innerHTML='<p>Bu katalog tüm ürünleri gösterir. Her maçta rastgele bir kısmı gelir; bazı ürünler hiç gelmeyebilir.</p><div class="catalog-filters"><label>Tema<select id="catalogTheme"><option value="kahvalti">Kahvaltı</option><option value="bilgisayar">Bilgisayar</option><option value="corba">Çorba</option></select></label><label>Ürün grubu<select id="catalogGroup"></select></label><label>Ürün ara<input id="catalogSearch" type="search" placeholder="Ürün adı"></label></div><p id="catalogCount" role="status" aria-live="polite"></p><div id="catalogProducts" class="catalog-grid"></div>';
  const theme=content.querySelector('#catalogTheme'),group=content.querySelector('#catalogGroup'),search=content.querySelector('#catalogSearch');
  function draw(){
   const query=search.value.trim().toLocaleLowerCase('tr-TR');
   const rows=products.filter(p=>p.theme===theme.value&&(!group.value||p.group===group.value)&&p.name.toLocaleLowerCase('tr-TR').includes(query));
   content.querySelector('#catalogCount').textContent=`${rows.length} ürün`;
   content.querySelector('#catalogProducts').innerHTML=rows.map(p=>`<article class="card catalog-card"><span class="product-icon" aria-hidden="true">${productArt(p)}</span><div><small>${escape(p.group)} · ${p.basic?'Temel':'Ekstra'}</small><h3>${escape(p.name)}</h3><p>${escape(p.hint)}</p></div></article>`).join('')||'<p>Bu aramaya uygun ürün yok.</p>';
  }
  function groups(){group.innerHTML='<option value="">Tüm gruplar</option>'+[...new Set(products.filter(p=>p.theme===theme.value).map(p=>p.group))].map(g=>`<option value="${escape(g)}">${escape(g)}</option>`).join('');draw();}
  theme.addEventListener('change',groups);group.addEventListener('change',draw);search.addEventListener('input',draw);groups();
 }catch{content.innerHTML='<p role="alert">Katalog yüklenemedi. Kapatıp yeniden açarak tekrar deneyebilirsin.</p>';}
 finally{loading=false;}
});
