function doubaoOwned(){return db.exchanges.find(x=>x.mine&&x.reward==='r-doubao')}
function doubaoClaimButton(n){
 const owned=doubaoOwned();if(owned)return `<a class="btn primary wide" href="#/coupon/${owned.id}">查看我的卡</a>`;
 if(!n||n.status!=='进行中')return '<button class="btn wide" disabled>本期已结束</button>';
 if(n.aiDisplay!=='展示')return '<button class="btn wide" disabled>本期暂未开放</button>';
 if(n.stock<1)return '<button class="btn wide" disabled>本期已领完</button>';
 const ready=!!db.user.doneDate||db.registrations.some(x=>x.mine&&x.status==='已到场');
 return ready?'<button class="btn primary wide" onclick="claimNew()">领取流量卡</button>':'<a class="btn primary wide" href="#/quiz/t1">答一道生活题，领取</a>';
}
function doubaoCard(n){return n?.aiDisplay==='展示'?`<a class="doubao-gift-card" href="#/ai-gift/${n.id}"><img src="assets/doubao-avatar.png" alt="豆包头像"><div><small>你的第一份见面礼</small><h2>${esc(n.aiTitle)}</h2><p>${esc(n.aiSubtitle)}</p><strong>查看礼品 →</strong></div></a>`:''}
function doubaoNewcomer(){
 const n=db.newcomers.find(x=>x.status==='进行中');
 return `<section class="new-hero"><img src="assets/figma-city.webp" alt="暖阳中的城市与青年安居社区"><div><span class="gift-tag">湖北青年有家 · 新人专享</span><h1>新生活的第一份礼，<br>从这里领取。</h1><p>豆包流量卡，陪你开启在武汉的新生活。</p></div></section><section class="pad"><h2 class="new-stage-title">你现在的状态是？</h2><div class="stage-options">${['正在找房','已经入住','先了解'].map(s=>`<button class="${db.user.stage===s?'selected':''}" onclick="chooseStage('${s}')">${s}</button>`).join('')}</div><a class="guide-link" href="#/${db.user.stage==='正在找房'?'guide':db.user.stage==='已经入住'?'activities':'event/e1'}"><h3>${db.user.stage==='正在找房'?'先读一份城市租住指南':db.user.stage==='已经入住'?'看看附近这周有什么活动':'从一场开放活动认识这里'} →</h3><p>先了解城市，再慢慢找到适合自己的生活。</p></a>${doubaoCard(n)}<div class="doubao-claim">${doubaoClaimButton(n)}<p class="small mt">完成一次生活知识题或首次活动到场即可领取，每人限领一次。${n?'本期至 '+n.end+'，剩余 '+n.stock+' 份。':''}</p></div></section>`;
}
function doubaoDetail(n){
 if(!n||n.aiDisplay!=='展示')return missing();
 return `<section class="doubao-hero"><div><span class="gift-tag">新人专享 · 免费领取</span><h1>豆包流量卡</h1><p>求职、学习、生活规划，<br>让新生活轻松一点。</p></div><img src="assets/doubao-avatar.png" alt="豆包头像"></section><section class="pad doubao-detail"><div class="doubao-offer"><span>新人见面礼</span><h2>免费领一张豆包流量卡</h2><p>完成一次生活知识题，或首次活动到场后领取。无需扣积分，每人限领一张。</p>${doubaoClaimButton(n)}<small>本期至 ${n.end} · 剩余 ${n.stock} 份</small></div><h2>领到后，试试这些小事</h2><div class="doubao-ideas"><details open><summary>01　准备一场面试</summary><p>我正在准备面试。请先问我目标岗位和三段真实经历，再帮我整理一分钟自我介绍，不要编造经历。</p></details><details><summary>02　安排下班后的生活</summary><p>我每天18:30下班，希望一周运动两次、做饭三次。先问我通勤时间和预算，再帮我做一份轻松的计划。</p></details><details><summary>03　每天练十分钟英语</summary><p>从点餐场景开始，一次与我对话一句，并用中文解释我没听懂的地方。</p></details></div><h2>领取与使用</h2><ol class="doubao-steps"><li>完成一次生活知识题或首次活动到场。</li><li>点击领取，流量卡自动存入“我的券”。</li><li>打开卡片，按使用指南激活权益。</li></ol><p class="small muted">本卡用于豆包 App 体验，非开发者 Token。具体权益内容、适用账号及有效期以卡内说明为准。请勿向 AI 提供证件号、银行卡等敏感信息。</p><a class="btn wide mt" href="#/coupons">我的券</a></section>`;
}
claimNew=function(){authenticate(()=>{
 const n=db.newcomers.find(x=>x.status==='进行中'),owned=doubaoOwned();
 if(owned)return go('coupon/'+owned.id);if(!n||!n.stock||n.aiDisplay!=='展示')return toast('暂不可领取');
 if(!db.user.doneDate&&!db.registrations.some(x=>x.mine&&x.status==='已到场'))return go('quiz/t1');
 db.user.newcomer=true;n.stock--;const rw=by('rewards','r-doubao');
 const x={id:id(),reward:'r-doubao',title:rw.title,snapshot:structuredClone(rw),name:db.user.name,phone:db.user.phone,cost:0,status:'待使用',code:'DB'+uidcode(),created:when(),valid:rw.valid,mine:true};
 db.exchanges.unshift(x);save();go('coupon/'+x.id);toast('豆包流量卡已放进你的券包');
})};
function doubaoCoupon(x){return `<section class="pad doubao-detail"><div class="doubao-ticket"><img src="assets/doubao-avatar.png" alt="豆包头像"><small>湖北青年有家 · 新人见面礼</small><h1>豆包流量卡</h1>${labelStatus(x.status)}<p>豆包 App 体验权益</p><div class="doubao-card-code"><small>卡号</small><strong>${esc(x.code)}</strong></div><p class="small">有效期至 ${x.valid}</p></div><h2>使用指南</h2><ol class="doubao-steps"><li>确认你已登录自己的豆包 App 账号。</li><li>复制卡号，按权益兑换入口指引使用。</li><li>确认兑换成功后，标记这张卡已使用。</li></ol><p class="small muted">权益内容与适用账号以兑换页说明为准。卡号请妥善保管，不要向无关人员提供。</p>${x.status==='待使用'?`<button class="btn primary wide mt" onclick="doubaoCopy('${x.id}')">复制卡号</button><button class="btn wide mt" onclick="doubaoUse('${x.id}')">标记已使用</button>`:`<p class="note">已于 ${esc(x.used||x.created)} 标记使用</p>`}<a class="btn wide mt" href="#/coupons">我的券</a></section>`}
function doubaoCopy(key){const x=by('exchanges',key);navigator.clipboard?.writeText(x.code).then(()=>toast('卡号已复制')).catch(()=>toast('请长按卡号复制'));if(!navigator.clipboard)toast('请长按卡号复制')}
function doubaoUse(key){dialog('标记已使用','请确认已完成权益兑换。标记后卡片将移入已使用记录。','确认',()=>{const x=by('exchanges',key);if(x.status!=='待使用')return; x.status='已使用';x.used=when();save();render();toast('已标记使用')})}
const doubaoOldRoute=v3RouteRender;
v3RouteRender=function(route,key,extra){
 if(route==='newcomer'){v4Set('新人见面礼',doubaoNewcomer(),null,'home');return true}
 if(route==='ai-gift'){v4Set('豆包流量卡',doubaoDetail(by('newcomers',key)),null,'newcomer');return true}
 if(route==='coupon'){const x=by('exchanges',key);if(x?.reward==='r-doubao'){v4Set('我的流量卡',doubaoCoupon(x),null,'coupons');return true}}
 return doubaoOldRoute(route,key,extra);
};
render();
