import {test} from 'node:test';
import assert from 'node:assert/strict';
import {plan,replan,total,shouldReplan,formatFor} from '../planner.js';
import {blocks} from '../catalog.js';
test('initial plans fit arrival budget, with unique blocks and closing',()=>{for(let sec=0;sec<=7200;sec++){const q=plan(sec);assert.ok(total(q)<=Math.max(0,sec-60));assert.equal(new Set(q.map(b=>b.id)).size,q.length);if(q.length)assert.equal(q.at(-1).kind,'CLOSING');}});
test('12 minute sample and traffic replan retain current block',()=>{const q=plan(720);assert.deepEqual(q.map(b=>b.id),['core1','core2','core3','closing']);const longer=replan(q,0,151,1200);assert.equal(longer[0],q[0]);assert.ok(longer.some(b=>b.id==='review1'));const shorter=replan(longer,0,151,360);assert.deepEqual(shorter.map(b=>b.id),['core1','closing']);});
test('sudden arrival never cuts current block',()=>{const q=plan(720);assert.deepEqual(replan(q,1,200,60),q.slice(0,2));});
test('completed blocks excluded and closing is terminal',()=>{assert.ok(!plan(1200,blocks,['core1']).some(b=>b.id==='core1'));const q=plan(720);assert.deepEqual(replan(q,3,20,2000),q);});
test('threshold and format boundaries match Android',()=>{assert.equal(shouldReplan(1000,1179),false);assert.equal(shouldReplan(1000,1180),true);assert.equal(formatFor(900),'SNACK');assert.equal(formatFor(901),'LESSON');assert.equal(formatFor(2701),'DEEP_DIVE');});
