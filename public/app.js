import {pollingDelay} from './network-policy.js';
import {matchProgress,resultSummary} from './match-ui.js';
import {productArt,buildBoard,scoreChart,preparationHint,themeResultDetails} from './ui.js';
import {buildLimit,nextSelection,validAmount,bidChanged,resultRank} from './interactions.js';

const app=document.querySelector('#app'),error=document.querySelector('#error');
const names={kahvalti:'Kahvaltı',bilgisayar:'Bilgisayar',corba:'Çorba'};
const practiceMarkup='<details class="practice-options" data-ui-key="practice-options"><summary>Tek başına pratik yap</summary><p>Seçtiğin tema, bütçe ve süreyle botlara karşı oyna.</p><label for="botCount">Bot sayısı</label><select id="botCount"><option value="1">1 bot</option><option value="2">2 bot</option><option value="3">3 bot</option></select><button id="practice" class="secondary">Pratik odası kur</button><small>Botlar normal oyun kurallarına uyar. Bu oda açık masalarda görünmez.</small></details>';
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
let me=null;
try{const saved=JSON.parse(localStorage.getItem('auctionUser')||'null');if(saved?.id&&saved?.name)me=saved;}catch{localStorage.removeItem('auctionUser');}
let room=null,connected=false,pollTimer,pollGeneration=0,pollFailures=0,mutationRevision=0,lastState='',clockOffset=0;
let roundKey='',preference=[],selection=[],extraDraft='',basicDraft=0,feedback=null,buildPending=false,lastLeader=null,reconnectPending=false;
let roomListRevision=0,noticeTimer,pendingFocus=null;
const pending=new Set();

function announce(text){const el=document.querySelector('#uiAnnouncement');el.textContent=text;clearTimeout(noticeTimer);noticeTimer=setTimeout(()=>{el.textContent='';},6000);}
function connectionStatus(){
 const el=document.querySelector('#connection');el.textContent=!me?'2–6 oyuncu':connected?'Bağlı':'Bağlanıyor…';el.classList.toggle('offline',!!me&&!connected);
 const banner=document.querySelector('#reconnectStatus');banner.hidden=!reconnectPending;
 if(reconnectPending)document.querySelector('#reconnectText').textContent='Bağlantı kesildi. Yeniden bağlanılıyor; maç süresi devam ediyor.';
 syncControls();
}
function showFeedback(text,type='success'){feedback={text,type,time:Date.now()};const el=document.querySelector('#actionFeedback');if(el){el.textContent=text;el.className='action-feedback '+type;}}
function clearFeedback(){feedback=null;setText(document.querySelector('#actionFeedback'),'');}
async function api(path,data){
 error.textContent='';
 try{
  const res=await fetch('/api/'+path,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data),signal:AbortSignal.timeout(15000)});
  const result=await res.json();if(!res.ok)throw Error(result.error||'İşlem tamamlanamadı.');mutationRevision++;return result;
 }catch(cause){
  const message=['TimeoutError','TypeError'].includes(cause.name)?'Sunucu yanıtı alınamadı. Yeniden bağlanınca işlem durumunu kontrol et.':cause.message;
  if(['basic','bid','build'].includes(path))showFeedback(message,'error');else error.textContent=message;
  throw Error(message);
 }
}
function setText(element,value){if(element&&element.textContent!==value)element.textContent=value;}
function syncControls(){
 const m=room?.match,current=m?.players.find(p=>p.id===me?.id),expired=!!m?.deadline&&m.deadline<=Date.now()+clockOffset;
 app.querySelectorAll('button[data-action]').forEach(button=>{button.disabled=pending.size>0||button.dataset.ruleDisabled==='true';button.setAttribute('aria-busy',String(pending.has(button.dataset.action)));});
 app.querySelectorAll('[data-move]').forEach(button=>{button.disabled=pending.size>0||button.dataset.ruleDisabled==='true'||!connected||expired;});
 app.querySelectorAll('[data-select]').forEach(button=>{button.disabled=buildPending||pending.size>0||!connected||expired||m?.finished.includes(me?.id);});
 const submit=document.querySelector('#submit'),amount=document.querySelector('#amount');
 if(submit&&current){
  const minimum=m.phase==='extra'?m.price+1:0,balance=m.phase==='extra'?current.extra:current.basic;
  const ownLeader=m.phase==='extra'&&m.leader===me.id;
  submit.disabled=!connected||expired||pending.size>0||ownLeader||!validAmount(amount.value,balance,minimum);
  if(m.phase==='extra'){
   setText(document.querySelector('#offerHelp'),ownLeader?'Şu an en yüksek teklif sende. Rakip geçerse tekrar teklif verebilirsin.':balance<minimum?'Bakiyen bu ürün için yeni teklif vermeye yetmiyor.':`En az ${minimum} para teklif et. Düğmeler tutarı değiştirir; göndermek için Teklif ver'e bas.`);
   app.querySelectorAll('[data-add]').forEach(button=>{button.disabled=!connected||expired||ownLeader||pending.size>0||balance<minimum;});
  }else{
   const status=document.querySelector('#basicStatus');
   setText(status,bidChanged(m.ownBid,amount.value,preference)?'Değişiklikler kaydedilmedi. Teklifini yeniden kaydet.':m.ownBid?'✓ Teklifin kaydedildi. Süre bitene kadar güncelleyebilirsin.':'Teklifin gizli kalır. Göndermezsen 0 kabul edilir.');
  }
 }
 const finish=document.querySelector('#finish');if(finish)finish.disabled=buildPending||pending.size>0||!connected||expired||m.finished.includes(me.id);
 const status=document.querySelector('#requestStatus');setText(status,pending.size||buildPending?'Kaydediliyor…':'');
}
function button(id,fn){const el=document.getElementById(id);if(!el)return;el.dataset.action=id;el.dataset.ruleDisabled=String(el.disabled);el.addEventListener('click',async()=>{
 if(el.disabled||pending.size)return;pendingFocus={key:roundKey,focus:{id}};pending.add(id);syncControls();try{await fn();}catch{}finally{pending.delete(id);syncControls();if(el.isConnected&&!el.disabled&&(document.activeElement===document.body||document.activeElement===el))el.focus({preventScroll:true});pendingFocus=null;}
});}
function stopPolling(){++pollGeneration;clearTimeout(pollTimer);}
function expireSession(){stopPolling();me=null;room=null;connected=false;reconnectPending=false;lastState='';localStorage.removeItem('auctionUser');render();announce('Oturumun sona erdi. Takma adınla yeniden katıl.');}
function events(){
 clearTimeout(pollTimer);const generation=++pollGeneration;
 async function poll(){
  if(generation!==pollGeneration||!me)return;
  try{
   const revision=mutationRevision;
   const res=await fetch('/api/state',{cache:'no-store',signal:AbortSignal.timeout(15000)});
   if(generation!==pollGeneration)return;if(res.status===401){expireSession();return;}if(!res.ok)throw Error();
   const next=await res.json();if(generation!==pollGeneration)return;
   if(revision!==mutationRevision){pollTimer=setTimeout(poll,100);return;}
   const wasConnected=connected;connected=true;pollFailures=0;
   if(reconnectPending){reconnectPending=false;announce(next?'Bağlantı kuruldu. Güncel oda durumuyla devam ediyorsun.':'Bağlantı yeniden kuruldu.');}
   if(next?.match?.serverNow)clockOffset=next.match.serverNow-Date.now();
   const signature=JSON.stringify(next,(key,value)=>key==='serverNow'?undefined:value);
   if(signature!==lastState||!wasConnected){
    const outbid=next?.match?.phase==='extra'&&lastLeader===me.id&&next.match.leader&&next.match.leader!==me.id;
    lastLeader=next?.match?.leader??null;lastState=signature;room=next;render();if(outbid)showFeedback('Rakip seni geçti. Teklifini artırabilirsin.','warning');
   }
   connectionStatus();
  }catch{if(generation!==pollGeneration)return;connected=false;pollFailures++;reconnectPending=true;connectionStatus();}
  if(generation===pollGeneration)pollTimer=setTimeout(poll,pollingDelay({phase:room?.match?.phase,inRoom:!!room,hidden:document.hidden,failures:pollFailures}));
 }
 poll();
}
function setRoom(next){room=next;lastLeader=next?.match?.leader??null;if(next?.match?.serverNow)clockOffset=next.match.serverNow-Date.now();lastState=JSON.stringify(next,(key,value)=>key==='serverNow'?undefined:value);render();}
function snapshotUI(){
 const active=document.activeElement;
 const detail=active?.tagName==='SUMMARY'?active.parentElement:null;
 return {screen:app.dataset.screen,key:roundKey,ownsFocus:app.contains(active)||active===document.body,focus:active?.id?{id:active.id}:active?.dataset.select?{product:active.dataset.select,location:active.dataset.location}:active?.dataset.move!==undefined?{move:active.dataset.product,direction:active.dataset.direction}:active?.dataset.add?{add:active.dataset.add}:detail?{detail:detail.dataset.uiKey??String(Array.from(app.querySelectorAll('details')).indexOf(detail))}:null,
  fields:Array.from(app.querySelectorAll('input,select')).map(el=>[el.id,el.value]),
  details:Array.from(app.querySelectorAll('details')).map((el,i)=>[el.dataset.uiKey??String(i),el.open])};
}
function restoreUI(saved){
 if(saved.screen!==app.dataset.screen||saved.key!==roundKey){
  if(saved.screen&&saved.ownsFocus){const heading=app.querySelector('#stage h2')??app.querySelector('h1');heading?.setAttribute('tabindex','-1');heading?.focus({preventScroll:false});}
  return;
 }
 for(const [id,value]of saved.fields){const field=document.getElementById(id);if(field)field.value=value;}
 for(const [key,open]of saved.details){const detail=Array.from(app.querySelectorAll('details')).find((el,i)=>(el.dataset.uiKey??String(i))===key);if(detail)detail.open=open;}
 const focus=saved.focus;
 let target=focus?.id?document.getElementById(focus.id):focus?.product?app.querySelector(`[data-select="${CSS.escape(focus.product)}"][data-location="${focus.location}"]`)??app.querySelector(`[data-select="${CSS.escape(focus.product)}"][data-location="inventory"]`):focus?.move?app.querySelector(`[data-product="${CSS.escape(focus.move)}"][data-direction="${focus.direction}"]:not(:disabled)`)??app.querySelector(`[data-product="${CSS.escape(focus.move)}"]:not(:disabled)`):focus?.add?app.querySelector(`[data-add="${focus.add}"]`):focus?.detail?Array.from(app.querySelectorAll('details')).find((el,i)=>(el.dataset.uiKey??String(i))===focus.detail)?.querySelector('summary'):null;
 if(target?.disabled){target=app.querySelector('#amount')??app.querySelector('#stage h2');if(target?.tagName==='H2')target.setAttribute('tabindex','-1');}target?.focus({preventScroll:true});syncControls();
}
function render(){
 const saved=snapshotUI();if(pendingFocus?.key===roundKey){saved.focus=pendingFocus.focus;saved.ownsFocus=true;}app.dataset.screen=!me?'welcome':!room?'home':room.match?.phase??'lobby';
 queueMicrotask(()=>restoreUI(saved));
 if(!me){
  roundKey='';app.innerHTML=`<div class="welcome-layout"><section class="hero"><span class="eyebrow">AÇIK ARTIRMA VE KOMBİNASYON</span><h1>Al. Birleştir.<br><em>Kazan.</em></h1><p>Kahvaltı hazırla, bilgisayar topla veya kendi çorbanı oluştur. Bütçeni iyi kullan, en iyi kombinasyonu kur.</p><div class="hero-tags"><span>2–6 oyuncu</span><span>3 tema</span><span>Ücretsiz</span></div></section><section class="panel welcome-card"><h2>Masaya katıl</h2><p>Arkadaşlarını davet et, açık bir oda seç veya botlarla pratik yap.</p><label for="name">Takma adın</label><input id="name" minlength="2" maxlength="20" autocomplete="nickname" placeholder="2–20 karakter" aria-describedby="nameHelp"><small id="nameHelp">Hesap açmadan oynayabilirsin.</small><button id="login">Oyuna gir →</button></section></div>`;
  button('login',async()=>{const input=document.querySelector('#name');if(input.value.trim().length<2){error.textContent='Takma adın en az 2 karakter olmalı.';input.focus();return;}me=await api('session',{name:input.value});localStorage.setItem('auctionUser',JSON.stringify(me));connected=true;render();events();});connectionStatus();return;
 }
 if(!room){
  roundKey='';app.innerHTML=`<div class="page-title"><div><span class="eyebrow">OYUN ALANI</span><h1>Bir masa seç.</h1><p>Bir oda kur, davet koduyla katıl veya yeni rakipler bul.</p></div><span class="profile-chip">${esc(me.name)}</span></div><div class="home-layout"><section class="panel create-panel"><h2>Yeni oda kur</h2><div class="row"><label>Tema<select id="theme">${Object.entries(names).map(([k,v])=>`<option value="${k}">${v}</option>`).join('')}</select></label><label>Bütçe<select id="budget"><option>50</option><option selected>100</option><option>150</option></select></label><label>Teklif süresi<select id="seconds"><option value="8">8 saniye</option><option value="12" selected>12 saniye</option><option value="20">20 saniye</option></select></label><label>Görünürlük<select id="visibility"><option value="true">Herkese açık</option><option value="false">Özel</option></select></label></div><p class="offer-help">Seçtiğin bütçe temel ve ekstra alışveriş için ayrı ayrı verilir.</p><button id="create">Oda kur</button>${practiceMarkup}</section><section class="panel join-panel"><h2>Davetle katıl</h2><label for="code">Oda kodu</label><input id="code" maxlength="8" autocomplete="off" autocapitalize="characters" spellcheck="false" placeholder="8 karakterli kod"><button id="join">Odaya katıl</button><p class="offer-help">Kodun yoksa açık masalara bakabilirsin.</p><button id="quick" class="secondary">Hızlı katıl</button></section></div><div class="section-title"><h2>Açık masalar</h2><button id="refresh" class="secondary">Yenile</button></div><div id="rooms" class="grid room-grid" aria-label="Katılabileceğin odalar"></div>`;
  button('create',async()=>setRoom(await api('create',{theme:document.querySelector('#theme').value,budget:+document.querySelector('#budget').value,seconds:+document.querySelector('#seconds').value,public:document.querySelector('#visibility').value==='true'})));
  button('practice',async()=>setRoom(await api('create',{theme:document.querySelector('#theme').value,budget:+document.querySelector('#budget').value,seconds:+document.querySelector('#seconds').value,practice:true,bots:Number(document.querySelector('#botCount').value)})));
  button('join',async()=>{const code=document.querySelector('#code').value.trim().toUpperCase();if(code.length!==8){error.textContent='8 karakterli oda kodunu yaz.';document.querySelector('#code').focus();return;}setRoom(await api('join',{code}));});
  button('quick',async()=>setRoom(await api('quick',{})));button('refresh',loadRooms);loadRooms();connectionStatus();return;
 }
 const m=room.match;
 const key=m?`${room.code}:${m.phase}:${m.round}:${m.extraIndex}`:`${room.code}:lobby`;
 if(key!==roundKey){roundKey=key;feedback=null;preference=[...(m?.ownBid?.preference??m?.products.map(p=>p.id)??[])];selection=[...(m?.ownBuild??[])];basicDraft=m?.ownBid?.amount??0;extraDraft='';}
 app.innerHTML=`<div class="room-header row"><div><h1>${names[room.settings.theme]}</h1><span class="room-meta">${room.practice?'Botlu pratik':room.public?'Herkese açık':'Özel oda'} · ${room.settings.seconds} saniyelik teklifler</span></div>${room.practice?'<div class="practice-label"><strong>Pratik modu</strong><span>'+room.players.filter(p=>p.bot).length+' bot rakip · Yalnızca sen</span></div>':'<div class="room-code"><span>Oda kodu</span><code>'+esc(room.code)+'</code><button id="copyCode" class="secondary" aria-label="Oda kodunu kopyala">Kopyala</button></div>'}</div>${m?matchProgress(m):'<div class="phase-label">Lobi</div>'}<details class="players-toggle" data-ui-key="players" ${!m?'open':''}><summary>Oyuncular · ${room.players.length}/6</summary><div class="grid player-grid">${(m?.players??room.players).map(p=>`<article class="card player-card ${p.id===me.id?'self':''}"><span class="avatar" aria-hidden="true">${esc(p.name.slice(0,1).toLocaleUpperCase('tr-TR'))}</span><strong>${esc(p.name)} ${p.bot?'<span class="bot-badge">Bot</span>':''} ${p.id===room.host?'<span title="Oda sahibi" aria-label="Oda sahibi">👑</span>':''}${p.id===me.id?' · Sen':''}</strong><small class="presence ${p.online?'online':'offline'}">${p.bot?'Otomatik oyuncu':p.online?'● Çevrimiçi':'○ Bağlantısı kesildi'}</small>${!m?`<p class="money">${p.id===room.host?'Oda sahibi':p.ready?'✓ Hazır':'Hazırlanıyor'}</p>`:m.phase==='basic'?`<p class="money">Temel bakiye: ${p.basic}</p>`:m.phase==='extra'?`<p class="money">Ekstra bakiye: ${p.extra}</p>`:''}${m?`<details class="inventory" data-ui-key="inventory-${p.id}"><summary>${p.inventory.length} ürün</summary><ul>${p.inventory.map(x=>`<li>${esc(x.name)}</li>`).join('')||'<li>Henüz ürün yok.</li>'}</ul></details>`:''}</article>`).join('')}</div></details>${m&&m.phase!=='results'?dockMarkup(m):''}<section id="stage" class="panel"></section>`;
 button('copyCode',async()=>{try{await navigator.clipboard.writeText(room.code);announce('Oda kodu kopyalandı.');}catch{error.textContent='Kod kopyalanamadı. Görünen kodu seçip elle kopyalayabilirsin.';}});
 const stage=document.querySelector('#stage');
 if(!m){renderLobby(stage);connectionStatus();return;}
 if(m.phase==='basic')renderBasic(stage,m);
 else if(m.phase==='extra')renderExtra(stage,m);
 else if(m.phase==='build')renderBuild(stage,m);
 else renderResults(stage,m);
 const feedbackEl=document.createElement('p');feedbackEl.id='actionFeedback';feedbackEl.setAttribute('role','status');feedbackEl.setAttribute('aria-live','polite');stage.append(feedbackEl);
 if(feedback&&Date.now()-feedback.time<8000)showFeedback(feedback.text,feedback.type);
 if(m.history.length&&m.phase!=='results')renderLastRound(stage,m);
 if(room.practice&&m.phase!=='results'){
  const actions=document.createElement('div');actions.className='practice-actions';actions.innerHTML='<button id="practiceLeave" class="secondary">Pratikten ayrıl</button><small>Pratik odan ve bu maç kapanır.</small>';stage.append(actions);button('practiceLeave',leaveRoom);
 }
 connectionStatus();updateTimer();
}
function dockMarkup(m){
 const p=m.players.find(p=>p.id===me.id),balance=m.phase==='basic'?`Temel bakiye: ${p.basic}`:m.phase==='extra'?`Ekstra bakiye: ${p.extra}`:'Ürünlerini seçerek kombinasyonunu kur';
 return `<aside class="player-dock" aria-label="Senin durumun"><div><strong>${esc(p.name)} · Sen</strong><span>${balance}</span></div><details data-ui-key="own-inventory"><summary>${p.inventory.length} ürünün</summary><ul>${p.inventory.map(p=>`<li>${esc(p.name)}</li>`).join('')||'<li>Henüz ürün almadın.</li>'}</ul></details></aside>`;
}
function renderLobby(stage){
 const p=room.players.find(p=>p.id===me.id),others=room.players.filter(p=>p.id!==room.host),ready=others.filter(p=>p.ready&&p.online).length;
 const status=room.players.length<2?'Bir oyuncu daha bekleniyor.':ready===others.length?'Masa hazır. Oda sahibi maçı başlatabilir.':`${ready}/${others.length} oyuncu hazır. Diğer oyuncular bekleniyor.`;
 stage.innerHTML=`<h2>Masayı hazırlıyoruz</h2><p class="lobby-status" role="status">${status}</p><p>${room.practice?'Botlar hazır. Pratik maçını başlat; istediğin anda ayrılabilirsin.':'Oda kodunu paylaşarak arkadaşlarını davet edebilirsin.'}</p>${room.players.some(p=>!p.online)?'<p class="connection-note">Bağlantısı kesilen oyuncular 2 dakika sonra lobiden çıkarılır. Oda sahibi dönmezse yönetim 45 saniye sonra devredilir.</p>':''}<div class="lobby-actions">${room.host!==me.id?`<button id="ready" aria-pressed="${p.ready}">${p.ready?'Hazır değilim':'Hazırım'}</button>`:'<button id="start">Maçı başlat</button>'}<button id="leave" class="secondary">Odadan ayrıl</button></div>`;
 button('ready',async()=>setRoom(await api('ready',{ready:!p.ready})));
 button('start',async()=>{if(room.players.length<2){error.textContent='Yeterli oyuncu yok. En az 2 oyuncu gerekli.';return;}if(!others.every(p=>p.ready&&p.online)){error.textContent='Maçı başlatmak için diğer oyuncular hazır ve çevrimiçi olmalı.';return;}await api('ready',{ready:true});setRoom(await api('start',{}));});
 button('leave',leaveRoom);
}
const timerMarkup='<div class="timer" id="timer" aria-label="Kalan süre"></div>';
function renderBasic(stage,m){
 stage.innerHTML=`<div class="basic-heading"><div><span class="eyebrow">GİZLİ TEKLİF</span><h2>${esc(m.products[0].group)} seçimini yap</h2></div>${timerMarkup}</div><p class="basic-help">İlk tercihini en üste taşı. Yüksek teklif önce seçer; herkes kendi teklifini öder.</p><ol class="preference-list">${preference.map((id,i)=>{const p=m.products.find(p=>p.id===id);return `<li class="preference-card ${i===0?'first-choice':''}"><span class="rank" aria-label="${i+1}. tercih">${i+1}</span><span class="product-icon" aria-hidden="true">${productArt(p)}</span><div class="product-info"><strong>${esc(p.name)}</strong><span>${esc(p.hint??'')}</span></div><div class="order-controls"><button class="secondary" data-move="${i}" data-product="${p.id}" data-direction="-1" data-rule-disabled="${i===0}" aria-label="${esc(p.name)} yukarı taşı" ${i===0?'disabled':''}>↑</button><button class="secondary" data-move="${i}" data-product="${p.id}" data-direction="1" data-rule-disabled="${i===preference.length-1}" aria-label="${esc(p.name)} aşağı taşı" ${i===preference.length-1?'disabled':''}>↓</button></div></li>`;}).join('')}</ol><div class="basic-bid"><label for="amount">Gizli teklifin</label><div class="bid-input"><input id="amount" type="number" inputmode="numeric" step="1" min="0" max="${m.players.find(p=>p.id===me.id).basic}" value="${esc(basicDraft)}" aria-describedby="basicStatus"><span>para</span></div><button id="submit">Teklifi kaydet</button></div><p class="bid-status" id="basicStatus" role="status"></p>`;
 document.querySelector('#amount').addEventListener('input',e=>{basicDraft=e.target.value;clearFeedback();syncControls();});
 stage.querySelectorAll('[data-move]').forEach(b=>b.onclick=()=>{const i=+b.dataset.move,j=i+Number(b.dataset.direction);[preference[i],preference[j]]=[preference[j],preference[i]];clearFeedback();render();announce('Tercih sıralaması değişti. Teklifini kaydet.');});
 button('submit',async()=>{setRoom(await api('basic',{amount:Number(basicDraft),preference}));showFeedback('Gizli teklifin kaydedildi.');});
}
function renderExtra(stage,m){
 const p=m.products[0],ownLeader=m.leader===me.id;
 stage.innerHTML=`<div class="auction-heading"><h2>${esc(p.name)}</h2>${timerMarkup}</div><div class="auction-symbol" aria-hidden="true">${productArt(p)}</div><p class="basic-help">${esc(p.hint??'')}</p><div class="auction-price"><span>EN YÜKSEK TEKLİF</span><strong>${m.price}<small> para</small></strong></div><p class="auction-leader ${ownLeader?'leading':''}">${ownLeader?'✓ Şu an öndesin':m.leader?`Önde: ${esc(m.players.find(p=>p.id===m.leader).name)}`:'Henüz teklif yok'}</p><label for="amount" class="bid-label">Toplam teklifin</label><div class="bid-controls">${[-10,-5,-1,1,5,10].map(n=>`<button data-add="${n}" type="button" aria-label="Teklif tutarını ${Math.abs(n)} ${n>0?'artır':'azalt'}">${n>0?'+':''}${n}</button>`).join('')}<input id="amount" type="number" inputmode="numeric" step="1" min="${m.price+1}" max="${m.players.find(p=>p.id===me.id).extra}" value="${esc(extraDraft)}" aria-describedby="offerHelp" placeholder="En az ${m.price+1}"><button id="submit">Teklif ver</button></div><p id="offerHelp" class="offer-help"></p>`;
 const input=document.querySelector('#amount');input.addEventListener('input',()=>{extraDraft=input.value;syncControls();});
 stage.querySelectorAll('[data-add]').forEach(b=>b.onclick=()=>{const base=input.value===''?m.price:Number(input.value);extraDraft=Math.max(0,Math.min(m.players.find(p=>p.id===me.id).extra,(Number.isFinite(base)?base:m.price)+Number(b.dataset.add)));input.value=extraDraft;syncControls();});
 button('submit',async()=>{setRoom(await api('bid',{amount:Number(extraDraft)}));showFeedback('Teklifin kabul edildi. Şu an öndesin.');});
}
function renderBuild(stage,m){
 const p=m.players.find(p=>p.id===me.id),locked=m.finished.includes(me.id),limit=buildLimit(m.theme);
 stage.innerHTML=`<div class="auction-heading"><h2>Kombinasyonunu oluştur</h2>${timerMarkup}</div><p>${locked?'Seçimin kilitlendi. Diğer oyuncular bitirince sonuçlar açılır.':'Ürünlere dokunarak seç. Seçimlerin kaydedilir; bitirince kilitlenir.'}</p><p class="build-count">${selection.length}/${limit} ürün seçildi</p>${buildBoard(m.theme,p.inventory,selection,locked)}${m.rulesVersion===2?preparationHint(m.theme,p.inventory.filter(x=>selection.includes(x.id))):''}<h3 class="inventory-title">Aldığın ürünler</h3><div class="grid build-grid">${p.inventory.map(x=>`<button class="card secondary build-card ${selection.includes(x.id)?'selected':''}" aria-pressed="${selection.includes(x.id)}" data-select="${x.id}" data-location="inventory"><span aria-hidden="true">${productArt(x)}</span><span class="selection-mark" aria-hidden="true">${selection.includes(x.id)?'✓ Seçildi':'+ Seç'}</span><strong>${esc(x.name)}</strong>${x.hint?`<small class="build-hint">${esc(x.hint)}</small>`:''}</button>`).join('')}</div><button id="finish" ${locked?'disabled':''}>${locked?'Diğer oyuncular bekleniyor':'Kombinasyonu bitir'}</button>`;
 stage.querySelectorAll('[data-select]').forEach(b=>b.onclick=async()=>{
  if(buildPending||pending.size||locked)return;
  let next;try{next=nextSelection(m.theme,p.inventory,selection,b.dataset.select);}catch(e){showFeedback(e.message,'warning');return;}
  pendingFocus={key:roundKey,focus:{product:b.dataset.select,location:b.dataset.location}};buildPending=true;syncControls();try{const result=await api('build',{ids:next});selection=next;setRoom(result);showFeedback('Seçimin kaydedildi.');}catch{}finally{buildPending=false;syncControls();if(b.isConnected&&!b.disabled)b.focus({preventScroll:true});pendingFocus=null;}
 });
 button('finish',async()=>{setRoom(await api('build',{ids:selection,finish:true}));announce(room.match.phase==='results'?'Maç tamamlandı. Sonuçlar açıldı.':'Kombinasyonun kilitlendi. Diğer oyuncular bekleniyor.');});
}
function renderResults(stage,m){
 const best=m.results[0],winners=m.results.filter(r=>r.points===best.points&&r.remaining===best.remaining);
 stage.innerHTML=`<div class="results-hero"><span aria-hidden="true">🏆</span><h2>${winners.length>1?'Birincilik paylaşıldı':`${esc(best.name)} kazandı`}</h2><p>${best.points} puan${winners.length>1?` · ${winners.map(r=>esc(r.name)).join(', ')}`:''}</p></div>${resultSummary(m,me.id,false)}<div class="result-table-wrap"><table><caption>Maç sıralaması</caption><thead><tr><th scope="col">Oyuncu</th><th scope="col">Puan</th><th scope="col">Kalan para</th></tr></thead><tbody>${m.results.map(r=>`<tr class="${r.id===me.id?'self':''}"><th scope="row"><span class="result-rank">${resultRank(m.results,r)}.</span> ${esc(r.name)}${m.players.find(p=>p.id===r.id)?.bot?' <span class="bot-badge">Bot</span>':''}${r.id===me.id?' · Sen':''}</th><td>${r.points}</td><td>${r.remaining}</td></tr>`).join('')}</tbody></table></div>${m.results.map(r=>resultDetails(r)).join('')}<div class="result-actions">${room.host===me.id?'<button id="replay">Aynı odada yeniden oyna</button>':'<p>Yeni maç için oda sahibinin lobiye dönmesini bekle.</p>'}<button id="resultLeave" class="secondary">Odadan ayrıl</button></div><p class="offer-help">${room.practice?'Aynı ayarlar korunur; botlar yeni maç için hazır gelir.':'Aynı oyuncular ve oda ayarları korunur. Lobide diğer oyuncular yeniden hazır olur.'}</p>`;
 button('replay',async()=>{roundKey='';setRoom(await api('replay',{}));});button('resultLeave',leaveRoom);
}
function resultDetails(r){
 let html=themeResultDetails(r);
 if(!html){const b=r.breakdown;html=`<details class="score-details"><summary>${esc(r.name)} · Ayrıntılar</summary>${scoreChart(r)}${b?`<p>Ürünler: ${b.base} · Temel set: ${b.completeness} · Çeşitlilik: ${b.diversity}</p><ul>${b.items.map(x=>`<li>${esc(x.name)}: +${x.points}</li>`).join('')}</ul><h3>İkili uyumlar · +${b.pairPoints}</h3><ul>${b.pairs.map(x=>`<li>${esc(x.name)}: +${x.points}</li>`).join('')||'<li>Eşleşme yok.</li>'}</ul><h3>Üçlü kombinasyonlar · +${b.triplePoints}</h3><ul>${b.triples.map(x=>`<li>${esc(x.name)}: +${x.points}</li>`).join('')||'<li>Kombinasyon yok.</li>'}</ul><small>İkili katkı en fazla 24, üçlü katkı en fazla 16 puan. ${b.duplicates} tekrar ürün ek katkı vermedi.</small>`:''}</details>`;}
 return html.replace('<details class="score-details">',`<details class="score-details" data-ui-key="score-${r.id}" ${r.id===me.id?'open':''}>`).replace('</summary>',`</summary><p class="offer-help">Seçilen ürünler: ${r.selected.map(p=>esc(p.name)).join(', ')||'Ürün seçilmedi.'}</p>`);
}
function renderLastRound(stage,m){
 const last=m.history.at(-1),allocation=last.type==='basic'?last.allocation.find(a=>a.playerId===me.id):null;
 const text=allocation?`${allocation.product.name} aldın · ${allocation.amount} para`:last.playerId===me.id?`${last.product.name} senin · ${last.amount} para`:last.playerId?`${last.product.name}: ${m.players.find(p=>p.id===last.playerId)?.name} aldı · ${last.amount} para`:`${last.product.name} satılmadı`;
 const detail=document.createElement('details');detail.className='round-summary';detail.dataset.uiKey=`history-${m.history.length}`;detail.innerHTML=`<summary>Son tur · ${esc(text)}</summary>${last.type==='basic'?`<ol>${last.allocation.map(a=>`<li>${esc(m.players.find(p=>p.id===a.playerId)?.name)} · ${esc(a.product.name)} · ${a.amount} para</li>`).join('')}</ol><small>Yüksek teklif önce seçer. Eşitlikte öncelik sırası kullanılır.</small>`:''}`;stage.append(detail);
}
async function leaveRoom(){await api('leave',{});room=null;roundKey='';error.textContent='';render();}
async function loadRooms(){
 const list=document.querySelector('#rooms');if(!list)return;const revision=++roomListRevision;list.setAttribute('aria-busy','true');if(!list.children.length)list.innerHTML='<p role="status">Odalar yükleniyor…</p>';
 try{
  const res=await fetch('/api/rooms',{signal:AbortSignal.timeout(15000)});if(res.status===401){expireSession();return;}const rows=await res.json();if(!res.ok||!Array.isArray(rows))throw Error();if(revision!==roomListRevision||!list.isConnected)return;
  list.innerHTML=rows.map((r,i)=>`<article class="card room-card"><div class="room-meta">${r.started?'Maç sürüyor':r.count>=6?'Oda dolu':'Katılmaya açık'}</div><h3>${names[r.settings.theme]}</h3><p>${r.count}/6 oyuncu · ${r.settings.seconds} saniye · ${r.settings.budget} bütçe</p><button id="joinRoom${i}" ${r.started||r.count>=6?'disabled':''}>${r.started?'Maç başladı':r.count>=6?'Dolu':'Katıl'}</button></article>`).join('')||'<div class="empty-state"><span aria-hidden="true">🪑</span><h3>İlk masa senden.</h3><p>Şu an açık oda yok. Bir oda kurup arkadaşlarını davet edebilirsin.</p></div>';
  rows.forEach((r,i)=>button(`joinRoom${i}`,async()=>setRoom(await api('join',{code:r.code}))));syncControls();
 }catch{if(list.isConnected&&revision===roomListRevision){list.innerHTML='<p role="alert">Odalar yüklenemedi. Yenile düğmesiyle tekrar deneyebilirsin.</p>';}}
 finally{list.removeAttribute('aria-busy');}
}
function updateTimer(){const el=document.querySelector('#timer');if(el&&room?.match?.deadline){const seconds=Math.max(0,Math.ceil((room.match.deadline-Date.now()-clockOffset)/1000));const text=seconds?seconds+' saniye':'Tur tamamlanıyor…';if(el.textContent!==text)el.textContent=text;el.classList.toggle('urgent',seconds<=3);syncControls();}}
document.querySelector('#reconnectRetry').addEventListener('click',()=>{if(me)events();});
document.addEventListener('visibilitychange',()=>{if(!document.hidden&&me)events();});
app.addEventListener('keydown',event=>{if(event.key!=='Enter'||event.isComposing||event.target.tagName!=='INPUT')return;const id={name:'login',code:'join',amount:'submit'}[event.target.id];if(id){event.preventDefault();document.getElementById(id)?.click();}});
window.addEventListener('online',()=>{if(me)events();});window.addEventListener('offline',()=>{connected=false;reconnectPending=true;connectionStatus();});
setInterval(updateTimer,200);render();if(me)events();
