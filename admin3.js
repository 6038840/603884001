/* 增长收敛版后台 v3.0。列表、只读详情、状态操作均使用本机演示数据。 */
let a3Filters={};
const a3Menus=[['积分商城',[['rewards','礼品管理'],['exchanges','兑换订单'],['ledger','积分明细'],['rules','积分规则']]],['活动运营管理',[['tasks','生活知识'],['newcomers','新人礼'],['surveys','需求问卷']]],['拉新推荐',[['invites','参与推荐'],['referrals','找房推荐']]]];
const a3Names=Object.fromEntries(a3Menus.flatMap(x=>x[1]));
const a3Btn=(name,action,id='',danger=false)=>`<button type="button" data-a3="${action}" data-id="${esc(id)}" ${danger?'class="danger"':''}>${name}</button>`;
const a3Link=(label,path)=>`<a href="#/${path}">${label}</a>`;
const a3Heading=(title,actions='')=>a2Heading(title,actions);
const a3SelectMap=(name,label,options,value)=>`<label class="field"><span>${label}</span><select name="${name}">${options.map(([val,text])=>`<option value="${val}" ${value===val?'selected':''}>${text}</option>`).join('')}</select></label>`;
const a3Pair=(label,value)=>a2Pair(label,esc(value??'—'));
const a3Section=(title,body)=>`<section class="a3-section"><h2>${title}</h2>${body}</section>`;
const a3Back=(path)=>`<a class="btn" href="#/${path}">返回</a>`;
const a3Footer=(path)=>`<div class="a3-footer"><a class="btn" href="#/${path}">取消</a><button class="btn primary" type="submit">保存</button></div>`;
const a3Tabs=(rows,active)=>`<nav class="a3-tabs">${rows.map(([path,label])=>`<a href="#/${path}" class="${active===path?'active':''}">${label}</a>`).join('')}</nav>`;
const a3Rule=id=>db.admin3.rules.find(x=>x.id===id);
const a3Good=id=>db.admin3.goods.find(x=>x.id===id);
const a3Question=id=>db.admin3.knowledge.find(x=>x.id===id);
const a3Order=id=>db.growth.orders.find(x=>x.id===id);
const a3Stock=x=>db.growth.stocks[x.id]??x.stock;
function a3Audit(name,action,note){db.admin3.history.unshift({time:a3Now(),name,action,note,operator:'平台运营'})}
function a3Commit(name,action,note,path){a3Audit(name,action,note);a3Sync();save();closeDialog();if(path)ag(path);adminRender();toast('已'+action)}
shell=function(active,body){
 document.querySelector('#admin').innerHTML=`<div class="admin-shell"><header class="admin-top"><div class="brand"><span class="brand-mark">安</span><div>湖北青年有家<span class="a3-version">后台 v3.0</span><small>运营管理平台</small></div></div><div class="account"><span class="account-circle">运</span>平台运营</div></header><aside class="sidebar"><nav aria-label="运营管理导航">${a3Menus.map(([group,items])=>`<div class="menu-group">${group}</div>${items.map(([key,name])=>`<a href="#/${key}" class="${active===key?'active':''}" ${active===key?'aria-current="page"':''}><span>${navIcon(key==='invites'?'referrals':key)}</span>${name}</a>`).join('')}`).join('')}</nav></aside><section class="admin-workspace"><main class="admin-main"><div class="content-card">${body.includes('class="breadcrumb"')?'':`<div class="breadcrumb">运营管理 / ${a3Names[active]||'积分商城'}</div>`}${body}</div></main></section></div>`;
 document.title=(a3Names[active]||'运营管理')+' · 后台 v3.0 · 湖北青年有家';
};
function a3Filter(type,statuses,extra=''){
 const f=a3Filters[type]||{};
 return `<form class="filters" data-a3-form="filter" data-type="${type}">${a2Field('q','关键词',f.q||'','text','',false)}${statuses.length?a2Select('status','状态',['',...statuses],f.status||''):''}${extra}<button class="btn primary">查询</button><button type="button" class="btn" data-a3="reset" data-id="${type}">重置</button></form>`;
}
function a3Rows(type,rows,search){const f=a3Filters[type]||{};return rows.filter(x=>(!f.status||x.status===f.status)&&(!f.q||search(x).toLowerCase().includes(f.q.toLowerCase())))}
function a3Table(type,headers,rows,row){
 const f=a3Filters[type]||{},pages=Math.max(1,Math.ceil(rows.length/10)),page=Math.min(f.page||1,pages);
 return `<div class="table-wrap"><table><thead><tr>${headers.map(x=>`<th>${x}</th>`).join('')}</tr></thead><tbody>${rows.slice((page-1)*10,page*10).map(row).join('')}</tbody></table></div>${rows.length?'':'<div class="admin-empty">没有找到相关记录</div>'}<div class="pagination"><span>共 ${rows.length} 条</span><div class="row"><button class="btn" data-a3="page" data-id="${type}" data-page="${page-1}" ${page===1?'disabled':''}>上一页</button><span>${page} / ${pages}</span><button class="btn" data-a3="page" data-id="${type}" data-page="${page+1}" ${page===pages?'disabled':''}>下一页</button></div></div>`;
}
function a3GoodActions(x){return a3Link('详情','rewards/'+x.id)+(['草稿','已下架'].includes(x.status)?a3Link('编辑','rewards/'+x.id+'/edit')+a3Btn('上架','good-publish',x.id):'')+a3Btn('补货','good-stock',x.id)+(['已上架','已兑完'].includes(x.status)?a3Btn('下架','good-off',x.id,true):'')+(x.status==='草稿'?a3Btn('删除','good-delete',x.id,true):'')}
function a3GoodsList(){
 const rows=a3Rows('rewards',db.admin3.goods,x=>[x.name,x.category,x.spec].join(' '));
 return a3Heading('礼品管理','<button class="btn" data-a3="export" data-id="rewards">导出</button><a class="btn primary" href="#/rewards/new">新建礼品</a>')+a3Filter('rewards',['草稿','已上架','已兑完','已下架'])+a3Table('rewards',['礼品','分类','所需积分','可用库存','每人限兑','状态','操作'],rows,x=>`<tr><td><div class="a3-product">${x.adminExample?'':`<img src="${esc(x.image)}" alt="${esc(x.name)}">`}<div>${esc(x.name)}<small>${esc(x.color)}</small></div></div></td><td>${esc(x.category)}</td><td>${x.points}</td><td>${a3Stock(x)} 件</td><td>本期 ${x.limit} 件</td><td>${a2Status(x.status)}</td><td><div class="a3-actions">${a3GoodActions(x)}</div></td></tr>`);
}
function a3GoodDetail(x){
 return a3Heading('礼品详情',a3Back('rewards'))+`<div class="detail-heading"><h2>${esc(x.name)}</h2>${a2Status(x.status)}</div>`+a3Section('礼品信息',`<dl class="detail-grid">${a3Pair('名称',x.name)}${a3Pair('一句话介绍',x.subtitle)}${a3Pair('分类',x.category)}${a3Pair('颜色',x.color)}${a3Pair('规格',x.spec)}${a3Pair('礼品介绍',x.desc)}${a3Pair('使用提醒',x.note)}</dl>`)+a3Section('图片',`<div class="a3-read-images"><figure><img src="${esc(x.image)}" alt="列表图"><figcaption>列表图片</figcaption></figure><figure><img src="${esc(x.detailImage)}" alt="详情图"><figcaption>详情图片</figcaption></figure></div>`)+a3Section('兑换与配送',`<dl class="detail-grid">${a3Pair('兑换积分',x.points+' 积分 / 件')}${a3Pair('可用库存',a3Stock(x)+' 件')}${a3Pair('本期限兑',x.limit+' 件 / 人')}${a3Pair('采购单价','¥'+x.cost+'（预算估算）')}${a3Pair('配送方式','中国大陆包邮，3个工作日内发出')}${a3Pair('更新时间',x.updated)}</dl>`)+`<div class="detail-footer"><a class="btn" href="#/rewards">返回</a><div class="a3-actions">${a3GoodActions(x)}</div>${['已上架','已兑完'].includes(x.status)?`<a class="btn" href="index.html#/product/${x.id}" target="_blank">预览</a>`:''}</div>`;
}
function a3ImageField(name,label,value){return `<label class="field a3-image-field"><span>${label} <em>*</em></span><img src="${esc(value||'assets/growth-stand-list.png')}" alt="${label}预览"><input name="${name}" type="text" value="${esc(value||'')}" required placeholder="本地图片路径"><input type="file" accept="image/png,image/jpeg,image/webp" data-a3-upload="${name}"><small class="a3-help">可选择图片替换，单张不超过2MB。</small></label>`}
function a3GoodForm(x){
 const v=x||{name:'',subtitle:'',category:'居家日用',color:'',spec:'',points:80,stock:0,limit:3,cost:0,desc:'',note:'',image:'',detailImage:''};
 return a3Heading(x?'编辑礼品':'新建礼品',a3Back('rewards'))+`<form class="a3-form" data-a3-form="good" data-id="${x?.id||''}"><div class="a3-error" id="a3-error"></div>`+a3Section('礼品信息',`<div class="a3-grid">${a2Field('name','礼品名称',v.name)}${a2Field('subtitle','一句话介绍',v.subtitle)}${a2Select('category','分类',['桌面好物','出门随行','居家日用'],v.category)}${a2Field('color','颜色',v.color)}${a2Field('spec','规格',v.spec)}<label class="field full"><span>礼品介绍 <em>*</em></span><textarea name="desc" rows="3" required maxlength="300">${esc(v.desc)}</textarea></label><label class="field full"><span>使用提醒 <em>*</em></span><textarea name="note" rows="2" required maxlength="200">${esc(v.note)}</textarea></label></div>`)+a3Section('礼品图片',`<div class="a3-grid">${a3ImageField('image','列表图',v.image)}${a3ImageField('detailImage','详情图',v.detailImage)}</div>`)+a3Section('兑换设置',`<div class="a3-grid">${a2Field('points','所需积分',v.points,'number')}${a2Field('limit','每人本期限兑（件）',v.limit,'number')}${!x?a2Field('stock','初始库存（件）',v.stock,'number'):''}${a2Field('cost','采购单价（元）',v.cost,'number','用于运营预算估算，不是向用户收取的价格。')}</div><p class="a3-help">包邮，3个工作日内发出。保存后仍须上架，已生成订单按兑换时的信息履约。</p>`)+a3Footer('rewards/'+(x?.id||''))+'</form>';
}
function a3OrderActions(o,detail=false){
 return (detail?'':a3Link('详情','exchanges/'+o.id))+(o.status==='待发货'?a3Link('发货','exchanges/'+o.id+'/ship')+a3Btn('取消','order-cancel',o.id,true):'')+(o.status==='已发货'?a3Link('物流','exchanges/'+o.id+'/logistics'):'')+(o.status==='售后中'?a3Link('处理','exchanges/'+o.id+'/after'):'');
}
function a3OrdersList(){
 const rows=a3Rows('exchanges',db.growth.orders,x=>[x.name,x.address.name,x.address.phone,x.tracking||''].join(' '));
 return a3Heading('兑换订单','<button class="btn" data-a3="export" data-id="exchanges">导出</button>')+a3Filter('exchanges',['待发货','已发货','已完成','售后中','已取消'])+a3Table('exchanges',['礼品','兑换人','件数','消耗积分','兑换时间','状态','操作'],rows,o=>`<tr><td>${esc(o.name)}</td><td>${esc(o.address.name)}<small class="a3-sub">${phoneMask(o.address.phone)}</small></td><td>${o.quantity}</td><td>${o.points}</td><td>${esc(o.date)}</td><td>${a2Status(o.status)}</td><td><div class="a3-actions">${a3OrderActions(o)}</div></td></tr>`);
}
function a3OrderTimeline(o){return `<ul class="a3-records">${(o.events||[]).map(([t,n])=>`<li><time>${esc(t)}</time><span>${esc(n)}</span></li>`).join('')}</ul>`}
function a3OrderDetail(o){
 const a=o.address;
 return a3Heading('兑换详情',a3Back('exchanges'))+`<div class="detail-heading"><h2>${esc(o.name)}</h2>${a2Status(o.status)}</div>`+a3Section('兑换信息',`<dl class="detail-grid">${a3Pair('礼品',o.name)}${a3Pair('件数',o.quantity)}${a3Pair('消耗积分',o.points)}${a3Pair('兑换时间',o.date)}${a3Pair('配送费用','包邮，不另收现金')}${a3Pair('积分退还',o.refunded?'已退还 '+o.points+' 积分':'未退还')}${o.cancelReason?a3Pair('取消原因',o.cancelReason):''}</dl>`)+a3Section('收货信息',`<dl class="detail-grid">${a3Pair('收货人',a.name)}${a3Pair('联系电话',a.phone)}${a3Pair('收货地址',[a.province,a.city,a.district,a.street].join(''))}</dl>`)+(o.carrier?a3Section('配送信息',`<dl class="detail-grid">${a3Pair('快递公司',o.carrier)}${a3Pair('运单号',o.tracking)}</dl>`):'')+(o.reason?a3Section('售后信息',`<dl class="detail-grid">${a3Pair('申请原因',o.reason)}${a3Pair('情况说明',o.description||'杯口破损，希望联系处理。')}${a3Pair('联系电话',o.contactPhone||a.phone)}${o.afterResult?a3Pair('处理结果',o.afterResult):''}${o.afterNote?a3Pair('处理说明',o.afterNote):''}</dl>${o.photos?.length?`<div class="a3-read-images">${o.photos.map(src=>`<img src="${esc(src)}" alt="售后凭证">`).join('')}</div>`:''}`):'')+a3Section('进度',a3OrderTimeline(o))+`<div class="detail-footer">${a3Back('exchanges')}<div class="a3-actions">${a3OrderActions(o,true)}</div></div>`;
}
function a3ShipForm(o){
 return a3Heading('发货',a3Back('exchanges/'+o.id))+`<form class="a3-form" data-a3-form="ship" data-id="${o.id}"><div class="a3-error" id="a3-error"></div><dl class="detail-grid">${a3Pair('礼品',o.name+' × '+o.quantity)}${a3Pair('收货人',o.address.name+' · '+o.address.phone)}${a3Pair('地址',Object.values(o.address).slice(2).join(''))}</dl><div class="a3-grid" style="margin-top:24px">${a2Select('carrier','快递公司',['顺丰速运','中通快递','圆通速递','申通快递','韵达快递','邮政EMS','其他'],o.carrier||'顺丰速运')}${a2Field('tracking','运单号',o.tracking||'')}<label class="field full"><span>发货备注</span><textarea name="note" rows="2" maxlength="200" placeholder="选填"></textarea></label></div><p class="a3-help">请完成实际寄送后再提交，用户将看到快递公司和运单号。</p><div class="a3-footer"><a class="btn" href="#/exchanges/${o.id}">取消</a><button class="btn primary">提交</button></div></form>`;
}
function a3AfterForm(o){
 return a3Heading('处理售后',a3Back('exchanges/'+o.id))+a3Section('用户反馈',`<dl class="detail-grid">${a3Pair('礼品',o.name+' × '+o.quantity)}${a3Pair('申请原因',o.reason)}${a3Pair('情况说明',o.description||'杯口破损，希望联系处理。')}${a3Pair('联系人',o.address.name+' · '+(o.contactPhone||o.address.phone))}</dl>${o.photos?.length?`<div class="a3-read-images">${o.photos.map(src=>`<img src="${esc(src)}" alt="用户提供的照片">`).join('')}</div>`:''}`)+`<form class="a3-form" data-a3-form="after" data-id="${o.id}"><div class="a3-error" id="a3-error"></div><div class="a3-grid">${a2Select('result','处理方式',['补寄礼品','退还积分','不予通过'],'补寄礼品')}${a2Field('operator','处理人','张悦')}<div id="a3-reship" class="full a3-grid">${a2Select('carrier','快递公司',['顺丰速运','中通快递','圆通速递','邮政EMS','其他'],'顺丰速运')}${a2Field('tracking','补寄运单号','')}</div><label class="field full"><span>处理说明 <em>*</em></span><textarea name="note" required rows="3" maxlength="300" placeholder="说明联系结果与解决方式，用户可以看到"></textarea></label></div><div class="a3-footer"><a class="btn" href="#/exchanges/${o.id}">取消</a><button class="btn primary">提交</button></div></form>`;
}
function a3RuleActions(r){return a3Link('详情','rules/'+r.id)+a3Link('编辑','rules/'+r.id+'/edit')+(r.draft?a3Btn('发布修改','rule-publish',r.id):r.status==='已启用'?a3Btn('停用','rule-stop',r.id,true):a3Btn('启用','rule-publish',r.id))}
function a3RulesList(){
 return a3Heading('积分规则')+a3Tabs([['rules','奖励规则'],['rules/settings','运营设置'],['rules/history','变更记录']],'rules')+a3Table('rules',['规则','奖励','有效条件','领取限制','承担方','状态','操作'],db.admin3.rules,r=>`<tr><td>${esc(r.name)}<small class="a3-sub">${esc(r.category)}</small></td><td>${r.reward} 积分</td><td><div class="a3-rule-copy">${esc(r.condition)}</div></td><td>${r.id==='invite'?`每天${r.daily}位<br>本期${r.total}位`:esc(r.limit)}</td><td>${esc(r.funder)}</td><td>${a2Status(r.status)}${r.draft?'<small class="a3-sub">修改待发布</small>':''}</td><td><div class="a3-actions">${a3RuleActions(r)}</div></td></tr>`);
}
function a3RuleDetail(r){return a3Heading('规则详情',a3Back('rules'))+`<div class="detail-heading"><h2>${r.name}</h2>${a2Status(r.status)}</div>${r.draft?'<p class="a3-note">有待发布修改，当前仍按原规则发奖。</p>':''}<dl class="detail-grid">${a3Pair('奖励积分',r.reward+' 积分')}${a3Pair('有效条件',r.condition)}${a3Pair('发放节点',r.grant)}${a3Pair('次数限制',r.id==='invite'?`每天${r.daily}位，本期${r.total}位`:r.limit)}${a3Pair('时间范围',r.start+' 至 '+r.end)}${a3Pair('成本承担',r.funder)}${a3Pair('去重方式','同一有效行为仅计一次；好友与群聊不重复叠加')}${a3Pair('分享本身','不发积分，不用截图核验；不要求分享到群才能使用')}${a3Pair('积分用途','实物兑换；不可提现或转让，不影响房源排序与申请优先权')}</dl><div class="detail-footer">${a3Back('rules')}<div class="a3-actions">${a3RuleActions(r)}</div></div>`}
function a3RuleForm(record){
 const r=record.draft||record;
 return a3Heading('编辑积分规则',a3Back('rules/'+r.id))+`<form class="a3-form" data-a3-form="rule" data-id="${r.id}"><div class="a3-error" id="a3-error"></div>`+a3Section('有效行为',`<dl class="detail-grid">${a3Pair('规则名称',r.name)}${a3Pair('计奖条件',r.condition)}${a3Pair('发放节点',r.grant)}${a3Pair('成本承担',r.funder)}</dl>`)+a3Section('奖励与限制',`<div class="a3-grid">${a2Field('reward','每次奖励（积分）',r.reward,'number')}${r.id==='invite'?a2Field('daily','每天最多计奖（人）',r.daily,'number')+a2Field('total','本期最多计奖（人）',r.total,'number'):`<div class="field"><span>领取次数</span><p class="a3-note">${esc(r.limit)}</p></div>`}${a2Field('start','开始日期',r.start,'date')}${a2Field('end','结束日期',r.end,'date')}</div>`)+a3Section('公平参与',`<p class="a3-help">一个被推荐人只绑定一个推荐人，同一手机号去重，不能自邀。发奖条件不能改成“点击分享”或“群内打开”。咨询奖励与成交奖励分别核实，仅有线下签约结果时由运营商录入。</p>`)+`<p class="a3-note">保存后先核对，再发布。已发放积分按原记录保留。</p>`+a3Footer('rules/'+r.id)+'</form>';
}
function a3Settings(){const s=db.admin3.settings;return a3Heading('积分规则')+a3Tabs([['rules','奖励规则'],['rules/settings','运营设置'],['rules/history','变更记录']],'rules/settings')+`<dl class="detail-grid">${a3Pair('平台运营预算','¥'+s.budget.toLocaleString())}${a3Pair('预算用途','实体礼品采购、配送与运营预留；礼品单价为估算，不是采购报价')}${a3Pair('成交奖承担方','武汉城投安家乐寓，单独承担')}${a3Pair('积分有效期','本期演示长期有效，漏签不清零')}${a3Pair('配送范围',s.shipping)}${a3Pair('发货时效',s.shipDays+'个工作日')}${a3Pair('售后反馈期','收到后'+s.afterDays+'天内')}${a3Pair('客服响应',s.serviceDays+'个工作日内')}${a3Pair('异常处理','核实后回收已发积分，余额不足记录待追回；不自动冻结账号')}</dl>`}
function a3History(){return a3Heading('变更记录')+a3Tabs([['rules','奖励规则'],['rules/settings','运营设置'],['rules/history','变更记录']],'rules/history')+a3Table('history',['时间','内容','操作','变更说明','操作人'],db.admin3.history,x=>`<tr><td>${esc(x.time)}</td><td>${esc(x.name)}</td><td>${esc(x.action)}</td><td>${esc(x.note)}</td><td>${esc(x.operator)}</td></tr>`)}
function a3QuizActions(q){return a3Link('详情','tasks/'+q.id)+(['草稿','已下架'].includes(q.status)?a3Link('编辑','tasks/'+q.id+'/edit')+a3Btn('发布','quiz-publish',q.id):a3Btn('下架','quiz-off',q.id,true))+(q.status==='草稿'?a3Btn('删除','quiz-delete',q.id,true):'')}
function a3QuizList(){const rows=a3Rows('tasks',db.admin3.knowledge,x=>x.title+' '+x.tag);return a3Heading('生活知识','<a class="btn primary" href="#/tasks/new">新建题目</a>')+a3Filter('tasks',['草稿','已发布','已下架'])+a3Table('tasks',['题目','类别','选项数','状态','操作'],rows,q=>`<tr><td>${esc(q.title)}</td><td>${esc(q.tag)}</td><td>${q.options.length}</td><td>${a2Status(q.status)}</td><td><div class="a3-actions">${a3QuizActions(q)}</div></td></tr>`)}
function a3QuizDetail(q){return a3Heading('题目详情',a3Back('tasks'))+`<div class="detail-heading"><h2>${esc(q.title)}</h2>${a2Status(q.status)}</div><dl class="detail-grid">${a3Pair('类别',q.tag)}${a3Pair('题干',q.question)}${a3Pair('选项',q.options.map((s,i)=>String.fromCharCode(65+i)+'. '+s).join('\n'))}${a3Pair('正确答案',q.options[q.answer])}${a3Pair('答案解析',q.why)}${a3Pair('配图样式',{'receipt':'费用凭证','meter':'水电表','power':'安全用电','home':'安家收纳','shield':'隐私保护'}[q.art]||'安家知识')}${a3Pair('积分',`当天答对首题+${a3Reward('quiz')}积分；其他题只学习，不重复发奖`)}</dl><div class="detail-footer">${a3Back('tasks')}<div class="a3-actions">${a3QuizActions(q)}</div>${q.status==='已发布'?`<a class="btn" target="_blank" href="index.html#/knowledge-quiz/${q.id}">预览</a>`:''}</div>`}
function a3QuizChoice(value,index,answer){return `<div class="a3-choice-row"><input type="radio" name="answer" value="${index}" ${index===answer?'checked':''} aria-label="选为正确答案" required><input type="text" name="option" value="${esc(value)}" required placeholder="选项${index+1}">${a3Btn('删除','choice-remove')}</div>`}
function a3QuizForm(q){const v=q||{title:'',tag:'生活小知识',question:'',options:['','',''],answer:0,why:'',art:'home',color:'purple'};return a3Heading(q?'编辑题目':'新建题目',a3Back('tasks'))+`<form class="a3-form" data-a3-form="quiz" data-id="${q?.id||''}"><div class="a3-error" id="a3-error"></div><div class="a3-grid">${a2Field('title','卡片标题',v.title)}${a2Select('tag','类别',['找房小知识','生活小知识','分享小知识'],v.tag)}<label class="field full"><span>题干 <em>*</em></span><textarea name="question" required rows="2" maxlength="150">${esc(v.question)}</textarea></label><div class="field full"><span>选项与正确答案 <em>*</em></span><div id="a3-options">${v.options.map((o,i)=>a3QuizChoice(o,i,v.answer)).join('')}</div><button class="btn" type="button" data-a3="choice-add">新增选项</button><small class="a3-help">2—5个选项，选择一项正确答案。</small></div><label class="field full"><span>答案解析 <em>*</em></span><textarea name="why" required rows="3" maxlength="400">${esc(v.why)}</textarea></label>${a3SelectMap('art','配图样式',[['receipt','费用凭证'],['meter','水电表'],['power','安全用电'],['home','安家收纳'],['shield','隐私保护']],v.art)}${a3SelectMap('color','卡片配色',[['purple','浅紫'],['orange','暖橙'],['mint','薄荷绿'],['rose','浅粉']],v.color)}</div><p class="a3-help">奖励金额统一使用“积分规则”，不在每道题上单独配置。保存为草稿，发布后用户可见。</p>${a3Footer('tasks/'+(q?.id||''))}</form>`}
function a3NewcomerList(){const r=a3Rule('newcomer'),n=by('newcomers','n1');return a3Heading('新人礼')+`<div class="table-wrap"><table><thead><tr><th>新人礼</th><th>领取条件</th><th>奖励</th><th>状态</th><th>操作</th></tr></thead><tbody><tr><td>新人积分礼</td><td>首次签到＋答题后领取</td><td>${r.reward} 积分</td><td>${a2Status(r.status)}</td><td><div class="a3-actions">${a3Link('详情','rules/newcomer')}${a3Link('编辑','rules/newcomer/edit')}${a3Link('领取记录','newcomers/points/claims')}</div></td></tr><tr><td><div class="a3-product"><img src="assets/doubao-avatar.png" alt="豆包头像"><div>豆包流量卡<small>App体验权益</small></div></div></td><td>首次签到＋答题，每人一次</td><td>免费，${n.stock} 份可领</td><td>${a2Status(n.status)}</td><td><div class="a3-actions">${a3Link('详情','newcomers/n1')}${a3Link('编辑','newcomers/n1/edit')}${a3Link('卡库','newcomers/n1/cards')}${a3Link('领取记录','newcomers/n1/claims')}</div></td></tr></tbody></table></div>`}
function a3GiftEdit(n){return a3Heading('编辑豆包流量卡',a3Back('newcomers/n1'))+`<form class="a3-form" data-a3-form="gift" data-id="n1"><div class="a3-error" id="a3-error"></div><div class="a3-grid">${a2Field('title','活动名称',n.title)}${a2Select('aiDisplay','前台展示',['展示','不展示'],n.aiDisplay)}${a2Field('start','开始日期',n.start,'date')}${a2Field('end','结束日期',n.end,'date')}${a2Field('aiSubtitle','一句话介绍',n.aiSubtitle)}<label class="field full"><span>权益说明 <em>*</em></span><textarea name="aiDescription" required rows="4">${esc(n.aiDescription)}</textarea></label></div><dl class="detail-grid" style="margin-top:24px">${a3Pair('礼品名称','豆包流量卡')}${a3Pair('领取条件','首次签到＋答题，每人一次，免费领取')}${a3Pair('可发放数量','由卡库导入和领取记录决定')}${a3Pair('头像','使用豆包头像')}</dl>${a3Footer('newcomers/n1')}</form>`}
function a3PointClaims(){const rows=db.ledger.filter(x=>x.action==='新人礼');return a3Heading('新人积分领取记录',a3Back('newcomers'))+a3Table('point-claims',['用户','领取积分','领取时间'],rows,x=>`<tr><td>${esc(x.name)}</td><td>${x.change}</td><td>${esc(x.date)}</td></tr>`)}
function a3InviteActions(f){return a3Link('详情','invites/'+f.id)+(f.stage!=='不计奖'?a3Btn('标为异常','invite-invalid',f.id,true):'')}
function a3InvitesList(){const rows=a3Rows('invites',db.growth.invites.map(f=>({...f,status:f.stage})),x=>[x.name,x.phone,x.source,x.inviterName||db.user.name].join(' '));return a3Heading('参与推荐','<button class="btn" data-a3="export" data-id="invites">导出</button><a class="btn" href="#/rules/invite">奖励规则</a>')+a3Filter('invites',['已注册','已参与','不计奖'])+a3Table('invites',['推荐人','被推荐人','分享内容','首次参与','奖励','状态','操作'],rows,f=>`<tr><td>${esc(f.inviterName||db.user.name)}</td><td>${esc(f.name)}<small class="a3-sub">${phoneMask(f.phone)}</small></td><td>${esc(f.source)}<small class="a3-sub">${esc(f.channel||'好友')}</small></td><td>签到：${f.signed?'完成':'未完成'}<br>答题：${f.answered?'完成':'未完成'}</td><td>${f.reward?f.reward+' 积分'+(f.reclaimed?'（已回收）':''):'未发奖'}</td><td>${a2Status(f.stage)}</td><td><div class="a3-actions">${a3InviteActions(f)}</div></td></tr>`)}
function a3InviteDetail(f){return a3Heading('参与推荐详情',a3Back('invites'))+`<div class="detail-heading"><h2>${esc(f.name)}</h2>${a2Status(f.stage)}</div><dl class="detail-grid">${a3Pair('推荐人',f.inviterName||db.user.name)}${a3Pair('被推荐人',f.name)}${a3Pair('手机号',phoneMask(f.phone))}${a3Pair('分享内容',f.source)}${a3Pair('分享渠道',f.channel||'好友')}${a3Pair('登记时间',f.date)}${a3Pair('首次签到',f.signed?'已完成':'未完成')}${a3Pair('首次答题',f.answered?'已完成':'未完成')}${a3Pair('推荐奖励',f.reward?f.reward+' 积分'+(f.reclaimed?'，已回收':'，已发放'):'未发放')}${f.reason?a3Pair('处理原因',f.reason):''}${f.pendingRecovery?a3Pair('待追回积分',f.pendingRecovery):''}</dl><p class="a3-help">符合条件后自动发奖，不设置人工“补发”按钮。推荐人只看到参与进度，不看到完整手机号、答题或地址。</p><div class="detail-footer">${a3Back('invites')}<div class="a3-actions">${a3InviteActions(f)}</div></div>`}
function a3LedgerList(){const rows=a3Rows('ledger',db.ledger,x=>[x.name,x.action,x.note].join(' '));return a3Heading('积分明细','<button class="btn" data-a3="export" data-id="ledger">导出</button>')+a3Filter('ledger',[])+a3Table('ledger',['用户','事项','积分变动','余额','时间','关联内容','操作'],rows,x=>`<tr><td>${esc(x.name)}</td><td>${esc(x.action)}</td><td class="${x.change>0?'a3-positive':'a3-negative'}">${x.change>0?'+':''}${x.change}</td><td>${x.balance}</td><td>${esc(x.date)}</td><td>${esc(x.note)}</td><td>${a3Link('详情','ledger/'+x.id)}</td></tr>`)}
function a3LedgerDetail(x){return a3Heading('积分记录',a3Back('ledger'))+`<dl class="detail-grid">${a3Pair('用户',x.name)}${a3Pair('事项',x.action)}${a3Pair('积分变动',(x.change>0?'+':'')+x.change)}${a3Pair('变动后余额',x.balance)}${a3Pair('时间',x.date)}${a3Pair('关联内容',x.note)}</dl><div class="detail-footer">${a3Back('ledger')}</div>`}
function a3Missing(){return '<div class="a3-missing">这条记录不存在或已移除。<br><a href="#/rewards">返回积分商城</a></div>'}
const a3LegacyRender=adminRender;
adminRender=function(){
 closeDialog();a3Sync();a2RefreshSharedState();const [type='rewards',key,mode]=location.hash.replace(/^#\/?/,'').split('/');let body;
 if(!a3Names[type]){ag('rewards');return}
 if(type==='rewards'){const x=a3Good(key);body=!key?a3GoodsList():key==='new'?a3GoodForm():x?(mode==='edit'&&['草稿','已下架'].includes(x.status)?a3GoodForm(x):a3GoodDetail(x)):a3Missing()}
 if(type==='exchanges'){const o=a3Order(key),card=by('exchanges',key);body=!key?a3OrdersList():o?(mode==='ship'&&o.status==='待发货'?a3ShipForm(o):mode==='after'&&o.status==='售后中'?a3AfterForm(o):mode==='logistics'?a3Heading('物流进度',a3Back('exchanges/'+o.id))+`<dl class="detail-grid">${a3Pair('快递公司',o.carrier)}${a3Pair('运单号',o.tracking)}</dl>`+a3Section('配送记录',a3OrderTimeline(o)):a3OrderDetail(o)):card?.reward==='r-doubao'?detailPage('exchanges',card):a3Missing()}
 if(type==='rules'){const r=a3Rule(key);body=!key?a3RulesList():key==='settings'?a3Settings():key==='history'?a3History():r?(mode==='edit'?a3RuleForm(r):a3RuleDetail(r)):a3Missing()}
 if(type==='tasks'){const q=a3Question(key);body=!key?a3QuizList():key==='new'?a3QuizForm():q?(mode==='edit'&&['草稿','已下架'].includes(q.status)?a3QuizForm(q):a3QuizDetail(q)):a3Missing()}
 if(type==='newcomers'){const n=by('newcomers','n1');body=!key?a3NewcomerList():key==='points'?a3PointClaims():key==='n1'?['edit','ai-edit'].includes(mode)?a3GiftEdit(n):a2NewcomerDetail({...n,experience:'首次签到＋答题，每人一次，免费领取'},mode||'').replaceAll('个人中心 → 我的券 → 豆包流量卡','新人礼 → 豆包流量卡 → 我的券').replaceAll('新人见面礼','新人礼'):a3Missing()}
 if(type==='invites'){const f=db.growth.invites.find(x=>x.id===key);body=!key?a3InvitesList():f?a3InviteDetail(f):a3Missing()}
 if(type==='referrals'){const r=db.v3.referrals.find(x=>x.id===key);body=!key?a2ReferralList().replace('好友推荐','找房推荐'):r?(mode==='deal'?a2DealForm(r).replace('id="v3-deal-form"','id="a3-deal-form"'):a2ReferralDetail(r)):a3Missing()}
 if(type==='ledger'){const x=by('ledger',key);body=!key?a3LedgerList():x?a3LedgerDetail(x):a3Missing()}
 if(type==='surveys'){const q=db.admin2.surveys.find(x=>x.id===key);body=!key?a2SurveysList():key==='new'?a2SurveyForm():q?(mode==='edit'&&['草稿','已暂停'].includes(q.status)?a2SurveyForm(q):['results','responses'].includes(mode)?a2SurveyResults(q,mode==='responses'):a2SurveyDetail(q)):a3Missing()}
 shell(type,body);a3Bind();a2Bind();if(type==='exchanges'&&!a3Order(key))bindAdmin();window.scrollTo(0,0);
};
function a3Error(msg){document.querySelector('#a3-error').textContent=msg}
function a3Confirm(title,body,callback){dialog(title,body,'确认',()=>{callback();closeDialog()})}
function a3Refund(o,restore){if(o.refunded)return;o.refunded=true;if(restore)db.growth.stocks[o.good]=(db.growth.stocks[o.good]||0)+o.quantity;points(o.points,'兑换退回',o.name,o.ownerName||db.user.name)}
function a3Bind(){
 document.querySelectorAll('[data-a3-upload]').forEach(el=>el.onchange=()=>{const f=el.files[0];if(!f)return;if(f.size>2*1024*1024||!/^image\/(png|jpeg|webp)$/.test(f.type)){el.value='';return toast('请选择2MB以内的JPG、PNG或WebP图片')}const reader=new FileReader();reader.onload=()=>{el.closest('label').querySelector('img').src=reader.result;el.closest('label').querySelector('input[type=text]').value=reader.result};reader.readAsDataURL(f)});
 document.querySelectorAll('.a3-image-field input[type=text]').forEach(el=>el.onchange=()=>el.closest('label').querySelector('img').src=el.value);
 const cost=document.querySelector('[data-a3-form=good] [name=cost]');if(cost)cost.step='0.01';
 const after=document.querySelector('[data-a3-form=after]');if(after){const update=()=>{const reship=after.result.value==='补寄礼品';document.querySelector('#a3-reship').hidden=!reship;after.tracking.required=reship};after.result.onchange=update;update()}
}
document.querySelector('#admin').addEventListener('submit',e=>{
 const f=e.target.closest('[data-a3-form]');if(!f)return;e.preventDefault();e.stopImmediatePropagation();if(!f.reportValidity())return;
 const v=Object.fromEntries(new FormData(f)),key=f.dataset.id,kind=f.dataset.a3Form;
 if(kind==='filter'){a3Filters[f.dataset.type]={...v,page:1};return adminRender()}
 if(kind==='good'){
  const x=a3Good(key);if(x&&!['草稿','已下架'].includes(x.status))return a3Error('请先下架后编辑');
  const nums=['points','limit','cost',...(!x?['stock']:[])];for(const n of nums){v[n]=Number(v[n]);if(!Number.isFinite(v[n])||v[n]<0||(n!=='cost'&&!Number.isInteger(v[n])))return a3Error('积分、限兑和库存请填写整数，采购单价不能为负');}
  if(v.points<1||v.limit<1||v.limit>3)return a3Error('积分至少为1，本期每人限兑1—3件');
  if(v.image===v.detailImage)return a3Error('列表图与详情图请使用不同图片');
  if(![v.image,v.detailImage].every(s=>/^assets\/[\w./-]+\.(png|jpg|jpeg|webp)$/.test(s)||/^data:image\/(png|jpeg|webp);base64,/.test(s)))return a3Error('请使用本地图片或上传图片');
  const existing={id:x?.id||'gift-'+id(),status:x?.status||'草稿',updated:a3Now(),...v};if(x)Object.assign(x,existing);else{db.admin3.goods.unshift(existing);db.growth.stocks[existing.id]=v.stock;}return a3Commit(v.name,'保存','礼品信息','rewards/'+existing.id);
 }
 if(kind==='rule'){
  const r=a3Rule(key);v.reward=Number(v.reward);v.daily=Number(v.daily);v.total=Number(v.total);
  if(!Number.isInteger(v.reward)||v.reward<1||v.reward>10000)return a3Error('奖励填写1—10000之间的整数');
  if(v.start>v.end||v.end<a3Date())return a3Error('结束日期应不早于开始日期和今天');
  if(key==='invite'&&(!Number.isInteger(v.daily)||!Number.isInteger(v.total)||v.daily<1||v.total<v.daily||v.total>1000))return a3Error('每日上限至少1人，本期上限不小于每日上限且不超过1000人');
  r.draft={...structuredClone(r),reward:v.reward,start:v.start,end:v.end,...(key==='invite'?{daily:v.daily,total:v.total}:{})};delete r.draft.draft;return a3Commit(r.name,'保存','修改待发布','rules/'+r.id);
 }
 if(kind==='quiz'){
  const q=a3Question(key);if(q&&!['草稿','已下架'].includes(q.status))return a3Error('请先下架后编辑');
  const options=[...f.querySelectorAll('[name=option]')].map(x=>x.value.trim()),answer=Number(v.answer);
  if(options.length<2||options.length>5||new Set(options).size!==options.length||options.some(x=>!x))return a3Error('请填写2—5个不同的选项');
  if(!options[answer])return a3Error('请选择正确答案');
  const row={id:q?.id||'q-'+id(),title:v.title.trim(),tag:v.tag,question:v.question.trim(),options,answer,why:v.why.trim(),art:v.art,color:v.color,status:q?.status||'草稿',updated:a3Now()};if(q)Object.assign(q,row);else db.admin3.knowledge.unshift(row);return a3Commit(row.title,'保存','题目内容','tasks/'+row.id);
 }
 if(kind==='ship'){
  const o=a3Order(key);if(!o||o.status!=='待发货')return a3Error('该订单当前不可发货');
  if(!/^[A-Za-z0-9-]{6,40}$/.test(v.tracking.trim()))return a3Error('运单号请填写6—40位字母、数字或短横线');
  return a3Confirm('确认发货',`<p>${esc(o.name)} × ${o.quantity}<br>${esc(v.carrier)} · ${esc(v.tracking)}</p>`,()=>{if(o.status!=='待发货')return toast('订单状态已变化');Object.assign(o,{status:'已发货',carrier:v.carrier,tracking:v.tracking.trim(),shipNote:v.note});o.events.unshift([a3Now(),'已发货，'+v.carrier+' · '+v.tracking]);a3Commit(o.name,'发货',v.tracking,'exchanges/'+o.id)});
 }
 if(kind==='after'){
  const o=a3Order(key);if(!o||o.status!=='售后中')return a3Error('该售后已处理');
  if(v.result==='补寄礼品'&&!/^[A-Za-z0-9-]{6,40}$/.test(v.tracking.trim()))return a3Error('请填写有效补寄运单号');
  if(v.note.trim().length<5)return a3Error('处理说明至少5个字');
  return a3Confirm('提交处理结果',`<p>${esc(v.result)}${v.result==='退还积分'?' · 退还'+o.points+'积分':''}<br>${esc(v.note)}</p>`,()=>{if(o.status!=='售后中')return toast('售后状态已变化');if(v.result==='退还积分'){a3Refund(o,false);o.status='已取消'}else if(v.result==='补寄礼品'){Object.assign(o,{status:'已发货',carrier:v.carrier,tracking:v.tracking.trim()})}else o.status=o.priorStatus||'已完成';o.afterResult=v.result;o.afterNote=v.note.trim();o.afterOperator=v.operator;o.events.unshift([a3Now(),v.result+'：'+v.note.trim()]);a3Commit(o.name,'处理',v.result,'exchanges/'+o.id)});
 }
 if(kind==='gift'){
  if(v.start>v.end)return a3Error('结束日期不能早于开始日期');const n=by('newcomers','n1');Object.assign(n,v,{experience:'首次签到＋答题，每人一次，免费领取'});return a3Commit('豆包流量卡','保存','展示与领取时间','newcomers/n1');
 }
},true);
document.querySelector('#admin').addEventListener('click',e=>{
 const ref=e.target.closest('[data-ref-action]');if(ref){e.preventDefault();e.stopImmediatePropagation();return a2VerifyReferral(db.v3.referrals.find(x=>x.id===ref.dataset.id),ref.dataset.refAction)}
 const el=e.target.closest('[data-a3]');if(!el)return;e.preventDefault();e.stopImmediatePropagation();const action=el.dataset.a3,key=el.dataset.id;
 if(action==='reset'){a3Filters[key]={};return adminRender()}
 if(action==='page'){a3Filters[key]={...(a3Filters[key]||{}),page:Number(el.dataset.page)};return adminRender()}
 if(action==='choice-add'){const box=document.querySelector('#a3-options');if(box.children.length>=5)return toast('最多5个选项');box.insertAdjacentHTML('beforeend',a3QuizChoice('',box.children.length,-1));return}
 if(action==='choice-remove'){const box=document.querySelector('#a3-options');if(box.children.length<=2)return toast('至少保留两个选项');el.closest('.a3-choice-row').remove();box.querySelectorAll('[type=radio]').forEach((r,i)=>r.value=i);return}
 if(action.startsWith('good-')){
  const x=a3Good(key);if(!x)return;
  if(action==='good-publish'){if(!['草稿','已下架'].includes(x.status))return;if(a3Stock(x)<1)return toast('请先补充库存');return a3Confirm('上架礼品',`<p>${esc(x.name)} · ${x.points}积分<br>上架后用户可在积分商场兑换。</p>`,()=>{x.status='已上架';x.adminExample=false;a3Commit(x.name,'上架','用户可见')})}
  if(action==='good-off'&&['已上架','已兑完'].includes(x.status))return a3Confirm('下架礼品','<p>下架后不再接受新兑换，已生成订单继续履约。</p>',()=>{x.status='已下架';a3Commit(x.name,'下架','停止新兑换')});
  if(action==='good-delete'&&x.status==='草稿')return a3Confirm('删除草稿',`<p>确定删除${esc(x.name)}？</p>`,()=>{db.admin3.goods=db.admin3.goods.filter(g=>g.id!==x.id);a3Commit(x.name,'删除','礼品草稿','rewards')});
  if(action==='good-stock')return dialog('补货',`<form id="a3-stock-form">${a2Field('amount','增加库存（件）',100,'number')}${a2Field('note','补货说明','','text','',false)}</form>`,'保存',w=>{const f=w.querySelector('form'),n=Number(f.amount.value);if(!Number.isInteger(n)||n<1)return toast('补货数量请填正整数');db.growth.stocks[x.id]=a3Stock(x)+n;if(x.status==='已兑完'){x.status='已上架';x.adminExample=false;}a3Commit(x.name,'补货','增加'+n+'件；'+f.note.value)});
 }
 if(action==='order-cancel'){
  const o=a3Order(key);if(!o||o.status!=='待发货')return;
  return dialog('取消兑换',`<form id="a3-cancel-form"><p>取消后退还${o.points}积分，恢复${o.quantity}件库存，不再发货。</p><label class="field"><span>取消原因 <em>*</em></span><textarea name="reason" required rows="3" placeholder="用户可以看到"></textarea></label></form>`,'确认',w=>{const f=w.querySelector('form');if(!f.reportValidity())return;if(o.status!=='待发货')return toast('订单状态已变化');o.status='已取消';o.cancelReason=f.reason.value.trim();a3Refund(o,true);o.events.unshift([a3Now(),'兑换取消，积分已退还：'+o.cancelReason]);a3Commit(o.name,'取消',o.cancelReason)});
 }
 if(action.startsWith('rule-')){
  const r=a3Rule(key);if(!r)return;
  if(action==='rule-stop'&&r.status==='已启用')return a3Confirm('停用规则','<p>停用后不再发放该项新奖励，已发放积分保留。</p>',()=>{r.status='已停用';a3Commit(r.name,'停用','已发积分保留')});
  if(action==='rule-publish'){const next=r.draft||r;if(next.end<a3Date())return toast('规则已过期，请先编辑日期');return a3Confirm('发布积分规则',`<dl class="detail-grid">${a3Pair('规则',r.name)}${a3Pair('奖励',r.reward+' → '+next.reward+' 积分')}${a3Pair('有效时间',next.start+' 至 '+next.end)}${a3Pair('承担方',r.funder)}</dl><p class="a3-help">发布后小程序按新规则计奖，历史记录不追溯修改。</p>`,()=>{const old=r.reward;Object.assign(r,next,{status:'已启用',updated:a3Now()});delete r.draft;a3Commit(r.name,'发布',old+' → '+r.reward+' 积分')})}
 }
 if(action.startsWith('quiz-')){const q=a3Question(key);if(!q)return;const publish=action==='quiz-publish',remove=action==='quiz-delete';if(remove&&q.status!=='草稿')return;if(publish&&!['草稿','已下架'].includes(q.status))return;if(!publish&&!remove&&q.status!=='已发布')return;return a3Confirm(remove?'删除题目':publish?'发布题目':'下架题目',`<p>${esc(q.title)}<br>${publish?'发布后进入生活知识列表。':remove?'删除此草稿，其他题目不受影响。':'下架后不再接收新答题，已有积分记录保留。'}</p>`,()=>{if(remove)db.admin3.knowledge=db.admin3.knowledge.filter(x=>x.id!==q.id);else q.status=publish?'已发布':'已下架';a3Commit(q.title,remove?'删除':publish?'发布':'下架','生活知识','tasks')})}
 if(action==='invite-invalid'){
  const f=db.growth.invites.find(x=>x.id===key);if(!f||f.stage==='不计奖')return;
  return dialog('标为异常',`<form id="a3-invalid-form">${a2Select('reason','原因',['已有平台账号','重复参与','自邀或虚假账号','达到计奖上限','其他核实原因'],'重复参与')}<label class="field"><span>补充说明 <em>*</em></span><textarea name="note" required rows="3"></textarea></label><p class="a3-help">${f.reward?'已发'+f.reward+'积分将回收；余额不足部分登记待追回。':'停止该条记录的后续计奖。'}</p></form>`,'确认',w=>{const form=w.querySelector('form');if(!form.reportValidity()||f.stage==='不计奖')return;f.stage='不计奖';f.reason=form.reason.value+'：'+form.note.value.trim();if(f.reward&&!f.reclaimed){const owner=f.inviterName||db.user.name;const n=owner===db.user.name?Math.min(db.user.points,f.reward):f.reward;points(-n,'推荐奖励回收',f.name+'：'+f.reason,owner);f.reclaimed=true;f.pendingRecovery=f.reward-n;}a3Commit(f.name,'核实',f.reason)});
 }
 if(action==='export'){
  let rows,headers;
  if(key==='rewards'){headers=['礼品','分类','积分','库存','限兑','状态'];rows=a3Rows(key,db.admin3.goods,x=>x.name+' '+x.category).map(x=>[x.name,x.category,x.points,a3Stock(x),x.limit,x.status])}
  if(key==='exchanges'){headers=['礼品','收货人','手机号','数量','积分','时间','状态','快递','运单'];rows=a3Rows(key,db.growth.orders,x=>[x.name,x.address.name,x.address.phone,x.tracking||''].join(' ')).map(x=>[x.name,x.address.name,phoneMask(x.address.phone),x.quantity,x.points,x.date,x.status,x.carrier,x.tracking])}
  if(key==='invites'){headers=['被推荐人','手机号','来源','签到','答题','奖励','状态'];rows=a3Rows(key,db.growth.invites.map(x=>({...x,status:x.stage})),x=>x.name+' '+x.phone+' '+x.source).map(x=>[x.name,phoneMask(x.phone),x.source,x.signed?'完成':'未完成',x.answered?'完成':'未完成',x.reward,x.stage])}
  if(key==='ledger'){headers=['用户','事项','变动','余额','时间','备注'];rows=a3Rows(key,db.ledger,x=>x.name+' '+x.action+' '+x.note).map(x=>[x.name,x.action,x.change,x.balance,x.date,x.note])}
  return a2Download(a3Names[key],headers,rows);
 }
},true);
window.addEventListener('storage',()=>{try{db=JSON.parse(localStorage.getItem('anju-phase1-v1'))||db;adminRender()}catch{}});
document.addEventListener('DOMContentLoaded',()=>adminRender(),{once:true});
