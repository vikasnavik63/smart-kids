const API_BASE =
location.hostname === "127.0.0.1" ||
location.hostname === "localhost"
? "http://localhost:5000"
: "https://smart-kids-backend.onrender.com";

async function loadAssignmentsForKids() {
  try {
    const res = await fetch(`${API_BASE}/assignments`);
    const data = await res.json();

   const container = document.getElementById("kids-assignments");
if (!container) return;
container.innerHTML = "";

    if (data.assignments.length === 0) {
      container.innerHTML = "<p>No assignments yet 👶</p>";
      return;
    }

    data.assignments.forEach(a => {
      const div = document.createElement("div");
      div.className = "assignment-card";

     div.innerHTML = `
  <h3>📌 ${escapeHTML(a.title)}</h3>
  <p style="white-space: pre-line;">${escapeHTML(a.description)}</p>

        <input type="text" placeholder="Your Name" id="name-${a._id}">
        <input type="file" id="file-${a._id}">
        <button type="button" onclick="submitWork('${a._id}', this)">
          📤 Submit Assignment
        </button>
      `;

      container.appendChild(div);
    });

  } catch (err) {
   console.error("Failed to load assignments:", err);
  }
}

async function submitWork(id, btn) {
  try {
    const title = btn.parentElement
      .querySelector("h3")
      .innerText.replace("📌 ", "");

    const studentName = document.getElementById(`name-${id}`).value.trim();
    const fileInput = document.getElementById(`file-${id}`);

    if (!studentName || fileInput.files.length === 0) {
      alert("Enter name and choose file");
      return;
    }

    const formData = new FormData();
    formData.append("studentName", studentName);
    formData.append("assignmentTitle", title);
    formData.append("file", fileInput.files[0]);

    const res = await fetch(`${API_BASE}/submit-assignment`, {
      method: "POST",
      body: formData
    });

    const data = await res.json();

    if (data.success) {
      alert("✅ Assignment submitted!");
      fileInput.value = "";
      document.getElementById(`name-${id}`).value = "";
    } else {
      alert("❌ Upload failed");
    }

  } catch (err) {
    alert("Server error");
    console.error(err);
  }
}

async function loadStudyMaterials() {
  try {
    const res = await fetch(`${API_BASE}/materials`);
    const data = await res.json();

    const box = document.getElementById("study-materials");
    if (!box) return;

    box.innerHTML = "";

    if (!data.materials || data.materials.length === 0) {
      box.innerHTML = "<p>No study materials yet 📚</p>";
      return;
    }

    data.materials.forEach(m => {
      box.insertAdjacentHTML("beforeend", `
        <div class="assignment-card">
          <h3>📄 ${escapeHTML(m.title)}</h3>

          <a href="${API_BASE}${m.filePath}" target="_blank">
            📥 View / Download
          </a>
        </div>
      `);
    });

  } catch (err) {
    console.error("Failed to load study materials:", err);
  }
}

function escapeHTML(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}

document.addEventListener("DOMContentLoaded", () => {
  loadAssignmentsForKids();
  loadStudyMaterials();
});
window.submitWork = submitWork;
