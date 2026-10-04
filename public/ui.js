import {computerStatus,soupStructure} from './theme-rules.js';
const escape=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
// Original vector illustrations, generated locally; no third-party image requests.
export function productArt(p){
 const key=p.modelId??p.name; const seed=[...key].reduce((s,c)=>s+c.charCodeAt(0),0);
 const shades=['#d99c49','#d6ad69','#bfa578','#e4be83'];const color=shades[seed%4];
 let drawing='';
 if(p.group==='Ekmek') drawing=key.includes('simit')?'<ellipse cx="50" cy="48" rx="29" ry="22" fill="#c98735"/><ellipse cx="50" cy="48" rx="13" ry="9" fill="#faf5e8"/><path d="M27 37l4 2m9-10l2 4m20-1l-2 4m12 12l-4 1M35 62l3-3m22 6l1-4" stroke="#ffe5ad" stroke-width="3"/>':`<rect x="20" y="24" width="60" height="49" rx="${key.includes('toast')?10:24}" fill="${color}" stroke="#a97335" stroke-width="4"/><path d="M35 33l-4 12m19-14l-4 13m20-11l-4 12" stroke="#f8ddb0" stroke-width="4"/>`;
 else if(p.group==='Peynir') drawing=`<path d="M22 67V39l48-17 10 45z" fill="${key.includes('kasar')?'#f3cc5b':'#f2e9c6'}" stroke="#cbb777" stroke-width="3"/><circle cx="41" cy="49" r="4" fill="#dac77d"/><circle cx="65" cy="56" r="6" fill="#dac77d"/><path d="M23 39h56" stroke="#d2bc7a" stroke-width="3"/>`;
 else if(p.group==='Yumurta') drawing=key.includes('boiled')?'<ellipse cx="50" cy="48" rx="23" ry="30" fill="#fff7e7" stroke="#d6cbb5" stroke-width="3"/><ellipse cx="50" cy="53" rx="14" ry="17" fill="#edbd46"/>':'<ellipse cx="47" cy="49" rx="32" ry="24" fill="#3e584d"/><path d="M77 49h16" stroke="#3e584d" stroke-width="9" stroke-linecap="round"/><ellipse cx="47" cy="48" rx="24" ry="17" fill="#fff8e2"/><circle cx="48" cy="47" r="10" fill="#eeb843"/>';
 else if(p.group==='İçecek') drawing=`<path d="M28 29h39l-6 43H34z" fill="${key.includes('orange')?'#edb14b':key.includes('milk')?'#fff9df':'#986443'}" stroke="#b8c6b4" stroke-width="3"/><path d="M68 34q23 0 13 20l-15 4" fill="none" stroke="#b8c6b4" stroke-width="4"/><path d="M38 19q-6-7 1-13m13 13q-6-7 1-13" fill="none" stroke="#bac9b3" stroke-width="3"/>`;
 else if(['Sebze','Zeytin','Kuruyemiş'].includes(p.group)) drawing=`<ellipse cx="50" cy="73" rx="34" ry="7" fill="#dce4d0"/>${[0,1,2].map(i=>`<ellipse cx="${30+i*19}" cy="${51+(i%2)*9}" rx="${key.includes('cucumber')?10:14}" ry="${key.includes('cucumber')?22:16}" fill="${p.group==='Zeytin'?(key.includes('black')?'#404b3c':'#7d9150'):key.includes('tomato')?'#c96a45':p.group==='Kuruyemiş'?'#af8251':'#87a663'}" stroke="#fff7" stroke-width="2"/>`).join('')}<path d="M47 33l4-9 7 8" fill="none" stroke="#698a50" stroke-width="4"/>`;
 else if(['Tatlı','Sürülebilir'].includes(p.group))drawing=`<rect x="27" y="25" width="46" height="51" rx="9" fill="${key.includes('chocolate')?'#856045':key.includes('strawberry')?'#bc6663':key.includes('kaymak')?'#eee1b6':'#d7ad53'}" stroke="#bda36a" stroke-width="2"/><rect x="24" y="18" width="52" height="12" rx="4" fill="#7e9572"/><rect x="33" y="42" width="34" height="21" rx="4" fill="#fff3d7"/><circle cx="50" cy="52" r="6" fill="${color}"/>`;
 else if(p.group==='Şarküteri')drawing='<ellipse cx="50" cy="51" rx="34" ry="23" fill="#efe5ce"/><path d="M28 39l45 19m-48-6l42 18m-26-39l36 15" stroke="#a45948" stroke-width="10" stroke-linecap="round"/>';
 else if(['İşlemci','Anakart','RAM','Depolama','Güç kaynağı','Kasa','Ekran kartı','Monitör','Klavye','Soğutma'].includes(p.group))drawing=`<rect x="20" y="24" width="60" height="49" rx="6" fill="#44665a"/><rect x="34" y="35" width="32" height="26" rx="3" fill="#afc8a0"/><path d="M27 31v34m46-34v34M40 28v7m10-7v7m10-7v7" stroke="#dbbf79" stroke-width="3"/><text x="50" y="52" font-size="10" text-anchor="middle" fill="#33513f">${escape(p.group.slice(0,3))}</text>`;
 else drawing=`<path d="M19 43h62q-3 34-31 34T19 43" fill="#78947a"/><ellipse cx="50" cy="43" rx="31" ry="10" fill="${color}"/><path d="M32 31q-6-7 1-14m16 14q-6-7 1-14m16 14q-6-7 1-14" stroke="#bdc9af" stroke-width="3" fill="none"/>`;
 return `<svg class="product-art" viewBox="0 0 100 100" role="img" aria-label="${escape(p.name)} çizimi"><ellipse cx="50" cy="82" rx="32" ry="5" fill="#294c3010"/>${drawing}</svg>`;
}
export function buildBoard(theme,inventory,ids,locked){
 const selected=inventory.filter(x=>ids.includes(x.id)); const card=p=>`<button class="placed-product secondary" data-select="${escape(p.id)}" ${locked?'disabled':''} aria-label="${escape(p.name)} seçimini kaldır">${productArt(p)}<span>${escape(p.name)}</span><small>Çıkarmak için dokun</small></button>`;
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
