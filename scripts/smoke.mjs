import assert from 'node:assert/strict';
const base='http://127.0.0.1:3000';
async function call(path,data,token){const r=await fetch(base+'/api/'+path,{method:'POST',headers:{'Content-Type':'application/json',...(token?{Cookie:'auction='+token}:{})},body:JSON.stringify(data)});const json=await r.json();assert.equal(r.status,200,JSON.stringify(json));return json;}
const a=await call('session',{name:'Test A'}), b=await call('session',{name:'Test B'});
const room=await call('create',{theme:'kahvalti',budget:50,seconds:20,public:false},a.token);
await call('join',{code:room.code},b.token);
await call('ready',{ready:true},a.token);await call('ready',{ready:true},b.token);
const started=await call('start',{},a.token);
assert.equal(started.match.phase,'basic');assert.equal(started.match.players.length,2);
const preference=started.match.products.map(p=>p.id);
const saved=await call('basic',{amount:7,preference},a.token);
assert.equal(saved.match.ownBid.amount,7);
const other=await call('basic',{amount:0,preference},b.token);
assert.equal(other.match.ownBid.amount,0);assert.equal('bids' in other.match,false);
const list=await fetch(base+'/api/rooms',{headers:{Cookie:'auction='+b.token}}).then(r=>r.json());
assert.ok(!list.some(r=>r.code===room.code));
console.log('HTTP smoke passed: 2 players, private room, readiness, start, sealed bid privacy.');
