/* 湖北青年有家 · 后台管理 2.0 */
let a2Filters={rules:{q:'',status:'',category:''},surveys:{q:'',status:''},cards:{q:'',status:''}};
const a2Status=s=>`<span class="a2-status" data-status="${esc(s)}">${esc(s)}</span>`;
const a2Opt=(items,val)=>items.map(x=>`<option value="${esc(x)}" ${x===val?'selected':''}>${esc(x||'全部')}</option>`).join('');
const a2Field=(name,label,value,type='text',help='',required=true)=>`<label class="field"><span>${label}${required?' <em>*</em>':''}</span><input name="${name}" type="${type}" value="${esc(value??'')}" ${required?'required':''} ${type==='number'?'min="0" step="1"':''}>${help?`<small class="a2-help">${help}</small>`:''}</label>`;
const a2Select=(name,label,items,value,help='')=>`<label class="field"><span>${label}</span><select name="${name}">${a2Opt(items,value)}</select>${help?`<small class="a2-help">${help}</small>`:''}</label>`;
const a2Pair=(label,value)=>`<dt>${label}</dt><dd>${value??'—'}</dd>`;
const a2Section=(number,title,body)=>`<section class="a2-section"><h2><span>${number}</span>${title}</h2>${body}</section>`;
const a2Heading=(title,buttons='')=>`<div class="page-heading"><h1>${title}</h1><div class="row">${buttons}</div></div>`;
const a2Button=(label,action,id='',cls='')=>`<button type="button" class="${cls}" data-a2="${action}" data-id="${esc(id)}">${label}</button>`;
const a2RulesTabs=active=>`<div class="a2-tabs">${[['rules','奖励规则'],['rules/settings','通用设置'],['rules/history','变更记录']].map(([path,label])=>`<a href="#/${path}" class="${active===path?'active':''}">${label}</a>`).join('')}</div>`;
const a2Sources=[['京东 · 京豆获取规则','https://help.jd.com/user/issue/167-4224.html'],['微盟 · 积分规则','https://help.weimob.com/os/article/6039'],['微盟 · 权益设置','https://help.weimob.com/os/article/6409'],['有赞 · 送积分规则','https://help.youzan.com/displaylist/detail_5_5-2-24446']];
shell=function(active,body){
 const menus=[['积分商城',[['rewards','福利管理'],['exchanges','兑换记录'],['ledger','积分明细'],['rules','积分规则']]],['活动运营管理',[['events','活动管理'],['registrations','报名记录'],['newcomers','新人见面礼'],['tasks','每日轻任务'],['surveys','需求问卷'],['contributions','内容审核']]],['增长运营',[['referrals','好友推荐']]],['内容共创',[['keepers','共创管家']]]];
 const names=Object.fromEntries(menus.flatMap(x=>x[1]));
 document.querySelector('#admin').innerHTML=`<div class="admin-shell"><header class="admin-top"><div class="brand"><span class="brand-mark">安</span><div>湖北青年有家<small>运营管理平台</small></div></div><div class="account"><span class="account-circle">运</span>平台运营</div></header><aside class="sidebar"><nav aria-label="运营管理导航">${menus.map(([group,items])=>`<div class="menu-group">${group}</div>${items.map(([key,name])=>`<a href="#/${key}" class="${active===key?'active':''}" ${active===key?'aria-current="page"':''}><span>${navIcon(key)}</span>${name}</a>`).join('')}`).join('')}</nav></aside><section class="admin-workspace"><main class="admin-main"><div class="content-card">${body.includes('class="breadcrumb"')?'':`<div class="breadcrumb">运营管理 / ${names[active]||'积分规则'}</div>`}${body}</div></main></section></div>`;
 document.title=(names[active]||'运营管理')+' · 后台 2.0 · 湖北青年有家';
};
const a2OriginalIcon=navIcon;
navIcon=function(key){if(key==='surveys')return '<svg viewBox="0 0 24 24" aria-hidden="true"><rect x="4" y="3" width="16" height="18" rx="2"/><path d="M8 7h8M8 12h8M8 17h4"/></svg>';if(key==='referrals')return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M5 19 19 5M8 5h11v11"/></svg>';return a2OriginalIcon(key)};
function a2Audit(name,action,before,after){db.admin2.history.unshift({id:id(),name,action,before,after,date:a2Now(),operator:'平台运营'})}
function a2RuleActions(r){
 let out=`<a href="#/rules/${r.id}">详情</a>`;
 if(['草稿','已启用','已停用'].includes(r.status))out+=`<a href="#/rules/${r.id}/edit">编辑</a>`;
 if(r.status==='草稿')out+=a2Button('发布','rule-publish',r.id)+a2Button('删除','rule-delete',r.id,'danger');
 if(r.status==='已启用')out+=a2Button(r.draft?'发布修改':'停用',r.draft?'rule-publish':'rule-stop',r.id,r.draft?'':'danger');
 if(r.status==='待生效')out+=a2Button('取消发布','rule-cancel',r.id);
 if(r.status==='已停用')out+=a2Button('启用','rule-publish',r.id);
 if(r.status==='已结束')out+=a2Button('复制','rule-copy',r.id);
 return out;
}
function a2RulesList(){
 const f=a2Filters.rules,rows=db.admin2.rules.filter(r=>(!f.q||[r.name,r.scene,r.summary].join(' ').includes(f.q))&&(!f.status||r.status===f.status)&&(!f.category||r.category===f.category));
 return a2Heading('积分规则',`<button class="btn" data-a2="rules-export">导出</button><a class="btn primary" href="#/rules/new">新建规则</a>`)+a2RulesTabs('rules')+`<form class="filters" data-a2-form="rule-filter">${a2Field('q','关键词',f.q,'text','',false)}${a2Select('status','状态',['','已启用','草稿','待生效','已停用','已结束'],f.status)}${a2Select('category','奖励场景',['','新人拉新','日常活跃','活动参与','内容共创'],f.category)}<button class="btn primary">查询</button>${a2Button('重置','rule-filter-reset','','btn')}</form><div class="table-wrap"><table><thead><tr><th>规则名称</th><th>场景</th><th>奖励</th><th>领取限制</th><th>成本承担</th><th>状态</th><th>操作</th></tr></thead><tbody>${rows.map(r=>`<tr><td><a class="a2-rule-name" href="#/rules/${r.id}">${esc(r.name)}</a><small class="a2-rule-desc">${esc(r.summary)}</small></td><td>${r.category}</td><td>${r.reward} 积分</td><td>${r.limitPeriod} ${r.limitCount} 次${r.totalLimit?`<small class="a2-row-note">每人累计 ${r.totalLimit} 次</small>`:''}</td><td>${esc(r.funder)}</td><td>${a2Status(r.status)}${r.draft?'<small class="a2-row-note">有待发布修改</small>':''}</td><td><div class="a2-actions">${a2RuleActions(r)}</div></td></tr>`).join('')}</tbody></table></div>${rows.length?'':'<div class="admin-empty">没有找到相关规则</div>'}<div class="pagination">共 ${rows.length} 条</div>`;
}
function a2RuleDetail(r){
 if(!r)return '<div class="admin-empty">规则不存在</div>';
 const logs=db.admin2.grantLogs.filter(x=>x.rule===r.id);
 return `<div class="breadcrumb"><a href="#/rules">积分规则</a> / 详情</div>`+a2Heading('规则详情','<a class="btn" href="#/rules">返回</a>')+
 (r.draft?`<div class="a2-pending"><span>修改尚未发布，当前仍按原规则发奖。</span><div>${a2Button('查看修改','rule-draft',r.id,'btn')}${a2Button('发布修改','rule-publish',r.id,'btn primary')}</div></div>`:'')+
 `<div class="detail-heading"><h2>${esc(r.name)}</h2>${a2Status(r.status)}</div>`+
 a2Section('01','奖励条件',`<dl class="detail-grid">${a2Pair('奖励场景',esc(r.scene))}${a2Pair('有效行为',esc(r.summary))}${a2Pair('奖励积分',r.reward+' 积分')}${a2Pair('适用人群',esc(r.audience))}${a2Pair('参与项目',esc(r.projects.join('、')))}${r.category==='新人拉新'?a2Pair('分享渠道',esc(r.channels.join('、'))):''}${r.milestone?a2Pair('累计门槛',r.milestone+' 次有效参与（不要求连续）'):''}</dl>`)+
 a2Section('02','限制与发放',`<dl class="detail-grid">${a2Pair('发放节点',r.grant)}${a2Pair('领取次数',r.limitPeriod+' '+r.limitCount+' 次')}${a2Pair('累计次数',r.totalLimit?r.totalLimit+' 次／人':'按有效行为计奖')}${a2Pair('重复奖励','同一行为仅奖励一次；同类规则取较高奖励')}${a2Pair('无效行为',r.reclaim)}${a2Pair('成本承担',esc(r.funder))}${a2Pair('有效时间',r.start+' 至 '+r.end)}${r.effectiveAt?a2Pair('生效时间',r.effectiveAt):''}</dl>`)+
 a2Section('03','展示文案',`<div class="a2-preview"><h3>${esc(r.name)}</h3><p>${esc(r.summary)}</p><p>符合条件可获 ${r.reward} 积分，${r.limitPeriod}限领 ${r.limitCount} 次。</p></div>`)+
 a2Section('04','发放记录',logs.length?`<div class="table-wrap"><table><thead><tr><th>获奖人</th><th>积分</th><th>关联行为</th><th>时间</th></tr></thead><tbody>${logs.map(x=>`<tr><td>${x.name}</td><td>+${x.points}</td><td>${esc(x.source)}</td><td>${x.date}</td></tr>`).join('')}</tbody></table></div>`:'<p>还没有这条规则的发放记录。</p>')+
 `<div class="detail-footer"><a class="btn" href="#/rules">返回</a><div class="a2-actions">${a2RuleActions(r)}</div>${a2Button('试算奖励','rule-simulate',r.id,'btn')}</div>`;
}
function a2RuleForm(record){
 const r=record?(record.draft||record):a2RuleSeed('','', '每日有效参与','日常活跃',5,{status:'草稿',start:a2Date()+' 00:00',end:'2026-12-31 23:59'});
 return `<div class="breadcrumb"><a href="#/rules">积分规则</a> / ${record?'编辑':'新建'}</div>`+a2Heading(record?'编辑积分规则':'新建积分规则','<a class="btn" href="#/rules">返回</a>')+`<form data-a2-form="rule" data-id="${record?.id||''}" class="a2-narrow"><div class="form-error" id="a2-error"></div>`+
 a2Section('01','选择奖励行为',`<div class="a2-two-cols">${a2Field('name','规则名称',r.name)}${a2Select('scene','奖励行为',['每日有效参与','活动到场','内容采纳','累计参与','首次有效咨询','线下签约成交','问卷完成'],r.scene)}${a2Select('audience','适用人群',['全部用户','正在找房的用户','已经入住的用户','用户与共创管家'],r.audience)}${a2Field('reward','每次奖励（积分）',r.reward,'number','请输入正整数。')}<label class="field full"><span>有效行为说明 <em>*</em></span><textarea name="summary" rows="3" required maxlength="300">${esc(r.summary)}</textarea></label></div>`)+
 a2Section('02','范围与领取限制',`<div class="a2-two-cols"><label class="field full"><span>参与项目</span><select name="project"><option>武汉城投安家乐寓全部参与项目</option>${v3Houses.map(x=>`<option ${r.projects[0]===x.name?'selected':''}>${esc(x.name)}</option>`).join('')}</select></label><div class="field full" id="a2-channel-field"><span>分享渠道</span><div class="a2-check-row">${['好友','群聊'].map(x=>`<label><input type="checkbox" name="channels" value="${x}" ${r.channels.includes(x)?'checked':''}>${x}</label>`).join('')}</div><small class="a2-help">好友与群聊共用同一个首次有效咨询奖励；同一人不重复计奖。</small></div>${a2Select('limitPeriod','领取次数按什么计算',['每日','每场活动','每篇内容','每位被推荐人','每份问卷','每人'],r.limitPeriod)}${a2Field('limitCount','每个周期最多领取（次）',r.limitCount,'number')}${a2Field('totalLimit','每人累计最多领取（次）',r.totalLimit,'number','填0表示按有效行为计奖，不额外设置累计上限。')}${a2Field('milestone','累计参与门槛（次）',r.milestone||3,'number','仅用于累计参与奖励。')}<div class="a2-field-note full">同一活动、内容、咨询或问卷仅计一次有效行为；同类规则同时满足时，只发较高奖励。</div></div>`)+
 a2Section('03','发放与成本',`<div class="a2-two-cols">${a2Select('grant','发放节点',['满足条件后发放','内容通过审核后发放','运营方确认有效后发放','运营商录入成交后发放'],r.grant)}<div class="field"><span>成本承担</span><p class="a2-field-note" id="a2-funder-value">${r.scene==='线下签约成交'?'武汉城投安家乐寓':'平台'}</p><small class="a2-help">成交奖由运营商承担，单独记录。</small></div>${a2Select('reclaim','核实无效后的处理',['核实无效后回收','停止后续奖励并人工处理'],r.reclaim)}</div>`)+
 a2Section('04','有效时间与发布',`<div class="a2-two-cols">${a2Field('start','开始时间',r.start.replace(' ','T'),'datetime-local')}${a2Field('end','结束时间',r.end.replace(' ','T'),'datetime-local')}${a2Select('effectiveMode','发布后生效方式',['立即生效','指定时间生效'],r.effectiveMode||'立即生效')}${a2Field('effectiveAt','指定生效时间',(r.effectiveAt||a2Date()+' 18:00').replace(' ','T'),'datetime-local','指定时间到达后开始使用新规则。',false)}</div><p class="a2-help">保存后可检查修改，再发布；已发放奖励按原记录保留。</p>`)+
 `<div class="a2-sticky-footer"><a class="btn" href="#/rules/${record?.id||''}">取消</a><button class="btn primary">保存</button><span>保存不会立即改变正在发放的奖励</span></div></form>`;
}
function a2Settings(edit){
 const s=db.admin2.settings;
 if(edit)return `<div class="breadcrumb"><a href="#/rules">积分规则</a> / 通用设置 / 编辑</div>`+a2Heading('编辑通用设置','<a class="btn" href="#/rules/settings">返回</a>')+`<form data-a2-form="settings" class="a2-narrow"><div class="form-error" id="a2-error"></div>`+
 a2Section('01','积分与使用',`<div class="a2-two-cols">${a2Field('name','积分名称',s.name)}${a2Select('validity','积分有效期',['长期有效','领取后按天有效'],s.validity)}${a2Field('validDays','有效天数',s.validDays,'number')}${a2Field('expiryReminder','到期前提醒（天）',s.expiryReminder,'number')}<div class="a2-field-note full">积分用于商城福利兑换。各福利分别设置积分价格和领取限制。</div></div>`)+
 a2Section('02','10万元运营预算',`<div class="a2-two-cols">${a2Field('budgetYuan','平台运营预算（元）',s.budgetYuan,'number')}${a2Field('pointsPerYuan','每1元预算估算对应积分',s.pointsPerYuan,'number','仅用于预算测算，实际采购成本以福利单价为准。')}${a2Field('budgetWarning','预警阈值（%）',s.budgetWarning,'number')}${a2Select('exhaustion','预算用尽时',['停止新奖励，保留已获权益','提醒运营人员处理'],s.exhaustion)}<div class="a2-field-note full">平台奖励与新人礼使用平台预算；线下成交奖励由武汉城投安家乐寓承担，单独记录。</div></div>`)+
 a2Section('03','重复与回收',`<div class="a2-two-cols">${a2Select('repeat','重复计奖',['同一有效行为仅计一次'],s.repeat)}${a2Select('negative','回收时余额不足',['扣至零，剩余登记待追回','允许负积分，后续积分抵扣'],s.negative)}<div class="a2-field-note full">每日生活知识、投票和有效提问共用一次基础奖励。被推荐人首次有效咨询仅计一次，好友与群聊不重复叠加。</div></div>`)+
 `<div class="a2-sticky-footer"><a class="btn" href="#/rules/settings">取消</a><button class="btn primary">保存</button></div></form>`;
 const estimate=db.admin2.grantLogs.filter(x=>x.funder==='平台').reduce((n,x)=>n+x.points/s.pointsPerYuan,0);
 return a2Heading('积分规则','<a class="btn primary" href="#/rules/settings/edit">编辑</a>')+a2RulesTabs('rules/settings')+
 a2Section('01','积分与使用',`<dl class="detail-grid">${a2Pair('积分名称',esc(s.name))}${a2Pair('使用范围','积分商城的福利兑换')}${a2Pair('积分有效期',s.validity==='长期有效'?s.validity:s.validDays+' 天')}${a2Pair('到期提醒',s.validity==='长期有效'?'无需到期提醒':'到期前 '+s.expiryReminder+' 天')}</dl>`)+
 a2Section('02','预算控制',`<dl class="detail-grid">${a2Pair('平台运营预算','¥'+s.budgetYuan.toLocaleString())}${a2Pair('积分成本测算',s.pointsPerYuan+' 积分 / 元（预算估算口径）')}${a2Pair('奖励预计占用','¥'+estimate.toFixed(2)+'（本原型已记录的平台发奖）')}${a2Pair('预警阈值',s.budgetWarning+'%')}${a2Pair('用尽处理',s.exhaustion)}${a2Pair('成交奖承担方','武汉城投安家乐寓，独立于平台预算')}</dl>`)+
 a2Section('03','去重与回收',`<dl class="detail-grid">${a2Pair('每日基础奖','生活知识、投票和有效提问每日合计一次')}${a2Pair('同类规则','同一行为只取较高奖励，不重复叠加')}${a2Pair('推荐关系','同一被推荐人只计一次；好友与群聊共用')}${a2Pair('余额不足',s.negative)}${a2Pair('更新时间',s.updated)}</dl>`);
}
function a2History(){return a2Heading('积分规则')+a2RulesTabs('rules/history')+`<div class="table-wrap"><table><thead><tr><th>时间</th><th>规则</th><th>操作</th><th>变更前</th><th>变更后</th><th>操作人</th></tr></thead><tbody>${db.admin2.history.map(x=>`<tr><td>${x.date}</td><td>${esc(x.name)}</td><td>${x.action}</td><td>${esc(x.before||'—')}</td><td>${esc(x.after||'—')}</td><td>${x.operator}</td></tr>`).join('')}</tbody></table></div><div class="pagination">共 ${db.admin2.history.length} 条</div>`}
function a2Publish(r){
 const next=r.draft||r;
 const scheduled=next.effectiveMode==='指定时间生效';
 if(scheduled&&(!next.effectiveAt||next.effectiveAt<=a2Now()))return toast('指定生效时间应晚于当前时间');
 if(next.end<=a2Now())return toast('结束时间已过，请先编辑');
 const current=next.status==='已启用'?r.reward:0;
 dialog('发布积分规则',`<h3>${esc(next.name)}</h3><dl class="detail-grid mt">${a2Pair('奖励',r.draft?r.reward+' → '+next.reward+' 积分':next.reward+' 积分')}${a2Pair('领取限制',next.limitPeriod+' '+next.limitCount+' 次')}${a2Pair('成本承担',next.funder)}${a2Pair('生效',scheduled?next.effectiveAt:'立即生效')}</dl><p class="small muted mt">发布后按新规则发放，已有奖励记录保留。</p>`,'发布',()=>{
  const before=a2RuleLive(r)?structuredClone(a2RuleLive(r)):null;
  const payload=structuredClone(next);delete payload.draft;delete payload.live;
  Object.assign(r,payload,{status:scheduled?'待生效':'已启用',updated:a2Now()});
  delete r.draft;if(scheduled&&before)r.live=before;else delete r.live;
  a2Audit(r.name,scheduled?'定时发布':'发布',before?before.reward+' 积分':'未启用',r.reward+' 积分'+(scheduled?'，'+r.effectiveAt+' 生效':''));
  a2SyncLegacy();save();closeDialog();ag('rules/'+r.id);adminRender();toast(scheduled?'已设置生效时间':'规则已发布');
 });
}
function a2RuleMutation(action,r){
 if(action==='rule-publish')return a2Publish(r);
 if(action==='rule-copy'){const copy=structuredClone(r);copy.id='pr-'+id();copy.name+='（副本）';copy.status='草稿';copy.start=a2Date()+' 00:00';copy.end='2026-12-31 23:59';delete copy.live;delete copy.draft;db.admin2.rules.unshift(copy);save();return ag('rules/'+copy.id+'/edit')}
 if(action==='rule-draft')return dialog('待发布修改',`<dl class="detail-grid">${a2Pair('规则名称',esc(r.draft.name))}${a2Pair('奖励积分',r.reward+' → '+r.draft.reward)}${a2Pair('领取限制',r.draft.limitPeriod+' '+r.draft.limitCount+' 次')}${a2Pair('有效行为',esc(r.draft.summary))}${a2Pair('生效方式',r.draft.effectiveMode)}</dl>`,'',null);
 if(action==='rule-simulate'){return dialog('试算奖励',`<p>${esc(r.summary)}</p><form id="a2-sim-form">${a2Field('count','有效行为次数',1,'number')}${a2Field('claimed','本周期已经领过（次）',0,'number')}</form><div id="a2-sim-result" class="a2-preview mt">填写次数后试算，不产生实际积分。</div>`,'试算',w=>{const f=w.querySelector('form');if(!f.reportValidity())return;const d=new FormData(f),count=Number(d.get('count')),claimed=Number(d.get('claimed'));const times=r.milestone?(count>=r.milestone&&claimed===0?1:0):Math.max(0,Math.min(count,r.limitCount-claimed));w.querySelector('#a2-sim-result').textContent='本次预计奖励 '+(times*r.reward)+' 积分（'+times+' 次有效计奖）'})}
 const text={ 'rule-stop':['停用规则','停用后不再发放这条规则的新奖励，已发放积分保留。'], 'rule-cancel':['取消定时发布','取消后保留当前已生效版本；没有生效版本的规则回到草稿。'], 'rule-delete':['删除草稿','确认删除这条未发布的规则？'] }[action];if(!text)return;
 dialog(text[0],'<p>'+text[1]+'</p>','确认',()=>{
  const before=r.status;
  if(action==='rule-delete')db.admin2.rules=db.admin2.rules.filter(x=>x.id!==r.id);
  else if(action==='rule-stop')r.status='已停用';
  else {if(r.live){const live=r.live;Object.keys(r).forEach(k=>delete r[k]);Object.assign(r,live)}else r.status='草稿';delete r.live}
  a2Audit(r.name,text[0],before,action==='rule-delete'?'已删除':r.status);a2SyncLegacy();save();closeDialog();ag('rules');adminRender();toast('已保存');
 });
}
const a2SurveyActions=q=>`<a href="#/surveys/${q.id}">详情</a>${q.status==='草稿'?`<a href="#/surveys/${q.id}/edit">编辑</a>${a2Button('发布','survey-publish',q.id)}${a2Button('删除','survey-delete',q.id,'danger')}`:q.status==='收集中'?`<a href="#/surveys/${q.id}/results">结果</a>${a2Button('暂停','survey-pause',q.id)}${a2Button('结束','survey-end',q.id,'danger')}`:q.status==='已暂停'?`<a href="#/surveys/${q.id}/edit">编辑</a><a href="#/surveys/${q.id}/results">结果</a>${a2Button('恢复','survey-resume',q.id)}${a2Button('结束','survey-end',q.id,'danger')}`:`<a href="#/surveys/${q.id}/results">结果</a>${a2Button('复制','survey-copy',q.id)}`}`;
function a2SurveysList(){
 const f=a2Filters.surveys,rows=db.admin2.surveys.filter(q=>(!f.q||q.title.includes(f.q))&&(!f.status||q.status===f.status));
 return a2Heading('需求问卷','<button class="btn" data-a2="survey-export">导出</button><a class="btn primary" href="#/surveys/new">新建问卷</a>')+`<form class="filters" data-a2-form="survey-filter">${a2Field('q','问卷名称',f.q,'text','',false)}${a2Select('status','状态',['','草稿','收集中','已暂停','已结束'],f.status)}<button class="btn primary">查询</button>${a2Button('重置','survey-filter-reset','','btn')}</form><div class="table-wrap"><table><thead><tr><th>问卷名称</th><th>适用人群</th><th>题目</th><th>收集时间</th><th>有效答卷</th><th>状态</th><th>操作</th></tr></thead><tbody>${rows.map(q=>`<tr><td><a class="a2-rule-name" href="#/surveys/${q.id}">${esc(q.title)}</a></td><td>${q.audience}</td><td>${q.fields.length} 题</td><td>${q.start}<small class="a2-row-note">至 ${q.end}</small></td><td>${a2SurveyResponses(q).length} 份</td><td>${a2Status(q.status)}</td><td><div class="a2-actions">${a2SurveyActions(q)}</div></td></tr>`).join('')}</tbody></table></div><div class="pagination">共 ${rows.length} 条</div>`;
}
function a2SurveyResponses(q){
 const rows=db.admin2.surveyResponses?.[q.id]||[];
 const own=db.v3.survey[q.id];
 return own?[...rows,{name:db.user.name,date:db.admin2.surveySubmittedAt?.[q.id]||'2026-10-08 09:30',answers:own}]:rows;
}
function a2SurveyDetail(q){
 return `<div class="breadcrumb"><a href="#/surveys">需求问卷</a> / 详情</div>`+a2Heading('问卷详情','<a class="btn" href="#/surveys">返回</a>')+
 `<div class="detail-heading"><h2>${esc(q.title)}</h2>${a2Status(q.status)}</div><dl class="detail-grid">${a2Pair('适用人群',q.audience)}${a2Pair('收集时间',q.start+' 至 '+q.end)}${a2Pair('问卷介绍',esc(q.intro))}${a2Pair('封面',`<img class="a2-cover-preview" src="${esc(q.image)}" alt="问卷封面">`)}${a2Pair('有效答卷',a2SurveyResponses(q).length+' 份')}${a2Pair('填写次数','每位用户每份问卷一次，可修改已保存的回答')}${a2Pair('积分奖励',a2ActiveRule('pr-survey')?'首次完整提交按问卷奖励规则发放':'本期填写不发积分')}</dl>`+
 a2Section('01','问题与选项',q.fields.map((f,i)=>`<div class="a2-question"><h3>${i+1}. ${esc(f[1])} <small class="muted">单选 · 必填</small></h3><ul>${f[2].map(o=>`<li>${esc(o)}</li>`).join('')}</ul></div>`).join(''))+
 `<div class="detail-footer"><a class="btn" href="#/surveys">返回</a><a class="btn" href="index.html#/survey/${q.id}" target="_blank">预览</a><div class="a2-actions">${a2SurveyActions(q)}</div></div>`;
}
function a2QuestionEditor(f,index,locked){
 return `<div class="a2-question" data-question data-key="${esc(f[0])}"><header><h3>问题 ${index+1} <small class="muted">单选 · 必填</small></h3>${locked?'':`<div class="a2-question-actions">${a2Button('上移','question-up','','a2-mini-btn')}${a2Button('下移','question-down','','a2-mini-btn')}${a2Button('删除','question-remove','','a2-mini-btn')}</div>`}</header>${locked?`<h3>${esc(f[1])}</h3><ul>${f[2].map(o=>`<li>${esc(o)}</li>`).join('')}</ul>`:`<label class="field"><span>问题标题 <em>*</em></span><input name="question-title" required maxlength="80" value="${esc(f[1])}"></label><label class="field"><span>选项 <em>*</em></span><textarea name="question-options" rows="4" required placeholder="每行填写一个选项">${esc(f[2].join('\n'))}</textarea></label>`}</div>`;
}
function a2SurveyForm(q){
 const r=q||{title:'',image:'assets/v3-survey.jpg',audience:'全部用户',intro:'',start:a2Date(),end:'2026-12-31',fields:[['q1','',['','']]]},locked=!!q&&a2SurveyResponses(q).length>0;
 return `<div class="breadcrumb"><a href="#/surveys">需求问卷</a> / ${q?'编辑':'新建'}</div>`+a2Heading(q?'编辑问卷':'新建问卷','<a class="btn" href="#/surveys">返回</a>')+`<form data-a2-form="survey" data-id="${q?.id||''}" class="a2-narrow"><div id="a2-error" class="form-error"></div>`+
 a2Section('01','基本信息',`<div class="a2-two-cols">${a2Field('title','问卷名称',r.title)}${a2Select('audience','适用人群',['全部用户','正在找房的用户','已经入住的用户'],r.audience)}${a2Field('start','开始日期',r.start,'date')}${a2Field('end','结束日期',r.end,'date')}<label class="field full"><span>问卷介绍 <em>*</em></span><textarea name="intro" required rows="3" maxlength="300">${esc(r.intro)}</textarea></label><label class="field full"><span>封面</span><input type="file" accept="image/*" name="cover"><img class="a2-cover-preview mt" id="a2-survey-cover" src="${esc(r.image)}" alt="封面预览"></label></div>`)+
 a2Section('02','问题配置',`${locked?'<p>已有答卷，题目和选项保留原样。需要重新设计题目时，可复制问卷。</p>':''}<div id="a2-questions">${r.fields.map((f,i)=>a2QuestionEditor(f,i,locked)).join('')}</div>${locked?'':a2Button('新增问题','question-add','','btn mt')}`)+
 `<div class="a2-sticky-footer"><a class="btn" href="#/surveys">取消</a><button class="btn primary">保存</button></div></form>`;
}
function a2SurveyResults(q,responses=false){
 const rows=a2SurveyResponses(q),page=Math.max(1,Math.min(a2Filters.answerPage||1,Math.ceil(rows.length/20)||1)),totalPages=Math.max(1,Math.ceil(rows.length/20));
 return `<div class="breadcrumb"><a href="#/surveys">需求问卷</a> / <a href="#/surveys/${q.id}">${esc(q.title)}</a> / 结果</div>`+a2Heading('问卷结果',`<button class="btn" data-a2="survey-result-export" data-id="${q.id}">导出答卷</button><a class="btn" href="#/surveys/${q.id}">返回</a>`)+`<div class="a2-tabs"><a class="${!responses?'active':''}" href="#/surveys/${q.id}/results">选项分布</a><a class="${responses?'active':''}" href="#/surveys/${q.id}/responses">答卷记录</a></div><p class="a2-result-count">${esc(q.title)} · 有效答卷 ${rows.length} 份</p>`+
 (responses?`<div class="table-wrap"><table><thead><tr><th>提交人</th><th>提交时间</th>${q.fields.map(f=>`<th>${esc(f[1])}</th>`).join('')}</tr></thead><tbody>${rows.slice((page-1)*20,page*20).map(row=>`<tr><td>${esc(row.name)}</td><td>${row.date}</td>${q.fields.map(f=>`<td>${esc(row.answers[f[0]]||'—')}</td>`).join('')}</tr>`).join('')}</tbody></table></div><div class="pagination"><span>共 ${rows.length} 条</span><div class="row"><button class="btn" data-a2="answer-page" data-id="${page-1}" ${page===1?'disabled':''}>上一页</button><span>${page} / ${totalPages}</span><button class="btn" data-a2="answer-page" data-id="${page+1}" ${page===totalPages?'disabled':''}>下一页</button></div></div>`:q.fields.map((f,i)=>a2Section(String(i+1).padStart(2,'0'),esc(f[1]),`<ul class="a2-bars">${f[2].map(o=>{const n=rows.filter(row=>row.answers[f[0]]===o).length,pct=rows.length?Math.round(n/rows.length*100):0;return `<li><span>${esc(o)}</span><div class="bar"><i style="width:${pct}%"></i></div><b>${n} 份 · ${pct}%</b></li>`}).join('')}</ul>`)).join(''));
}
function a2SurveyMutation(action,q){
 if(action==='survey-copy'){const copy=structuredClone(q);copy.id='survey-'+id();copy.title+='（副本）';copy.status='草稿';copy.responses=0;copy.start=a2Date();copy.end='2026-12-31';db.admin2.surveys.unshift(copy);save();return ag('surveys/'+copy.id+'/edit')}
 const config={'survey-publish':['发布问卷','发布后用户可从需求调查填写问卷。','收集中'],'survey-pause':['暂停收集','暂停后停止新填写，已有答卷保留。','已暂停'],'survey-resume':['恢复收集','恢复后用户可继续填写。','收集中'],'survey-end':['结束问卷','结束后停止收集，已有答卷和结果保留。','已结束'],'survey-delete':['删除问卷','确认删除这份未发布的问卷？','删除']}[action];
 if(!config)return;if(['survey-publish','survey-resume'].includes(action)&&q.end<a2Date())return toast('结束日期已过，请先编辑');
 dialog(config[0],'<p>'+config[1]+'</p>','确认',()=>{if(config[2]==='删除')db.admin2.surveys=db.admin2.surveys.filter(x=>x.id!==q.id);else q.status=config[2];save();closeDialog();ag('surveys');adminRender();toast('已保存')});
}
function a2GiftTabs(n,tab){return `<div class="a2-tabs">${[['','礼品详情'],['cards','卡库'],['claims','领取记录']].map(([key,name])=>`<a href="#/newcomers/${n.id}${key?'/'+key:''}" class="${tab===key?'active':''}">${name}</a>`).join('')}</div>`}
function a2NewcomerDetail(n,tab=''){
 const head=`<div class="breadcrumb"><a href="#/newcomers">新人见面礼</a> / ${esc(n.title)}</div>`+a2Heading('新人见面礼',`<a class="btn" href="#/newcomers">返回</a>${n.status==='进行中'?`<a class="btn primary" href="#/newcomers/${n.id}/ai-edit">编辑礼品</a>`:''}`)+a2GiftTabs(n,tab);
 if(tab==='cards')return head+a2CardList(n);
 if(tab==='claims')return head+a2GiftClaims(n);
 return head+`<div class="a2-card-head"><img src="assets/doubao-avatar.png" alt="豆包头像"><div><h2>${esc(n.reward)}</h2><p>${esc(n.aiSubtitle||n.description)}</p></div>${a2Status(n.status)}</div><dl class="detail-grid">${a2Pair('活动名称',esc(n.title))}${a2Pair('活动时间',n.start+' 至 '+n.end)}${a2Pair('礼品',esc(n.reward))}${a2Pair('领取条件',esc(n.experience))}${a2Pair('剩余份数',n.stock+' 份')}${a2Pair('领取限制','每位用户一次，免费领取，不扣积分')}${a2Pair('礼品展示',n.aiDisplay||'展示')}${a2Pair('权益说明',esc(n.aiDescription||n.description))}${a2Pair('成本承担','平台新人礼预算')}${a2Pair('领取后查看','个人中心 → 我的券 → 豆包流量卡')}</dl><div class="detail-footer"><a class="btn" href="#/newcomers">返回</a><a class="btn" href="index.html#/newcomer" target="_blank">预览</a>${actionButtons('newcomers',n,true)}</div>`;
}
function a2CardList(n){
 const f=a2Filters.cards,rows=db.admin2.giftCards.filter(x=>(!f.q||[x.code,x.batch,x.recipient].join(' ').includes(f.q))&&(!f.status||x.status===f.status)),page=Math.max(1,Math.min(f.page||1,Math.ceil(rows.length/10)||1)),items=rows.slice((page-1)*10,page*10);
 return `<div class="row between mb"><p class="muted">可发放卡号按领取顺序分配，已发放卡号保留原记录。</p>${a2Button('导入卡号','card-import',n.id,'btn primary')}</div><form class="filters" data-a2-form="card-filter">${a2Field('q','卡号、批次或领取人',f.q,'text','',false)}${a2Select('status','状态',['','可发放','已发放','已使用','已过期','已作废'],f.status)}<button class="btn primary">查询</button>${a2Button('重置','card-filter-reset','','btn')}</form><div class="table-wrap"><table><thead><tr><th>卡号</th><th>导入批次</th><th>有效期</th><th>采购单价</th><th>状态</th><th>领取人</th><th>操作</th></tr></thead><tbody>${items.map(c=>`<tr><td class="a2-code">${esc(c.code)}</td><td>${esc(c.batch)}</td><td>${c.valid}</td><td>${c.cost?'¥'+c.cost:'待填写'}</td><td>${a2Status(c.status)}</td><td>${c.recipient?esc(c.recipient)+'<small class="a2-row-note">'+phoneMask(c.phone)+'</small>':'—'}</td><td><div class="a2-actions">${a2Button('详情','card-detail',c.id)}${c.status==='可发放'?a2Button('作废','card-void',c.id,'danger'):''}</div></td></tr>`).join('')}</tbody></table></div><div class="pagination"><span>共 ${rows.length} 条</span><div class="row"><button class="btn" data-a2="card-page" data-id="${page-1}" ${page===1?'disabled':''}>上一页</button>${page}<span>/ ${Math.max(1,Math.ceil(rows.length/10))}</span><button class="btn" data-a2="card-page" data-id="${page+1}" ${page*10>=rows.length?'disabled':''}>下一页</button></div></div>`;
}
function a2GiftClaims(n){
 const rows=db.exchanges.filter(x=>x.reward==='r-doubao');
 return `<div class="row between mb"><p class="muted">领取记录与“我的券”使用状态同步。</p>${a2Button('导出','gift-claims-export',n.id,'btn')}</div><div class="table-wrap"><table><thead><tr><th>领取人</th><th>手机号</th><th>礼品</th><th>领取时间</th><th>有效期</th><th>状态</th><th>操作</th></tr></thead><tbody>${rows.map(x=>`<tr><td>${esc(x.name)}</td><td>${phoneMask(x.phone)}</td><td>豆包流量卡</td><td>${x.created}</td><td>${x.valid}</td><td>${labelStatus(x.status)}</td><td><a class="a2-table-link" href="#/exchanges/${x.id}">详情</a></td></tr>`).join('')}</tbody></table></div>${rows.length?'':'<div class="admin-empty">还没有领取记录</div>'}<div class="pagination">共 ${rows.length} 条</div>`;
}
function a2CardImport(n){
 dialog('导入豆包流量卡',`<form id="a2-card-import"><div class="a2-two-cols">${a2Field('batch','批次名称','十月新人礼')}${a2Field('valid','有效期至','2026-12-31','date')}${a2Field('cost','采购单价（元）','','number','未确定时可留空。',false)}</div><label class="field mt"><span>卡号 <em>*</em></span><textarea name="codes" required rows="6" placeholder="每行填写一个卡号"></textarea><small class="a2-help">支持字母、数字和短横线；重复或无效卡号会提示，不会直接导入。</small></label><div id="a2-import-error" class="a2-form-error"></div></form>`,'导入',w=>{
  const form=w.querySelector('form');if(!form.reportValidity())return;
  const d=new FormData(form),codes=String(d.get('codes')).split(/\r?\n/).map(x=>x.trim()).filter(Boolean),errors=[];
  if(!codes.length)errors.push('请至少填写一个卡号');if(String(d.get('valid'))<a2Date())errors.push('有效期不能早于今天');
  const seen=new Set(db.admin2.giftCards.map(c=>c.code));for(const [i,code] of codes.entries()){if(!/^[a-zA-Z0-9-]{6,40}$/.test(code))errors.push('第'+(i+1)+'行格式不正确');if(seen.has(code))errors.push('第'+(i+1)+'行卡号重复');seen.add(code)}
  if(errors.length){w.querySelector('#a2-import-error').textContent=errors.slice(0,4).join('；');return}
  db.admin2.giftCards.unshift(...codes.map(code=>({id:'dc-'+id(),code,batch:String(d.get('batch')),status:'可发放',valid:String(d.get('valid')),cost:d.get('cost')?Number(d.get('cost')):0,recipient:'',phone:'',issued:''})));
  n.stock+=codes.length;save();closeDialog();ag('newcomers/'+n.id+'/cards');adminRender();toast('已导入 '+codes.length+' 张');
 });
 document.querySelector('#a2-card-import [name=cost]').step='0.01';
}
function a2CardDetail(c){dialog('流量卡详情',`<dl class="detail-grid">${a2Pair('卡号',esc(c.code))}${a2Pair('批次',esc(c.batch))}${a2Pair('状态',a2Status(c.status))}${a2Pair('有效期至',c.valid)}${a2Pair('采购单价',c.cost?'¥'+c.cost:'待填写')}${a2Pair('领取人',esc(c.recipient||'—'))}${a2Pair('联系电话',c.phone?phoneMask(c.phone):'—')}${a2Pair('发放时间',c.issued||'—')}${c.used?a2Pair('使用时间',c.used):''}${c.reason?a2Pair('作废原因',esc(c.reason)):''}</dl>`,'',null)}
function a2ReferralActions(r){
 return `<a href="#/referrals/${r.id}">详情</a>${r.status==='待核实'?`<button data-ref-action="valid" data-id="${r.id}">确认有效</button><button class="danger" data-ref-action="invalid" data-id="${r.id}">标为无效</button>`:r.status==='有效咨询'?`<a href="#/referrals/${r.id}/deal">录入成交</a>`:''}`;
}
function a2ReferralList(){
 const f=v3AdminFilter,rows=db.v3.referrals.filter(r=>(!f.status||r.status===f.status)&&(!f.q||[r.friend,r.phone,r.project,r.source,r.referrer].join(' ').includes(f.q)));
 return a2Heading('好友推荐','<button class="btn" data-a2="referrals-export">导出</button><a class="btn" href="#/rules/pr-lead">奖励规则</a>')+
 `<form class="filters" data-a2-form="ref-filter">${a2Field('q','姓名、手机号或项目',f.q||'','text','',false)}${a2Select('status','状态',['','已访问','待核实','有效咨询','已成交','无效'],f.status||'')}<button class="btn primary">查询</button>${a2Button('重置','ref-filter-reset','','btn')}</form><div class="table-wrap"><table><thead><tr><th>推荐人</th><th>被推荐人</th><th>咨询项目</th><th>来源</th><th>奖励</th><th>状态</th><th>操作</th></tr></thead><tbody>${rows.map(r=>`<tr><td>${esc(r.referrer||'小林')}</td><td><b>${esc(r.friend)}</b><small class="a2-row-note">${esc(v3AdminReadablePhone(r))}</small></td><td>${esc(r.project)}</td><td>${r.source.startsWith('群聊')?'群聊':'好友'}<small class="a2-row-note">${esc(r.source.replace('群聊·',''))}</small></td><td>${r.dealPaid?'+ '+(r.dealReward??db.v3.rewardRules.deal)+' 成交奖':r.leadPaid?'+ '+(r.leadReward??db.v3.rewardRules.validLead)+' 咨询奖':'尚未发奖'}</td><td>${labelStatus(r.status)}</td><td><div class="table-actions">${a2ReferralActions(r)}</div></td></tr>`).join('')}</tbody></table></div><div class="pagination">共 ${rows.length} 条</div>`;
}
function a2ReferralDetail(r){
 const events=[{date:r.created,title:'好友通过分享进入',copy:r.source+' · '+r.project}];
 if(r.status!=='已访问')events.push({date:r.consulted||r.created,title:'提交找房咨询',copy:r.question||'希望了解可租房型、价格与入住时间'});
 if(r.leadPaid)events.push({date:r.verified||r.created,title:'确认有效咨询',copy:'已向推荐人发放 '+(r.leadReward??db.v3.rewardRules.validLead)+' 积分'});
 if(r.dealPaid)events.push({date:r.dealDate||r.created,title:'运营商录入线下成交',copy:'成交奖 '+(r.dealReward??db.v3.rewardRules.deal)+' 积分，由武汉城投安家乐寓承担'});
 if(r.status==='无效')events.push({date:r.verified||r.created,title:'推荐无效',copy:r.reason});
 return `<div class="breadcrumb"><a href="#/referrals">好友推荐</a> / 详情</div>`+a2Heading('推荐详情','<a class="btn" href="#/referrals">返回</a>')+
 `<div class="detail-heading"><h2>${esc(r.friend)}</h2>${labelStatus(r.status)}</div><dl class="detail-grid">${a2Pair('推荐人',esc(r.referrer||'小林'))}${a2Pair('被推荐人',esc(r.friend))}${a2Pair('联系电话',esc(v3AdminReadablePhone(r)))}${a2Pair('分享来源',esc(r.source))}${a2Pair('咨询项目',esc(r.project))}${a2Pair('咨询内容',esc(r.question||'咨询可租房型、实际费用与入住安排'))}${a2Pair('咨询奖励',r.leadPaid?'已发放 '+(r.leadReward??db.v3.rewardRules.validLead)+' 积分':'未发放')}${a2Pair('成交奖励',r.dealPaid?'已发放 '+(r.dealReward??db.v3.rewardRules.deal)+' 积分':'未发放')}${a2Pair('成交奖承担方','武汉城投安家乐寓')}${r.dealDate?a2Pair('线下签约日期',r.dealDate):''}${r.confirmedBy?a2Pair('成交确认人',esc(r.confirmedBy)):''}${r.dealNote?a2Pair('成交备注',esc(r.dealNote)):''}${r.reason?a2Pair('无效原因',esc(r.reason)):''}</dl>`+
 a2Section('01','处理记录',`<ul class="a2-records">${events.map(e=>`<li><time>${esc(e.date)}</time><div><b>${e.title}</b><p>${esc(e.copy)}</p></div></li>`).join('')}</ul>`)+
 `<div class="detail-footer"><a class="btn" href="#/referrals">返回</a><div class="table-actions">${a2ReferralActions(r)}</div></div>`;
}
function a2DealForm(r){
 if(r.status!=='有效咨询')return a2ReferralDetail(r);
 const projects=[r.project,...v3Houses.map(x=>x.name)].filter((x,i,a)=>a.indexOf(x)===i);
 return `<div class="breadcrumb"><a href="#/referrals">好友推荐</a> / <a href="#/referrals/${r.id}">推荐详情</a> / 录入成交</div>`+a2Heading('录入线下成交',`<a class="btn" href="#/referrals/${r.id}">返回</a>`)+`<div class="detail-heading"><h2>${esc(r.friend)}</h2>${labelStatus(r.status)}</div><form id="v3-deal-form" data-a2-form="deal" data-id="${r.id}" class="a2-narrow"><div id="a2-error" class="form-error"></div><div class="a2-two-cols">${a2Select('project','签约项目',projects,r.project)}${a2Field('date','签约日期',a2Date(),'date')}${a2Field('confirmedBy','成交确认人','张悦')}<div class="field"><span>奖励与成本</span><p class="a2-field-note">成交奖励 ${db.v3.rewardRules.deal} 积分，由武汉城投安家乐寓承担。</p></div><label class="field full"><span>成交备注</span><textarea name="note" rows="3" maxlength="300" placeholder="补充需要保留的签约结果信息"></textarea></label><div class="a2-field-note full">确认线下签约成交后录入。提交后记录成交结果并向推荐人发奖。</div></div><div class="a2-sticky-footer"><a class="btn" href="#/referrals/${r.id}">取消</a><button type="submit" class="btn primary">提交</button></div></form>`;
}
function a2VerifyReferral(r,action){
 if(r.status!=='待核实')return toast('该记录已处理');
 const rule=a2MatchingRule('首次有效咨询',{project:r.project,channel:r.source.startsWith('群聊')?'群聊':'好友'});
 if(action==='valid')dialog('确认有效咨询',`<p>已核对 ${esc(r.friend)} 是首次有效找房咨询？${rule?'确认后向推荐人发放 '+rule.reward+' 积分。':'当前没有适用奖励，确认仅更新咨询状态。'}</p><ul class="a2-dialog-list"><li>联系电话有效，有真实找房需求。</li><li>同一被推荐人仅计一次，好友与群聊不重复计奖。</li></ul>`,'确认',()=>{
  if(r.status!=='待核实'||r.leadPaid)return;
  if(r.rawPhone&&r.rawPhone===db.user.phone)return toast('推荐人与咨询人不能使用同一手机号');
  if(r.rawPhone&&db.v3.referrals.some(x=>x.id!==r.id&&x.rawPhone===r.rawPhone&&x.leadPaid))return toast('该手机号已计过有效咨询奖励');
  r.status='有效咨询';r.verified=a2Now();r.leadPaid=!!rule;
  if(rule){r.leadReward=rule.reward;points(r.leadReward,'好友有效咨询',r.project,r.referrer||db.user.name);db.admin2.grantLogs.unshift({id:id(),rule:rule.id,name:r.referrer||db.user.name,points:r.leadReward,source:r.friend+' · '+r.source,date:a2Now(),funder:'平台',referralId:r.id})}
  save();closeDialog();adminRender();toast(rule?'已确认有效，奖励已发放':'已确认有效');
 });
 else dialog('标为无效',`<form id="a2-invalid-form">${a2Select('reason','无效原因',['重复咨询','手机号与推荐人相同','无法联系','非真实找房需求'],'重复咨询')}<label class="field mt"><span>补充说明</span><textarea name="note" rows="3" maxlength="200"></textarea></label></form>`,'确认',w=>{r.status='无效';r.reason=w.querySelector('[name=reason]').value+(w.querySelector('[name=note]').value?'：'+w.querySelector('[name=note]').value:'');r.verified=a2Now();save();closeDialog();adminRender();toast('已标为无效')});
}
function a2Download(name,headers,rows){
 const quote=x=>{let value=String(x??'');if(typeof x==='string'&&/^[\t\r ]*[=+@-]/.test(value))value="'"+value;return '"'+value.replaceAll('"','""')+'"'};
 const csv='\ufeff'+[headers,...rows].map(row=>row.map(quote).join(',')).join('\n'),url=URL.createObjectURL(new Blob([csv],{type:'text/csv;charset=utf-8'})),a=document.createElement('a');a.href=url;a.download=name+'.csv';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);toast('已导出');
}
const a2OldRender=adminRender;
adminRender=function(){
 closeDialog();a2RefreshSharedState();const [type='events',key,mode]=location.hash.replace(/^#\/?/,'').split('/');
 if(type==='rules'){let body;if(key==='settings'||key==='edit')body=a2Settings(mode==='edit'||key==='edit');else if(key==='history')body=a2History();else if(!key)body=a2RulesList();else if(key==='new')body=a2RuleForm(null);else {const r=db.admin2.rules.find(x=>x.id===key);body=mode==='edit'&&r&&['草稿','已启用','已停用'].includes(r.status)?a2RuleForm(r):a2RuleDetail(r)}shell('rules',body);a2Bind();window.scrollTo(0,0);return}
 if(type==='surveys'){let body;if(!key)body=a2SurveysList();else if(key==='new')body=a2SurveyForm(null);else{const q=db.admin2.surveys.find(x=>x.id===key);body=!q?'<div class="admin-empty">问卷不存在</div>':mode==='edit'&&['草稿','已暂停'].includes(q.status)?a2SurveyForm(q):['results','responses'].includes(mode)?a2SurveyResults(q,mode==='responses'):a2SurveyDetail(q)}shell('surveys',body);a2Bind();window.scrollTo(0,0);return}
 if(type==='referrals'){const r=db.v3.referrals.find(x=>x.id===key);shell('referrals',!key?a2ReferralList():r?(mode==='deal'?a2DealForm(r):a2ReferralDetail(r)):'<div class="admin-empty">推荐不存在</div>');a2Bind();window.scrollTo(0,0);return}
 if(type==='newcomers'&&key&&mode!=='edit'&&mode!=='ai-edit'&&key!=='new'){const n=by('newcomers',key);if(n&&n.reward==='豆包流量卡'){shell(type,a2NewcomerDetail(n,mode||''));a2Bind();window.scrollTo(0,0);return}}
 a2OldRender();a2Bind();
};
// Existing handlers call this entry after status changes.
v3AdminRender=function(key,mode){adminRender()};
function a2RefreshSharedState(){
 let changed=a2AdvanceRules();
 for(const c of db.admin2.giftCards){const x=db.exchanges.find(x=>x.code===c.code&&x.reward==='r-doubao');if(x){const status=x.status==='已使用'?'已使用':x.status==='已过期'?'已过期':x.status==='已退回'?'已作废':'已发放';if(c.status!==status||c.recipient!==x.name){c.status=status;c.recipient=x.name;c.phone=x.phone;c.issued=x.created;c.used=x.used;c.reason=x.reason||c.reason;changed=true}}else if(c.status==='可发放'&&c.valid<a2Date()){c.status='已过期';changed=true;const n=db.newcomers.find(n=>n.status==='进行中'&&n.reward==='豆包流量卡');if(n)n.stock=Math.max(0,n.stock-1)}}
 if(changed){a2SyncLegacy();save()}
}
function a2Bind(){
 const ruleForm=document.querySelector('[data-a2-form=rule]');
 if(ruleForm){const presets={'每日有效参与':['每日','满足条件后发放'],'活动到场':['每场活动','满足条件后发放'],'内容采纳':['每篇内容','内容通过审核后发放'],'累计参与':['每人','满足条件后发放'],'首次有效咨询':['每位被推荐人','运营方确认有效后发放'],'线下签约成交':['每位被推荐人','运营商录入成交后发放'],'问卷完成':['每份问卷','满足条件后发放']};let previous=ruleForm.scene.value;const update=()=>{const scene=ruleForm.scene.value,[period,grant]=presets[scene];ruleForm.querySelector('#a2-channel-field').hidden=!['首次有效咨询','线下签约成交'].includes(scene);ruleForm.querySelector('[name=milestone]').closest('.field').hidden=scene!=='累计参与';ruleForm.querySelector('[name=effectiveAt]').closest('.field').hidden=ruleForm.effectiveMode.value!=='指定时间生效';document.querySelector('#a2-funder-value').textContent=scene==='线下签约成交'?'武汉城投安家乐寓':'平台';ruleForm.limitPeriod.innerHTML=a2Opt([period],period);ruleForm.grant.innerHTML=a2Opt([grant],grant);if(previous!==scene){ruleForm.limitCount.value='1';if(scene==='累计参与')ruleForm.totalLimit.value='1';previous=scene}};ruleForm.addEventListener('change',update);update()}
 const settings=document.querySelector('[data-a2-form=settings]');if(settings){const update=()=>{settings.querySelector('[name=validDays]').closest('.field').hidden=settings.validity.value==='长期有效';settings.querySelector('[name=expiryReminder]').closest('.field').hidden=settings.validity.value==='长期有效'};settings.validity.onchange=update;update()}
 const cover=document.querySelector('[data-a2-form=survey] [name=cover]');if(cover)cover.onchange=()=>{const file=cover.files[0];if(!file)return;if(file.size>3*1024*1024){cover.value='';return toast('请选择3MB以内的图片')}const reader=new FileReader();reader.onload=()=>document.querySelector('#a2-survey-cover').src=reader.result;reader.readAsDataURL(file)};
}
const a2OldGetActions=getActions,a2OldAction=action,a2OldDetailPairs=detailPairs,a2OldDefaults=newDefaults;
getActions=function(type,obj){if(type==='exchanges'&&obj.reward==='r-doubao')return obj.status==='待使用'?['标记已使用','退回']:[];return a2OldGetActions(type,obj)};
detailPairs=function(type,obj){if(type==='exchanges'&&obj.reward==='r-doubao')return a2Pair('礼品','豆包流量卡')+a2Pair('领取人',esc(obj.name))+a2Pair('手机号',phoneMask(obj.phone))+a2Pair('消耗积分','0 积分 · 新人免费领取')+a2Pair('卡号',esc(obj.code))+a2Pair('领取时间',obj.created)+a2Pair('有效期至',obj.valid)+(obj.used?a2Pair('使用时间',obj.used):'')+(obj.reason?a2Pair('处理说明',esc(obj.reason)):'');return a2OldDetailPairs(type,obj)};
action=function(type,key,a){
 if(type==='exchanges'&&a==='标记已使用'){
  const x=by(type,key);if(x.status!=='待使用')return toast('该卡已处理');
  return dialog('标记已使用','<p>请确认用户已完成权益兑换。此操作仅更新使用记录。</p>','确认',()=>{if(x.status!=='待使用')return;x.status='已使用';x.used=a2Now();save();adminRender();toast('已标记使用')});
 }
 return a2OldAction(type,key,a);
};
newDefaults=function(type){const r=a2OldDefaults(type);if(type==='events'){r.date=a2Date();r.deadline=a2Date()}else if(type==='tasks'||type==='newcomers'){r.start=a2Date();r.end='2026-12-31'}return r};
function a2CollectQuestions(form){return [...form.querySelectorAll('[data-question]')].map(el=>[el.dataset.key,el.querySelector('[name=question-title]')?.value.trim()||'',el.querySelector('[name=question-options]')?.value.split(/\r?\n/).map(x=>x.trim()).filter(Boolean)||[]])}
function a2FormError(message){const error=document.querySelector('#a2-error');if(error){error.textContent=message;error.scrollIntoView({block:'center'})}else toast(message)}
document.querySelector('#admin').addEventListener('submit',e=>{
 const form=e.target.closest('[data-a2-form]');if(!form)return;e.preventDefault();const kind=form.dataset.a2Form,d=new FormData(form),v=Object.fromEntries(d);
 if(v.q!==undefined)v.q=v.q.trim();
 if(kind==='rule-filter'){a2Filters.rules=v;return adminRender()}if(kind==='survey-filter'){a2Filters.surveys=v;return adminRender()}if(kind==='card-filter'){a2Filters.cards={...v,page:1};return adminRender()}if(kind==='ref-filter'){v3AdminFilter=v;return adminRender()}
 if(kind==='rule'){
  const scene=v.scene,isRef=['首次有效咨询','线下签约成交'].includes(scene);
  if(!v.name.trim()||!v.summary.trim())return a2FormError('请填写规则名称和有效行为说明');
  if(Number(v.reward)<1||Number(v.limitCount)<1||![v.reward,v.limitCount,v.totalLimit].every(x=>Number.isInteger(Number(x))))return a2FormError('奖励积分和每周期次数必须为正整数');
  if(v.end<=v.start)return a2FormError('结束时间应晚于开始时间');
  if(scene==='累计参与'&&Number(v.milestone)<1)return a2FormError('累计参与门槛应大于0');
  if(isRef&&!d.getAll('channels').length)return a2FormError('请至少选择一个分享渠道');
  const r=db.admin2.rules.find(x=>x.id===form.dataset.id);
  const value={...structuredClone(r||a2RuleSeed('pr-'+id(),v.name,scene,'日常活跃',Number(v.reward))),...v,channels:d.getAll('channels'),projects:[v.project],start:v.start.replace('T',' '),end:v.end.replace('T',' '),reward:Number(v.reward),limitCount:Number(v.limitCount),totalLimit:Number(v.totalLimit),milestone:scene==='累计参与'?Number(v.milestone):0,effectiveAt:v.effectiveAt.replace('T',' '),funder:scene==='线下签约成交'?'武汉城投安家乐寓':'平台',category:isRef?'新人拉新':scene==='内容采纳'?'内容共创':scene==='活动到场'?'活动参与':'日常活跃',updated:a2Now()};
  delete value.draft;delete value.project;delete value.live;
  if(r&&r.status==='已启用')r.draft=value;
  else if(r)Object.assign(r,value);else {value.status='草稿';db.admin2.rules.unshift(value)}
  save();ag('rules/'+(r?.id||value.id));adminRender();return toast('已保存，请检查后发布');
 }
 if(kind==='settings'){
  if(Number(v.budgetYuan)<1||Number(v.pointsPerYuan)<1)return a2FormError('预算与成本测算口径应大于0');
  if(Number(v.budgetWarning)<1||Number(v.budgetWarning)>100)return a2FormError('预警阈值应为1至100');
  if(v.validity!=='长期有效'&&(Number(v.validDays)<1||Number(v.expiryReminder)>=Number(v.validDays)))return a2FormError('有效天数应大于0，到期提醒应早于到期日');
  const s=db.admin2.settings,before='平台预算 ¥'+s.budgetYuan+'；'+s.validity;
  Object.assign(s,v,...['budgetYuan','pointsPerYuan','budgetWarning','validDays','expiryReminder'].map(k=>({[k]:Number(v[k])})),{updated:a2Now()});
  a2Audit('积分通用设置','保存',before,'平台预算 ¥'+s.budgetYuan+'；'+s.validity);a2SyncLegacy();save();ag('rules/settings');adminRender();return toast('通用设置已保存');
 }
 if(kind==='survey'){
  const q=db.admin2.surveys.find(x=>x.id===form.dataset.id),locked=q&&a2SurveyResponses(q).length>0;
  const fields=locked?q.fields:a2CollectQuestions(form);
  if(!fields.length||fields.some(f=>!f[1]||f[2].length<2||new Set(f[2]).size!==f[2].length))return a2FormError('每题填写标题，至少设置两个不重复选项');
  if(v.end<v.start)return a2FormError('结束日期不能早于开始日期');
  const value={id:q?.id||'survey-'+id(),title:v.title.trim(),audience:v.audience,start:v.start,end:v.end,intro:v.intro.trim(),image:document.querySelector('#a2-survey-cover').getAttribute('src'),fields,status:q?.status||'草稿',responses:q?.responses||0};
  if(q)Object.assign(q,value);else db.admin2.surveys.unshift(value);
  save();ag('surveys/'+value.id);adminRender();return toast('问卷已保存');
 }
 if(kind==='deal'){
  const r=db.v3.referrals.find(x=>x.id===form.dataset.id);
  if(!r||r.status!=='有效咨询'||r.dealPaid)return a2FormError('该记录已处理，请勿重复提交');
  if(v.date>a2Date()||v.date<r.created.slice(0,10))return a2FormError('签约日期不能晚于今天，也不能早于咨询日期');
  if(!v.confirmedBy.trim())return a2FormError('请填写成交确认人');
  const rule=a2MatchingRule('线下签约成交',{project:v.project,channel:r.source.startsWith('群聊')?'群聊':'好友'});
  r.project=v.project;r.dealDate=v.date;r.dealNote=v.note.trim();r.confirmedBy=v.confirmedBy.trim();r.status='已成交';r.dealPaid=!!rule;
  if(rule){r.dealReward=rule.reward;points(r.dealReward,'好友签约成交',r.project,r.referrer||db.user.name);db.admin2.grantLogs.unshift({id:id(),rule:rule.id,name:r.referrer||db.user.name,points:r.dealReward,source:r.friend+' · 线下签约',date:a2Now(),funder:'武汉城投安家乐寓',referralId:r.id})}
  save();ag('referrals/'+r.id);adminRender();return toast(rule?'成交已录入，奖励已发放':'成交已录入');
 }
});
document.querySelector('#admin').addEventListener('click',e=>{
 const ref=e.target.closest('[data-ref-action]');if(ref&&location.hash.startsWith('#/referrals')){e.preventDefault();e.stopImmediatePropagation();return a2VerifyReferral(db.v3.referrals.find(r=>r.id===ref.dataset.id),ref.dataset.refAction)}
 const b=e.target.closest('[data-a2]');if(!b)return;e.preventDefault();const action=b.dataset.a2,key=b.dataset.id;
 if(action.startsWith('rule-')&&!action.includes('filter'))return a2RuleMutation(action,db.admin2.rules.find(r=>r.id===key));
 if(action==='rule-filter-reset'){a2Filters.rules={q:'',status:'',category:''};return adminRender()}
 if(action==='survey-filter-reset'){a2Filters.surveys={q:'',status:''};return adminRender()}
 if(action==='card-filter-reset'){a2Filters.cards={q:'',status:'',page:1};return adminRender()}
 if(action==='ref-filter-reset'){v3AdminFilter={q:'',status:''};return adminRender()}
 if(['survey-publish','survey-pause','survey-resume','survey-end','survey-copy','survey-delete'].includes(action))return a2SurveyMutation(action,db.admin2.surveys.find(q=>q.id===key));
 if(action.startsWith('question-')){
  const form=b.closest('form'),container=form.querySelector('#a2-questions'),el=b.closest('[data-question]');
  if(action==='question-add')container.insertAdjacentHTML('beforeend',a2QuestionEditor(['q-'+id(),'',[]],container.children.length,false));
  if(action==='question-remove'){if(container.children.length<=1)return toast('至少保留一道题');el.remove()}
  if(action==='question-up'&&el.previousElementSibling)container.insertBefore(el,el.previousElementSibling);
  if(action==='question-down'&&el.nextElementSibling)container.insertBefore(el.nextElementSibling,el);
  [...container.children].forEach((q,i)=>q.querySelector('header h3').innerHTML='问题 '+(i+1)+' <small class="muted">单选 · 必填</small>');return;
 }
 if(action==='card-import')return a2CardImport(by('newcomers',key));
 if(action==='card-detail')return a2CardDetail(db.admin2.giftCards.find(x=>x.id===key));
 if(action==='card-void'){const c=db.admin2.giftCards.find(x=>x.id===key);return dialog('作废卡号',`<p>${esc(c.code)} 作废后不再发放。</p><label class="field mt"><span>原因 <em>*</em></span><textarea name="reason" rows="3" required></textarea></label>`,'确认',w=>{const reason=w.querySelector('[name=reason]').value.trim();if(!reason)return toast('请填写原因');if(c.status!=='可发放')return toast('仅未发放卡号可以作废');c.status='已作废';c.reason=reason;const n=by('newcomers',location.hash.split('/')[2]);if(n)n.stock=Math.max(0,n.stock-1);save();closeDialog();adminRender();toast('卡号已作废')})}
 if(action==='card-page'){a2Filters.cards.page=Number(key);return adminRender()}
 if(action==='answer-page'){a2Filters.answerPage=Number(key);return adminRender()}
 if(action==='rules-export')return a2Download('积分奖励规则',['规则','场景','奖励积分','领取周期','最多次数','成本承担','状态'],db.admin2.rules.map(r=>[r.name,r.scene,r.reward,r.limitPeriod,r.limitCount,r.funder,r.status]));
 if(action==='survey-export')return a2Download('需求问卷',['问卷','状态','题目数','开始日期','结束日期','有效答卷'],db.admin2.surveys.map(q=>[q.title,q.status,q.fields.length,q.start,q.end,a2SurveyResponses(q).length]));
 if(action==='survey-result-export'){const q=db.admin2.surveys.find(q=>q.id===key);return a2Download(q.title,['提交人','时间',...q.fields.map(f=>f[1])],a2SurveyResponses(q).map(row=>[row.name,row.date,...q.fields.map(f=>row.answers[f[0]])]))}
 if(action==='referrals-export')return a2Download('好友推荐',['推荐人','被推荐人','项目','来源','状态','咨询奖励','成交奖励'],db.v3.referrals.map(r=>[r.referrer||'小林',r.friend,r.project,r.source,r.status,r.leadPaid?r.leadReward??db.v3.rewardRules.validLead:0,r.dealPaid?r.dealReward??db.v3.rewardRules.deal:0]));
 if(action==='gift-claims-export')return a2Download('新人礼领取记录',['领取人','手机号','礼品','领取时间','状态'],db.exchanges.filter(x=>x.reward==='r-doubao').map(x=>[x.name,phoneMask(x.phone),'豆包流量卡',x.created,x.status]));
},true);
window.addEventListener('hashchange',()=>adminRender());
window.addEventListener('storage',()=>adminRender());
adminRender();
