import test from 'node:test';
import assert from 'node:assert/strict';
import {lessons,questions,buildCharacter} from '../src/lessons.js';
import {loadProgress,saveProgress} from '../src/progress.js';
test('context questions are unambiguous',()=>{for(const q of questions){assert(q.choices.includes(q.answerId));if(['moving','resting','mappiq'].includes(q.answerId))assert(q.prompt.length>2);}assert.equal(lessons.length,4);});
test('invalid combinations are blocked',()=>{assert.equal(buildCharacter('ב','mappiq'),null);assert.equal(buildCharacter('ב','hataf-patah'),null);assert.equal(buildCharacter('ה','mappiq'),'הּ');});
test('storage corruption or restrictions do not break learning',()=>{assert.deepEqual(loadProgress({getItem:()=>'{bad'}),{correct:0,total:0});assert.equal(saveProgress({correct:1,total:1},{setItem(){throw Error();}}),false);});
test('throwing storage getter cannot crash app initialization',()=>{const original=Object.getOwnPropertyDescriptor(globalThis,'localStorage');Object.defineProperty(globalThis,'localStorage',{configurable:true,get(){throw Error('SecurityError');}});try{assert.deepEqual(loadProgress(),{correct:0,total:0});assert.equal(saveProgress({correct:1,total:1}),false);}finally{if(original)Object.defineProperty(globalThis,'localStorage',original);else delete globalThis.localStorage;}});
