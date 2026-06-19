// ====================== ADMIN ======================
async function initA(){app.innerHTML='<div class="loading"><div class="loader"></div><p>Loading dashboard...</p></div>';
  await Promise.all([ldT(),ldStu(),ldCR()]);rAdmin()}

function rAdmin(){
  showNav([{id:'home',ico:'🏠',label:t('home')},{id:'classrooms',ico:'🏫',label:t('classrooms')},{id:'teachers',ico:'👩‍🏫',label:t('teachers')},{id:'students',ico:'👥',label:t('students')},{id:'settings',ico:'⚙️',label:'More'}]);
  if(S.tab==='home')rAHome();else if(S.tab==='classrooms')rACR();else if(S.tab==='teachers')rATeach();else if(S.tab==='students')rAStu();
  else if(S.tab==='messages')rAMsg();else if(S.tab==='attendance')rAAtt();else if(S.tab==='settings')rASet()}

function rAHome(){
  // Birthday check
  const bdT=[],bdS=[];[...S.teachers,...S.students].forEach(p=>{const role=S.teachers.includes(p)?'👩‍🏫':'🧑‍🎓';if(isBdayToday(p.dob))bdT.push({...p,role});else{const d=isBdaySoon(p.dob);if(d)bdS.push({...p,role,inDays:d})}});
  let h=`<div class="topbar"><div class="topbar-left"><div class="topbar-avatar">🛡️</div><div class="topbar-info"><div class="name">${S.uname}</div><div class="greeting">${t('admin')} Dashboard</div></div></div>
  <div class="topbar-actions">${langSel()}<button class="btn-icon" onclick="doLogout()">🚪</button></div></div>`;

  if(bdT.length){h+=`<div class="bday"><h4>🎂 ${t('todayBirthdays')}</h4>`;bdT.forEach(p=>{h+=`<div class="bday-item">${p.role} <b>${p.name}</b></div>`});h+='</div>'}
  if(bdS.length){h+=`<div class="bday" style="border-color:rgba(245,158,11,.2)"><h4 style="color:var(--saf)">📅 ${t('upcomingBirthdays')}</h4>`;bdS.forEach(p=>{h+=`<div class="bday-item">${p.role} <b>${p.name}</b> — ${p.inDays} ${t('days')}</div>`});h+='</div>'}

  h+=`<div class="dash-grid">
    <div class="dash-card dc-blue" onclick="S.tab='classrooms';R()"><div class="dc-icon">🏫</div><div class="dc-title">${t('classrooms')}</div><div class="dc-sub">${S.classrooms.length} total</div></div>
    <div class="dash-card dc-purple" onclick="S.tab='teachers';R()"><div class="dc-icon">👩‍🏫</div><div class="dc-title">${t('teachers')}</div><div class="dc-sub">${S.teachers.length} total</div></div>
    <div class="dash-card dc-green" onclick="S.tab='students';R()"><div class="dc-icon">👥</div><div class="dc-title">${t('students')}</div><div class="dc-sub">${S.students.length} total</div></div>
    <div class="dash-card dc-orange" onclick="S.tab='messages';R()"><div class="dc-icon">💬</div><div class="dc-title">${t('messages')}</div><div class="dc-sub">${t('broadcast')}</div></div>
    <div class="dash-card dc-cyan" onclick="S.tab='attendance';R()"><div class="dc-icon">📋</div><div class="dc-title">${t('attendance')}</div><div class="dc-sub">Reports & stats</div></div>
    <div class="dash-card dc-pink" onclick="S.tab='settings';R()"><div class="dc-icon">⚙️</div><div class="dc-title">${t('settings')}</div><div class="dc-sub">Logo & welcome</div></div>
  </div>`;app.innerHTML=h}

// Admin Classrooms
function rACR(){let h=`<div class="topbar"><div class="topbar-left"><div class="h2">🏫 ${t('classrooms')}</div></div><button class="btn btn-p btn-sm" onclick="showACRAdd()">+ ${t('add')}</button></div>
  <div class="help-tip"><span class="h-ico">💡</span><div>${t('helpClassroom')}</div></div>`;
  if(!S.classrooms.length)h+='<div class="empty"><div class="e-ico">🏫</div><p>No classrooms yet</p></div>';
  else S.classrooms.forEach((c,i)=>{const ts=S.teachers.filter(t=>(t.classroomIds||[]).includes(c.id));const sc=S.students.filter(s=>s.classroomId===c.id).length;
    h+=`<div class="panel" style="cursor:pointer" onclick="editACR('${c.id}')"><div class="flex items-center gap-12"><div class="cat-circle" style="background:linear-gradient(135deg,${['#3B82F6','#8B5CF6','#2ECC71','#F59E0B','#EC4899'][i%5]},${['#2563EB','#7C3AED','#27AE60','#D97706','#DB2777'][i%5]})">🏫</div>
    <div class="flex-1"><div class="h3">${c.name}</div><div class="sub2">👩‍🏫 ${ts.map(t=>t.name).join(', ')||'—'} · ${sc} students</div></div></div></div>`});
  app.innerHTML=h}
function showACRAdd(){app.innerHTML=`<button class="back" onclick="rAdmin()">← ${t('back')}</button><div class="panel"><div class="panel-title">🏫 ${t('add')} ${t('classroom')}</div>
  <div class="help-tip"><span class="h-ico">💡</span><div>${t('helpClassroom')}</div></div>
  <div class="fld"><label class="lbl">${t('name')}</label><input class="inp" id="crN" placeholder="e.g. Class A"></div>
  <button class="btn btn-p btn-w" onclick="addACR()">✅ ${t('create')}</button></div>`}
async function addACR(){const n=$('crN').value.trim();if(!n)return toast(t('fillAll'),'err');await db.collection('classrooms').add({name:n,createdAt:Date.now()});await ldCR();toast(t('created'));rAdmin()}
function editACR(id){const c=S.classrooms.find(x=>x.id===id);const assigned=S.teachers.filter(t=>(t.classroomIds||[]).includes(id));
  let tOpts=`<option value="">— No temp teacher —</option>`;S.teachers.forEach(t=>{tOpts+=`<option value="${t.id}" ${c.tempTeacherId===t.id?'selected':''}>${t.name} ${t.type==='vikar'?'(Vikar)':''}</option>`});
  app.innerHTML=`<button class="back" onclick="rAdmin()">← ${t('back')}</button><div class="panel"><div class="panel-title">✏️ ${c.name}</div>
  <div class="fld"><label class="lbl">${t('name')}</label><input class="inp" id="ecrN" value="${c.name}"></div>
  <div style="margin-bottom:14px;font-size:12px;color:var(--txt3)">👩‍🏫 Assigned: ${assigned.map(t=>t.name).join(', ')||'None'}</div>
  <div class="panel" style="background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.2)"><div class="panel-title" style="color:var(--warn)">⚠️ Temp Teacher</div>
  <div class="fld"><select class="inp" id="ecrTemp">${tOpts}</select></div></div>
  <div class="flex gap-8"><button class="btn btn-p flex-1" onclick="svACR('${id}')">${t('save')}</button><button class="btn btn-d flex-1" onclick="delACR('${id}')">🗑</button></div></div>`}
async function svACR(id){await db.collection('classrooms').doc(id).update({name:$('ecrN').value.trim(),tempTeacherId:$('ecrTemp').value||null});await ldCR();toast(t('saved'));rAdmin()}
async function delACR(id){if(!confirm(t('delete')+'?'))return;await db.collection('classrooms').doc(id).delete();await ldCR();toast(t('deleted'));rAdmin()}

// Admin Teachers
function rATeach(){let h=`<div class="topbar"><div class="topbar-left"><div class="h2">👩‍🏫 ${t('teachers')}</div></div><button class="btn btn-p btn-sm" onclick="showAT()">+ ${t('add')}</button></div>`;
  S.teachers.forEach((x,i)=>{const crs=(x.classroomIds||[]).map(id=>getCR(id)).join(', ')||'—';const sc=S.students.filter(s=>s.teacherId===x.id).length;
    const typeBadge=x.type==='vikar'?'<span class="tag tag-org">Vikar</span>':'<span class="tag tag-grn">Perm</span>';
    h+=`<div class="list-item clickable" onclick="showATD('${x.id}')"><div class="avatar ${avColor(i)}">${(x.name||'T')[0]}</div>
    <div class="flex-1"><div class="h3">${x.name} ${typeBadge}</div><div class="sub2">🏫 ${crs} · ${sc} students · <span class="pw-tag">${x.password}</span></div></div></div>`});
  app.innerHTML=h}

function showAT(){let crOpts=S.classrooms.map(c=>`<label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:13px"><input type="checkbox" class="crCb" value="${c.id}"> ${c.name}</label>`).join('');
  app.innerHTML=`<button class="back" onclick="rAdmin()">← ${t('back')}</button><div class="panel"><div class="panel-title">➕ ${t('add')} ${t('teacher')}</div>
  <div class="help-tip"><span class="h-ico">💡</span><div>${t('helpTeacher')}</div></div>
  <div class="fld"><label class="lbl">${t('fullName')}</label><input class="inp" id="tN"></div>
  <div class="fld"><label class="lbl">${t('phone')}</label><input class="inp" id="tPh" type="tel"></div>
  <div class="fld"><label class="lbl">${t('dob')}</label><input class="inp" id="tDob" type="date"></div>
  <div class="fld"><label class="lbl">${t('email')}</label><input class="inp" id="tEm" type="email"></div>
  <div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="tU" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9]/g,'')"></div>
  <div class="fld"><label class="lbl">${t('password')}</label><input class="inp" id="tP"></div>
  <div class="fld"><label class="lbl">Type</label><select class="inp" id="tType"><option value="permanent">Permanent</option><option value="vikar">Substitute (Vikar)</option></select></div>
  <div class="fld"><label class="lbl">${t('classrooms')}</label>${crOpts||'<p class="sub2">Create classrooms first</p>'}</div>
  <button class="btn btn-p btn-w" onclick="addAT()">✅ ${t('create')}</button></div>`}

async function addAT(){const n=$('tN').value.trim(),ph=$('tPh').value.trim(),dob=$('tDob').value,em=$('tEm').value.trim(),u=$('tU').value.trim(),p=$('tP').value.trim(),ty=$('tType').value;
  if(!n||!u||!p)return toast(t('fillAll'),'err');if(p.length<4)return toast('Min 4','err');
  if(!(await db.collection('teachers').where('username','==',u).get()).empty)return toast('Taken','err');
  const crIds=[...document.querySelectorAll('.crCb:checked')].map(c=>c.value);
  await db.collection('teachers').add({name:n,phone:ph,dob,email:em,username:u,password:p,type:ty,classroomIds:crIds,createdAt:Date.now()});
  await ldT();toast(t('created'));rAdmin()}

async function showATD(tid){const x=S.teachers.find(v=>v.id===tid);
  app.innerHTML=`<button class="back" onclick="rAdmin()">← ${t('back')}</button>
  <div style="text-align:center;margin-bottom:16px"><div class="avatar av-pur" style="width:56px;height:56px;font-size:24px;border-radius:18px;margin:0 auto">${(x.name||'T')[0]}</div>
  <div class="h2" style="margin-top:10px">${x.name}</div><div class="sub">@${x.username} · <span class="pw-tag">${x.password}</span> · ${x.type==='vikar'?'🔄 Vikar':'📌 Permanent'}</div></div>
  <div class="panel"><div style="font-size:13px;line-height:2.2">📱 ${x.phone||'—'}<br>🎂 ${fmtDob(x.dob)}<br>📧 ${x.email||'—'}<br>🏫 ${(x.classroomIds||[]).map(id=>getCR(id)).join(', ')||'—'}</div></div>
  <div class="panel"><div class="panel-title">✏️ ${t('edit')}</div>
  <div class="fld"><label class="lbl">${t('name')}</label><input class="inp" id="eN" value="${x.name}"></div>
  <div class="fld"><label class="lbl">${t('password')}</label><input class="inp" id="eP" value="${x.password}"></div>
  <div class="fld"><label class="lbl">Type</label><select class="inp" id="eType"><option value="permanent" ${x.type!=='vikar'?'selected':''}>Permanent</option><option value="vikar" ${x.type==='vikar'?'selected':''}>Vikar</option></select></div>
  <div class="flex gap-8"><button class="btn btn-p flex-1" onclick="svATD('${tid}')">${t('save')}</button><button class="btn btn-d flex-1" onclick="delAT('${tid}')">🗑</button></div></div>`}

async function svATD(tid){await db.collection('teachers').doc(tid).update({name:$('eN').value.trim(),password:$('eP').value.trim(),type:$('eType').value});await ldT();toast(t('saved'));rAdmin()}
async function delAT(tid){if(!confirm(t('delete')+'?'))return;await db.collection('teachers').doc(tid).delete();await ldT();toast(t('deleted'));rAdmin()}

// Admin Students
function rAStu(){let h=`<div class="topbar"><div class="topbar-left"><div class="h2">👥 ${t('students')}</div></div></div>
  <div class="chip-row"><div class="chip ${!S.filterCR?'on':''}" onclick="S.filterCR=null;R()">${t('all')}</div>`;
  S.classrooms.forEach(c=>{h+=`<div class="chip ${S.filterCR===c.id?'on':''}" onclick="S.filterCR='${c.id}';R()">${c.name}</div>`});h+='</div>';
  let fl=S.students;if(S.filterCR)fl=fl.filter(s=>s.classroomId===S.filterCR);
  fl.forEach((s,i)=>{h+=`<div class="list-item clickable" onclick="showASD('${s.id}')"><div class="avatar ${avColor(i)}">${(s.name||'S')[0]}</div>
    <div class="flex-1"><div class="h3">${s.name}</div><div class="sub2">👩‍🏫 ${getT(s.teacherId)} · <span class="tag tag-pur">${getCR(s.classroomId)}</span> · <span class="pw-tag">${s.password}</span></div></div></div>`});
  app.innerHTML=h}

function showASD(sid){const s=S.students.find(x=>x.id===sid);
  let tOpts=S.teachers.map(x=>`<option value="${x.id}" ${s.teacherId===x.id?'selected':''}>${x.name}</option>`).join('');
  let crOpts=S.classrooms.map(c=>`<option value="${c.id}" ${s.classroomId===c.id?'selected':''}>${c.name}</option>`).join('');
  app.innerHTML=`<button class="back" onclick="rAdmin()">← ${t('back')}</button>
  <div style="text-align:center;margin-bottom:16px"><div class="avatar av-grn" style="width:56px;height:56px;font-size:24px;border-radius:18px;margin:0 auto">${(s.name||'S')[0]}</div>
  <div class="h2" style="margin-top:10px">${s.name}</div><div class="sub">@${s.username} · <span class="pw-tag">${s.password}</span></div></div>
  <div class="panel"><div style="font-size:13px;line-height:2">🎂 ${fmtDob(s.dob)} · 📱 ${s.contact||'—'}<br>👩‍🏫 ${getT(s.teacherId)} · 🏫 ${getCR(s.classroomId)}</div></div>
  <div class="panel"><div class="panel-title">🔄 ${t('reassign')}</div>
  <div class="fld"><label class="lbl">${t('changeTeacher')}</label><select class="inp" id="rsT">${tOpts}</select></div>
  <div class="fld"><label class="lbl">${t('changeClassroom')}</label><select class="inp" id="rsCR">${crOpts}</select></div>
  <button class="btn btn-p btn-w" onclick="reassignS('${sid}')">🔄 ${t('reassign')}</button></div>
  <div class="panel"><div class="panel-title">✏️ ${t('edit')}</div>
  <div class="fld"><label class="lbl">${t('name')}</label><input class="inp" id="esN" value="${s.name||''}"></div>
  <div class="fld"><label class="lbl">${t('password')}</label><input class="inp" id="esP" value="${s.password||''}"></div>
  <div class="flex gap-8"><button class="btn btn-p flex-1" onclick="svASD('${sid}')">${t('save')}</button><button class="btn btn-d flex-1" onclick="delASD('${sid}')">🗑</button></div></div>`}
async function reassignS(sid){await db.collection('students').doc(sid).update({teacherId:$('rsT').value,classroomId:$('rsCR').value});await ldStu();toast(t('saved'));rAdmin()}
async function svASD(sid){await db.collection('students').doc(sid).update({name:$('esN').value.trim(),password:$('esP').value.trim()});await ldStu();toast(t('saved'));rAdmin()}
async function delASD(sid){if(!confirm(t('delete')+'?'))return;await db.collection('students').doc(sid).delete();await ldStu();toast(t('deleted'));rAdmin()}

// Admin Messages
function rAMsg(){let h=`<div class="topbar"><div class="h2">💬 ${t('messages')}</div></div>
  <div class="dash-grid" style="margin-bottom:14px">
    <div class="dash-card dc-green" onclick="aBc('students')"><div class="dc-icon">📢</div><div class="dc-title">${t('students')}</div></div>
    <div class="dash-card dc-blue" onclick="aBc('teachers')"><div class="dc-icon">👩‍🏫</div><div class="dc-title">${t('teachers')}</div></div>
  </div>`;
  S.teachers.forEach((x,i)=>{h+=`<div class="list-item clickable" onclick="aChat('${x.id}','${esc(x.name)}')"><div class="avatar ${avColor(i)}">${(x.name||'T')[0]}</div><div class="flex-1"><div class="h3">${x.name}</div></div></div>`});
  app.innerHTML=h}
async function aBc(tg){app.innerHTML=`<button class="back" onclick="rAdmin()">← ${t('back')}</button><div class="panel"><div class="panel-title">📢 ${t('broadcast')}</div>
  <div class="fld"><textarea class="inp" id="bcM" rows="3" placeholder="${t('messages')}..."></textarea></div><button class="btn btn-p btn-w" id="bcB" onclick="sndABc('${tg}')">📢 ${t('send')}</button></div>`}
async function sndABc(tg){const txt=$('bcM').value.trim();if(!txt)return;$('bcB').disabled=true;for(const u of(tg==='teachers'?S.teachers:S.students))await sendMsg('admin','Admin','admin',u.id,u.name||u.username,txt);toast(t('sent'));rAdmin()}
async function aChat(uid,name){app.innerHTML='<div class="loading"><div class="loader"></div></div>';await markRd('admin',uid);const msgs=await getMsgs('admin',uid);
  let h=`<button class="back" onclick="rAdmin()">← ${t('back')}</button><div class="panel"><div class="panel-title">💬 ${name}</div><div class="msg-list" id="mL">`;
  if(!msgs.length)h+='<div class="empty"><p>'+t('noMessages')+'</p></div>';
  else msgs.forEach(m=>{const s=m.fromId==='admin';h+=`<div class="msg-bub ${s?'msg-sent':'msg-recv'}">${!s?'<div class="msg-name">'+m.fromName+'</div>':''}${m.text}<div class="msg-time">${fmt(m.timestamp)}</div></div>`});
  h+=`</div><div class="msg-compose"><input class="inp" id="mI" placeholder="..." onkeydown="if(event.key==='Enter')sndAM('${uid}','${esc(name)}')"><button class="btn btn-p btn-sm" onclick="sndAM('${uid}','${esc(name)}')">${t('send')}</button></div></div>`;
  app.innerHTML=h;const l=$('mL');if(l)l.scrollTop=l.scrollHeight}
async function sndAM(uid,name){const x=$('mI').value.trim();if(!x)return;$('mI').value='';await sendMsg('admin','Admin','admin',uid,name,x);aChat(uid,name)}

// Admin Attendance
function rAAtt(){let h=`<div class="topbar"><div class="h2">📋 ${t('attendance')}</div></div>
  <div class="help-tip"><span class="h-ico">💡</span><div>${t('helpAttAdmin')}</div></div>
  <div class="fld"><select class="inp" id="attMonth" onchange="loadAAtt()">`;
  for(let i=0;i<6;i++){const d=new Date();d.setMonth(d.getMonth()-i);const m=d.toISOString().substring(0,7);h+=`<option value="${m}">${d.toLocaleDateString(undefined,{month:'long',year:'numeric'})}</option>`}
  h+=`</select></div><div class="fld"><select class="inp" id="attCR" onchange="loadAAtt()"><option value="">${t('all')} ${t('classrooms')}</option>`;
  S.classrooms.forEach(c=>{h+=`<option value="${c.id}">${c.name}</option>`});
  h+=`</select></div><div id="aAttBody"><div class="loading"><div class="loader"></div></div></div>`;
  app.innerHTML=h;setTimeout(loadAAtt,0)}
async function loadAAtt(){const el=$('aAttBody');if(!el)return;const month=$('attMonth')?.value||new Date().toISOString().substring(0,7);const crId=$('attCR')?.value||'';
  let q=db.collection('attendance').where('date','>=',month+'-01').where('date','<=',month+'-31');
  if(crId){const crT=S.teachers.filter(t=>(t.classroomIds||[]).includes(crId)).map(t=>t.id);if(crT.length)q=q.where('teacherId','in',crT.slice(0,10))}
  const snap=await q.get();const records=snap.docs.map(d=>d.data());
  if(!records.length){el.innerHTML='<div class="empty"><p>No data</p></div>';return}
  const tP=records.reduce((s,r)=>s+r.presentCount,0),tA=records.reduce((s,r)=>s+r.absentCount,0);const avg=tP+tA>0?Math.round(tP/(tP+tA)*100):0;
  let h=`<div class="score-bar"><div class="score-card"><div class="score-val" style="color:var(--saf)">${records.length}</div><div class="score-lbl">Days</div></div>
  <div class="score-card"><div class="score-val" style="color:var(--grn)">${avg}%</div><div class="score-lbl">Avg</div></div>
  <div class="score-card"><div class="score-val" style="color:var(--blu)">${tP}</div><div class="score-lbl">Present</div></div></div>`;
  // Per student
  const ss={};records.forEach(r=>{(r.records||[]).forEach(sr=>{if(!ss[sr.studentId])ss[sr.studentId]={name:sr.studentName,p:0,a:0,t:0};ss[sr.studentId].t++;if(sr.status==='present')ss[sr.studentId].p++;if(sr.status==='absent')ss[sr.studentId].a++})});
  Object.entries(ss).sort((a,b)=>(b[1].p/b[1].t)-(a[1].p/a[1].t)).forEach(([id,st])=>{const rate=st.t?Math.round(st.p/st.t*100):0;const color=rate>=80?'var(--grn)':rate>=60?'var(--warn)':'var(--red)';
    h+=`<div style="padding:10px 0;border-bottom:1px solid var(--brd)"><div class="flex justify-between items-center"><div class="h3">${st.name}</div><div style="font-weight:800;color:${color}">${rate}%</div></div>
    <div class="flex gap-8 items-center" style="margin-top:4px"><div class="att-stat-bar flex-1"><div class="att-fill" style="width:${rate}%;background:${color}"></div></div><span class="sub2">${st.p}/${st.t}</span></div></div>`});
  // Daily
  h+=`<div class="sec-title" style="margin-top:16px">📅 Daily Log</div>`;
  [...records].sort((a,b)=>b.date.localeCompare(a.date)).forEach(r=>{const ds=new Date(r.date+'T12:00:00').toLocaleDateString(undefined,{weekday:'short',day:'numeric',month:'short'});
    const rate=r.totalCount?Math.round(r.presentCount/r.totalCount*100):0;
    h+=`<div class="list-item"><div style="font-size:18px">${rate>=80?'🟢':rate>=60?'🟡':'🔴'}</div>
    <div class="flex-1"><div class="h3">${ds}</div><div class="sub2">✍️ ${r.signedBy||r.teacherName||''} ${r.signedAt?'@ '+r.signedAt:''} · ${r.presentCount}/${r.totalCount}${r.remark?' · 📝 '+r.remark:''}</div></div></div>`});
  el.innerHTML=h}

// Admin Settings
function rASet(){
  let h=`<div class="topbar"><div class="h2">⚙️ ${t('settings')}</div></div>
  <div class="panel"><div class="panel-title">🔐 Admin Password</div>
  <div class="fld"><label class="lbl">Current Password</label><input class="inp" type="password" id="curPw"></div>
  <div class="fld"><label class="lbl">New Password</label><input class="inp" type="password" id="newPw"></div>
  <button class="btn btn-p btn-w" onclick="changeAdminPw()">🔐 Change Password</button></div>`;

  // Sub-Admin management (only for super admin)
  if(S.adminRole==='superadmin'){
    h+=`<div class="panel"><div class="panel-header"><div class="panel-title">👥 Sub-Admins</div>
    <button class="btn btn-p btn-sm" onclick="showAddSubAdmin()">+ ${t('add')}</button></div>
    <div class="help-tip"><span class="h-ico">💡</span><div>Sub-admins can manage teachers, students, and classrooms but cannot create other admins or change app settings.</div></div>
    <div id="subAdminList"><div class="loading" style="min-height:60px"><div class="loader"></div></div></div></div>`;
    setTimeout(loadSubAdmins,0)}

  h+=`<div class="panel"><div class="panel-title">🖼️ Logo</div>
  ${S.logo?'<img src="'+S.logo+'" style="width:80px;height:80px;border-radius:16px;object-fit:contain;display:block;margin-bottom:12px;background:var(--card2)">':''}
  <button class="btn btn-s btn-w" onclick="$('logoF').click()">📸 Upload Logo</button>
  <input type="file" accept="image/*" id="logoF" style="display:none" onchange="upLogo(this)"></div>
  <div class="panel"><div class="panel-title">📝 Welcome Message</div>
  <div class="fld"><textarea class="inp" id="wmT" rows="3">${S.welcomeMsg}</textarea></div>
  <button class="btn btn-p btn-w" onclick="svWM()">💾 ${t('save')}</button></div>`;
  app.innerHTML=h}
async function upLogo(i){if(!i.files[0])return;try{const d=await compImg(i.files[0],200,0.8);await svSet({logo:d});toast(t('saved'));rAdmin()}catch(e){toast('Error','err')}}
async function svWM(){await svSet({welcomeMsg:$('wmT').value.trim()});S.welcomeMsg=S.settings.welcomeMsg;toast(t('saved'))}

async function changeAdminPw(){
  const cur=$('curPw').value.trim(),nw=$('newPw').value.trim();
  if(!cur||!nw)return toast(t('fillAll'),'err');if(nw.length<4)return toast('Min 4 characters','err');
  const doc=await db.collection('admins').doc(S.uid).get();
  if(!doc.exists||doc.data().password!==cur){toast(t('wrongPassword'),'err');return}
  await db.collection('admins').doc(S.uid).update({password:nw});
  toast('Password changed! ✅');$('curPw').value='';$('newPw').value=''}

// First-time Super Admin Setup
function showAdminSetup(){hideNav();
  app.innerHTML=`<div style="text-align:center;padding:20px 0"><div style="font-size:48px">🛡️</div><div class="h1" style="margin-top:12px">Create Super Admin</div>
  <div class="sub" style="margin-top:4px">First-time setup — this creates the main admin account</div></div>
  <div class="panel">
  <div class="help-tip"><span class="h-ico">⚠️</span><div>Save your recovery key after setup! It's the only way to reset your password if you forget it.</div></div>
  <div class="fld"><label class="lbl">${t('fullName')}</label><input class="inp" id="saName" placeholder="Your full name"></div>
  <div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="saUser" placeholder="e.g. admin" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9]/g,'')"></div>
  <div class="fld"><label class="lbl">${t('password')} (min 4 chars)</label><input class="inp" type="password" id="saPw" placeholder="Choose a strong password"></div>
  <div class="fld"><label class="lbl">Confirm ${t('password')}</label><input class="inp" type="password" id="saPw2" placeholder="Type password again"></div>
  <button class="btn btn-p btn-w" id="saBtn" onclick="createSuperAdmin()">🛡️ Create Super Admin</button></div>
  <button class="back" onclick="lP('admin')">← ${t('back')}</button>`}

async function createSuperAdmin(){
  const name=$('saName').value.trim(),u=$('saUser').value.trim(),pw=$('saPw').value.trim(),pw2=$('saPw2').value.trim();
  if(!name||!u||!pw)return toast(t('fillAll'),'err');
  if(pw.length<4)return toast('Min 4 characters','err');
  if(pw!==pw2)return toast('Passwords do not match','err');
  // Check if any admin already exists
  const existing=await db.collection('admins').get();
  if(!existing.empty)return toast('Super Admin already exists! Use login.','err');
  // Check username not taken
  if(!(await db.collection('admins').where('username','==',u).get()).empty)return toast('Username taken','err');
  // Generate recovery key
  const recoveryKey=Math.random().toString(36).slice(2,6).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
  $('saBtn').disabled=true;$('saBtn').textContent='Creating...';
  await db.collection('admins').add({name,username:u,password:pw,role:'superadmin',recoveryKey,createdAt:Date.now()});
  // Show recovery key - MUST save this!
  app.innerHTML=`<div style="text-align:center;padding:30px 0"><div style="font-size:64px">✅</div>
  <div class="h1" style="margin-top:16px">Admin Account Created!</div></div>
  <div class="panel" style="border:2px solid var(--warn)">
  <div class="panel-title" style="color:var(--warn)">⚠️ SAVE YOUR RECOVERY KEY</div>
  <p style="font-size:13px;color:var(--txt2);margin-bottom:12px">If you forget your password, this is the ONLY way to reset it. Write it down or save it somewhere safe.</p>
  <div style="background:var(--bg);padding:16px;border-radius:12px;text-align:center;margin-bottom:12px">
    <div style="font-size:24px;font-weight:900;letter-spacing:3px;color:var(--saf);font-family:monospace">${recoveryKey}</div>
  </div>
  <div style="font-size:12px;color:var(--txt3);text-align:center">Username: <b>${u}</b></div></div>
  <button class="btn btn-p btn-w" onclick="lP('admin')">✅ I've saved it — Go to Login</button>`}

// Forgot Password — Recovery Key flow
function showForgotPw(){hideNav();
  app.innerHTML=`<div style="text-align:center;padding:20px 0"><div style="font-size:48px">🔑</div><div class="h1" style="margin-top:12px">Reset Password</div></div>
  <div class="panel">
  <div class="help-tip"><span class="h-ico">💡</span><div>Enter your username and recovery key (given during setup) to reset your password.</div></div>
  <div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="rpUser" placeholder="Admin username"></div>
  <div class="fld"><label class="lbl">Recovery Key</label><input class="inp" id="rpKey" placeholder="XXXX-XXXX-XXXX" style="font-family:monospace;text-transform:uppercase;letter-spacing:2px"></div>
  <div class="fld"><label class="lbl">New ${t('password')}</label><input class="inp" type="password" id="rpNewPw" placeholder="New password (min 4)"></div>
  <button class="btn btn-p btn-w" onclick="resetAdminPw()">🔑 Reset Password</button></div>
  <button class="back" onclick="lP('admin')">← ${t('back')}</button>`}

async function resetAdminPw(){
  const u=$('rpUser').value.trim().toLowerCase(),key=$('rpKey').value.trim().toUpperCase(),nw=$('rpNewPw').value.trim();
  if(!u||!key||!nw)return toast(t('fillAll'),'err');if(nw.length<4)return toast('Min 4','err');
  const snap=await db.collection('admins').where('username','==',u).get();
  if(snap.empty)return toast(t('notFound'),'err');
  const doc=snap.docs[0],data=doc.data();
  if(data.recoveryKey!==key)return toast('Invalid recovery key','err');
  await db.collection('admins').doc(doc.id).update({password:nw});
  toast('Password reset! ✅');lP('admin')}
