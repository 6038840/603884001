/* 后台 2.0 联动层：不改变现有首页和通勤页面。 */
function a2ClientSurveySync(){
 for(const q of db.admin2.surveys)v3SurveySets[q.id]={title:q.title,image:q.image,intro:q.intro,fields:q.fields};
}
const a2ClientHub=v3SurveyHub,a2ClientSurveyPage=v3SurveyPage,a2ClientRoutes=v3RouteRender;
v3SurveyHub=function(){
 a2ClientSurveySync();
 const qs=db.admin2.surveys.filter(q=>q.status!=='草稿');
 return '<section class="v3-pad"><h1>先聊聊，你想要的生活。</h1><p class="v3-lead">几道简单问题，帮助我们把找房与社区内容做得更贴近你。</p>'+qs.map(q=>'<a class="v3-survey-card" href="#/survey/'+q.id+'"><img src="'+esc(q.image)+'" alt="'+esc(q.title)+'配图"><div><small>'+q.fields.length+' 题 · '+(q.status==='收集中'?'正在收集':q.status)+'</small><h2>'+esc(q.title)+'</h2><p>'+esc(q.intro)+'</p><b>'+(db.v3.survey[q.id]?'回看我的回答':q.status==='收集中'?'去填写':'查看调查')+' →</b></div></a>').join('')+'</section>';
};
v3SurveyPage=function(key){
 a2ClientSurveySync();const q=db.admin2.surveys.find(q=>q.id===key);if(!q)return missing();
 if(q.status==='收集中'&&q.start<=a2Date()&&q.end>=a2Date())return a2ClientSurveyPage(key);
 return '<img class="v3-cover" src="'+esc(q.image)+'" alt="'+esc(q.title)+'配图"><section class="v3-pad"><h1>'+esc(q.title)+'</h1><p>'+esc(q.intro)+'</p><p class="note">'+(q.status==='草稿'?'本问卷尚未开放。':q.status==='已暂停'?'这份调查已暂停收集。':q.start>a2Date()?'将于 '+q.start+' 开始收集。':'这份调查已结束，感谢关注。')+'</p>'+(db.v3.survey[key]?'<div class="v3-answer-summary">'+Object.values(db.v3.survey[key]).map(x=>'<span>'+esc(x)+'</span>').join('')+'</div>':'')+'<a class="btn wide" href="#/surveys">其他调查</a></section>';
};
v3RouteRender=function(route,key,extra){a2AdvanceRules();a2ClientSurveySync();return a2ClientRoutes(route,key,extra)};
document.querySelector('#app').addEventListener('submit',e=>{
 const form=e.target.closest('[data-v3-form=survey]');if(!form)return;
 e.preventDefault();e.stopImmediatePropagation();
 const q=db.admin2.surveys.find(q=>q.id===form.dataset.type);
 if(!q||q.status!=='收集中'||q.start>a2Date()||q.end<a2Date())return toast('本问卷暂不收集，请查看其他调查');
 const answers=Object.fromEntries(new FormData(form));
 if(q.fields.some(f=>!f[2].includes(answers[f[0]])))return toast('请完成每一道题');
 const first=!db.v3.survey[q.id];db.v3.survey[q.id]=answers;
 db.admin2.surveySubmittedAt=db.admin2.surveySubmittedAt||{};db.admin2.surveySubmittedAt[q.id]=a2Now();
 const rule=a2MatchingRule('问卷完成');
 if(first&&rule){points(rule.reward,'问卷完成',q.title);db.admin2.grantLogs.unshift({id:id(),rule:rule.id,name:db.user.name,points:rule.reward,source:q.title,date:a2Now(),funder:'平台'})}
 save();go('survey-result/'+q.id);
},true);
claimNew=function(){authenticate(()=>{
 const n=db.newcomers.find(x=>x.status==='进行中'),owned=doubaoOwned();
 if(owned)return go('coupon/'+owned.id);
 if(!n||!n.stock||n.aiDisplay!=='展示')return toast('暂不可领取');
 if(!db.user.doneDate&&!db.registrations.some(x=>x.mine&&x.status==='已到场'))return go('quiz/t1');
 const card=db.admin2.giftCards.find(c=>c.status==='可发放'&&c.valid>=a2Date());
 if(!card)return toast('本期流量卡已领完');
 const rw=by('rewards','r-doubao'),x={id:id(),reward:'r-doubao',title:rw.title,snapshot:structuredClone(rw),name:db.user.name,phone:db.user.phone,cost:0,status:'待使用',code:card.code,created:a2Now(),valid:card.valid,mine:true};
 Object.assign(card,{status:'已发放',recipient:x.name,phone:x.phone,issued:x.created});db.user.newcomer=true;n.stock--;db.exchanges.unshift(x);save();go('coupon/'+x.id);toast('豆包流量卡已放进你的券包');
})};
const a2ClientRecommendProgress=v3Recommendations;
v3Recommendations=function(){
 const template=document.createElement('template');template.innerHTML=a2ClientRecommendProgress();
 const rows=db.v3.referrals.filter(x=>x.mine),elements=template.content.querySelectorAll('.v3-ref-reward');
 rows.forEach((r,i)=>{if(r.dealPaid)elements[i].textContent='基础 +'+(r.leadReward??db.v3.rewardRules.validLead)+' / 成交 +'+(r.dealReward??db.v3.rewardRules.deal)+' 积分';else if(r.leadPaid)elements[i].textContent='基础 +'+(r.leadReward??db.v3.rewardRules.validLead)+' 积分'});
 return template.innerHTML;
};
render();
