import test from 'node:test';
import assert from 'node:assert/strict';
import {pollingDelay} from '../public/network-policy.js';
test('active auctions stay responsive; idle and background requests are reduced',()=>{
 assert.equal(pollingDelay({inRoom:true,phase:'extra'}),750);
 assert.equal(pollingDelay({inRoom:true}),2500);
 assert.equal(pollingDelay({inRoom:false}),15000);
 assert.equal(pollingDelay({inRoom:true,phase:'build'}),1500);
 assert.equal(pollingDelay({inRoom:true,phase:'results'}),10000);
 assert.equal(pollingDelay({inRoom:true,phase:'extra',hidden:true}),10000);
});
test('failures back off and successful recovery resets delay',()=>{
 assert.deepEqual([1,2,3,4,5,6].map(failures=>pollingDelay({failures})),[2000,4000,8000,16000,30000,30000]);
 assert.equal(pollingDelay({inRoom:true,phase:'extra',failures:0}),750);
});
