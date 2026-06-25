// ====================== TEACHER ======================
async function initTP(){app.innerHTML='<div class="loading"><div class="loader"></div><p>Loading your classroom...</p></div>';
  const tDoc=await db.collection('teachers').doc(S.uid).get();S.tData=tDoc.data();
  await Promise.all([ldCats(S.uid),ldAC(S.uid),ldStu(S.uid),ldCR()]);
  S.unread=await getUnrd(S.uid);rTeacher()}

function rTeacher(){
  showNav([{id:'home',ico:'🏠',label:t('home')},{id:'cards',ico:'📚',label:t('cards')},{id:'students',ico:'👥',label:t('students')},{id:'quiz',ico:'🎮',label:t('quiz')},{id:'profile',ico:'👤',label:t('profile')}]);
  if(S.tab==='home')rTHome();else if(S.tab==='cards')rTCards();else if(S.tab==='students')rTStudents();
  else if(S.tab==='categories')rTCats();else if(S.tab==='messages')rTMsg();else if(S.tab==='wod')rTWod();
  else if(S.tab==='attendance')rTAtt();else if(S.tab==='quiz')rTQuiz();else if(S.tab==='profile')rTProfile()}

function rTHome(){
  const crs=(S.tData?.classroomIds||[]).map(id=>getCR(id)).join(', ')||'';
  const typeBadge=S.tData?.type==='vikar'?'<span class="tag tag-org">Vikar</span>':'';
  let h=`<div class="topbar"><div class="topbar-left"><div class="topbar-avatar" style="background:linear-gradient(135deg,var(--blu),var(--pur))">${S.logo?'<img src="'+S.logo+'">':(S.uname||'T')[0]}</div>
  <div class="topbar-info"><div class="name">${S.uname} ${typeBadge}</div><div class="greeting">${crs||'Teacher Dashboard'}</div></div></div>
  <div class="topbar-actions">${langSel()}<button class="btn btn-s btn-sm" onclick="doLogout()">🚪 ${t('logout')}</button></div></div>
  <div class="dash-grid">
    <div class="dash-card dc-green" onclick="S.tab='cards';R()"><div class="dc-icon">📚</div><div class="dc-title">${t('cards')}</div><div class="dc-sub">${S.cards.length} cards</div></div>
    <div class="dash-card dc-blue" onclick="S.tab='categories';R()"><div class="dc-icon">📁</div><div class="dc-title">${t('categories')}</div><div class="dc-sub">Organize topics</div></div>
    <div class="dash-card dc-purple" onclick="S.tab='students';R()"><div class="dc-icon">👥</div><div class="dc-title">${t('students')}</div><div class="dc-sub">${S.students.length} students</div></div>
    <div class="dash-card dc-orange" onclick="S.tab='messages';R()"><div class="dc-icon">💬</div><div class="dc-title">${t('messages')}</div><div class="dc-sub">Chat with students</div></div>
    <div class="dash-card dc-cyan" onclick="S.tab='wod';R()"><div class="dc-icon">✨</div><div class="dc-title">${t('wordOfDay')}</div><div class="dc-sub">Set daily word</div></div>
    <div class="dash-card dc-pink" onclick="S.tab='attendance';R()"><div class="dc-icon">📋</div><div class="dc-title">${t('attendance')}</div><div class="dc-sub">Track daily</div></div>
  </div>`;app.innerHTML=h}

// Teacher Cards
function rTCards(){let h=`<div class="topbar"><div class="h2">📚 ${t('cards')}</div><button class="btn btn-p btn-sm" onclick="showAddCard()">+ ${t('add')}</button></div>
  <div class="chip-row"><div class="chip ${!S.selCat?'on':''}" onclick="S.selCat=null;fC()">${t('all')}</div>`;
  S.cats.forEach(c=>{h+=`<div class="chip ${S.selCat===c.id?'on':''}" onclick="S.selCat='${c.id}';fC()">${c.name}</div>`});h+='</div>';
  const fl=S.selCat?S.cards.filter(c=>c.categoryId===S.selCat):S.cards;
  if(!fl.length)h+='<div class="empty"><div class="e-ico">🃏</div><p>'+t('noCards')+'</p></div>';
  else{h+='<div class="card-grid">';fl.forEach(c=>{h+=`<div class="flash-card" onclick="editCrd('${c.id}')">${c.imageUrl?'<img src="'+c.imageUrl+'" alt="">':'<div style="width:100%;aspect-ratio:1;background:var(--card);display:flex;align-items:center;justify-content:center;font-size:40px">🖼</div>'}
    <div class="fc-label"><div class="fc-gur">${c.gurmukhi}</div><div class="fc-eng">${c.english}</div></div></div>`});h+='</div>'}
  app.innerHTML=h}
async function fC(){if(S.selCat)await ldCards(S.selCat);else await ldAC(S.uid);rTeacher()}

function editCrd(cid){const c=S.cards.find(x=>x.id===cid);
  app.innerHTML=`<button class="back" onclick="rTeacher()">← ${t('back')}</button>
  ${c.imageUrl?'<img src="'+c.imageUrl+'" style="width:100%;height:200px;object-fit:cover;border-radius:var(--r3);margin-bottom:14px">':''}
  <div class="panel"><div class="panel-title">✏️ ${t('edit')}</div>
  <div class="fld"><label class="lbl">${t('gurmukhi')}</label><input class="inp" id="ecG" value="${c.gurmukhi}" style="font-size:20px"></div>
  <div class="fld"><label class="lbl">${t('english')}</label><input class="inp" id="ecE" value="${c.english}"></div>
  <div class="flex gap-8"><button class="btn btn-p flex-1" onclick="svCrd('${cid}')">${t('save')}</button>
  ${c.audioUrl?'<button class="btn btn-s flex-1" onclick="playA(\''+c.audioUrl+'\')">🔊 Play</button>':''}
  <button class="btn btn-d flex-1" onclick="delCrd('${cid}')">🗑</button></div></div>`}
async function svCrd(cid){await db.collection('cards').doc(cid).update({gurmukhi:$('ecG').value.trim(),english:$('ecE').value.trim()});await ldAC(S.uid);toast(t('saved'));rTeacher()}
async function delCrd(id){if(!confirm('?'))return;await db.collection('cards').doc(id).delete();await ldAC(S.uid);toast(t('deleted'));rTeacher()}

function showAddCard(){recBlob=null;let h=`<button class="back" onclick="rTeacher()">← ${t('back')}</button><div class="panel"><div class="panel-title">✏️ ${t('add')} ${t('cards')}</div>
  <div class="help-tip"><span class="h-ico">💡</span><div>${t('helpCard')}</div></div>
  <div class="fld"><label class="lbl">${t('categories')}</label><select class="inp" id="cC">`;S.cats.forEach(c=>{h+=`<option value="${c.id}">${c.name}</option>`});
  h+=`</select></div><div class="fld"><label class="lbl">${t('gurmukhi')}</label><input class="inp" id="cG" style="font-size:20px" placeholder="ਸੇਬ"></div>
  <div class="fld"><label class="lbl">${t('english')}</label><input class="inp" id="cE" placeholder="Apple"></div>
  <div class="fld"><label class="lbl">📸 ${t('picture')}</label><button class="btn btn-s btn-w" onclick="$('iF').click()">📸 Upload</button>
  <input type="file" accept="image/*" id="iF" style="display:none" onchange="pvI(this)"><div id="iPv"></div></div>
  <div class="fld"><label class="lbl">🖼️ Examples (optional)</label><div class="flex gap-8">
  <button class="btn btn-s flex-1" onclick="$('iF2').click()">Ex.1</button><button class="btn btn-s flex-1" onclick="$('iF3').click()">Ex.2</button></div>
  <input type="file" accept="image/*" id="iF2" style="display:none" onchange="pvEx(this,2)"><input type="file" accept="image/*" id="iF3" style="display:none" onchange="pvEx(this,3)">
  <div class="flex gap-8 mt-14"><div id="iPv2"></div><div id="iPv3"></div></div></div>
  <div class="fld"><label class="lbl">🔊 ${t('audio')}</label><div class="flex gap-8 items-center">
  <button class="btn-icon" id="rB" onclick="tgR()" style="background:var(--red);color:#fff">🎙</button><span id="aS" class="sub2">Tap to record</span></div>
  <input type="file" accept="audio/*" id="aF" onchange="pvAF(this)" style="font-size:11px;color:var(--txt3);margin-top:6px"><div id="aPv" style="margin-top:6px"></div></div>
  <button class="btn btn-p btn-w" id="svB" onclick="svNewCrd()">💾 ${t('save')}</button></div>`;app.innerHTML=h}
function pvI(i){if(i.files[0]){const r=new FileReader();r.onload=e=>{$('iPv').innerHTML='<img style="width:100%;max-height:150px;border-radius:12px;margin-top:8px;object-fit:cover" src="'+e.target.result+'">'};r.readAsDataURL(i.files[0])}}
function pvEx(i,n){if(i.files[0]){const r=new FileReader();r.onload=e=>{$('iPv'+n).innerHTML='<img style="width:60px;height:60px;border-radius:8px;object-fit:cover" src="'+e.target.result+'">'};r.readAsDataURL(i.files[0])}}
async function tgR(){if(mRec&&mRec.state==='recording'){mRec.stop();$('rB').style.background='var(--red)';$('rB').innerHTML='🎙';return}
  try{const st=await navigator.mediaDevices.getUserMedia({audio:true});aCh=[];mRec=new MediaRecorder(st);mRec.ondataavailable=e=>aCh.push(e.data);
    mRec.onstop=()=>{recBlob=new Blob(aCh,{type:'audio/webm'});st.getTracks().forEach(t=>t.stop());$('aPv').innerHTML='<audio controls src="'+URL.createObjectURL(recBlob)+'" style="width:100%;height:36px"></audio>';$('aS').textContent='✅ Done'};
    mRec.start();$('rB').innerHTML='⏹';$('aS').textContent='🔴 Recording...'}catch(e){toast('Mic denied','err')}}
function pvAF(i){if(i.files[0]){recBlob=i.files[0];$('aPv').innerHTML='<audio controls src="'+URL.createObjectURL(recBlob)+'" style="width:100%;height:36px"></audio>';$('aS').textContent='✅'}}
async function svNewCrd(){const cat=$('cC').value,g=$('cG').value.trim(),e=$('cE').value.trim(),img=$('iF').files[0],img2=$('iF2')?.files[0],img3=$('iF3')?.files[0];
  if(!g||!e)return toast(t('fillAll'),'err');const btn=$('svB');btn.disabled=true;
  try{let iu='',au='',iu2='',iu3='';if(img){btn.textContent='📸...';iu=await compImg(img)}if(img2){iu2=await compImg(img2)}if(img3){iu3=await compImg(img3)}
    if(recBlob){btn.textContent='🔊...';au=await b64(recBlob)}
    await db.collection('cards').add({categoryId:cat,gurmukhi:g,english:e,imageUrl:iu,imageUrl2:iu2||'',imageUrl3:iu3||'',audioUrl:au,teacherId:S.uid,orgId:S.orgId,createdAt:Date.now()});
    recBlob=null;toast(t('saved'));await ldAC(S.uid);S.tab='cards';rTeacher()}catch(er){toast('Error','err');btn.disabled=false;btn.textContent='💾'}}

// Teacher Categories
function rTCats(){let h=`<button class="back" onclick="S.tab='home';rTeacher()">← ${t('back')}</button><div class="topbar"><div class="h2">📁 ${t('categories')}</div>
  <button class="btn btn-p btn-sm" onclick="showAddCat()">+ ${t('add')}</button></div>
  <div class="help-tip"><span class="h-ico">💡</span><div>${t('helpCat')}</div></div>`;
  S.cats.forEach((c,i)=>{const n=S.cards.filter(x=>x.categoryId===c.id).length;const colors=['#3B82F6','#8B5CF6','#2ECC71','#F59E0B','#EC4899','#06B6D4'];
    h+=`<div class="list-item clickable" onclick="editCat('${c.id}')"><div class="cat-circle" style="background:${colors[i%6]}">${c.gurmukhi?(c.gurmukhi)[0]:'📚'}</div>
    <div class="flex-1"><div class="h3">${c.name}</div><div class="sub2">${c.gurmukhi||''} · ${n} ${t('cards').toLowerCase()}</div></div><span class="sub2">✏️</span></div>`});
  app.innerHTML=h}
function showAddCat(){app.innerHTML=`<button class="back" onclick="S.tab='categories';rTeacher()">← ${t('back')}</button><div class="panel"><div class="panel-title">📁 ${t('add')}</div>
  <div class="fld"><label class="lbl">${t('english')}</label><input class="inp" id="ncN"></div><div class="fld"><label class="lbl">${t('gurmukhi')}</label><input class="inp" id="ncG"></div>
  <button class="btn btn-p btn-w" onclick="addCat()">✅ ${t('create')}</button></div>`}
async function addCat(){const n=$('ncN').value.trim(),g=$('ncG').value.trim();if(!n)return toast(t('fillAll'),'err');
  await db.collection('categories').add({name:n,gurmukhi:g,emoji:'📚',teacherId:S.uid,orgId:S.orgId,createdAt:Date.now()});await ldCats(S.uid);toast(t('created'));S.tab='categories';rTeacher()}
function editCat(cid){const c=S.cats.find(x=>x.id===cid);app.innerHTML=`<button class="back" onclick="S.tab='categories';rTeacher()">← ${t('back')}</button><div class="panel"><div class="panel-title">✏️ ${t('edit')}</div>
  <div class="fld"><label class="lbl">${t('english')}</label><input class="inp" id="ecN" value="${c.name}"></div><div class="fld"><label class="lbl">${t('gurmukhi')}</label><input class="inp" id="ecGN" value="${c.gurmukhi||''}"></div>
  <div class="flex gap-8"><button class="btn btn-p flex-1" onclick="svCat('${cid}')">${t('save')}</button><button class="btn btn-d flex-1" onclick="delCat('${cid}')">🗑</button></div></div>`}
async function svCat(cid){await db.collection('categories').doc(cid).update({name:$('ecN').value.trim(),gurmukhi:$('ecGN').value.trim()});await ldCats(S.uid);toast(t('saved'));S.tab='categories';rTeacher()}
async function delCat(id){if(!confirm('?'))return;const s=await db.collection('cards').where('categoryId','==',id).get();const b=db.batch();s.docs.forEach(d=>b.delete(d.ref));b.delete(db.collection('categories').doc(id));await b.commit();await ldCats(S.uid);await ldAC(S.uid);toast(t('deleted'));S.tab='categories';rTeacher()}

// Teacher Students
function rTStudents(){let h=`<div class="topbar"><div class="h2">👥 ${t('students')}</div><button class="btn btn-p btn-sm" onclick="showAddStu()">+ ${t('add')}</button></div>
  <div class="help-tip"><span class="h-ico">💡</span><div>${t('helpStudent')}</div></div>`;
  S.students.forEach((s,i)=>{h+=`<div class="list-item clickable" onclick="showSD('${s.id}')"><div class="avatar ${avColor(i)}">${(s.name||'S')[0]}</div>
    <div class="flex-1"><div class="h3">${s.name}</div><div class="sub2">@${s.username} · <span class="tag tag-pur">${getCR(s.classroomId)}</span> · <span class="pw-tag">${s.password}</span></div></div></div>`});
  if(!S.students.length)h+='<div class="empty"><p>'+t('noStudents')+'</p></div>';app.innerHTML=h}

function showAddStu(){const myCR=(S.tData?.classroomIds||[]);let crOpts=myCR.map(id=>`<option value="${id}">${getCR(id)}</option>`).join('');
  app.innerHTML=`<button class="back" onclick="rTeacher()">← ${t('back')}</button><div class="panel"><div class="panel-title">➕ ${t('add')} ${t('student')}</div>
  <div class="fld"><label class="lbl">${t('fullName')}</label><input class="inp" id="sN"></div>
  <div class="fld"><label class="lbl">${t('dob')}</label><input class="inp" id="sDob" type="date"></div>
  <div class="fld"><label class="lbl">${t('contact')}</label><input class="inp" id="sCt"></div>
  <div class="fld"><label class="lbl">${t('classroom')}</label><select class="inp" id="sCR">${crOpts||'<option>—</option>'}</select></div>
  <div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="sU" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9]/g,'')"></div>
  <div class="fld"><label class="lbl">${t('password')}</label><input class="inp" id="sP"></div>
  <button class="btn btn-p btn-w" onclick="addSt()">✅ ${t('create')}</button></div>`}
async function addSt(){const n=$('sN').value.trim(),dob=$('sDob').value,ct=$('sCt').value.trim(),cr=$('sCR').value,u=$('sU').value.trim(),p=$('sP').value.trim();
  if(!n||!u||!p)return toast(t('fillAll'),'err');if(p.length<4)return toast('Min 4','err');
  if(!(await db.collection('students').where('username','==',u).get()).empty)return toast('Taken','err');
  await db.collection('students').add({name:n,dob,contact:ct,classroomId:cr,username:u,password:p,hasApp:true,teacherId:S.uid,orgId:S.orgId,createdAt:Date.now(),lastSeen:null,badges:[],xp:0,streak:0,lastPracticeDate:''});
  await ldStu(S.uid);toast(t('created'));rTeacher()}

async function showSD(sid){app.innerHTML='<div class="loading"><div class="loader"></div></div>';
  const stu=S.students.find(x=>x.id===sid);const aS=await db.collection('activity').where('studentId','==',sid).get();
  const acts=aS.docs.map(d=>d.data());const qz=acts.filter(a=>a.type==='quiz_complete');
  const tSc=qz.reduce((s,q)=>s+(q.score||0),0),tQ=qz.reduce((s,q)=>s+(q.total||0),0);const acc=tQ?Math.round(tSc/tQ*100):0;
  // Check absence reports for today
  const today=new Date().toISOString().split('T')[0];
  let absToday=null;try{const abSnap=await db.collection('absenceReports').where('studentId','==',sid).where('date','==',today).get();
    if(!abSnap.empty)absToday=abSnap.docs[0].data()}catch(e){}
  // Load parent info
  let parentData=null;
  if(stu.parentId){try{const pd=await db.collection('parents').doc(stu.parentId).get();if(pd.exists)parentData={id:pd.id,...pd.data()}}catch(e){}}
  let h=`<button class="back" onclick="rTeacher()">← ${t('back')}</button>
  <div style="text-align:center;margin-bottom:14px"><div class="avatar av-grn" style="width:56px;height:56px;font-size:24px;border-radius:18px;margin:0 auto">${(stu.name||'S')[0]}</div>
  <div class="h2" style="margin-top:8px">${stu.name}</div><div class="sub">${stu.username?'@'+stu.username+' · ':''}<span class="tag tag-pur">${getCR(stu.classroomId)}</span></div></div>`;
  // Absence alert
  if(absToday){h+=`<div class="panel" style="border:1.5px solid var(--warn);background:rgba(245,158,11,.06)"><div class="flex items-center gap-8"><span style="font-size:20px">⚠️</span><div><div class="h3" style="color:var(--warn)">Absence Reported Today</div><div class="sub2">Reason: ${absToday.reason||'—'} · ${absToday.note||''}</div><div class="sub2">Reported by: ${absToday.parentName||'Parent'} · ${fmt(absToday.timestamp)}</div></div></div></div>`}
  h+=`<div class="score-bar"><div class="score-card"><div class="score-val" style="color:var(--saf)">${qz.length}</div><div class="score-lbl">${t('quizzes')}</div></div>
  <div class="score-card"><div class="score-val" style="color:var(--grn)">${acc}%</div><div class="score-lbl">${t('accuracy')}</div></div>
  <div class="score-card"><div class="score-val" style="color:var(--warn)">🔥${stu.streak||0}</div><div class="score-lbl">${t('streak')}</div></div></div>`;
  // Parent info (read-only for teacher)
  h+=`<div class="panel"><div class="panel-title">👪 Parent</div>`;
  if(parentData){h+=`<div style="font-size:13px;line-height:2.2">👤 ${parentData.name||'—'}<br>📱 ${parentData.phone||'—'}${parentData.hasApp?' · <span class="tag tag-grn">App</span>':''}</div>
  ${parentData.hasApp?'<button class="btn btn-p btn-w" style="margin-top:10px" onclick="openParentChat(\''+parentData.id+'\',\''+esc(parentData.name)+'\',\''+sid+'\')">💬 Message Parent</button>':''}`}
  else{h+=`<p class="sub2">No parent linked — ask school admin to register parent</p>`}
  h+='</div>';
  h+=`<div class="panel"><div class="flex gap-8"><button class="btn btn-p flex-1" onclick="openTC('${sid}','${esc(stu.name)}')">💬 ${t('messages')}</button></div>
  <div class="flex gap-8 mt-14"><input class="inp" id="rpw" placeholder="${t('password')}"><button class="btn btn-s btn-sm" onclick="rstPw('${sid}')">${t('resetPassword')}</button></div>
  <button class="btn btn-d btn-w" style="margin-top:10px" onclick="delSt('${sid}')">🗑 ${t('delete')}</button></div>`;
  app.innerHTML=h}

// Teacher → Parent messaging (uses parent doc ID directly)
async function openParentChat(parentId,pName,stuId){
  app.innerHTML='<div class="loading"><div class="loader"></div></div>';
  await markRd(S.uid,parentId);S.unread=await getUnrd(S.uid);const msgs=await getMsgs(S.uid,parentId);
  const backTarget=stuId?`showSD('${stuId}')`:'rTeacher()';
  let h=`<button class="back" onclick="${backTarget}">← ${t('back')}</button><div class="panel"><div class="panel-title">👪 ${pName}</div><div class="msg-list" id="mL">`;
  if(!msgs.length)h+='<div class="empty"><p>'+t('noMessages')+'</p></div>';
  else msgs.forEach(m=>{const s=m.fromId===S.uid;h+=`<div class="msg-bub ${s?'msg-sent':'msg-recv'} ${s&&m.read?'msg-read':''}">${!s?'<div class="msg-name">'+m.fromName+'</div>':''}${m.text}${m.tag&&m.tag!=='general'?'<span class="tag tag-org" style="margin-left:6px;font-size:9px">'+m.tag+'</span>':''}
  <div class="msg-time">${fmt(m.timestamp)}${s?(m.read?' ✅':' ◻️'):''}</div></div>`});
  h+=`</div><div class="msg-compose"><input class="inp" id="mI" placeholder="Message parent..." onkeydown="if(event.key==='Enter')sndPM('${parentId}','${esc(pName)}')"><button class="btn btn-p btn-sm" onclick="sndPM('${parentId}','${esc(pName)}')">${t('send')}</button></div></div>`;
  app.innerHTML=h;const l=$('mL');if(l)l.scrollTop=l.scrollHeight}
async function sndPM(parentId,pName){const x=$('mI').value.trim();if(!x)return;$('mI').value='';
  await sendMsg(S.uid,S.uname,'teacher',parentId,pName,x);openParentChat(parentId,pName,'')}
async function rstPw(sid){const p=$('rpw').value.trim();if(!p||p.length<4)return;await db.collection('students').doc(sid).update({password:p});toast(t('saved'))}
async function delSt(sid){if(!confirm('?'))return;await db.collection('students').doc(sid).delete();await ldStu(S.uid);toast(t('deleted'));rTeacher()}

// Teacher Messages
async function rTMsg(){
  // Count unread per contact
  const allUnrd=await db.collection('messages').where('toId','==',S.uid).where('read','==',false).get();
  const unrdMap={};allUnrd.docs.forEach(d=>{const fid=d.data().fromId;unrdMap[fid]=(unrdMap[fid]||0)+1});
  // Load parents for my students
  const parentIds=[...new Set(S.students.map(s=>s.parentId).filter(Boolean))];
  let myParents=[];
  for(const pid of parentIds){try{const pd=await db.collection('parents').doc(pid).get();if(pd.exists&&pd.data().hasApp)myParents.push({id:pd.id,...pd.data()})}catch(e){}}
  let h=`<button class="back" onclick="S.tab='home';rTeacher()">← ${t('back')}</button><div class="topbar"><div class="h2">💬 ${t('messages')}</div></div>
  <div class="help-tip"><span class="h-ico">💡</span><div>${t('helpMsg')}</div></div>
  <div class="dash-grid" style="margin-bottom:14px">
    <div class="dash-card dc-green" onclick="tBc('students')"><div class="dc-icon">📢</div><div class="dc-title">All ${t('students')}</div></div>
    <div class="dash-card dc-orange" onclick="tBc('parents')"><div class="dc-icon">👪</div><div class="dc-title">All ${t('parents')}</div></div></div>
  <div class="sec-title">${t('students')}</div>`;
  S.students.forEach((s,i)=>{const u=unrdMap[s.id]||0;h+=`<div class="list-item clickable" onclick="openTC('${s.id}','${esc(s.name||s.username)}')"><div class="avatar ${avColor(i)}">${(s.name||'S')[0]}</div><div class="flex-1"><div class="h3">${s.name||s.username}${u?'<span class="unread-badge">'+u+'</span>':''}</div></div></div>`});
  if(myParents.length){h+=`<div class="sec-title" style="margin-top:14px">👪 ${t('parents')}</div>`;
    myParents.forEach((p,i)=>{const kids=S.students.filter(s=>s.parentId===p.id).map(s=>s.name).join(', ');const u=unrdMap[p.id]||0;
      h+=`<div class="list-item clickable" onclick="openParentChat('${p.id}','${esc(p.name)}','')"><div class="avatar av-org">${(p.name||'P')[0]}</div><div class="flex-1"><div class="h3">${p.name}${u?'<span class="unread-badge">'+u+'</span>':''}</div><div class="sub2">${kids}</div></div></div>`})}
  window._myParents=myParents;
  app.innerHTML=h}
async function openTC(sid,name){app.innerHTML='<div class="loading"><div class="loader"></div></div>';await markRd(S.uid,sid);S.unread=await getUnrd(S.uid);const msgs=await getMsgs(S.uid,sid);
  let h=`<button class="back" onclick="rTeacher()">← ${t('back')}</button><div class="panel"><div class="panel-title">💬 ${name}</div><div class="msg-list" id="mL">`;
  if(!msgs.length)h+='<div class="empty"><p>'+t('noMessages')+'</p></div>';else msgs.forEach(m=>{const s=m.fromId===S.uid;h+=`<div class="msg-bub ${s?'msg-sent':'msg-recv'} ${s&&m.read?'msg-read':''}">${!s?'<div class="msg-name">'+m.fromName+'</div>':''}${m.text}<div class="msg-time">${fmt(m.timestamp)}${s?(m.read?' ✅':' ◻️'):''}</div></div>`});
  h+=`</div><div class="msg-compose"><input class="inp" id="mI" placeholder="..." onkeydown="if(event.key==='Enter')sndTM('${sid}','${esc(name)}')"><button class="btn btn-p btn-sm" onclick="sndTM('${sid}','${esc(name)}')">${t('send')}</button></div></div>`;
  app.innerHTML=h;const l=$('mL');if(l)l.scrollTop=l.scrollHeight}
async function sndTM(sid,name){const x=$('mI').value.trim();if(!x)return;$('mI').value='';await sendMsg(S.uid,S.uname,'teacher',sid,name,x);openTC(sid,name)}
async function tBc(target){
  const label=target==='parents'?'All Parents':'All Students';
  app.innerHTML=`<button class="back" onclick="rTeacher()">← ${t('back')}</button><div class="panel"><div class="panel-title">📢 ${label}</div>
  ${target==='parents'?'<div class="fld"><label class="lbl">Tag</label><select class="inp" id="bcTag"><option value="general">📋 General</option><option value="homework">📝 Homework</option><option value="event">🎉 Event</option><option value="urgent">🚨 Urgent</option></select></div>':''}
  <div class="fld"><textarea class="inp" id="bcM" rows="3" placeholder="Type your message..."></textarea></div>
  <button class="btn btn-p btn-w" id="bcB" onclick="sndTBc('${target}')">📢 ${t('send')}</button></div>`}
async function sndTBc(target){const x=$('bcM').value.trim();if(!x)return;$('bcB').disabled=true;
  const tag=$('bcTag')?.value||'general';
  if(target==='parents'){const pw=window._myParents||[];
    for(const p of pw)await sendMsg(S.uid,S.uname,'teacher',p.id,p.name,x,tag);
    toast(`Sent to ${pw.length} parents ✅`)}
  else{for(const s of S.students)await sendMsg(S.uid,S.uname,'teacher',s.id,s.name,x);toast(t('sent'))}
  rTeacher()}

// Teacher WoD
function rTWod(){let h=`<button class="back" onclick="S.tab='home';rTeacher()">← ${t('back')}</button><div class="panel"><div class="panel-title">✨ ${t('wordOfDay')}</div>
  <div class="help-tip"><span class="h-ico">💡</span><div>${t('helpWod')}</div></div>
  <div class="fld"><select class="inp" id="wC"><option value="">— ${t('cards')} —</option>`;
  S.cards.forEach(c=>{h+=`<option value="${c.id}">${c.gurmukhi} — ${c.english}</option>`});
  h+=`</select></div><button class="btn btn-p btn-w" onclick="setWod()">✨ Set</button></div><div id="wCur"></div>`;app.innerHTML=h;setTimeout(ldWod,0)}
async function ldWod(){const today=new Date().toISOString().split('T')[0];const s=await db.collection('wordOfDay').where('teacherId','==',S.uid).where('date','==',today).get();const el=$('wCur');if(!el)return;
  if(s.empty){el.innerHTML='<div class="empty"><p>None set today</p></div>';return}const w=s.docs[0].data();
  el.innerHTML=`<div class="wod-card"><div class="wod-lbl">Today</div>${w.imageUrl?'<img class="wod-img" src="'+w.imageUrl+'">':''}<div class="wod-gur">${w.gurmukhi}</div><div class="wod-eng">${w.english}</div></div>`}
async function setWod(){const cid=$('wC').value;if(!cid)return;const card=S.cards.find(c=>c.id===cid);const today=new Date().toISOString().split('T')[0];
  const old=await db.collection('wordOfDay').where('teacherId','==',S.uid).where('date','==',today).get();if(!old.empty){const b=db.batch();old.docs.forEach(d=>b.delete(d.ref));await b.commit()}
  await db.collection('wordOfDay').add({teacherId:S.uid,orgId:S.orgId,date:today,gurmukhi:card.gurmukhi,english:card.english,imageUrl:card.imageUrl||'',audioUrl:card.audioUrl||''});toast(t('saved'));rTWod()}

// Teacher Attendance
let attDate=new Date().toISOString().split('T')[0],attMarks={};
function rTAtt(){app.innerHTML=`<button class="back" onclick="S.tab='home';rTeacher()">← ${t('back')}</button>
  <div class="panel"><div class="panel-header"><div class="panel-title">📋 ${t('attendance')}</div>
  <input class="inp" type="date" value="${attDate}" style="width:auto;padding:8px;font-size:12px" onchange="attDate=this.value;loadTAtt()"></div>
  <div class="help-tip"><span class="h-ico">⚡</span><div>${t('helpAtt')}</div></div>
  <div id="attBody"><div class="loading"><div class="loader"></div></div></div></div>`;setTimeout(loadTAtt,0)}

async function loadTAtt(){const el=$('attBody');if(!el)return;
  const ex=await db.collection('attendance').where('teacherId','==',S.uid).where('date','==',attDate).get();
  if(!ex.empty){const d=ex.docs[0].data();attMarks={};(d.records||[]).forEach(r=>{attMarks[r.studentId]=r.status})}
  else{attMarks={};S.students.forEach(s=>{attMarks[s.id]='unmarked'})}
  // Load absence reports from parents for this date
  let absReports={};try{const abSnap=await db.collection('absenceReports').where('teacherId','==',S.uid).where('date','==',attDate).get();
    abSnap.docs.forEach(d=>{const r=d.data();absReports[r.studentId]=r})}catch(e){}
  renderAttList(absReports)}

function renderAttList(absReports){const el=$('attBody');if(!el)return;absReports=absReports||{};
  // Show parent absence reports at top
  const absKeys=Object.keys(absReports);
  let h='';
  if(absKeys.length){h+=`<div class="panel" style="border:1.5px solid var(--warn);background:rgba(245,158,11,.04);margin-bottom:12px"><div class="panel-title" style="color:var(--warn)">👪 Parent Absence Reports</div>`;
    absKeys.forEach(sid=>{const r=absReports[sid];h+=`<div style="padding:6px 0;border-bottom:1px solid var(--brd);font-size:13px">⚠️ <b>${r.studentName}</b> — ${r.reason||'—'} ${r.note?'· '+r.note:''} <span class="sub2">by ${r.parentName||'Parent'}</span></div>`});h+='</div>'}
  h+=`<div class="flex gap-8 mb-14"><button class="btn btn-g flex-1" onclick="markAll('present')">✅ All Present</button><button class="btn btn-d flex-1" onclick="markAll('absent')">❌ All Absent</button></div>`;
  S.students.forEach(s=>{const st=attMarks[s.id]||'unmarked';const hasReport=absReports[s.id];
    h+=`<div class="att-row${hasReport?' att-reported':''}"><div class="att-name">${s.name}${hasReport?'<span class="tag tag-org" style="margin-left:6px;font-size:9px">Reported</span>':''}<div class="sub2"><span class="tag tag-pur">${getCR(s.classroomId)}</span></div></div>
    <button class="att-btn ${st==='present'?'present':st==='absent'?'absent':'unmarked'}" onclick="toggleAtt('${s.id}')">${st==='present'?'✅':st==='absent'?'❌':'—'}</button></div>`});
  const pC=Object.values(attMarks).filter(v=>v==='present').length,aC=Object.values(attMarks).filter(v=>v==='absent').length;
  h+=`<div class="score-bar mt-14"><div class="score-card"><div class="score-val" style="color:var(--grn)">${pC}</div><div class="score-lbl">Present</div></div>
  <div class="score-card"><div class="score-val" style="color:var(--red)">${aC}</div><div class="score-lbl">Absent</div></div>
  <div class="score-card"><div class="score-val">${S.students.length}</div><div class="score-lbl">Total</div></div></div>
  <div class="fld"><label class="lbl">📝 Remark</label><input class="inp" id="attRemark" placeholder="Note for today..."></div>
  <button class="btn btn-p btn-w" onclick="saveAtt()">💾 Mark ${t('attendance')}</button>`;el.innerHTML=h}

function toggleAtt(sid){attMarks[sid]=attMarks[sid]==='present'?'absent':'present';renderAttList()}
function markAll(st){S.students.forEach(s=>{attMarks[s.id]=st});renderAttList()}
async function saveAtt(){const records=S.students.map(s=>({studentId:s.id,studentName:s.name,status:attMarks[s.id]||'unmarked'}));const remark=$('attRemark')?.value?.trim()||'';
  const ex=await db.collection('attendance').where('teacherId','==',S.uid).where('date','==',attDate).get();
  if(!ex.empty){const b=db.batch();ex.docs.forEach(d=>b.delete(d.ref));await b.commit()}
  const now=new Date();await db.collection('attendance').add({teacherId:S.uid,teacherName:S.uname,signedBy:S.uname,signedAt:now.toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}),orgId:S.orgId,
    date:attDate,remark,classroomIds:S.tData?.classroomIds||[],records,presentCount:records.filter(r=>r.status==='present').length,absentCount:records.filter(r=>r.status==='absent').length,totalCount:records.length,timestamp:Date.now()});
  toast(t('saved'));confetti()}

// Teacher Quiz Groups
function rTQuiz(){let h=`<div class="topbar"><div class="h2">🎮 ${t('quizGroups')}</div><button class="btn btn-p btn-sm" onclick="showAQ()">+ ${t('add')}</button></div>
  <div class="help-tip"><span class="h-ico">💡</span><div>${t('helpQuiz')}</div></div>
  <div id="qgL"><div class="loading"><div class="loader"></div></div></div>`;app.innerHTML=h;setTimeout(ldQG,0)}
async function ldQG(){const s=await db.collection('quizGroups').where('teacherId','==',S.uid).get();const el=$('qgL');if(!el)return;
  if(s.empty){el.innerHTML='<div class="empty"><p>Auto random mode</p></div>';return}
  let h='';s.docs.forEach(d=>{const g=d.data();h+=`<div class="list-item"><span style="font-size:20px">🎮</span><div class="flex-1"><div class="h3">${g.name}</div></div>
  <button class="btn-icon" style="background:var(--red)" onclick="delQG('${d.id}')">🗑</button></div>`});el.innerHTML=h}
async function delQG(id){await db.collection('quizGroups').doc(id).delete();rTQuiz()}
function showAQ(){let opts=S.cats.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
  app.innerHTML=`<button class="back" onclick="rTeacher()">← ${t('back')}</button><div class="panel"><div class="panel-title">🎮 ${t('add')}</div>
  <div class="fld"><label class="lbl">${t('name')}</label><input class="inp" id="qgN"></div>
  <div class="fld"><label class="lbl">${t('categories')}</label><select class="inp" id="qgC" onchange="ldQGC()">${opts}</select></div>
  <div class="fld" id="qgCL"></div>
  <button class="btn btn-p btn-w" onclick="svQG()">💾 ${t('save')}</button></div>`;setTimeout(ldQGC,0)}
async function ldQGC(){const s=await db.collection('cards').where('categoryId','==',$('qgC').value).get();let h='';
  if(s.size<4)h='<p class="sub2" style="color:var(--red)">Need 4+ cards</p>';
  else s.docs.forEach(d=>{const c=d.data();h+=`<label class="flex items-center gap-8" style="padding:6px 0;border-bottom:1px solid var(--brd);font-size:12px;cursor:pointer"><input type="checkbox" class="qx" value="${d.id}" style="width:16px;height:16px"><b>${c.gurmukhi}</b> — ${c.english}</label>`});
  $('qgCL').innerHTML=h}
async function svQG(){const n=$('qgN').value.trim(),ids=[...document.querySelectorAll('.qx:checked')].map(c=>c.value);
  if(ids.length!==4||!n)return toast('4 cards + name','err');
  await db.collection('quizGroups').add({name:n,categoryId:$('qgC').value,cardIds:ids,teacherId:S.uid,orgId:S.orgId,createdAt:Date.now()});toast(t('created'));rTQuiz()}

// Teacher Profile
function rTProfile(){
  const typeBadge=S.tData?.type==='vikar'?'<span class="tag tag-org">Vikar</span>':'<span class="tag tag-grn">Permanent</span>';
  let crBoxes=S.classrooms.map(c=>{const checked=(S.tData?.classroomIds||[]).includes(c.id)?'checked':'';
    return`<label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:13px"><input type="checkbox" class="tpCrCb" value="${c.id}" ${checked}> ${c.name}</label>`}).join('');
  app.innerHTML=`<div class="topbar"><div class="h2">👤 ${t('profile')}</div></div>
  <div style="text-align:center;margin-bottom:16px"><div class="avatar av-blu" style="width:64px;height:64px;font-size:28px;border-radius:20px;margin:0 auto">${(S.uname||'T')[0]}</div>
  <div class="h2" style="margin-top:10px">${S.uname} ${typeBadge}</div><div class="sub">${(S.tData?.classroomIds||[]).map(id=>getCR(id)).join(', ')||'No classroom'}</div></div>
  <div class="panel"><div style="font-size:13px;line-height:2.2">📱 ${S.tData?.phone||'—'}<br>📧 ${S.tData?.email||'—'}<br>🎂 ${fmtDob(S.tData?.dob)}</div></div>
  <div class="panel"><div class="panel-title">🏫 My ${t('classrooms')}</div>
  <div class="help-tip"><span class="h-ico">💡</span><div>Select which classrooms you teach. Useful when changing classes for a new year.</div></div>
  ${crBoxes||'<p class="sub2">No classrooms created yet</p>'}
  <button class="btn btn-p btn-w" style="margin-top:10px" onclick="svTCR()">💾 Update ${t('classrooms')}</button></div>
  <button class="btn btn-d btn-w" onclick="doLogout()">🚪 ${t('logout')}</button>`}

async function svTCR(){const ids=[...document.querySelectorAll('.tpCrCb:checked')].map(c=>c.value);
  await db.collection('teachers').doc(S.uid).update({classroomIds:ids});
  S.tData.classroomIds=ids;toast(t('saved'));rTProfile()}
