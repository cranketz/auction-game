const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export function matchProgress(m){
 const phases=['basic','extra','build','results'],labels=['Temel seçim','Ekstralar','Kombinasyon','Sonuç'];
 const index=phases.indexOf(m.phase);
 const detail=m.phase==='basic'?`Tur ${m.round+1}/${m.basicTotal} · Bu turdan sonra ${Math.max(0,m.basicTotal-m.round-1)} temel tur kaldı`:m.phase==='extra'?`Ürün ${m.extraIndex+1}/${m.extraTotal} · Bu üründen sonra ${Math.max(0,m.extraTotal-m.extraIndex-1)} ekstra kaldı`:m.phase==='build'?`${m.finished.length}/${m.players.length} oyuncu kombinasyonunu tamamladı`:'Maç tamamlandı';
 return `<nav class="match-progress" aria-label="Maç ilerlemesi"><ol>${phases.map((phase,i)=>`<li ${i===index?'aria-current="step"':''} class="${i<index?'complete':i===index?'current':''}"><span>${i<index?'✓':i+1}</span>${labels[i]}</li>`).join('')}</ol><p>${detail}</p></nav>`;
}
export function resultSummary(m,id){
 const own=m.results.find(r=>r.id===id),best=m.results[0];
 const rank=m.results.filter(r=>r.points>own.points||(r.points===own.points&&r.remaining>own.remaining)).length+1;
 const winners=m.results.filter(r=>r.points===best.points&&r.remaining===best.remaining);
 return `<div class="personal-result"><strong>Senin sonucun: ${rank}. sıra · ${own.points} puan</strong><p>${rank===1?(winners.length>1?'Birinciliği paylaştın.':'Bu maçı kazandın.'):`Liderle puan farkın: ${best.points-own.points}.`}</p><small>Eşit puanda kalan para karşılaştırılır; ikisi de eşitse sıra paylaşılır.</small></div><p class="winner-list">${winners.length>1?'Birinciler':'Kazanan'}: ${winners.map(r=>escape(r.name)).join(', ')}</p>`;
}
