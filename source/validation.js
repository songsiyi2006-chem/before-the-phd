function validateSave(s,D){
try{
 const num=n=>typeof n==='number'&&Number.isFinite(n)&&n>=0&&n<1e9,integer=n=>num(n)&&Number.isInteger(n),id=x=>D.items.some(it=>it.id===x),map=x=>D.maps.some(m=>m.id===x),strings=a=>Array.isArray(a)&&a.length<=10000&&a.every(x=>typeof x==='string'),itemList=a=>Array.isArray(a)&&a.length<=10000&&a.every(id),keys=a=>strings(a)&&a.every(k=>{const [m,n]=k.split(':');return map(m)&&/^\d+$/.test(n)&&Number(n)<D.quizzes[m].length;});
 if(!s||s.version!==2||!integer(s.week)||s.week<1||!Number.isInteger(s.seed)||s.seed<0||s.seed>4294967295||!['theory','voice','steady'].includes(s.origin))return false;
 if(!['money','hp','focus','stress','med','tonic','extractions','spent','services','redDry','redFound'].every(k=>num(s[k]))||s.stress>100)return false;
 if(typeof s.insurance!=='boolean'||typeof s.freeplay!=='boolean'||!Array.isArray(s.history))return false;
 if(s.targetSchool!==undefined&&!D.goals.some(g=>g.id===s.targetSchool))return false;
 if(!s.freeplay&&s.week>33||s.ending&&s.raid||!s.freeplay&&(s.week===33)!==Boolean(s.ending))return false;
 if(!s.stats||!Object.keys(D.stats).every(k=>num(s.stats[k]))||!s.gear||!Object.keys(D.slots).every(k=>s.gear[k]===null||id(s.gear[k])&&D.items.find(it=>it.id===s.gear[k]).slot===k))return false;
 if(!itemList(s.stash)||!strings(s.log)||!strings(s.projects)||!s.projects.every(k=>D.projects.some(p=>p.id===k))||!strings(s.bosses)||!s.bosses.every(map))return false;
 if(!keys(s.seen)||!keys(s.mastered)||!keys(s.credited)||!Array.isArray(s.journal)||s.journal.length>10000||!s.journal.every(q=>q&&['key','question','answer','explanation'].every(k=>typeof q[k]==='string')&&keys([q.key])))return false;
 if(!s.tech||Array.isArray(s.tech)||typeof s.tech!=='object'||!Object.entries(s.tech).every(([k,n])=>D.tech.some(t=>t.id===k&&integer(n)&&n<=t.max)))return false;
 const prep=p=>p===null||p&&p.power===3&&p.guard===2&&p.luck===4;
 if(!prep(s.prep))return false;
 const ending=e=>e&&['tier','text','path'].every(k=>typeof e[k]==='string')&&num(e.score)&&typeof e.top==='boolean';
 if(s.ending&&!ending(s.ending)||!s.history.every(h=>integer(h.week)&&ending(h.ending)))return false;
 if(s.last&&(!itemList(s.last.kept)||!map(s.last.map)||typeof s.last.text!=='string'||typeof s.last.success!=='boolean'||!['lost','steps','learned'].every(k=>num(s.last[k]))))return false;
 const quiz=(q,m)=>q&&integer(q.index)&&q.index<D.quizzes[m].length&&typeof q.question==='string'&&typeof q.explanation==='string'&&Array.isArray(q.answers)&&q.answers.length===3&&q.answers.every(a=>a&&typeof a.text==='string'&&typeof a.correct==='boolean')&&q.answers.filter(a=>a.correct).length===1;
 if(s.practice&&(!map(s.practice.map)||!quiz(s.practice,s.practice.map)||typeof s.practice.answered!=='boolean'))return false;
 if(s.raid){const r=s.raid;if(s.practice||!map(r.map)||![1,2,3,4,5].includes(r.level)||!['route','combat','quiz','feedback','loot','event'].includes(r.phase)||!itemList(r.bag)||r.bag.length>30||![r.step,r.time,r.heat,r.learned].every(integer)||r.time>=12||r.secure!==null&&!id(r.secure)||!strings(r.choices)||r.choices.some(t=>!['search','study','fight','event','rest','boss'].includes(t)))return false;
  if(r.prep!==undefined&&!prep(r.prep))return false;
  if(r.combo){const c=r.combo;if(!['quiz','feedback'].includes(r.phase)||r.level<4||c.total!==(r.level===5?3:2)||!integer(c.done)||c.done>c.total||!Array.isArray(c.used)||c.used.length<1||c.used.length>c.total||new Set(c.used).size!==c.used.length||!c.used.every(i=>integer(i)&&i<D.quizzes[r.map].length))return false;}
  if(r.lootQueue!==undefined&&(!itemList(r.lootQueue)||r.lootQueue.length>6||r.lootQueue.length&&r.phase!=='loot'))return false;
  if(r.enemy&&(!num(r.enemy.max)||typeof r.enemy.hp!=='number'||!Number.isFinite(r.enemy.hp)||!num(r.enemy.attack)||!integer(r.enemy.turn)||!integer(r.enemy.stagger)||typeof r.enemy.name!=='string'))return false;
  if(r.phase==='combat'&&!r.enemy)return false;
  if(r.phase==='quiz'&&(!quiz(r.quiz,r.map)||!['study','combat'].includes(r.quiz.kind)||r.quiz.kind==='combat'&&!r.enemy))return false;
  if(r.phase==='feedback'&&(!r.feedback||typeof r.feedback.ok!=='boolean'||typeof r.feedback.answer!=='string'||typeof r.feedback.explanation!=='string'||!['study','combat'].includes(r.feedback.kind)||r.feedback.kind==='combat'&&!r.enemy))return false;
  if(r.phase==='loot'&&!id(r.pending)||r.phase==='event'&&!['mentor','group','shortcut','ethics','rain'].includes(r.event))return false;
 }
 return true;
}catch{return false;}
}
if(typeof module!=='undefined')module.exports=validateSave;
