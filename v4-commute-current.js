/* Commute search mirrors the current mini-program screenshots; it is not an operations referral feature. */
const v4CommuteCurrentDefaults={place:'光谷国际广场B座',mode:'drive',minutes:30};
const v4CommuteCurrentModes=[
 {id:'rail',label:'轨交',icon:'<rect x="5" y="3" width="14" height="15" rx="3"/><path d="M7 9h10M8 18l-2 3m10-3 2 3M9 14h.01M15 14h.01"/>'},
 {id:'bike',label:'骑行',icon:'<circle cx="5" cy="17" r="3"/><circle cx="19" cy="17" r="3"/><path d="m5 17 4-8 4 8h-8m8 0 3-7h3M9 9h4m-2-3h3"/>'},
 {id:'walk',label:'步行',icon:'<path d="M9 3c-2 0-3 2-3 4 0 2 1 4 2 5l1 7c.1 1.1 1 2 2 2s2-1 2-2l.5-6M16 4c2 0 3 2 3 4 0 2-1 4-2 5l-1 6c-.1 1.1-1 2-2 2-.6 0-1.1-.3-1.4-.7"/>'},
 {id:'drive',label:'驾车',icon:'<path d="m4 14 2-7c.3-1 1-2 2-2h8c1 0 1.7 1 2 2l2 7v5H4v-5Zm0 0h16M6 10h12M7 18h.01M17 18h.01"/>'}
];
const v4CommuteCurrentProjects=[
 {id:'guanggu',name:'安家乐寓·光谷广场店',area:'43.48㎡',address:'洪山区·卓刀泉街道安家乐寓·光谷广场店',price:1578,tags:['新房源','近地铁','精装修'],crop:[28,392,351,265]},
 {id:'wuchang',name:'安家乐寓·武昌火车站店',area:'30～52㎡',address:'武昌区·静安路29号安家乐寓·武昌火车站店',price:915,tags:[],crop:[28,680,351,265]},
 {id:'xiyuan',name:'安家乐寓·城投禧园店',area:'65㎡',address:'武昌区·首义路街道荆湘园城投·禧园',price:2200,tags:[],crop:[28,963,351,265]}
];
if(!db.v4.commutePrefs)db.v4.commutePrefs={...v4CommuteCurrentDefaults};
function v4CommuteCurrentPrefs(){
 const p=db.v4.commutePrefs;
 return {place:String(p.place||v4CommuteCurrentDefaults.place),mode:v4CommuteCurrentModes.some(x=>x.id===p.mode)?p.mode:'drive',minutes:[30,45,60].includes(Number(p.minutes))?Number(p.minutes):30};
}
function v4CommuteCurrentIcon(mode){
 const content=v4CommuteCurrentModes.find(x=>x.id===mode)?.icon||'';
 return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+content+'</svg>';
}
function v4CommuteCurrentForm(){
 const p=v4CommuteCurrentPrefs();
 return '<form class="v4-live-commute v4-live-commute-form" data-v4-form="live-commute">'+
  '<div class="v4-live-destination"><span class="v4-live-walker" aria-hidden="true">♙</span><strong>通勤找房</strong><input id="v4-live-place" name="place" value="'+esc(p.place)+'" aria-label="通勤目的地" placeholder="输入工作地或学校" required><button type="button" data-v4="commute-clear" aria-label="清空目的地">×</button><button type="button" data-v4="commute-location" aria-label="选择示例目的地">⌾</button></div>'+
  '<h2>交通方式</h2><div class="v4-live-modes">'+v4CommuteCurrentModes.map(x=>'<button type="button" data-v4="commute-mode" data-value="'+x.id+'" aria-pressed="'+(p.mode===x.id)+'" class="'+(p.mode===x.id?'active':'')+'">'+v4CommuteCurrentIcon(x.id)+'<span>'+x.label+'</span></button>').join('')+'</div>'+
  '<h2>通勤时间</h2><div class="v4-live-times">'+[[30,'30分钟内'],[45,'45分钟内'],[60,'1小时内']].map(x=>'<button type="button" data-v4="commute-time" data-value="'+x[0]+'" aria-pressed="'+(p.minutes===x[0])+'" class="'+(p.minutes===x[0]?'active':'')+'">'+x[1]+'</button>').join('')+'</div>'+
  '<button class="v4-live-search-button" type="submit">⌕　开始找房</button></form>';
}
function v4CommuteCurrentResults(){
 const p=v4CommuteCurrentPrefs(),mode=v4CommuteCurrentModes.find(x=>x.id===p.mode).label;
 const hasScreenshotResults=p.place==='光谷国际广场B座'&&p.mode==='drive'&&p.minutes===30;
 return '<section class="v4-live-commute v4-live-commute-results"><a class="v4-live-summary" href="#/commute"><span class="v4-live-summary-avatar" aria-hidden="true">●</span><span><b>♧ 通勤目的地： '+esc(p.place)+'</b><small>'+mode+'｜'+p.minutes+'分钟内</small></span><em>›</em></a><h2>找房检索结果</h2>'+
  (hasScreenshotResults?v4CommuteCurrentProjects.map(x=>'<a class="v4-live-result-card" href="#/commute-project/'+x.id+'">'+v4Crop('commute-results',x.crop,x.name+'项目外观')+'<div class="v4-live-result-info"><h3>'+esc(x.name)+'</h3><p>'+esc(x.area)+'</p><small>'+esc(x.address)+'</small>'+(x.tags.length?'<div class="v4-live-result-tags">'+x.tags.map(t=>'<span>'+t+'</span>').join('')+'</div>':'')+'<footer><b><small>¥</small>'+x.price.toLocaleString()+'<small>起/月</small></b><span>在售</span></footer></div></a>').join(''):'<div class="v4-live-empty"><h3>暂未展示这组条件的结果</h3><p>当前原型只收录了现有小程序截图中的一组通勤找房结果。</p><button data-v4="commute-example">查看截图中的结果</button></div>')+
  '</section>';
}
function v4CommuteCurrentProject(key){
 const p=v4CommuteCurrentProjects.find(x=>x.id===key);
 if(!p)return missing();
 return '<article class="v4-live-commute v4-live-project">'+v4Crop('commute-results',p.crop,p.name+'项目外观')+'<div class="v4-live-project-content"><h1>'+esc(p.name)+'</h1><p class="v4-live-project-price">¥'+p.price.toLocaleString()+'<small> 起/月</small></p><dl><dt>房型面积</dt><dd>'+esc(p.area)+'</dd><dt>项目位置</dt><dd>'+esc(p.address)+'</dd><dt>房源状态</dt><dd>在售（截图样例）</dd></dl><p>价格和在售状态来自现有小程序截图，请以项目页面及运营方最新信息为准。</p><a class="v4-live-project-back" href="#/commute-results">返回通勤找房结果</a></div></article>';
}
