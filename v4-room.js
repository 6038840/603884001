/* Detail layout adapted from the supplied current mini-program screenshots. */
const v4RoomAmenities=[
 ['bed','床'],['wardrobe','衣柜'],['fridge','冰箱'],['wifi','WIFI'],['lock','智能门锁'],
 ['washer','洗衣机'],['desk','书桌'],['mattress','床垫'],['lamp','床头柜'],['air','空调'],
 ['heater','热水器'],['fan','抽油烟机']
];
const v4RoomAmenityPaths={
 bed:'<path d="M3 19V9m18 10V9M3 15h18M6 9V6h12v3M6 9h12v6H6z"/>',
 wardrobe:'<rect x="5" y="3" width="14" height="18" rx="2"/><path d="M12 3v18M9 11v2m6-2v2"/>',
 fridge:'<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M7 11h10M14 7v2m0 5v2"/>',
 wifi:'<path d="M2 9c6-5 14-5 20 0M5 12c4-3 10-3 14 0m-11 3c2-2 6-2 8 0"/><circle cx="12" cy="19" r="1" fill="currentColor" stroke="none"/>',
 lock:'<rect x="5" y="10" width="14" height="11" rx="2"/><path d="M8 10V7a4 4 0 0 1 8 0v3m-4 4v3"/>',
 washer:'<rect x="4" y="3" width="16" height="18" rx="2"/><circle cx="12" cy="14" r="4"/><path d="M7 6h2m3 0h1"/>',
 desk:'<path d="M3 10h18v3H3zM5 13v8m14-8v8M5 17h14"/>',
 mattress:'<path d="M3 15c0-2 2-3 4-3h10c2 0 4 1 4 3v4H3zM5 12V8h5v4m4 0V8h5v4M3 19v2m18-2v2"/>',
 lamp:'<path d="M6 11h12l-2-7H8zm6 0v7m-4 3h8m-5-3h2"/>',
 air:'<rect x="2" y="4" width="20" height="8" rx="2"/><path d="M5 9h14M8 15v5m4-7v8m4-6v5"/>',
 heater:'<path d="M12 2c2 3 1 5 0 7 4-1 6 2 6 5a6 6 0 0 1-12 0c0-3 3-5 6-12Z"/>',
 fan:'<circle cx="12" cy="12" r="2"/><path d="M12 10c-2-2-2-7 0-8 3-1 4 4 2 8m0 2c3-1 8 1 8 4-1 3-6 2-8-2m-2 0c0 3-3 7-6 6-3-1-1-6 4-8"/>'
};
function v4AmenityIcon(name){return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${v4RoomAmenityPaths[name]}</svg>`}
function v4RoomScreenshot(file,crop,alt){const [x,y,w,h]=crop;return `<div class="v4-room-screen-crop" style="aspect-ratio:${w}/${h}"><img src="assets/${file}" alt="${esc(alt)}" style="width:${914/w*100}%;left:${-x/w*100}%;top:${-y/h*100}%"></div>`}
function v4RoomHero(r,inviteKey){
 const current=r.id==='r01';
 const image=current?v4RoomScreenshot('v4-room-live-r01.png',[0,142,914,574],'乐活单间A实际小程序房间图片，卫生间视角'):v4Photo(r);
 return `<section class="v4-room-hero ${current?'v4-room-hero-current':''}">${image}${!current?'<span class="v4-room-pk" aria-label="房源PK标识">PK</span>':''}${!inviteKey?`<a class="v4-room-hero-share" href="#/share/room/${r.id}" aria-label="推荐${esc(r.title)}给好友"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 16V3m0 0L7 8m5-5 5 5"/><path d="M5 13v5a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-5"/></svg><span>推荐好友</span></a>`:''}${!current?'<span class="v4-room-photo-count">1/1</span>':''}</section>`;
}
function v4RoomIntro(r){if(r.id==='r01')return `<section class="v4-room-section"><h2>项目介绍</h2><p>体验品质出租生活，尽享开放舒适空间，带给你温暖而明亮的城市节点。</p><details><summary>展开全文</summary><p>园博园店的具体入住条件、可租房型与费用，由项目运营方答复。</p></details></section>`;return `<section class="v4-room-section"><h2>项目介绍</h2><p>${esc(r.project)} · ${esc(r.address)}。想了解可租房型和交付情况，可向项目运营方咨询。</p></section>`}
function v4RoomAmenitiesBlock(r){if(r.id!=='r01')return '';return `<section class="v4-room-section"><h2>装修与配置</h2><div class="v4-amenities">${v4RoomAmenities.map(([id,label])=>`<div>${v4AmenityIcon(id)}<span>${label}</span></div>`).join('')}</div></section>`}
function v4RoomSurroundings(r){if(r.id!=='r01')return '';return `<section class="v4-room-section"><h2>周边配套</h2>${v4RoomScreenshot('v4-room-live-map.png',[79,987,756,363],'安家乐寓园博园店周边地图，来自现有小程序截图')}<div class="v4-room-near-tabs"><b>交通</b><span>生活</span><span>医疗</span><span>教育</span></div><ul class="v4-room-near-list">${[['古田二路园博园西门(公交站)','125m'],['城华路华润翡翠城(公交站)','201m'],['碧城路园博园南路(公交站)','227m'],['碧城路城华路(公交站)','325m'],['园博大道碧城路(公交站)','442m']].map(([name,distance])=>`<li><span>▣</span><b>${name}</b><small>直线 ${distance}</small></li>`).join('')}</ul><p class="v4-room-fineprint">地点与直线距离取自所提供的现有页面截图；实际步行路线请在地图中查看。</p></section>`}
const v4RoomProjectPhotos={r07:['v4-room-recs1.png',[79,1070,389,292]],r03:['v4-room-recs1.png',[79,1390,389,292]],r02:['v4-room-recs2.png',[79,1071,389,293]],r04:['v4-room-recs2.png',[79,1393,389,293]]};
function v4RoomRelated(r){const rows=['r07','r03','r02','r04'].filter(id=>id!==r.id).slice(0,3).map(id=>v4Rooms.find(x=>x.id===id));return `<section class="v4-room-section"><h2>看看其他房源</h2><div class="v4-room-related">${rows.map(x=>{const [file,crop]=v4RoomProjectPhotos[x.id];return `<a href="#/room/${x.id}">${v4RoomScreenshot(file,crop,x.project+'项目外观，来自现有小程序截图')}<div><b>${esc(x.title)}</b><small>${esc(x.project)} · ${x.area}㎡</small><strong>¥${x.price.toLocaleString()}<i>起/月</i></strong></div></a>`}).join('')}</div></section>`}
function v4RoomPage(r,inviteKey=''){
 const current=r.id==='r01',projectName=esc(r.project),note=current?'房型图片和价格参考现有小程序页面，房源状态、折扣和费用以运营方答复为准。':'图片、价格和房型来自现有小程序截图，实际可租房源和全部费用请向运营方确认。';
 const consult=inviteKey?`#/consult/room/${encodeURIComponent(inviteKey)}`:`#/consult/direct-room/${r.id}`;
 return `<div class="v4-room-page">${v4RoomHero(r,inviteKey)}<section class="v4-room-section v4-room-summary">${inviteKey?'<small class="v4-room-received">朋友分享给你的房源</small>':''}<div class="v4-room-heading"><h1>${esc(r.title)}</h1><span class="${r.status==='房源充足'?'enough':''}">${esc(r.status)}</span></div><div class="v4-room-money"><b>¥${r.price.toLocaleString()}</b><span>起/月</span><em>${current?'1室':'参考房型'}</em><em>${r.area}㎡</em></div>${current?'<div class="v4-room-utility"><span>民水</span><span>民电</span></div><p class="v4-room-reference">周边租金参考　<del>¥1,500/月</del><strong>约9折 · 月省¥200</strong></p>':''}<div class="v4-room-location"><b>${esc(r.address)} ${icon('pin')}</b><p>户型所在项目　<strong>${projectName}</strong>${r.projectId?` <a href="#/house/${r.projectId}" aria-label="查看${projectName}项目资料">›</a>`:''}</p></div><p class="v4-room-fineprint">${note}</p></section>
 ${v4RoomIntro(r)}${v4RoomAmenitiesBlock(r)}${v4RoomSurroundings(r)}<section class="v4-room-section"><h2>找房准备</h2><a class="v4-link-row" href="#/checklist/first">看房、签约与交接清单 <b>›</b></a>${r.projectId?`<a class="v4-link-row" href="#/house/${r.projectId}">项目公开资料 <b>›</b></a>`:''}${r.projectId==='maying2'?'<a class="v4-link-row" href="#/commute">从马鹦路出发的通勤方案 <b>›</b></a>':''}</section>${v4RoomRelated(r)}
 <div class="v4-room-toolbar"><button type="button" data-v4="save-room" data-id="${r.id}" aria-label="${db.v4.savedRooms.includes(r.id)?'取消收藏':'收藏房源'}">${icon('star')}<span data-v4-save-label>${db.v4.savedRooms.includes(r.id)?'已收藏':'收藏'}</span></button><a href="#/checklist/first">${icon('check')}<span>找房清单</span></a><a class="v4-room-consult" href="${consult}">${inviteKey?'咨询这套房':'咨询项目'}</a></div></div>`;
}
