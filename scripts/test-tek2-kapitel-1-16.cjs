// Requires linkedom. Run with NODE_PATH pointing to installed modules if needed.
// node scripts/test-tek2-kapitel-1-16.cjs
// linkedom is used only for offline verification; no real result is transmitted.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const {parseHTML} = require('linkedom');
const html = fs.readFileSync('teknik2-kapitel-1-16-testprov-r4n8.html','utf8');
const code = html.match(/<script>\s*([\s\S]*?)<\/script>/)[1];
function setup(){
 const {document, window} = parseHTML(html); const stored=new Map(), requests=[]; let copied='', downloaded='';
 window.scrollTo=()=>{}; window.location={pathname:'/teknik2-kapitel-1-16-testprov-r4n8.html'};
 const context=vm.createContext({document,window,console,Intl,Date,Math,Blob,
 URL:{createObjectURL(blob){downloaded=blob;return 'blob:test';},revokeObjectURL(){}},
 localStorage:{setItem:(k,v)=>stored.set(k,v)}, navigator:{clipboard:{writeText:async text=>{copied=text;}}},
 fetch:(url,options)=>{requests.push({url,...options});return Promise.resolve({});}});
 vm.runInContext(code,context);
 return {context,document,stored,requests,get copied(){return copied;},get downloaded(){return downloaded;},run:s=>vm.runInContext(s,context)};
}
(async()=>{
 const t=setup();
 t.run(`for(let trial=0;trial<1000;trial++) {const qs=prepareQuestions(); if(qs.length!==20 || new Set(qs.map(q=>q.id)).size!==20) throw Error('questions'); const counts=[0,0,0,0]; for(const q of qs) {counts[q.correctIndex]++;if(q.options.length!==4 || new Set(q.options).size!==4 || q.options[q.correctIndex]!==q.correct)throw Error('answer mismatch');} if(counts.some(n=>n!==5))throw Error('balance');}`);
 t.run('state.studentName=""'); t.document.querySelector('#student-name').value='   ';t.run('startTest({preventDefault(){}})');assert.equal(t.run('state.questions.length'),0);assert.equal(t.document.querySelector('#start-error').hidden,false);
 t.document.querySelector('#student-name').value='Automattest';t.run('startTest({preventDefault(){}})');t.run('advance({preventDefault(){}})');assert.equal(t.run('state.current'),0);assert.equal(t.requests.length,0);
 t.run('submitTest()');assert.equal(t.run('state.result'),null);assert.equal(t.requests.length,0);
 t.run('state.answers=state.questions.map(q=>q.correctIndex);submitTest()');assert.equal(t.run('state.result.score'),20);assert.equal(t.run('state.result.percent'),100);
 assert.equal(t.stored.size,1);assert.match([...t.stored.keys()][0],/teknik2-kapitel-1-16-r4n8/);assert.equal(JSON.parse([...t.stored.values()][0]).score,20);
 t.run('submitTest()');assert.equal(t.requests.length,1);
 const u=setup();u.document.querySelector('#student-name').value='Blandtest';u.run('startTest({preventDefault(){}});state.answers=state.questions.map((q,i)=>i%2?q.correctIndex:(q.correctIndex+1)%4);submitTest()');
 assert.equal(u.run('state.result.score'),10);assert.equal(u.run('state.result.percent'),50);assert.equal(u.run('state.result.wrong.length'),10);assert.ok(u.run('state.result.recommendations.length')<=3);
 const payload=JSON.parse(u.requests[0].body);assert.deepEqual(Object.keys(payload).sort(),['type','testId','studentName','score','total','percent','recommendations','pagePath'].sort());assert.equal(payload.score,10);assert.equal(payload.testId,'teknik2-kapitel-1-16-r4n8');assert.equal(u.requests[0].headers['Content-Type'],'text/plain;charset=utf-8');
 const w=setup();w.document.querySelector('#student-name').value='Kodtest';w.run('startTest({preventDefault(){}});state.answers=state.questions.map(q=>q.material?(q.correctIndex+1)%4:q.correctIndex);submitTest()');
 const md=w.run('markdownResult()');for(const text of ['Kodtest','Datum:','18 av 20','Prioriterade områden','Ditt svar:','Rätt svar:','Förklaring:','Pseudokod:','total ← pris + antal','FÖR VARJE'])assert.ok(md.includes(text),text);
 assert.equal(w.document.querySelectorAll('.wrong-item pre').length,2);
 w.run('downloadMarkdown()');assert.equal(await w.downloaded.text(),md);await w.run('copySummary()');assert.match(w.copied,/Kodtest: 18 av 20/);
 assert.ok(!fs.readFileSync('index.html','utf8').includes('testprov-r4n8'));
 console.log('PASS: 1 000 shuffle trials; 20 unique questions; 5 correct per A–D; correct identity; required name; unanswered guard; 20/20 and 10/20 grading; code review; MD download; clipboard; storage; summary-only JSON; duplicate-submit guard; unlisted.');
})();
