// Digital newcomer gift; historical breakfast coupons remain unchanged.
const doubaoReward={id:'r-doubao',title:'豆包流量卡',subtitle:'新人专享 · 豆包 App 体验',cost:0,stock:100,status:'新人专享',image:'assets/doubao-avatar.png',store:'豆包 App',address:'线上使用',hours:'领取后按卡内指南激活',valid:'2026-10-31',limit:1,terms:'每位新用户限领一张，不可折现。权益内容及适用账号以激活页面说明为准。'};
if(!db.rewards.some(x=>x.id==='r-doubao'))db.rewards.push(structuredClone(doubaoReward));
if(!seed.rewards.some(x=>x.id==='r-doubao'))seed.rewards.push(structuredClone(doubaoReward));
function configureDoubao(source){source.newcomers.filter(n=>n.id!=='n3').forEach(n=>{n.reward='豆包流量卡';n.aiTitle='豆包流量卡';n.aiSubtitle='给新生活，多一个好帮手。';n.aiDescription='完成一次生活知识题或首次活动到场，免费领取一张豆包流量卡。';n.aiDisplay='展示';});source.doubaoGiftVersion=1;}
configureDoubao(seed);if(!db.doubaoGiftVersion)configureDoubao(db);
fields.newcomers.find(f=>f[0]==='reward')[2]='select:豆包流量卡';
aiGiftFields.find(f=>f[0]==='aiDisplay')[1]='礼品展示';
aiGiftFields.find(f=>f[0]==='aiDisplay')[2]='select:不展示,展示';
modules.newcomers.actions['进行中']=modules.newcomers.actions['进行中'].map(x=>x==='编辑预告'?'编辑礼品':x);
save();
