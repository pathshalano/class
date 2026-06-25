// ====================== ADMIN ======================
async function initA(){app.innerHTML='<div class="loading"><div class="loader"></div><p>Loading dashboard...</p></div>';
  if(S.adminRole==='superadmin'){
    await ldOrgs();
    for(const o of S.orgs){
      const tc=(await db.collection('teachers').where('orgId','==',o.id).get()).size;
      const sc=(await db.collection('students').where('orgId','==',o.id).get()).size;
      o._teachers=tc;o._students=sc}
    rAdmin();
  } else {
    await Promise.all([ldT(),ldStu(),ldCR(),ldParents()]);
    rAdmin();
  }}

function rAdmin(){
  if(S.adminRole==='superadmin'){
    hideNav();
    if(S.tab==='home')rSAHome();else if(S.tab==='orgs')rSAOrgs();else if(S.tab==='orgDetail')rSAOrgDetail();
    else if(S.tab==='addOrg')showAddOrg();else if(S.tab==='settings')rSASettings();
    else rSAHome();
  } else {
    showNav([{id:'home',ico:'🏠',label:t('home')},{id:'parents',ico:'👪',label:t('parents')},{id:'classrooms',ico:'🏫',label:t('classrooms')},{id:'teachers',ico:'👩‍🏫',label:t('teachers')},{id:'settings',ico:'⚙️',label:t('settings')}]);
    if(S.tab==='home')rOAHome();else if(S.tab==='parents')rAParents();else if(S.tab==='classrooms')rACR();else if(S.tab==='teachers')rATeach();else if(S.tab==='students')rAStu();
    else if(S.tab==='messages')rAMsg();else if(S.tab==='attendance')rAAtt();else if(S.tab==='settings')rOASet();
  }}

// ====================================================
// ============ SUPER ADMIN — PLATFORM PANEL ==========
// ====================================================

function saNav(){
  return`<div class="sa-sidebar"><button class="sa-nav ${S.tab==='home'?'on':''}" onclick="S.tab='home';rAdmin()">📊 Dashboard</button>
  <button class="sa-nav ${S.tab==='orgs'?'on':''}" onclick="S.tab='orgs';rAdmin()">🏫 ${t('schools')}</button>
  <button class="sa-nav ${S.tab==='settings'?'on':''}" onclick="S.tab='settings';rAdmin()">⚙️ ${t('settings')}</button>
  <button class="sa-nav" onclick="doLogout()">🚪 ${t('logout')}</button></div>`}

function rSAHome(){
  const total=S.orgs.length;
  const active=S.orgs.filter(o=>o.status==='active').length;
  const trial=S.orgs.filter(o=>o.status==='trial').length;
  const suspended=S.orgs.filter(o=>o.status==='suspended'||o.status==='inactive').length;
  const totalT=S.orgs.reduce((s,o)=>s+(o._teachers||0),0);
  const totalS=S.orgs.reduce((s,o)=>s+(o._students||0),0);
  // Trial expiring soon
  const expiringSoon=S.orgs.filter(o=>o.status==='trial'&&daysLeft(o.trialEnds)<=5&&daysLeft(o.trialEnds)>0);
  const expired=S.orgs.filter(o=>o.status==='trial'&&daysLeft(o.trialEnds)<=0);

  let h=`<div class="topbar"><div class="topbar-left"><div class="topbar-avatar" style="background:linear-gradient(135deg,var(--saf),var(--pur))">⚡</div>
  <div class="topbar-info"><div class="name">${S.uname}</div><div class="greeting">Platform Admin</div></div></div>
  <div class="topbar-actions">${langSel()}<button class="btn btn-s btn-sm" onclick="doLogout()">🚪 ${t('logout')}</button></div></div>`;

  // Stats
  h+=`<div class="dash-grid">
    <div class="dash-card dc-blue" onclick="S.tab='orgs';rAdmin()"><div class="dc-icon">🏫</div><div class="dc-title">${total}</div><div class="dc-sub">${t('schools')}</div></div>
    <div class="dash-card dc-green"><div class="dc-icon">✅</div><div class="dc-title">${active}</div><div class="dc-sub">${t('active')}</div></div>
    <div class="dash-card dc-orange"><div class="dc-icon">⏳</div><div class="dc-title">${trial}</div><div class="dc-sub">${t('trial')}</div></div>
    <div class="dash-card dc-purple"><div class="dc-icon">👩‍🏫</div><div class="dc-title">${totalT}</div><div class="dc-sub">${t('teachers')}</div></div>
  </div>`;
  h+=`<div class="score-bar"><div class="score-card"><div class="score-val" style="color:var(--grn)">${totalS}</div><div class="score-lbl">Total ${t('students')}</div></div>
  <div class="score-card"><div class="score-val" style="color:var(--red)">${suspended}</div><div class="score-lbl">${t('suspended')}</div></div></div>`;

  // Alerts
  if(expired.length){
    h+=`<div class="panel" style="border:1.5px solid var(--red)"><div class="panel-title" style="color:var(--red)">🚨 Expired Trials</div>`;
    expired.forEach(o=>{h+=`<div class="list-item clickable" onclick="viewOrg('${o.id}')"><div class="avatar av-org">${(o.name||'O')[0]}</div>
    <div class="flex-1"><div class="h3">${o.name}</div><div class="sub2">Trial ended ${fmtDate(o.trialEnds)}</div></div></div>`});h+='</div>'}
  if(expiringSoon.length){
    h+=`<div class="panel" style="border:1.5px solid var(--warn)"><div class="panel-title" style="color:var(--warn)">⚠️ Expiring Soon</div>`;
    expiringSoon.forEach(o=>{const dl=daysLeft(o.trialEnds);h+=`<div class="list-item clickable" onclick="viewOrg('${o.id}')"><div class="avatar av-org">${(o.name||'O')[0]}</div>
    <div class="flex-1"><div class="h3">${o.name}</div><div class="sub2">${dl} days left</div></div></div>`});h+='</div>'}

  // Recent schools
  h+=`<div class="sec-title" style="margin-top:16px">📋 All ${t('schools')}</div>`;
  if(!S.orgs.length)h+='<div class="empty"><div class="e-ico">🏫</div><p>No schools yet</p><button class="btn btn-p" onclick="S.tab=\'addOrg\';rAdmin()">+ Create School</button></div>';
  else{S.orgs.forEach((o,i)=>{
    h+=`<div class="list-item clickable" onclick="viewOrg('${o.id}')"><div class="avatar ${avColor(i)}">${(o.name||'O')[0]}</div>
    <div class="flex-1"><div class="h3">${o.name} ${orgStatusTag(o)}</div><div class="sub2">${o._teachers||0} teachers · ${o._students||0} students · ${o.contactPerson||''}</div></div></div>`})}
  app.innerHTML=h}

function orgStatusTag(o){
  const st=o.status||'active';
  if(st==='active')return'<span class="tag tag-grn">Active</span>';
  if(st==='trial'){const dl=daysLeft(o.trialEnds);if(dl<=0)return'<span class="tag tag-red">Expired</span>';return`<span class="tag tag-org">Trial · ${dl}d</span>`}
  if(st==='suspended')return'<span class="tag tag-red">Suspended</span>';
  return'<span class="tag tag-red">Inactive</span>'}

// ============ SUPER ADMIN — SCHOOLS LIST ============
function rSAOrgs(){
  let h=`<div class="topbar"><div class="topbar-left"><button class="back" onclick="S.tab='home';rAdmin()" style="position:static;margin:0;padding:0">← Dashboard</button></div>
  <div class="topbar-actions"><button class="btn btn-p btn-sm" onclick="S.tab='addOrg';rAdmin()">+ ${t('add')}</button><button class="btn btn-s btn-sm" onclick="doLogout()">🚪</button></div></div>
  <div class="h2" style="margin-bottom:12px">🏫 ${t('schools')}</div>`;
  // Filter chips
  h+=`<div class="chip-row"><div class="chip ${!S._orgFilter?'on':''}" onclick="S._orgFilter=null;rSAOrgs()">${t('all')} (${S.orgs.length})</div>
  <div class="chip ${S._orgFilter==='active'?'on':''}" onclick="S._orgFilter='active';rSAOrgs()">✅ Active</div>
  <div class="chip ${S._orgFilter==='trial'?'on':''}" onclick="S._orgFilter='trial';rSAOrgs()">⏳ Trial</div>
  <div class="chip ${S._orgFilter==='suspended'?'on':''}" onclick="S._orgFilter='suspended';rSAOrgs()">🚫 Suspended</div></div>`;
  let fl=S.orgs;
  if(S._orgFilter==='active')fl=fl.filter(o=>o.status==='active');
  else if(S._orgFilter==='trial')fl=fl.filter(o=>o.status==='trial');
  else if(S._orgFilter==='suspended')fl=fl.filter(o=>o.status==='suspended'||o.status==='inactive');
  if(!fl.length)h+='<div class="empty"><p>No schools match</p></div>';
  else fl.forEach((o,i)=>{
    h+=`<div class="list-item clickable" onclick="viewOrg('${o.id}')"><div class="avatar ${avColor(i)}">${(o.name||'O')[0]}</div>
    <div class="flex-1"><div class="h3">${o.name} ${orgStatusTag(o)}</div><div class="sub2">${o.orgNumber?'#'+o.orgNumber+' · ':''}${o._teachers||0} teachers · ${o._students||0} students</div></div></div>`});
  app.innerHTML=h}

// ============ SUPER ADMIN — VIEW/MANAGE SINGLE ORG ============
let _viewOrg=null;
async function viewOrg(orgId){
  _viewOrg=S.orgs.find(o=>o.id===orgId);
  if(!_viewOrg){const d=await db.collection('organisations').doc(orgId).get();_viewOrg={id:orgId,...d.data()}}
  // Load admins for this org
  const aSnap=await db.collection('admins').where('orgId','==',orgId).get();
  _viewOrg._admins=aSnap.docs.map(d=>({id:d.id,...d.data()}));
  S.tab='orgDetail';rAdmin()}

function rSAOrgDetail(){
  const o=_viewOrg;if(!o){S.tab='home';rAdmin();return}
  const st=o.status||'active';
  let h=`<button class="back" onclick="S.tab='orgs';rAdmin()">← All ${t('schools')}</button>`;
  // Header
  h+=`<div class="topbar"><div class="topbar-left"><div class="topbar-avatar" style="background:linear-gradient(135deg,var(--blu),var(--pur))">${(o.name||'O')[0]}</div>
  <div class="topbar-info"><div class="name">${o.name}</div><div class="greeting">${orgStatusTag(o)}</div></div></div></div>`;

  // Org info panel
  h+=`<div class="panel"><div class="panel-title">📋 Organisation Info</div>
  <div style="font-size:13px;line-height:2.2;color:var(--txt2)">📛 <span style="color:var(--txt)">${o.name||'—'}</span><br>🔢 <span style="color:var(--txt)">${o.orgNumber||'—'}</span><br>📍 <span style="color:var(--txt)">${o.address||'—'}</span><br>📧 <span style="color:var(--txt)">${o.email||'—'}</span><br>📱 <span style="color:var(--txt)">${o.phone||'—'}</span><br>👤 <span style="color:var(--txt)">${o.contactPerson||'—'}</span><br>📅 Created: <span style="color:var(--txt)">${fmtDate(o.createdAt)}</span></div>
  <button class="btn btn-s btn-w" style="margin-top:10px" onclick="showEditOrg('${o.id}')">✏️ ${t('edit')} Info</button></div>`;

  // Stats
  h+=`<div class="score-bar"><div class="score-card"><div class="score-val" style="color:var(--blu)">${o._teachers||0}</div><div class="score-lbl">${t('teachers')}</div></div>
  <div class="score-card"><div class="score-val" style="color:var(--grn)">${o._students||0}</div><div class="score-lbl">${t('students')}</div></div></div>`;

  // Subscription / Access Control
  h+=`<div class="panel"><div class="panel-title">💳 Access Control</div>`;
  if(st==='trial'){const dl=daysLeft(o.trialEnds);
    h+=`<div class="help-tip"><span class="h-ico">⏳</span><div>Trial: ${dl>0?dl+' days remaining':'EXPIRED'} (ends ${fmtDate(o.trialEnds)})</div></div>`}
  h+=`<div class="fld"><label class="lbl">${t('status')}</label><select class="inp" id="orgSt">
    <option value="active" ${st==='active'?'selected':''}>✅ Active (Full access)</option>
    <option value="trial" ${st==='trial'?'selected':''}>⏳ Trial (Limited time)</option>
    <option value="suspended" ${st==='suspended'?'selected':''}>🚫 Suspended (Blocked)</option>
    <option value="inactive" ${st==='inactive'?'selected':''}>❌ Inactive (Closed)</option></select></div>
  <div class="fld" id="trialField" style="${st==='trial'?'':'display:none'}"><label class="lbl">Trial End Date</label><input class="inp" id="orgTrialEnd" type="date" value="${o.trialEnds?new Date(o.trialEnds).toISOString().split('T')[0]:''}"></div>
  <button class="btn btn-p btn-w" onclick="saveOrgStatus('${o.id}')">💾 Update Access</button></div>`;

  // Admin accounts for this org
  h+=`<div class="panel"><div class="panel-header"><div class="panel-title">👥 School Admins</div>
  <button class="btn btn-p btn-sm" onclick="showAddOrgAdmin('${o.id}')">+ ${t('add')}</button></div>`;
  if(o._admins&&o._admins.length){
    o._admins.forEach((a,i)=>{
      h+=`<div class="list-item"><div class="avatar ${avColor(i)}">${(a.name||'A')[0]}</div>
      <div class="flex-1"><div class="h3">${a.name}</div><div class="sub2">@${a.username} · <span class="pw-tag">${a.password}</span></div></div>
      <div class="flex gap-8"><button class="btn btn-s btn-sm" onclick="resetOrgAdminPw('${a.id}')">🔑</button>
      <button class="btn btn-d btn-sm" onclick="delOrgAdmin('${a.id}','${o.id}')">🗑</button></div></div>`})
  } else {h+='<div class="empty"><p>No admins — school can\'t be managed!</p></div>'}
  h+='</div>';

  // Danger zone
  h+=`<div class="panel" style="border:1.5px solid var(--red)"><div class="panel-title" style="color:var(--red)">⚠️ Danger Zone</div>
  <button class="btn btn-d btn-w" onclick="deleteOrg('${o.id}')">🗑 Delete Organisation</button>
  <p class="sub2" style="margin-top:8px">This will remove the organisation record. Teachers, students and data will remain but be orphaned.</p></div>`;
  app.innerHTML=h;
  // Toggle trial date field
  setTimeout(()=>{const sel=$('orgSt');if(sel)sel.onchange=()=>{const tf=$('trialField');if(tf)tf.style.display=sel.value==='trial'?'':'none'}},0)}

async function saveOrgStatus(orgId){
  const st=$('orgSt').value;const update={status:st};
  if(st==='trial'){const dt=$('orgTrialEnd').value;if(!dt)return toast('Set trial end date','err');update.trialEnds=new Date(dt+'T23:59:59').getTime()}
  else{update.trialEnds=null}
  await db.collection('organisations').doc(orgId).update(update);
  // Refresh
  const idx=S.orgs.findIndex(o=>o.id===orgId);if(idx>=0)Object.assign(S.orgs[idx],update);
  if(_viewOrg)Object.assign(_viewOrg,update);
  toast(t('saved'));rSAOrgDetail()}

async function resetOrgAdminPw(adminId){
  const nw=prompt('New password for this admin (min 4):');if(!nw||nw.length<4)return;
  await db.collection('admins').doc(adminId).update({password:nw});
  toast('Password reset ✅');viewOrg(_viewOrg.id)}

async function delOrgAdmin(adminId,orgId){
  if(!confirm('Delete this admin account?'))return;
  await db.collection('admins').doc(adminId).delete();
  toast(t('deleted'));viewOrg(orgId)}

async function deleteOrg(orgId){
  if(!confirm('DELETE this organisation? This cannot be undone.'))return;
  if(!confirm('Are you really sure? Type OK in next prompt to confirm.'))return;
  await db.collection('organisations').doc(orgId).delete();
  S.orgs=S.orgs.filter(o=>o.id!==orgId);
  toast(t('deleted'));S.tab='orgs';rAdmin()}

// ============ CREATE ORGANISATION ============
function showAddOrg(){
  let h=`<button class="back" onclick="S.tab='orgs';rAdmin()">← ${t('back')}</button>
  <div class="panel"><div class="panel-title">🏫 New ${t('organisation')}</div>
  <div class="help-tip"><span class="h-ico">💡</span><div>Create a new school. You'll also create their first admin account.</div></div>
  <div class="sec-title">School Details</div>
  <div class="fld"><label class="lbl">${t('orgName')} *</label><input class="inp" id="oName" placeholder="e.g. Khalsa School Oslo"></div>
  <div class="fld"><label class="lbl">${t('orgNumber')}</label><input class="inp" id="oNr" placeholder="e.g. 987654321"></div>
  <div class="fld"><label class="lbl">${t('address')}</label><input class="inp" id="oAddr"></div>
  <div class="fld"><label class="lbl">${t('email')}</label><input class="inp" id="oEmail" type="email"></div>
  <div class="fld"><label class="lbl">${t('phone')}</label><input class="inp" id="oPhone" type="tel"></div>
  <div class="fld"><label class="lbl">${t('contactPerson')}</label><input class="inp" id="oCont"></div>
  <div class="sec-title" style="margin-top:16px">💳 Access</div>
  <div class="fld"><label class="lbl">${t('status')}</label><select class="inp" id="oStat" onchange="$('oTrialF').style.display=this.value==='trial'?'':'none'">
    <option value="active">✅ Active</option><option value="trial">⏳ Trial</option></select></div>
  <div class="fld" id="oTrialF" style="display:none"><label class="lbl">Trial End Date</label><input class="inp" id="oTrialEnd" type="date"></div>
  <div class="sec-title" style="margin-top:16px">👤 School Admin Account</div>
  <div class="help-tip"><span class="h-ico">👤</span><div>This person will manage teachers, students and classrooms for this school.</div></div>
  <div class="fld"><label class="lbl">Admin ${t('fullName')} *</label><input class="inp" id="oAName"></div>
  <div class="fld"><label class="lbl">Admin ${t('username')} *</label><input class="inp" id="oAUser" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9]/g,'')"></div>
  <div class="fld"><label class="lbl">Admin ${t('password')} *</label><input class="inp" id="oAPw" type="password"></div>
  <button class="btn btn-p btn-w" id="oBtn" onclick="createOrg()">🏫 ${t('create')} ${t('organisation')}</button></div>`;
  app.innerHTML=h}

async function createOrg(){
  const name=$('oName').value.trim(),nr=$('oNr').value.trim(),addr=$('oAddr').value.trim(),
    email=$('oEmail').value.trim(),phone=$('oPhone').value.trim(),cont=$('oCont').value.trim(),
    stat=$('oStat').value,aName=$('oAName').value.trim(),aUser=$('oAUser').value.trim(),aPw=$('oAPw').value.trim();
  if(!name||!aName||!aUser||!aPw)return toast(t('fillAll'),'err');
  if(aPw.length<4)return toast('Min 4 characters','err');
  if(!(await db.collection('admins').where('username','==',aUser).get()).empty)return toast('Username taken','err');
  $('oBtn').disabled=true;$('oBtn').textContent='Creating...';
  try{
    const orgDoc={name,orgNumber:nr,address:addr,email,phone,contactPerson:cont,logo:'',welcomeMsg:'',status:stat,createdAt:Date.now()};
    if(stat==='trial'){const dt=$('oTrialEnd').value;if(dt)orgDoc.trialEnds=new Date(dt+'T23:59:59').getTime()}
    const orgRef=await db.collection('organisations').add(orgDoc);
    const recoveryKey=Math.random().toString(36).slice(2,6).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
    await db.collection('admins').add({name:aName,username:aUser,password:aPw,role:'orgadmin',orgId:orgRef.id,recoveryKey,createdAt:Date.now()});
    await ldOrgs();
    // Fetch stats for new org
    S.orgs.forEach(o=>{if(!o._teachers)o._teachers=0;if(!o._students)o._students=0});
    toast(t('created'));
    app.innerHTML=`<div style="text-align:center;padding:30px 0"><div style="font-size:64px">✅</div>
    <div class="h1" style="margin-top:16px">${name}</div><div class="sub">Organisation created successfully</div></div>
    <div class="panel" style="border:2px solid var(--warn)"><div class="panel-title" style="color:var(--warn)">⚠️ School Admin Credentials</div>
    <p style="font-size:13px;color:var(--txt2);margin-bottom:12px">Share these with the school administrator:</p>
    <div style="background:var(--bg);padding:16px;border-radius:12px;margin-bottom:8px">
    <div style="font-size:13px;line-height:2">👤 Name: <b>${aName}</b><br>🔑 Username: <b>${aUser}</b><br>🔒 Password: <b>${aPw}</b><br>
    🔐 Recovery Key: <span style="font-family:monospace;font-size:16px;font-weight:900;color:var(--saf);letter-spacing:2px">${recoveryKey}</span></div></div>
    <div class="sub2">Login URL: <b>yoursite.com?role=admin</b></div></div>
    <button class="btn btn-p btn-w" onclick="S.tab='orgs';rAdmin()">✅ Done</button>`;
  }catch(e){toast('Error: '+e.message,'err');$('oBtn').disabled=false;$('oBtn').textContent='🏫 '+t('create')}}

function showAddOrgAdmin(orgId){
  app.innerHTML=`<button class="back" onclick="viewOrg('${orgId}')">← ${t('back')}</button><div class="panel"><div class="panel-title">➕ Add School Admin</div>
  <div class="fld"><label class="lbl">${t('fullName')}</label><input class="inp" id="naName"></div>
  <div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="naUser" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9]/g,'')"></div>
  <div class="fld"><label class="lbl">${t('password')}</label><input class="inp" id="naPw" type="password"></div>
  <button class="btn btn-p btn-w" onclick="addOrgAdmin('${orgId}')">✅ Create Admin</button></div>`}

async function addOrgAdmin(orgId){
  const n=$('naName').value.trim(),u=$('naUser').value.trim(),p=$('naPw').value.trim();
  if(!n||!u||!p)return toast(t('fillAll'),'err');if(p.length<4)return toast('Min 4','err');
  if(!(await db.collection('admins').where('username','==',u).get()).empty)return toast('Username taken','err');
  const rk=Math.random().toString(36).slice(2,6).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
  await db.collection('admins').add({name:n,username:u,password:p,role:'orgadmin',orgId,recoveryKey:rk,createdAt:Date.now()});
  toast(t('created'));viewOrg(orgId)}

// ============ EDIT ORGANISATION INFO ============
function showEditOrg(orgId){
  const o=_viewOrg||{};
  app.innerHTML=`<button class="back" onclick="viewOrg('${orgId}')">← ${t('back')}</button>
  <div class="panel"><div class="panel-title">✏️ Edit ${t('organisation')}</div>
  <div class="fld"><label class="lbl">${t('orgName')}</label><input class="inp" id="eoName" value="${o.name||''}"></div>
  <div class="fld"><label class="lbl">${t('orgNumber')}</label><input class="inp" id="eoNr" value="${o.orgNumber||''}"></div>
  <div class="fld"><label class="lbl">${t('address')}</label><input class="inp" id="eoAddr" value="${o.address||''}"></div>
  <div class="fld"><label class="lbl">${t('email')}</label><input class="inp" id="eoEmail" value="${o.email||''}"></div>
  <div class="fld"><label class="lbl">${t('phone')}</label><input class="inp" id="eoPhone" value="${o.phone||''}"></div>
  <div class="fld"><label class="lbl">${t('contactPerson')}</label><input class="inp" id="eoCont" value="${o.contactPerson||''}"></div>
  <button class="btn btn-p btn-w" onclick="saveEditOrg('${orgId}')">💾 ${t('save')}</button></div>`}

async function saveEditOrg(orgId){
  const update={name:$('eoName').value.trim(),orgNumber:$('eoNr').value.trim(),address:$('eoAddr').value.trim(),email:$('eoEmail').value.trim(),phone:$('eoPhone').value.trim(),contactPerson:$('eoCont').value.trim()};
  await db.collection('organisations').doc(orgId).update(update);
  const idx=S.orgs.findIndex(o=>o.id===orgId);if(idx>=0)Object.assign(S.orgs[idx],update);
  if(_viewOrg)Object.assign(_viewOrg,update);
  toast(t('saved'));viewOrg(orgId)}

// ============ SUPER ADMIN SETTINGS ============
function rSASettings(){
  let h=`<div class="topbar"><div class="h2">⚙️ ${t('settings')}</div></div>
  <div class="panel"><div class="panel-title">🔐 Change Password</div>
  <div class="fld"><label class="lbl">Current Password</label><input class="inp" type="password" id="curPw"></div>
  <div class="fld"><label class="lbl">New Password</label><input class="inp" type="password" id="newPw"></div>
  <button class="btn btn-p btn-w" onclick="changeAdminPw()">🔐 Change</button></div>
  <div class="panel"><div class="panel-title">🔗 Access URLs</div>
  <div style="font-size:12px;line-height:2.2;color:var(--txt2)">
  ⚡ Super Admin: <span class="pw-tag">yoursite.com?key=${SA_KEY}</span><br>
  🛡️ School Admin: <span class="pw-tag">yoursite.com?role=admin</span><br>
  👩‍🏫 Teachers: <span class="pw-tag">yoursite.com?role=teacher</span><br>
  🧑‍🎓 Students: <span class="pw-tag">yoursite.com?role=student</span><br>
  👪 Parents: <span class="pw-tag">yoursite.com?role=parent</span><br>
  🌐 Default (Teacher+Student+Parent): <span class="pw-tag">yoursite.com</span></div></div>`;
  app.innerHTML=h}

// ====================================================
// ============ ORG ADMIN (SCHOOL ADMIN) ==============
// ====================================================

function rOAHome(){
  const bdT=[],bdS=[];[...S.teachers,...S.students].forEach(p=>{const role=S.teachers.includes(p)?'👩‍🏫':'🧑‍🎓';if(isBdayToday(p.dob))bdT.push({...p,role});else{const d=isBdaySoon(p.dob);if(d)bdS.push({...p,role,inDays:d})}});
  const orgName=(S.orgData||{}).name||'School';
  // Trial warning for org admin
  let trialWarn='';
  if(S.orgData?.status==='trial'){const dl=daysLeft(S.orgData.trialEnds);
    if(dl<=7&&dl>0)trialWarn=`<div class="panel" style="border:1.5px solid var(--warn)"><div class="panel-title" style="color:var(--warn)">⏳ Trial Expiring</div><p class="sub2">${dl} days remaining. Contact platform admin to activate.</p></div>`}
  let h=`<div class="topbar"><div class="topbar-left"><div class="topbar-avatar" style="background:linear-gradient(135deg,var(--pur),var(--blu))">🛡️</div><div class="topbar-info"><div class="name">${S.uname}</div><div class="greeting">${orgName}</div></div></div>
  <div class="topbar-actions">${langSel()}<button class="btn btn-s btn-sm" onclick="doLogout()">🚪 ${t('logout')}</button></div></div>${trialWarn}`;
  if(bdT.length){h+=`<div class="bday"><h4>🎂 ${t('todayBirthdays')}</h4>`;bdT.forEach(p=>{h+=`<div class="bday-item">${p.role} <b>${p.name}</b></div>`});h+='</div>'}
  if(bdS.length){h+=`<div class="bday" style="border-color:rgba(245,158,11,.2)"><h4 style="color:var(--saf)">📅 ${t('upcomingBirthdays')}</h4>`;bdS.forEach(p=>{h+=`<div class="bday-item">${p.role} <b>${p.name}</b> — ${p.inDays} ${t('days')}</div>`});h+='</div>'}
  h+=`<div class="dash-grid">
    <div class="dash-card dc-orange" onclick="S.tab='parents';R()"><div class="dc-icon">👪</div><div class="dc-title">${t('parents')}</div><div class="dc-sub">${S.parents.length} parents · ${S.students.length} students</div></div>
    <div class="dash-card dc-blue" onclick="S.tab='classrooms';R()"><div class="dc-icon">🏫</div><div class="dc-title">${t('classrooms')}</div><div class="dc-sub">${S.classrooms.length}</div></div>
    <div class="dash-card dc-purple" onclick="S.tab='teachers';R()"><div class="dc-icon">👩‍🏫</div><div class="dc-title">${t('teachers')}</div><div class="dc-sub">${S.teachers.length}</div></div>
    <div class="dash-card dc-green" onclick="S.tab='messages';R()"><div class="dc-icon">💬</div><div class="dc-title">${t('messages')}</div><div class="dc-sub">${t('broadcast')}</div></div>
    <div class="dash-card dc-cyan" onclick="S.tab='attendance';R()"><div class="dc-icon">📋</div><div class="dc-title">${t('attendance')}</div><div class="dc-sub">Reports</div></div>
    <div class="dash-card dc-pink" onclick="S.tab='settings';R()"><div class="dc-icon">⚙️</div><div class="dc-title">${t('settings')}</div><div class="dc-sub">Logo & admins</div></div>
  </div>`;app.innerHTML=h}

// ============ SHARED FUNCTIONS (School Admin) ============
function adminBack(){rAdmin()}

// WhatsApp + Copy helpers
function waUrl(phone,msg){const p=phone.replace(/[^0-9+]/g,'').replace(/^0/,'');return`https://wa.me/${p}?text=${encodeURIComponent(msg)}`}
function copyTxt(txt){navigator.clipboard.writeText(txt).then(()=>toast('Copied ✅')).catch(()=>toast('Copy failed','err'))}
function credMsg(pName,pUser,pPw,children,siteUrl){
  let m=`🙏 Welcome to Pathshala!\n\n👪 Parent Login:\n👤 Username: ${pUser}\n🔑 Password: ${pPw}\n🔗 ${siteUrl}?role=parent\n`;
  children.forEach(c=>{if(c.hasApp)m+=`\n🧑‍🎓 ${c.name}'s Login:\n👤 Username: ${c.username}\n🔑 Password: ${c.password}\n🔗 ${siteUrl}?role=student\n`});
  m+='\nStart learning Punjabi! ਪੰਜਾਬੀ ਸਿੱਖੋ 🎓';return m}
function credCard(pName,pUser,pPw,phone,children,siteUrl){
  let h=`<div class="panel" style="border:2px solid var(--grn);background:rgba(46,204,113,.04)"><div class="panel-title" style="color:var(--grn)">✅ Credentials</div>
  <div style="background:var(--bg);padding:14px;border-radius:12px;margin-bottom:12px"><div style="font-size:13px;line-height:2.2">
  <b>👪 Parent:</b> ${pName}<br>👤 Username: <b>${pUser}</b><br>🔑 Password: <b>${pPw}</b><br>🔗 <span class="pw-tag">${siteUrl}?role=parent</span>`;
  children.forEach(c=>{if(c.hasApp)h+=`<br><br><b>🧑‍🎓 ${c.name}:</b><br>👤 Username: <b>${c.username}</b><br>🔑 Password: <b>${c.password}</b><br>🔗 <span class="pw-tag">${siteUrl}?role=student</span>`});
  h+='</div></div>';
  const msg=credMsg(pName,pUser,pPw,children,siteUrl);
  h+=`<div class="flex gap-8"><button class="btn btn-p flex-1" onclick="copyTxt(\`${msg.replace(/`/g,"'")}\`)">📋 Copy</button>`;
  if(phone)h+=`<a class="btn btn-g flex-1" href="${waUrl(phone,msg)}" target="_blank" style="text-align:center;text-decoration:none">💬 WhatsApp</a>`;
  h+='</div></div>';return h}

// ============ PARENTS MANAGEMENT ============
function rAParents(){
  let h=`<div class="topbar"><div class="h2">👪 ${t('parents')}</div><button class="btn btn-p btn-sm" onclick="showAddParent()">+ ${t('add')}</button></div>
  <div class="help-tip"><span class="h-ico">💡</span><div>Register parents first, then add their children. Each child gets assigned to a classroom.</div></div>`;
  if(!S.parents.length)h+='<div class="empty"><div class="e-ico">👪</div><p>No parents yet — add the first one!</p></div>';
  else{
    // Search
    h+=`<div class="fld"><input class="inp" placeholder="🔍 Search parent..." oninput="S.searchQ=this.value.toLowerCase();rAParents()" value="${S.searchQ||''}"></div>`;
    let fl=S.parents;if(S.searchQ)fl=fl.filter(p=>(p.name||'').toLowerCase().includes(S.searchQ));
    fl.forEach((p,i)=>{
      const kids=S.students.filter(s=>s.parentId===p.id);
      const appTag=p.hasApp?'<span class="tag tag-grn">App</span>':'<span class="tag tag-org">No app</span>';
      h+=`<div class="list-item clickable" onclick="viewParent('${p.id}')"><div class="avatar ${avColor(i)}">${(p.name||'P')[0]}</div>
      <div class="flex-1"><div class="h3">${p.name} ${appTag}</div><div class="sub2">📱 ${p.phone||'—'} · ${kids.length} ${kids.length===1?'child':'children'}</div></div></div>`})}
  app.innerHTML=h}

function showAddParent(){
  let crOpts=S.classrooms.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
  app.innerHTML=`<button class="back" onclick="adminBack()">← ${t('back')}</button>
  <div class="panel"><div class="panel-title">👪 Register Parent</div>
  <div class="fld"><label class="lbl">Parent ${t('fullName')} *</label><input class="inp" id="pN"></div>
  <div class="fld"><label class="lbl">${t('phone')}</label><input class="inp" id="pPh" type="tel" placeholder="+47..."></div>
  <div class="fld"><label class="lbl">${t('email')}</label><input class="inp" id="pEm" type="email"></div>
  <div class="fld"><label class="chk-lbl"><input type="checkbox" id="pApp" checked onchange="$('pAppFields').style.display=this.checked?'':'none'"> Enable parent app login</label></div>
  <div id="pAppFields">
  <div class="fld"><label class="lbl">${t('username')} *</label><input class="inp" id="pU" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9.]/g,'')"></div>
  <div class="fld"><label class="lbl">${t('password')} *</label><input class="inp" id="pPw" placeholder="Min 4 characters"></div></div>
  <div class="sec-title" style="margin-top:20px">🧑‍🎓 Add First Child</div>
  <div class="fld"><label class="lbl">Child ${t('fullName')} *</label><input class="inp" id="cN"></div>
  <div class="fld"><label class="lbl">${t('dob')}</label><input class="inp" id="cDob" type="date"></div>
  <div class="fld"><label class="lbl">${t('classroom')} *</label><select class="inp" id="cCR">${crOpts||'<option>— Create classrooms first —</option>'}</select></div>
  <div class="fld"><label class="chk-lbl"><input type="checkbox" id="cApp" checked onchange="$('cAppFields').style.display=this.checked?'':'none'"> Enable student app login</label></div>
  <div id="cAppFields">
  <div class="fld"><label class="lbl">Student ${t('username')} *</label><input class="inp" id="cU" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9]/g,'')"></div>
  <div class="fld"><label class="lbl">Student ${t('password')} *</label><input class="inp" id="cPw" placeholder="Min 4 characters"></div></div>
  <button class="btn btn-p btn-w" id="apBtn" onclick="addParentWithChild()">✅ Register</button></div>`}

async function addParentWithChild(){
  const pN=$('pN').value.trim(),pPh=$('pPh').value.trim(),pEm=$('pEm').value.trim();
  const pApp=$('pApp').checked,pU=$('pU')?.value?.trim()||'',pPw=$('pPw')?.value?.trim()||'';
  const cN=$('cN').value.trim(),cDob=$('cDob').value,cCR=$('cCR').value;
  const cApp=$('cApp').checked,cU=$('cU')?.value?.trim()||'',cPw=$('cPw')?.value?.trim()||'';
  if(!pN||!cN||!cCR)return toast(t('fillAll'),'err');
  if(pApp&&(!pU||!pPw))return toast('Parent username & password required','err');
  if(pApp&&pPw.length<4)return toast('Parent password min 4','err');
  if(cApp&&(!cU||!cPw))return toast('Student username & password required','err');
  if(cApp&&cPw.length<4)return toast('Student password min 4','err');
  // Check uniqueness
  if(pApp&&pU){if(!(await db.collection('parents').where('username','==',pU).get()).empty)return toast('Parent username taken','err')}
  if(cApp&&cU){if(!(await db.collection('students').where('username','==',cU).get()).empty)return toast('Student username taken','err')}
  $('apBtn').disabled=true;$('apBtn').textContent='Creating...';
  try{
    // Find teacher for this classroom
    const crTeacher=S.teachers.find(t=>(t.classroomIds||[]).includes(cCR));
    const teacherId=crTeacher?crTeacher.id:'';
    // Create parent
    const pDoc={name:pN,phone:pPh,email:pEm,hasApp:pApp,orgId:S.orgId,createdAt:Date.now()};
    if(pApp){pDoc.username=pU;pDoc.password=pPw}
    const pRef=await db.collection('parents').add(pDoc);
    // Create child
    const cDoc={name:cN,dob:cDob,classroomId:cCR,parentId:pRef.id,teacherId,hasApp:cApp,orgId:S.orgId,createdAt:Date.now(),lastSeen:null,badges:[],xp:0,streak:0,lastPracticeDate:''};
    if(cApp){cDoc.username=cU;cDoc.password=cPw}
    await db.collection('students').add(cDoc);
    await Promise.all([ldParents(),ldStu()]);toast(t('created'));
    // Show credential card
    const siteUrl=window.location.origin+window.location.pathname;
    const children=[{name:cN,hasApp:cApp,username:cU,password:cPw}];
    let h=`<div style="text-align:center;padding:20px 0"><div style="font-size:56px">✅</div><div class="h1" style="margin-top:12px">${pN}</div><div class="sub">Parent & child registered</div></div>`;
    if(pApp)h+=credCard(pN,pU,pPw,pPh,children,siteUrl);
    else h+=`<div class="panel"><div class="panel-title">📋 Contact Only</div><p class="sub2">Parent registered without app access. No credentials to share.</p></div>`;
    h+=`<button class="btn btn-p btn-w" onclick="S.tab='parents';rAdmin()">👪 Back to Parents</button>`;
    app.innerHTML=h;
  }catch(e){toast('Error: '+e.message,'err');$('apBtn').disabled=false;$('apBtn').textContent='✅ Register'}}

// View single parent + manage children
async function viewParent(pid){
  app.innerHTML='<div class="loading"><div class="loader"></div></div>';
  const p=S.parents.find(x=>x.id===pid);if(!p){toast('Not found','err');rAParents();return}
  const kids=S.students.filter(s=>s.parentId===pid);
  let h=`<button class="back" onclick="rAParents()">← ${t('back')}</button>
  <div style="text-align:center;margin-bottom:16px"><div class="avatar av-org" style="width:56px;height:56px;font-size:24px;border-radius:18px;margin:0 auto">${(p.name||'P')[0]}</div>
  <div class="h2" style="margin-top:8px">${p.name}</div>
  <div class="sub">${p.hasApp?'<span class="tag tag-grn">App Enabled</span> · @'+p.username:'<span class="tag tag-org">Contact Only</span>'}</div></div>`;
  // Info
  h+=`<div class="panel"><div class="panel-title">📋 Info</div>
  <div style="font-size:13px;line-height:2.2">📱 ${p.phone||'—'}<br>📧 ${p.email||'—'}${p.hasApp?'<br>🔑 @'+p.username+' · <span class="pw-tag">'+(p.password||'')+'</span>':''}</div>
  <div class="flex gap-8 mt-14"><button class="btn btn-s flex-1" onclick="editParentInfo('${pid}')">✏️ ${t('edit')}</button>
  <button class="btn btn-p flex-1" onclick="S.tab='messages';aChat('${pid}','${esc(p.name)}')">💬 Message</button></div></div>`;
  // Share credentials
  if(p.hasApp){const siteUrl=window.location.origin+window.location.pathname;
    const childCreds=kids.filter(c=>c.hasApp).map(c=>({name:c.name,hasApp:true,username:c.username,password:c.password}));
    const msg=credMsg(p.name,p.username,p.password,childCreds,siteUrl);
    h+=`<div class="panel" style="border:1.5px solid var(--grn);background:rgba(46,204,113,.04)"><div class="panel-title" style="color:var(--grn)">📤 Share Credentials</div>
    <div class="flex gap-8"><button class="btn btn-s flex-1" onclick="copyTxt(\`${msg.replace(/`/g,"'")}\`)">📋 Copy</button>`;
    if(p.phone)h+=`<a class="btn btn-g flex-1" href="${waUrl(p.phone,msg)}" target="_blank" style="text-align:center;text-decoration:none">💬 WhatsApp</a>`;
    h+='</div></div>'}
  // Children
  h+=`<div class="panel"><div class="panel-header"><div class="panel-title">🧑‍🎓 Children (${kids.length})</div>
  <button class="btn btn-p btn-sm" onclick="showAddChild('${pid}')">+ ${t('add')}</button></div>`;
  if(!kids.length)h+='<div class="empty"><p>No children added yet</p></div>';
  else kids.forEach((c,i)=>{
    const appTag=c.hasApp?'<span class="tag tag-grn">App</span>':'<span class="tag tag-org">No app</span>';
    h+=`<div class="list-item clickable" onclick="editChild('${pid}','${c.id}')"><div class="avatar ${avColor(i)}">${(c.name||'S')[0]}</div>
    <div class="flex-1"><div class="h3">${c.name} ${appTag}</div><div class="sub2">🏫 ${getCR(c.classroomId)} · 👩‍🏫 ${getT(c.teacherId)}${c.hasApp?' · <span class="pw-tag">'+c.password+'</span>':''}</div></div></div>`});
  h+='</div>';
  // Danger zone
  h+=`<div class="panel" style="border:1.5px solid var(--red)"><div class="panel-title" style="color:var(--red)">⚠️ Danger</div>
  <button class="btn btn-d btn-w" onclick="delParent('${pid}')">🗑 Delete Parent & All Children</button></div>`;
  app.innerHTML=h}

// Edit parent info
function editParentInfo(pid){const p=S.parents.find(x=>x.id===pid);
  app.innerHTML=`<button class="back" onclick="viewParent('${pid}')">← ${t('back')}</button>
  <div class="panel"><div class="panel-title">✏️ Edit Parent</div>
  <div class="fld"><label class="lbl">${t('fullName')}</label><input class="inp" id="epN" value="${p.name||''}"></div>
  <div class="fld"><label class="lbl">${t('phone')}</label><input class="inp" id="epPh" value="${p.phone||''}" type="tel"></div>
  <div class="fld"><label class="lbl">${t('email')}</label><input class="inp" id="epEm" value="${p.email||''}" type="email"></div>
  <div class="fld"><label class="chk-lbl"><input type="checkbox" id="epApp" ${p.hasApp?'checked':''} onchange="$('epAppF').style.display=this.checked?'':'none'"> Enable app login</label></div>
  <div id="epAppF" style="${p.hasApp?'':'display:none'}">
  <div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="epU" value="${p.username||''}" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9.]/g,'')"></div>
  <div class="fld"><label class="lbl">${t('password')}</label><input class="inp" id="epPw" value="${p.password||''}"></div></div>
  <button class="btn btn-p btn-w" onclick="saveParentInfo('${pid}')">💾 ${t('save')}</button></div>`}
async function saveParentInfo(pid){
  const n=$('epN').value.trim(),ph=$('epPh').value.trim(),em=$('epEm').value.trim();
  const hasApp=$('epApp').checked,u=$('epU')?.value?.trim()||'',pw=$('epPw')?.value?.trim()||'';
  if(!n)return toast(t('fillAll'),'err');
  if(hasApp&&(!u||!pw))return toast('Username & password required','err');
  if(hasApp&&pw.length<4)return toast('Min 4','err');
  if(hasApp&&u){const ex=await db.collection('parents').where('username','==',u).get();if(ex.docs.some(d=>d.id!==pid))return toast('Username taken','err')}
  const update={name:n,phone:ph,email:em,hasApp};
  if(hasApp){update.username=u;update.password=pw}else{update.username='';update.password=''}
  await db.collection('parents').doc(pid).update(update);await ldParents();toast(t('saved'));viewParent(pid)}

// Add child to existing parent
function showAddChild(pid){
  let crOpts=S.classrooms.map(c=>`<option value="${c.id}">${c.name}</option>`).join('');
  app.innerHTML=`<button class="back" onclick="viewParent('${pid}')">← ${t('back')}</button>
  <div class="panel"><div class="panel-title">🧑‍🎓 Add Child</div>
  <div class="fld"><label class="lbl">Child ${t('fullName')} *</label><input class="inp" id="cN"></div>
  <div class="fld"><label class="lbl">${t('dob')}</label><input class="inp" id="cDob" type="date"></div>
  <div class="fld"><label class="lbl">${t('classroom')} *</label><select class="inp" id="cCR">${crOpts}</select></div>
  <div class="fld"><label class="chk-lbl"><input type="checkbox" id="cApp" checked onchange="$('cAppF').style.display=this.checked?'':'none'"> Enable student app login</label></div>
  <div id="cAppF">
  <div class="fld"><label class="lbl">${t('username')} *</label><input class="inp" id="cU" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9]/g,'')"></div>
  <div class="fld"><label class="lbl">${t('password')} *</label><input class="inp" id="cPw" placeholder="Min 4"></div></div>
  <button class="btn btn-p btn-w" onclick="addChild('${pid}')">✅ ${t('add')}</button></div>`}
async function addChild(pid){
  const n=$('cN').value.trim(),dob=$('cDob').value,cr=$('cCR').value;
  const hasApp=$('cApp').checked,u=$('cU')?.value?.trim()||'',pw=$('cPw')?.value?.trim()||'';
  if(!n||!cr)return toast(t('fillAll'),'err');
  if(hasApp&&(!u||!pw))return toast('Username & password required','err');
  if(hasApp&&pw.length<4)return toast('Min 4','err');
  if(hasApp&&u){if(!(await db.collection('students').where('username','==',u).get()).empty)return toast('Username taken','err')}
  const crTeacher=S.teachers.find(t=>(t.classroomIds||[]).includes(cr));
  const doc={name:n,dob,classroomId:cr,parentId:pid,teacherId:crTeacher?crTeacher.id:'',hasApp,orgId:S.orgId,createdAt:Date.now(),lastSeen:null,badges:[],xp:0,streak:0,lastPracticeDate:''};
  if(hasApp){doc.username=u;doc.password=pw}
  await db.collection('students').add(doc);await ldStu();toast(t('created'));viewParent(pid)}

// Edit child
function editChild(pid,sid){const s=S.students.find(x=>x.id===sid);if(!s)return;
  let crOpts=S.classrooms.map(c=>`<option value="${c.id}" ${s.classroomId===c.id?'selected':''}>${c.name}</option>`).join('');
  app.innerHTML=`<button class="back" onclick="viewParent('${pid}')">← ${t('back')}</button>
  <div style="text-align:center;margin-bottom:16px"><div class="avatar av-grn" style="width:48px;height:48px;font-size:20px;border-radius:16px;margin:0 auto">${(s.name||'S')[0]}</div>
  <div class="h2" style="margin-top:8px">${s.name}</div></div>
  <div class="panel"><div class="panel-title">✏️ Edit Child</div>
  <div class="fld"><label class="lbl">${t('fullName')}</label><input class="inp" id="ecN" value="${s.name}"></div>
  <div class="fld"><label class="lbl">${t('dob')}</label><input class="inp" id="ecDob" type="date" value="${s.dob||''}"></div>
  <div class="fld"><label class="lbl">${t('classroom')}</label><select class="inp" id="ecCR">${crOpts}</select></div>
  <div class="fld"><label class="chk-lbl"><input type="checkbox" id="ecApp" ${s.hasApp?'checked':''} onchange="$('ecAppF').style.display=this.checked?'':'none'"> Enable student app login</label></div>
  <div id="ecAppF" style="${s.hasApp?'':'display:none'}">
  <div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="ecU" value="${s.username||''}" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9]/g,'')"></div>
  <div class="fld"><label class="lbl">${t('password')}</label><input class="inp" id="ecPw" value="${s.password||''}"></div></div>
  <div class="flex gap-8"><button class="btn btn-p flex-1" onclick="saveChild('${pid}','${sid}')">💾 ${t('save')}</button>
  <button class="btn btn-d flex-1" onclick="delChild('${pid}','${sid}')">🗑 ${t('delete')}</button></div></div>`}
async function saveChild(pid,sid){
  const n=$('ecN').value.trim(),dob=$('ecDob').value,cr=$('ecCR').value;
  const hasApp=$('ecApp').checked,u=$('ecU')?.value?.trim()||'',pw=$('ecPw')?.value?.trim()||'';
  if(!n)return toast(t('fillAll'),'err');
  if(hasApp&&(!u||!pw))return toast('Username & password required','err');
  if(hasApp&&pw.length<4)return toast('Min 4','err');
  if(hasApp&&u){const ex=await db.collection('students').where('username','==',u).get();if(ex.docs.some(d=>d.id!==sid))return toast('Username taken','err')}
  const crTeacher=S.teachers.find(t=>(t.classroomIds||[]).includes(cr));
  const update={name:n,dob,classroomId:cr,teacherId:crTeacher?crTeacher.id:'',hasApp};
  if(hasApp){update.username=u;update.password=pw}else{update.username='';update.password=''}
  await db.collection('students').doc(sid).update(update);await ldStu();toast(t('saved'));viewParent(pid)}
async function delChild(pid,sid){if(!confirm('Delete this child?'))return;await db.collection('students').doc(sid).delete();await ldStu();toast(t('deleted'));viewParent(pid)}
async function delParent(pid){if(!confirm('Delete this parent and ALL their children?'))return;
  const kids=S.students.filter(s=>s.parentId===pid);
  const b=db.batch();kids.forEach(k=>b.delete(db.collection('students').doc(k.id)));b.delete(db.collection('parents').doc(pid));await b.commit();
  await Promise.all([ldParents(),ldStu()]);toast(t('deleted'));rAParents()}

// Classrooms
function rACR(){let h=`<div class="topbar"><div class="h2">🏫 ${t('classrooms')}</div><button class="btn btn-p btn-sm" onclick="showACRAdd()">+ ${t('add')}</button></div>
  <div class="help-tip"><span class="h-ico">💡</span><div>${t('helpClassroom')}</div></div>`;
  if(!S.classrooms.length)h+='<div class="empty"><div class="e-ico">🏫</div><p>No classrooms yet</p></div>';
  else S.classrooms.forEach((c,i)=>{const ts=S.teachers.filter(t=>(t.classroomIds||[]).includes(c.id));const sc=S.students.filter(s=>s.classroomId===c.id).length;
    h+=`<div class="panel" style="cursor:pointer" onclick="editACR('${c.id}')"><div class="flex items-center gap-12"><div class="cat-circle" style="background:linear-gradient(135deg,${['#3B82F6','#8B5CF6','#2ECC71','#F59E0B','#EC4899'][i%5]},${['#2563EB','#7C3AED','#27AE60','#D97706','#DB2777'][i%5]})">🏫</div>
    <div class="flex-1"><div class="h3">${c.name}</div><div class="sub2">👩‍🏫 ${ts.map(t=>t.name).join(', ')||'—'} · ${sc} students</div></div></div></div>`});
  app.innerHTML=h}
function showACRAdd(){app.innerHTML=`<button class="back" onclick="adminBack()">← ${t('back')}</button><div class="panel"><div class="panel-title">🏫 ${t('add')} ${t('classroom')}</div>
  <div class="fld"><label class="lbl">${t('name')}</label><input class="inp" id="crN"></div>
  <button class="btn btn-p btn-w" onclick="addACR()">✅ ${t('create')}</button></div>`}
async function addACR(){const n=$('crN').value.trim();if(!n)return toast(t('fillAll'),'err');await db.collection('classrooms').add({name:n,orgId:S.orgId,createdAt:Date.now()});await ldCR();toast(t('created'));adminBack()}
function editACR(id){const c=S.classrooms.find(x=>x.id===id);
  // Permanent teacher assigned to this classroom
  const permTs=S.teachers.filter(t=>(t.classroomIds||[]).includes(id));
  // Teacher dropdown for permanent assignment
  let pTOpts=`<option value="">— Select teacher —</option>`;S.teachers.forEach(t=>{pTOpts+=`<option value="${t.id}" ${permTs.some(p=>p.id===t.id)?'selected':''}>${t.name}${t.type==='vikar'?' (Vikar)':''}</option>`});
  // Temp teacher dropdown
  let tOpts=`<option value="">— No temp teacher —</option>`;S.teachers.forEach(t=>{tOpts+=`<option value="${t.id}" ${c.tempTeacherId===t.id?'selected':''}>${t.name}</option>`});
  // Students in this classroom
  const stuInCR=S.students.filter(s=>s.classroomId===id);
  let crOpts=S.classrooms.map(cr=>`<option value="${cr.id}">${cr.name}</option>`).join('');
  let h=`<button class="back" onclick="adminBack()">← ${t('back')}</button><div class="panel"><div class="panel-title">✏️ ${c.name}</div>
  <div class="fld"><label class="lbl">${t('name')}</label><input class="inp" id="ecrN" value="${c.name}"></div>
  <div class="fld"><label class="lbl">👩‍🏫 Permanent Teacher</label><select class="inp" id="ecrPerm">${pTOpts}</select></div>
  <div class="panel" style="background:rgba(245,158,11,.06);border:1px solid rgba(245,158,11,.2)"><div class="panel-title" style="color:var(--warn)">⚠️ Temp Teacher (Vikar)</div>
  <div class="fld"><select class="inp" id="ecrTemp">${tOpts}</select></div></div>
  <div class="flex gap-8"><button class="btn btn-p flex-1" onclick="svACR('${id}')">${t('save')}</button><button class="btn btn-d flex-1" onclick="delACR('${id}')">🗑</button></div></div>`;
  // Students section
  h+=`<div class="panel"><div class="panel-title">🧑‍🎓 Students (${stuInCR.length})</div>`;
  if(!stuInCR.length)h+='<p class="sub2">No students in this classroom</p>';
  else stuInCR.forEach((s,i)=>{h+=`<div class="list-item"><div class="avatar ${avColor(i)}">${(s.name||'S')[0]}</div>
    <div class="flex-1"><div class="h3">${s.name}</div><div class="sub2">👩‍🏫 ${getT(s.teacherId)}</div></div>
    <select class="inp" style="width:auto;min-width:100px;font-size:12px" onchange="moveStudent('${s.id}',this.value,'${id}')">
    ${S.classrooms.map(cr=>`<option value="${cr.id}" ${cr.id===id?'selected':''}>${cr.name}</option>`).join('')}</select></div>`});
  h+='</div>';
  app.innerHTML=h}
async function svACR(id){
  const name=$('ecrN').value.trim();const tempTid=$('ecrTemp').value||null;
  const permTid=$('ecrPerm').value;
  await db.collection('classrooms').doc(id).update({name,tempTeacherId:tempTid});
  // Update permanent teacher's classroomIds
  if(permTid){
    const teacher=S.teachers.find(t=>t.id===permTid);
    if(teacher){const ids=new Set(teacher.classroomIds||[]);ids.add(id);await db.collection('teachers').doc(permTid).update({classroomIds:[...ids]})}
    // Remove from old teachers who had this classroom
    for(const t of S.teachers){if(t.id!==permTid&&(t.classroomIds||[]).includes(id)){
      const ids=(t.classroomIds||[]).filter(c=>c!==id);await db.collection('teachers').doc(t.id).update({classroomIds:ids})}}}
  await Promise.all([ldCR(),ldT()]);toast(t('saved'));adminBack()}
async function moveStudent(sid,newCR,fromCR){if(newCR===fromCR)return;
  const crTeacher=S.teachers.find(t=>(t.classroomIds||[]).includes(newCR));
  await db.collection('students').doc(sid).update({classroomId:newCR,teacherId:crTeacher?crTeacher.id:''});
  await ldStu();toast('Student moved ✅');editACR(fromCR)}
async function delACR(id){if(!confirm(t('delete')+'?'))return;await db.collection('classrooms').doc(id).delete();await ldCR();toast(t('deleted'));adminBack()}

// Teachers
function rATeach(){let h=`<div class="topbar"><div class="h2">👩‍🏫 ${t('teachers')}</div><button class="btn btn-p btn-sm" onclick="showAT()">+ ${t('add')}</button></div>`;
  S.teachers.forEach((x,i)=>{const crs=(x.classroomIds||[]).map(id=>getCR(id)).join(', ')||'—';const sc=S.students.filter(s=>s.teacherId===x.id).length;
    const typeBadge=x.type==='vikar'?'<span class="tag tag-org">Vikar</span>':'<span class="tag tag-grn">Perm</span>';
    h+=`<div class="list-item clickable" onclick="showATD('${x.id}')"><div class="avatar ${avColor(i)}">${(x.name||'T')[0]}</div>
    <div class="flex-1"><div class="h3">${x.name} ${typeBadge}</div><div class="sub2">👤 @${x.username} · 🏫 ${crs} · ${sc} students · 🔑 <span class="pw-tag">${x.password}</span></div></div></div>`});
  if(!S.teachers.length)h+='<div class="empty"><p>No teachers yet</p></div>';app.innerHTML=h}
function showAT(){let crOpts=S.classrooms.map(c=>`<label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:13px"><input type="checkbox" class="crCb" value="${c.id}"> ${c.name}</label>`).join('');
  app.innerHTML=`<button class="back" onclick="adminBack()">← ${t('back')}</button><div class="panel"><div class="panel-title">➕ ${t('add')} ${t('teacher')}</div>
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
  await db.collection('teachers').add({name:n,phone:ph,dob,email:em,username:u,password:p,type:ty,classroomIds:crIds,orgId:S.orgId,createdAt:Date.now()});
  await ldT();toast(t('created'));adminBack()}
async function showATD(tid){const x=S.teachers.find(v=>v.id===tid);
  let crChks=S.classrooms.map(c=>`<label style="display:flex;align-items:center;gap:8px;padding:6px 0;font-size:13px"><input type="checkbox" class="crCbE" value="${c.id}" ${(x.classroomIds||[]).includes(c.id)?'checked':''}> ${c.name}</label>`).join('');
  app.innerHTML=`<button class="back" onclick="adminBack()">← ${t('back')}</button>
  <div style="text-align:center;margin-bottom:16px"><div class="avatar av-pur" style="width:56px;height:56px;font-size:24px;border-radius:18px;margin:0 auto">${(x.name||'T')[0]}</div>
  <div class="h2" style="margin-top:10px">${x.name}</div><div class="sub">👤 @${x.username} · 🔑 <span class="pw-tag">${x.password}</span></div></div>
  <div class="panel"><div style="font-size:13px;line-height:2.2">📱 ${x.phone||'—'}<br>🎂 ${fmtDob(x.dob)}<br>📧 ${x.email||'—'}<br>🏫 ${(x.classroomIds||[]).map(id=>getCR(id)).join(', ')||'—'}</div></div>
  <div class="panel"><div class="panel-title">✏️ ${t('edit')}</div>
  <div class="fld"><label class="lbl">${t('name')}</label><input class="inp" id="eN" value="${x.name}"></div>
  <div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="eU" value="${x.username||''}" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9]/g,'')"></div>
  <div class="fld"><label class="lbl">${t('password')}</label><input class="inp" id="eP" value="${x.password}"></div>
  <div class="fld"><label class="lbl">Type</label><select class="inp" id="eType"><option value="permanent" ${x.type!=='vikar'?'selected':''}>Permanent</option><option value="vikar" ${x.type==='vikar'?'selected':''}>Vikar</option></select></div>
  <div class="fld"><label class="lbl">${t('classrooms')}</label>${crChks||'<p class="sub2">No classrooms</p>'}</div>
  <div class="flex gap-8"><button class="btn btn-p flex-1" onclick="svATD('${tid}')">${t('save')}</button><button class="btn btn-d flex-1" onclick="delAT('${tid}')">🗑</button></div></div>`}
async function svATD(tid){
  const u=$('eU').value.trim();
  if(u){const ex=await db.collection('teachers').where('username','==',u).get();if(ex.docs.some(d=>d.id!==tid))return toast('Username taken','err')}
  const crIds=[...document.querySelectorAll('.crCbE:checked')].map(c=>c.value);
  await db.collection('teachers').doc(tid).update({name:$('eN').value.trim(),username:u,password:$('eP').value.trim(),type:$('eType').value,classroomIds:crIds});
  await ldT();toast(t('saved'));adminBack()}
async function delAT(tid){if(!confirm(t('delete')+'?'))return;await db.collection('teachers').doc(tid).delete();await ldT();toast(t('deleted'));adminBack()}

// Students
function rAStu(){let h=`<div class="topbar"><div class="h2">👥 ${t('students')}</div></div>
  <div class="chip-row"><div class="chip ${!S.filterCR?'on':''}" onclick="S.filterCR=null;R()">${t('all')}</div>`;
  S.classrooms.forEach(c=>{h+=`<div class="chip ${S.filterCR===c.id?'on':''}" onclick="S.filterCR='${c.id}';R()">${c.name}</div>`});h+='</div>';
  let fl=S.students;if(S.filterCR)fl=fl.filter(s=>s.classroomId===S.filterCR);
  fl.forEach((s,i)=>{h+=`<div class="list-item clickable" onclick="showASD('${s.id}')"><div class="avatar ${avColor(i)}">${(s.name||'S')[0]}</div>
    <div class="flex-1"><div class="h3">${s.name}</div><div class="sub2">👩‍🏫 ${getT(s.teacherId)} · <span class="tag tag-pur">${getCR(s.classroomId)}</span> · <span class="pw-tag">${s.password}</span></div></div></div>`});
  if(!fl.length)h+='<div class="empty"><p>'+t('noStudents')+'</p></div>';app.innerHTML=h}
function showASD(sid){const s=S.students.find(x=>x.id===sid);
  let tOpts=S.teachers.map(x=>`<option value="${x.id}" ${s.teacherId===x.id?'selected':''}>${x.name}</option>`).join('');
  let crOpts=S.classrooms.map(c=>`<option value="${c.id}" ${s.classroomId===c.id?'selected':''}>${c.name}</option>`).join('');
  app.innerHTML=`<button class="back" onclick="adminBack()">← ${t('back')}</button>
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
async function reassignS(sid){await db.collection('students').doc(sid).update({teacherId:$('rsT').value,classroomId:$('rsCR').value});await ldStu();toast(t('saved'));adminBack()}
async function svASD(sid){await db.collection('students').doc(sid).update({name:$('esN').value.trim(),password:$('esP').value.trim()});await ldStu();toast(t('saved'));adminBack()}
async function delASD(sid){if(!confirm(t('delete')+'?'))return;await db.collection('students').doc(sid).delete();await ldStu();toast(t('deleted'));adminBack()}

// Messages
async function rAMsg(){
  // Count unread per contact
  const allUnrd=await db.collection('messages').where('toId','==','admin').where('read','==',false).get();
  const unrdMap={};allUnrd.docs.forEach(d=>{const fid=d.data().fromId;unrdMap[fid]=(unrdMap[fid]||0)+1});
  let h=`<div class="topbar"><div class="h2">💬 ${t('messages')}</div></div>
  <div class="dash-grid" style="margin-bottom:14px">
    <div class="dash-card dc-green" onclick="aBc('students')"><div class="dc-icon">📢</div><div class="dc-title">${t('students')}</div></div>
    <div class="dash-card dc-blue" onclick="aBc('teachers')"><div class="dc-icon">👩‍🏫</div><div class="dc-title">${t('teachers')}</div></div>
    <div class="dash-card dc-orange" onclick="aBc('parents')"><div class="dc-icon">👪</div><div class="dc-title">${t('parents')}</div></div></div>
  <div class="sec-title">${t('teachers')}</div>`;
  S.teachers.forEach((x,i)=>{const u=unrdMap[x.id]||0;h+=`<div class="list-item clickable" onclick="aChat('${x.id}','${esc(x.name)}')"><div class="avatar ${avColor(i)}">${(x.name||'T')[0]}</div><div class="flex-1"><div class="h3">${x.name}${u?'<span class="unread-badge">'+u+'</span>':''}</div></div></div>`});
  // Parents with app access
  const pw=S.parents.filter(p=>p.hasApp);
  if(pw.length){h+=`<div class="sec-title" style="margin-top:14px">👪 ${t('parents')}</div>`;
    pw.forEach((p,i)=>{const kids=S.students.filter(s=>s.parentId===p.id).map(s=>s.name).join(', ');const u=unrdMap[p.id]||0;
      h+=`<div class="list-item clickable" onclick="aChat('${p.id}','${esc(p.name)}')"><div class="avatar av-org">${(p.name||'P')[0]}</div><div class="flex-1"><div class="h3">${p.name}${u?'<span class="unread-badge">'+u+'</span>':''}</div><div class="sub2">${kids||'No children'}</div></div></div>`})}
  app.innerHTML=h}
async function aBc(tg){
  const label=tg==='parents'?'All Parents':tg==='teachers'?'All Teachers':'All Students';
  app.innerHTML=`<button class="back" onclick="adminBack()">← ${t('back')}</button><div class="panel"><div class="panel-title">📢 ${label}</div>
  ${tg==='parents'?'<div class="fld"><label class="lbl">Tag</label><select class="inp" id="bcTag"><option value="general">📋 General</option><option value="event">🎉 Event</option><option value="urgent">🚨 Urgent</option></select></div>':''}
  <div class="fld"><textarea class="inp" id="bcM" rows="3" placeholder="Type your message..."></textarea></div><button class="btn btn-p btn-w" id="bcB" onclick="sndABc('${tg}')">📢 ${t('send')}</button></div>`}
async function sndABc(tg){const txt=$('bcM').value.trim();if(!txt)return;$('bcB').disabled=true;
  const tag=$('bcTag')?.value||'general';
  if(tg==='parents'){const pw=S.parents.filter(p=>p.hasApp);
    for(const p of pw)await sendMsg('admin',S.uname||'Admin','admin',p.id,p.name,txt,tag);
    toast(`Sent to ${pw.length} parents ✅`)}
  else{for(const u of(tg==='teachers'?S.teachers:S.students))await sendMsg('admin',S.uname||'Admin','admin',u.id,u.name||u.username,txt);toast(t('sent'))}
  adminBack()}
async function aChat(uid,name){app.innerHTML='<div class="loading"><div class="loader"></div></div>';await markRd('admin',uid);const msgs=await getMsgs('admin',uid);
  let h=`<button class="back" onclick="adminBack()">← ${t('back')}</button><div class="panel"><div class="panel-title">💬 ${name}</div><div class="msg-list" id="mL">`;
  if(!msgs.length)h+='<div class="empty"><p>'+t('noMessages')+'</p></div>';
  else msgs.forEach(m=>{const s=m.fromId==='admin';h+=`<div class="msg-bub ${s?'msg-sent':'msg-recv'} ${s&&m.read?'msg-read':''}">${!s?'<div class="msg-name">'+m.fromName+'</div>':''}${m.text}<div class="msg-time">${fmt(m.timestamp)}${s?(m.read?' ✅':' ◻️'):''}</div></div>`});
  h+=`</div><div class="msg-compose"><input class="inp" id="mI" placeholder="..." onkeydown="if(event.key==='Enter')sndAM('${uid}','${esc(name)}')"><button class="btn btn-p btn-sm" onclick="sndAM('${uid}','${esc(name)}')">${t('send')}</button></div></div>`;
  app.innerHTML=h;const l=$('mL');if(l)l.scrollTop=l.scrollHeight}
async function sndAM(uid,name){const x=$('mI').value.trim();if(!x)return;$('mI').value='';await sendMsg('admin','Admin','admin',uid,name,x);aChat(uid,name)}

// Attendance
function rAAtt(){let h=`<div class="topbar"><div class="h2">📋 ${t('attendance')}</div></div>
  <div class="help-tip"><span class="h-ico">💡</span><div>${t('helpAttAdmin')}</div></div>
  <div class="fld"><select class="inp" id="attMonth" onchange="loadAAtt()">`;
  for(let i=0;i<6;i++){const d=new Date();d.setMonth(d.getMonth()-i);const m=d.toISOString().substring(0,7);h+=`<option value="${m}">${d.toLocaleDateString(undefined,{month:'long',year:'numeric'})}</option>`}
  h+=`</select></div><div class="fld"><select class="inp" id="attCR" onchange="loadAAtt()"><option value="">${t('all')} ${t('classrooms')}</option>`;
  S.classrooms.forEach(c=>{h+=`<option value="${c.id}">${c.name}</option>`});
  h+=`</select></div><div id="aAttBody"><div class="loading"><div class="loader"></div></div></div>`;app.innerHTML=h;setTimeout(loadAAtt,0)}
async function loadAAtt(){const el=$('aAttBody');if(!el)return;const month=$('attMonth')?.value||new Date().toISOString().substring(0,7);const crId=$('attCR')?.value||'';
  let q=db.collection('attendance').where('date','>=',month+'-01').where('date','<=',month+'-31');
  if(S.orgId)q=q.where('orgId','==',S.orgId);
  if(crId){const crT=S.teachers.filter(t=>(t.classroomIds||[]).includes(crId)).map(t=>t.id);if(crT.length)q=q.where('teacherId','in',crT.slice(0,10))}
  const snap=await q.get();const records=snap.docs.map(d=>d.data());
  if(!records.length){el.innerHTML='<div class="empty"><p>No data</p></div>';return}
  const tP=records.reduce((s,r)=>s+r.presentCount,0),tA=records.reduce((s,r)=>s+r.absentCount,0);const avg=tP+tA>0?Math.round(tP/(tP+tA)*100):0;
  let h=`<div class="score-bar"><div class="score-card"><div class="score-val" style="color:var(--saf)">${records.length}</div><div class="score-lbl">Days</div></div>
  <div class="score-card"><div class="score-val" style="color:var(--grn)">${avg}%</div><div class="score-lbl">Avg</div></div>
  <div class="score-card"><div class="score-val" style="color:var(--blu)">${tP}</div><div class="score-lbl">Present</div></div></div>`;
  const ss={};records.forEach(r=>{(r.records||[]).forEach(sr=>{if(!ss[sr.studentId])ss[sr.studentId]={name:sr.studentName,p:0,a:0,t:0};ss[sr.studentId].t++;if(sr.status==='present')ss[sr.studentId].p++;if(sr.status==='absent')ss[sr.studentId].a++})});
  Object.entries(ss).sort((a,b)=>(b[1].p/b[1].t)-(a[1].p/a[1].t)).forEach(([id,st])=>{const rate=st.t?Math.round(st.p/st.t*100):0;const color=rate>=80?'var(--grn)':rate>=60?'var(--warn)':'var(--red)';
    h+=`<div style="padding:10px 0;border-bottom:1px solid var(--brd)"><div class="flex justify-between items-center"><div class="h3">${st.name}</div><div style="font-weight:800;color:${color}">${rate}%</div></div>
    <div class="flex gap-8 items-center" style="margin-top:4px"><div class="att-stat-bar flex-1"><div class="att-fill" style="width:${rate}%;background:${color}"></div></div><span class="sub2">${st.p}/${st.t}</span></div></div>`});
  el.innerHTML=h}

// Org Admin Settings
function rOASet(){const o=S.orgData||{};
  let h=`<div class="topbar"><div class="h2">⚙️ ${t('settings')}</div></div>`;
  h+=`<div class="panel"><div class="panel-title">🏫 ${t('organisation')} Info</div>
  <div style="font-size:13px;line-height:2.2;color:var(--txt2)">📛 ${o.name||'—'}<br>🔢 ${o.orgNumber||'—'}<br>📍 ${o.address||'—'}<br>📧 ${o.email||'—'}<br>📱 ${o.phone||'—'}<br>👤 ${o.contactPerson||'—'}</div></div>`;
  h+=`<div class="panel"><div class="panel-title">🔐 ${t('password')}</div>
  <div class="fld"><label class="lbl">Current Password</label><input class="inp" type="password" id="curPw"></div>
  <div class="fld"><label class="lbl">New Password</label><input class="inp" type="password" id="newPw"></div>
  <button class="btn btn-p btn-w" onclick="changeAdminPw()">🔐 Change</button></div>`;
  h+=`<div class="panel"><div class="panel-header"><div class="panel-title">👥 Sub-Admins</div><button class="btn btn-p btn-sm" onclick="showAddSubAdmin()">+ ${t('add')}</button></div>
  <div id="subAdminList"><div class="loading" style="min-height:60px"><div class="loader"></div></div></div></div>`;
  setTimeout(loadSubAdmins,0);
  h+=`<div class="panel"><div class="panel-title">🖼️ Logo</div>
  ${S.logo?'<img src="'+S.logo+'" style="width:80px;height:80px;border-radius:16px;object-fit:contain;display:block;margin-bottom:12px;background:var(--card2)">':''}
  <button class="btn btn-s btn-w" onclick="$('logoF').click()">📸 Upload Logo</button>
  <input type="file" accept="image/*" id="logoF" style="display:none" onchange="upLogo(this)"></div>
  <div class="panel"><div class="panel-title">📝 Welcome Message</div>
  <div class="fld"><textarea class="inp" id="wmT" rows="3">${S.welcomeMsg||''}</textarea></div>
  <button class="btn btn-p btn-w" onclick="svWM()">💾 ${t('save')}</button></div>`;
  app.innerHTML=h}

async function upLogo(i){if(!i.files[0])return;try{const d=await compImg(i.files[0],200,0.8);await svSet({logo:d});S.logo=d;toast(t('saved'));rAdmin()}catch(e){toast('Error','err')}}
async function svWM(){await svSet({welcomeMsg:$('wmT').value.trim()});S.welcomeMsg=$('wmT').value.trim();toast(t('saved'))}
async function changeAdminPw(){const cur=$('curPw').value.trim(),nw=$('newPw').value.trim();
  if(!cur||!nw)return toast(t('fillAll'),'err');if(nw.length<4)return toast('Min 4','err');
  const doc=await db.collection('admins').doc(S.uid).get();
  if(!doc.exists||doc.data().password!==cur){toast(t('wrongPassword'),'err');return}
  await db.collection('admins').doc(S.uid).update({password:nw});toast('Password changed ✅');$('curPw').value='';$('newPw').value=''}

async function loadSubAdmins(){const el=$('subAdminList');if(!el)return;
  const snap=await db.collection('admins').where('role','==','orgadmin').where('orgId','==',S.orgId).get();
  const admins=snap.docs.filter(d=>d.id!==S.uid).map(d=>({id:d.id,...d.data()}));
  if(!admins.length){el.innerHTML='<div class="empty"><p>No other admins</p></div>';return}
  let h='';admins.forEach((a,i)=>{h+=`<div class="list-item"><div class="avatar ${avColor(i)}">${(a.name||'A')[0]}</div>
  <div class="flex-1"><div class="h3">${a.name}</div><div class="sub2">@${a.username}</div></div>
  <button class="btn btn-d btn-sm" onclick="delSubAdmin('${a.id}')">🗑</button></div>`});el.innerHTML=h}
function showAddSubAdmin(){app.innerHTML=`<button class="back" onclick="adminBack()">← ${t('back')}</button><div class="panel"><div class="panel-title">➕ Add Sub-Admin</div>
  <div class="fld"><label class="lbl">${t('fullName')}</label><input class="inp" id="saName"></div>
  <div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="saUser" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9]/g,'')"></div>
  <div class="fld"><label class="lbl">${t('password')}</label><input class="inp" id="saPw" type="password"></div>
  <button class="btn btn-p btn-w" onclick="addSubAdmin()">✅ Create</button></div>`}
async function addSubAdmin(){const n=$('saName').value.trim(),u=$('saUser').value.trim(),p=$('saPw').value.trim();
  if(!n||!u||!p)return toast(t('fillAll'),'err');if(p.length<4)return toast('Min 4','err');
  if(!(await db.collection('admins').where('username','==',u).get()).empty)return toast('Taken','err');
  const rk=Math.random().toString(36).slice(2,6).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
  await db.collection('admins').add({name:n,username:u,password:p,role:'orgadmin',orgId:S.orgId,recoveryKey:rk,createdAt:Date.now()});toast(t('created'));adminBack()}
async function delSubAdmin(id){if(!confirm('Delete?'))return;await db.collection('admins').doc(id).delete();toast(t('deleted'));adminBack()}

// ============ FIRST-TIME SUPER ADMIN SETUP ============
function showAdminSetup(){hideNav();
  app.innerHTML=`<div style="text-align:center;padding:20px 0"><div style="font-size:48px">⚡</div><div class="h1" style="margin-top:12px">Platform Setup</div>
  <div class="sub" style="margin-top:4px">Create your Super Admin account</div></div>
  <div class="panel">
  <div class="help-tip"><span class="h-ico">⚠️</span><div>Save your recovery key after setup!</div></div>
  <div class="fld"><label class="lbl">${t('fullName')}</label><input class="inp" id="suName"></div>
  <div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="suUser" oninput="this.value=this.value.toLowerCase().replace(/[^a-z0-9]/g,'')"></div>
  <div class="fld"><label class="lbl">${t('password')}</label><input class="inp" type="password" id="suPw"></div>
  <div class="fld"><label class="lbl">Confirm ${t('password')}</label><input class="inp" type="password" id="suPw2"></div>
  <button class="btn btn-p btn-w" id="suBtn" onclick="createSuperAdmin()">⚡ Create Super Admin</button></div>
  <button class="back" onclick="lP('superadmin')">← ${t('back')}</button>`}

async function createSuperAdmin(){
  const name=$('suName').value.trim(),u=$('suUser').value.trim(),pw=$('suPw').value.trim(),pw2=$('suPw2').value.trim();
  if(!name||!u||!pw)return toast(t('fillAll'),'err');if(pw.length<4)return toast('Min 4','err');if(pw!==pw2)return toast('Passwords do not match','err');
  const existing=await db.collection('admins').where('role','==','superadmin').get();
  if(!existing.empty)return toast('Super Admin already exists!','err');
  if(!(await db.collection('admins').where('username','==',u).get()).empty)return toast('Taken','err');
  const rk=Math.random().toString(36).slice(2,6).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase()+'-'+Math.random().toString(36).slice(2,6).toUpperCase();
  $('suBtn').disabled=true;$('suBtn').textContent='Creating...';
  await db.collection('admins').add({name,username:u,password:pw,role:'superadmin',orgId:'',recoveryKey:rk,createdAt:Date.now()});
  app.innerHTML=`<div style="text-align:center;padding:30px 0"><div style="font-size:64px">✅</div><div class="h1" style="margin-top:16px">Super Admin Created!</div></div>
  <div class="panel" style="border:2px solid var(--warn)"><div class="panel-title" style="color:var(--warn)">⚠️ SAVE YOUR RECOVERY KEY</div>
  <div style="background:var(--bg);padding:16px;border-radius:12px;text-align:center;margin:12px 0">
  <div style="font-size:24px;font-weight:900;letter-spacing:3px;color:var(--saf);font-family:monospace">${rk}</div></div>
  <div class="sub2" style="text-align:center">Username: <b>${u}</b></div></div>
  <button class="btn btn-p btn-w" onclick="lP('superadmin')">✅ Go to Login</button>`}

function showForgotPw(){hideNav();
  app.innerHTML=`<div style="text-align:center;padding:20px 0"><div style="font-size:48px">🔑</div><div class="h1" style="margin-top:12px">Reset Password</div></div>
  <div class="panel">
  <div class="fld"><label class="lbl">${t('username')}</label><input class="inp" id="rpUser"></div>
  <div class="fld"><label class="lbl">Recovery Key</label><input class="inp" id="rpKey" style="font-family:monospace;text-transform:uppercase;letter-spacing:2px"></div>
  <div class="fld"><label class="lbl">New ${t('password')}</label><input class="inp" type="password" id="rpNewPw"></div>
  <button class="btn btn-p btn-w" onclick="resetAdminPw()">🔑 Reset</button></div>
  <button class="back" onclick="R()">← ${t('back')}</button>`}
async function resetAdminPw(){const u=$('rpUser').value.trim().toLowerCase(),key=$('rpKey').value.trim().toUpperCase(),nw=$('rpNewPw').value.trim();
  if(!u||!key||!nw)return toast(t('fillAll'),'err');if(nw.length<4)return toast('Min 4','err');
  const snap=await db.collection('admins').where('username','==',u).get();
  if(snap.empty)return toast(t('notFound'),'err');
  const doc=snap.docs[0];if(doc.data().recoveryKey!==key)return toast('Invalid key','err');
  await db.collection('admins').doc(doc.id).update({password:nw});toast('Password reset ✅');R()}
