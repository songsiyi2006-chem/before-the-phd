function extendCollections(D){
const rows=`
4|g_astrolabe|金穹浑天仪|tool|armillary|360|power:12,insight:5|math,stem|坐标改变，关系依然可以追寻。|黄铜环架 / 黑曜石底座|XYZ
4|g_telescope|黎明折射望远镜|tool|telescope|375|power:14,focus:8|stem,lab|先校准镜头，再决定看见了什么。|镀金镜筒 / 光学玻璃|OPT
4|g_keyboard|静夜机械键盘|tool|keyboard|340|power:13,focus:12|stem,lab|把原始数据另存一份，是今晚最重要的快捷键。|铝面板 / 琥珀键帽|CODE
4|g_camera|田野记录相机|tool|camera|350|power:10,insight:7|elective,conference|镜头外的采样条件，也需要记录。|香槟金机身 / 皮革握把|OBS
4|g_caliper|误差边界游标尺|tool|caliper|330|power:12,guard:3|math,lab|多一位小数不一定多一分真实。|拉丝黄铜 / 蓝钢刻线|SIG
4|g_headset|同声思考耳机|tool|headset|345|power:11,focus:20|english,conference|听懂限定词，比抢先回答更重要。|金属耳罩 / 深绿软垫|LISTEN
4|g_lantern|文献长明灯|tool|lantern|355|power:10,insight:4,focus:16|english,elective|把引用追到源头，灯才照亮问题。|磨砂玻璃 / 铜质护笼|SOURCE
4|g_board|可检验假说板|tool|board|370|power:15,guard:1|math,stem|好假说会说明什么结果能推翻它。|珐琅框 / 深青玻璃|H0
4|g_hourglass|间隔复习沙漏|charm|hourglass|320|focus:22,insight:3|math,english|恰好费力的提取，让记忆更牢。|石英砂 / 黄铜立柱|RECALL
4|g_medal|稳态训练奖章|charm|medal|305|hp:28,guard:3|sport|它奖励长期稳定，而非一次拼命。|珐琅徽面 / 编织绶带|PACE
4|g_ring|同行互助指环|charm|ring|335|guard:5,focus:10|elective,conference|明确的帮助请求，让合作真正发生。|双色合金 / 微刻纹路|ALLY
4|g_globe|跨学科微缩地球|charm|globe|365|insight:7,focus:12|elective,stem|借来工具，也要理解它的假设。|青金石球 / 镀金支架|LINK
4|g_watch|节奏管理怀表|charm|watch|330|guard:4,hp:16,focus:8|sport,elective|日程里写得下空白，才容得下意外。|机械机芯 / 拉丝金壳|REST
4|g_key|开放科学钥匙|charm|key|350|insight:5,guard:4|lab,conference|让别人能读懂并重新运行你的方法。|黄铜钥身 / 蓝色珐琅|OPEN
4|g_shoes|长跑配速鞋|charm|shoe|315|hp:35,guard:2|sport|适合自己的速度，才可能一直跑下去。|金线织物 / 缓震中底|RUN
4|g_cup|早八保温杯|charm|cup|300|hp:20,focus:18|english,elective|这次没有用第四杯咖啡替代睡眠。|双层钛壁 / 暖金杯盖|08AM
4|g_compass|问题导向罗盘|charm|compass|355|insight:8,hp:10|math,conference|先问解决什么，再问使用什么。|镀金刻度 / 深蓝表盘|WHY
4|g_satchel|文献邮差包|pack|satchel|340|capacity:6,focus:10|english,elective|摘要、正文与补充材料各有隔层。|栗色皮革 / 金属插扣|READ
4|g_case|野外采样硬壳箱|pack|case|380|capacity:7,guard:2|lab,stem|样品会说话，前提是标签没有掉。|蜂窝合金 / 金色包角|FIELD
4|g_roll|会议海报卷筒|pack|rollcase|330|capacity:6,insight:3|conference,english|一张海报讲一条主线，行囊装下更多追问。|碳纤维筒 / 黄铜端盖|POSTER
4|g_bag|运动远征背囊|pack|bag|350|capacity:7,hp:12|sport|水、热饭、干衣服，远征不只需要雄心。|橄榄帆布 / 镀金扣具|TRAIL
4|g_drive|便携数据保险箱|pack|drive|390|capacity:5,guard:4,focus:12|stem,lab|整理好的数据比塞满的磁盘更有用。|金属护框 / 防震硅胶|BACKUP
4|g_bound|误差预算报告|material|scroll|260||math,lab|每一种不确定度的来源都摆在桌面上。|纤维纸 / 金箔封条|ERROR
4|g_corpus|平行语料索引|material|codex|270||english,conference|词的意义，要放回它出现的上下文。|琥珀书脊 / 分类页签|CORPUS
4|g_protocol|预注册研究协议|material|board|285||lab,elective|看到答案以前，先写清问题与分析方式。|钛金夹板 / 压纹纸|PLAN
4|g_benchmark|独立基准数据盘|material|drive|290||stem,lab|训练集再漂亮，也不能替代独立检验。|镀金端口 / 标签|TEST
4|g_training|周期训练档案|material|book|245||sport|训练量、休息和状态，需要一起看。|金线装订 / 防水纸页|LOAD
4|g_review|跨领域综述地图|material|globe|280||conference,elective|画出共识，也诚实保留争议。|铜质球面 / 微刻网络|REVIEW
5|r_tensor|绯红张量织机|tool|armillary|940|power:20,insight:8|math,stem|坐标变了，真正的关系仍在那里。|玫瑰铜环 / 绯红晶轴|TENSOR
5|r_telescope|红移深空镜|tool|telescope|980|power:24,focus:12|stem,lab|光走了很久，你也愿意多核对一次误差。|黑钛镜筒 / 红宝石镀膜|SHIFT
5|r_keyboard|可复现演算终端|tool|keyboard|910|power:21,focus:25|stem,lab|从环境到随机种子，每一步都留有来路。|黑陶瓷键帽 / 绯红光导|REPRO
5|r_camera|因果现场记录仪|tool|camera|920|power:18,insight:11|elective,conference|相关性，还需要识别策略来解释。|深红合金 / 双层镜组|CAUSE
5|r_caliper|极限精度量规|tool|caliper|900|power:22,guard:5|math,lab|精度的尽头，是对测量边界的清醒。|黑钛滑轨 / 红宝石触点|LIMIT
5|r_headset|跨语境共鸣耳机|tool|headset|925|power:19,focus:35,insight:3|english,conference|准确转述不同立场，是讨论的开始。|绯红陶瓷 / 银织耳垫|CONTEXT
5|r_lantern|证据链恒星灯|tool|lantern|930|power:18,insight:7,focus:22|english,elective|明亮的结论，连着可追溯的证据。|水晶灯芯 / 黑钛护笼|TRACE
5|r_board|反例解构台|tool|board|960|power:26,guard:2|math,stem|一个有效反例，胜过百次重复肯定。|绯红玻璃 / 银质轨道|FALSE
5|r_hourglass|长期主义时砂|charm|hourglass|850|focus:36,insight:6|math,english|沙粒没有捷径，理解也一样。|绯红石英 / 铂色双环|TIME
5|r_medal|耐力与恢复勋章|charm|medal|820|hp:48,guard:6|sport|把恢复写进计划，是成熟的一部分。|朱红珐琅 / 深灰绶带|RECOVER
5|r_ring|开放协作之环|charm|ring|860|guard:8,focus:22|elective,conference|让贡献被看见，让责任有归属。|铂金双环 / 红色晶石|CREDIT
5|r_globe|交叉科学星球仪|charm|globe|910|insight:12,focus:20|elective,stem|不同领域相遇时，先对齐语言。|黑曜石球 / 绯红星图|CROSS
5|r_watch|从容撤离怀表|charm|watch|875|guard:7,hp:28,focus:15|sport,elective|决定回头的时刻，也是一种判断力。|红金机芯 / 黑钛壳体|RETURN
5|r_key|共享知识秘钥|charm|key|885|insight:9,guard:7|lab,conference|能被别人检验的知识，才会走得更远。|红宝石齿芯 / 镂空银柄|FAIR
5|r_shoes|赤轨长征跑鞋|charm|shoe|840|hp:58,guard:4|sport|不必赢过每个人，先跑完自己的路。|绯红编织 / 碳板支撑|ENDURE
5|r_drone|同伴守望飞行器|charm|drone|940|guard:10,insight:5|stem,sport|它巡视归途，也提醒你电量并非无限。|黑碳机翼 / 绯红信标|WATCH
5|r_compass|未解问题星盘|charm|compass|900|insight:14,hp:18|math,conference|知道哪里还不知道，是另一种抵达。|铂色刻度 / 绯红星砂|UNKNOWN
5|r_satchel|红岸远征邮差包|pack|satchel|890|capacity:9,focus:20|english,elective|从第一份课堂笔记，到第一次独立研究。|酒红皮革 / 银扣背带|JOURNEY
5|r_roll|跨洋学术卷筒|pack|rollcase|880|capacity:9,insight:6|conference,english|带走的不是掌声，而是问题清单。|黑钛筒体 / 绯红端盖|DIALOG
5|r_bag|极昼野外研究囊|pack|bag|930|capacity:11,hp:18|sport,lab|装得越多，越需决定何时回去。|绯红防水织物 / 陶瓷扣具|EXPED
5|r_drive|永续数据方舟|pack|drive|970|capacity:8,guard:6,focus:18|stem,lab|备份是定期验证过的恢复，而非信念。|黑钛外壳 / 多重光导|ARK
5|r_atlas|跨尺度理论图谱|material|polyhedron|740||math,stem|从局部到整体，桥梁需要交代适用范围。|绯红晶格 / 银丝连接|SCALE
5|r_consensus|多语境共识手卷|material|scroll|730||english,conference,elective|共识不是消除差异，而是标明共同部分。|朱红卷轴 / 铂金封签|CONSENSUS
5|r_longstudy|十年纵向研究档案|material|codex|760||sport,lab,elective|时间带来证据，也带来失访与新的问题。|深绯皮封 / 时间索引|FOLLOWUP
`;
const added=rows.trim().split('\n').map((row,i)=>{const [rarity,id,name,slot,icon,value,statText,maps,lore,material,glyph]=row.split('|');return {id,name,slot,icon,value:+value,stats:statText?Object.fromEntries(statText.split(',').map(x=>{const [k,v]=x.split(':');return [k,+v];})): {},lore,material,rarity:+rarity,maps:maps.split(','),glyph,variant:i%4};});
D.items.push(...added);
D.items.push(
 {id:'iridescent_orbit',name:'万象归一 · 炫彩星核',slot:'tool',icon:'infinity',rarity:5,prismatic:true,value:60000,stats:{power:48,insight:22,focus:55},material:'多色干涉晶体 / 悬浮铂金星环',lore:'它折射出许多可能性，而你仍需要选择可以检验的那一个。',glyph:'INFINITY'},
 {id:'iridescent_crown',name:'不熄求索 · 炫彩桂冠',slot:'charm',icon:'crown',rarity:5,prismatic:true,value:50000,stats:{guard:22,hp:100,insight:18,capacity:2},material:'虹彩琉璃 / 银质月桂叶 / 流光晶簇',lore:'所有光芒里，最珍贵的是愿意修正自己的那一道。',glyph:'CURIOSITY'}
);
for(const it of added)for(const m of it.maps)D.mapPools[m].push(it.id);
const materialFor={math:['g_bound','r_atlas','proof'],stem:['g_benchmark','r_atlas','code'],english:['g_corpus','r_consensus','abstract'],conference:['g_review','r_consensus','poster'],sport:['g_training','r_longstudy','energy'],lab:['g_protocol','redproof','replica'],elective:['g_review','paradigm','negative']};
for(const it of added.filter(x=>x.rarity===5&&x.slot!=='material')){const [gold,red,base]=materialFor[it.maps[0]];D.redRecipes[it.id]={[gold]:1,[red]:1,[base]:2};}
D.redRecipes.r_caliper={g_protocol:1,redproof:1,proof:2};
const lateTech=[
 ['literature','研究方法','系统文献导航','dialectic',2,5,650,{power:2,insight:1}],
 ['synthesis','研究方法','知识重组','literature',3,5,850,{focus:6}],
 ['methods','研究方法','研究方法谱系','synthesis',3,5,1100,{power:2}],
 ['skeptic','研究方法','反证与边界','methods',3,5,1450,{insight:2}],
 ['models','研究方法','模型批判能力','skeptic',3,5,1800,{power:2,guard:1}],
 ['infrastructure','研究方法','可复现研究体系','models',3,5,2300,{focus:5,insight:1}],
 ['originality','研究方法','独立问题意识','infrastructure',4,5,2900,{power:3}],
 ['horizon','研究方法','前沿开拓计划','originality',4,5,3800,{power:3,insight:1}],
 ['conditioning','远征保障','长周期体能建设','evac',2,5,600,{hp:12}],
 ['composure','远征保障','复杂情境应对','conditioning',3,5,800,{guard:1,focus:3}],
 ['ergonomics','远征保障','人体工学配装','composure',3,2,1300,{capacity:1,hp:8}],
 ['nutrition','远征保障','恢复资源规划','ergonomics',2,5,1500,{hp:10,focus:4}],
 ['resilience','远征保障','韧性训练体系','nutrition',3,5,1900,{guard:1}],
 ['fieldstation','远征保障','跨校远征站','resilience',3,5,2400,{hp:12,focus:4}],
 ['contingency','远征保障','复杂风险预案','fieldstation',4,5,3000,{guard:1,hp:6}],
 ['endurance','远征保障','极限远征保障','contingency',4,5,3900,{hp:15,focus:5}],
 ['deepSurvey','探索与发现','深层档案检索','curator',1,5,700,{},'每级：史诗/典藏合计掉率 +0.6 个百分点'],
 ['merchant','探索与发现','物资估值网络','deepSurvey',3,5,950,{},'每级：出售系数 +2 个百分点（最高 75%）'],
 ['stipend','探索与发现','远征成果转化','merchant',3,5,1200,{},'每级：成功撤离额外经费 +4'],
 ['cache','探索与发现','资料夹层识别','stipend',3,5,1550,{},'每级：普通搜寻额外获得 1 件的概率 +10%'],
 ['relicDeep','探索与发现','传承档案定位','cache',3,5,2000,{},'每级：普通绯红品质掉率 +0.1 个百分点；炫彩条件概率不变'],
 ['craft','探索与发现','精密修复体系','relicDeep',3,5,2500,{},'每级：绯红装备修复经费 −100，材料需求不变'],
 ['archiveMaster','探索与发现','全域档案统筹','craft',4,5,3100,{insight:2,focus:4}],
 ['frontier','探索与发现','未知领域观测站','archiveMaster',4,5,4000,{insight:2,power:2}]
];
D.tech.push(...lateTech.map(([id,branch,name,parent,level,max,base,stats,effect])=>({id,branch,name,max,base,growth:1.5,pre:[parent,level],stats,effect:effect||'每级：'+Object.entries(stats).map(([k,v])=>D.effects[k]+' +'+v).join(' · ')})));
D.goals=[
 {id:'start',name:'远川研究项目（虚构）',score:100,projects:1,english:8,research:12},
 {id:'foundation',name:'北辰研究院（虚构）',score:180,projects:2,english:16,research:25},
 {id:'research',name:'名校 PhD 进阶梯队',score:300,projects:3,english:24,research:40},
 {id:'eth',name:'ETH Zurich',score:440,projects:4,english:32,research:60},
 {id:'oxford',name:'Oxford',score:560,projects:4,english:40,research:80},
 {id:'stanford',name:'Stanford',score:640,projects:5,english:48,research:95},
 {id:'mit',name:'MIT',score:720,projects:6,english:55,research:110}
];
return D;
}
if(typeof module!=='undefined')module.exports=extendCollections;
