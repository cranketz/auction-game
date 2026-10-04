import {computerStatus,soupStructure} from './theme-rules.js';
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const computerDrawings={
 'İşlemci':'<path d="M31 19v10m12-10v10m14-10v10m12-10v10M31 71v10m12-10v10m14-10v10m12-10v10M19 31h10m-10 12h10m-10 14h10m-10 12h10M71 31h10m-10 12h10m-10 14h10m-10 12h10" stroke="#bda15e" stroke-width="5"/><rect x="28" y="28" width="44" height="44" rx="7" fill="#47685d"/><rect x="36" y="36" width="28" height="28" rx="4" fill="#b9cdb5"/><path d="M40 41h20M40 48h12" stroke="#789381" stroke-width="3"/>',
 'Anakart':'<rect x="22" y="15" width="57" height="68" rx="5" fill="#507663"/><rect x="34" y="26" width="23" height="23" rx="3" fill="#c1d2b0"/><rect x="65" y="25" width="5" height="38" fill="#dcc47e"/><path d="M34 61h24m-24 12h24" stroke="#e3dfc9" stroke-width="6"/><path d="M26 23v48M45 50v8m13-20h7M59 67h11v9" stroke="#a1bf9a" stroke-width="3"/><rect x="17" y="27" width="11" height="31" rx="2" fill="#a7b8a5"/>',
 'RAM':'<rect x="13" y="31" width="74" height="32" rx="4" fill="#527965"/><path d="M18 64h29m7 0h27" stroke="#d8b965" stroke-width="8"/><path d="M25 46h12m5 0h12m5 0h12" stroke="#243f36" stroke-width="17"/><path d="M17 35v23m66-23v23" stroke="#9bb58f" stroke-width="2"/>',
 'Depolama':'<rect x="24" y="18" width="53" height="65" rx="6" fill="#9eacaa" stroke="#56746b" stroke-width="3"/><circle cx="49" cy="44" r="19" fill="#dce3d7"/><circle cx="49" cy="44" r="6" fill="#6b8c7d"/><path d="M67 69L49 44" stroke="#416558" stroke-width="6" stroke-linecap="round"/><path d="M32 77h36" stroke="#d8b968" stroke-width="5"/>',
 'Güç kaynağı':'<rect x="15" y="26" width="70" height="49" rx="7" fill="#49635b"/><circle cx="41" cy="50" r="18" fill="#253f36" stroke="#9db39e" stroke-width="3"/><path d="M29 38l24 24m-24 0l24-24M41 34v32M25 50h32" stroke="#698777" stroke-width="3"/><rect x="68" y="42" width="10" height="17" rx="2" fill="#d9cb9c"/><path d="M73 46v8" stroke="#49635b" stroke-width="3"/>',
 'Kasa':'<rect x="29" y="12" width="43" height="74" rx="7" fill="#49645a"/><rect x="35" y="20" width="31" height="55" rx="3" fill="#2c473d"/><circle cx="50" cy="39" r="11" fill="#789986"/><circle cx="50" cy="62" r="9" fill="#789986"/><path d="M43 39h14m-7-7v14m-6 16h12m-6-6v12" stroke="#bfceb6" stroke-width="3"/><circle cx="50" cy="79" r="2" fill="#e4c780"/>',
 'Ekran kartı':'<path d="M13 31v46m0-8h8" stroke="#90a194" stroke-width="5"/><rect x="20" y="29" width="67" height="39" rx="5" fill="#496b5b"/><circle cx="39" cy="48" r="14" fill="#233f33"/><circle cx="69" cy="48" r="14" fill="#233f33"/><path d="M32 41l14 14m-14 0l14-14M62 41l14 14m-14 0l14-14" stroke="#a6baa0" stroke-width="4"/><path d="M30 71h33" stroke="#d3b56d" stroke-width="7"/>',
 'Monitör':'<rect x="12" y="20" width="76" height="48" rx="6" fill="#36564a"/><rect x="18" y="26" width="64" height="35" rx="2" fill="#b8cdb2"/><path d="M20 57l19-16 12 10 15-18 14 24" fill="#7b9e83"/><path d="M46 69v10m8-10v10M34 83h32" stroke="#45675a" stroke-width="5" stroke-linecap="round"/>',
 'Klavye':'<path d="M19 28h62l9 40H10z" fill="#426257" stroke="#294a3d" stroke-width="3"/><path d="M25 38h7m3 0h7m3 0h7m3 0h7m3 0h7M22 47h7m3 0h7m3 0h7m3 0h7m3 0h7m3 0h7M20 56h7m3 0h7m3 0h7m3 0h7m3 0h7m3 0h7M31 64h38" stroke="#c1cfb6" stroke-width="5"/>',
 'Soğutma':'<path d="M25 20h50M25 28h50M25 36h50M25 68h50M25 76h50" stroke="#8da697" stroke-width="5" stroke-linecap="round"/><rect x="23" y="30" width="54" height="41" rx="6" fill="#476657"/><circle cx="50" cy="50" r="17" fill="#273f34"/><path d="M48 46q-16-15-15 4h14m8-1q19-7 7-17l-9 14m-3 10q-1 19 13 7l-9-10" fill="#bdceae"/><circle cx="50" cy="50" r="5" fill="#d3b973"/>'
};
function ingredientDrawing(p,key){
 if(p.group==='Sebze'){
  if(key.includes('carrot'))return '<path d="M39 34l31 10-38 37z" fill="#dc9144" stroke="#b87132" stroke-width="3"/><path d="M48 31l-6-17m13 20l5-22m-2 25l18-14" stroke="#608653" stroke-width="6" stroke-linecap="round"/><path d="M40 50l11 4m-15 10l8 3" stroke="#edb66f" stroke-width="4"/>';
  if(key.includes('mushroom'))return '<path d="M39 46h22l7 30q-18 9-35 0z" fill="#e9dcc0" stroke="#ad997a" stroke-width="3"/><path d="M18 48q4-32 32-32t32 32q-33 17-64 0" fill="#b39779" stroke="#8f745e" stroke-width="3"/><path d="M28 38q9-13 23-13" fill="none" stroke="#d3bd9e" stroke-width="4"/>';
  if(key.includes('pumpkin'))return '<path d="M48 26l4-12 9 4" fill="none" stroke="#5d7950" stroke-width="6"/><ellipse cx="50" cy="54" rx="33" ry="26" fill="#d69843"/><path d="M45 29q-16 25 0 51m10-51q16 25 0 51M28 35q-11 20 0 37m44-37q11 20 0 37" fill="none" stroke="#b87536" stroke-width="3"/>';
  if(key.includes('tomato'))return '<path d="M17 53q1-28 33-22 32-6 33 22 0 28-33 27-33 1-33-27" fill="#c96a49" stroke="#b25b3f" stroke-width="3"/><path d="M50 34l-16 2 10-10 7-11 4 13 12 5-13 3" fill="#658752"/><path d="M27 50q1-8 10-11" stroke="#e7a080" stroke-width="4" fill="none" stroke-linecap="round"/>';
 }
 if(p.group==='Protein / bakliyat'){
  if(key==='chicken')return '<path d="M61 58l15 16m0 0l8-2m-8 2l-2 8" stroke="#e7ddc6" stroke-width="10" stroke-linecap="round"/><path d="M28 24q30-10 40 18 6 19-15 29-22 4-34-16-10-22 9-31" fill="#c29468" stroke="#9e7352" stroke-width="3"/><path d="M28 35q7-7 18-4" stroke="#e6c49c" stroke-width="5" fill="none" stroke-linecap="round"/>';
  const fill=key==='lentil'?'#d49750':key==='bean'?'#a46a52':'#d8b878';
  return '<ellipse cx="50" cy="73" rx="34" ry="9" fill="#e4e8d8"/>'+[[27,48],[48,34],[66,50],[45,62],[71,69]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="11" ry="${key==='lentil'?7:12}" fill="${fill}" stroke="#b29364" stroke-width="2"/><path d="M${x-3} ${y-4}q-3 5 1 8" stroke="#eee0b9" stroke-width="2" fill="none"/>`).join('');
 }
 if(p.group==='Sıvı / taban'){
  if(key==='broth')return '<path d="M18 43h64q-5 35-32 35T18 43" fill="#75927a"/><ellipse cx="50" cy="43" rx="32" ry="12" fill="#d8b767"/><circle cx="39" cy="43" r="5" fill="#b98048"/><path d="M51 40h13m-10 9h9" stroke="#7b9b62" stroke-width="4"/><path d="M39 29q-6-7 0-14m17 14q-6-7 0-14" stroke="#bac6b0" stroke-width="3" fill="none"/>';
  if(key==='yogurt')return '<path d="M25 32h49l-7 46H33z" fill="#c3d3bc" stroke="#769783" stroke-width="3"/><ellipse cx="49" cy="32" rx="25" ry="9" fill="#fff8e7" stroke="#b8c6b1" stroke-width="2"/><path d="M66 31l17-19" stroke="#8ca293" stroke-width="5" stroke-linecap="round"/><ellipse cx="82" cy="14" rx="5" ry="8" fill="#d8e0d2" transform="rotate(40 82 14)"/>';
  return `<path d="M31 22h35l5 55H26z" fill="${key==='water'?'#a9c9c5':'#eee6cb'}" stroke="#729587" stroke-width="3"/><path d="M69 34q26-4 15 22l-14 6" fill="none" stroke="#729587" stroke-width="5"/><path d="M31 23l-11 3 9 10" fill="none" stroke="#729587" stroke-width="3"/>${key==='water'?'<path d="M49 36q-20 24 0 26 20-2 0-26" fill="#7ca7a5"/>':'<path d="M36 40h20m-20 10h20" stroke="#c9bc98" stroke-width="3"/>'}`;
 }
 if(p.group==='Yağ')return key==='butter'?'<ellipse cx="50" cy="73" rx="35" ry="9" fill="#dbe2d0"/><path d="M25 39l45-10 9 11v25l-49 9-5-10z" fill="#efd181" stroke="#cfb265" stroke-width="3"/><path d="M25 39l11 13 43-12M36 52v20" fill="none" stroke="#f8e4ad" stroke-width="3"/>':'<rect x="39" y="13" width="23" height="15" rx="3" fill="#4d6d4e"/><path d="M41 28h19v9l12 12v28H29V49l12-12z" fill="#beaf61" stroke="#799055" stroke-width="3"/><rect x="33" y="52" width="35" height="15" rx="3" fill="#ecdeb0"/><path d="M50 53v13m0-8q-11-9-11 0m11 2q11-9 11 0" stroke="#71935a" fill="none" stroke-width="3"/>';
 if(p.group==='Baharat'){
  if(key==='mint')return '<path d="M35 79l27-60" stroke="#648754" stroke-width="5"/><path d="M49 50q-33 0-27-26 31-4 30 21M53 38q0-27 26-24 7 25-21 30M42 65q-32 1-29-22 30-2 31 18M47 58q6-29 32-21 2 26-30 28" fill="#86a875" stroke="#638851" stroke-width="2"/>';
  return '<path d="M35 34h30l8 42H27z" fill="#d8c9a2" stroke="#9b8967" stroke-width="3"/><rect x="31" y="21" width="38" height="15" rx="5" fill="#738d6c"/><path d="M39 27h3m7 0h3m7 0h3" stroke="#e5eadb" stroke-width="3"/>'+[0,1,2,3,4].map(i=>`<circle cx="${38+i%3*12}" cy="${49+Math.floor(i/3)*13}" r="${key==='pepper'?4:3}" fill="${key==='pepper'?'#6a604d':'#b18a46'}"/>`).join('');
 }
 if(p.group==='Kıvam'){
  if(key==='rice')return '<path d="M19 46h62q-5 30-31 30T19 46" fill="#91a28b"/><ellipse cx="50" cy="46" rx="32" ry="12" fill="#f4e9ce"/>'+[[30,43],[43,37],[56,44],[70,42],[41,50],[59,51]].map(([x,y])=>`<ellipse cx="${x}" cy="${y}" rx="6" ry="2.5" fill="#d8caa8" transform="rotate(-25 ${x} ${y})"/>`).join('');
  if(key==='flour')return '<path d="M32 19h36l-5 15 12 44H25l12-44z" fill="#e8dac0" stroke="#c3ac84" stroke-width="3"/><path d="M34 27h32" stroke="#aa8b60" stroke-width="4"/><path d="M50 69V41m0 7l-8-6m8 14l-8-6m8-2l8-6m-8 14l8-6" stroke="#b89a5c" stroke-width="3"/>';
  return '<path d="M31 25h33l8 51H25z" fill="#eee6cd" stroke="#9eb29b" stroke-width="3"/><path d="M68 37q24-2 13 21l-11 4" fill="none" stroke="#9eb29b" stroke-width="5"/><path d="M32 25l-12 5 10 11" fill="none" stroke="#9eb29b" stroke-width="3"/><path d="M37 44h18m-18 9h18" stroke="#d0c098" stroke-width="3"/>';
 }
 if(p.group==='Garnitür'){
  if(key==='lemon')return '<circle cx="50" cy="50" r="31" fill="#e0bd55"/><circle cx="50" cy="50" r="24" fill="#f5e5a8"/><path d="M50 27v46M27 50h46M33 33l34 34m-34 0l34-34" stroke="#d4b54f" stroke-width="4"/><circle cx="50" cy="50" r="4" fill="#fff1c7"/>';
  if(key==='parsley')return '<path d="M47 81l6-50m-5 34L27 45m23 12l20-15" stroke="#648a53" stroke-width="4"/>'+[[26,38],[49,29],[67,34]].map(([x,y])=>`<path d="M${x} ${y}q-20-15-13 2-12 12 6 10 9 20 13 0 20 3 7-10 6-18-13-2" fill="#80a66b" stroke="#618b51" stroke-width="2"/>`).join('');
  return [[24,43],[48,27],[55,59]].map(([x,y])=>`<rect x="${x}" y="${y}" width="24" height="23" rx="3" fill="#cf9b56" stroke="#af7d42" stroke-width="3"/><rect x="${x+5}" y="${y+5}" width="14" height="13" rx="2" fill="#e8c48a"/>`).join('');
 }
 return '';
}
// Original vector illustrations, generated locally; no third-party image requests.
export function productArt(p){
 const key=String(p.modelId??p.name??''); const seed=[...key].reduce((s,c)=>s+c.charCodeAt(0),0);
 const shades=['#d99c49','#d6ad69','#bfa578','#e4be83'];const color=shades[seed%4];
 const ingredient=ingredientDrawing(p,key);
 let drawing='';
 if(p.group==='Ekmek') drawing=key.includes('simit')?'<ellipse cx="50" cy="48" rx="29" ry="22" fill="#c98735"/><ellipse cx="50" cy="48" rx="13" ry="9" fill="#faf5e8"/><path d="M27 37l4 2m9-10l2 4m20-1l-2 4m12 12l-4 1M35 62l3-3m22 6l1-4" stroke="#ffe5ad" stroke-width="3"/>':`<rect x="20" y="24" width="60" height="49" rx="${key.includes('toast')?10:24}" fill="${color}" stroke="#a97335" stroke-width="4"/><path d="M35 33l-4 12m19-14l-4 13m20-11l-4 12" stroke="#f8ddb0" stroke-width="4"/>`;
 else if(p.group==='Peynir') drawing=`<path d="M22 67V39l48-17 10 45z" fill="${key.includes('kasar')?'#f3cc5b':'#f2e9c6'}" stroke="#cbb777" stroke-width="3"/><circle cx="41" cy="49" r="4" fill="#dac77d"/><circle cx="65" cy="56" r="6" fill="#dac77d"/><path d="M23 39h56" stroke="#d2bc7a" stroke-width="3"/>`;
 else if(p.group==='Yumurta') drawing=key.includes('boiled')?'<ellipse cx="50" cy="48" rx="23" ry="30" fill="#fff7e7" stroke="#d6cbb5" stroke-width="3"/><ellipse cx="50" cy="53" rx="14" ry="17" fill="#edbd46"/>':'<ellipse cx="47" cy="49" rx="32" ry="24" fill="#3e584d"/><path d="M77 49h16" stroke="#3e584d" stroke-width="9" stroke-linecap="round"/><ellipse cx="47" cy="48" rx="24" ry="17" fill="#fff8e2"/><circle cx="48" cy="47" r="10" fill="#eeb843"/>';
 else if(p.group==='İçecek') drawing=`<path d="M28 29h39l-6 43H34z" fill="${key.includes('orange')?'#edb14b':key.includes('milk')?'#fff9df':'#986443'}" stroke="#b8c6b4" stroke-width="3"/><path d="M68 34q23 0 13 20l-15 4" fill="none" stroke="#b8c6b4" stroke-width="4"/><path d="M38 19q-6-7 1-13m13 13q-6-7 1-13" fill="none" stroke="#bac9b3" stroke-width="3"/>`;
 else if(ingredient) drawing=ingredient;
 else if(['Sebze','Zeytin','Kuruyemiş'].includes(p.group)) drawing=`<ellipse cx="50" cy="73" rx="34" ry="7" fill="#dce4d0"/>${[0,1,2].map(i=>`<ellipse cx="${30+i*19}" cy="${51+(i%2)*9}" rx="${key.includes('cucumber')?10:14}" ry="${key.includes('cucumber')?22:16}" fill="${p.group==='Zeytin'?(key.includes('black')?'#404b3c':'#7d9150'):key.includes('tomato')?'#c96a45':p.group==='Kuruyemiş'?'#af8251':'#87a663'}" stroke="#fff7" stroke-width="2"/>`).join('')}<path d="M47 33l4-9 7 8" fill="none" stroke="#698a50" stroke-width="4"/>`;
 else if(['Tatlı','Sürülebilir'].includes(p.group))drawing=`<rect x="27" y="25" width="46" height="51" rx="9" fill="${key.includes('chocolate')?'#856045':key.includes('strawberry')?'#bc6663':key.includes('kaymak')?'#eee1b6':'#d7ad53'}" stroke="#bda36a" stroke-width="2"/><rect x="24" y="18" width="52" height="12" rx="4" fill="#7e9572"/><rect x="33" y="42" width="34" height="21" rx="4" fill="#fff3d7"/><circle cx="50" cy="52" r="6" fill="${color}"/>`;
 else if(p.group==='Şarküteri')drawing='<ellipse cx="50" cy="51" rx="34" ry="23" fill="#efe5ce"/><path d="M28 39l45 19m-48-6l42 18m-26-39l36 15" stroke="#a45948" stroke-width="10" stroke-linecap="round"/>';
 else if(Object.hasOwn(computerDrawings,p.group))drawing=computerDrawings[p.group];
 else drawing=`<path d="M19 43h62q-3 34-31 34T19 43" fill="#78947a"/><ellipse cx="50" cy="43" rx="31" ry="10" fill="${color}"/><path d="M32 31q-6-7 1-14m16 14q-6-7 1-14m16 14q-6-7 1-14" stroke="#bdc9af" stroke-width="3" fill="none"/>`;
 return `<svg class="product-art" viewBox="0 0 100 100" role="img" aria-label="${escape(p.name)} çizimi"><ellipse cx="50" cy="82" rx="32" ry="5" fill="#294c3010"/>${drawing}</svg>`;
}
export function buildBoard(theme,inventory,ids,locked){
 const selected=inventory.filter(x=>ids.includes(x.id)); const card=p=>`<button class="placed-product secondary" data-select="${escape(p.id)}" data-location="board" ${locked?'disabled':''} aria-label="${escape(p.name)} seçimini kaldır"><span aria-hidden="true">${productArt(p)}</span><span>${escape(p.name)}</span><small>${locked?'Seçimin kilitlendi':'Çıkarmak için dokun'}</small></button>`;
 const title={kahvalti:'Kahvaltı tabağın',bilgisayar:'Bilgisayarın',corba:'Çorba kazanın'}[theme];
 const slots=['İşlemci','Anakart','RAM','Depolama','Güç kaynağı','Kasa'];
 return `<section class="build-board ${theme}" aria-label="${title}"><div class="board-heading"><strong>${title}</strong><span>${selected.length} ürün</span></div>${theme==='bilgisayar'?`<div class="component-slots">${slots.map(g=>`<div class="component-slot"><span>${g}</span>${selected.find(p=>p.group===g)?card(selected.find(p=>p.group===g)):'<small>Parça seç</small>'}</div>`).join('')}</div><div class="placed-grid">${selected.filter(p=>!slots.includes(p.group)).map(card).join('')}</div>`:`<div class="${theme==='kahvalti'?'plate':'pot'}"><div class="placed-grid">${selected.map(card).join('')||'<p class="board-empty">Aşağıdaki ürünlere dokunarak buraya ekle.</p>'}</div></div>`}</section>`;
}
export function scoreChart(result){
 const b=result.breakdown;
 const rows=b?.type==='computer'?[['Çalışan parçalar',b.base],['Uyumlu çekirdek',b.coreBonus],['Tam sistem',b.completeness]]:b?.type==='soup'?[['Malzemeler',b.base],['Geçerli yapı',b.completeness],['İkili uyumlar',b.pairPoints],['Üçlü uyumlar',b.triplePoints]]:b?[['Ürün katkısı',b.base],['Temel set',b.completeness],['Çeşitlilik',b.diversity],['İkili uyumlar',b.pairPoints],['Üçlü uyumlar',b.triplePoints]]:[['Toplam katkı',result.points]];
 const max=Math.max(1,...rows.map(x=>Math.abs(x[1])));
 return `<div class="score-chart" aria-label="${escape(result.name)} puan dağılımı"><h3>${escape(result.name)} · Puan katkıları</h3>${rows.map(([label,value])=>`<div><span>${label}</span><div class="bar-track"><div ${value<0?'class="negative"':''} style="width:${Math.abs(value)/max*100}%"></div></div><strong>${value}</strong></div>`).join('')}</div>`;
}
export function preparationHint(theme,selected){
 if(theme==='corba')return `<p class="theme-status">${soupStructure(selected)?'✓ Sıvı ve ana malzeme var. Gizli uyumlar sonuçta açılır.':'En az bir sıvı/taban ve bir sebze veya protein/bakliyat seç.'}</p>`;
 if(theme!=='bilgisayar')return '';
 const status=computerStatus(selected),missing=['İşlemci','Anakart','RAM','Depolama','Güç kaynağı','Kasa'].filter(g=>!selected.some(p=>p.group===g));
 return `<div class="theme-status" role="status">${missing.length?`<p>Eksik yuvalar: ${missing.join(', ')}</p>`:''}${status.messages.map(m=>`<p>⚠ ${escape(m)}</p>`).join('')}${status.complete?'<p>✓ Temel sistem uyumlu ve tamamlandı.</p>':''}${selected.length?`<small>Güç ihtiyacı: ${status.watts} W · Görüntü çıkışı işlemcide hazır.</small>`:''}</div>`;
}
export function themeResultDetails(result){
 const b=result.breakdown;
 if(!['computer','soup'].includes(b?.type))return '';
 const items=b.items.map(p=>`<li>${escape(p.name)}: ${p.points}${p.reason?` · ${escape(p.reason)}`:''}</li>`).join('');
 const relations=list=>list.map(p=>`<li>${escape(p.name)}: ${p.points>0?'+':''}${p.points}</li>`).join('')||'<li>Bu seçimde ilişki yok.</li>';
 return `<details class="score-details"><summary>${escape(result.name)} · Ayrıntılar</summary>${scoreChart(result)}<ul>${items}</ul>${b.type==='computer'?`<p>Uyumlu işlemci/anakart/RAM: +${b.coreBonus} · Tam sistem: +${b.completeness}</p><ul>${b.messages.map(m=>`<li>${escape(m)}</li>`).join('')}</ul>`:`<p>${b.valid?'Sıvı ve ana malzeme yapısı geçerli.':'Sıvı veya ana malzeme eksik: sonuç 0.'} Ham toplam: ${b.raw} · Gösterilen puan: ${result.points}</p><h3>İkili ilişkiler</h3><ul>${relations(b.pairs)}</ul><h3>Üçlü ilişkiler</h3><ul>${relations(b.triples)}</ul><small>${b.duplicates} tekrar kart ek katkı vermedi. Yalnızca kullanılan ilişkiler açıldı.</small>`}</details>`;
}
