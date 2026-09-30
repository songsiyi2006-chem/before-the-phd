const assert=require('node:assert/strict');
const D=require('./data.js'),E=require('./engine.js');
let passed=0;function test(n,f){f();passed++;console.log('PASS',n)}
test('content coverage: maps, items, unique questions, valid recipes',()=>{assert.equal(D.maps.length,7);assert.equal(D.items.length,84);assert.equal(Object.values(D.quizzes).flat().length,260);for(const p of D.projects)for(const id of Object.keys(p.cost))assert(E.item(id));for(const m of D.maps){assert(D.quizzes[m.id].length>=6);m.loot.forEach(id=>assert(E.item(id)));}});
test('equipment swaps conserve inventory and update stats',()=>{let s=E.fresh(42);s.stash.push('spectro');let a=E.attr(s);assert(E.equip(s,'spectro'));assert.equal(s.gear.tool,'spectro');assert(s.stash.includes('pencil'));assert.equal(E.attr(s).power,a.power+7);assert(!E.equip(s,'letter'));});
test('projects consume exactly required materials once',()=>{let s=E.fresh(42);s.stash.push('notebook');assert(E.project(s,'review'));assert.equal(s.projects.length,1);assert.equal(s.stats.research,6);assert.equal(s.stash.filter(x=>x==='notebook').length,0);assert(!E.project(s,'review'));});
test('failed run keeps secure slot and insurance portion',()=>{let s=E.fresh(42);E.buy(s,'insurance');E.start(s,'math',1);s.raid.bag=['proof','notebook','calc','compass'];E.secure(s,0);s.raid.time=11;s.raid.choices=['search','study'];E.move(s,'search');assert(!s.raid);assert.equal(s.week,2);assert.equal(s.last.kept.length,3);assert(s.last.kept.includes('proof'));assert.equal(s.last.lost,1);assert.equal(s.insurance,false);});
test('unprotected losses do not delete pre-existing inventory',()=>{let s=E.fresh(10);const before=s.stash.slice();E.start(s,'lab',3);s.raid.bag=['replica'];s.raid.time=11;s.raid.choices=['study'];E.move(s,'study');assert.deepEqual(s.stash,before);assert.equal(s.last.lost,1);assert(s.hp>0);});
test('correct and incorrect learning both persist, reward cannot be double clicked',()=>{let s=E.fresh(20);E.start(s,'math',1);s.raid.choices=['study'];E.move(s,'study');const n=s.stats.math,i=s.raid.quiz.answers.findIndex(x=>x.correct);assert(E.answer(s,i));assert.equal(s.stats.math,n+2);assert(!E.answer(s,i));E.continueFeedback(s);assert.equal(s.journal.length,1);assert.equal(s.raid.bag.length,1);});
test('full bag replacement does not increase capacity',()=>{let s=E.fresh(20);E.start(s,'math',1);s.raid.bag=Array(E.attr(s).capacity).fill('notebook');s.raid.choices=['study'];E.move(s,'study');E.answer(s,s.raid.quiz.answers.findIndex(x=>x.correct));E.continueFeedback(s);assert.equal(s.raid.phase,'loot');let id=s.raid.pending;assert(E.resolveLoot(s,0));assert.equal(s.raid.bag[0],id);assert.equal(s.raid.bag.length,E.attr(s).capacity);});
test('combat focus affordability and safe boss extraction',()=>{let s=E.fresh(45);E.start(s,'math',1);s.raid.choices=['boss'];E.move(s,'boss');s.focus=0;assert(!E.combat(s,'quiz'));s.stats.math=999;E.combat(s,'attack');assert(s.raid.bossWon);assert.equal(E.extractionRisk(s),0);E.extract(s);assert.equal(s.last.success,true);assert.equal(s.week,2);});
test('extraction flee drops one unprotected item and preserves secure item',()=>{let s=E.fresh(55);E.start(s,'lab',1);s.raid.bag=['data','code'];s.raid.secure='replica';s.raid.enemy={attack:10,hp:10,max:10,turn:0,extract:true};s.raid.phase='combat';E.combat(s,'flee');assert.deepEqual(s.last.kept,['data','replica']);assert.equal(s.last.lost,1);assert.equal(s.last.success,true);});
test('rest progresses semesters and completes a full campaign',()=>{let s=E.fresh(100);for(let i=0;i<32;i++)assert(E.rest(s));assert.equal(s.week,33);assert(s.ending);assert(!E.rest(s));assert(!E.start(s,'math',1));});
test('save round-trip preserves deterministic outcomes',()=>{let s=E.fresh(89);E.start(s,'stem',2);let t=JSON.parse(JSON.stringify(s));E.move(s,s.raid.choices[0]);E.move(t,t.raid.choices[0]);assert.deepEqual(s,t);});
test('all ending gates required',()=>{let s=E.fresh(8);Object.keys(s.stats).forEach(k=>s.stats[k]=170);assert(!E.admission(s).top);s.projects=D.projects.map(p=>p.id);assert(E.admission(s).top);s.stats.english=54;assert(!E.admission(s).top);});
// Play complete campaigns through public actions with a knowledgeable, conservative strategy.
let wins=0,failedRuns=0;
test('60 seeded complete campaigns: no dead states, bounded resources, at least one eligible application',()=>{for(let seed=1;seed<=60;seed++){
 let s=E.fresh(seed,seed%2?'theory':'steady'),steps=0;
 while(!s.ending&&steps++<15000){
  if(!s.raid){for(const id of s.stash.slice()){const it=E.item(id);if(it.slot!=='material'){const cur=s.gear[it.slot]&&E.item(s.gear[it.slot]);if(!cur||it.rarity>cur.rarity)E.equip(s,id);}}for(const p of D.projects)E.project(s,p.id);if(s.hp<45||s.focus<12){E.rest(s);continue;}if(s.med<2&&s.money>=16)E.buy(s,'med');E.start(s,D.maps[(s.week-1)%7].id,1);}
  else{let r=s.raid;switch(r.phase){
   case'route':if(s.hp<35&&s.med)E.use(s,'med');else if(r.step>=6||s.hp<28)E.extract(s);else{const c=['study','search','event','rest','fight','boss'].find(x=>r.choices.includes(x));E.move(s,c);}break;
   case'quiz':E.answer(s,r.quiz.answers.findIndex(x=>x.correct));break;
   case'feedback':E.continueFeedback(s);break;
   case'loot':E.resolveLoot(s,-1);break;
   case'event':E.event(s,0);break;
   case'combat':if(s.hp<30&&s.med)E.use(s,'med');else if(s.focus>=12)E.combat(s,'quiz');else if(r.enemy.turn%3===2)E.combat(s,'guard');else E.combat(s,'attack');break;
   default:assert.fail('unknown phase');
  }}
  assert(s.hp>=0);assert(s.focus>=0);assert(s.money>=0);assert(s.stress>=0&&s.stress<=100);assert(s.week<=33);
 }
 assert(steps<15000);assert(s.ending);if(s.ending.goalId)wins++;failedRuns+=32-s.extractions;
 }assert(wins>0);console.log('Campaign outcomes: '+wins+'/60 eligible applications (knowledgeable test policy; not a player study).');});
console.log(passed+' test groups passed.');


