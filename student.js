// ====================== STUDENT ======================
function rStudent(){
  showNav([{id:'home',ico:'🏠',label:t('home')},{id:'practice',ico:'📚',label:t('practice')},{id:'games',ico:'🕹️',label:t('games')},{id:'quiz',ico:'🎮',label:t('quiz')},{id:'profile',ico:'👤',label:t('profile'),badge:S.unread||0}]);
  if(S.tab==='home')rSHome();else if(S.tab==='practice')rSPractice();else if(S.tab==='games')rSGames();
  else if(S.tab==='quiz')rSQuizList();else if(S.tab==='profile')rSProfile();
  else if(S.view==='flashview')rSFlash();else if(S.view==='quizplay')rSQuizPlay();else if(S.view==='messages')rSMsg();else if(S.view==='badges')rSBadges()}

async function rSHome(){
  const sD=await db.collection('students').doc(S.uid).get();const sd=sD.data()||{};const xi=xpInfo(sd.xp||0);const streak=sd.streak||0;
  let h=`<div class="topbar"><div class="topbar-left"><div class="topbar-avatar" style="background:linear-gradient(135deg,var(--grn),var(--cyan))">${S.logo?'<img src="'+S.logo+'">':(S.uname||'S')[0]}</div>
  <div class="topbar-info"><div class="name">${S.uname} 👋</div><div class="greeting"><span class="tag tag-pur">${getCR(sd.classroomId)}</span></div></div></div>
  <div class="topbar-actions">${langSel()}</div></div>`;

  h+=`<div class="xp-bar"><div class="xp-top"><div class="xp-level">⭐ Lv.${xi.level} ${xi.name}</div><div class="xp-pts">${sd.xp||0} XP</div></div>
  <div class="xp-track"><div class="xp-fill" style="width:${xi.progress}%"></div></div></div>`;
  if(streak>0)h+=`<div class="streak"><span style="font-size:28px">🔥</span><div><div class="streak-num">${streak}</div><div class="streak-lbl">${t('days')} ${t('streak').toLowerCase()}</div></div></div>`;
  if(S.welcomeMsg)h+=`<div class="welcome">📝 ${S.welcomeMsg}</div>`;
  h+='<div id="wodArea"></div>';

  h+=`<div class="dash-grid">
    <div class="dash-card dc-green" onclick="S.tab='practice';R()"><div class="dc-icon">📚</div><div class="dc-title">${t('practice')}</div><div class="dc-sub">${t('cards')}</div></div>
    <div class="dash-card dc-purple" onclick="S.tab='games';R()"><div class="dc-icon">🕹️</div><div class="dc-title">${t('games')}</div><div class="dc-sub">Speed & Random</div></div>
    <div class="dash-card dc-blue" onclick="S.tab='quiz';R()"><div class="dc-icon">🎮</div><div class="dc-title">${t('quiz')}</div><div class="dc-sub">Test yourself</div></div>
    <div class="dash-card dc-orange" onclick="S.view='messages';R()"><div class="dc-icon">💬</div><div class="dc-title">${t('messages')}</div><div class="dc-sub">${S.unread?S.unread+' new':'Chat'}</div></div>
    <div class="dash-card dc-pink dc-wide" onclick="S.view='badges';R()"><div class="dc-icon">🏅</div><div class="dc-title">${t('badges')}</div><div class="dc-sub">${(sd.badges||[]).length}/${BADGES.length} earned</div></div>
  </div>`;app.innerHTML=h;loadSWod()}

async function loadSWod(){const today=new Date().toISOString().split('T')[0];
  const s=await db.collection('wordOfDay').where('teacherId','==',S.teacherId).where('date','==',today).get();
  const el=$('wodArea');if(!el||s.empty)return;const w=s.docs[0].data();
  el.innerHTML=`<div class="wod-card" onclick="revWod(this)"><div class="wod-lbl">✨ ${t('wordOfDay')}</div><div style="font-size:48px;margin:8px 0">👆</div>
  <div style="font-size:16px;font-weight:700">${t('tapMeWod')}</div>
  <div id="wH" style="display:none" data-a="${w.audioUrl||''}" data-i="${w.imageUrl||''}" data-g="${w.gurmukhi}" data-e="${w.english}"></div></div>`}
function revWod(el){const d=$('wH');if(!d)return;const au=d.dataset.a,im=d.dataset.i,g=d.dataset.g,e=d.dataset.e;
  if(au)playA(au);el.onclick=null;
  el.innerHTML=`<div class="wod-lbl">✨ ${t('wordOfDay')}</div>
  ${im?'<img class="wod-img" src="'+im+'">':''}<div class="wod-gur">${g}</div><div class="wod-eng">${e}</div>
  ${au?'<button class="audio-btn" onclick="event.stopPropagation();playA(\''+au+'\')" style="width:48px;height:48px;font-size:20px;margin-top:10px">🔊</button>':''}`}

// Student Practice
function rSPractice(){let h=`<div class="topbar"><div class="h2">📚 ${t('practice')}</div></div>
  <div class="help-tip"><span class="h-ico">💡</span><div>${t('helpPractice')}</div></div>`;
  if(!S.cats.length)h+='<div class="empty"><p>'+t('noContent')+'</p></div>';
  else{h+='<div class="card-grid">';S.cats.forEach(c=>{const colors=['#3B82F6','#8B5CF6','#2ECC71','#F59E0B','#EC4899','#06B6D4'];const ci=S.cats.indexOf(c);
    h+=`<div class="flash-card" onclick="stPrac('${c.id}','${esc(c.name)}')"><div style="width:100%;aspect-ratio:1;background:linear-gradient(135deg,${colors[ci%6]},${colors[(ci+1)%6]});display:flex;align-items:center;justify-content:center;font-size:40px">${c.emoji||'📚'}</div>
    <div class="fc-label"><div class="fc-gur">${c.gurmukhi||c.name}</div><div class="fc-eng">${c.name}</div></div></div>`});h+='</div>'}
  app.innerHTML=h}

async function stPrac(cid,cn){app.innerHTML='<div class="loading"><div class="loader"></div></div>';await ldCards(cid);if(!S.cards.length){toast(t('noContent'),'err');S.tab='practice';R();return}
  S.flashCards=shuf(S.cards);S.flashIdx=0;S.flashRev=false;S.view='flashview';S.pS=Date.now();S.pC=cn;S.pV=0;rSFlash()}

function rSFlash(){hideNav();const c=S.flashCards[S.flashIdx];if(!c){endP();return}
  let h=`<div class="flex justify-between items-center mb-14"><button class="back" style="margin:0" onclick="endP()">✕</button><div class="sub">${S.flashIdx+1}/${S.flashCards.length}</div></div>
  <div class="viewer">${c.imageUrl?'<img class="viewer-img" src="'+c.imageUrl+'">':'<div class="viewer-img" style="display:flex;align-items:center;justify-content:center;font-size:50px">🖼</div>'}
  <div class="viewer-body">`;
  if(S.flashRev){h+=`<div class="viewer-gur">${c.gurmukhi}</div><div class="viewer-eng">${c.english}</div>`;
    if(c.audioUrl)h+='<div style="margin-top:12px"><button class="audio-btn" onclick="playA(\''+c.audioUrl+'\')">🔊</button></div>';
    if(c.imageUrl2||c.imageUrl3){h+='<div class="extra-imgs">';if(c.imageUrl2)h+='<img src="'+c.imageUrl2+'">';if(c.imageUrl3)h+='<img src="'+c.imageUrl3+'">';h+='</div>'}}
  else h+='<div class="viewer-gur viewer-blur">ਅੱਖਰ</div>';
  h+='</div></div>';
  if(!S.flashRev)h+=`<button class="btn btn-p btn-w" onclick="S.flashRev=true;S.pV++;rSFlash()">👀 ${t('reveal')}</button>`;
  else{h+='<div class="flex gap-8">';if(S.flashIdx>0)h+=`<button class="btn btn-s flex-1" onclick="S.flashIdx--;S.flashRev=false;rSFlash()">← ${t('prev')}</button>`;
    h+=S.flashIdx<S.flashCards.length-1?`<button class="btn btn-p flex-1" onclick="S.flashIdx++;S.flashRev=false;rSFlash()">${t('next')} →</button>`:`<button class="btn btn-g flex-1" onclick="endP()">✅</button>`;h+='</div>'}
  app.innerHTML=h}
async function endP(){const tm=Math.round((Date.now()-S.pS)/1000);await recAct('practice',{categoryName:S.pC,cardsViewed:S.pV,timeSpent:tm});
  await addXP(S.uid,S.pV*5);await updStreak(S.uid);S.view='home';S.tab='home';await ldCats(S.teacherId);R()}

// Student Games
function rSGames(){let h=`<div class="topbar"><div class="h2">🕹️ ${t('games')}</div></div>
  <div class="help-tip"><span class="h-ico">💡</span><div>${t('helpGames')}</div></div>
  <button class="game-btn" style="background:linear-gradient(135deg,#8B5CF6,#3B82F6)" onclick="stSpd()">⚡ ${t('speedRound')}<span class="g-sub">60 sec challenge</span></button>
  <button class="game-btn" style="background:linear-gradient(135deg,#F59E0B,#EF4444)" onclick="startRW()">🎲 ${t('randomWord')}<span class="g-sub">Guess from picture</span></button>`;
  app.innerHTML=h}

// Random Word
let rndT=null;
async function startRW(){hideNav();app.innerHTML='<div class="loading"><div class="loader"></div></div>';await ldAC(S.teacherId);
  const wb=S.cards.filter(c=>c.imageUrl&&c.audioUrl);if(!wb.length){toast(t('noContent'),'err');S.tab='games';R();return}
  const c=wb[Math.floor(Math.random()*wb.length)];S.rndC=c;
  app.innerHTML=`<button class="back" onclick="clearInterval(rndT);S.tab='games';R()">← ${t('back')}</button>
  <div class="text-center"><div class="sub" style="letter-spacing:2px;margin-bottom:12px">🎲 ${t('randomWord').toUpperCase()}</div>
  <img src="${c.imageUrl}" style="width:200px;height:200px;border-radius:20px;object-fit:cover;border:3px solid rgba(245,166,35,.3)">
  <div id="rTA" style="margin-top:16px"><div style="position:relative;width:70px;height:70px;margin:0 auto">
    <svg width="70" height="70" style="transform:rotate(-90deg)"><circle cx="35" cy="35" r="30" fill="none" stroke="var(--card2)" stroke-width="5"/>
    <circle id="rC" cx="35" cy="35" r="30" fill="none" stroke="var(--saf)" stroke-width="5" stroke-dasharray="189" stroke-dashoffset="0" style="transition:stroke-dashoffset 1s linear"/></svg>
    <div id="rS" style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);font-size:22px;font-weight:900;color:var(--saf)">10</div></div></div>
  <div id="rRv" style="display:none;margin-top:16px">
    <button class="audio-btn" onclick="playA('${c.audioUrl}')" style="margin-bottom:10px">🔊</button>
    <div class="wod-gur">${c.gurmukhi}</div><div class="wod-eng">${c.english}</div>
    <div class="flex gap-8 mt-14" style="justify-content:center"><button class="btn btn-s" onclick="clearInterval(rndT);S.tab='games';R()">🏠</button>
    <button class="btn btn-p" onclick="clearInterval(rndT);startRW()">🎲 ${t('next')}</button></div></div></div>`;
  let sec=10;rndT=setInterval(()=>{sec--;const el=$('rS'),ci=$('rC');if(el)el.textContent=sec;if(ci)ci.style.strokeDashoffset=((10-sec)/10)*189;
    if(sec<=0){clearInterval(rndT);const ta=$('rTA'),rv=$('rRv');if(ta)ta.style.display='none';if(rv)rv.style.display='block';playA(S.rndC.audioUrl)}},1000)}

// Speed Round
let spdT=null,spdSec=60,spdScore=0,spdCards=[];
async function stSpd(){hideNav();app.innerHTML='<div class="loading"><div class="loader"></div></div>';await ldAC(S.teacherId);
  const wb=S.cards.filter(c=>c.imageUrl&&c.audioUrl);if(wb.length<4){toast('Need 4+','err');S.tab='games';R();return}
  spdCards=shuf(wb);spdSec=60;spdScore=0;rSpd();spdT=setInterval(()=>{spdSec--;const el=$('spdTime');if(el)el.textContent=spdSec;if(spdSec<=0){clearInterval(spdT);endSpd()}},1000)}
function rSpd(){if(spdCards.length<4){spdCards=shuf(S.cards.filter(c=>c.imageUrl&&c.audioUrl));if(spdCards.length<4){endSpd();return}}
  const pick=spdCards.splice(0,4);const cor=pick[Math.floor(Math.random()*4)];const sh=shuf(pick);
  app.innerHTML=`<div class="flex justify-between items-center mb-14"><button class="back" style="margin:0" onclick="clearInterval(spdT);S.tab='games';R()">✕</button>
  <div style="font-size:20px;font-weight:900;color:var(--red)" id="spdTime">${spdSec}</div>
  <div style="font-size:18px;font-weight:900;color:var(--saf)">⭐${spdScore}</div></div>
  <div class="text-center mb-14"><button class="audio-btn" onclick="playA('${cor.audioUrl}')">🔊</button></div>
  <div class="quiz-grid">${sh.map(c=>`<div class="quiz-opt" id="sp_${c.id}" onclick="spdAns('${c.id}','${cor.id}')"><img src="${c.imageUrl}"></div>`).join('')}</div>`;
  playA(cor.audioUrl)}
function spdAns(cid,corId){$('sp_'+cid).classList.add(cid===corId?'ok':'no');if(cid!==corId)$('sp_'+corId)?.classList.add('ok');
  if(cid===corId){spdScore++;flash('ok')}else flash('no');setTimeout(()=>{if(spdSec>0)rSpd();else endSpd()},500)}
async function endSpd(){clearInterval(spdT);await recAct('quiz_complete',{categoryName:'Speed',score:spdScore,total:spdScore+5,timeSpent:60});
  await addXP(S.uid,spdScore*10);await updStreak(S.uid);if(spdScore>=10)confetti();
  app.innerHTML=`<div class="text-center" style="padding:30px 0"><div style="font-size:64px">⚡</div><div style="font-size:48px;font-weight:900;color:var(--saf);margin:10px 0">${spdScore}</div>
  <div class="sub">+${spdScore*10} XP</div></div>
  <div class="flex gap-8"><button class="btn btn-s flex-1" onclick="S.tab='games';R()">🏠</button><button class="btn btn-p flex-1" onclick="stSpd()">🔄</button></div>`}

// Student Quiz
function rSQuizList(){let h=`<div class="topbar"><div class="h2">🎮 ${t('quiz')}</div></div>`;
  if(!S.cats.length)h+='<div class="empty"><p>'+t('noContent')+'</p></div>';
  else{h+='<div class="card-grid">';S.cats.forEach((c,i)=>{const colors=['#EF4444','#F59E0B','#2ECC71','#3B82F6','#8B5CF6','#EC4899'];
    h+=`<div class="flash-card" onclick="stQuiz('${c.id}','${esc(c.name)}')"><div style="width:100%;aspect-ratio:1;background:linear-gradient(135deg,${colors[i%6]+'99'},${colors[i%6]});display:flex;align-items:center;justify-content:center;font-size:40px">🎮</div>
    <div class="fc-label"><div class="fc-gur">${c.gurmukhi||c.name}</div><div class="fc-eng">${c.name}</div></div></div>`});h+='</div>'}
  app.innerHTML=h}

async function stQuiz(cid,cn){hideNav();app.innerHTML='<div class="loading"><div class="loader"></div></div>';
  const qgS=await db.collection('quizGroups').where('categoryId','==',cid).get();const groups=qgS.docs.map(d=>({id:d.id,...d.data()}));
  await ldCards(cid);if(S.cards.length<4){toast('Need 4+','err');S.tab='quiz';R();return}
  let rounds=[];for(const g of groups){const gc=g.cardIds.map(id=>S.cards.find(c=>c.id===id)).filter(Boolean);if(gc.length===4){const cor=gc[Math.floor(Math.random()*4)];rounds.push({cards:shuf(gc),cId:cor.id,aUrl:cor.audioUrl})}}
  let att=0;while(rounds.length<5&&att<50){att++;const pk=shuf(S.cards).slice(0,4);if(pk.length<4||!pk.every(c=>c.imageUrl))continue;const wa=pk.filter(c=>c.audioUrl);if(!wa.length)continue;
    const cor=wa[Math.floor(Math.random()*wa.length)];rounds.push({cards:shuf(pk),cId:cor.id,aUrl:cor.audioUrl})}
  if(!rounds.length){toast(t('noContent'),'err');S.tab='quiz';R();return}
  S.qCards=shuf(rounds);S.qIdx=0;S.qScore=0;S.qTotal=S.qCards.length;S.qStart=Date.now();S.qAns=false;S.qCat=cn;S.view='quizplay';rSQuizPlay()}

function rSQuizPlay(){if(S.qIdx>=S.qCards.length){showQR();return}const r=S.qCards[S.qIdx];
  app.innerHTML=`<div class="flex justify-between items-center mb-14"><button class="back" style="margin:0" onclick="S.view='home';S.tab='quiz';R()">✕</button>
  <div class="sub">${S.qIdx+1}/${S.qTotal}</div><div style="font-size:16px;font-weight:900;color:var(--saf)">⭐${S.qScore}</div></div>
  <div class="text-center mb-14"><div class="sub mb-8">${t('listenTap')}</div>
  <button class="audio-btn" onclick="playA('${r.aUrl}')">🔊</button></div>
  <div class="quiz-grid">${r.cards.map(c=>`<div class="quiz-opt" id="q_${c.id}" onclick="ansQ('${c.id}')"><img src="${c.imageUrl}"></div>`).join('')}</div>`}

function ansQ(cid){if(S.qAns)return;S.qAns=true;const r=S.qCards[S.qIdx],ok=cid===r.cId;
  $('q_'+cid).classList.add(ok?'ok':'no');if(!ok)$('q_'+r.cId)?.classList.add('ok');
  if(ok){S.qScore++;flash('ok')}else flash('no');playA(r.aUrl);
  const btn=document.createElement('button');btn.className='btn btn-p btn-w';btn.style.marginTop='14px';
  btn.textContent=S.qIdx<S.qTotal-1?t('next')+' →':'🎉';btn.onclick=()=>{S.qIdx++;S.qAns=false;S.qIdx>=S.qCards.length?showQR():rSQuizPlay()};app.querySelector('.quiz-grid').after(btn)}
function flash(ty){const o=document.createElement('div');o.className='flash-ov '+ty;o.innerHTML='<span>'+(ty==='ok'?'✅':'❌')+'</span>';document.body.appendChild(o);setTimeout(()=>o.remove(),500)}

async function showQR(){const tm=Math.round((Date.now()-S.qStart)/1000),pct=Math.round(S.qScore/S.qTotal*100);
  let em;if(pct>=90)em='🏆';else if(pct>=70)em='🌟';else if(pct>=50)em='💪';else em='📚';
  await recAct('quiz_complete',{categoryName:S.qCat,score:S.qScore,total:S.qTotal,timeSpent:tm});
  const xpE=S.qScore*15+(pct===100?50:0);await addXP(S.uid,xpE);await updStreak(S.uid);if(pct===100)confetti();await chkBadges(S.uid);
  app.innerHTML=`<div class="text-center" style="padding:30px 0"><div style="font-size:72px">${em}</div>
  <div style="font-size:48px;font-weight:900;color:var(--saf);margin:10px 0">${S.qScore}/${S.qTotal}</div>
  <div class="sub">${pct}% · +${xpE} XP</div></div>
  <div class="flex gap-8"><button class="btn btn-s flex-1" onclick="S.view='home';S.tab='home';R()">🏠</button>
  <button class="btn btn-p flex-1" onclick="stQuiz('${S.cards[0]?.categoryId}','${esc(S.qCat)}')">🔄</button></div>`}

// Student Badges
async function rSBadges(){hideNav();app.innerHTML='<div class="loading"><div class="loader"></div></div>';const earned=await chkBadges(S.uid);
  let h=`<button class="back" onclick="S.view='home';S.tab='home';R()">← ${t('back')}</button>
  <div class="panel"><div class="panel-title">🏅 ${t('badges')} (${earned.length}/${BADGES.length})</div>
  <div class="badge-grid">`;BADGES.forEach(b=>{h+=`<div class="badge ${earned.includes(b.id)?'earned':''}"><div class="b-ico">${b.ico}</div><div class="b-name">${b.name}</div></div>`});
  h+='</div></div>';app.innerHTML=h}

// Student Messages
async function rSMsg(){hideNav();app.innerHTML='<div class="loading"><div class="loader"></div></div>';
  await markRd(S.uid,'teacher');await markRd(S.uid,S.teacherId);await markRd(S.uid,'admin');S.unread=0;
  const m1=await getMsgs(S.uid,S.teacherId);const m2=await getMsgs(S.uid,'admin');const m3=await getMsgs(S.uid,'teacher');
  const msgs=[...m1,...m2,...m3].filter((m,i,a)=>a.findIndex(x=>x.id===m.id)===i);msgs.sort((a,b)=>a.timestamp-b.timestamp);
  let h=`<button class="back" onclick="S.view='home';S.tab='home';R()">← ${t('back')}</button><div class="panel"><div class="panel-title">💬 ${t('messages')}</div><div class="msg-list" id="mL">`;
  if(!msgs.length)h+='<div class="empty"><p>'+t('noMessages')+'</p></div>';
  else msgs.forEach(m=>{const s=m.fromId===S.uid;h+=`<div class="msg-bub ${s?'msg-sent':'msg-recv'}">${!s?'<div class="msg-name">'+m.fromName+'</div>':''}${m.text}<div class="msg-time">${fmt(m.timestamp)}</div></div>`});
  h+=`</div><div class="msg-compose"><input class="inp" id="mI" placeholder="..." onkeydown="if(event.key==='Enter')sndSM()"><button class="btn btn-p btn-sm" onclick="sndSM()">${t('send')}</button></div></div>`;
  app.innerHTML=h;const l=$('mL');if(l)l.scrollTop=l.scrollHeight}
async function sndSM(){const x=$('mI').value.trim();if(!x)return;$('mI').value='';await sendMsg(S.uid,S.uname,'student',S.teacherId,'Teacher',x);rSMsg()}

// Student Profile
async function rSProfile(){const sD=await db.collection('students').doc(S.uid).get();const sd=sD.data()||{};const xi=xpInfo(sd.xp||0);
  app.innerHTML=`<div class="topbar"><div class="h2">👤 ${t('profile')}</div></div>
  <div class="text-center mb-14"><div class="avatar av-grn" style="width:64px;height:64px;font-size:28px;border-radius:20px;margin:0 auto">${(S.uname||'S')[0]}</div>
  <div class="h2" style="margin-top:10px">${S.uname}</div><div class="sub"><span class="tag tag-pur">${getCR(sd.classroomId)}</span></div></div>
  <div class="xp-bar"><div class="xp-top"><div class="xp-level">⭐ Lv.${xi.level} ${xi.name}</div><div class="xp-pts">${sd.xp||0} XP</div></div>
  <div class="xp-track"><div class="xp-fill" style="width:${xi.progress}%"></div></div></div>
  <div class="score-bar"><div class="score-card"><div class="score-val" style="color:var(--saf)">🔥${sd.streak||0}</div><div class="score-lbl">${t('streak')}</div></div>
  <div class="score-card"><div class="score-val" style="color:var(--pur)">${(sd.badges||[]).length}</div><div class="score-lbl">${t('badges')}</div></div></div>
  <button class="btn btn-d btn-w" onclick="doLogout()">🚪 ${t('logout')}</button>`}

// ============ START APP (all files loaded) ============
init();
