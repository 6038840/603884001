/* 仅联动运营配置和记录，不重新设计小程序布局。 */
const a3ClientAward=gAward;
gAward=function(n,action,note,key){const ruleKey=key.startsWith('sign-')?'sign':key.startsWith('answer-')?'quiz':key==='new-gift'?'newcomer':key.startsWith('invite-')?'invite':'';if(ruleKey){n=a3Reward(ruleKey);if(n<=0)return false}return a3ClientAward(n,action,note,key)};
gMaybeRewardFriend=function(f){
 if(!f.signed||!f.answered||f.reward||f.stage==='不计奖')return;
 f.stage='已参与';f.signPoints??=a3Reward('sign');f.quizPoints??=a3Reward('quiz');f.giftPoints??=a3Reward('newcomer');f.newGiftReceived=f.giftPoints>0;const r=db.admin3.rules.find(r=>r.id==='invite'),paid=gState().invites.filter(x=>x.reward>0&&!x.reclaimed),today=paid.filter(x=>x.rewardDate===gToday());
 if(!a3RuleActive(r)){f.stage='不计奖';f.reason='参与推荐奖励暂未开放';save();return}
 if(paid.length>=r.total||today.length>=r.daily){f.stage='不计奖';f.reason='已达到本期或单日推荐计奖上限';save();return}
 f.reward=r.reward;f.rewardDate=gToday();gAward(r.reward,'推荐朋友参与',phoneMask(f.phone)+'首次签到＋答题','invite-'+f.id);save();
};
function a3ClientCopy(route){
 const sign=a3Reward('sign'),quiz=a3Reward('quiz'),gift=a3Reward('newcomer'),invite=a3Reward('invite'),lead=a3Reward('lead'),deal=a3Reward('deal'),r=db.admin3.rules.find(r=>r.id==='invite');
 const replacements=[[/每天\s*\+?2\s*积分/g,'每天 +'+sign+' 积分'],[/每天2积分/g,'每天'+sign+'积分'],[/\+2积分/g,'+'+sign+'积分'],[/\+2 积分/g,'+'+sign+' 积分'],[/答对首题5积分/g,'答对首题'+quiz+'积分'],[/\+5积分/g,'+'+quiz+'积分'],[/\+5 积分/g,'+'+quiz+' 积分'],[/每天最多计5位、本期30位/g,'每天最多计'+r.daily+'位、本期'+r.total+'位'],[/单日最多5位、本期最多30位/g,'单日最多'+r.daily+'位、本期最多'+r.total+'位'],[/单日推荐5位/g,'单日推荐'+r.daily+'位'],[/本期30位/g,'本期'+r.total+'位'],[/\+30\s*积分/g,'+'+invite+'积分'],[/得30积分/g,'得'+invite+'积分'],[/\+20\s*积分/g,'+'+lead+'积分'],[/得20积分/g,'得'+lead+'积分'],[/\+300\s*积分/g,'+'+deal+'积分'],[/得300积分/g,'得'+deal+'积分']];
 if(['growth','daily','activities','newcomer','me','friend-welcome','invite-friends','growth-rules','share-platform'].includes(route))replacements.push([/80积分/g,gift+'积分'],[/80 积分/g,gift+' 积分']);
 const walker=document.createTreeWalker(v4App,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode()){let text=node.nodeValue;for(const [re,value] of replacements)text=text.replace(re,value);node.nodeValue=text;}
 v4App.querySelectorAll('.g-sign-days b').forEach(b=>{if(b.textContent==='+2')b.textContent='+'+sign});
 if(route==='invite-friends'){const nums=v4App.querySelectorAll('.g-invite-stages b');if(nums[0])nums[0].firstChild.textContent='+'+invite+' ';if(nums[1])nums[1].firstChild.textContent='+'+deal+' ';}
 if(['growth','daily','activities','newcomer'].includes(route))v4App.querySelectorAll('.g-bonus>b').forEach(b=>b.firstChild.textContent=String(gift));
 if(route==='newcomer'&&gift<(gGood('stand')?.points||80)){const p=v4App.querySelector('.g-hub-hero p');if(p)p.textContent='完成两件小事，领取新人的第一份积分。';}
 if(route==='friend-welcome'){const f=gInviteRecord();if(f?.signed&&f?.answered){const total=(f.signPoints??2)+(f.quizPoints??5)+(f.giftPoints??80);const p=v4App.querySelector('.g-answer p');if(p)p.textContent='两步任务已完成。新人积分礼：'+(f.giftPoints??80)+'积分；当前参与积分：'+total+'。你也可以继续浏览房源与实物礼品。';}}
 if(route==='growth-rules'){const values=v4App.querySelectorAll('.g-kv dd'),numbers=[sign,quiz,gift,invite,lead,deal];values.forEach((dd,i)=>{if(i<6)dd.textContent=dd.textContent.replace(/\d+(?=积分)/g,String(numbers[i]))});}
 if(route==='newcomer'&&!a3Reward('newcomer')){const b=v4App.querySelector('[data-g=new-gift]');if(b){b.disabled=true;b.textContent='本期暂不可领取'}}
 if(route==='ai-gift'){const walker=document.createTreeWalker(v4App,NodeFilter.SHOW_TEXT);let node;while(node=walker.nextNode())node.nodeValue=node.nodeValue.replaceAll('完成一次生活知识题，或首次活动到场后领取。','完成首次签到与生活知识答题后领取。').replaceAll('完成一次生活知识题或首次活动到场。','完成首次签到与生活知识答题。');}
}
const a3ClientRoute=v3RouteRender;
v3RouteRender=function(route,key,extra){a3Sync();const handled=a3ClientRoute(route,key,extra);if(handled)a3ClientCopy(route);return handled};
const a3ClientToast=toast;
toast=function(message){if(message==='签到成功，+2积分')message=a3Reward('sign')?'签到成功，+'+a3Reward('sign')+'积分':'签到成功，积分奖励暂未开放';if(message==='答对了，+5积分')message=a3Reward('quiz')?'答对了，+'+a3Reward('quiz')+'积分':'答对了，积分奖励暂未开放';if(message==='80积分已到账')message=a3Reward('newcomer')+'积分已到账';a3ClientToast(message)};
const a3DoubaoClaim=doubaoClaimButton;
doubaoClaimButton=function(n){const owned=doubaoOwned();if(owned)return `<a class="btn primary wide" href="#/coupon/${owned.id}">查看我的卡</a>`;if(!n||n.status!=='进行中'||n.end<a3Date()||n.start>a3Date())return '<button class="btn wide" disabled>本期暂不可领取</button>';if(n.aiDisplay!=='展示'||n.stock<1)return a3DoubaoClaim(n);return gState().signed.length&&Object.values(gState().answers).some(x=>x.correct)?'<button class="btn primary wide" onclick="claimNew()">领取流量卡</button>':'<a class="btn primary wide" href="#/growth">先完成签到与答题</a>'};
claimNew=function(){authenticate(()=>{const n=by('newcomers','n1'),owned=doubaoOwned();if(owned)return go('coupon/'+owned.id);if(!n||n.status!=='进行中'||n.aiDisplay!=='展示'||n.start>a3Date()||n.end<a3Date())return toast('本期暂不可领取');if(!gState().signed.length||!Object.values(gState().answers).some(x=>x.correct))return go('growth');const c=db.admin2.giftCards.find(c=>c.status==='可发放'&&c.valid>=a3Date());if(!c)return toast('本期流量卡已领完');const rw=by('rewards','r-doubao'),x={id:id(),reward:'r-doubao',title:rw.title,snapshot:structuredClone(rw),name:db.user.name,phone:db.user.phone,cost:0,status:'待使用',code:c.code,created:a3Now(),valid:c.valid,mine:true};Object.assign(c,{status:'已发放',recipient:x.name,phone:x.phone,issued:x.created});db.exchanges.unshift(x);n.stock=Math.max(0,n.stock-1);save();go('coupon/'+x.id);toast('豆包流量卡已放进你的券包')})};
v4App.addEventListener('click',e=>{const b=e.target.closest('[data-g=new-gift]');if(b&&!a3Reward('newcomer')){e.preventDefault();e.stopImmediatePropagation();toast('本期新人积分礼暂未开放')}const sign=e.target.closest('[data-g=friend-sign]');if(sign){const f=gInviteRecord();if(f&&!f.signed)f.signPoints=a3Reward('sign')}},true);
v4App.addEventListener('submit',e=>{const form=e.target.closest('[data-g-form=friend-quiz]');if(form&&new FormData(form).get('answer')==='yes'){const f=gInviteRecord();if(f&&!f.answered)f.quizPoints=a3Reward('quiz')}},true);
window.addEventListener('storage',e=>{if(e.key==='anju-phase1-v1'){try{db=JSON.parse(e.newValue)||db;a3Sync();render()}catch{}}});
render();
