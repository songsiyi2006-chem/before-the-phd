function extendGameData(D){
const extra=typeof EXTRA_QUESTIONS!=='undefined'?EXTRA_QUESTIONS:require('./questions.js');
for(const key of Object.keys(D.quizzes))D.quizzes[key].push(...extra[key]);
D.questionCount=Object.values(D.quizzes).reduce((n,a)=>n+a.length,0);
D.rarities.push('绯红 · 传承');
D.items.push(...[
 ['axiom','绯红公理棱镜','tool','prism',820,{power:18,insight:7},'没有跳过的步骤，才配折射出最后一道光。','红宝石色晶体 / 钛合金框架'],
 ['quantum','赤曜计算核心','tool','reactor',900,{power:22,guard:3,focus:15},'算力可以扩展，问题的边界仍需要你来定义。','陶瓷晶圆 / 液冷回路 / 红色光导'],
 ['heartseal','求真者的绯红印章','charm','seal',780,{guard:8,insight:6,hp:20},'它承认错误，拒绝伪造，也从不停止追问。','黑曜石握柄 / 朱砂色晶体 / 蚀刻银环'],
 ['archivepack','赤帆移动档案箱','pack','case',850,{capacity:8,guard:4},'每一份原始记录，都有抵达下一站的权利。','碳纤维外壳 / 酒红皮革 / 精密金属锁扣'],
 ['paradigm','跨越范式的手稿','material','codex',680,{},'真正的新意，不是换个术语，而是提出了可以检验的新问题。','绯红书衣 / 银箔烫印 / 半透明图纸'],
 ['redproof','多中心复现档案','material','codex',720,{},'不同团队、不同环境。它记录一致，也认真标出分歧。','朱红档案夹 / 银质封签 / 可追溯记录']
].map(([id,name,slot,icon,value,stats,lore,material])=>({id,name,slot,icon,value,stats,lore,material,rarity:5})));
D.difficulties=[
 {id:1,name:'预习',rates:[44,30,20,5,1,0],boss:[0,15,48,28,8,1],hp:32,attack:11,heat:9,tier:1,fee:0,desc:'先站稳脚跟，理解基本概念。'},
 {id:2,name:'进阶',rates:[25,30,29,12,3.8,.2],boss:[0,8,40,36,14,2],hp:45,attack:15,heat:11,tier:2,fee:0,desc:'更多应用题，史诗及以上基础概率 16%。'},
 {id:3,name:'深研',rates:[12,22,34,24,7,1],boss:[0,3,25,42,24,6],hp:62,attack:20,heat:13,tier:3,fee:0,desc:'覆盖全部题层，稀有以上达到 66%。'},
 {id:4,name:'资格试炼',rates:[5,13,32,32,15,3],boss:[0,0,15,39,34,12],hp:87,attack:28,heat:15,tier:3,fee:45,desc:'盲区追问：洞察答错额外承伤 5。'},
 {id:5,name:'学术深渊',rates:[2,8,25,37,22,6],boss:[0,0,15,25,40,20],hp:118,attack:36,heat:17,tier:3,fee:85,desc:'连续质询：每两次反击一记重击；答错额外承伤 9。'}
];
D.tech=[
 {id:'reason',branch:'研究方法',name:'论证结构',max:5,base:90,growth:1.65,pre:null,effect:'每级：论证 +2',stats:{power:2}},
 {id:'memory',branch:'研究方法',name:'间隔学习系统',max:4,base:140,growth:1.7,pre:['reason',2],effect:'每级：专注上限 +8',stats:{focus:8}},
 {id:'insight',branch:'研究方法',name:'概念连接网络',max:5,base:180,growth:1.7,pre:['memory',2],effect:'每级：洞察 +3',stats:{insight:3}},
 {id:'dialectic',branch:'研究方法',name:'反思性提问',max:3,base:280,growth:1.8,pre:['insight',2],effect:'每级：战斗洞察耗费 −1 专注',stats:{}},
 {id:'recovery',branch:'远征保障',name:'恢复管理',max:5,base:85,growth:1.6,pre:null,effect:'每级：体力上限 +10',stats:{hp:10}},
 {id:'shield',branch:'远征保障',name:'压力下的应对',max:4,base:150,growth:1.7,pre:['recovery',2],effect:'每级：防御 +2',stats:{guard:2}},
 {id:'storage',branch:'远征保障',name:'模块化收纳',max:3,base:220,growth:1.8,pre:['shield',1],effect:'每级：背包 +1 格',stats:{capacity:1}},
 {id:'evac',branch:'远征保障',name:'校园撤离网络',max:3,base:260,growth:1.85,pre:['storage',1],effect:'每级：撤离拦截率 −4 个百分点',stats:{}},
 {id:'survey',branch:'探索与发现',name:'资料检索术',max:5,base:100,growth:1.75,pre:null,effect:'每级：将 2 个百分点低品质概率转为史诗 +1.4、典藏 +0.6',stats:{}},
 {id:'salvage',branch:'探索与发现',name:'同伴回收协议',max:3,base:170,growth:1.8,pre:['survey',2],effect:'每级：同伴支援的保留比例 +10 个百分点',stats:{}},
 {id:'relic',branch:'探索与发现',name:'绯红线索辨识',max:4,base:320,growth:1.9,pre:['salvage',1],effect:'每级：绯红掉率 +0.25 个百分点，来自低品质概率',stats:{}},
 {id:'curator',branch:'探索与发现',name:'传承修复工坊',max:1,base:650,growth:1,pre:['relic',2],effect:'解锁定向制作绯红装备；每件消耗 1800 经费和材料',stats:{}}
];
D.redRecipes={axiom:{proof:2,idea:1,paradigm:1},quantum:{code:2,replica:1,redproof:1},heartseal:{negative:2,idea:1,redproof:1},archivepack:{notebook:3,replica:1,paradigm:1}};
D.mapPools={
 math:['notebook','calc','proof','compass','penGold','axiom','paradigm'],
 english:['notebook','vocab','coffee','abstract','tablet','compass','letter','heartseal','paradigm'],
 sport:['bag','notebook','energy','shoes','badge','fieldbag','compass','letter','heartseal','archivepack'],
 elective:['credit','vocab','energy','badge','poster','idea','letter','archivepack','paradigm'],
 stem:['notebook','data','calc','code','spectro','compass','penGold','quantum','redproof'],
 lab:['notebook','data','negative','code','replica','spectro','penGold','quantum','redproof'],
 conference:['credit','vocab','abstract','poster','idea','compass','letter','heartseal','paradigm']
};
return (typeof extendCollections!=='undefined'?extendCollections:require('./collections.js'))(D);
}
if(typeof module!=='undefined')module.exports=extendGameData;else extendGameData(GAME_DATA);
