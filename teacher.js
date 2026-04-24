/* =============================================
   SmartKids Teacher Panel — teacher.js
   Frontend JavaScript (No frameworks!)
   ============================================= */

// -----------------------------------------------
// CONFIG: Set your backend server URL here

// -----------------------------------------------
const API_BASE =
location.hostname === "127.0.0.1" ||
location.hostname === "localhost"
? "http://localhost:5000"
: "https://smart-kids-backend.onrender.com";
// -----------------------------------------------
// PAGE NAVIGATION HELPERS
// -----------------------------------------------

/** Show a page by ID, hide all others */
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const page = document.getElementById(pageId);
  if (page) page.classList.add('active');
}

/** Switch between dashboard sections (sidebar nav) */
function switchSection(sectionName) {
  // Remove active from all nav links
  document.querySelectorAll('.nav-link').forEach(link => link.classList.remove('active'));

  // Add active to matching nav link
  const activeLink = document.querySelector(`.nav-link[data-section="${sectionName}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Hide all sections, show the selected one
  document.querySelectorAll('.content-section').forEach(s => s.classList.remove('active'));
  const section = document.getElementById(`section-${sectionName}`);
  if (section) section.classList.add('active');

  // Close sidebar on mobile when a link is clicked
  document.getElementById('sidebar').classList.remove('open');

  // Refresh data when switching sections
if (sectionName === 'students') loadStudents();
if (sectionName === 'home') updateStats();
if (sectionName === 'assignments') loadAssignments();
if (sectionName === 'submissions') loadSubmissions();
if (sectionName === 'upload') loadMaterials();
}

// -----------------------------------------------
// ✅ LOGIN FUNCTIONALITY
// -----------------------------------------------

/** Toggle password field visibility */
const toggleBtn = document.getElementById('toggle-pass');

if (toggleBtn) {
  toggleBtn.addEventListener('click', function () {
    const passInput = document.getElementById('password');
    const eyeIcon = document.getElementById('eye-icon');

    if (passInput.type === 'password') {
      passInput.type = 'text';
      eyeIcon.className = 'ph ph-eye-slash';
    } else {
      passInput.type = 'password';
      eyeIcon.className = 'ph ph-eye';
    }
  });
}

/** Handle Login Form Submission */
document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault();

  const username = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  document.getElementById('email-error').textContent = '';
  document.getElementById('pass-error').textContent = '';
  hideEl('login-error');

  let hasError = false;

  if (!username) {
    document.getElementById('email-error').textContent = 'Please enter username.';
    hasError = true;
  }

  if (!password) {
    document.getElementById('pass-error').textContent = 'Please enter password.';
    hasError = true;
  }

  if (hasError) return;

  document.getElementById('btn-text').style.display = 'none';
  document.getElementById('btn-loader').style.display = 'inline-block';
  document.getElementById('login-btn').disabled = true;

  try {
    const response = await fetch(`${API_BASE}/teacher-login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });

    const data = await response.json();

   if (data.success) {

  localStorage.setItem("teacher", JSON.stringify(data.teacher));
  localStorage.setItem("teacherLogId", data.logId);

  document.getElementById("teacherName").textContent =
    data.teacher.name;

  document.getElementById("teacherRole").textContent =
    "Teacher";

  document.getElementById("welcomeTeacher").textContent =
    `Welcome back, ${data.teacher.name}! 👋`;

  loadTeacherProfileImage();

  showPage("dashboard-page");

  updateStats();
  loadStudents();
  loadAssignments();
  loadSubmissions();
  loadMaterials();

}

 else {
      showEl('login-error');
      document.getElementById('login-error').textContent = data.message;
    }

  } catch (err) {
    showEl('login-error');
    document.getElementById('login-error').textContent = 'Server not running';
  }

  document.getElementById('btn-text').style.display = 'inline';
  document.getElementById('btn-loader').style.display = 'none';
  document.getElementById('login-btn').disabled = false;
});


// -----------------------------------------------
// 🚪 LOGOUT
// -----------------------------------------------
document.getElementById("logout-btn").addEventListener("click", async function () {

  const logId = localStorage.getItem("teacherLogId");

  if (logId) {
    await fetch(`${API_BASE}/logout-user`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ logId })
    });
  }

  localStorage.removeItem("teacher");
  localStorage.removeItem("teacherLogId");

  showPage("login-page");
});


// -----------------------------------------------
// 📊 STATS UPDATE (Dashboard home overview)
// -----------------------------------------------
async function updateStats() {
  try {
    const res1 = await fetch(`${API_BASE}/students`);
    const data1 = await res1.json();
    animateCount('stat-students', data1.students.length);

    const res2 = await fetch(`${API_BASE}/assignments`);
    const data2 = await res2.json();
    animateCount('stat-assignments', data2.assignments.length);

  } catch (e) {
    console.error('Stats error:', e);
  }
}

/** Animate a number counting up */
function animateCount(elementId, target) {
  const el = document.getElementById(elementId);
  let current = 0;
  const step = Math.ceil(target / 20);
  const timer = setInterval(() => {
    current = Math.min(current + step, target);
    el.textContent = current;
    if (current >= target) clearInterval(timer);
  }, 40);
}


// -----------------------------------------------
// 👩‍🎓 STUDENT MANAGEMENT
// -----------------------------------------------

/** Add a new student */
document.getElementById('add-student-btn').addEventListener('click', async function () {
  const name  = document.getElementById('student-name').value.trim();
  const cls   = document.getElementById('student-class').value.trim();

  hideEl('student-error');
  hideEl('student-success');

  // Validate inputs
  if (!name || !cls) {
    showEl('student-error');
    document.getElementById('student-error').textContent = 'Please fill in both Name and Class.';
    return;
  }

  try {
    const res = await fetch(`${API_BASE}/add-student`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, class: cls })
    });

    const data = await res.json();

    if (res.ok && data.success) {
      // ✅ Student added
      showEl('student-success');
      document.getElementById('student-success').textContent = `✅ ${name} added successfully!`;

      // Clear inputs
      document.getElementById('student-name').value = '';
      document.getElementById('student-class').value = '';

      // Refresh the student list
      loadStudents();
      updateStats();

      // Auto-hide success message after 3 seconds
      setTimeout(() => hideEl('student-success'), 3000);
    } else {
      showEl('student-error');
      document.getElementById('student-error').textContent = data.message || 'Failed to add student.';
    }
  } catch (err) {
    showEl('student-error');
    document.getElementById('student-error').textContent = 'Server not reachable.';
  }
});

/** Load and display all students from backend */
async function loadStudents() {
  try {
    const res = await fetch(`${API_BASE}/students`);
    const data = await res.json();

    const tbody = document.getElementById('students-tbody');
    tbody.innerHTML = ''; // Clear old rows

    if (data.students.length === 0) {
      showEl('students-empty');
      document.getElementById('students-table').style.display = 'none';
      return;
    }

    hideEl('students-empty');
    document.getElementById('students-table').style.display = 'table';

    // Build table rows
    data.students.forEach((student, index) => {
      const row = document.createElement('tr');
      row.innerHTML = `
<td><strong>${index + 1}</strong></td>
<td>${escapeHTML(student.name)}</td>
<td><span class="badge">${escapeHTML(student.class)}</span></td>
<td>
  <button class="btn-delete" onclick="deleteStudent('${student._id}')">
    🗑 Delete
  </button>
</td>
`;
      tbody.appendChild(row);
    });

  } catch (err) {
    console.error('Failed to load students:', err);
  }
}

/** Delete a student by ID */
async function deleteStudent(id) {
  if (!confirm('Remove this student?')) return;

  try {
    const res = await fetch(`${API_BASE}/student/${id}`, { method: 'DELETE' });
    const data = await res.json();

    if (res.ok && data.success) {
      loadStudents(); // Refresh the list
      updateStats();
    } else {
      alert('Failed to delete student.');
    }
  } catch (err) {
    alert('Server not reachable.');
  }
}


/** Create a new assignment */
document.getElementById('add-assignment-btn').addEventListener('click', async function () {

  const title = document.getElementById('assignment-title').value.trim();
  const desc = document.getElementById('assignment-desc').value.trim();

  hideEl('assignment-error');
  hideEl('assignment-success');

  if (!title) {
    showEl('assignment-error');
    document.getElementById('assignment-error').textContent =
      'Please enter assignment title.';
    return;
  }

  const teacher = JSON.parse(localStorage.getItem("teacher"));

  try {
    const res = await fetch(`${API_BASE}/add-assignment`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        description: desc || "No description",
        teacherId: teacher._id,
        teacherName: teacher.name
      })
    });

    const data = await res.json();

    if (data.success) {

      showEl('assignment-success');
      document.getElementById('assignment-success').textContent =
        `✅ Assignment "${title}" created!`;

      document.getElementById('assignment-title').value = "";
      document.getElementById('assignment-desc').value = "";

      loadAssignments();

    } else {
      showEl('assignment-error');
      document.getElementById('assignment-error').textContent =
        "Failed to create assignment.";
    }

  } catch (err) {
    console.log(err);

    showEl('assignment-error');
    document.getElementById('assignment-error').textContent =
      "Server error.";
  }

});
/** Render all assignments as cards */


// -----------------------------------------------
// 📁 UPLOAD SECTION — Click to open file picker
// -----------------------------------------------
document.getElementById("upload-material-btn").addEventListener("click", async function () {

  const fileInput = document.getElementById("file-input");
  const file = fileInput.files[0];
  const title = document.getElementById("material-title").value.trim();

  if (!title || !file) {
    alert("Enter title + choose file");
    return;
  }

  const formData = new FormData();
  formData.append("title", title);
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/upload-material`, {
    method: "POST",
    body: formData
  });

  const data = await res.json();

  if (data.success) {
    alert("✅ Material uploaded successfully!");

    document.getElementById("material-title").value = "";
    fileInput.value = "";

    loadMaterials();

  } else {
    alert("Upload failed");
  }
});

const zone = document.getElementById("upload-zone");
if (zone) {
  zone.addEventListener("click", function () {
    document.getElementById("file-input").click();
  });
}

// -----------------------------------------------
// 📱 MOBILE SIDEBAR TOGGLE
// -----------------------------------------------
document.getElementById('menu-toggle').addEventListener('click', function () {
  document.getElementById('sidebar').classList.toggle('open');
});

// Close sidebar when clicking outside on mobile
document.addEventListener('click', function (e) {
  const sidebar = document.getElementById('sidebar');
  const toggle  = document.getElementById('menu-toggle');
  if (!sidebar.contains(e.target) && !toggle.contains(e.target)) {
    sidebar.classList.remove('open');
  }
});


// -----------------------------------------------
// 🔗 SIDEBAR NAV LINKS — click handler
// -----------------------------------------------
document.querySelectorAll('.nav-link').forEach(link => {
  link.addEventListener('click', function (e) {
    e.preventDefault();
    const section = this.getAttribute('data-section');
    switchSection(section);
  });
});


// -----------------------------------------------
// 🛠 UTILITY FUNCTIONS
// -----------------------------------------------

/** Check if email format is valid */
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/** Show an element */
function showEl(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'block';
}

/** Hide an element */
function hideEl(id) {
  const el = document.getElementById(id);
  if (el) el.style.display = 'none';
}

/** Prevent XSS: escape HTML special characters */
function escapeHTML(str) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(str));
  return div.innerHTML;
}


// -----------------------------------------------
// 🚀 INIT — Run when page loads
// -----------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("teacher");

  if (!saved) {
    showPage("login-page");
    return;
  }

  try {
    const teacher = JSON.parse(saved);

    showPage("dashboard-page");

    document.getElementById("teacherName").textContent = teacher.name;
    document.getElementById("teacherRole").textContent = "Teacher";
    document.getElementById("welcomeTeacher").textContent =
      `Welcome back, ${teacher.name}! 👋`;

    loadTeacherProfileImage();

    loadStudents();
    loadAssignments();
    loadSubmissions();
    loadMaterials();
    updateStats();

  } catch (err) {
    localStorage.removeItem("teacher");
    showPage("login-page");
  }
});

//ass
async function loadAssignments() {
  try {
    const res = await fetch(`${API_BASE}/assignments`);
    const data = await res.json();

    console.log("🔥 DATA:", data); // DEBUG

    const list = document.getElementById('assignments-list');
    const empty = document.getElementById('assignments-empty');

    list.innerHTML = "";

    // 🔥 SAFETY CHECK (IMPORTANT)
    const assignments = data.assignments || [];

    const teacher = JSON.parse(localStorage.getItem("teacher"));

const myAssignments = assignments.filter(
  a => a.teacherId === teacher._id
);

    if (!Array.isArray(assignments) || assignments.length === 0) {
      empty.style.display = "block";
      return;
    }

    empty.style.display = "none";
myAssignments.forEach(a => {
      const item = document.createElement('div');
      item.className = 'assignment-item';

     item.innerHTML = `
  <div class="assignment-info">
    <div class="assignment-title">📌 ${a.title}</div>
    <div class="assignment-desc">
  ${escapeHTML(a.description).replace(/\n/g, "<br>")}
</div>
  </div>

  <button class="btn-delete" onclick="deleteAssignment('${a._id}')">
🗑 Delete
</button>
`;

      list.appendChild(item);
    });

  } catch (err) {
    console.error("❌ Error loading assignments:", err);
  }
}

async function deleteAssignment(id) {
  if (!confirm("Delete this assignment?")) return;

  try {
    const res = await fetch(`${API_BASE}/assignment/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();

    if (data.success) {
      loadAssignments(); // 🔥 refresh UI
    } else {
      alert("Failed to delete");
    }

  } catch (err) {
    console.error(err);
    alert("Server error");
  }
}

async function loadSubmissions() {
  try {
    const res = await fetch(`${API_BASE}/submissions`);
    const data = await res.json();

   const list = document.getElementById("submissions-list");
const empty = document.getElementById("submissions-empty");

if (!list || !empty) return;

    list.innerHTML = "";

    const submissions = data.submissions || [];

    if (submissions.length === 0) {
      empty.style.display = "block";
      return;
    }

    empty.style.display = "none";

    submissions.forEach(s => {
      const item = document.createElement("div");
      item.className = "assignment-item";

      item.innerHTML = `
        <div class="assignment-info">
          <div class="assignment-title">👦 ${s.studentName}</div>
          <div class="assignment-desc">
            📚 ${s.assignmentTitle}<br>
            📄 ${s.fileName}
          </div>
        </div>

       <div style="display:flex; gap:10px;">
<a href="${API_BASE}${s.filePath}" target="_blank" class="btn-primary small">
  View
</a>

<button onclick="deleteSubmission('${s._id}')" class="btn-delete">
🗑 Delete
</button>
</div>
      `;

      list.appendChild(item);
    });

  } catch (err) {
    console.error("Error loading submissions:", err);
  }
}

async function deleteSubmission(id) {

  if (!confirm("Delete this submission?")) return;

  try {
    const res = await fetch(`${API_BASE}/submission/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();

     if (data.success) {
      await loadSubmissions();
      updateStats();
    } else {
      alert("Delete failed");
    }

  } catch (err) {
    alert("Server error");
  }
}
window.deleteSubmission = deleteSubmission;
window.deleteAssignment = deleteAssignment;
window.deleteStudent = deleteStudent;

async function loadMaterials() {
  try {
    const res = await fetch(`${API_BASE}/materials`);
    const data = await res.json();

    const list = document.getElementById("materials-list");
    const empty = document.getElementById("materials-empty");
     if (!list || !empty) return; 

    list.innerHTML = "";

    if (!data.materials || data.materials.length === 0) {
      empty.style.display = "block";
      return;
    }

    empty.style.display = "none";

   data.materials.forEach(m => {
  list.insertAdjacentHTML("beforeend", `
    <div class="assignment-item">
      <div class="assignment-info">
      <div class="assignment-title">📄 ${escapeHTML(m.title)}</div>
      </div>

      <div style="display:flex;gap:10px;">
        <a href="${API_BASE}${m.filePath}" target="_blank" class="btn-primary small">
          View
        </a>

        <button onclick="deleteMaterial('${m._id}')" class="btn-delete">
          🗑 Delete
        </button>
      </div>
    </div>
  `);
});

  } catch (err) {
    console.error("Material load failed", err);
  }
}
async function deleteMaterial(id) {
  try {
    const res = await fetch(`${API_BASE}/material/${id}`, {
      method: "DELETE"
    });

    const data = await res.json();

    if (data.success) {
      loadMaterials();
    } else {
      alert("Delete failed");
    }

  } catch (err) {
    alert("Server error");
  }
}
//teacher prof
async function uploadTeacherImage() {
  try {
    const file = document.getElementById("teacherImageInput").files[0];
    if (!file) return;

    const teacher = JSON.parse(localStorage.getItem("teacher"));
    if (!teacher) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("username", teacher.username);

    const res = await fetch(`${API_BASE}/teacher-upload-image`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      teacher.profileImage = data.image;
      localStorage.setItem("teacher", JSON.stringify(teacher));
      loadTeacherProfileImage();
    }

  } catch (err) {
    console.log(err);
  }
}
//prof
function loadTeacherProfileImage() {

  const teacher =
    JSON.parse(localStorage.getItem("teacher"));

  if (!teacher) return;

  const img =
   document.getElementById("teacherAvatar")

  const letter =
    document.getElementById("teacherLetter");

  if (teacher.profileImage) {

    img.src =
      API_BASE + teacher.profileImage + "?t=" + Date.now();

    img.style.display = "block";
    letter.style.display = "none";

  } else {

    img.style.display = "none";

    letter.style.display = "flex";
    letter.textContent =
      teacher.name.charAt(0).toUpperCase();
  }
}
window.deleteMaterial = deleteMaterial;