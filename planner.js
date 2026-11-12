// Port of DriveClass :engine Planner (source snapshot 102cbd8).
import {blocks} from './catalog.js';
export const SAFETY = 60, THRESHOLD = 180;
export const formatFor = sec => sec <= 900 ? 'SNACK' : sec <= 2700 ? 'LESSON' : 'DEEP_DIVE';
export const shouldReplan = (expected,actual) => Math.abs(expected-actual)>=THRESHOLD;
export const total = queue => queue.reduce((n,b)=>n+b.duration,0);
export function plan(sec,catalog=blocks,done=[]){
 const closing=catalog.find(b=>b.kind==='CLOSING');
 let budget=sec-SAFETY-closing.duration;
 if(budget<0)return closing.duration<=sec-SAFETY?[closing]:[];
 const picked=[];
 for(const b of catalog.filter(b=>b.kind!=='CLOSING'&&(b.kind!=='INTRO'||formatFor(sec)!=='SNACK')&&!done.includes(b.id))){
  if(b.duration<=budget){picked.push(b);budget-=b.duration;}
 }
 return [...picked,closing];
}
export function replan(queue,index,currentRemaining,sec,catalog=blocks,done=[]){
 const head=queue.slice(0,index+1),closing=catalog.find(b=>b.kind==='CLOSING');
 if(head.at(-1)?.kind==='CLOSING')return head;
 const after=sec-SAFETY-currentRemaining;
 if(after<closing.duration)return head;
 if(sec<=120)return [...head,closing];
 let budget=after-closing.duration;
 const used=new Set([...head.map(b=>b.id),...done]);
 const oldTail=queue.slice(index+1).filter(b=>b.kind!=='CLOSING');
 const oldIds=new Set(oldTail.map(b=>b.id));
 const candidates=[...oldTail,...catalog.filter(b=>['CORE','REVIEW'].includes(b.kind)&&!used.has(b.id)&&!oldIds.has(b.id))];
 const picked=[];
 for(const b of candidates)if(b.duration<=budget){picked.push(b);budget-=b.duration;}
 return [...head,...picked,closing];
}
