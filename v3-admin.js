/* 好友推荐后台：线索核实与运营商线下成交录入，均仅修改本机原型数据。 */
let v3AdminFilter={q:'',status:''};
function v3AddAdminMenu(){
 const nav=document.querySelector('.sidebar nav');
 if(!nav||nav.querySelector('a[href="#/referrals"]'))return;
 const group=document.createElement('div');group.className='menu-group';group.textContent='增长运营';
 const link=document.createElement('a');link.href='#/referrals';link.className=location.hash.startsWith('#/referrals')?'active':'';
 link.innerHTML='<span>↗</span>好友推荐';
 nav.insertBefore(group,nav.firstChild);nav.insertBefore(link,group.nextSibling);
 const brand=document.querySelector('.admin-top .brand>div');if(brand)brand.firstChild.textContent='湖北青年有家';
 document.title=document.title.replace('湖北青年安居','湖北青年有家');
}
const v3AdminObserver=new MutationObserver(v3AddAdminMenu);
v3AdminObserver.observe(document.querySelector('#admin'),{childList:true,subtree:true});
function v3AdminReadablePhone(r){return r.phone||phoneMask(r.rawPhone)||'—'}
function v3AdminActions(r){
 if(r.status==='待核实')return '<button class="btn primary" data-ref-action="valid" data-id="'+esc(r.id)+'">确认有效</button><button class="btn" data-ref-action="invalid" data-id="'+esc(r.id)+'">标为无效</button>';
 if(r.status==='有效咨询')return '<a class="btn primary" href="#/referrals/'+esc(r.id)+'/deal">录入成交</a>';
 return '';
}
function v3AdminList(){
 const rows=db.v3.referrals.filter(function(r){return (!v3AdminFilter.status||r.status===v3AdminFilter.status)&&(!v3AdminFilter.q||[r.friend,r.phone,r.project,r.source].join(' ').includes(v3AdminFilter.q))});
 return '<div class="page-heading"><h1>好友推荐</h1><a class="btn" href="v3-spec.html#referral" target="_blank">查看规则</a></div><section class="admin-panel"><form class="filters" id="v3-ref-filter"><label class="field"><span>关键词</span><input name="q" value="'+esc(v3AdminFilter.q)+'" placeholder="姓名、手机号或项目"></label><label class="field"><span>状态</span><select name="status">'+['','已访问','待核实','有效咨询','已成交','无效'].map(function(s){return '<option value="'+s+'" '+(v3AdminFilter.status===s?'selected':'')+'>'+(s||'全部状态')+'</option>'}).join('')+'</select></label><button class="btn primary" type="submit">查询</button><button class="btn" type="button" id="v3-ref-reset">重置</button></form><div class="table-wrap"><table><thead><tr><th>被推荐人</th><th>推荐内容</th><th>咨询项目</th><th>产生时间</th><th>状态</th><th>操作</th></tr></thead><tbody>'+rows.map(function(r){return '<tr><td><b>'+esc(r.friend)+'</b><br><small class="muted">'+esc(v3AdminReadablePhone(r))+'</small></td><td>'+esc(r.source)+'</td><td>'+esc(r.project)+'</td><td>'+esc(r.created)+'</td><td>'+labelStatus(r.status)+'</td><td><div class="table-actions"><a href="#/referrals/'+esc(r.id)+'">详情</a>'+v3AdminActions(r)+'</div></td></tr>'}).join('')+'</tbody></table></div>'+(rows.length?'':'<div class="admin-empty">没有找到相关推荐记录</div>')+'<div class="pagination">共 '+rows.length+' 条</div></section>';
}
function v3AdminDetail(r){
 return '<div class="breadcrumb"><a href="#/referrals">好友推荐</a> / 详情</div><div class="page-heading"><h1>推荐详情</h1><a class="btn" href="#/referrals">返回</a></div><section class="detail-panel"><div class="detail-heading"><h2>'+esc(r.friend)+'</h2>'+labelStatus(r.status)+'</div><dl class="detail-grid"><dt>联系电话</dt><dd>'+esc(v3AdminReadablePhone(r))+'</dd><dt>推荐内容</dt><dd>'+esc(r.source)+'</dd><dt>咨询项目</dt><dd>'+esc(r.project)+'</dd><dt>产生时间</dt><dd>'+esc(r.created)+'</dd><dt>基础奖励</dt><dd>'+(r.leadPaid?'已发放 '+db.v3.rewardRules.validLead+' 积分':'未发放')+'</dd><dt>成交奖励</dt><dd>'+(r.dealPaid?'已发放 '+db.v3.rewardRules.deal+' 积分':'未发放')+'</dd>'+(r.dealDate?'<dt>签约日期</dt><dd>'+esc(r.dealDate)+'</dd>':'')+(r.reason?'<dt>处理说明</dt><dd>'+esc(r.reason)+'</dd>':'')+'</dl><div class="detail-footer"><a class="btn" href="#/referrals">返回</a>'+v3AdminActions(r)+'</div></section>';
}
function v3AdminDeal(r){
 if(r.status!=='有效咨询')return v3AdminDetail(r);
 return '<div class="breadcrumb"><a href="#/referrals">好友推荐</a> / <a href="#/referrals/'+esc(r.id)+'">推荐详情</a> / 录入成交</div><div class="page-heading"><h1>录入线下成交</h1><a class="btn" href="#/referrals/'+esc(r.id)+'">返回</a></div><section class="detail-panel form-panel"><div class="detail-heading"><h2>'+esc(r.friend)+'</h2><span class="pill green">有效咨询</span></div><form id="v3-deal-form" data-id="'+esc(r.id)+'"><div class="form-grid"><label class="field"><span>签约项目 <em>*</em></span><select name="project" required>'+[{name:r.project},...v3Houses.filter(function(x){return x.name!==r.project})].map(function(x){return '<option '+(r.project===x.name?'selected':'')+'>'+esc(x.name)+'</option>'}).join('')+'</select></label><label class="field"><span>线下签约日期 <em>*</em></span><input type="date" name="date" max="'+new Date().toISOString().slice(0,10)+'" value="'+new Date().toISOString().slice(0,10)+'" required></label><label class="field full"><span>成交备注</span><textarea name="note" rows="3" maxlength="300" placeholder="如有特殊情况，可补充简短说明"></textarea></label></div><p class="action-note">由武汉城投安家乐寓在线下确认签约后录入。提交后向推荐人发放 '+db.v3.rewardRules.deal+' 积分；成交奖励成本由运营商承担。</p><div class="detail-footer"><a class="btn" href="#/referrals/'+esc(r.id)+'">取消</a><button class="btn primary" type="submit">确认成交</button></div></form></section>';
}
function v3AdminRender(key,mode){
 modules.referrals={title:'好友推荐'};
 let body;
 if(!key)body=v3AdminList();
 else{const r=db.v3.referrals.find(function(x){return x.id===key});body=r?(mode==='deal'?v3AdminDeal(r):v3AdminDetail(r)):'<div class="admin-empty">记录不存在　<a href="#/referrals">返回</a></div>'}
 shell('referrals',body);v3AddAdminMenu();v3BindAdmin();window.scrollTo(0,0);
}
function v3BindAdmin(){
 const filter=document.querySelector('#v3-ref-filter');
 if(filter)filter.onsubmit=function(e){e.preventDefault();v3AdminFilter=Object.fromEntries(new FormData(filter));v3AdminRender()};
 const reset=document.querySelector('#v3-ref-reset');
 if(reset)reset.onclick=function(){v3AdminFilter={q:'',status:''};v3AdminRender()};
 const deal=document.querySelector('#v3-deal-form');
 if(deal)deal.onsubmit=function(e){
  e.preventDefault();const r=db.v3.referrals.find(function(x){return x.id===deal.dataset.id});
  if(!r||r.status!=='有效咨询'||r.dealPaid)return toast('该记录已处理');
  const data=Object.fromEntries(new FormData(deal));
  if(data.date<r.created.slice(0,10)){toast('签约日期不能早于咨询日期');return}
  r.project=data.project;r.dealDate=data.date;r.dealNote=data.note.trim();r.status='已成交';r.dealPaid=true;
  points(db.v3.rewardRules.deal,'好友签约成交',r.project,db.user.name);save();
  location.hash='/referrals/'+r.id;v3AdminRender(r.id);toast('成交已录入，奖励积分已发放');
 };
}
document.querySelector('#admin').addEventListener('click',function(e){
 const button=e.target.closest('[data-ref-action]');if(!button)return;
 const r=db.v3.referrals.find(function(x){return x.id===button.dataset.id});if(!r||r.status!=='待核实')return toast('该记录已处理');
 const action=button.dataset.refAction;
 if(action==='valid'){
  dialog('确认有效咨询','<p>已核对这是新用户首次有效找房咨询吗？确认后向推荐人发放 '+db.v3.rewardRules.validLead+' 积分。</p>','确认',function(){
   r.status='有效咨询';r.leadPaid=true;points(db.v3.rewardRules.validLead,'好友有效咨询',r.project,db.user.name);
   save();closeDialog();v3AdminRender(r.id);toast('已发放基础积分');
  });
 }else if(action==='invalid'){
  dialog('标为无效','<form id="v3-invalid-form"><label class="field"><span>原因</span><select name="reason"><option>重复咨询</option><option>手机号与推荐人相同</option><option>无法联系</option><option>非真实找房需求</option></select></label></form>','确认',function(){
   r.status='无效';r.reason=document.querySelector('#v3-invalid-form select').value;save();closeDialog();v3AdminRender(r.id);toast('已标为无效');
  });
 }
});
