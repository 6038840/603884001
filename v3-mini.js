/* 湖北青年有家 V3.0：在一期原型上增加找房入口、三种内容推荐和有效咨询闭环。 */
const v3SurveySets={
 needs:{title:'找房需求调查',image:'assets/v3-survey.jpg',intro:'告诉我们你在找什么样的家，看看哪些项目值得进一步了解。',fields:[
  ['stage','你现在处于哪个阶段？',['准备毕业','已在武汉工作','准备换房','先了解政策']],
  ['district','更想住在哪个片区？',['汉阳区','东湖高新区','洪山区','还没确定']],
  ['budget','你更舒适的月租范围？',['1000元以内','1000—1500元','1500—2000元','2000元以上']],
  ['commute','你更在意哪件事？',['靠近地铁','离工作地近','可独立做饭','公共空间丰富']],
  ['move','预计什么时候入住？',['一个月内','三个月内','半年内','暂时不确定']]]},
 commute:{title:'通勤习惯小调查',image:'assets/v3-commute.jpg',intro:'上班路上的半小时，可能决定一天的心情。',fields:[
  ['work','平时主要去哪里？',['汉阳','光谷','武昌','跨区流动']],
  ['transport','最常用的通勤方式？',['地铁','公交','骑行','步行或其他']],
  ['duration','理想单程通勤时间？',['30分钟内','30—45分钟','45—60分钟','可灵活安排']],
  ['priority','找房时更愿意优先满足？',['通勤','租金','空间','社区生活']]]},
 life:{title:'周末生活偏好',image:'assets/community.webp',intro:'我们想把活动办成你愿意参加的样子。',fields:[
  ['time','你更方便的活动时段？',['工作日晚间','周六上午','周六下午','周日']],
  ['topic','你最喜欢的主题？',['轻运动','一起做饭','手作','城市散步']],
  ['barrier','参加活动最大的顾虑？',['不认识人','时间不合适','距离远','怕流程复杂']],
  ['pace','你期待的活动人数？',['5人以内','6—12人','13—20人','都可以']]]}
};
function v3Head(title,back){
 return '<header class="mini-head v3-head"><button class="v3-head-left" data-action="back" data-back="'+esc(back||'home')+'">'+(title==='湖北青年有家'?'武汉⌄':'‹')+'</button><strong>'+esc(title)+'</strong><span class="capsule">•••　◉</span></header>';
}
function v3Nav(active){
 return '<nav class="tabbar v3-tabbar">'+[['home','首页','home'],['search','搜索','pin'],['me','我的','user']].map(function(x){return '<a href="#/'+x[0]+'" class="'+(active===x[0]?'active':'')+'">'+icon(x[2])+'<span>'+x[1]+'</span></a>'}).join('')+'</nav>';
}
function v3Set(title,body,active){
 document.querySelector('#app').innerHTML=v3Head(title,title==='湖北青年有家'?'home':active==='search'?'search':'home')+body+(active?v3Nav(active):'');
 document.title=title+' · 湖北青年有家';
 window.scrollTo(0,0);
}
function v3HouseCard(x){
 return '<a class="v3-house-card" href="#/house/'+x.id+'"><div class="v3-house-photo"><img src="'+x.image+'" alt="'+esc(x.types)+'的房间场景示意"><span>场景示意</span></div><div class="v3-house-body"><div class="v3-row"><b>'+esc(x.name)+'</b><span>'+esc(x.tag)+'</span></div><p>'+esc(x.district)+' · '+esc(x.area)+' · '+esc(x.types)+'</p><div class="v3-house-price">'+esc(x.rent)+'<small>公开参考</small></div><div class="v3-house-link">查看项目与推荐好友　→</div></div></a>';
}
function v3Home(){
 const x=v3Houses[0];
 return '<section class="v3-hero"><img src="assets/v3-wuhan-hero.jpg" alt="暖色武汉城市插画"><div class="v3-hero-copy"><small>湖北青年有家 · 武汉</small><h1>在武汉，<br>找到喜欢的生活。</h1><p>找房、懂政策、认识新邻居</p></div></section>'+
 '<section class="v3-home-search"><form data-v3-form="search"><input name="query" aria-label="搜索项目或地铁站" placeholder="项目 / 地名 / 商圈 / 地铁站"><button type="submit">搜索</button></form><a href="#/commute">◈ 通勤找房</a></section>'+
 '<section class="v3-home-shortcuts"><a href="#/search"><span>⌕</span>我要找房</a><a href="#/activities"><span>▦</span>活动专区</a><a href="#/commute"><span>◷</span>通勤找房</a><a href="#/policy"><span>♧</span>政策资讯</a><a href="#/surveys"><span>☷</span>需求调查</a></section>'+
 '<section class="v3-pad"><div class="v3-section-head"><h2>把好房，推荐给好朋友</h2><a href="#/recommend">玩法说明 →</a></div>'+
 '<p class="v3-section-sub">分享有用的找房内容；朋友完成有效咨询后得积分，签约奖励更高。</p>'+
 '<div class="v3-referral-grid"><a href="#/share/house/maying1"><span class="v3-ref-icon">⌂</span><b>推荐这套房</b><small>具体项目更好聊</small></a><a href="#/share/commute/马鹦路"><span class="v3-ref-icon">◷</span><b>推荐通勤方案</b><small>发给同事、同学</small></a><a href="#/share/checklist/first"><span class="v3-ref-icon">☑</span><b>推荐找房清单</b><small>给刚到武汉的朋友</small></a></div>'+
 '<a class="v3-inline-banner" href="#/recommendations"><span>我的推荐进度</span><strong>看看谁已经开始找房 →</strong></a>'+
 '<div class="v3-section-head"><h2>安家乐寓项目参考</h2><a href="#/search">更多项目 →</a></div>'+
 '<a class="v3-feature-house" href="#/house/'+x.id+'"><img src="'+x.image+'" alt="青年公寓房间场景示意"><div><small>汉阳区 · 公开项目信息</small><h3>'+esc(x.name)+'</h3><p>'+esc(x.area)+' · '+esc(x.types)+'</p><b>'+esc(x.rent)+'</b><span>场景示意图</span></div></a>'+
 '<div class="v3-section-head"><h2>今天，有一点新收获</h2><a href="#/daily">更多任务 →</a></div>'+
 '<div class="v3-split-links"><a href="#/quiz/t1"><img src="assets/v3-kitchen-safety.jpg" alt="居家用电安全场景"><div><small>生活小知识</small><b>出门前，先检查什么？</b><span>去答题 →</span></div></a><a href="#/surveys"><img src="assets/v3-survey.jpg" alt="青年人在讨论找房需求"><div><small>需求调查</small><b>你想住什么样的家？</b><span>说说看 →</span></div></a></div>'+
 '<div class="v3-section-head"><h2>本周，下楼见</h2><a href="#/activities">全部活动 →</a></div>'+
 '<a class="v3-editorial-card" href="#/event/e1"><img src="assets/movie-list.webp" alt="露台观影活动场景"><div><small>09.26 · 光谷青年里</small><h3>晚风、电影，和新朋友</h3><p>一个人来也欢迎 · 免费报名</p></div></a>'+
 '<div class="v3-section-head"><h2>新来，也有新礼</h2><a href="#/newcomer">新人见面礼 →</a></div><a class="v3-simple-benefit" href="#/newcomer"><span>♡</span><div><b>一份热早餐，开始在武汉的新生活</b><p>原有早餐礼保留，AI体验礼仍为筹备预告。</p></div><strong>›</strong></a>'+
 '<div class="v3-section-head"><h2>找房前，先了解</h2><a href="#/policy">政策资讯 →</a></div><a class="v3-policy-tile" href="#/policy"><img src="assets/v3-checklist.jpg" alt="钥匙与租房清单"><div><b>安家乐寓公开项目与申请提醒</b><p>费用、户型与咨询入口，一页看清。</p></div></a>'+
 '<div class="v3-section-head"><h2>积分能换什么</h2><a href="#/rewards">福利中心 →</a></div><a class="v3-simple-benefit" href="#/rewards"><span>✦</span><div><b>早餐、洗衣与邻里小福利</b><p>参加原有任务和活动，也能慢慢积攒。</p></div><strong>›</strong></a>'+
 '<div class="v3-section-head"><h2>邻里生活笔记</h2><a href="#/keeper-contributions">看看共创 →</a></div><div class="v3-note-grid">'+db.contributions.filter(function(c){return c.status==='已采纳'&&c.image}).slice(-2).map(function(c){return '<a href="#/article/'+esc(c.id)+'"><img src="'+esc(c.image)+'" alt="'+esc(c.title)+'配图"><div><small>'+esc(c.author)+' · '+esc(c.project)+'</small><b>'+esc(c.title)+'</b></div></a>'}).join('')+'</div></section>';
}
function v3Search(query){
 const q=decodeURIComponent(query||'').trim();
 const rows=v3Houses.filter(function(x){return !q||[x.name,x.district,x.address,x.types].join(' ').includes(q)});
 return '<section class="v3-list-head"><h1>我要找房</h1><p>先看位置与租金，再找最适合自己的生活。</p><form data-v3-form="search"><input name="query" value="'+esc(q)+'" placeholder="项目名称 / 商圈 / 地铁站"><button type="submit">搜索</button></form><a class="v3-commute-strip" href="#/commute"><b>◷ 通勤找房</b><span>输入公司、学校或园区名称　›</span></a></section>'+
 '<section class="v3-pad"><div class="v3-section-head"><h2>武汉城投安家乐寓</h2><span>'+rows.length+' 个公开项目样例</span></div>'+
 (rows.length?rows.map(v3HouseCard).join(''):'<div class="empty">没有找到匹配项目，换个关键词试试。</div>')+
 '<p class="v3-footnote">公开租金为项目标准或均价，并非实时在租房源报价；在租情况、房型与最终费用请向运营方确认。图片为生成的场景示意。</p></section>';
}
function v3House(x){
 return '<img class="v3-detail-image" src="'+esc(x.detailImage)+'" alt="青年公寓房间场景示意"><section class="v3-pad v3-house-detail"><small class="v3-kicker">武汉城投安家乐寓 · '+esc(x.district)+'</small><h1>'+esc(x.name)+'</h1><p class="v3-image-note">配图为场景示意，并非该项目真实房间照片</p><div class="v3-detail-price">'+esc(x.rent)+'<small>'+esc(x.rentNote)+'</small></div><div class="v3-tags"><span>'+esc(x.tag)+'</span><span>'+esc(x.area)+'</span><span>'+esc(x.units)+'</span></div><h2>项目概况</h2><dl class="v3-info"><dt>地址</dt><dd>'+esc(x.address)+'</dd><dt>户型</dt><dd>'+esc(x.types)+'</dd><dt>其他费用</dt><dd>'+esc(x.fee)+'</dd><dt>目前房源</dt><dd>具体可租房源请咨询运营方</dd></dl><a class="v3-source" href="'+esc(x.source)+'" target="_blank" rel="noreferrer">查看汉阳区政府公开资料 ↗</a><div class="v3-house-actions"><button class="btn" data-action="save-house" data-key="'+esc(x.id)+'">'+(db.v3.savedHouses.includes(x.id)?'已收藏':'收藏')+'</button><a class="btn" href="#/share/house/'+x.id+'">推荐</a><a class="btn primary" href="#/consult/direct/'+x.id+'">咨询</a></div><p class="v3-footnote">申请资格、房源状态和签约费用，以属地政策及项目运营方最新信息为准。</p></section>';
}
function v3Commute(place){
 const p=decodeURIComponent(place||'马鹦路');
 return '<img class="v3-cover" src="assets/v3-commute.jpg" alt="武汉青年乘地铁通勤的场景"><section class="v3-pad"><small class="v3-kicker">通勤找房</small><h1>先定每天去哪里，<br>再想家安在哪里。</h1><p class="v3-lead">输入工作地或学校，看看附近值得咨询的项目。</p><form class="v3-form-inline" data-v3-form="commute"><input name="place" value="'+esc(p)+'" placeholder="公司 / 学校 / 园区 / 地铁站"><button type="submit">查找</button></form><div class="v3-chip-row">'+['马鹦路','汉阳区','光谷广场','武昌站'].map(function(y){return '<a href="#/commute/'+encodeURIComponent(y)+'">'+esc(y)+'</a>'}).join('')+'</div><div class="v3-section-head"><h2>从“'+esc(p)+'”开始看</h2></div><p class="v3-section-sub">以下为片区与地铁线索推荐，不展示未经实时地图核验的通勤分钟数。</p>'+v3Houses.map(v3HouseCard).join('')+'<a class="btn primary wide" href="#/share/commute/'+encodeURIComponent(p)+'">把这份通勤找房建议发给朋友</a></section>';
}
function v3Policy(){
 return '<img class="v3-cover" src="assets/v3-checklist.jpg" alt="租房交接清单场景"><article class="v3-pad v3-article"><small class="v3-kicker">政策资讯 · 找房清单</small><h1>在武汉找房，<br>这几件事先问清。</h1><p class="v3-lead">公开资料可以帮你初步筛选；最终申请和签约，仍由属地与项目运营方办理。</p><h2>01　看看项目是否适合</h2><p>汉阳区公开资料列有安家乐寓·马鹦路店一期、二期及动漫城店的地址、户型、租金标准与服务费用。可先比较工作地、面积及实际总费用。</p><h2>02　问清可租房源与费用</h2><p>租金标准不等于某套房实时成交价。咨询时建议同时核对可租房型、物业或服务费、押金、水电计费与交付状态。</p><h2>03　准备申请材料</h2><p>申请材料和资格以属地最新公告为准。汉阳区公开配租说明涉及社会保险缴纳证明、房查证明等材料，由各运营机构负责审核。</p><a class="v3-source" href="'+v3Source+'" target="_blank" rel="noreferrer">查看汉阳区政府原文 ↗</a><div class="v3-house-actions"><a class="btn" href="#/search">看看项目</a><a class="btn primary" href="#/share/checklist/first">把清单发给朋友</a></div></article>';
}
function v3SurveyHub(){
 return '<section class="v3-pad"><h1>先聊聊，你想要的生活。</h1><p class="v3-lead">几道简单问题，帮助我们把找房与社区内容做得更贴近你。</p>'+Object.keys(v3SurveySets).map(function(k){const x=v3SurveySets[k];return '<a class="v3-survey-card" href="#/survey/'+k+'"><img src="'+x.image+'" alt="'+esc(x.title)+'配图"><div><small>'+(k==='needs'?'找房':'生活')+' · '+x.fields.length+' 题</small><h2>'+esc(x.title)+'</h2><p>'+esc(x.intro)+'</p><b>去填写 →</b></div></a>'}).join('')+'</section>';
}
function v3SurveyPage(type){
 const x=v3SurveySets[type],saved=db.v3.survey[type]||{};
 return '<img class="v3-cover" src="'+x.image+'" alt="'+esc(x.title)+'配图"><section class="v3-pad"><small class="v3-kicker">需求调查</small><h1>'+esc(x.title)+'</h1><p class="v3-lead">'+esc(x.intro)+'</p><form class="v3-form" data-v3-form="survey" data-type="'+type+'">'+x.fields.map(function(f,i){return '<fieldset><legend><em>0'+(i+1)+'</em>'+esc(f[1])+'</legend>'+f[2].map(function(option){return '<label class="v3-option"><input type="radio" name="'+f[0]+'" value="'+esc(option)+'" '+(saved[f[0]]===option?'checked':'')+' required><span>'+esc(option)+'</span></label>'}).join('')+'</fieldset>'}).join('')+'<button class="btn primary wide" type="submit">提交我的想法</button></form><p class="v3-footnote">仅用于本机原型展示；正式上线时应明确用途和保存期限。</p></section>';
}
function v3SurveyResult(type){
 const x=v3SurveySets[type],answer=db.v3.survey[type];
 return '<section class="v3-pad v3-result"><div class="v3-result-mark">✓</div><h1>谢谢你认真回答。</h1><p>'+esc(x.title)+'已保存。我们会参考真实需求，继续优化找房和邻里内容。</p><div class="v3-answer-summary">'+Object.keys(answer||{}).map(function(k){return '<span>'+esc(answer[k])+'</span>'}).join('')+'</div><a class="btn primary wide" href="#/search">看看安家乐寓项目</a><a class="btn wide" href="#/surveys">再看看其他调查</a></section>';
}
function v3DecodedKey(key){
 let value=key||'first';
 for(let i=0;i<2;i++){try{const next=decodeURIComponent(value);if(next===value)break;value=next}catch(e){break}}
 return value;
}
function v3ShareMeta(type,key){
 key=v3DecodedKey(key).replace(/@group$/,'');
 if(type==='house'){const house=v3Houses.find(function(x){return x.id===key})||v3Houses[0];return {title:'这套房，可以看看',subtitle:house.name+' · '+house.district+' · '+house.area,kind:'推荐房源',image:house.image,project:house.name};}
 if(type==='commute')return {title:'从通勤出发，找一个家',subtitle:'工作地：'+key+' · 看看附近项目',kind:'通勤找房',image:'assets/v3-commute.jpg',project:v3Houses[0].name};
 return {title:'刚来武汉，先看这份清单',subtitle:'项目、费用、材料，一起慢慢看清楚',kind:'找房清单',image:'assets/v3-checklist.jpg',project:v3Houses[0].name};
}
function v3SharePage(type,key){
 const m=v3ShareMeta(type,key);
 return '<section class="v3-pad"><small class="v3-kicker">好友安居推荐计划</small><h1>分享一份真的有用的找房信息。</h1><p class="v3-lead">发给正需要的朋友，或自愿发到合适的同学、同事群。</p><div class="v3-share-preview"><img src="'+m.image+'" alt="'+esc(m.kind)+'场景配图"><div class="v3-share-preview-body"><small>'+esc(m.kind)+' · 湖北青年有家</small><h2>'+esc(m.title)+'</h2><p>'+esc(m.subtitle)+'</p><span>打开后可自主查看、咨询</span></div></div><button class="btn primary wide" data-action="share" data-channel="friend" data-type="'+esc(type)+'" data-key="'+esc(key||'first')+'">分享给朋友</button><button class="btn wide" data-action="share" data-channel="group" data-type="'+esc(type)+'" data-key="'+esc(key||'first')+'">分享到群聊</button><a class="btn wide" href="#/invite/'+esc(type)+'/'+encodeURIComponent(key||'first')+'">预览朋友看到的页面</a><div class="v3-rule-mini"><b>群里分享也能获得推荐积分</b><p>群成员通过你的内容完成首次有效咨询，推荐人可得 '+db.v3.rewardRules.validLead+' 积分；运营方录入线下签约成交，再得 '+db.v3.rewardRules.deal+' 积分。仅点击分享、群内打开或重复咨询不计积分。</p><a href="#/recommend">完整规则 →</a></div></section>';
}
function v3InvitePage(type,key){
 const m=v3ShareMeta(type,key);
 return '<section class="v3-pad"><div class="v3-invite-head"><small>好友分享给你的一份找房信息</small><h1>'+esc(m.title)+'</h1><p>'+esc(m.subtitle)+'</p></div><img class="v3-invite-image" src="'+m.image+'" alt="'+esc(m.kind)+'场景配图"><div class="v3-info-box"><b>自己看看，按自己的节奏决定</b><p>这里有项目公开信息、通勤线索和找房清单；咨询由项目运营方后续联系，不需要你再转发给别人。</p></div><a class="btn primary wide" href="#/consult/'+esc(type)+'/'+encodeURIComponent(v3DecodedKey(key))+'">我想了解，发起咨询</a><a class="btn wide" href="#/search">先看看其他项目</a></section>';
}
function v3ConsultPage(type,key){
 const m=v3ShareMeta(type,key),direct=type==='direct',house=direct?v3Houses.find(function(x){return x.id===key}):null;
 const project=house?house.name:m.project;
 return '<section class="v3-pad"><small class="v3-kicker">项目咨询</small><h1>把你想了解的，<br>留给项目运营方。</h1><p class="v3-lead">仅用于本次找房咨询，提交后由运营方联系你；不代表预约成功或获得房源。</p><img class="v3-consult-image" src="assets/v3-survey.jpg" alt="青年人在讨论找房需求"><form class="v3-form" data-v3-form="consult" data-type="'+esc(type)+'" data-key="'+esc(key||'')+'"><label class="v3-field">怎么称呼你<input name="name" minlength="2" maxlength="20" placeholder="请输入称呼" required></label><label class="v3-field">联系电话<input name="phone" type="tel" inputmode="numeric" pattern="1[0-9]{10}" placeholder="请输入11位手机号" required></label><label class="v3-field">想了解的项目<select name="project">'+v3Houses.map(function(x){return '<option '+(project===x.name?'selected':'')+'>'+esc(x.name)+'</option>'}).join('')+'</select></label><label class="v3-field">最想问的问题<textarea name="question" rows="3" maxlength="200" placeholder="例如：现在有哪些可租房型？租金和其他费用怎么计算？"></textarea></label><label class="v3-check"><input type="checkbox" required><span>同意将以上信息提供给所选项目运营方用于本次咨询。</span></label><button class="btn primary wide" type="submit">提交咨询</button></form></section>';
}
function v3ConsultSuccess(){
 return '<section class="v3-pad v3-result"><div class="v3-result-mark">✓</div><h1>咨询已提交。</h1><p>请留意运营方联系。你也可以继续浏览公开项目与其他生活内容。</p><a class="btn primary wide" href="#/search">继续看看房</a><a class="btn wide" href="#/home">回到首页</a></section>';
}
function v3RecommendPage(){
 return '<section class="v3-pad"><div class="v3-recommend-hero"><small>一期 · 好友安居推荐计划</small><h1>把合适的家，<br>介绍给需要的人。</h1><p>一份有用的信息，比一句“来注册”更值得分享。</p></div><h2 class="v3-mt">三种推荐方式</h2><div class="v3-methods"><a href="#/search"><b>01 推荐这套房</b><span>从具体房源项目发起，朋友一眼知道位置、户型与公开租金。</span></a><a href="#/commute"><b>02 推荐通勤方案</b><span>先从工作地或学校出发，再看附近值得咨询的项目。</span></a><a href="#/share/checklist/first"><b>03 推荐找房清单</b><span>给刚来武汉的朋友一份政策与费用提醒。</span></a></div><h2>奖励怎么到手</h2><div class="v3-steps"><div><em>1</em><span>朋友打开分享内容</span><small>不发积分</small></div><div><em>2</em><span>朋友首次有效咨询</span><strong>+'+db.v3.rewardRules.validLead+' 积分</strong></div><div><em>3</em><span>安家乐寓录入线下签约成交</span><strong>再 +'+db.v3.rewardRules.deal+' 积分</strong></div></div><div class="v3-rule-mini"><b>请认真推荐</b><p>同一位朋友仅计一次推荐关系；自荐、重复咨询和无效联系方式不计奖励。签到、群聊分享、页面点击不直接得分。最终奖励以活动规则及运营方核实结果为准。</p></div><a class="btn primary wide" href="#/recommendations">查看我的推荐进度</a></section>';
}
function v3Recommendations(){
 const rows=db.v3.referrals.filter(function(x){return x.mine});
 return '<section class="v3-pad"><small class="v3-kicker">我的推荐</small><h1>有用的推荐，<br>会慢慢有回音。</h1><p class="v3-lead">这里只展示必要进度，不公开朋友的具体咨询内容。</p><div class="v3-recommend-stats"><div><strong>'+rows.length+'</strong><span>已关联好友</span></div><div><strong>'+rows.filter(function(x){return x.status==='有效咨询'||x.status==='已成交'}).length+'</strong><span>有效咨询</span></div><div><strong>'+rows.filter(function(x){return x.status==='已成交'}).length+'</strong><span>已成交</span></div></div><a class="btn primary wide" href="#/recommend">再推荐给朋友</a><div class="v3-section-head"><h2>推荐进度</h2></div>'+rows.map(function(x){return '<div class="v3-ref-row"><div class="v3-row"><b>'+esc(x.friend)+'</b><span class="pill '+(x.status==='已成交'?'green':x.status==='无效'?'red':'')+'">'+esc(x.status)+'</span></div><p>'+esc(x.source)+' · '+esc(x.project)+'</p><small>'+esc(x.created)+(x.status==='已成交'?' · 已录入线下成交':'')+'</small><div class="v3-ref-reward">'+(x.dealPaid?'基础 +'+db.v3.rewardRules.validLead+' / 成交 +'+db.v3.rewardRules.deal+' 积分':x.leadPaid?'基础 +'+db.v3.rewardRules.validLead+' 积分':x.status==='待核实'?'咨询待核实，暂未发奖':'暂未发奖')+'</div></div>'}).join('')+'<p class="v3-footnote">成交由武汉城投安家乐寓在线下签约后录入后台。若状态有疑问，请联系平台客服。</p></section>';
}
function v3Favorites(){
 const rows=v3Houses.filter(function(x){return db.v3.savedHouses.includes(x.id)});
 return '<section class="v3-pad"><h1>我的收藏</h1><p class="v3-lead">喜欢的项目，放在这里慢慢比较。</p>'+(rows.length?rows.map(v3HouseCard).join(''):'<div class="empty"><h3>还没有收藏项目</h3><a class="btn mt" href="#/search">去找房</a></div>')+'</section>';
}
function v3ConsultHistory(){
 const rows=db.v3.directConsults||[];
 return '<section class="v3-pad"><h1>我的咨询</h1><p class="v3-lead">这里记录你主动提交的项目咨询，不包含好友通过你的分享提交的咨询。</p>'+(rows.length?rows.map(function(r){return '<div class="v3-ref-row"><b>'+esc(r.project)+'</b><p>'+esc(r.question||'咨询项目')+' · 待运营方联系</p><small>'+esc(r.created)+'</small></div>'}).join(''):'<div class="empty"><h3>还没有咨询记录</h3><p>看中项目后，可以向运营方询问房型与费用。</p></div>')+'<a class="btn primary wide" href="#/search">继续找房</a></section>';
}
function v3RouteRender(route,key,extra){
 const custom=['home','search','house','commute','policy','surveys','survey','survey-result','share','invite','consult','consult-success','recommend','recommendations','favorites','consult-history'];
 if(!custom.includes(route))return false;
 let title='湖北青年有家',body='',active='';
 if(route==='home'){body=v3Home();active='home'}
 else if(route==='search'){title='我要找房';body=v3Search(key);active='search'}
 else if(route==='house'){const x=v3Houses.find(function(y){return y.id===key});title='项目详情';body=x?v3House(x):missing();active='search'}
 else if(route==='commute'){title='通勤找房';body=v3Commute(key);active='search'}
 else if(route==='policy'){title='政策资讯';body=v3Policy()}
 else if(route==='surveys'){title='需求调查';body=v3SurveyHub()}
 else if(route==='survey'){title='需求调查';body=v3SurveySets[key]?v3SurveyPage(key):missing()}
 else if(route==='survey-result'){title='感谢参与';body=v3SurveySets[key]?v3SurveyResult(key):missing()}
 else if(route==='share'){title='分享推荐';body=v3SharePage(key,extra)}
 else if(route==='invite'){title='好友分享';body=v3InvitePage(key,extra)}
 else if(route==='consult'){title='项目咨询';body=v3ConsultPage(key,extra)}
 else if(route==='consult-success'){title='咨询提交成功';body=v3ConsultSuccess()}
 else if(route==='recommend'){title='好友推荐计划';body=v3RecommendPage()}
 else if(route==='recommendations'){title='我的推荐';body=v3Recommendations();active='me'}
 else if(route==='favorites'){title='我的收藏';body=v3Favorites();active='me'}
 else if(route==='consult-history'){title='我的咨询';body=v3ConsultHistory();active='me'}
 v3Set(title,body,active);
 return true;
}
function v3Decorate(route,key){
 const head=document.querySelector('.mini-head strong');if(head&&head.textContent==='湖北青年安居')head.textContent='湖北青年有家';
 document.title=document.title.replace('湖北青年安居','湖北青年有家');
 const nav=document.querySelector('.tabbar');if(nav)nav.outerHTML=v3Nav(route==='me'?'me':route==='activities'||route==='rewards'?'home':'home');
 if(route==='me'){
  const box=document.querySelector('.profile-links');
  if(box)box.insertAdjacentHTML('afterbegin','<a class="profile-link" href="#/favorites"><span>'+icon('star')+'我的收藏</span><span class="arrow">›</span></a><a class="profile-link" href="#/consult-history"><span>'+icon('chat')+'我的咨询</span><span class="arrow">›</span></a><a class="profile-link" href="#/recommendations"><span>'+icon('user')+'我的推荐</span><span class="arrow">›</span></a>');
 }
 if(route==='newcomer'){
  const pad=document.querySelector('.new-hero + .pad');
  if(pad)pad.insertAdjacentHTML('beforeend','<a class="v3-newcomer-ref" href="#/recommend"><span>⌂</span><div><small>新人礼以外，还有一份安居心意</small><b>把合适的房推荐给朋友</b><p>朋友真实咨询、签约后，推荐人按规则得积分。</p></div><strong>›</strong></a>');
 }
 if(route==='daily'){
  const paper=document.querySelector('.daily-paper');
  if(paper)paper.insertAdjacentHTML('afterbegin','<img class="v3-daily-image" src="assets/v3-kitchen-safety.jpg" alt="出门前检查居家安全的场景">');
  document.querySelectorAll('.task-line').forEach(function(el){const href=el.getAttribute('href');const task=href&&db.tasks.find(function(t){return href.endsWith('/'+t.id)});if(task){const h=el.querySelector('h3');if(h)h.textContent=task.title}});
 }
 if(route==='quiz'){
  const section=document.querySelector('#task-form')?.parentElement;
  if(section)section.insertAdjacentHTML('afterbegin','<div class="v3-quiz-visual"><span>✦</span><small>一分钟生活小知识</small></div>');
 }
 if(route==='points'){
  const block=document.querySelector('.content-block p');
  if(block)block.insertAdjacentHTML('beforeend','<br>好友有效咨询 +'+db.v3.rewardRules.validLead+' 分<br>好友线下签约成交 再 +'+db.v3.rewardRules.deal+' 分。');
 }
}
document.querySelector('#app').addEventListener('click',function(ev){
 const button=ev.target.closest('[data-action]');if(!button)return;
 const action=button.dataset.action;
 if(action==='back'){go(button.dataset.back||'home');return}
 if(action==='share'){
  const type=button.dataset.type,key=button.dataset.key,channel=button.dataset.channel;
  const shareKey=key+(channel==='group'?'@group':'');
  const url=location.href.split('#')[0]+'#/invite/'+type+'/'+encodeURIComponent(shareKey);
  if(navigator.clipboard?.writeText)navigator.clipboard.writeText(url).catch(function(){});
  dialog('分享预览','<p>已生成包含推荐关系的'+(channel==='group'?'群聊':'好友')+'页面链接。仅有真实新用户完成有效咨询后，才可能获得积分。</p><p class="v3-copy-url">'+esc(url)+'</p>','预览好友页面',function(){closeDialog();go('invite/'+type+'/'+encodeURIComponent(shareKey))});
  return;
 }
 if(action==='save-house'){
  const key=button.dataset.key,i=db.v3.savedHouses.indexOf(key);
  if(i>=0)db.v3.savedHouses.splice(i,1);else db.v3.savedHouses.push(key);
  save();render();toast(i>=0?'已取消收藏':'已加入收藏');
 }
});
document.querySelector('#app').addEventListener('submit',function(ev){
 const form=ev.target.closest('[data-v3-form]');if(!form)return;ev.preventDefault();
 const kind=form.dataset.v3Form,fd=new FormData(form);
 if(kind==='search'){go('search/'+encodeURIComponent(String(fd.get('query')||'').trim()));return}
 if(kind==='commute'){go('commute/'+encodeURIComponent(String(fd.get('place')||'').trim()||'马鹦路'));return}
 if(kind==='survey'){const result=Object.fromEntries(fd.entries());db.v3.survey[form.dataset.type]=result;save();go('survey-result/'+form.dataset.type);return}
 if(kind==='consult'){
  const phone=String(fd.get('phone')||''),name=String(fd.get('name')||'').trim(),type=form.dataset.type;
  if(type!=='direct'&&phone===db.user.phone){toast('推荐人与咨询人不能使用同一手机号');return}
  if(type!=='direct'&&db.v3.referrals.some(function(x){return x.rawPhone===phone})){toast('该手机号已有咨询记录，请等待运营方联系');return}
  if(type==='direct')db.v3.directConsults.unshift({id:id(),name:name,phone:phoneMask(phone),project:String(fd.get('project')),question:String(fd.get('question')||''),created:when()});
  else db.v3.referrals.unshift({id:id(),friend:name,rawPhone:phone,phone:phoneMask(phone),project:String(fd.get('project')),source:(v3DecodedKey(form.dataset.key).endsWith('@group')?'群聊·':'')+v3ShareMeta(type,form.dataset.key).kind,status:'待核实',created:when(),mine:true,leadPaid:false,dealPaid:false,question:String(fd.get('question')||'')});
  save();go('consult-success');return;
 }
});
render();
