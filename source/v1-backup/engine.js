/* Deterministic, offline game engine. UI has no authority over reward calculation. */
const Engine = (()=>{
const D=typeof GAME_DATA!=='undefined'?GAME_DATA:require('./data.js');
const item=id=>D.items.find(x=>x.id===id),map=id=>D.maps.find(x=>x.id===id);
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function fresh(seed=Date.now(),origin='steady'){
 const s={version:1,seed:seed>>>0||1,origin,week:1,money:95,hp:100,focus:65,stress:0,stats:{math:3,english:3,stem:3,fitness:3,social:3,research:1},gear:{tool:'pencil',charm:null,pack:'bag'},stash:['notebook','vocab'],med:2,tonic:1,insurance:false,projects:[],mastered:[],journal:[],log:[],raid:null,ending:null,extractions:0,bosses:[],seen:[],last:null};
 if(origin==='theory'){s.stats.math+=4;s.stats.stem+=2;} if(origin==='voice'){s.stats.english+=4;s.stats.social+=2;} if(origin==='steady'){s.stats.fitness+=4;s.med+=1;}
 s.hp=attr(s).hp;note(s,'录取通知书不在战利品池里。你带着一支铅笔进入大学。');return s;
}
function random(s){s.seed=(Math.imul(1664525,s.seed)+1013904223)>>>0;return s.seed/4294967296;}
function pick(s,a){return a[Math.floor(random(s)*a.length)];}
function note(s,t){s.log.unshift(t);s.log=s.log.slice(0,60);}
function attr(s){const a={power:8,guard:1,hp:100+Math.floor(s.stats.fitness/3),focus:65,insight:0,capacity:5};Object.values(s.gear).filter(Boolean).forEach(id=>Object.entries(item(id).stats).forEach(([k,v])=>a[k]+=v));a.power+=Math.floor((s.stats.math+s.stats.stem)/7);a.guard+=Math.floor(s.stats.fitness/7);return a;}
function fix(s){const a=attr(s);s.hp=clamp(s.hp,0,a.hp);s.focus=clamp(s.focus,0,a.focus);s.stress=clamp(s.stress,0,100);}
function equip(s,id){if(s.raid||s.ending)return false;const x=item(id),i=s.stash.indexOf(id);if(!x||x.slot==='material'||i<0)return false;s.stash.splice(i,1);if(s.gear[x.slot])s.stash.push(s.gear[x.slot]);s.gear[x.slot]=id;fix(s);note(s,'装备了「'+x.name+'」。');return true;}
function sell(s,id){if(s.raid||s.ending)return false;const i=s.stash.indexOf(id);if(i<0)return false;s.stash.splice(i,1);s.money+=Math.floor(item(id).value*.65);return true;}
function buy(s,id){if(s.raid||s.ending)return false;const cost={med:16,tonic:20,insurance:28}[id];if(!cost||s.money<cost||(id==='insurance'&&s.insurance))return false;s.money-=cost;if(id==='insurance')s.insurance=true;else s[id]++;return true;}
function project(s,id){if(s.raid||s.ending||s.projects.includes(id))return false;const p=D.projects.find(x=>x.id===id);if(!p||!Object.entries(p.cost).every(([k,n])=>s.stash.filter(x=>x===k).length>=n))return false;Object.entries(p.cost).forEach(([k,n])=>{for(let i=0;i<n;i++)s.stash.splice(s.stash.indexOf(k),1)});Object.entries(p.gain).forEach(([k,v])=>s.stats[k]+=v);s.money+=p.money;s.projects.push(id);note(s,'完成项目「'+p.name+'」：留下真实的学习成果。');return true;}
function rest(s){if(s.raid||s.ending)return false;s.hp=attr(s).hp;s.focus=attr(s).focus;s.stress=Math.max(0,s.stress-35);s.money+=22;note(s,'休整与勤工助学：恢复体力、专注，压力 −35，经费 +22。本周不出征。');advance(s);return true;}
function start(s,mapId,level){if(s.raid||s.ending||s.week>32||s.hp<=0||!map(mapId)||![1,2,3].includes(level))return false;const m=map(mapId);s.raid={map:mapId,level,step:0,time:0,heat:0,bag:[],secure:null,phase:'route',choices:[],enemy:null,quiz:null,pending:null,event:null,bossWon:false,learned:0};note(s,'进入 '+m.name+' · '+['','预习','进阶','深研'][level]+'。背包里的收获还不属于你。');routes(s);return true;}
function routes(s){const r=s.raid;if(!r)return;r.phase='route';r.enemy=null;r.quiz=null;r.pending=null;
 const types=['search','study','fight','event','rest'];r.choices=[];for(let i=0;i<2;i++){let t=pick(s,types);while(r.choices.includes(t))t=pick(s,types);r.choices.push(t);}if(r.step>=4&&!r.bossWon)r.choices[1]='boss';
}
function loot(s,boss=false){const r=s.raid,m=map(r.map);let id;
 if(boss){id=pick(s,m.loot.slice(1));if(random(s)<.16)id=pick(s,['penGold','fieldbag','letter']);}
 else {const p=Math.min(.999,random(s)+(r.level-1)*.075);id=m.loot[p<.48?0:p<.8?1:p<.94?2:3];}
 if(r.bag.length>=attr(s).capacity){r.pending=id;r.phase='loot';note(s,'背包满了！发现「'+item(id).name+'」，需要取舍。');}else{r.bag.push(id);note(s,'搜获「'+item(id).name+'」'+(item(id).rarity>=3?'。你的心跳快了一拍。':'。'));}
 return id;
}
function resolveLoot(s,index){const r=s.raid;if(!r||r.phase!=='loot')return false;if(index>=0&&index<r.bag.length){const old=r.bag[index];r.bag[index]=r.pending;note(s,'放下「'+item(old).name+'」，带走「'+item(r.pending).name+'」。');}else if(index!==-1)return false;r.pending=null;routes(s);return true;}
function secure(s,index){const r=s.raid;if(!r||!['route','loot'].includes(r.phase)||index<0||index>=r.bag.length)return false;const id=r.bag[index];if(r.secure)r.bag[index]=r.secure;else r.bag.splice(index,1);r.secure=id;note(s,'已将「'+item(id).name+'」收入保险格；失利也会保留。');return true;}
function discard(s,index){const r=s.raid;if(!r||r.phase!=='route'||index<0||index>=r.bag.length)return false;note(s,'放下了「'+item(r.bag.splice(index,1)[0]).name+'」。');return true;}
function move(s,type){const r=s.raid;if(!r||r.phase!=='route'||!r.choices.includes(type))return false;r.step++;r.time++;r.heat+=7+r.level*2;s.focus=Math.max(0,s.focus-3);s.stress+=2;
 if(r.time>=12){finish(s,false,'闭馆广播响起。你错过了撤离窗口。');return true;}
 if(type==='search'){if(random(s)<.23){s.hp-=7+r.level*2;note(s,'翻找夹层时撞上突击检查，体力受损。');}if(s.hp<=0){finish(s,false,'你耗尽了体力，辅导员把你送回宿舍。');return true;}loot(s);if(r.phase!=='loot')routes(s);}
 if(type==='study')quiz(s,'study');
 if(type==='fight'||type==='boss')enemy(s,type==='boss');
 if(type==='event'){r.phase='event';r.event=pick(s,['mentor','group','shortcut','ethics','rain']);}
 if(type==='rest'){s.hp+=16;s.focus+=15;s.stress-=6;note(s,'你在楼梯间坐下，吃了点东西。体力 +16，专注 +15，压力 −6。');routes(s);}
 fix(s);return true;
}
function enemy(s,boss=false,extract=false){const r=s.raid,m=map(r.map);let hp=22+r.level*10+(boss?24:0);r.enemy={name:extract?'撤离拦截 · 临时加题':boss?m.boss:m.enemy,hp,max:hp,attack:8+r.level*3+(boss?3:0),turn:0,boss,extract,stagger:0};r.phase='combat';note(s,'遭遇 '+r.enemy.name+'。观察它下一回合的意图。');}
function quiz(s,kind){const r=s.raid,qs=D.quizzes[r.map];let candidates=qs.map((_,i)=>i).filter(i=>!s.seen.includes(r.map+':'+i));if(!candidates.length)candidates=qs.map((_,i)=>i);const index=pick(s,candidates),q=qs[index];const answers=q[1].map((text,i)=>({text,correct:i===0}));for(let i=answers.length-1;i>0;i--){const j=Math.floor(random(s)*(i+1));[answers[i],answers[j]]=[answers[j],answers[i]];}r.quiz={kind,index,question:q[0],answers,explanation:q[2]};r.phase='quiz';}
function answer(s,index){const r=s.raid;if(!r||r.phase!=='quiz'||!Number.isInteger(index)||index<0||index>2)return false;const q=r.quiz,key=r.map+':'+q.index,ok=q.answers[index].correct;
 if(!s.seen.includes(key)){s.seen.push(key);s.stats[map(r.map).stat]+=ok?2:1;r.learned++;}
 if(!s.journal.some(x=>x.key===key))s.journal.push({key,question:q.question,answer:q.answers.find(x=>x.correct).text,explanation:q.explanation});
 if(ok&&!s.mastered.includes(key))s.mastered.push(key);
 r.feedback={ok,explanation:q.explanation,answer:q.answers.find(x=>x.correct).text,kind:q.kind};r.phase='feedback';
 if(q.kind==='combat'){if(ok){const damage=19+attr(s).power+attr(s).insight;r.enemy.hp-=damage;r.enemy.stagger=1;note(s,'洞察命中，造成 '+damage+' 点论证伤害，并打断一次攻击。');}else{note(s,'洞察未命中。先读清解释，再接下一招。');}}
 else {if(ok){s.focus+=7;s.stress-=3;note(s,'概念被你真正抓住了。专注 +7。');}else{s.stress+=4;note(s,'你在错题本里留下了这一页。错误也可以成为知识。');}}
 fix(s);return true;
}
function continueFeedback(s){const r=s.raid;if(!r||r.phase!=='feedback')return false;const f=r.feedback;r.feedback=null;r.quiz=null;if(f.kind==='combat'){if(r.enemy.hp<=0)win(s);else{r.phase='combat';retaliate(s);}}else{if(f.ok)loot(s);if(s.raid&&r.phase!=='loot')routes(s);}return true;}
function retaliate(s,guard=false){const r=s.raid,e=r.enemy;if(e.stagger){e.stagger--;note(s,'对方被你的论据打断。');e.turn++;return;}const heavy=e.turn%3===2;const damage=Math.max(1,e.attack+(heavy?9:0)-attr(s).guard-(guard?10:0));s.hp-=damage;s.stress+=heavy?4:2;e.turn++;note(s,(heavy?'追问重击':'对方反击')+'：体力 −'+damage+'。');fix(s);if(s.hp<=0)finish(s,false,'体力耗尽。室友来把你捞走了。');}
function combat(s,action){const r=s.raid;if(!r||r.phase!=='combat')return false;const e=r.enemy,a=attr(s);
 if(action==='quiz'){if(s.focus<12)return false;s.focus-=12;quiz(s,'combat');return true;}
 if(action==='flee'){const damage=Math.max(2,e.attack-a.guard);s.hp-=damage;note(s,'你脱离了纠缠，体力 −'+damage+'。');if(s.hp<=0){finish(s,false,'逃离途中耗尽体力。');return true;}if(e.extract)finish(s,true,'你丢下一个普通背包战利品，冲出了教学楼。',true);else{r.heat+=12;routes(s);}return true;}
 if(!['attack','guard','burst'].includes(action))return false;
 if(action==='burst'&&s.focus<8)return false;
 let damage=a.power+Math.floor(s.stats[map(r.map).stat]/3)+Math.floor(random(s)*5);
 if(action==='guard'){damage=Math.floor(damage*.45);s.focus+=8;}
 if(action==='burst'){s.focus-=8;damage+=10;}
 e.hp-=damage;note(s,(action==='guard'?'防守反问':action==='burst'?'集中论证':'基础论证')+'造成 '+damage+' 点伤害。');fix(s);if(e.hp<=0)win(s);else retaliate(s,action==='guard');return true;
}
function win(s){const r=s.raid,e=r.enemy;note(s,'你解决了「'+e.name+'」。');s.stats[map(r.map).stat]+=e.boss?3:1;if(e.extract){finish(s,true,'最后一道问题解决。成功撤离！');return;}if(e.boss){r.bossWon=true;if(!s.bosses.includes(r.map))s.bosses.push(r.map);s.money+=25;note(s,'首领奖励：经费 +25，本次撤离不会再被拦截。');}loot(s,e.boss);if(r.phase!=='loot')routes(s);}
function use(s,type){if(s.ending||!['med','tonic'].includes(type)||s[type]<=0||s.raid&&!['route','combat','loot','event'].includes(s.raid.phase))return false;const a=attr(s);if(type==='med'&&s.hp>=a.hp||type==='tonic'&&s.focus>=a.focus)return false;s[type]--;if(type==='med')s.hp+=38;else s.focus+=30;fix(s);note(s,type==='med'?'热饭与休息：体力 +38。':'整理思路：专注 +30。');if(s.raid&&s.raid.phase==='combat')retaliate(s);return true;}
function event(s,choice){const r=s.raid;if(!r||r.phase!=='event'||![0,1].includes(choice))return false;const id=r.event;
 if(id==='mentor'){if(choice===0){s.focus=Math.max(0,s.focus-10);s.stats.research+=2;r.bag.length<attr(s).capacity?r.bag.push('idea'):s.money+=15;note(s,'你带着具体问题去办公室，得到了研究建议。科研 +2；背包满时将问题整理为勤工助学奖励 +15。');}else{s.hp+=12;s.stress-=8;note(s,'你礼貌地预约下次交流，先照顾好自己的状态。');}}
 if(id==='group'){if(choice===0){s.focus=Math.max(0,s.focus-8);s.stats.social+=2;s.money+=15;note(s,'你建立了共享任务表并划清责任。表达 +2，经费 +15。');}else{s.stress+=8;s.money+=25;note(s,'你接下全部工作。经费 +25，压力 +8；包办有代价。');}}
 if(id==='shortcut'){if(choice===0){r.heat+=18;loot(s);note(s,'你钻进资料密室：收获增加，但警戒 +18。');}else{r.heat=Math.max(0,r.heat-12);note(s,'你把捷径标在地图上，然后回到主路。警戒 −12。');}}
 if(id==='ethics'){if(choice===0){s.stats.research+=2;r.bag.length<attr(s).capacity?r.bag.push('negative'):s.money+=12;note(s,'你拒绝美化数据，记录了阴性结果。科研 +2；背包满时获得整理津贴 +12。');}else{s.focus+=12;s.stress-=5;note(s,'你暂停提交，找同学独立核查。专注 +12，压力 −5。');}}
 if(id==='rain'){if(choice===0){s.hp-=12;s.focus+=20;note(s,'你冒雨取回了备份硬盘。体力 −12，专注 +20。');}else{s.hp+=10;r.heat=Math.max(0,r.heat-8);note(s,'你在屋檐下整理笔记。体力 +10，警戒 −8。');}}
 fix(s);if(s.hp<=0)finish(s,false,'这一次，你确实需要休息了。');else if(r.phase!=='loot')routes(s);return true;
}
function extract(s){const r=s.raid;if(!r||r.phase!=='route')return false;if(!r.step){finish(s,true,'你判断准备不足，主动结束了本周探索。');return true;}const risk=extractionRisk(s);if(random(s)<risk){note(s,'撤离途中被临时加题拦截！');enemy(s,false,true);}else finish(s,true,'你赶上了末班校园巴士。成功撤离！');return true;}
function extractionRisk(s){const r=s.raid;return r.bossWon?0:clamp((r.heat-15)/125+s.stress/600,0,.72);}
function finish(s,success,text,drop=false){const r=s.raid;if(!r)return;const originalCount=r.bag.length+(r.secure?1:0);if(drop&&r.bag.length)r.bag.pop();const kept=success?r.bag.slice():s.insurance?r.bag.slice(0,Math.ceil(r.bag.length/2)):[];if(r.secure)kept.push(r.secure);s.stash.push(...kept);if(success){s.extractions++;s.money+=10+r.step*3;}else{s.stress+=12;s.hp=Math.max(35,s.hp);s.money=Math.max(0,s.money-12);}s.last={success,text,kept,lost:originalCount-kept.length,map:r.map,steps:r.step,learned:r.learned};note(s,text+' 带回 '+kept.length+' 件物品。');s.insurance=false;s.raid=null;s.hp+=12;s.focus+=18;fix(s);advance(s);}
function advance(s){s.week++;if(s.week>32){s.ending=admission(s);}else if((s.week-1)%4===0){s.money+=35;s.stress=Math.max(0,s.stress-8);note(s,'新学期开始。助学金 +35，压力 −8。');}}
function admission(s){const t=s.stats;const paths=[{name:'理论与计算',score:t.math*1.2+t.stem+t.research*1.4+t.english*.7+t.social*.4},{name:'实验与交叉科学',score:t.stem*1.2+t.research*1.5+t.math*.6+t.english*.7+t.social*.5},{name:'跨学科研究与传播',score:t.social*1.2+t.english+t.research*1.3+t.stem*.5+t.math*.5}];paths.sort((a,b)=>b.score-a.score);const score=Math.round(paths[0].score+s.projects.length*12+s.bosses.length*3);const top=score>=125&&s.projects.length>=2&&t.english>=8&&t.research>=12;const good=score>=78&&s.projects.length>=1;return {score,path:paths[0].name,tier:top?'名校 PhD · 双向选择':good?'研究型项目 · 新的起点':'长线成长 · 下一站再出发',text:top?'一封来自虚构的「北辰研究院」的全奖博士录取邮件亮起。面谈后，你确认了研究契合与指导方式，再按下接受。':good?'你收到虚构的「远川大学」研究型项目邀请。你选择适合自己的团队，继续积累研究经验。':'这次申请没有得到理想结果。你留下了知识、作品和更清晰的方向，可以选择研究助理、继续学习或重新申请。',top};}
return {fresh,attr,equip,sell,buy,project,rest,start,move,resolveLoot,secure,discard,answer,continueFeedback,combat,use,event,extract,extractionRisk,admission,item,map,random};
})();
if(typeof module!=='undefined')module.exports=Engine;
