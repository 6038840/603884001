/* V3.0: 一期运营与找房入口的演示数据。项目公开信息与虚构互动记录分开保存。 */
const v3Source='https://www.hanyang.gov.cn/zwgk_38/xxgkml/ggzypz/zfbz1/bzxzfzc/202608/t20260807_2831039.shtml';
const v3Houses=[
 {id:'maying1',name:'安家乐寓·马鹦路店一期',district:'汉阳区',address:'鹦鹉大道189号招商愉樾小区3-2号楼',area:'39.5—69㎡',types:'大单间 / LOFT / 一室一厅',rent:'35元/㎡·月',rentNote:'公开资料中的租金均价，一房一价',fee:'物业服务费2.5元/㎡·月',units:'298套',tag:'地铁沿线',image:'assets/v3-studio.jpg',detailImage:'assets/v3-room-detail.jpg',source:v3Source},
 {id:'maying2',name:'安家乐寓·马鹦路店二期',district:'汉阳区',address:'马鹦路地铁6号线马鹦路站B出口附近，招商愉樾小区3-1号楼',area:'27—56㎡',types:'单间 / 一室一厅',rent:'45.9元/㎡·月',rentNote:'公开资料中的租金均价，一房一价',fee:'物业服务费2.5元/㎡·月',units:'527套',tag:'近地铁',image:'assets/v3-loft.jpg',detailImage:'assets/v3-loft-detail.jpg',source:v3Source},
 {id:'dongman',name:'安家乐寓·动漫城店',district:'汉阳区',address:'中关动漫城7栋',area:'约57㎡',types:'一室一厅一厨一卫',rent:'30.6元/㎡·月',rentNote:'公开资料中的租金标准',fee:'服务费150元/月·套',units:'96套',tag:'独立厨卫',image:'assets/v3-onebed.jpg',detailImage:'assets/v3-onebed-detail.jpg',source:v3Source}
];
const v3Knowledge=[
 {id:'t6',title:'看房前，先问清这三笔费用',type:'知识题',status:'进行中',start:'2026-09-01',end:'2026-10-31',question:'看房时，哪种做法更能避免后续费用争议？',options:'确认租金、物业费和水电计费方式\n只看房间照片，不问费用\n先支付定金再看条款',answer:'确认租金、物业费和水电计费方式',explanation:'把租金、服务费、押金及水电等约定看清楚，遇到不确定的收费向项目运营方核实。',points:5},
 {id:'t7',title:'入住当天记下水电表读数',type:'知识题',status:'进行中',start:'2026-09-01',end:'2026-10-31',question:'入住交接时，以下哪件事更稳妥？',options:'和工作人员核对水电表读数并留存\n等首月账单来了再问\n只拍一张客厅照片',answer:'和工作人员核对水电表读数并留存',explanation:'交接时核对表计读数、钥匙和家具家电状况，双方确认后再保存记录。',points:5},
 {id:'t8',title:'公区消防通道要留空',type:'知识题',status:'进行中',start:'2026-09-01',end:'2026-10-31',question:'看到消防通道堆放杂物，应该怎么做？',options:'联系物业或管家处理，保持通道畅通\n把自己的快递也暂时放过去\n等有人投诉后再说',answer:'联系物业或管家处理，保持通道畅通',explanation:'消防通道需要保持畅通；发现占用时及时联系现场工作人员处理。',points:5},
 {id:'t9',title:'秋雨天的房间防潮小习惯',type:'知识题',status:'进行中',start:'2026-09-01',end:'2026-10-31',question:'连续阴雨时，哪种习惯更有助于减少室内潮湿？',options:'结合天气适时通风并使用除湿设备\n把湿衣服长期堆在墙角\n关闭所有排风和门窗一整周',answer:'结合天气适时通风并使用除湿设备',explanation:'根据天气选择通风时段，及时处理积水和湿衣物，留意设备使用安全。',points:5},
 {id:'t10',title:'下次社区活动想约哪一场？',type:'投票',status:'进行中',start:'2026-09-20',end:'2026-10-15',question:'下班后，你最想参加哪种轻量活动？',options:'十分钟拉伸\n周五桌游\n周末城市散步\n一人食料理课',answer:'',explanation:'投票结果用于活动策划参考，具体安排以活动页为准。',points:5}
];
for(const t of v3Knowledge){if(!seed.tasks.some(x=>x.id===t.id))seed.tasks.push(t);if(!db.tasks.some(x=>x.id===t.id))db.tasks.push(structuredClone(t))}
const v3Initial={
 survey:{},savedHouses:[],directConsults:[],
 referrals:[
  {id:'rf-demo1',friend:'陈同学',phone:'139****2281',project:'安家乐寓·马鹦路店一期',source:'推荐房源',status:'已访问',created:'2026-09-18 10:20',mine:true,leadPaid:false,dealPaid:false},
  {id:'rf-demo2',friend:'赵同学',phone:'137****5762',project:'安家乐寓·马鹦路店二期',source:'通勤找房',status:'有效咨询',created:'2026-09-17 15:30',mine:true,leadPaid:true,dealPaid:false},
  {id:'rf-demo3',friend:'周同学',phone:'136****4890',project:'安家乐寓·动漫城店',source:'找房清单',status:'已成交',created:'2026-09-12 11:00',dealDate:'2026-09-19',mine:true,leadPaid:true,dealPaid:true},
  {id:'rf-demo4',friend:'同号记录',phone:'138****5678',project:'安家乐寓·马鹦路店一期',source:'推荐房源',status:'无效',reason:'与推荐人手机号重复',created:'2026-09-16 09:10',mine:true,leadPaid:false,dealPaid:false},
  {id:'rf-demo5',friend:'刘同学',phone:'135****6721',project:'安家乐寓·马鹦路店一期',source:'群聊·找房清单',status:'待核实',created:'2026-09-19 13:40',mine:true,leadPaid:false,dealPaid:false}
 ],
 rewardRules:{validLead:20,deal:300,budgetYuan:100000,dealFunder:'武汉城投安家乐寓'},
 shareViews:0
};
seed.v3=structuredClone(v3Initial);
db.v3=db.v3||structuredClone(v3Initial);
for(const k of Object.keys(v3Initial))if(db.v3[k]===undefined)db.v3[k]=structuredClone(v3Initial[k]);
db.v3.rewardRules={...v3Initial.rewardRules,...db.v3.rewardRules};
const v3LifeNotes=[
 {id:'c6',title:'下班后，沿江走一小段',type:'生活攻略',author:'小林',project:'汉阳区',status:'已采纳',body:'下班后给自己留半小时，不必走太远。先看当天的天气与开放路线，选一段有照明的公共步道，带好饮水，放慢脚步看看江边的晚霞。',image:'assets/v3-riverside-note.jpg',created:'2026-09-20 19:10',reason:''},
 {id:'c7',title:'周末早起，给自己一顿武汉早餐',type:'生活攻略',author:'张悦',project:'汉阳区',status:'已采纳',body:'热干面配一杯豆浆，是很多人熟悉的武汉早晨。第一次探索周边早餐店，可以先看营业时间、口味和实际价格，再慢慢找到适合自己的小店。',image:'assets/v3-breakfast-note.jpg',created:'2026-09-21 08:20',reason:''}
];
for(const item of v3LifeNotes){if(!seed.contributions.some(x=>x.id===item.id))seed.contributions.push(item);if(!db.contributions.some(x=>x.id===item.id))db.contributions.push(structuredClone(item))}
