// ============ CONFIG ============
const FBC={apiKey:"AIzaSyAonCmVIp_vhP5vbRDjP7Nlx5PB8piwubE",authDomain:"pathshala-28752.firebaseapp.com",projectId:"pathshala-28752",storageBucket:"pathshala-28752.firebasestorage.app",messagingSenderId:"238955568068",appId:"1:238955568068:web:c89ebe8983c9888874a291"};
const ADMIN_PW=null; // Admin password is stored in Firestore, not here
firebase.initializeApp(FBC);const db=firebase.firestore();
const $=id=>document.getElementById(id),app=$('app'),bnav=$('bnav');

// Translations (compact)
const L={en:{login:'Login',logout:'Logout',back:'Back',save:'Save',delete:'Delete',edit:'Edit',create:'Create',add:'Add',send:'Send',name:'Name',username:'Username',password:'Password',admin:'Admin',teacher:'Teacher',student:'Student',teachers:'Teachers',students:'Students',messages:'Messages',settings:'Settings',categories:'Categories',cards:'Cards',classrooms:'Classrooms',classroom:'Classroom',quizGroups:'Quiz Groups',wordOfDay:'Word of the Day',practice:'Practice',quiz:'Quiz',games:'Games',badges:'Badges',attendance:'Attendance',fullName:'Full Name',phone:'Phone',dob:'Date of Birth',email:'Email',contact:'Contact',gurmukhi:'Gurmukhi',english:'English',picture:'Picture',audio:'Audio',shared:'Shared',all:'All',quizzes:'Quizzes',accuracy:'Accuracy',streak:'Streak',home:'Home',retry:'Retry',reveal:'Reveal',next:'Next',prev:'Prev',saving:'Saving...',saved:'Saved!',deleted:'Deleted',created:'Created!',sent:'Sent!',broadcast:'Broadcast',sendToAll:'Send to All',noMessages:'No messages yet',noContent:'No content yet',noStudents:'No students yet',noCards:'No cards yet',fillAll:'Fill all fields',wrongPassword:'Wrong password',notFound:'Not found',selectClassroom:'Select Classroom',reassign:'Reassign',changeTeacher:'Change Teacher',changeClassroom:'Change Classroom',birthday:'Birthday',todayBirthdays:'Birthdays Today!',upcomingBirthdays:'Upcoming Birthdays',speedRound:'Speed Round',randomWord:'Random Word',listenTap:'Listen & tap correct picture',tapMeWod:'Tap to hear today\'s word!',account:'Account',resetPassword:'Reset Password',language:'Language',level:'Level',days:'days',overview:'Overview',profile:'Profile',
helpCard:'Create a flashcard with Gurmukhi word, English translation, picture and audio. Add 1-2 example pictures too.',helpCat:'Categories organize cards into groups. Create a category first, then add cards.',helpStudent:'Create student login. They use username/password to access the app.',helpTeacher:'Create teacher account. Assign to classrooms and share credentials.',helpClassroom:'Classrooms group students and teachers. Create classrooms first.',helpAtt:'Quick: Tap All Present then tap absent students. Save — done in seconds!',helpAttAdmin:'View attendance by classroom and student with monthly stats.',helpMsg:'Send messages to students individually or broadcast to all.',helpWod:'Pick a card for students to see on their home screen today.',helpQuiz:'Create quiz group with 4 cards. Students hear audio and pick matching picture.',helpGames:'Fun vocabulary games. Speed Round tests speed, Random Word challenges you to guess.',helpPractice:'Pick a category to practice. See picture, guess word, reveal answer and hear audio.'},
pa:{login:'ਲੌਗਇਨ',logout:'ਲੌਗਆਊਟ',back:'ਪਿੱਛੇ',save:'ਸੇਵ',delete:'ਮਿਟਾਓ',edit:'ਸੋਧੋ',create:'ਬਣਾਓ',add:'ਜੋੜੋ',send:'ਭੇਜੋ',name:'ਨਾਮ',username:'ਯੂਜ਼ਰਨੇਮ',password:'ਪਾਸਵਰਡ',admin:'ਐਡਮਿਨ',teacher:'ਅਧਿਆਪਕ',student:'ਵਿਦਿਆਰਥੀ',teachers:'ਅਧਿਆਪਕ',students:'ਵਿਦਿਆਰਥੀ',messages:'ਸੁਨੇਹੇ',settings:'ਸੈਟਿੰਗਾਂ',categories:'ਸ਼੍ਰੇਣੀਆਂ',cards:'ਕਾਰਡ',classrooms:'ਕਲਾਸਰੂਮ',classroom:'ਕਲਾਸਰੂਮ',practice:'ਅਭਿਆਸ',quiz:'ਕਵਿਜ਼',games:'ਖੇਡਾਂ',badges:'ਬੈਜ',attendance:'ਹਾਜ਼ਰੀ',fullName:'ਪੂਰਾ ਨਾਮ',phone:'ਫ਼ੋਨ',dob:'ਜਨਮ ਮਿਤੀ',home:'ਘਰ',all:'ਸਭ',birthday:'ਜਨਮਦਿਨ',overview:'ਸੰਖੇਪ',profile:'ਪ੍ਰੋਫਾਈਲ',language:'ਭਾਸ਼ਾ',
helpCard:'ਗੁਰਮੁਖੀ ਸ਼ਬਦ, ਅੰਗਰੇਜ਼ੀ, ਤਸਵੀਰ ਅਤੇ ਆਡੀਓ ਨਾਲ ਕਾਰਡ ਬਣਾਓ।',helpCat:'ਸ਼੍ਰੇਣੀਆਂ ਕਾਰਡ ਗਰੁੱਪ ਕਰਦੀਆਂ ਹਨ।',helpAtt:'ਤੇਜ਼: ਸਭ ਹਾਜ਼ਰ ਟੈਪ ਕਰੋ ਫਿਰ ਗੈਰ-ਹਾਜ਼ਰ ਟੈਪ ਕਰੋ।'},
hi:{login:'लॉगिन',logout:'लॉगआउट',back:'वापस',save:'सेव',home:'होम',all:'सभी',birthday:'जन्मदिन',overview:'अवलोकन',language:'भाषा',settings:'सेटिंग्स'},
no:{login:'Logg inn',logout:'Logg ut',back:'Tilbake',save:'Lagre',home:'Hjem',all:'Alle',birthday:'Bursdag',overview:'Oversikt',language:'Språk',settings:'Innstillinger'}};
let lang=localStorage.getItem('lang')||'en';
function t(k){return(L[lang]&&L[lang][k])||L.en[k]||k}
function setLang(l){lang=l;localStorage.setItem('lang',l);R()}
function langSel(){return`<select class="lang-sel" onchange="setLang(this.value)"><option value="en" ${lang==='en'?'selected':''}>EN</option><option value="pa" ${lang==='pa'?'selected':''}>ਪੰ</option><option value="hi" ${lang==='hi'?'selected':''}>हि</option><option value="no" ${lang==='no'?'selected':''}>NO</option></select>`}

// State
let S={role:null,view:'home',tab:'cards',uid:'',uname:'',teacherId:'',selCat:null,cats:[],cards:[],students:[],teachers:[],classrooms:[],
  flashCards:[],flashIdx:0,flashRev:false,qCards:[],qIdx:0,qScore:0,qTotal:0,qStart:0,qAns:false,qCat:'',unread:0,logo:'',welcomeMsg:'',settings:{},
  filterCR:null,tData:null,searchQ:''};

// Helpers
function toast(m,ty='ok'){const e=document.createElement('div');e.className='toast toast-'+ty;e.textContent=m;document.body.appendChild(e);setTimeout(()=>e.remove(),2500)}
function tSince(ts){if(!ts)return'-';const s=Math.floor((Date.now()-ts)/1000);if(s<60)return'now';if(s<3600)return Math.floor(s/60)+'m';if(s<86400)return Math.floor(s/3600)+'h';return Math.floor(s/86400)+'d'}
function shuf(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function fmt(ts){const d=new Date(ts);return d.toLocaleDateString()+' '+d.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'})}
function esc(s){return(s||'').replace(/'/g,"\\'")}
function logoH(){return S.logo?'<img class="logo-img" src="'+S.logo+'">':''}
function confetti(){const c=document.createElement('div');c.className='confetti-box';const cl=['#F5A623','#2ECC71','#E74C3C','#3B82F6','#8B5CF6'];
  for(let i=0;i<45;i++){const p=document.createElement('div');p.className='confetti-p';p.style.left=Math.random()*100+'%';p.style.background=cl[Math.floor(Math.random()*cl.length)];p.style.animationDelay=Math.random()*2+'s';c.appendChild(p)}
  document.body.appendChild(c);setTimeout(()=>c.remove(),4000)}
function getCR(id){return(S.classrooms.find(x=>x.id===id)||{}).name||'—'}
function getT(id){return(S.teachers.find(x=>x.id===id)||{}).name||'—'}
function fmtDob(d){if(!d)return'—';return new Date(d+'T12:00:00').toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})}
function isBdayToday(d){if(!d)return false;const t=new Date(),x=new Date(d+'T12:00:00');return x.getMonth()===t.getMonth()&&x.getDate()===t.getDate()}
function isBdaySoon(d,days=7){if(!d)return false;const t=new Date();t.setHours(0,0,0,0);for(let i=1;i<=days;i++){const c=new Date(t);c.setDate(c.getDate()+i);const x=new Date(d+'T12:00:00');if(x.getMonth()===c.getMonth()&&x.getDate()===c.getDate())return i}return false}
const avColors=['av-pur','av-blu','av-grn','av-org','av-pink','av-cyan'];
function avColor(i){return avColors[i%avColors.length]}

// XP
const LEVELS=[0,50,120,200,300,450,650,900,1200,1600,2100];
function getLevel(xp){let l=0;for(let i=0;i<LEVELS.length;i++){if(xp>=LEVELS[i])l=i;else break}return l}
function getLN(l){return['Beginner','Starter','Learner','Explorer','Achiever','Scholar','Expert','Master','Legend','Champion','Guru'][l]||'Guru'}
function xpInfo(xp){const l=getLevel(xp);const n=LEVELS[l+1]||LEVELS[LEVELS.length-1];return{level:l,name:getLN(l),needed:n,progress:Math.min(100,((xp-(LEVELS[l]||0))/(n-(LEVELS[l]||0)))*100)}}
async function addXP(sid,a){const d=await db.collection('students').doc(sid).get();const o=d.data().xp||0;const n=o+a;await db.collection('students').doc(sid).update({xp:n});if(getLevel(n)>getLevel(o))confetti();return n}
async function updStreak(sid){const d=await db.collection('students').doc(sid).get();const data=d.data();const today=new Date().toISOString().split('T')[0];
  if(data.lastPracticeDate===today)return data.streak||0;const y=new Date(Date.now()-86400000).toISOString().split('T')[0];
  const ns=data.lastPracticeDate===y?(data.streak||0)+1:1;await db.collection('students').doc(sid).update({streak:ns,lastPracticeDate:today});return ns}

// Firebase
async function ldSet(){try{const d=await db.collection('settings').doc('app').get();if(d.exists){S.settings=d.data();S.logo=S.settings.logo||'';S.welcomeMsg=S.settings.welcomeMsg||''}}catch(e){}}
async function svSet(d){await db.collection('settings').doc('app').set({...S.settings,...d},{merge:true});Object.assign(S.settings,d);S.logo=S.settings.logo||'';S.welcomeMsg=S.settings.welcomeMsg||''}
async function ldCR(){S.classrooms=(await db.collection('classrooms').orderBy('name').get()).docs.map(d=>({id:d.id,...d.data()}))}
async function ldCats(tid){const q=tid?db.collection('categories').where('teacherId','in',[tid,'shared']):db.collection('categories');S.cats=(await q.get()).docs.map(d=>({id:d.id,...d.data()}))}
async function ldCards(c){let q=db.collection('cards');if(c)q=q.where('categoryId','==',c);S.cards=(await q.get()).docs.map(d=>({id:d.id,...d.data()}))}
async function ldAC(tid){let q=db.collection('cards');if(tid)q=q.where('teacherId','in',[tid,'shared']);S.cards=(await q.get()).docs.map(d=>({id:d.id,...d.data()}))}
async function ldStu(tid){const q=tid?db.collection('students').where('teacherId','==',tid):db.collection('students');S.students=(await q.get()).docs.map(d=>({id:d.id,...d.data()}))}
async function ldT(){S.teachers=(await db.collection('teachers').get()).docs.map(d=>({id:d.id,...d.data()}))}
function compImg(f,mx=400,q=0.7){return new Promise(r=>{const rd=new FileReader();rd.onload=e=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');let w=img.width,h=img.height;if(w>h){if(w>mx){h=h*mx/w;w=mx}}else{if(h>mx){w=w*mx/h;h=mx}}c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);r(c.toDataURL('image/jpeg',q))};img.src=e.target.result};rd.readAsDataURL(f)})}
function b64(b){return new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b)})}
async function recAct(type,data){if(S.role!=='student'||!S.uid)return;await db.collection('students').doc(S.uid).update({lastSeen:Date.now()});await db.collection('activity').add({studentId:S.uid,studentName:S.uname,teacherId:S.teacherId,type,...data,timestamp:Date.now()})}
let curA=null;function playA(u){if(curA){curA.pause();curA=null}if(!u)return;curA=new Audio(u);curA.play().catch(()=>{})}
let mRec=null,aCh=[],recBlob=null;

// Messages
async function sendMsg(fId,fN,fR,tId,tN,txt){await db.collection('messages').add({fromId:fId,fromName:fN,fromRole:fR,toId:tId,toName:tN,text:txt,timestamp:Date.now(),read:false})}
async function getMsgs(u1,u2){const s1=await db.collection('messages').where('fromId','==',u1).where('toId','==',u2).get();const s2=await db.collection('messages').where('fromId','==',u2).where('toId','==',u1).get();const m=[...s1.docs.map(d=>({id:d.id,...d.data()})),...s2.docs.map(d=>({id:d.id,...d.data()}))];m.sort((a,b)=>a.timestamp-b.timestamp);return m}
async function markRd(uid,fid){const s=await db.collection('messages').where('toId','==',uid).where('fromId','==',fid).where('read','==',false).get();if(s.size){const b=db.batch();s.docs.forEach(d=>b.update(d.ref,{read:true}));await b.commit()}}
async function getUnrd(uid){return(await db.collection('messages').where('toId','==',uid).where('read','==',false).get()).size}

const BADGES=[{id:'first_quiz',ico:'🌟',name:'First Steps'},{id:'quiz5',ico:'📖',name:'Learner'},{id:'quiz15',ico:'🏆',name:'Master'},{id:'perfect',ico:'🎯',name:'Perfect'},{id:'cards50',ico:'📚',name:'Bookworm'},{id:'cards100',ico:'🧠',name:'Big Brain'},{id:'streak7',ico:'🔥',name:'On Fire'},{id:'level5',ico:'👑',name:'Rising Star'}];
async function chkBadges(sid){const aS=await db.collection('activity').where('studentId','==',sid).get();const acts=aS.docs.map(d=>d.data());const doc=await db.collection('students').doc(sid).get();const sD=doc.data();
  const qz=acts.filter(a=>a.type==='quiz_complete'),tc=acts.filter(a=>a.type==='practice').reduce((s,a)=>s+(a.cardsViewed||0),0);const earned=[];
  if(qz.length>=1)earned.push('first_quiz');if(qz.length>=5)earned.push('quiz5');if(qz.length>=15)earned.push('quiz15');
  if(qz.some(q=>q.score===q.total&&q.total>0))earned.push('perfect');if(tc>=50)earned.push('cards50');if(tc>=100)earned.push('cards100');
  if((sD.streak||0)>=7)earned.push('streak7');if(getLevel(sD.xp||0)>=5)earned.push('level5');
  await db.collection('students').doc(sid).update({badges:earned});return earned}

// Bottom Nav
function showNav(tabs){bnav.style.display='block';$('bnavInner').innerHTML=tabs.map(t=>`<button class="bnav-item ${S.tab===t.id?'on':''}" onclick="S.tab='${t.id}';R()"><span class="ni">${t.ico}</span>${t.label}${t.badge?'<span class="bnav-badge">'+t.badge+'</span>':''}</button>`).join('')}
function hideNav(){bnav.style.display='none'}

function R(){if(!S.role)return rRole();if(S.role==='admin')return rAdmin();if(S.role==='teacher')return rTeacher();if(S.role==='student')return rStudent()}
function doLogout(){S.role=null;const ur=new URLSearchParams(window.location.search).get('role');if(ur&&['admin','teacher','student'].includes(ur)){lP(ur)}else{R()}}


// ============ LOGIN ============
function rRole(){hideNav();app.innerHTML=`<div style="text-align:center;padding:40px 0 20px">${logoH()}<div class="h1" style="margin-top:12px;font-size:28px;background:linear-gradient(135deg,var(--saf),var(--pur));-webkit-background-clip:text;-webkit-text-fill-color:transparent">ਪੰਜਾਬੀ ਸਿੱਖੋ</div>
<p class="sub" style="margin-top:6px">Learn Punjabi — Interactive Platform</p></div>
<div style="text-align:right;margin-bottom:14px">${langSel()}</div>
<div style="display:flex;flex-direction:column;gap:12px">
<div style="display:flex;gap:12px">
  <div class="dash-card dc-purple" onclick="lP('admin')" style="flex:1"><div class="dc-icon">🛡️</div><div class="dc-title">${t('admin')}</div></div>
  <div class="dash-card dc-blue" onclick="lP('teacher')" style="flex:1"><div class="dc-icon">👩‍🏫</div><div class="dc-title">${t('teacher')}</div></div>
</div>
<div class="dash-card dc-green" onclick="lP('student')" style="grid-column:span 2"><div class="dc-icon">🧑‍🎓</div><div class="dc-title">${t('student')}</div><div class="dc-sub">Learn & Practice Punjabi</div></div>
</div>`}

function lP(role){hideNav();const urlR=new URLSearchParams(window.location.search).get('role');
  const colors={admin:'var(--pur)',teacher:'var(--blu)',student:'var(--grn)'};
  const icons={admin:'🛡️',teacher:'👩‍🏫',student:'🧑‍🎓'};
  let h=`<div style="text-align:center;padding:30px 0 20px">${logoH()}<div style="width:64px;height:64px;border-radius:20px;background:${colors[role]};display:flex;align-items:center;justify-content:center;font-size:32px;margin:16px auto">${icons[role]}</div>
  <div class="h2">${t(role)} ${t('login')}</div></div>
  <div style="text-align:right;margin-bottom:10px">${langSel()}</div><div class="panel">`;
  if(role!=='admin')h+=`<div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="lU" placeholder="${t('username')}"></div>`;
  else h+=`<div class="help-tip"><span class="h-ico">💡</span><div>First time? Click "Setup" below to create your Super Admin account.</div></div>
  <div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="lU" placeholder="Admin username"></div>`;
  h+=`<div class="fld"><label class="lbl">${t('password')}</label><input class="inp" type="password" id="lPw" placeholder="${t('password')}" onkeydown="if(event.key==='Enter')doLogin('${role}')"></div>
  <button class="btn btn-p btn-w" id="lB" onclick="doLogin('${role}')">${t('login')}</button>`;
  if(role==='admin')h+=`<div class="flex gap-8 mt-14"><button class="btn btn-s flex-1" onclick="showAdminSetup()">🆕 First Time Setup</button><button class="btn btn-s flex-1" onclick="showForgotPw()">🔑 Forgot Password</button></div>`;
  h+='</div>';
  if(!urlR)h+=`<button class="back" onclick="S.role=null;R()">← ${t('back')}</button>`;app.innerHTML=h}

async function doLogin(role){const btn=$('lB');btn.disabled=true;btn.textContent='...';
  try{if(role==='admin'){
    const u=($('lU')||{}).value?.trim().toLowerCase(),pw=$('lPw').value.trim();
    if(!u||!pw){toast(t('fillAll'),'err');btn.disabled=false;btn.textContent=t('login');return}
    // Check admins collection
    const snap=await db.collection('admins').where('username','==',u).get();
    if(snap.empty){toast(t('notFound')+' — Use "First Time Setup" to create admin','err');btn.disabled=false;btn.textContent=t('login');return}
    const doc=snap.docs[0],data=doc.data();
    if(data.password!==pw){toast(t('wrongPassword'),'err');btn.disabled=false;btn.textContent=t('login');return}
    S.role='admin';S.uid=doc.id;S.uname=data.name||'Admin';S.adminRole=data.role||'superadmin';S.tab='home';await initA();return}
    const u=($('lU')||{}).value?.trim().toLowerCase(),p=$('lPw').value.trim();if(!u||!p){toast(t('fillAll'),'err');btn.disabled=false;btn.textContent=t('login');return}
    const col=role==='teacher'?'teachers':'students';const snap=await db.collection(col).where('username','==',u).get();
    if(snap.empty){toast(t('notFound'),'err');btn.disabled=false;btn.textContent=t('login');return}
    const doc=snap.docs[0],data=doc.data();if(data.password!==p){toast(t('wrongPassword'),'err');btn.disabled=false;btn.textContent=t('login');return}
    S.uid=doc.id;S.uname=data.name||data.username;S.role=role;
    if(role==='teacher'){S.tab='home';await initTP()}
    else{S.teacherId=data.teacherId;S.tab='home';S.view='home';
      db.collection('students').doc(doc.id).update({lastSeen:Date.now()});
      await Promise.all([ldCats(data.teacherId),ldCR()]);
      S.unread=await getUnrd(S.uid);R()}
  }catch(e){toast(e.message,'err');btn.disabled=false;btn.textContent=t('login')}}


// ============ INIT ============
async function init(){
  try{db.enablePersistence({synchronizeTabs:true}).catch(()=>{})}catch(e){}
  try{
    const params=new URLSearchParams(window.location.search);const urlRole=params.get('role');
    if(urlRole&&['admin','teacher','student'].includes(urlRole)){lP(urlRole)}else{R()}
    ldSet().then(()=>{if(!S.role)R()}).catch(()=>{})
  }catch(e){app.innerHTML='<div style="text-align:center;padding:60px"><p style="color:#E74C3C">'+e.message+'</p></div>'}
}
// init() is called from student.js after all files are loaded