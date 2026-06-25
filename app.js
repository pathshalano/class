// ============ CONFIG ============
const FBC={apiKey:"AIzaSyAonCmVIp_vhP5vbRDjP7Nlx5PB8piwubE",authDomain:"pathshala-28752.firebaseapp.com",projectId:"pathshala-28752",storageBucket:"pathshala-28752.firebasestorage.app",messagingSenderId:"238955568068",appId:"1:238955568068:web:c89ebe8983c9888874a291"};
const SA_KEY='pathshala786';
firebase.initializeApp(FBC);const db=firebase.firestore();
const $=id=>document.getElementById(id),app=$('app'),bnav=$('bnav');

// Translations
const L={en:{login:'Login',logout:'Logout',back:'Back',save:'Save',delete:'Delete',edit:'Edit',create:'Create',add:'Add',send:'Send',name:'Name',username:'Username',password:'Password',admin:'Admin',teacher:'Teacher',student:'Student',teachers:'Teachers',students:'Students',messages:'Messages',settings:'Settings',categories:'Categories',cards:'Cards',classrooms:'Classrooms',classroom:'Classroom',quizGroups:'Quiz Groups',wordOfDay:'Word of the Day',practice:'Practice',quiz:'Quiz',games:'Games',badges:'Badges',attendance:'Attendance',fullName:'Full Name',phone:'Phone',dob:'Date of Birth',email:'Email',contact:'Contact',gurmukhi:'Gurmukhi',english:'English',picture:'Picture',audio:'Audio',shared:'Shared',all:'All',quizzes:'Quizzes',accuracy:'Accuracy',streak:'Streak',home:'Home',retry:'Retry',reveal:'Reveal',next:'Next',prev:'Prev',saving:'Saving...',saved:'Saved!',deleted:'Deleted',created:'Created!',sent:'Sent!',broadcast:'Broadcast',sendToAll:'Send to All',noMessages:'No messages yet',noContent:'No content yet',noStudents:'No students yet',noCards:'No cards yet',fillAll:'Fill all fields',wrongPassword:'Wrong password',notFound:'Not found',selectClassroom:'Select Classroom',reassign:'Reassign',changeTeacher:'Change Teacher',changeClassroom:'Change Classroom',birthday:'Birthday',todayBirthdays:'Birthdays Today!',upcomingBirthdays:'Upcoming Birthdays',speedRound:'Speed Round',randomWord:'Random Word',memoryMatch:'Memory Match',spinWheel:'Spin the Wheel',pickEnglish:'Pick the English meaning',listenTap:'Listen & tap correct picture',tapMeWod:'Tap to hear today\'s word!',account:'Account',resetPassword:'Reset Password',language:'Language',level:'Level',days:'days',overview:'Overview',profile:'Profile',organisations:'Organisations',organisation:'Organisation',orgName:'Organisation Name',orgNumber:'Organisation Nr',address:'Address',contactPerson:'Contact Person',status:'Status',active:'Active',inactive:'Inactive',school:'School',schools:'Schools',trial:'Trial',suspended:'Suspended',expired:'Expired',parent:'Parent',parents:'Parents',progress:'Progress',absent:'Absent',present:'Present',reason:'Reason',sick:'Sick',family:'Family',appointment:'Appointment',other:'Other',reportAbsence:'Report Absence',today:'Today',week:'Week',month:'Month',
helpCard:'Create a flashcard with Gurmukhi word, English translation, picture and audio. Add 1-2 example pictures too.',helpCat:'Categories organize cards into groups. Create a category first, then add cards.',helpStudent:'Create student login. They use username/password to access the app.',helpTeacher:'Create teacher account. Assign to classrooms and share credentials.',helpClassroom:'Classrooms group students and teachers. Create classrooms first.',helpAtt:'Quick: Tap All Present then tap absent students. Save — done in seconds!',helpAttAdmin:'View attendance by classroom and student with monthly stats.',helpMsg:'Send messages to students individually or broadcast to all.',helpWod:'Pick a card for students to see on their home screen today.',helpQuiz:'Create quiz group with 4 cards. Students hear audio and pick matching picture.',helpGames:'Fun vocabulary games. Speed Round tests speed, Random Word challenges guessing, Memory Match trains recall, Spin the Wheel tests listening!',helpPractice:'Pick a category to practice. See picture, guess word, reveal answer and hear audio.'},
pa:{login:'ਲੌਗਇਨ',logout:'ਲੌਗਆਊਟ',back:'ਪਿੱਛੇ',save:'ਸੇਵ',delete:'ਮਿਟਾਓ',edit:'ਸੋਧੋ',create:'ਬਣਾਓ',add:'ਜੋੜੋ',send:'ਭੇਜੋ',name:'ਨਾਮ',username:'ਯੂਜ਼ਰਨੇਮ',password:'ਪਾਸਵਰਡ',admin:'ਐਡਮਿਨ',teacher:'ਅਧਿਆਪਕ',student:'ਵਿਦਿਆਰਥੀ',teachers:'ਅਧਿਆਪਕ',students:'ਵਿਦਿਆਰਥੀ',messages:'ਸੁਨੇਹੇ',settings:'ਸੈਟਿੰਗਾਂ',categories:'ਸ਼੍ਰੇਣੀਆਂ',cards:'ਕਾਰਡ',classrooms:'ਕਲਾਸਰੂਮ',classroom:'ਕਲਾਸਰੂਮ',practice:'ਅਭਿਆਸ',quiz:'ਕਵਿਜ਼',games:'ਖੇਡਾਂ',badges:'ਬੈਜ',attendance:'ਹਾਜ਼ਰੀ',fullName:'ਪੂਰਾ ਨਾਮ',phone:'ਫ਼ੋਨ',dob:'ਜਨਮ ਮਿਤੀ',home:'ਘਰ',all:'ਸਭ',birthday:'ਜਨਮਦਿਨ',overview:'ਸੰਖੇਪ',profile:'ਪ੍ਰੋਫਾਈਲ',language:'ਭਾਸ਼ਾ',organisations:'ਸੰਸਥਾਵਾਂ',organisation:'ਸੰਸਥਾ',schools:'ਸਕੂਲ',school:'ਸਕੂਲ',parent:'ਮਾਪੇ',
helpCard:'ਗੁਰਮੁਖੀ ਸ਼ਬਦ, ਅੰਗਰੇਜ਼ੀ, ਤਸਵੀਰ ਅਤੇ ਆਡੀਓ ਨਾਲ ਕਾਰਡ ਬਣਾਓ।',helpCat:'ਸ਼੍ਰੇਣੀਆਂ ਕਾਰਡ ਗਰੁੱਪ ਕਰਦੀਆਂ ਹਨ।',helpAtt:'ਤੇਜ਼: ਸਭ ਹਾਜ਼ਰ ਟੈਪ ਕਰੋ ਫਿਰ ਗੈਰ-ਹਾਜ਼ਰ ਟੈਪ ਕਰੋ।'},
hi:{login:'लॉगिन',logout:'लॉगआउट',back:'वापस',save:'सेव',home:'होम',all:'सभी',birthday:'जन्मदिन',overview:'अवलोकन',language:'भाषा',settings:'सेटिंग्स'},
no:{login:'Logg inn',logout:'Logg ut',back:'Tilbake',save:'Lagre',home:'Hjem',all:'Alle',birthday:'Bursdag',overview:'Oversikt',language:'Språk',settings:'Innstillinger',organisations:'Organisasjoner',schools:'Skoler',school:'Skole',active:'Aktiv',inactive:'Inaktiv',status:'Status',trial:'Prøve',suspended:'Suspendert',expired:'Utløpt',parent:'Foresatt'}};
let lang=localStorage.getItem('lang')||'en';
function t(k){return(L[lang]&&L[lang][k])||L.en[k]||k}
function setLang(l){lang=l;localStorage.setItem('lang',l);R()}
function langSel(){return`<select class="lang-sel" onchange="setLang(this.value)"><option value="en" ${lang==='en'?'selected':''}>EN</option><option value="pa" ${lang==='pa'?'selected':''}>ਪੰ</option><option value="hi" ${lang==='hi'?'selected':''}>हि</option><option value="no" ${lang==='no'?'selected':''}>NO</option></select>`}

// State
let S={role:null,view:'home',tab:'cards',uid:'',uname:'',teacherId:'',orgId:'',orgData:null,adminRole:'',
  selCat:null,cats:[],cards:[],students:[],teachers:[],classrooms:[],orgs:[],parents:[],
  flashCards:[],flashIdx:0,flashRev:false,qCards:[],qIdx:0,qScore:0,qTotal:0,qStart:0,qAns:false,qCat:'',
  unread:0,logo:'',welcomeMsg:'',settings:{},filterCR:null,tData:null,searchQ:'',
  // Parent state
  pChild:null,pChildId:'',pChildren:[],pTeacherId:'',pTeacherName:'',pPhone:''};

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
function fmtDate(ts){if(!ts)return'—';return new Date(ts).toLocaleDateString(undefined,{day:'numeric',month:'short',year:'numeric'})}
function daysLeft(expiryTs){if(!expiryTs)return 999;return Math.ceil((expiryTs-Date.now())/(1000*60*60*24))}

function isOrgActive(orgData){
  if(!orgData)return true;const st=orgData.status||'active';
  if(st==='active')return true;if(st==='trial'){return daysLeft(orgData.trialEnds)>0}return false}
function orgBlockMsg(orgData){
  const st=orgData?.status||'active';
  if(st==='suspended')return'This school has been suspended. Please contact the platform administrator.';
  if(st==='inactive')return'This school is currently inactive. Please contact the platform administrator.';
  if(st==='trial'&&daysLeft(orgData.trialEnds)<=0)return'The trial period has expired. Please contact the platform administrator to activate your school.';
  return'Access denied. Please contact the platform administrator.'}

// XP
const LEVELS=[0,50,120,200,300,450,650,900,1200,1600,2100];
function getLevel(xp){let l=0;for(let i=0;i<LEVELS.length;i++){if(xp>=LEVELS[i])l=i;else break}return l}
function getLN(l){return['Beginner','Starter','Learner','Explorer','Achiever','Scholar','Expert','Master','Legend','Champion','Guru'][l]||'Guru'}
function xpInfo(xp){const l=getLevel(xp);const n=LEVELS[l+1]||LEVELS[LEVELS.length-1];return{level:l,name:getLN(l),needed:n,progress:Math.min(100,((xp-(LEVELS[l]||0))/(n-(LEVELS[l]||0)))*100)}}
async function addXP(sid,a){const d=await db.collection('students').doc(sid).get();const o=d.data().xp||0;const n=o+a;await db.collection('students').doc(sid).update({xp:n});if(getLevel(n)>getLevel(o))confetti();return n}
async function updStreak(sid){const d=await db.collection('students').doc(sid).get();const data=d.data();const today=new Date().toISOString().split('T')[0];
  if(data.lastPracticeDate===today)return data.streak||0;const y=new Date(Date.now()-86400000).toISOString().split('T')[0];
  const ns=data.lastPracticeDate===y?(data.streak||0)+1:1;await db.collection('students').doc(sid).update({streak:ns,lastPracticeDate:today});return ns}

// ============ ORG-AWARE FIREBASE LOADERS ============
async function ldSet(){try{if(S.orgId){const d=await db.collection('organisations').doc(S.orgId).get();
  if(d.exists){const data=d.data();S.logo=data.logo||'';S.welcomeMsg=data.welcomeMsg||'';S.orgData=data}}}catch(e){}}
async function svSet(d){if(!S.orgId)return;await db.collection('organisations').doc(S.orgId).update(d);
  Object.assign(S.orgData||{},d);S.logo=(S.orgData||{}).logo||'';S.welcomeMsg=(S.orgData||{}).welcomeMsg||''}
async function ldCR(){let q=db.collection('classrooms');if(S.orgId)q=q.where('orgId','==',S.orgId);
  S.classrooms=(await q.get()).docs.map(d=>({id:d.id,...d.data()}));S.classrooms.sort((a,b)=>(a.name||'').localeCompare(b.name||''))}
async function ldCats(tid){let q;if(tid)q=db.collection('categories').where('teacherId','in',[tid,'shared']);
  else if(S.orgId)q=db.collection('categories').where('orgId','==',S.orgId);else q=db.collection('categories');
  S.cats=(await q.get()).docs.map(d=>({id:d.id,...d.data()}))}
async function ldCards(c){let q=db.collection('cards');if(c)q=q.where('categoryId','==',c);S.cards=(await q.get()).docs.map(d=>({id:d.id,...d.data()}))}
async function ldAC(tid){let q=db.collection('cards');if(tid)q=q.where('teacherId','in',[tid,'shared']);S.cards=(await q.get()).docs.map(d=>({id:d.id,...d.data()}))}
async function ldStu(tid){let q;if(tid)q=db.collection('students').where('teacherId','==',tid);
  else if(S.orgId)q=db.collection('students').where('orgId','==',S.orgId);else q=db.collection('students');
  S.students=(await q.get()).docs.map(d=>({id:d.id,...d.data()}))}
async function ldParents(){let q=db.collection('parents');if(S.orgId)q=q.where('orgId','==',S.orgId);
  S.parents=(await q.get()).docs.map(d=>({id:d.id,...d.data()}));S.parents.sort((a,b)=>(a.name||'').localeCompare(b.name||''))}
async function ldT(){let q=db.collection('teachers');if(S.orgId)q=q.where('orgId','==',S.orgId);
  S.teachers=(await q.get()).docs.map(d=>({id:d.id,...d.data()}))}
async function ldOrgs(){S.orgs=(await db.collection('organisations').get()).docs.map(d=>({id:d.id,...d.data()}));S.orgs.sort((a,b)=>(a.name||'').localeCompare(b.name||''))}

function compImg(f,mx=400,q=0.7){return new Promise(r=>{const rd=new FileReader();rd.onload=e=>{const img=new Image();img.onload=()=>{const c=document.createElement('canvas');let w=img.width,h=img.height;if(w>h){if(w>mx){h=h*mx/w;w=mx}}else{if(h>mx){w=w*mx/h;h=mx}}c.width=w;c.height=h;c.getContext('2d').drawImage(img,0,0,w,h);r(c.toDataURL('image/jpeg',q))};img.src=e.target.result};rd.readAsDataURL(f)})}
function b64(b){return new Promise(r=>{const f=new FileReader();f.onload=()=>r(f.result);f.readAsDataURL(b)})}
async function recAct(type,data){if(S.role!=='student'||!S.uid)return;await db.collection('students').doc(S.uid).update({lastSeen:Date.now()});await db.collection('activity').add({studentId:S.uid,studentName:S.uname,teacherId:S.teacherId,orgId:S.orgId,type,...data,timestamp:Date.now()})}
let curA=null;function playA(u){if(curA){curA.pause();curA=null}if(!u)return;curA=new Audio(u);curA.play().catch(()=>{})}
let mRec=null,aCh=[],recBlob=null;

// Messages
async function sendMsg(fId,fN,fR,tId,tN,txt,tag){await db.collection('messages').add({fromId:fId,fromName:fN,fromRole:fR,toId:tId,toName:tN,text:txt,tag:tag||'general',orgId:S.orgId||'',timestamp:Date.now(),read:false})}
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

// Nav
function showNav(tabs){bnav.style.display='block';$('bnavInner').innerHTML=tabs.map(t=>`<button class="bnav-item ${S.tab===t.id?'on':''}" onclick="S.tab='${t.id}';R()"><span class="ni">${t.ico}</span>${t.label}${t.badge?'<span class="bnav-badge">'+t.badge+'</span>':''}</button>`).join('')}
function hideNav(){bnav.style.display='none'}
function R(){if(!S.role)return rRole();if(S.role==='admin')return rAdmin();if(S.role==='teacher')return rTeacher();if(S.role==='student')return rStudent();if(S.role==='parent')return rParent()}
function doLogout(){S.role=null;S.orgId='';S.orgData=null;S.adminRole='';S.logo='';S.welcomeMsg='';S.pChild=null;S.pChildId='';S.pChildren=[];S.pTeacherId='';S.pTeacherName='';S.pPhone='';
  const p=new URLSearchParams(window.location.search);
  if(p.get('key')===SA_KEY){lP('superadmin')}
  else if(p.get('role')==='admin'){lP('admin')}
  else if(p.get('role')==='teacher'){lP('teacher')}
  else if(p.get('role')==='student'){lP('student')}
  else if(p.get('role')==='parent'){lP('parent')}
  else{R()}}

// ============ LOGIN ============
function rRole(){hideNav();
  const p=new URLSearchParams(window.location.search);
  if(p.get('key')===SA_KEY){lP('superadmin');return}
  if(p.get('role')==='admin'){lP('admin');return}
  if(p.get('role')==='teacher'){lP('teacher');return}
  if(p.get('role')==='student'){lP('student');return}
  if(p.get('role')==='parent'){lP('parent');return}
  // Default: Teacher + Student
  app.innerHTML=`<div style="text-align:center;padding:40px 0 20px">${logoH()}<div class="h1" style="margin-top:12px;font-size:28px;background:linear-gradient(135deg,var(--saf),var(--pur));-webkit-background-clip:text;-webkit-text-fill-color:transparent">ਪੰਜਾਬੀ ਸਿੱਖੋ</div>
  <p class="sub" style="margin-top:6px">Learn Punjabi — Interactive Platform</p></div>
  <div style="text-align:right;margin-bottom:14px">${langSel()}</div>
  <div style="display:flex;flex-direction:column;gap:12px">
    <div class="dash-card dc-blue" onclick="lP('teacher')"><div class="dc-icon">👩‍🏫</div><div class="dc-title">${t('teacher')}</div><div class="dc-sub">Manage cards & students</div></div>
    <div class="dash-card dc-green" onclick="lP('student')"><div class="dc-icon">🧑‍🎓</div><div class="dc-title">${t('student')}</div><div class="dc-sub">Learn & Practice Punjabi</div></div>
    <div class="dash-card dc-orange" onclick="lP('parent')"><div class="dc-icon">👪</div><div class="dc-title">${t('parent')}</div><div class="dc-sub">Track your child's progress</div></div>
  </div>`}

function lP(role){hideNav();
  const colors={admin:'var(--pur)',teacher:'var(--blu)',student:'var(--grn)',superadmin:'var(--saf)',parent:'var(--warn)'};
  const icons={admin:'🛡️',teacher:'👩‍🏫',student:'🧑‍🎓',superadmin:'⚡',parent:'👪'};
  const labels={admin:'School Admin',teacher:t('teacher'),student:t('student'),superadmin:'Platform Admin',parent:t('parent')};
  let h=`<div style="text-align:center;padding:30px 0 20px">${logoH()}<div style="width:64px;height:64px;border-radius:20px;background:${colors[role]};display:flex;align-items:center;justify-content:center;font-size:32px;margin:16px auto">${icons[role]}</div>
  <div class="h2">${labels[role]} ${t('login')}</div></div>
  <div style="text-align:right;margin-bottom:10px">${langSel()}</div><div class="panel">`;
  if(role==='superadmin')h+=`<div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="lU" placeholder="Username"></div>`;
  else if(role==='admin')h+=`<div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="lU" placeholder="School admin username"></div>`;
  else if(role==='parent')h+=`<div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="lU" placeholder="Parent username"></div>`;
  else h+=`<div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="lU" placeholder="${t('username')}"></div>`;
  h+=`<div class="fld"><label class="lbl">${t('password')}</label><input class="inp" type="password" id="lPw" placeholder="${t('password')}" onkeydown="if(event.key==='Enter')doLogin('${role}')"></div>
  <button class="btn btn-p btn-w" id="lB" onclick="doLogin('${role}')">${t('login')}</button>`;
  if(role==='superadmin')h+=`<div class="flex gap-8 mt-14"><button class="btn btn-s flex-1" onclick="showAdminSetup()">🆕 First Time Setup</button><button class="btn btn-s flex-1" onclick="showForgotPw()">🔑 Forgot Password</button></div>`;
  if(role==='admin')h+=`<div class="mt-14"><button class="btn btn-s btn-w" onclick="showForgotPw()">🔑 Forgot Password</button></div>`;
  h+='</div>';
  const p=new URLSearchParams(window.location.search);
  if(!p.get('key')&&!p.get('role'))h+=`<button class="back" onclick="S.role=null;R()">← ${t('back')}</button>`;
  app.innerHTML=h}

async function doLogin(role){const btn=$('lB');btn.disabled=true;btn.textContent='...';
  try{
    if(role==='superadmin'){
      const u=($('lU')||{}).value?.trim().toLowerCase(),pw=$('lPw').value.trim();
      if(!u||!pw){toast(t('fillAll'),'err');btn.disabled=false;btn.textContent=t('login');return}
      const snap=await db.collection('admins').where('username','==',u).where('role','==','superadmin').get();
      if(snap.empty){toast(t('notFound'),'err');btn.disabled=false;btn.textContent=t('login');return}
      const doc=snap.docs[0],data=doc.data();
      if(data.password!==pw){toast(t('wrongPassword'),'err');btn.disabled=false;btn.textContent=t('login');return}
      S.role='admin';S.uid=doc.id;S.uname=data.name||'Admin';S.adminRole='superadmin';S.orgId='';S.tab='home';
      await initA();return}
    if(role==='admin'){
      const u=($('lU')||{}).value?.trim().toLowerCase(),pw=$('lPw').value.trim();
      if(!u||!pw){toast(t('fillAll'),'err');btn.disabled=false;btn.textContent=t('login');return}
      const snap=await db.collection('admins').where('username','==',u).where('role','==','orgadmin').get();
      if(snap.empty){toast(t('notFound'),'err');btn.disabled=false;btn.textContent=t('login');return}
      const doc=snap.docs[0],data=doc.data();
      if(data.password!==pw){toast(t('wrongPassword'),'err');btn.disabled=false;btn.textContent=t('login');return}
      S.orgId=data.orgId||'';if(S.orgId)await ldSet();
      if(S.orgData&&!isOrgActive(S.orgData)){toast(orgBlockMsg(S.orgData),'err');btn.disabled=false;btn.textContent=t('login');return}
      S.role='admin';S.uid=doc.id;S.uname=data.name||'Admin';S.adminRole='orgadmin';S.tab='home';
      await initA();return}
    if(role==='parent'){
      const u=($('lU')||{}).value?.trim().toLowerCase(),pw=$('lPw').value.trim();
      if(!u||!pw){toast(t('fillAll'),'err');btn.disabled=false;btn.textContent=t('login');return}
      const snap=await db.collection('parents').where('username','==',u).get();
      if(snap.empty){toast(t('notFound'),'err');btn.disabled=false;btn.textContent=t('login');return}
      const doc=snap.docs[0],data=doc.data();
      if(!data.hasApp){toast('App access not enabled','err');btn.disabled=false;btn.textContent=t('login');return}
      if(data.password!==pw){toast(t('wrongPassword'),'err');btn.disabled=false;btn.textContent=t('login');return}
      S.uid=doc.id;S.uname=data.name||'Parent';S.orgId=data.orgId||'';S.pPhone=data.phone||'';
      // Load children
      const cSnap=await db.collection('students').where('parentId','==',doc.id).get();
      S.pChildren=cSnap.docs.map(d=>({id:d.id,...d.data()}));
      S.pChild=S.pChildren[0]||null;S.pChildId=S.pChild?.id||'';
      S.pTeacherId=S.pChild?.teacherId||'';
      if(S.orgId)await ldSet();
      if(S.orgData&&!isOrgActive(S.orgData)){
        app.innerHTML=`<div style="text-align:center;padding:60px 20px"><div style="font-size:56px">🔒</div>
        <div class="h2" style="margin-top:16px">Access Restricted</div>
        <p class="sub" style="margin-top:8px;font-size:13px">${orgBlockMsg(S.orgData)}</p>
        <button class="btn btn-s" style="margin-top:20px" onclick="doLogout()">← ${t('back')}</button></div>`;return}
      // Get teacher name
      if(S.pTeacherId){try{const td=await db.collection('teachers').doc(S.pTeacherId).get();S.pTeacherName=td.exists?td.data().name:'Teacher'}catch(e){S.pTeacherName='Teacher'}}
      S.role='parent';S.tab='home';R();return}
    // Teacher / Student
    const u=($('lU')||{}).value?.trim().toLowerCase(),p=$('lPw').value.trim();
    if(!u||!p){toast(t('fillAll'),'err');btn.disabled=false;btn.textContent=t('login');return}
    const col=role==='teacher'?'teachers':'students';
    const snap=await db.collection(col).where('username','==',u).get();
    if(snap.empty){toast(t('notFound'),'err');btn.disabled=false;btn.textContent=t('login');return}
    const doc=snap.docs[0],data=doc.data();
    if(data.password!==p){toast(t('wrongPassword'),'err');btn.disabled=false;btn.textContent=t('login');return}
    S.uid=doc.id;S.uname=data.name||data.username;S.role=role;S.orgId=data.orgId||'';
    if(S.orgId)await ldSet();
    if(S.orgData&&!isOrgActive(S.orgData)){
      app.innerHTML=`<div style="text-align:center;padding:60px 20px"><div style="font-size:56px">🔒</div>
      <div class="h2" style="margin-top:16px">Access Restricted</div>
      <p class="sub" style="margin-top:8px;font-size:13px;line-height:1.6">${orgBlockMsg(S.orgData)}</p>
      <button class="btn btn-s" style="margin-top:20px" onclick="doLogout()">← ${t('back')}</button></div>`;return}
    if(role==='teacher'){S.tab='home';await initTP()}
    else{S.teacherId=data.teacherId;S.tab='home';S.view='home';
      db.collection('students').doc(doc.id).update({lastSeen:Date.now()});
      await Promise.all([ldCats(data.teacherId),ldCR()]);
      S.unread=await getUnrd(S.uid);R()}
  }catch(e){toast(e.message,'err');btn.disabled=false;btn.textContent=t('login')}}

// ============ INIT ============
async function init(){
  try{db.enablePersistence({synchronizeTabs:true}).catch(()=>{})}catch(e){}
  try{R()}catch(e){app.innerHTML='<div style="text-align:center;padding:60px"><p style="color:#E74C3C">'+e.message+'</p></div>'}}
