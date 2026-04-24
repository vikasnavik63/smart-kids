/* ============================================================
   SMART KIDS ADMIN PANEL — JavaScript
   Handles: Login, Navigation, CRUD, Modals, Search, Dark Mode
   ============================================================ */

'use strict';

const BASE_URL =
location.hostname === "127.0.0.1" ||
location.hostname === "localhost"
? "http://localhost:5000"
: "https://smart-kids-backend.onrender.com";

/* ================================================================
   DEMO DATA
   ================================================================ */

let teachers = [
  { id:1, name:'Mrs. Priya Sharma',   email:'priya@smart.edu',  username:'priya.s',  password:'teach@123', date:'2024-01-15', status:'Active' },
  { id:2, name:'Mr. Ramesh Gupta',    email:'ramesh@smart.edu', username:'ramesh.g', password:'teach@456', date:'2024-02-01', status:'Active' },
  { id:3, name:'Ms. Anjali Verma',    email:'anjali@smart.edu', username:'anjali.v', password:'teach@789', date:'2024-03-10', status:'Inactive' },
  { id:4, name:'Mr. Suresh Yadav',    email:'suresh@smart.edu', username:'suresh.y', password:'teach@321', date:'2024-04-05', status:'Active' },
];

let students = [
  { id:1, name:'Arjun Kumar',    email:'arjun@mail.com',  cls:'Class 3', stars:320, progress:78, date:'2024-01-20' },
  { id:2, name:'Sneha Patel',    email:'sneha@mail.com',  cls:'UKG',     stars:210, progress:55, date:'2024-02-14' },
  { id:3, name:'Rohan Singh',    email:'rohan@mail.com',  cls:'Class 1', stars:450, progress:90, date:'2024-03-01' },
  { id:4, name:'Pooja Mishra',   email:'pooja@mail.com',  cls:'Class 2', stars:180, progress:42, date:'2024-03-20' },
  { id:5, name:'Dev Sharma',     email:'dev@mail.com',    cls:'LKG',     stars:90,  progress:30, date:'2024-04-02' },
  { id:6, name:'Riya Aggarwal',  email:'riya@mail.com',   cls:'Class 3', stars:500, progress:95, date:'2024-01-10' },
];


let messages = [];

let classes = [];

/* ================================================================
   CREDENTIALS
   ================================================================ */
const ADMIN_USER = 'admin';
const ADMIN_PASS = 'admin123';

/* ================================================================
   APP STATE
   ================================================================ */
let isDark = false;
let isSidebarCollapsed = false;
let currentTeacherEditIndex = null;

/* ================================================================
   LOGIN
   ================================================================ */

// DOM Ready
document.addEventListener('DOMContentLoaded', () => {

  document.getElementById('loginForm')
    .addEventListener('submit', handleLogin);

  buildBarChart();

  const isLoggedIn = localStorage.getItem("adminLoggedIn");

  if (isLoggedIn === "true") {
    enterDashboard();
    loadAdminProfile();
  }

});
/**
 * Handle login form submission
 */
async function handleLogin(e) {
  e.preventDefault();

  const user = document.getElementById('loginUsername').value.trim();
  const pass = document.getElementById('loginPassword').value.trim();
  const errEl = document.getElementById('loginError');

  errEl.textContent = '';

  if (!user || !pass) {
    errEl.textContent = "Please enter username and password.";
    return;
  }

  try {

   const res = await fetch(`${BASE_URL}/admin-login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: user,
        password: pass
      })
    });

    const data = await res.json();

    if (data.success) {

   localStorage.setItem("adminLoggedIn","true");
   localStorage.setItem("adminName", data.name);

   enterDashboard();

    } else {
      errEl.textContent = data.message || "Invalid login";
    }

  } catch (err) {
    errEl.textContent = "Server error.";
  }
}

/**
 * Show/Hide password toggle
 */
function togglePassword() {
  const inp = document.getElementById('loginPassword');
  const icon = document.getElementById('eyeIcon');
  if (inp.type === 'password') {
    inp.type = 'text';
    icon.className = 'fas fa-eye-slash';
  } else {
    inp.type = 'password';
    icon.className = 'fas fa-eye';
  }
}

/**
 * Transition to dashboard
 */
function enterDashboard() {
  document.getElementById('loginPage').classList.remove('active');
  document.body.classList.remove('login-view');

  const panel = document.getElementById('adminPanel');
  panel.classList.add('active');

  // Render all data
  loadTeachers();
  renderStudents();
  renderLoginHistory();
  renderMessages();
  renderClasses();
  renderGames();
  updateDashStats();
  const weekly = document.querySelector(".chart-card");
  if (weekly) weekly.remove();
  loadRecentLogins();
}

/* ================================================================
   NAVIGATION
   ================================================================ */

const SECTION_LABELS = {
  dashboard:    'Dashboard',
  teachers:     'Teacher Management',
  students:     'Student Management',
  loginHistory: 'Login History',
  messages:     'Contact Messages',
  classes:      'Class Management',
  games:        'Game Management',
  settings:     'Settings',
};

/**
 * Show a specific section
 * @param {string} name - Section key
 * @param {HTMLElement|null} navItem - Clicked nav item
 */
function showSection(name, navItem) {
  // Hide all sections
  document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
  // Show target
  const target = document.getElementById('sec-' + name);
  if (target) target.classList.add('active');

  // Update nav active state
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (navItem) {
    navItem.classList.add('active');
  } else {
    // Find it from data-section
    const found = document.querySelector(`.nav-item[data-section="${name}"]`);
    if (found) found.classList.add('active');
  }

  // Update breadcrumb
  document.getElementById('breadcrumb').textContent = SECTION_LABELS[name] || name;

  // Close mobile sidebar after navigation
  if (window.innerWidth <= 768) {
    document.getElementById('sidebar').classList.remove('mobile-open');
  }

  // Close dropdowns
  closeDropdowns();
}

/* ================================================================
   SIDEBAR
   ================================================================ */

/**
 * Toggle sidebar collapse / mobile open
 */
function toggleSidebar() {
  const sidebar = document.getElementById('sidebar');
  if (window.innerWidth <= 768) {
    sidebar.classList.toggle('mobile-open');
  } else {
    sidebar.classList.toggle('collapsed');
    isSidebarCollapsed = sidebar.classList.contains('collapsed');
  }
}

/* ================================================================
   DARK MODE
   ================================================================ */

/**
 * Toggle dark mode
 */
function toggleDark() {
  isDark = !isDark;
  document.body.classList.toggle('dark', isDark);
  const icon = document.getElementById('darkIcon');
  if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
  // Sync settings toggle
  const chk = document.getElementById('darkToggle');
  if (chk) chk.checked = isDark;
}

/* ================================================================
   DROPDOWNS
   ================================================================ */

function toggleNotif() {
  const dd = document.getElementById('notifDropdown');
  dd.classList.toggle('open');
  document.getElementById('profileMenu').classList.remove('open');
}

function toggleProfileMenu() {
  const pm = document.getElementById('profileMenu');
  pm.classList.toggle('open');
  document.getElementById('notifDropdown').classList.remove('open');
}

function closeDropdowns() {
  document.getElementById('notifDropdown').classList.remove('open');
  document.getElementById('profileMenu').classList.remove('open');
}

// Close dropdowns on outside click
document.addEventListener('click', (e) => {
  if (!e.target.closest('.notif-wrapper')) {
    document.getElementById('notifDropdown')?.classList.remove('open');
  }
  if (!e.target.closest('.admin-profile')) {
    document.getElementById('profileMenu')?.classList.remove('open');
  }
});

/* ================================================================
   MODALS
   ================================================================ */

/**
 * Open a modal by ID
 */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
}

/**
 * Close a modal by ID
 */
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
}

// Close modal on overlay click
document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('open');
  }
});

/* ================================================================
   TOAST NOTIFICATIONS
   ================================================================ */

let toastTimer = null;

/**
 * Show a toast notification
 * @param {string} msg - Message text
 * @param {'success'|'error'|'info'} type
 */
function showToast(msg, type = 'info') {
  const toast = document.getElementById('toast');
  toast.textContent = msg;
  toast.className = `toast show ${type}`;
  if (toastTimer) clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

/* ================================================================
   CONFIRM DELETE
   ================================================================ */

/**
 * Show confirm dialog and execute callback on confirm
 */
function confirmDelete(message, callback) {
  document.getElementById('confirmText').textContent = message;
  openModal('confirmModal');
  const btn = document.getElementById('confirmBtn');
  btn.onclick = () => {
    closeModal('confirmModal');
    callback();
  };
}

/* ================================================================
   SEARCH FILTER
   ================================================================ */

/**
 * Generic table search filter
 * @param {string} inputId  - Input element ID
 * @param {string} tableId  - Table element ID
 */
function searchTable(inputId, tableId) {
  const query = document.getElementById(inputId).value.toLowerCase().trim();
  const rows = document.querySelectorAll(`#${tableId} tbody tr`);
  let found = 0;
  rows.forEach(row => {
    const text = row.textContent.toLowerCase();
    const match = text.includes(query);
    row.style.display = match ? '' : 'none';
    if (match) found++;
  });
}

/* ================================================================
   DASHBOARD
   ================================================================ */

/**
 * Update dashboard stat counters
 */
async function updateDashStats() {
  try {

    const [
      teacherRes,
      studentRes,
      msgRes,
      loginRes
    ] = await Promise.all([
  fetch(`${BASE_URL}/admin-teachers`),
  fetch(`${BASE_URL}/admin-students`),
  fetch(`${BASE_URL}/admin-messages`),
  fetch(`${BASE_URL}/login-history`)
]);

    const [
      teacherData,
      studentData,
      msgData,
      loginData
    ] = await Promise.all([
      teacherRes.json(),
      studentRes.json(),
      msgRes.json(),
      loginRes.json()
    ]);

    const logs = loginData.logs || [];

    const todayIST = new Date().toLocaleDateString("en-IN");

    const todayCount = logs.filter(log => {
      const raw = log.loginTime || log.date;
      if (!raw) return false;

      return new Date(raw).toLocaleDateString("en-IN") === todayIST;
    }).length;

    document.getElementById("statTeachers").textContent =
      (teacherData.teachers || []).length;

    document.getElementById("statStudents").textContent =
      (studentData.students || []).length;

    document.getElementById("statClasses").textContent = 3;
    document.getElementById("statGames").textContent = 14;

    document.getElementById("statMessages").textContent =
      (msgData.messages || []).length;

    document.getElementById("statLogins").textContent =
      todayCount;

  } catch (error) {
    console.log(error);
  }
}
/**
 * Build the weekly bar chart with random data
 */
function buildBarChart() {
  const container = document.getElementById('barChart');
  if (!container) return;

  const days   = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
  const values = [14, 22, 18, 30, 26, 12, 18];
  const max    = Math.max(...values);

  const colors = [
    'var(--grad-blue)', 'var(--grad-purple)', 'var(--grad-orange)',
    'var(--grad-green)', 'var(--grad-pink)', 'var(--grad-teal)', 'var(--grad-blue)'
  ];

  container.innerHTML = '';
  days.forEach((day, i) => {
    const pct = Math.round((values[i] / max) * 100);
    const group = document.createElement('div');
    group.className = 'bar-group';
    group.innerHTML = `
      <span class="bar-val">${values[i]}</span>
      <div class="bar-wrap">
        <div class="bar" style="height:${pct}%;background:${colors[i]}" title="${values[i]} logins"></div>
      </div>
      <span class="bar-label">${day}</span>
    `;
    container.appendChild(group);
  });
}

/* ================================================================
   TEACHERS SECTION
   ================================================================ */

/**
 * Render teachers table
 */
function renderTeachers() {
  const tbody = document.getElementById('teacherBody');
  if (!tbody) return;

  if (teachers.length === 0) {
    tbody.innerHTML = `<tr><td colspan="7"><div class="empty-state"><i class="fas fa-chalkboard-teacher"></i><p>No teachers found.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = teachers.map((t, i) => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="width:32px;height:32px;border-radius:8px;background:var(--grad-blue);display:flex;align-items:center;justify-content:center;color:white;font-weight:900;font-size:13px;">
            ${t.name.charAt(0)}
          </div>
          <strong>${escHtml(t.name)}</strong>
        </div>
      </td>
      <td>${escHtml(t.email)}</td>
      <td><code style="background:var(--bg);padding:3px 8px;border-radius:6px;font-size:12px;">${escHtml(t.username)}</code></td>
      <td><code style="background:var(--bg);padding:3px 8px;border-radius:6px;font-size:12px;">••••••••</code></td>
      <td>${formatDate(t.date)}</td>
      <td><span class="chip ${t.status === 'Active' ? 'active' : 'inactive'}">${t.status}</span></td>
      <td>
        <div style="display:flex;gap:6px;">
          <button class="act-btn act-edit" onclick="editTeacher(${i})" title="Edit"><i class="fas fa-edit"></i></button>
          <button class="act-btn act-delete" onclick="deleteTeacher(${i})" title="Delete"><i class="fas fa-trash"></i></button>
        </div>
      </td>
    </tr>
  `).join('');

  updateDashStats();
}

/**
 * Add new teacher from modal form
 */
async function addTeacher() {
  const name = document.getElementById("tName").value.trim();
  const email = document.getElementById("tEmail").value.trim();
  const username = document.getElementById("tUsername").value.trim();
  const password = document.getElementById("tPassword").value.trim();
  const status = document.getElementById("tStatus").value;

  if (!name || !email || !username || !password) {
    showToast("Fill all fields", "error");
    return;
  }

  const res = await fetch(`${BASE_URL}/add-teacher`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
   body: JSON.stringify({
  name,
  email,
  username,
  password,
  status
})
  });

  const data = await res.json();

  if (data.success) {
    showToast("Teacher Added", "success");
    closeModal("addTeacherModal");
    loadTeachers();
  } else {
    showToast(data.message, "error");
  }
}

//load teacher
async function loadTeachers() {
  const res = await fetch(`${BASE_URL}/admin-teachers`);
  const data = await res.json();

  const tbody = document.getElementById("teacherBody");

  tbody.innerHTML = data.teachers.map((t) => `
    <tr>
      <td>
        <div style="display:flex;align-items:center;gap:10px;">
          <div style="
            width:36px;
            height:36px;
            border-radius:10px;
            background:linear-gradient(135deg,#667eea,#4facfe);
            color:white;
            display:flex;
            justify-content:center;
            align-items:center;
            font-weight:700;">
            ${t.name.charAt(0).toUpperCase()}
          </div>
          <strong>${t.name}</strong>
        </div>
      </td>

      <td>${t.email}</td>

      <td>
        <code style="
          background:#f3f4f6;
          padding:6px 10px;
          border-radius:8px;">
          ${t.username}
        </code>
      </td>

      <td>
        <code style="
          background:#f3f4f6;
          padding:6px 10px;
          border-radius:8px;">
          ••••••••
        </code>
      </td>

      <td>${new Date(t.createdAt).toLocaleDateString()}</td>

      <td>
  <span style="
    background:${t.status === 'Inactive' ? '#fee2e2' : '#dcfce7'};
    color:${t.status === 'Inactive' ? '#dc2626' : '#15803d'};
    padding:5px 12px;
    border-radius:20px;
    font-size:12px;
    font-weight:600;">
    ${t.status || 'Active'}
  </span>
</td>

      <td>
        <div style="display:flex;gap:8px;">

          <button onclick="editTeacher('${t._id}')"
          style="
          width:34px;
          height:34px;
          border:none;
          border-radius:10px;
          background:#eef2ff;
          color:#4f46e5;
          cursor:pointer;">
          ✏️
          </button>

          <button onclick="deleteTeacher('${t._id}')"
          style="
          width:34px;
          height:34px;
          border:none;
          border-radius:10px;
          background:#fef2f2;
          color:#ef4444;
          cursor:pointer;">
          🗑️
          </button>

        </div>
      </td>
    </tr>
  `).join("");
}
/**
 * Open edit teacher modal
 */
async function editTeacher(id) {
 const res = await fetch(`${BASE_URL}/admin-teachers`);
  const data = await res.json();

  const teacher = data.teachers.find(t => t._id === id);

  if (!teacher) return;

  document.getElementById("editTeacherIndex").value = teacher._id;
  document.getElementById("etName").value = teacher.name;
  document.getElementById("etEmail").value = teacher.email;
  document.getElementById("etUsername").value = teacher.username;
  document.getElementById("etPassword").value = teacher.password;
  document.getElementById("etStatus").value = teacher.status || "Active";

  openModal("editTeacherModal");
}

/**
 * Save edited teacher
 */
async function saveEditTeacher() {
  const id = document.getElementById("editTeacherIndex").value;

  const name = document.getElementById("etName").value.trim();
  const email = document.getElementById("etEmail").value.trim();
  const username = document.getElementById("etUsername").value.trim();
  const password = document.getElementById("etPassword").value.trim();
  const status = document.getElementById("etStatus").value;

  const res = await fetch(`${BASE_URL}/update-teacher/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      username,
      password,
      status
    })
  });

  const data = await res.json();

  if (data.success) {
    closeModal("editTeacherModal");
    loadTeachers();
    showToast("Teacher Updated", "success");
  }
}

/**
 * Delete a teacher
 */
async function deleteTeacher(id) {
  if (!confirm("Delete this teacher?")) return;

  const res = await fetch(`${BASE_URL}/teacher/${id}`, {
    method: "DELETE"
  });

  const data = await res.json();

  if (data.success) {
    showToast("Teacher deleted", "success");
    loadTeachers();
  } else {
    showToast("Delete failed", "error");
  }
}

/* ================================================================
   STUDENTS SECTION
   ================================================================ */

/**
 * Render students table
 */
async function renderStudents() {

  const tbody = document.getElementById("studentBody");

  const res = await fetch(`${BASE_URL}/admin-students`);
  const data = await res.json();

  const students = data.students || [];

  if (students.length === 0) {
    tbody.innerHTML = `<tr><td colspan="5">No students found</td></tr>`;
    return;
  }

  tbody.innerHTML = students.map(s => `

    <tr>
  <td>${s.name}</td>
  <td>${s.email}</td>
  <td>⭐ ${s.totalStars || 0}</td>
  <td>${s.createdAt ? new Date(s.createdAt).toLocaleString("en-IN") : "Old Account"}</td>
  <td>
    <button class="act-btn act-delete"
      onclick="deleteStudent('${s._id}')">
      <i class="fas fa-trash"></i>
    </button>
  </td>
</tr>

  `).join('');
}

/**
 * Delete a student
 */
function deleteStudent(id) {

  confirmDelete("Delete this student account?", async () => {

    await fetch(`${BASE_URL}/delete-student/${id}`, {
      method: "DELETE"
    });

    renderStudents();

    showToast("Student deleted", "success");

  });

}

/* ================================================================
   LOGIN HISTORY
   ================================================================ */

let loginHistory = [];
let loginFilter = "all";

// LOAD FROM DATABASE
async function renderLoginHistory() {

  const tbody = document.getElementById("loginHistoryBody");

  const res = await fetch(`${BASE_URL}/login-history`);
  const data = await res.json();

  loginHistory = data.logs || [];

  applyLoginFilter();
}

// FILTER BUTTON CLICK
function filterLogin(type, btn) {

  loginFilter = type;

  document.querySelectorAll(".chip-btn")
    .forEach(b => b.classList.remove("active"));

  btn.classList.add("active");

  applyLoginFilter();
}

// APPLY FILTER
function applyLoginFilter() {

  const tbody = document.getElementById("loginHistoryBody");

  let rows = [...loginHistory];

  const today = new Date().toDateString();

  if (loginFilter === "today") {
    rows = rows.filter(x =>
      new Date(x.date).toDateString() === today
    );
  }

  if (loginFilter === "teacher") {
    rows = rows.filter(x => x.role === "Teacher");
  }

  if (loginFilter === "student") {
    rows = rows.filter(x => x.role === "Student");
  }

  if (rows.length === 0) {
    tbody.innerHTML = `
      <tr><td colspan="6">No records found</td></tr>
    `;
    return;
  }

  tbody.innerHTML = rows.map(x => `
    <tr>
      <td>${x.userName}</td>
      <td>
        <span class="chip ${x.role === "Teacher" ? "teacher" : "student"}">
          ${x.role}
        </span>
      </td>
      <td>${new Date(x.loginTime).toLocaleTimeString("en-IN")}</td>
      <td>${x.logoutTime ? new Date(x.logoutTime).toLocaleTimeString("en-IN") : "-"}</td>
      <td>${new Date(x.date).toLocaleDateString("en-IN")}</td>
      <td>
        <span class="chip ${x.status === "Active" ? "active" : "inactive"}">
          ${x.status}
        </span>
      </td>
    </tr>
  `).join("");
}

/* ================================================================
   MESSAGES SECTION
   ================================================================ */

async function renderMessages() {

  const grid = document.getElementById("messagesGrid");

  const res = await fetch(`${BASE_URL}/admin-messages`);
  const data = await res.json();

  messages = data.messages || [];
  const badge = document.getElementById("msgCount");

if (badge) {
  badge.textContent = messages.length;

  badge.style.display =
    messages.length === 0 ? "none" : "inline-block";
}

  if (messages.length === 0) {
    grid.innerHTML = `
      <div class="empty-state">
        <i class="fas fa-envelope"></i>
        <p>No messages yet.</p>
      </div>
    `;
    return;
  }

  grid.innerHTML = messages.map((m, i) => `
    <div class="msg-card ${!m.read ? 'unread' : ''}">
      <div class="msg-header">

        <div class="msg-sender">
          <strong>${m.name}</strong>
          <small>${m.email}</small>
        </div>

        <span class="msg-date">
          ${new Date(m.createdAt).toLocaleDateString("en-IN")}
        </span>

      </div>

      <p class="msg-text">
        ${m.msg.substring(0,120)}
      </p>

      <div class="msg-actions">

        <button class="act-btn act-view"
        onclick="viewMessage(${i})">
        <i class="fas fa-eye"></i>
        </button>

        <button class="act-btn act-delete"
        onclick="deleteMessage('${m._id}')">
        <i class="fas fa-trash"></i>
        </button>

      </div>
    </div>
  `).join("");

  updateDashStats();
}


function viewMessage(index) {

  const m = messages[index];

  document.getElementById("viewMessageBody").innerHTML = `
    <h3>${m.name}</h3>
    <p>${m.email}</p>
    <br>
    <p>${m.msg}</p>
  `;

  openModal("viewMessageModal");
}


async function deleteMessage(id) {

  await fetch(`${BASE_URL}/delete-message/${id}`, {
    method: "DELETE"
  });

  renderMessages();
}

/* ================================================================
   CLASSES SECTION
   ================================================================ */

const CLASS_COLORS = [
  'var(--grad-green)', 'var(--grad-pink)', 'var(--grad-blue)',
  'var(--grad-purple)', 'var(--grad-orange)', 'var(--grad-teal)'
];

/**
 * Render class cards
 */
async function renderClasses() {

  const grid = document.getElementById("classesGrid");
  if (!grid) return;

 const res = await fetch(`${BASE_URL}/classes-status`);
  const data = await res.json();

  classes = data.classes || [];

  grid.innerHTML = classes.map((c, i) => `
    <div class="class-card">

      <div class="class-icon" style="background:${c.color}">
        ${c.icon}
      </div>

      <div class="class-name">${c.name}</div>

      <div class="class-status">
        <span class="chip ${c.status === "Active" ? "active" : "inactive"}">
          ${c.status}
        </span>
      </div>

      <div class="class-actions">

        <button class="act-btn act-toggle"
          onclick="toggleClass('${c._id}')">

          <i class="fas fa-power-off"></i>

        </button>

      </div>

    </div>
  `).join("");
}

/**
 * Toggle class status
 */
async function toggleClass(id) {

  await fetch(`${BASE_URL}/toggle-class`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ id })
  });

  renderClasses();

  showToast("Class status updated", "success");
}

/* ================================================================
   GAMES SECTION
   ================================================================ */

let games = [];

// LOAD GAMES FROM DATABASE
async function renderGames() {

  const tbody = document.getElementById("gameBody");
  if (!tbody) return;

 const res = await fetch(`${BASE_URL}/games-status`);
  const data = await res.json();

  games = data.games || [];

  if (games.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="4">No games found</td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = games.map(g => `
    <tr>

      <td>
        <strong>${g.name}</strong>
      </td>

      <td>
        <span class="chip teacher">
          ${g.category}
        </span>
      </td>

      <td>
        <span class="chip ${
          g.status === "Enabled"
          ? "active"
          : "inactive"
        }">
          ${g.status}
        </span>
      </td>

      <td>
        <button class="act-btn act-toggle"
          onclick="toggleGame('${g._id}')">

          <i class="fas fa-power-off"></i>

        </button>
      </td>

    </tr>
  `).join("");

  updateDashStats();
}


// TOGGLE GAME
async function toggleGame(id) {

 await fetch(`${BASE_URL}/toggle-game`, {
    method:"POST",
    headers:{
      "Content-Type":"application/json"
    },
    body: JSON.stringify({ id })
  });

  renderGames();

  showToast("Game status updated","success");
}
/* ================================================================
   LOGOUT
   ================================================================ */

/**
 * Log out from admin panel
 */
function logout() {
  localStorage.removeItem("adminLoggedIn");
  document.getElementById('adminPanel').classList.remove('active');
  document.getElementById('loginPage').classList.add('active');
  document.body.classList.add('login-view');
  document.getElementById('loginUsername').value = '';
  document.getElementById('loginPassword').value = '';
  document.getElementById('loginError').textContent = '';
  isDark = false;
  document.body.classList.remove('dark');
}

/* ================================================================
   UTILITY FUNCTIONS
   ================================================================ */

/**
 * Escape HTML special characters to prevent XSS
 */
function escHtml(str) {
  return String(str)
    .replace(/&/g,'&amp;')
    .replace(/</g,'&lt;')
    .replace(/>/g,'&gt;')
    .replace(/"/g,'&quot;');
}

/**
 * Format ISO date string to readable format
 */
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', { day:'2-digit', month:'short', year:'numeric' });
}

/**
 * Clear form fields
 */
function clearForm(ids) {
  ids.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.value = '';
  });
}

//dash update 
async function loadRecentLogins() {

  const box = document.getElementById("recentLoginList");
  if (!box) return;

  const res = await fetch(`${BASE_URL}/login-history`);
  const data = await res.json();

  const logs = (data.logs || []).slice(0, 4);

  if (logs.length === 0) {
    box.innerHTML = "<li>No recent logins</li>";
    return;
  }

  box.innerHTML = logs.map(x => `
    <li>
      <div class="rl-avatar ${x.role === 'Teacher' ? 't' : 's'}">
        ${x.userName.charAt(0).toUpperCase()}
      </div>

      <div class="rl-info">
        <strong>${x.userName}</strong>
        <small>
          ${x.role} · ${new Date(x.loginTime).toLocaleTimeString("en-IN")}
        </small>
      </div>

      <span class="chip ${x.status === "Active" ? "active" : "inactive"}">
        ${x.status}
      </span>
    </li>
  `).join("");
}

async function changePassword(){

const currentPassword =
document.getElementById("currentPassword").value;

const newPassword =
document.getElementById("newPassword").value;

const confirmPassword =
document.getElementById("confirmPassword").value;

if(newPassword !== confirmPassword){
   alert("Passwords do not match");
   return;
}

const res = await fetch(`${BASE_URL}/change-admin-password`, {
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
currentPassword,
newPassword
})
});

const data = await res.json();

alert(data.message);
document.getElementById("currentPassword").value = "";
document.getElementById("newPassword").value = "";
document.getElementById("confirmPassword").value = "";

document.getElementById("currentPassword").type = "text";
document.getElementById("newPassword").type = "text";
document.getElementById("confirmPassword").type = "text";

document.getElementById("currentPassword").type = "password";
document.getElementById("newPassword").type = "password";
document.getElementById("confirmPassword").type = "password";

document.activeElement.blur();
}

//otp 
function openForgotPopup(){
document.getElementById("forgotPopup").style.display="flex";
}

function closeForgotPopup(){
document.getElementById("forgotPopup").style.display="none";
}

async function sendOTP(){

const email =
document.getElementById("resetEmail").value;

const res = await fetch(
`${BASE_URL}/send-admin-otp`, {
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ email })
});

const data = await res.json();

alert(data.message);

if(data.success){
document.getElementById("emailStep").style.display="none";
document.getElementById("otpStep").style.display="block";
}

}

async function verifyOTP(){

const email =
document.getElementById("resetEmail").value;

const otp =
document.getElementById("otpInput").value;

const res = await fetch(
  `${BASE_URL}/verify-admin-otp`,
  {
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({ email, otp })
});

const data = await res.json();

alert(data.message);

if(data.success){
document.getElementById("otpStep").style.display="none";
document.getElementById("passwordStep").style.display="block";
}

}

async function resetPassword(){

const email =
document.getElementById("resetEmail").value;

const otp =
document.getElementById("otpInput").value;

const newPassword =
document.getElementById("newResetPass").value;

const confirmPassword =
document.getElementById("confirmResetPass").value;

if(newPassword !== confirmPassword){
alert("Passwords do not match");
return;
}

const res = await fetch(
  `${BASE_URL}/reset-admin-password`,
  {
method:"POST",
headers:{ "Content-Type":"application/json" },
body:JSON.stringify({
email,
otp,
newPassword
})
});

const data = await res.json();

alert(data.message);

if(data.success){
closeForgotPopup();
}

}

function loadAdminProfile() {

  const adminName =
    localStorage.getItem("adminName") || "Vikash Navik";

  const avatar =
    document.getElementById("adminAvatar");

  const topName =
    document.getElementById("adminNameTop");

  const greet =
    document.getElementById("adminGreeting");

  topName.textContent = adminName;

  avatar.textContent =
    adminName.charAt(0).toUpperCase();

  const hour = new Date().getHours();

  let msg = "";

  if (hour < 12) {
    msg = "Good Morning";
  }
  else if (hour < 17) {
    msg = "Good Afternoon";
  }
  else {
    msg = "Good Evening";
  }

  greet.textContent =
    `${msg}, ${adminName}! 👋`;
}