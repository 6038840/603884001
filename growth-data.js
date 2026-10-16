/* 增长收敛版 v3.0。独立保存新增记录，保留旧版数据，不连接真实发奖。 */
const gGoods=[
 {id:'stand',name:'折叠手机支架',subtitle:'桌面追剧、视频通话都顺手',points:80,stock:2000,category:'桌面好物',color:'杏橙色',spec:'铝合金 / 可折叠 / 约8×7cm',limit:3,cost:8,image:'assets/growth-stand-list.png',detailImage:'assets/growth-stand-detail.png',desc:'折叠收纳不占地方。放在书桌或餐桌上，解放双手。',note:'适用于常见尺寸手机；不含图中的手机。'},
 {id:'bag',name:'安家帆布袋',subtitle:'把书、日常和好心情装进去',points:180,stock:900,category:'出门随行',color:'米白 · 紫色提手',spec:'帆布 / 约35×38cm / 单肩手提',limit:3,cost:18,image:'assets/growth-bag-list.png',detailImage:'assets/growth-bag-detail.png',desc:'上班、买菜、去图书馆，一只袋子轻松出门。',note:'不含展示中的书籍及其他道具。'},
 {id:'mug',name:'元气陶瓷马克杯',subtitle:'新家的第一杯热饮',points:260,stock:700,category:'居家日用',color:'奶油白 · 紫色杯沿',spec:'陶瓷 / 约350mL / 单杯装',limit:3,cost:24,image:'assets/growth-mug-list.png',detailImage:'assets/growth-mug-detail.png',desc:'早餐时装一杯牛奶，下班后泡一杯茶。圆润握柄，陪伴日常。',note:'陶瓷易碎，收到后请先检查外观；不含展示道具。'},
 {id:'bottle',name:'轻享保温随行杯',subtitle:'上班路上，记得好好喝水',points:600,stock:300,category:'出门随行',color:'浅杏色 · 紫色杯盖',spec:'不锈钢内胆 / 约450mL / 单只装',limit:3,cost:48,image:'assets/growth-bottle-list.png',detailImage:'assets/growth-bottle-detail.png',desc:'轻巧随行，旋拧杯盖。出门带上它，把温暖留给自己。',note:'首次使用前清洗；避免盛装碳酸饮料。'},
];
const gKnowledge=[
 {id:'fees',title:'看房前，先问清哪些费用？',tag:'找房小知识',question:'看房时，哪种做法更能减少后续费用争议？',options:['只看照片，不问费用','确认租金、物业费和水电计费方式','先付定金，之后再看合同'],answer:1,why:'把租金、押金、服务费和水电计费方式写清楚。费用、申请条件以运营方正式答复和合同约定为准。',art:'receipt',color:'orange'},
 {id:'meter',title:'入住第一天，别忘这一步',tag:'生活小知识',question:'交接房间时，哪件小事值得一起记录？',options:['水电表读数和家具现状','只拍小区门口','等住一个月后再确认'],answer:0,why:'与交接人核对并拍照记录水电表读数、家具和设施状态，留存双方确认的交接记录。',art:'meter',color:'purple'},
 {id:'power',title:'插线板不能这样用',tag:'生活小知识',question:'电热水壶、电暖器等大功率电器，怎样使用更稳妥？',options:['都接在同一插线板','把多个插线板串联起来','核对额定功率，避免过载和串联'],answer:2,why:'按产品说明和额定功率使用，避免大功率电器共用低额定功率插线板。发现发热、异味等异常及时停止使用。',art:'power',color:'mint'},
 {id:'deposit',title:'退租时，这些凭证要留好',tag:'找房小知识',question:'关于押金，签约时更应该明确什么？',options:['退还条件、扣除项目和退还时间','只记住管家的昵称','只听朋友说，不核对合同'],answer:0,why:'在合同中核对押金金额、退还条件、合法合理的扣费事项和处理时间，妥善保存支付、交接凭证。',art:'receipt',color:'rose'},
 {id:'clean',title:'小房间，收纳先做减法',tag:'生活小知识',question:'搬进新家前，哪种整理方式更实用？',options:['先买满所有柜子','先量空间、筛选物品，再补收纳','所有东西都堆在门口'],answer:1,why:'先测量可用空间，留下常用物品，再选择适合尺寸的收纳用品；注意保持出入口畅通。',art:'home',color:'purple'},
 {id:'privacy',title:'给朋友推荐房源，保护隐私',tag:'分享小知识',question:'推荐房源时，哪些信息不应该公开发送到群里？',options:['项目公开地址和房型','平台公开的咨询入口','身份证、合同原件和具体住户门牌'],answer:2,why:'推荐时使用公开房源信息，不公开他人手机号、身份证、合同原件和具体住户信息。',art:'shield',color:'mint'},
];
const gToday=()=>new Intl.DateTimeFormat('sv-SE',{timeZone:'Asia/Shanghai',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date());
function gInit(){
 if(db.growth)return;
 db.growth={version:'3.0-growth',signed:[],answers:{},newGift:false,grants:[],shareChannel:'好友',shareIntent:null,addresses:[{id:'addr-home',name:'小林',phone:'13800005678',province:'湖北省',city:'武汉市',district:'汉阳区',street:'马鹦路附近青年公寓（演示地址）',isDefault:true}],stocks:Object.fromEntries(gGoods.map(x=>[x.id,x.stock])),invites:[
 {id:'gf1',name:'周同学',phone:'13900000001',source:'小程序推荐',stage:'已参与',signed:true,answered:true,reward:30,date:'2026-10-07 09:20'},
 {id:'gf2',name:'李女士',phone:'13900000002',source:'签到卡片',stage:'已注册',signed:false,answered:false,reward:0,date:'2026-10-07 13:40'},
 {id:'gf3',name:'陈同学',phone:'13900000003',source:'生活知识',stage:'已参与',signed:true,answered:true,reward:30,date:'2026-10-06 19:05'},
 {id:'gf4',name:'孙先生',phone:'13900000004',source:'积分商城',stage:'已注册',signed:true,answered:false,reward:0,date:'2026-10-06 17:30'},
 {id:'gf5',name:'王同学',phone:'13900000005',source:'小程序推荐',stage:'不计奖',signed:true,answered:true,reward:0,reason:'已有平台账户，不属于活动新用户',date:'2026-10-05 10:10'}
 ],orders:[
 {id:'go1',good:'bag',name:'安家帆布袋',quantity:1,points:180,status:'待发货',date:'2026-10-07 10:10',address:{name:'小林',phone:'13800005678',province:'湖北省',city:'武汉市',district:'汉阳区',street:'马鹦路附近青年公寓（演示地址）'},events:[['2026-10-07 10:10','兑换成功，等待发货']]},
 {id:'go2',good:'mug',name:'元气陶瓷马克杯',quantity:1,points:260,status:'已发货',date:'2026-10-06 11:10',carrier:'顺丰速运',tracking:'SF-DEMO-26010002',address:{name:'小林',phone:'13800005678',province:'湖北省',city:'武汉市',district:'汉阳区',street:'马鹦路附近青年公寓（演示地址）'},events:[['2026-10-08 08:40','运输中，包裹正在前往武汉分拨中心'],['2026-10-07 17:00','已揽收'],['2026-10-06 11:10','兑换成功']]},
 {id:'go3',good:'stand',name:'折叠手机支架',quantity:1,points:80,status:'已完成',date:'2026-10-01 09:30',carrier:'中通快递',tracking:'ZTO-DEMO-26010003',address:{name:'小林',phone:'13800005678',province:'湖北省',city:'武汉市',district:'汉阳区',street:'马鹦路附近青年公寓（演示地址）'},events:[['2026-10-04 18:00','已确认收货'],['2026-10-03 12:00','已送达'],['2026-10-02 09:00','已揽收']]},
 {id:'go4',good:'bottle',name:'轻享保温随行杯',quantity:1,points:600,status:'已取消',refunded:true,date:'2026-09-28 12:00',address:{name:'小林',phone:'13800005678',province:'湖北省',city:'武汉市',district:'汉阳区',street:'马鹦路附近青年公寓（演示地址）'},events:[['2026-09-28 12:30','兑换已取消，600积分已返还']]},
 {id:'go5',good:'mug',name:'元气陶瓷马克杯',quantity:1,points:260,status:'售后中',priorStatus:'已完成',reason:'收到商品有破损',date:'2026-09-25 15:00',address:{name:'小林',phone:'13800005678',province:'湖北省',city:'武汉市',district:'汉阳区',street:'马鹦路附近青年公寓（演示地址）'},events:[['2026-09-28 09:00','已收到售后申请，等待处理']]}
 ]};save();
}
gInit();
