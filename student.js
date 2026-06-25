// ====================== STUDENT ======================
// ====================== REUSABLE SETTINGS MODULE ======================
const GameSettings={
  store:{},
  // Initialize settings for a game
  init(gameName){if(!this.store[gameName])this.store[gameName]={categories:[],customCards:[]};return this.store[gameName]},
  // Get all categories available
  getAllCategories(){return S.cats||[]},
  // Get selected categories for a game
  getSelected(gameName){const gs=this.init(gameName);return gs.categories.length>0?gs.categories:this.getAllCategories()},
  // Toggle category selection
  toggleCategory(gameName,catId){const gs=this.init(gameName);const idx=gs.categories.indexOf(catId);
    if(idx>-1)gs.categories.splice(idx,1);else gs.categories.push(catId);this.save(gameName)},
  // Get filtered cards for a game (category + custom)
  async getGameCards(gameName){await ldAC(S.teacherId);const selected=this.getSelected(gameName);
    const catCards=S.cards.filter(c=>selected.includes(c.categoryId));
    const customCards=(this.store[gameName]?.customCards||[]).map((c,i)=>({id:'custom_'+i,categoryId:'custom',gurmukhi:c.gurmukhi,english:c.english,imageUrl:c.imageUrl,audioUrl:''}));
    return [...catCards,...customCards]},
  // Add custom card
  addCustomCard(gameName,card){const gs=this.init(gameName);gs.customCards.push(card);this.save(gameName)},
  // Remove custom card
  removeCustomCard(gameName,idx){const gs=this.init(gameName);gs.customCards.splice(idx,1);this.save(gameName)},
  // Save settings to localStorage
  save(gameName){try{localStorage.setItem('gameSettings_'+S.uid+'_'+gameName,JSON.stringify(this.store[gameName]))}catch(e){console.error('Save failed',e)}},
  // Load settings from localStorage
  load(gameName){try{const saved=localStorage.getItem('gameSettings_'+S.uid+'_'+gameName);if(saved)this.store[gameName]=JSON.parse(saved);else this.init(gameName)}catch(e){console.error('Load failed',e)}}};

// Render Settings Modal
async function showGameSettings(gameName){
  GameSettings.load(gameName);const gs=GameSettings.store[gameName];const allCats=GameSettings.getAllCategories();
  let h=`<div style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,.7);display:flex;align-items:center;justify-content:center;z-index:9999" onclick="if(event.target===this)closeSettingsModal()">
  <div style="background:var(--card);border-radius:20px;padding:20px;max-width:450px;width:90%;max-height:85vh;overflow-y:auto;box-shadow:0 10px 40px rgba(0,0,0,.3)">
    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:20px">
      <h2 style="margin:0;font-size:20px;font-weight:900;color:var(--txt)">⚙️ ${gameName} Settings</h2>
      <button onclick="closeSettingsModal()" style="border:none;background:none;font-size:24px;cursor:pointer">✕</button>
    </div>
    
    <div style="margin-bottom:20px">
      <div style="font-size:14px;font-weight:700;color:var(--txt2);margin-bottom:10px">📂 Category Cards</div>
      <div style="display:flex;flex-direction:column;gap:8px">`;
  allCats.forEach(cat=>{const checked=gs.categories.length===0||gs.categories.includes(cat.id);
    h+=`<label style="display:flex;align-items:center;gap:8px;cursor:pointer;padding:8px;border-radius:8px;background:var(--bg);font-size:14px">
      <input type="checkbox" ${checked?'checked':''} onchange="toggleGameCat('${gameName}','${cat.id}')" style="cursor:pointer">
      <span>${cat.emoji||'📂'}</span> <span>${cat.name}</span>
    </label>`});
  h+=`</div></div>
    
    <div style="margin-bottom:20px;border-top:1px solid var(--brd);padding-top:16px">
      <div style="font-size:14px;font-weight:700;color:var(--txt2);margin-bottom:10px">➕ Upload Custom Card</div>
      <div style="display:flex;flex-direction:column;gap:10px;background:var(--bg);padding:12px;border-radius:12px">
        <div>
          <div style="font-size:12px;color:var(--txt3);margin-bottom:4px">🖼️ Image</div>
          <input type="file" id="custImgInput" accept="image/*" style="width:100%;padding:6px;border-radius:8px;border:1px solid var(--brd);font-size:12px">
        </div>
        <div>
          <div style="font-size:12px;color:var(--txt3);margin-bottom:4px">ਗੁਰਮੁਖੀ (Gurmukhi)</div>
          <input type="text" id="custGurInput" placeholder="ਸ਼ਬਦ" style="width:100%;padding:8px;border-radius:8px;border:1px solid var(--brd);font-size:13px;color:var(--txt);background:var(--card)">
        </div>
        <div>
          <div style="font-size:12px;color:var(--txt3);margin-bottom:4px">English</div>
          <input type="text" id="custEngInput" placeholder="word" style="width:100%;padding:8px;border-radius:8px;border:1px solid var(--brd);font-size:13px;color:var(--txt);background:var(--card)">
        </div>
        <button onclick="addCustomCard('${gameName}')" class="btn btn-p btn-sm" style="width:100%">➕ Add Card</button>
      </div>
    </div>
    
    ${gs.customCards&&gs.customCards.length>0?`<div style="margin-bottom:20px;border-top:1px solid var(--brd);padding-top:16px">
      <div style="font-size:14px;font-weight:700;color:var(--txt2);margin-bottom:10px">📋 Your Custom Cards (${gs.customCards.length})</div>
      <div style="display:flex;flex-direction:column;gap:8px">
        ${gs.customCards.map((c,i)=>`<div style="display:flex;gap:8px;align-items:center;padding:8px;border-radius:8px;background:var(--bg)">
          ${c.imageUrl?`<img src="${c.imageUrl}" style="width:40px;height:40px;border-radius:6px;object-fit:cover">`:``}
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:700;color:var(--txt)">${c.gurmukhi}</div>
            <div style="font-size:11px;color:var(--txt3)">${c.english}</div>
          </div>
          <button onclick="delCustomCard('${gameName}',${i})" style="padding:4px 8px;border:none;background:var(--red);color:#fff;border-radius:6px;font-size:12px;cursor:pointer">✕</button>
        </div>`).join('')}
      </div>
    </div>`:''}
    
    <div style="display:flex;gap:8px;margin-top:20px">
      <button onclick="closeSettingsModal()" class="btn btn-s flex-1">Cancel</button>
      <button onclick="saveGameSettings('${gameName}')" class="btn btn-p flex-1">Save</button>
    </div>
  </div></div>`;
  app.innerHTML=h}

function toggleGameCat(gameName,catId){GameSettings.toggleCategory(gameName,catId)}
async function addCustomCard(gameName){
  const imgInput=document.getElementById('custImgInput');
  const gurInput=document.getElementById('custGurInput');
  const engInput=document.getElementById('custEngInput');
  
  const gur=gurInput.value.trim();
  const eng=engInput.value.trim();
  
  if(!gur||!eng){toast('Fill Gurmukhi and English','err');return}
  if(!imgInput.files[0]){toast('Select image','err');return}
  
  const reader=new FileReader();
  reader.onload=(e)=>{
    const imageUrl=e.target.result;
    const card={gurmukhi:gur,english:eng,imageUrl:imageUrl};
    GameSettings.addCustomCard(gameName,card);
    gurInput.value='';engInput.value='';imgInput.value='';
    toast('Card added!','ok');
    showGameSettings(gameName);
  };
  reader.readAsDataURL(imgInput.files[0]);
}
function delCustomCard(gameName,idx){GameSettings.removeCustomCard(gameName,idx);showGameSettings(gameName)}
function saveGameSettings(gameName){GameSettings.save(gameName);toast('Settings saved','ok');closeSettingsModal();rSGames()}
function closeSettingsModal(){S.tab='games';R()}

function rStudent(){
  showNav([{id:'home',ico:'🏠',label:t('home')},{id:'practice',ico:'📚',label:t('practice')},{id:'games',ico:'🕹️',label:t('games')},{id:'quiz',ico:'🎮',label:t('quiz')},{id:'profile',ico:'👤',label:t('profile'),badge:S.unread||0}]);
  if(S.tab==='home')rSHome();else if(S.tab==='practice')rSPractice();else if(S.tab==='games')rSGames();
  else if(S.tab==='quiz')rSQuizList();else if(S.tab==='profile')rSProfile();
  else if(S.view==='flashview')rSFlash();else if(S.view==='quizplay')rSQuizPlay();else if(S.view==='messages')rSMsg();else if(S.view==='badges')rSBadges();else if(S.view==='memgame')rMemBoard();else if(S.view==='spinwheel')rSpinWheel()}

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
function rSGames(){let h=`<div class="topbar"><div style="display:flex;justify-content:space-between;align-items:center;width:100%"><div class="h2">🕹️ ${t('games')}</div><button class="btn btn-s" onclick="showGameSettings('SpinWheel')" style="padding:6px 12px;font-size:12px;height:auto">⚙️ Settings</button></div></div>
  <div class="help-tip"><span class="h-ico">💡</span><div>${t('helpGames')}</div></div>
  <button class="game-btn" style="background:linear-gradient(135deg,#8B5CF6,#3B82F6)" onclick="stSpd()">⚡ ${t('speedRound')}<span class="g-sub">60 sec challenge</span></button>
  <button class="game-btn" style="background:linear-gradient(135deg,#F59E0B,#EF4444)" onclick="startRW()">🎲 ${t('randomWord')}<span class="g-sub">Guess from picture</span></button>
  <button class="game-btn" style="background:linear-gradient(135deg,#2ECC71,#06B6D4)" onclick="stMem()">🧠 ${t('memoryMatch')}<span class="g-sub">Flip & find pairs</span></button>
  <button class="game-btn" style="background:linear-gradient(135deg,#EC4899,#F59E0B)" onclick="stSpin()">🎡 ${t('spinWheel')}<span class="g-sub">Spin & guess the word</span></button>`;
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

// Memory Match Game
let memTiles=[],memFlipped=[],memMatched=0,memMoves=0,memLocked=false,memStart=0,memTotal=0,memTimer=null;
async function stMem(){hideNav();app.innerHTML='<div class="loading"><div class="loader"></div></div>';await ldAC(S.teacherId);
  const wb=S.cards.filter(c=>c.imageUrl);if(wb.length<6){toast('Need 6+ cards with images','err');S.tab='games';R();return}
  const pick=shuf(wb).slice(0,6);
  // Create pairs: each card becomes 2 tiles — one image tile, one gurmukhi tile
  let tiles=[];pick.forEach((c,i)=>{
    tiles.push({id:'img_'+i,pairId:i,type:'image',imageUrl:c.imageUrl,audioUrl:c.audioUrl||'',gurmukhi:c.gurmukhi,english:c.english});
    tiles.push({id:'txt_'+i,pairId:i,type:'text',imageUrl:c.imageUrl,audioUrl:c.audioUrl||'',gurmukhi:c.gurmukhi,english:c.english})});
  memTiles=shuf(tiles);memFlipped=[];memMatched=0;memMoves=0;memLocked=false;memTotal=pick.length;memStart=Date.now();
  S.view='memgame';rMemBoard();
  // Start timer
  if(memTimer)clearInterval(memTimer);memTimer=setInterval(()=>{const el=$('memTime');if(el)el.textContent=memTimeFmt()},1000)}

function memTimeFmt(){return Math.floor((Date.now()-memStart)/1000)+'s'}

function rMemBoard(){hideNav();
  let h=`<div class="flex justify-between items-center mb-14"><button class="back" style="margin:0" onclick="clearInterval(memTimer);S.view='home';S.tab='games';R()">✕</button>
  <div class="sub">🧠 ${t('memoryMatch')}</div>
  <div class="flex gap-8 items-center"><span class="sub2" id="memTime">${memTimeFmt()}</span><span style="font-size:14px;font-weight:800;color:var(--saf)">👆${memMoves}</span></div></div>
  <div class="mem-grid">`;
  memTiles.forEach((tile,i)=>{
    const isFlipped=memFlipped.includes(i);
    const isMatched=tile.matched;
    let cls='mem-tile';
    if(isFlipped||isMatched)cls+=' mem-flipped';
    if(isMatched)cls+=' mem-matched';
    h+=`<div class="${cls}" onclick="memFlip(${i})"><div class="mem-tile-inner">
      <div class="mem-face mem-back">❓</div>
      <div class="mem-face mem-front">${tile.type==='image'
        ?'<img src="'+tile.imageUrl+'" alt="">'
        :'<div class="mem-txt"><div class="mem-gur">'+tile.gurmukhi+'</div><div class="mem-eng">'+tile.english+'</div></div>'
      }</div></div></div>`});
  h+='</div>';
  // Progress dots
  h+='<div class="mem-progress">';
  for(let i=0;i<memTotal;i++){h+=`<div class="mem-dot ${i<memMatched?'mem-dot-done':''}"></div>`}
  h+='</div>';
  app.innerHTML=h}

function memFlip(i){
  if(memLocked)return;
  if(memFlipped.includes(i))return;
  if(memTiles[i].matched)return;
  memFlipped.push(i);
  // Flip animation
  const tiles=document.querySelectorAll('.mem-tile');
  if(tiles[i])tiles[i].classList.add('mem-flipped');
  // Play audio on flip if available
  if(memTiles[i].audioUrl&&memTiles[i].type==='text')playA(memTiles[i].audioUrl);
  if(memFlipped.length===2){
    memMoves++;
    const el=document.querySelector('[style*="color:var(--saf)"]');
    // Update moves counter
    const movesEl=app.querySelector('.flex.justify-between span[style]');
    memLocked=true;
    const a=memFlipped[0],b=memFlipped[1];
    if(memTiles[a].pairId===memTiles[b].pairId&&memTiles[a].type!==memTiles[b].type){
      // Match!
      memTiles[a].matched=true;memTiles[b].matched=true;memMatched++;
      setTimeout(()=>{
        if(tiles[a])tiles[a].classList.add('mem-matched');
        if(tiles[b])tiles[b].classList.add('mem-matched');
        flash('ok');
        if(memTiles[a].audioUrl)playA(memTiles[a].audioUrl);
        memFlipped=[];memLocked=false;
        // Update progress dots
        const dots=document.querySelectorAll('.mem-dot');
        dots.forEach((d,di)=>{if(di<memMatched)d.classList.add('mem-dot-done')});
        // Update moves display
        rMemUpdateHUD();
        if(memMatched===memTotal)setTimeout(endMem,600)},500)}
    else{
      // No match — flip back
      setTimeout(()=>{
        if(tiles[a])tiles[a].classList.remove('mem-flipped');
        if(tiles[b])tiles[b].classList.remove('mem-flipped');
        flash('no');
        memFlipped=[];memLocked=false;
        rMemUpdateHUD()},800)}}}

function rMemUpdateHUD(){const el=$('memTime');if(el)el.textContent=memTimeFmt();
  // Re-render just the moves count without full redraw
  const hud=app.querySelector('.flex.justify-between.items-center');
  if(hud){const sp=hud.querySelectorAll('span');if(sp.length>=2)sp[1].innerHTML='👆'+memMoves}}

async function endMem(){clearInterval(memTimer);memTimer=null;
  const tm=Math.round((Date.now()-memStart)/1000);
  const perfect=memMoves===memTotal;const stars=memMoves<=memTotal+2?3:memMoves<=memTotal+5?2:1;
  const xpE=memTotal*10+(perfect?50:0)+(stars===3?30:stars===2?15:0);
  await recAct('quiz_complete',{categoryName:'Memory Match',score:memTotal,total:memTotal,timeSpent:tm});
  await addXP(S.uid,xpE);await updStreak(S.uid);if(perfect)confetti();await chkBadges(S.uid);
  const starH='⭐'.repeat(stars)+'<span style="opacity:.2">'+'⭐'.repeat(3-stars)+'</span>';
  app.innerHTML=`<div class="text-center" style="padding:30px 0"><div style="font-size:72px">🧠</div>
  <div style="font-size:36px;margin:10px 0">${starH}</div>
  <div style="font-size:14px;font-weight:700;color:var(--txt2);margin-bottom:4px">${memMatched}/${memTotal} pairs · ${memMoves} moves · ${tm}s</div>
  <div class="sub">+${xpE} XP${perfect?' · PERFECT! 🎉':''}</div></div>
  <div class="flex gap-8"><button class="btn btn-s flex-1" onclick="S.view='home';S.tab='games';R()">🏠</button><button class="btn btn-p flex-1" onclick="stMem()">🔄 Again</button></div>`}

// Spin the Wheel Game
let spinCards=[],spinRound=0,spinTotal=5,spinScore=0,spinStart=0,spinBusy=false,spinCurIdx=-1;

async function stSpin(){hideNav();app.innerHTML='<div class="loading"><div class="loader"></div></div>';
  GameSettings.load('SpinWheel');const cards=await GameSettings.getGameCards('SpinWheel');
  const wb=cards.filter(c=>c.gurmukhi&&c.english);if(wb.length<6){toast('Need 6+ cards','err');S.tab='games';R();return}
  spinCards=shuf(wb).slice(0,6);spinRound=0;spinScore=0;spinStart=Date.now();spinBusy=false;spinCurIdx=-1;
  S.view='spinwheel';rSpinWheel()}

function rSpinWheel(){hideNav();
  const seg=spinCards.length;const segAngle=360/seg;
  // Build card positions around wheel - will rotate together
  let cardHTML='';const radius=110;const cx=130,cy=130;
  spinCards.forEach((c,i)=>{
    const angle=(i*segAngle+segAngle/2)*Math.PI/180;
    const x=cx+radius*Math.sin(angle);
    const y=cy-radius*Math.cos(angle);
    const rot=i*segAngle+segAngle/2;
    cardHTML+=`<div style="position:absolute;left:${x-20}px;top:${y-20}px;width:40px;height:40px;border-radius:8px;background:var(--card2);border:2px solid var(--saf);overflow:hidden;display:flex;align-items:center;justify-content:center;z-index:2;transform-origin:${130-x}px ${130-y}px">
      ${c.imageUrl?`<img src="${c.imageUrl}" style="width:100%;height:100%;object-fit:cover">`:`<div style="font-size:20px">📚</div>`}
    </div>`});

  let h=`<div class="flex justify-between items-center mb-14"><button class="back" style="margin:0" onclick="S.view='home';S.tab='games';R()">✕</button>
  <div class="sub">🎡 ${t('spinWheel')} · ${spinRound}/${spinTotal}</div>
  <div style="font-size:16px;font-weight:800;color:var(--saf)">⭐${spinScore}</div></div>
  <div class="spin-stage" style="position:relative;width:280px;height:280px;margin:0 auto 30px">
    <div class="spin-pointer">▼</div>
    <div id="spinW" style="width:260px;height:260px;border-radius:50%;position:absolute;top:10px;left:10px;border:4px solid var(--saf);background:conic-gradient(
      ${spinCards.map((c,i)=>{const angle=i*360/seg;return`from ${angle}deg, var(--card3) 0deg ${angle+360/seg}deg`}).join(',')}
    );transform:rotate(0deg);transition:none;will-change:transform">
      <div style="position:absolute;top:50%;left:50%;transform:translate(-50%,-50%);width:50px;height:50px;border-radius:50%;background:var(--bg);border:3px solid var(--saf);display:flex;align-items:center;justify-content:center;font-size:24px;z-index:5">🎡</div>
      ${cardHTML}
    </div>
  </div>`;
  if(!spinBusy){h+=`<button class="btn btn-p btn-w spin-go" id="spinBtn" onclick="doSpin()" style="margin-top:20px">🎡 SPIN!</button>`}
  app.innerHTML=h}

function doSpin(){
  if(spinBusy)return;spinBusy=true;
  const btn=$('spinBtn');if(btn)btn.style.display='none';
  const seg=spinCards.length,segAngle=360/seg;
  spinCurIdx=Math.floor(Math.random()*seg);
  // Rotate so selected card lands at TOP (angle 0)
  const cardAngle=spinCurIdx*segAngle+segAngle/2;
  const fullTurns=5+Math.floor(Math.random()*3);
  const totalDeg=fullTurns*360+(360-cardAngle);
  const wheel=$('spinW');
  if(wheel){
    wheel.style.transition='none';
    wheel.style.transform='rotate(0deg)';
    setTimeout(()=>{
      wheel.style.transition='transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)';
      wheel.style.transform='rotate('+totalDeg+'deg)';
    },10);
  }
  setTimeout(()=>{showSpinCard(spinCards[spinCurIdx])},4200)}

function showSpinCard(card){
  spinScore++;
  let h=`<div class="flex justify-between items-center mb-14"><button class="back" style="margin:0" onclick="nextSpinRound()">✕</button>
  <div class="sub">🎡 ${t('spinWheel')} · ${spinRound+1}/${spinTotal}</div>
  <div style="font-size:16px;font-weight:800;color:var(--saf)">⭐${spinScore}</div></div>
  <div style="text-align:center;padding:40px 20px;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:70vh">
    ${card.imageUrl?`<img src="${card.imageUrl}" style="width:200px;height:200px;border-radius:20px;object-fit:cover;border:6px solid var(--pur);box-shadow:0 0 30px rgba(139,92,246,.5);margin-bottom:20px;animation:zoomIn .6s ease-out">`:''}
    <div style="font-size:56px;font-weight:900;color:var(--pur);margin-bottom:10px;letter-spacing:2px;animation:slideDown .6s ease-out">${card.gurmukhi}</div>
    <div style="font-size:18px;color:var(--txt2);margin-top:20px">${card.english}</div>
  </div>
  <div class="flex gap-8" style="padding:0 20px 20px">
    <button class="btn btn-p btn-w" onclick="nextSpinRound()">Next Round →</button>
  </div>`;
  app.innerHTML=h;
  // Fall stars
  fallStars()}

function nextSpinRound(){
  spinRound++;
  if(spinRound>=spinTotal){endSpinGame();return}
  spinBusy=false;
  rSpinWheel()}

async function endSpinGame(){
  const tm=Math.round((Date.now()-spinStart)/1000);
  const xpE=spinScore*15;
  await recAct('quiz_complete',{categoryName:'Spin Wheel',score:spinScore,total:spinTotal,timeSpent:tm});
  await addXP(S.uid,xpE);await updStreak(S.uid);
  if(spinScore===spinTotal)confetti();await chkBadges(S.uid);
  app.innerHTML=`<div class="text-center" style="padding:40px 20px">
    <div style="font-size:72px;margin-bottom:20px">🎡</div>
    <div style="font-size:48px;font-weight:900;color:var(--saf);margin-bottom:10px">${spinScore}/${spinTotal}</div>
    <div class="sub" style="margin-bottom:20px">+${xpE} XP</div>
    ${spinScore===spinTotal?'<div style="font-size:24px;margin-bottom:20px">⭐⭐⭐ PERFECT! ⭐⭐⭐</div>':''}
    <div class="flex gap-8"><button class="btn btn-s flex-1" onclick="S.view='home';S.tab='games';R()">🏠</button><button class="btn btn-p flex-1" onclick="stSpin()">🔄 Again</button></div>
  </div>`}

function fallStars(){
  for(let i=0;i<30;i++){
    const s=document.createElement('div');
    s.innerHTML='⭐';
    s.style.position='fixed';
    s.style.left=Math.random()*100+'%';
    s.style.top='-30px';
    s.style.fontSize='24px';
    s.style.pointerEvents='none';
    s.style.animation=`fall ${1+Math.random()*1.5}s linear forwards`;
    s.style.zIndex='9000';
    document.body.appendChild(s);
    setTimeout(()=>s.remove(),3000);
  }
}

// Add CSS animation for falling stars
if(!document.getElementById('spinAnimStyle')){
  const style=document.createElement('style');
  style.id='spinAnimStyle';
  style.innerHTML=`
    @keyframes fall{0%{opacity:1;transform:translateY(0) rotate(0deg)}100%{opacity:0;transform:translateY(100vh) rotate(360deg)}}
    @keyframes zoomIn{0%{transform:scale(0.5);opacity:0}100%{transform:scale(1);opacity:1}}
    @keyframes slideDown{0%{transform:translateY(-30px);opacity:0}100%{transform:translateY(0);opacity:1}}
  `;
  document.head.appendChild(style);
}

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

// ====================== PARENT DASHBOARD ======================
function rParent(){
  showNav([{id:'home',ico:'🏠',label:t('home')},{id:'attendance',ico:'📋',label:t('attendance')},{id:'messages',ico:'💬',label:t('messages')},{id:'progress',ico:'📈',label:t('progress')}]);
  if(S.tab==='home')rPHome();else if(S.tab==='attendance')rPAtt();else if(S.tab==='messages')rPMsg();else if(S.tab==='progress')rPProgress();else rPHome()}

async function rPHome(){
  // Refresh child data
  try{const d=await db.collection('students').doc(S.pChildId).get();if(d.exists)S.pChild=d.data()}catch(e){}
  const c=S.pChild;if(!c){app.innerHTML='<div class="empty"><p>No child data</p></div>';return}
  const xi=xpInfo(c.xp||0);
  const daysSincePractice=c.lastPracticeDate?Math.floor((Date.now()-new Date(c.lastPracticeDate+'T12:00:00').getTime())/(86400000)):999;
  let h=`<div class="topbar"><div class="topbar-left"><div class="topbar-avatar" style="background:linear-gradient(135deg,var(--warn),var(--saf))">${S.logo?'<img src="'+S.logo+'">':(c.name||'C')[0]}</div>
  <div class="topbar-info"><div class="name">👪 ${S.uname}</div><div class="greeting">${c.name}'s parent</div></div></div>
  <div class="topbar-actions">${langSel()}<button class="btn btn-s btn-sm" onclick="doLogout()">🚪 ${t('logout')}</button></div></div>`;
  // Practice nudge
  if(daysSincePractice>2&&daysSincePractice<999){h+=`<div class="panel" style="border:1.5px solid var(--warn);background:rgba(245,158,11,.05)"><div class="flex items-center gap-8"><span style="font-size:20px">💡</span><div class="h3" style="color:var(--warn)">${c.name} hasn't practiced in ${daysSincePractice} days</div></div><p class="sub2" style="margin-top:4px">Encourage them to open the app and practice!</p></div>`}
  // Child card
  h+=`<div class="panel"><div style="text-align:center"><div class="avatar av-grn" style="width:56px;height:56px;font-size:24px;border-radius:18px;margin:0 auto">${(c.name||'C')[0]}</div>
  <div class="h2" style="margin-top:8px">${c.name}</div>
  <div class="sub">Level ${xi.level} · ${xi.name}</div></div>
  <div class="xp-bar" style="margin-top:12px"><div class="xp-fill" style="width:${xi.progress}%"></div></div>
  <div class="sub2" style="text-align:center;margin-top:4px">${c.xp||0} / ${xi.needed} XP</div></div>`;
  // Stats
  h+=`<div class="score-bar"><div class="score-card"><div class="score-val" style="color:var(--saf)">${xi.level}</div><div class="score-lbl">${t('level')}</div></div>
  <div class="score-card"><div class="score-val" style="color:var(--warn)">🔥${c.streak||0}</div><div class="score-lbl">${t('streak')}</div></div>
  <div class="score-card"><div class="score-val" style="color:var(--pur)">${(c.badges||[]).length}</div><div class="score-lbl">${t('badges')}</div></div></div>`;
  // Badges
  if((c.badges||[]).length){h+=`<div class="panel"><div class="panel-title">🏅 ${t('badges')}</div><div class="flex gap-8" style="flex-wrap:wrap">`;
    (c.badges||[]).forEach(bid=>{const b=BADGES.find(x=>x.id===bid);if(b)h+=`<div style="text-align:center;padding:8px"><div style="font-size:28px">${b.ico}</div><div class="sub2">${b.name}</div></div>`});h+='</div></div>'}
  // Word of the day
  h+=`<div id="pWod"></div>`;
  // Quick actions
  h+=`<div class="dash-grid">
  <div class="dash-card dc-cyan" onclick="S.tab='attendance';R()"><div class="dc-icon">📋</div><div class="dc-title">${t('attendance')}</div><div class="dc-sub">View & report</div></div>
  <div class="dash-card dc-orange" onclick="S.tab='messages';R()"><div class="dc-icon">💬</div><div class="dc-title">${t('messages')}</div><div class="dc-sub">Teacher & school</div></div></div>`;
  app.innerHTML=h;
  // Load WoD
  setTimeout(async()=>{try{const today=new Date().toISOString().split('T')[0];
    const ws=await db.collection('wordOfDay').where('teacherId','==',S.pTeacherId).where('date','==',today).get();
    const el=$('pWod');if(!el||ws.empty)return;const w=ws.docs[0].data();
    el.innerHTML=`<div class="panel"><div class="panel-title">✨ ${t('wordOfDay')}</div>
    <div style="text-align:center;padding:12px 0">${w.imageUrl?'<img src="'+w.imageUrl+'" style="width:80px;height:80px;border-radius:12px;object-fit:cover;margin-bottom:8px">':''}
    <div style="font-size:28px;font-weight:900">${w.gurmukhi}</div><div class="sub" style="margin-top:4px">${w.english}</div>
    ${w.audioUrl?'<button class="btn btn-s btn-sm" style="margin-top:8px" onclick="playA(\''+w.audioUrl+'\')">🔊 Listen</button>':''}</div></div>`}catch(e){}},100)}

// ============ PARENT ATTENDANCE ============
async function rPAtt(){
  const today=new Date().toISOString().split('T')[0];
  const c=S.pChild;
  let h=`<div class="topbar"><div class="h2">📋 ${t('attendance')}</div></div>`;
  // Report absence button
  h+=`<div class="panel" style="background:linear-gradient(135deg,rgba(245,158,11,.08),rgba(236,72,153,.08));border:1px solid rgba(245,158,11,.2)">
  <div class="panel-title">📝 ${t('reportAbsence')}</div>
  <div class="fld"><label class="lbl">Date</label><input class="inp" id="abDate" type="date" value="${today}"></div>
  <div class="fld"><label class="lbl">${t('reason')}</label><select class="inp" id="abReason">
  <option value="sick">🤒 ${t('sick')}</option><option value="not-coming">🚫 Not Coming</option><option value="family">👨‍👩‍👦 ${t('family')}</option><option value="appointment">🏥 ${t('appointment')}</option><option value="vacation">✈️ Vacation</option><option value="other">📋 ${t('other')}</option></select></div>
  <div class="fld"><label class="lbl">Note (optional)</label><input class="inp" id="abNote" placeholder="e.g. not coming next Friday..."></div>
  <button class="btn btn-p btn-w" onclick="submitAbsence()">📝 Submit</button></div>`;
  // This month's attendance
  h+=`<div class="panel"><div class="panel-title">📊 This Month</div><div id="pAttBody"><div class="loading"><div class="loader"></div></div></div></div>`;
  // Recent absence reports
  h+=`<div class="panel"><div class="panel-title">📝 My Reports</div><div id="pAbsBody"><div class="loading"><div class="loader"></div></div></div></div>`;
  app.innerHTML=h;
  setTimeout(loadPAtt,100);setTimeout(loadPAbsReports,200)}

async function submitAbsence(){
  const date=$('abDate').value,reason=$('abReason').value,note=$('abNote').value.trim();
  if(!date)return toast('Select date','err');
  // Check if already reported
  const ex=await db.collection('absenceReports').where('studentId','==',S.pChildId).where('date','==',date).get();
  if(!ex.empty)return toast('Already reported for this date','err');
  await db.collection('absenceReports').add({studentId:S.pChildId,studentName:S.pChild.name,parentId:S.uid,parentName:S.uname,teacherId:S.pTeacherId,orgId:S.orgId,date,reason,note,timestamp:Date.now()});
  toast('Absence reported ✅');rPAtt()}

async function loadPAtt(){const el=$('pAttBody');if(!el)return;
  const now=new Date();const month=now.toISOString().substring(0,7);
  try{const snap=await db.collection('attendance').where('teacherId','==',S.pTeacherId).where('date','>=',month+'-01').where('date','<=',month+'-31').get();
    if(snap.empty){el.innerHTML='<p class="sub2">No attendance data this month</p>';return}
    let present=0,absent=0,total=0;
    snap.docs.forEach(d=>{const rec=(d.data().records||[]).find(r=>r.studentId===S.pChildId);if(rec){total++;if(rec.status==='present')present++;if(rec.status==='absent')absent++}});
    const rate=total?Math.round(present/total*100):0;const color=rate>=80?'var(--grn)':rate>=60?'var(--warn)':'var(--red)';
    el.innerHTML=`<div class="score-bar"><div class="score-card"><div class="score-val" style="color:var(--grn)">${present}</div><div class="score-lbl">${t('present')}</div></div>
    <div class="score-card"><div class="score-val" style="color:var(--red)">${absent}</div><div class="score-lbl">${t('absent')}</div></div>
    <div class="score-card"><div class="score-val" style="color:${color}">${rate}%</div><div class="score-lbl">Rate</div></div></div>
    <div class="att-stat-bar" style="margin-top:8px"><div class="att-fill" style="width:${rate}%;background:${color}"></div></div>`}
  catch(e){el.innerHTML='<p class="sub2">Could not load</p>'}}

async function loadPAbsReports(){const el=$('pAbsBody');if(!el)return;
  try{const snap=await db.collection('absenceReports').where('studentId','==',S.pChildId).get();
    const reports=snap.docs.map(d=>({id:d.id,...d.data()}));reports.sort((a,b)=>b.timestamp-a.timestamp);
    if(!reports.length){el.innerHTML='<p class="sub2">No reports</p>';return}
    let h='';reports.slice(0,10).forEach(r=>{const reasons={sick:'🤒 Sick','not-coming':'🚫 Not Coming',family:'👨‍👩‍👦 Family',appointment:'🏥 Appointment',vacation:'✈️ Vacation',other:'📋 Other'};
      h+=`<div style="padding:8px 0;border-bottom:1px solid var(--brd);font-size:13px"><div class="flex justify-between"><b>${r.date}</b><span>${reasons[r.reason]||r.reason}</span></div>${r.note?'<div class="sub2">'+r.note+'</div>':''}</div>`});
    el.innerHTML=h}catch(e){el.innerHTML='<p class="sub2">Could not load</p>'}}

// ============ PARENT MESSAGES ============
async function rPMsg(){
  // Count unread per contact
  const allUnrd=await db.collection('messages').where('toId','==',S.uid).where('read','==',false).get();
  const unrdMap={};allUnrd.docs.forEach(d=>{const fid=d.data().fromId;unrdMap[fid]=(unrdMap[fid]||0)+1});
  let h=`<div class="topbar"><div class="h2">💬 ${t('messages')}</div></div>`;
  const tU=unrdMap[S.pTeacherId]||0;const aU=unrdMap['admin']||0;
  // Teacher chat
  h+=`<div class="list-item clickable" onclick="pChat('${S.pTeacherId}','${esc(S.pTeacherName)}','teacher')">
  <div class="avatar av-blu">👩‍🏫</div><div class="flex-1"><div class="h3">${S.pTeacherName||'Teacher'}${tU?'<span class="unread-badge">'+tU+'</span>':''}</div><div class="sub2">${S.pChild?.name}'s teacher</div></div></div>`;
  // School admin chat
  h+=`<div class="list-item clickable" onclick="pChat('admin','School Admin','admin')">
  <div class="avatar av-pur">🛡️</div><div class="flex-1"><div class="h3">School Admin${aU?'<span class="unread-badge">'+aU+'</span>':''}</div><div class="sub2">School administration</div></div></div>`;
  // Show all messages timeline
  h+=`<div class="sec-title" style="margin-top:14px">📨 Recent</div><div id="pMsgList"><div class="loading"><div class="loader"></div></div></div>`;
  app.innerHTML=h;setTimeout(loadPMsgTimeline,100)}

async function loadPMsgTimeline(){const el=$('pMsgList');if(!el)return;
  try{const s1=await db.collection('messages').where('toId','==',S.uid).get();
    const s2=await db.collection('messages').where('fromId','==',S.uid).get();
    const all=[...s1.docs.map(d=>({id:d.id,...d.data()})),...s2.docs.map(d=>({id:d.id,...d.data()}))];
    all.sort((a,b)=>b.timestamp-a.timestamp);
    const unique={};all.forEach(m=>{const other=m.fromId===S.uid?m.toId:m.fromId;if(!unique[other])unique[other]=m});
    const recent=Object.values(unique).slice(0,10);
    if(!recent.length){el.innerHTML='<div class="empty"><p>'+t('noMessages')+'</p></div>';return}
    let h='';recent.forEach(m=>{const sent=m.fromId===S.uid;const name=sent?m.toName:m.fromName;const preview=m.text.length>50?m.text.substring(0,50)+'...':m.text;
      const tagHtml=m.tag&&m.tag!=='general'?'<span class="tag tag-org" style="font-size:9px;margin-left:4px">'+m.tag+'</span>':'';
      const unreadDot=!sent&&!m.read?'<span style="width:8px;height:8px;border-radius:50%;background:var(--blu);display:inline-block;margin-left:4px"></span>':'';
      h+=`<div class="list-item" style="cursor:pointer" onclick="pChat('${m.fromId===S.uid?m.toId:m.fromId}','${esc(name)}')">
      <div class="flex-1"><div class="h3">${name} ${tagHtml}${unreadDot}</div><div class="sub2">${sent?'You: ':''}${preview} · ${tSince(m.timestamp)}</div></div></div>`});
    el.innerHTML=h}catch(e){el.innerHTML='<p class="sub2">Could not load</p>'}}

async function pChat(otherId,otherName){
  app.innerHTML='<div class="loading"><div class="loader"></div></div>';
  await markRd(S.uid,otherId);const msgs=await getMsgs(S.uid,otherId);
  let h=`<button class="back" onclick="S.tab='messages';R()">← ${t('back')}</button>
  <div class="panel"><div class="panel-title">💬 ${otherName}</div><div class="msg-list" id="mL">`;
  if(!msgs.length)h+='<div class="empty"><p>'+t('noMessages')+'</p></div>';
  else msgs.forEach(m=>{const s=m.fromId===S.uid;h+=`<div class="msg-bub ${s?'msg-sent':'msg-recv'} ${s&&m.read?'msg-read':''}">${!s?'<div class="msg-name">'+m.fromName+'</div>':''}${m.text}${m.tag&&m.tag!=='general'?'<span class="tag tag-org" style="margin-left:6px;font-size:9px">'+m.tag+'</span>':''}
  <div class="msg-time">${fmt(m.timestamp)}${s?(m.read?' ✅':' ◻️'):''}</div></div>`});
  h+=`</div><div class="msg-compose"><input class="inp" id="mI" placeholder="Type a message..." onkeydown="if(event.key==='Enter')sndParentMsg('${otherId}','${esc(otherName)}')">
  <button class="btn btn-p btn-sm" onclick="sndParentMsg('${otherId}','${esc(otherName)}')">${t('send')}</button></div></div>`;
  app.innerHTML=h;const l=$('mL');if(l)l.scrollTop=l.scrollHeight}
async function sndParentMsg(otherId,otherName){const x=$('mI').value.trim();if(!x)return;$('mI').value='';
  await sendMsg(S.uid,S.uname,'parent',otherId,otherName,x);pChat(otherId,otherName)}

// ============ PARENT PROGRESS ============
async function rPProgress(){
  app.innerHTML='<div class="loading"><div class="loader"></div><p>Loading progress...</p></div>';
  try{const c=S.pChild;
    // Get activity history
    const aSnap=await db.collection('activity').where('studentId','==',S.pChildId).get();
    const acts=aSnap.docs.map(d=>d.data());acts.sort((a,b)=>b.timestamp-a.timestamp);
    const qz=acts.filter(a=>a.type==='quiz_complete');
    const prac=acts.filter(a=>a.type==='practice');
    const tSc=qz.reduce((s,q)=>s+(q.score||0),0),tQ=qz.reduce((s,q)=>s+(q.total||0),0);
    const acc=tQ?Math.round(tSc/tQ*100):0;
    // Weekly stats
    const weekAgo=Date.now()-7*86400000;
    const weekActs=acts.filter(a=>a.timestamp>weekAgo);
    const weekQz=weekActs.filter(a=>a.type==='quiz_complete');
    const weekPrac=weekActs.filter(a=>a.type==='practice');
    const weekCards=weekPrac.reduce((s,a)=>s+(a.cardsViewed||0),0);

    let h=`<div class="topbar"><div class="h2">📈 ${t('progress')}</div></div>`;
    // Weekly summary
    h+=`<div class="panel"><div class="panel-title">📊 This Week</div>
    <div class="score-bar"><div class="score-card"><div class="score-val" style="color:var(--saf)">${weekQz.length}</div><div class="score-lbl">${t('quizzes')}</div></div>
    <div class="score-card"><div class="score-val" style="color:var(--blu)">${weekCards}</div><div class="score-lbl">${t('cards')}</div></div>
    <div class="score-card"><div class="score-val" style="color:var(--grn)">${weekActs.length}</div><div class="score-lbl">Activities</div></div></div></div>`;
    // Overall stats
    h+=`<div class="panel"><div class="panel-title">📈 All Time</div>
    <div class="score-bar"><div class="score-card"><div class="score-val" style="color:var(--saf)">${qz.length}</div><div class="score-lbl">${t('quizzes')}</div></div>
    <div class="score-card"><div class="score-val" style="color:var(--grn)">${acc}%</div><div class="score-lbl">${t('accuracy')}</div></div>
    <div class="score-card"><div class="score-val" style="color:var(--warn)">🔥${c.streak||0}</div><div class="score-lbl">${t('streak')}</div></div></div></div>`;
    // Attendance this month
    const now=new Date();const month=now.toISOString().substring(0,7);
    try{const attSnap=await db.collection('attendance').where('teacherId','==',S.pTeacherId).where('date','>=',month+'-01').where('date','<=',month+'-31').get();
      let present=0,absent=0,attTotal=0;
      attSnap.docs.forEach(d=>{const rec=(d.data().records||[]).find(r=>r.studentId===S.pChildId);if(rec){attTotal++;if(rec.status==='present')present++;if(rec.status==='absent')absent++}});
      const rate=attTotal?Math.round(present/attTotal*100):0;
      h+=`<div class="panel"><div class="panel-title">📋 Attendance (${now.toLocaleDateString(undefined,{month:'long'})})</div>
      <div class="score-bar"><div class="score-card"><div class="score-val" style="color:var(--grn)">${present}</div><div class="score-lbl">${t('present')}</div></div>
      <div class="score-card"><div class="score-val" style="color:var(--red)">${absent}</div><div class="score-lbl">${t('absent')}</div></div>
      <div class="score-card"><div class="score-val">${rate}%</div><div class="score-lbl">Rate</div></div></div></div>`}catch(e){}
    // Recent activity timeline
    h+=`<div class="panel"><div class="panel-title">🕐 Recent Activity</div>`;
    if(!acts.length)h+='<p class="sub2">No activity yet</p>';
    else{const recent=acts.slice(0,15);recent.forEach(a=>{
      const icons={quiz_complete:'🎮',practice:'📚',game_complete:'🎲'};
      const labels={quiz_complete:'Quiz',practice:'Practice',game_complete:'Game'};
      let detail='';if(a.type==='quiz_complete')detail=`Score: ${a.score}/${a.total}`;
      else if(a.type==='practice')detail=`${a.cardsViewed||0} cards`;
      else if(a.type==='game_complete')detail=a.gameName||'';
      h+=`<div style="padding:8px 0;border-bottom:1px solid var(--brd);font-size:13px"><div class="flex justify-between items-center">
      <div>${icons[a.type]||'📌'} <b>${labels[a.type]||a.type}</b> ${detail}</div><span class="sub2">${tSince(a.timestamp)}</span></div></div>`})}
    h+='</div>';app.innerHTML=h}
  catch(e){app.innerHTML=`<div class="topbar"><div class="h2">📈 ${t('progress')}</div></div><div class="empty"><p>Could not load progress</p></div>`}}

// ============ START APP (all files loaded) ============
init();
