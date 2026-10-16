/* 后台 2.0 共用演示配置。只扩展，不清空已有参与与推荐记录。 */
const a2Now=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date()).replace(',','');
const a2Date=()=>a2Now().slice(0,10);
const a2RuleSeed=(key,name,scene,category,reward,extra={})=>({id:key,name,scene,category,reward,status:'已启用',audience:'全部用户',channels:['好友','群聊'],projects:['武汉城投安家乐寓全部参与项目'],start:'2026-09-01 00:00',end:'2026-12-31 23:59',limitPeriod:'每日',limitCount:1,totalLimit:0,grant:'满足条件后发放',funder:'平台',reclaim:'核实无效后回收',milestone:0,summary:'',updated:'2026-10-08 09:30',...extra});
const a2Initial={
 version:2,
 settings:{name:'积分',validity:'长期有效',validDays:365,expiryReminder:7,pointsPerYuan:100,budgetYuan:100000,budgetWarning:80,exhaustion:'停止新奖励，保留已获权益',repeat:'同一有效行为仅计一次',negative:'扣至零，剩余登记待追回',updated:'2026-10-08 09:30'},
 rules:[
  a2RuleSeed('pr-daily','每日有效参与','每日有效参与','日常活跃',db.rules.daily,{summary:'生活知识答对、投票提交或有效提问通过审核，每日合计奖励一次。'}),
  a2RuleSeed('pr-attendance','活动到场','活动到场','活动参与',db.rules.attendance,{limitPeriod:'每场活动',grant:'现场核验后发放',summary:'现场核验到场后发放；同一场活动不重复奖励。'}),
  a2RuleSeed('pr-content','优质内容采纳','内容采纳','内容共创',db.rules.contribution,{audience:'用户与共创管家',limitPeriod:'每篇内容',limitCount:1,grant:'内容通过审核后发放',summary:'真实问答、生活攻略与活动回顾通过采纳后奖励一次。'}),
  a2RuleSeed('pr-three','累计参与 3 次','累计参与','日常活跃',db.rules.three,{limitPeriod:'每人',milestone:3,totalLimit:1,summary:'累计达到3次有效参与额外奖励，不要求连续参与。'}),
  a2RuleSeed('pr-seven','累计参与 7 次','累计参与','日常活跃',db.rules.seven,{limitPeriod:'每人',milestone:7,totalLimit:1,summary:'累计达到7次有效参与额外奖励，漏做不清零。'}),
  a2RuleSeed('pr-lead','推荐好友与群分享','首次有效咨询','新人拉新',db.v3.rewardRules.validLead,{limitPeriod:'每位被推荐人',limitCount:1,totalLimit:0,grant:'运营方确认有效后发放',summary:'好友或群成员通过房源／项目分享完成首次有效咨询；只点击分享或打开页面不计奖。'}),
  a2RuleSeed('pr-deal','推荐线下成交','线下签约成交','新人拉新',db.v3.rewardRules.deal,{limitPeriod:'每位被推荐人',limitCount:1,funder:'武汉城投安家乐寓',grant:'运营商录入成交后发放',summary:'运营商确认线下签约成交并录入结果，向推荐人发放更高奖励。'}),
  a2RuleSeed('pr-survey','问卷首次完成奖励','问卷完成','日常活跃',5,{status:'草稿',limitPeriod:'每份问卷',summary:'草稿示例：完整填写并通过有效性校验后奖励一次。'}),
  a2RuleSeed('pr-content-oct','十月内容采纳加码','内容采纳','内容共创',30,{status:'待生效',start:'2026-10-15 00:00',end:'2026-10-31 23:59',effectiveAt:'2026-10-15 00:00',limitPeriod:'每篇内容',audience:'用户与共创管家',summary:'同一行为与基础规则只取较高奖励，不重复叠加。'}),
  a2RuleSeed('pr-weekend','周末知识奖励','每日有效参与','日常活跃',10,{status:'已停用',start:'2026-09-01 00:00',end:'2026-12-31 23:59',summary:'已停用的历史规则样例，不参与当前奖励发放。'}),
  a2RuleSeed('pr-september','九月内容采纳奖励','内容采纳','内容共创',20,{status:'已结束',end:'2026-09-30 23:59',limitPeriod:'每篇内容',summary:'已结束的历史规则，奖励记录保留。'})
 ],
 history:[{id:'rh-seed',date:'2026-10-08 09:30',name:'一期积分规则',action:'初始化',operator:'平台运营',before:'每日5分；咨询20分；成交300分',after:'补充范围、次数限制及成本承担配置'}],
 surveys:[
  {id:'needs',title:'找房需求调查',status:'收集中',start:'2026-09-01',end:'2026-12-31',audience:'正在找房的用户',image:'assets/v3-survey.jpg',intro:'告诉我们你在找什么样的家，看看哪些项目值得进一步了解。',fields:[['stage','你现在处于哪个阶段？',['准备毕业','已在武汉工作','准备换房','先了解政策']],['district','更想住在哪个片区？',['汉阳区','东湖高新区','洪山区','还没确定']],['budget','你更舒适的月租范围？',['1000元以内','1000—1500元','1500—2000元','2000元以上']],['commute','你更在意哪件事？',['靠近地铁','离工作地近','可独立做饭','公共空间丰富']],['move','预计什么时候入住？',['一个月内','三个月内','半年内','暂时不确定']]],responses:128},
  {id:'commute',title:'通勤习惯小调查',status:'收集中',start:'2026-09-01',end:'2026-12-31',audience:'全部用户',image:'assets/v3-commute.jpg',intro:'上班路上的半小时，可能决定一天的心情。',fields:[['work','平时主要去哪里？',['汉阳','光谷','武昌','跨区流动']],['transport','最常用的通勤方式？',['地铁','公交','骑行','步行或其他']],['duration','理想单程通勤时间？',['30分钟内','30—45分钟','45—60分钟','可灵活安排']],['priority','找房时更愿意优先满足？',['通勤','租金','空间','社区生活']]],responses:86},
  {id:'life',title:'周末生活偏好',status:'已暂停',start:'2026-09-01',end:'2026-12-31',audience:'已经入住的用户',image:'assets/community.webp',intro:'我们想把活动办成你愿意参加的样子。',fields:[['time','你更方便的活动时段？',['工作日晚间','周六上午','周六下午','周日']],['topic','你最喜欢的主题？',['轻运动','一起做饭','手作','城市散步']],['barrier','参加活动最大的顾虑？',['不认识人','时间不合适','距离远','怕流程复杂']],['pace','你期待的活动人数？',['5人以内','6—12人','13—20人','都可以']]],responses:54},
  {id:'survey-new',title:'新邻居入住期待',status:'草稿',start:'2026-10-15',end:'2026-11-15',audience:'正在找房的用户',image:'assets/v3-checklist.jpg',intro:'哪一件小事能让你更快适应新生活？',fields:[['expect','你最希望先了解什么？',['申请流程','生活配套','公寓活动','入住准备']]],responses:0},
  {id:'survey-ended',title:'九月活动体验反馈',status:'已结束',start:'2026-09-01',end:'2026-09-30',audience:'已经入住的用户',image:'assets/v3-kitchen-safety.jpg',intro:'感谢认真回答，帮助我们安排下一场活动。',fields:[['rating','这次活动体验如何？',['很满意','满意','一般','需要改进']]],responses:32}
 ],
 giftCards:[
  {id:'dc1',code:'DB-2026-100801',batch:'十月新人礼',status:'可发放',valid:'2026-12-31',cost:0,recipient:'',phone:'',issued:''},
  {id:'dc2',code:'DB-2026-100802',batch:'十月新人礼',status:'已发放',valid:'2026-12-31',cost:0,recipient:'小林',phone:'13800005678',issued:'2026-10-08 10:20'},
  {id:'dc3',code:'DB-2026-100803',batch:'十月新人礼',status:'已使用',valid:'2026-12-31',cost:0,recipient:'陈晨',phone:'13800002345',issued:'2026-10-07 14:30',used:'2026-10-08 09:15'},
  {id:'dc4',code:'DB-2026-090101',batch:'九月新人礼',status:'已过期',valid:'2026-09-30',cost:0,recipient:'',phone:'',issued:''},
  {id:'dc5',code:'DB-2026-100805',batch:'十月新人礼',status:'已作废',valid:'2026-12-31',cost:0,recipient:'',phone:'',issued:'',reason:'权益方更换卡号，旧卡停止使用'}
 ],
 grantLogs:[{id:'gl1',rule:'pr-lead',name:'小林',points:20,source:'赵同学 · 推荐项目',date:'2026-09-17 15:30',funder:'平台'},{id:'gl2',rule:'pr-deal',name:'小林',points:300,source:'周同学 · 线下签约',date:'2026-09-19 16:20',funder:'武汉城投安家乐寓'}]
};
seed.admin2=structuredClone(a2Initial);
if(!db.admin2)db.admin2=structuredClone(a2Initial);
for(const key of Object.keys(a2Initial))if(db.admin2[key]===undefined)db.admin2[key]=structuredClone(a2Initial[key]);
function a2RuleLive(r){if(r.status==='已启用')return r;if(r.status==='待生效'&&r.live)return r.live;return null}
function a2ActiveRule(key){const r=db.admin2.rules.find(x=>x.id===key);return r?a2RuleLive(r):null}
function a2MatchingRule(scene,context={}){
 const now=a2Now(),project=context.project||'';
 return db.admin2.rules.map(a2RuleLive).filter(Boolean).filter(r=>
  r.scene===scene&&r.start<=now&&r.end>=now&&
  (!r.milestone||r.milestone===context.milestone)&&
  (r.projects.includes('武汉城投安家乐寓全部参与项目')||r.projects.includes(project))&&
  (!context.channel||r.channels.includes(context.channel))
 ).sort((a,b)=>b.reward-a.reward)[0]||null;
}
function a2SyncLegacy(){
 const map={daily:['每日有效参与'],attendance:['活动到场'],contribution:['内容采纳'],three:['累计参与',3],seven:['累计参与',7]};
 for(const [key,[scene,milestone]] of Object.entries(map)){const r=a2MatchingRule(scene,{milestone});db.rules[key]=r?r.reward:0}
 db.v3.rewardRules.validLead=a2MatchingRule('首次有效咨询')?.reward||0;
 db.v3.rewardRules.deal=a2MatchingRule('线下签约成交')?.reward||0;
 db.v3.rewardRules.budgetYuan=db.admin2.settings.budgetYuan;
}
function a2AdvanceRules(){
 let changed=false;
 for(const r of db.admin2.rules){
  if(r.status==='待生效'&&r.effectiveAt<=a2Now()){r.status='已启用';delete r.live;changed=true;db.admin2.history.unshift({id:id(),date:a2Now(),name:r.name,action:'定时生效',before:'待生效',after:r.reward+' 积分',operator:'系统'})}
  if(r.status==='已启用'&&r.end<a2Now()){r.status='已结束';changed=true}
 }
 a2SyncLegacy();return changed;
}
// New examples are added once; existing operator edits and user records are preserved.
if(!db.admin2.examplesVersion){
 db.admin2.surveyResponses=db.admin2.surveyResponses||{};
 const names=['陈晨','许悠','李明','周予','刘可','何安','宋悦','陆宁','唐晓','苏禾'];
 for(const q of db.admin2.surveys){
  if(!db.admin2.surveyResponses[q.id])db.admin2.surveyResponses[q.id]=Array.from({length:q.responses||0},(_,i)=>({id:'answer-'+q.id+'-'+i,name:names[i%names.length]+(i>=names.length?' '+(Math.floor(i/names.length)+1):''),date:'2026-09-'+String(10+i%19).padStart(2,'0')+' '+String(9+i%10).padStart(2,'0')+':'+String(i%60).padStart(2,'0'),answers:Object.fromEntries(q.fields.map((f,j)=>[f[0],f[2][(i*7+j*3+Math.floor(i/5))%f[2].length]]))}));
 }
 for(const r of db.v3.referrals){if(r.leadPaid&&r.leadReward===undefined)r.leadReward=db.v3.rewardRules.validLead;if(r.dealPaid&&r.dealReward===undefined)r.dealReward=db.v3.rewardRules.deal}
 const sources={'rf-demo2':'推荐项目','rf-demo3':'推荐项目','rf-demo5':'群聊·推荐项目'};
 for(const r of db.v3.referrals)if(sources[r.id])r.source=sources[r.id];
 const available=db.admin2.giftCards.filter(c=>c.status==='可发放').length;
 const stock=db.newcomers.find(n=>n.id==='n1')?.stock||0;
 for(let i=available;i<stock;i++)db.admin2.giftCards.push({id:'dc-ready-'+i,code:'DB-2026-A'+String(i+1).padStart(5,'0'),batch:'十月新人礼',status:'可发放',valid:'2026-12-31',cost:0,recipient:'',phone:'',issued:''});
 const samples=[
  {id:'doubao-demo-pending',code:'DB-2026-100802',name:'许悠',phone:'13800003456',status:'待使用',created:'2026-10-08 10:20',valid:'2026-12-31'},
  {id:'doubao-demo-used',code:'DB-2026-100803',name:'陈晨',phone:'13800002345',status:'已使用',created:'2026-10-07 14:30',used:'2026-10-08 09:15',valid:'2026-12-31'},
  {id:'doubao-demo-expired',code:'DB-2026-090102',name:'李明',phone:'13800004567',status:'已过期',created:'2026-09-12 09:15',valid:'2026-09-30'},
  {id:'doubao-demo-return',code:'DB-2026-090103',name:'刘可',phone:'13800006789',status:'已退回',created:'2026-09-14 18:20',valid:'2026-12-31',reason:'领取账号不符合权益方使用条件，未扣积分。'}
 ];
 for(const row of samples)if(!db.exchanges.some(x=>x.id===row.id))db.exchanges.push({...row,reward:'r-doubao',title:'豆包流量卡',snapshot:structuredClone(by('rewards','r-doubao')),cost:0,mine:false});
 db.admin2.examplesVersion=1;
}
a2AdvanceRules();
a2SyncLegacy();save();
