/* 前后台共用的 v3.0 运营配置。本机演示，不覆盖历史记录。 */
const a3Now=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit',hour:'2-digit',minute:'2-digit',hour12:false}).format(new Date()).replace(',','');
const a3Date=()=>a3Now().slice(0,10);
const a3RuleDefinitions={
 sign:{name:'每日签到',category:'日常参与',condition:'登录后完成当日签到。漏签不清零，每个北京时间自然日计一次。',grant:'签到成功后',limit:'每天1次',reward:2},
 quiz:{name:'生活知识答题',category:'日常参与',condition:'当天首次答对一道生活知识题；继续阅读、重复答题不再发奖。',grant:'首次答对后',limit:'每天1次',reward:5},
 newcomer:{name:'新人积分礼',category:'新人礼',condition:'新用户完成首次签到与首次答题后主动领取；不要求推荐朋友或签约。',grant:'点击领取后',limit:'每人1次',reward:80},
 invite:{name:'推荐朋友参与',category:'拉新推荐',condition:'平台新用户通过分享进入，注册并完成首次签到＋答题。仅一级推荐，不能自邀；同一手机号只绑定一个推荐人。',grant:'朋友完成两步后',limit:'每天5位，本期30位',reward:30,daily:5,total:30},
 lead:{name:'推荐有效咨询',category:'找房推荐',condition:'通过房源／项目分享产生首次真实找房咨询，经运营方核实。好友和群聊共用一次奖励。',grant:'确认有效咨询后',limit:'每位被推荐人1次',reward:20},
 deal:{name:'推荐线下成交',category:'找房推荐',condition:'武汉城投安家乐寓在线下完成签约，运营商有成交即在后台录入。平台不管理合同或收租。',grant:'录入线下成交后',limit:'每位被推荐人1次',reward:300},
};
function a3Init(){
 if(!db.admin3){
  db.admin3={version:'3.0',settings:{budget:100000,shipping:'中国大陆包邮',shipDays:3,serviceDays:2,afterDays:7},goods:gGoods.map(x=>({...structuredClone(x),status:'已上架',updated:'2026-10-08 09:00'})),knowledge:gKnowledge.map(x=>({...structuredClone(x),status:'已发布',updated:'2026-10-08 09:00'})),rules:Object.entries(a3RuleDefinitions).map(([id,r])=>({id,...r,status:'已启用',start:'2026-09-01',end:'2026-12-31',funder:id==='deal'?'武汉城投安家乐寓':'平台',updated:'2026-10-08 09:00'})),history:[]};
  db.admin3.goods.push({...structuredClone(gGoods[0]),id:'stand-draft',name:'桌面支架·新配色',stock:0,status:'草稿',adminExample:true}, {...structuredClone(gGoods[1]),id:'bag-soldout',name:'安家帆布袋·试点批次',stock:0,status:'已兑完',adminExample:true}, {...structuredClone(gGoods[2]),id:'mug-off',name:'元气杯·九月批次',stock:0,status:'已下架',adminExample:true});
  db.admin3.knowledge.push({...structuredClone(gKnowledge[0]),id:'quiz-draft',title:'看房时，怎样记录房间现状？',question:'看房时，哪一种记录方式更合适？',options:['拍下公共房源信息，记录设施情况','公开其他住户的门牌与手机号','不记录任何费用'],answer:0,why:'记录公开房源与设施状况，不记录或传播其他住户的个人信息。',status:'草稿'}, {...structuredClone(gKnowledge[4]),id:'quiz-off',title:'旧版收纳题',status:'已下架'});
  for(const r of db.admin3.rules){const existing=db.admin2.rules.find(x=>x.id==='pr-'+r.id);if(['lead','deal'].includes(r.id)&&existing?.status==='已启用')r.reward=existing.reward;}
  save();
 }
 if(!db.admin3.examples){
  db.admin3.history.unshift({time:'2026-10-08 09:00',name:'一期运营配置',action:'初始化',note:'签到2分、答题5分、新人80分、参与30分、咨询20分、成交300分',operator:'平台运营'});
  db.admin3.examples=true;save();
 }
 if(!db.admin3.ledgerExamples){
  const rows=[['签到',2,12,'2026-10-07 08:00','每日签到'],['生活知识答题',5,17,'2026-10-07 08:02','看房前，先问清哪些费用？'],['新人礼',80,97,'2026-10-07 08:05','首次签到与答题'],['推荐朋友参与',30,127,'2026-10-07 10:10','好友首次签到＋答题'],['好友有效咨询',20,147,'2026-10-07 15:30','安家乐寓首次咨询'],['好友签约成交',300,447,'2026-10-08 09:00','安家乐寓线下签约，运营商承担']];
  db.ledger.unshift(...rows.reverse().map(([action,change,balance,date,note],i)=>({id:'a3-ledger-demo-'+i,name:'陈晨',action,change,balance,date,note,mine:false})));
  db.admin3.ledgerExamples=true;save();
 }
}
function a3RuleActive(r){return r?.status==='已启用'&&r.start<=a3Date()&&r.end>=a3Date()}
function a3Reward(key){const r=db.admin3?.rules.find(r=>r.id===key);return a3RuleActive(r)?r.reward:0}
function a3Sync(){
 a3Init();
 for(const x of db.admin3.goods)if(x.status==='已上架'&&(db.growth.stocks[x.id]??x.stock)===0)x.status='已兑完';
 gGoods.splice(0,gGoods.length,...db.admin3.goods.filter(x=>!x.adminExample&&['已上架','已兑完'].includes(x.status)).map(x=>structuredClone(x)));
 gKnowledge.splice(0,gKnowledge.length,...db.admin3.knowledge.filter(x=>x.status==='已发布').map(x=>structuredClone(x)));
 for(const key of ['lead','deal']){const a=db.admin2.rules.find(x=>x.id==='pr-'+key),r=db.admin3.rules.find(x=>x.id===key);if(a){a.reward=r.reward;a.start=r.start+' 00:00';a.end=r.end+' 23:59';a.status=a3RuleActive(r)?'已启用':'已停用';delete a.draft;delete a.live;}}
 db.v3.rewardRules.validLead=a3Reward('lead');db.v3.rewardRules.deal=a3Reward('deal');
}
a3Sync();
