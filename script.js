/* =============================================
   SMART KIDS LEARNING PLATFORM – script.js
   ============================================= */

"use strict";

// ============ STATE ============
let totalStars = 0;
let kidsStars = 0;
let gameStars = 0;
let earnedBadges = [];
let gameState = {};

// ============ DATA ============
const PHONICS = [
  {l:"A", word:"Apple",   emoji:"🍎"},
  {l:"B", word:"Ball",    emoji:"⚽"},
  {l:"C", word:"Cat",     emoji:"🐱"},
  {l:"D", word:"Dog",     emoji:"🐶"},
  {l:"E", word:"Elephant",emoji:"🐘"},
  {l:"F", word:"Fish",    emoji:"🐟"},
  {l:"G", word:"Goat",    emoji:"🐐"},
  {l:"H", word:"Hat",     emoji:"🎩"},
  {l:"I", word:"Igloo",   emoji:"🏔️"},
  {l:"J", word:"Jug",     emoji:"🫙"},
  {l:"K", word:"Kite",    emoji:"🪁"},
  {l:"L", word:"Lion",    emoji:"🦁"},
  {l:"M", word:"Mango",   emoji:"🥭"},
  {l:"N", word:"Nest",    emoji:"🪹"},
  {l:"O", word:"Orange",  emoji:"🍊"},
  {l:"P", word:"Parrot",  emoji:"🦜"},
  {l:"Q", word:"Queen",   emoji:"👑"},
  {l:"R", word:"Rabbit",  emoji:"🐰"},
  {l:"S", word:"Sun",     emoji:"☀️"},
  {l:"T", word:"Tiger",   emoji:"🐯"},
  {l:"U", word:"Umbrella",emoji:"☂️"},
  {l:"V", word:"Van",     emoji:"🚐"},
  {l:"W", word:"Whale",   emoji:"🐋"},
  {l:"X", word:"X-ray",   emoji:"🩻"},
  {l:"Y", word:"Yak",     emoji:"🐂"},
  {l:"Z", word:"Zebra",   emoji:"🦓"}
];

const CVC_WORDS = [
  {w:"cat",emoji:"🐱"},{w:"bat",emoji:"🦇"},{w:"hat",emoji:"🎩"},
  {w:"mat",emoji:"🧹"},{w:"rat",emoji:"🐀"},{w:"can",emoji:"🥫"},
  {w:"man",emoji:"👨"},{w:"fan",emoji:"🌬️"},{w:"pan",emoji:"🍳"},
  {w:"van",emoji:"🚐"},{w:"bed",emoji:"🛏️"},{w:"red",emoji:"🔴"},
  {w:"hen",emoji:"🐔"},{w:"pen",emoji:"🖊️"},{w:"ten",emoji:"🔟"},
  {w:"big",emoji:"🐘"},{w:"dig",emoji:"⛏️"},{w:"fig",emoji:"🫐"},
  {w:"pig",emoji:"🐷"},{w:"wig",emoji:"💇"},{w:"box",emoji:"📦"},
  {w:"dog",emoji:"🐶"},{w:"fog",emoji:"🌫️"},{w:"hot",emoji:"🥵"},
  {w:"log",emoji:"🪵"},{w:"bus",emoji:"🚌"},{w:"cup",emoji:"☕"},
  {w:"fun",emoji:"😄"},{w:"gum",emoji:"🍬"},{w:"mud",emoji:"🟤"}
];

const EVS_DATA = {
  myself: {
    title:"🙋 About Myself",
    items:[
      {e:"👦", t:"My name is my identity. I have a first name and a last name."},
      {e:"👁️", t:"I have two eyes to see the beautiful world around me."},
      {e:"👃", t:"I have a nose to smell flowers, food, and fresh air."},
      {e:"👂", t:"I have two ears to listen to music, stories, and voices."},
      {e:"👄", t:"I have a mouth to talk, eat, and smile happily."},
      {e:"🤲", t:"I have two hands to draw, write, and hold things."},
      {e:"🦶", t:"I have two legs and feet to walk, run, and jump."},
      {e:"❤️", t:"My heart beats to keep me alive and healthy."}
    ]
  },
  family: {
    title:"👨‍👩‍👧‍👦 My Family",
    items:[
      {e:"👩", t:"Mother – She loves me and takes care of me every day."},
      {e:"👨", t:"Father – He works hard to keep our family happy."},
      {e:"👧", t:"Sister – My best friend at home who plays with me."},
      {e:"👦", t:"Brother – We share, play, and sometimes argue, but always love each other."},
      {e:"👵", t:"Grandmother – She tells us wonderful stories and gives the best hugs."},
      {e:"👴", t:"Grandfather – He is wise and teaches us many good things."},
      {e:"🏠", t:"Home – Where our family lives together with love and happiness."}
    ]
  },
  helpers: {
    title:"👮 Community Helpers",
    items:[
      {e:"🧑‍⚕️", t:"Doctor – Helps us when we are sick and keeps us healthy."},
      {e:"👮", t:"Police Officer – Keeps our neighbourhood safe and protects us."},
      {e:"🧑‍🏫", t:"Teacher – Teaches us to read, write, and learn new things."},
      {e:"🚒", t:"Firefighter – Puts out fires and saves people from danger."},
      {e:"🧑‍🌾", t:"Farmer – Grows food so that we have vegetables and fruits to eat."},
      {e:"🧑‍🍳", t:"Chef / Cook – Prepares delicious meals for people to enjoy."},
      {e:"🧑‍✈️", t:"Pilot – Flies aeroplanes to take people to faraway places."},
      {e:"📬", t:"Postman – Delivers letters and packages to our homes."}
    ]
  },
  animals: {
    title:"🦁 Animal Kingdom",
    items:[
      {e:"🐶", t:"Dog – A domestic animal. It is our loyal friend and pet."},
      {e:"🐱", t:"Cat – A domestic animal. It is soft and loves to purr."},
      {e:"🦁", t:"Lion – A wild animal. It is called the King of the Jungle."},
      {e:"🐘", t:"Elephant – The largest land animal. It has a long trunk."},
      {e:"🐬", t:"Dolphin – A water animal. It is very smart and playful."},
      {e:"🦅", t:"Eagle – A bird that flies very high and has sharp eyes."},
      {e:"🐄", t:"Cow – A domestic animal that gives us milk to drink."},
      {e:"🐍", t:"Snake – A reptile that moves by slithering on the ground."}
    ]
  }
};

const UKG_EVS = {
  plants: {
    title:"🌱 Plants Around Us",
    items:[
      {e:"🌿", t:"Plants have roots, stem, leaves, flowers, and fruits."},
      {e:"🌳", t:"Trees give us oxygen, shade, fruits, and wood."},
      {e:"💧", t:"Plants need water, sunlight, and soil to grow."},
      {e:"🌸", t:"Flowers are colourful. They attract bees and butterflies."},
      {e:"🍎", t:"Fruits grow from flowers and give us vitamins and energy."},
      {e:"🌾", t:"We get food grains like wheat and rice from plants."}
    ]
  },
  transport: {
    title:"🚗 Means of Transport",
    items:[
      {e:"🚗", t:"Car – Travels on roads. Used for family trips."},
      {e:"🚂", t:"Train – Travels on railway tracks. Carries many people."},
      {e:"✈️", t:"Aeroplane – Travels through the air. Fastest transport."},
      {e:"🚢", t:"Ship – Travels on water. Carries goods across oceans."},
      {e:"🚲", t:"Bicycle – Uses no fuel. Good for health and environment."},
      {e:"🛺", t:"Auto-rickshaw – A small vehicle used in cities in India."}
    ]
  },
  seasons: {
    title:"🌤️ Seasons in India",
    items:[
      {e:"☀️", t:"Summer – Very hot weather. We drink lots of water and eat mangoes."},
      {e:"🌧️", t:"Monsoon – Rainy season. Farmers grow crops. We love to play in the rain."},
      {e:"❄️", t:"Winter – Cold weather. We wear warm clothes like sweaters and jackets."},
      {e:"🌸", t:"Spring – Pleasant season. Flowers bloom and birds sing."}
    ]
  },
  weather: {
    title:"🌈 Weather & The Sky",
    items:[
      {e:"☀️", t:"Sun – The biggest star. It gives us light and warmth."},
      {e:"🌕", t:"Moon – Shines at night. Reflects light from the sun."},
      {e:"⭐", t:"Stars – Tiny points of light we see in the night sky."},
      {e:"🌈", t:"Rainbow – Appears after rain. Has 7 beautiful colours: VIBGYOR."},
      {e:"☁️", t:"Clouds – Made of tiny water drops. Bring rain to the earth."}
    ]
  }
};

const C1_EVS = {
  food: {
    title:"🍎 Food We Eat",
    items:[
      {e:"🥦", t:"Vegetables – Carrot, spinach, broccoli keep us strong and healthy."},
      {e:"🍎", t:"Fruits – Apple, banana, grapes give us vitamins and energy."},
      {e:"🌾", t:"Grains – Rice, wheat, and roti give us energy to work and play."},
      {e:"🥛", t:"Dairy – Milk, curd, and cheese make our bones and teeth strong."},
      {e:"🍔", t:"Junk Food – Pizza, chips, and burgers should be eaten rarely."},
      {e:"💧", t:"Water – We should drink 6–8 glasses of water every day."}
    ]
  },
  water: {
    title:"💧 Water",
    items:[
      {e:"🏠", t:"We use water for drinking, cooking, bathing, and cleaning."},
      {e:"🌾", t:"Farmers use water to grow crops and feed the country."},
      {e:"🏭", t:"Factories use water to make products we use every day."},
      {e:"🚰", t:"We get water from taps, wells, rivers, and rainwater."},
      {e:"💡", t:"Save water: close taps, fix leaks, collect rainwater."},
      {e:"🌊", t:"70% of the Earth is covered in water but only 3% is fresh water."}
    ]
  },
  animals: {
    title:"🐾 Animals & Habitats",
    items:[
      {e:"🦁", t:"Wild animals like lions and tigers live in forests and jungles."},
      {e:"🐶", t:"Domestic animals like dogs and cows live with humans."},
      {e:"🐟", t:"Aquatic animals like fish and dolphins live in water."},
      {e:"🦅", t:"Aerial animals like eagles and sparrows live in the sky and trees."},
      {e:"🐾", t:"Animals eat plants (herbivores) or meat (carnivores) or both (omnivores)."},
      {e:"🌿", t:"We must protect animals and their habitats from destruction."}
    ]
  },
  environment: {
    title:"🌿 Our Environment",
    items:[
      {e:"🌳", t:"Trees give us oxygen, food, shade, and home for animals."},
      {e:"🚮", t:"We should not litter. Throw waste only in dustbins."},
      {e:"♻️", t:"Reduce, Reuse, Recycle – 3 Rs to protect our Earth."},
      {e:"🌫️", t:"Pollution makes air, water, and land dirty and harmful."},
      {e:"💡", t:"Switch off lights and fans when not in use to save energy."},
      {e:"🌱", t:"Plant more trees to make our Earth green and beautiful."}
    ]
  }
};

const SENTENCES = [
  {s:"The cat sat on the mat.", emoji:"🐱"},
  {s:"I see a big red ball.", emoji:"⚽"},
  {s:"The dog runs fast.", emoji:"🐶"},
  {s:"She has a blue pen.", emoji:"🖊️"},
  {s:"We eat food every day.", emoji:"🍽️"},
  {s:"The sun is very bright.", emoji:"☀️"},
  {s:"Birds fly in the sky.", emoji:"🐦"},
  {s:"I love my mother.", emoji:"❤️"},
  {s:"Fish live in water.", emoji:"🐟"},
  {s:"The flower is pink and pretty.", emoji:"🌸"}
];

const NOUN_VERB_QUIZ = [
  {w:"Run",   type:"verb"},
  {w:"Apple", type:"noun"},
  {w:"Jump",  type:"verb"},
  {w:"School",type:"noun"},
  {w:"Eat",   type:"verb"},
  {w:"Dog",   type:"noun"},
  {w:"Sing",  type:"verb"},
  {w:"Book",  type:"noun"},
  {w:"Swim",  type:"verb"},
  {w:"Tree",  type:"noun"}
];

// ============ INIT ============
document.addEventListener("DOMContentLoaded", () => {
  loadStarsFromDB();
  setupNav();
  buildAlphabetGrid();
  buildPhonicsGrid();
  buildNumberGrid("numberGrid50", 50);
  buildCVCGrid();
  buildNumberGrid("numberGrid100", 100);
  buildSentences();
  buildTablesGrid();
  setupTabs();
  buildAdditionQuiz("additionQuiz", 10);
  buildAdditionQuiz("c1AddQuiz", 20);
  buildSubtractionQuiz("subtractionQuiz", 10);
  buildSubtractionQuiz("c1SubQuiz", 20);
  buildGrammarQuiz();
  updateUserUI();

  // ✅ Load page from URL
  const hash = window.location.hash.replace("#", "");
 if (hash) {
  goToPage(hash, false);

  if (hash === "profile") {
    loadProfileData();
  }
}
});

// ============ NAV ============
function setupNav() {
  document.querySelectorAll(".nav-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      goToPage(btn.dataset.page);
    });
  });
}

//newwwwwwww
async function goToPage(page, addToHistory = true) {

  // CHECK CLASS STATUS
  if (page === "lkg" || page === "ukg" || page === "class1") {

    try {
      const res = await fetch("https://smart-kids-backend.onrender.com/get-classes");
      const data = await res.json();

      const classes = data.classes || [];

      let className = "";

      if (page === "lkg") className = "LKG";
      if (page === "ukg") className = "UKG";
      if (page === "class1") className = "Class 1";

      const found = classes.find(c => c.name === className);

      if (found && found.status === "Inactive") {
        alert("⚠️ This class is currently inactive.");
        return;
      }

    } catch (err) {
      console.log(err);
    }
  }

  document.querySelectorAll(".page").forEach(p =>
    p.classList.remove("active")
  );

  document.querySelectorAll(".nav-btn").forEach(b =>
    b.classList.remove("active")
  );

  const targetPage = document.getElementById(`page-${page}`);
  if (targetPage) targetPage.classList.add("active");

  const targetBtn = document.querySelector(`[data-page="${page}"]`);
  if (targetBtn) targetBtn.classList.add("active");

  const header = document.querySelector(".site-header");

  if (header) {
    header.style.display =
      (page === "role" || page === "student-auth")
      ? "none"
      : "block";
  }

  const bear = document.getElementById("bearContainer");

  if (bear) {
    bear.style.display =
      page === "home" ? "block" : "none";
  }

  if (addToHistory) {
    history.pushState({ page }, "", `#${page}`);
  }

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// ============ TABS ============
function setupTabs() {
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const tabId = btn.dataset.tab;
      const parent = btn.closest(".page") || btn.parentElement.parentElement;
      parent.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("active"));
      parent.querySelectorAll(".tab-content").forEach(c => c.classList.remove("active"));
      btn.classList.add("active");
      const content = document.getElementById(tabId);
      if (content) content.classList.add("active");
    });
  });
}

// ============ ALPHABET GRID ============
function buildAlphabetGrid() {
  const grid = document.getElementById("alphabetGrid");
  if (!grid) return;
  "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(letter => {
    const card = document.createElement("div");
    card.className = "alpha-card";
    card.innerHTML = `<div class="alpha-capital">${letter}</div><div class="alpha-small">${letter.toLowerCase()}</div>`;
    card.addEventListener("click", () => {
      speakText(letter);
      addStar(1);
      animateCard(card);
    });
    grid.appendChild(card);
  });
}

// ============ PHONICS GRID ============
function buildPhonicsGrid() {
  const grid = document.getElementById("phonicsGrid");
  if (!grid) return;
  PHONICS.forEach(p => {
    const card = document.createElement("div");
    card.className = "phonics-card";
    card.innerHTML = `<div class="phonics-emoji">${p.emoji}</div>
                      <div class="phonics-letter">${p.l}</div>
                      <div class="phonics-word">${p.l} for ${p.word}</div>`;
    card.addEventListener("click", () => {
      speakText(`${p.l} for ${p.word}`);
      addStar(1);
      animateCard(card);
    });
    grid.appendChild(card);
  });
}

// ============ NUMBER GRID ============
function buildNumberGrid(id, max) {
  const grid = document.getElementById(id);
  if (!grid) return;
  for (let i = 1; i <= max; i++) {
    const card = document.createElement("div");
    card.className = "num-card";
    card.textContent = i;
    card.addEventListener("click", () => {
      speakText(String(i));
      addStar(1);
      animateCard(card);
    });
    grid.appendChild(card);
  }
}

// ============ CVC GRID ============
function buildCVCGrid() {
  const grid = document.getElementById("cvcGrid");
  if (!grid) return;
  CVC_WORDS.forEach(w => {
    const card = document.createElement("div");
    card.className = "word-card";
    card.innerHTML = `<div class="word-emoji">${w.emoji}</div><div class="word-text">${w.w}</div>`;
    card.addEventListener("click", () => {
      speakText(w.w);
      addStar(1);
      animateCard(card);
    });
    grid.appendChild(card);
  });
}

// ============ EVS ============
function showEVS(key) {
  const data = EVS_DATA[key];
  renderEVSDetail("evs-detail", data);
}
function showUKGEVS(key) {
  const data = UKG_EVS[key];
  renderEVSDetail("ukg-evs-detail", data);
}
function showC1EVS(key) {
  const data = C1_EVS[key];
  renderEVSDetail("c1-evs-detail", data);
}
function renderEVSDetail(containerId, data) {
  const container = document.getElementById(containerId);
  if (!container || !data) return;
  container.classList.remove("hidden");
  container.innerHTML = `<h3>${data.title}</h3>` +
    data.items.map(i => `<div class="evs-item"><span>${i.e}</span><span>${i.t}</span></div>`).join("");
  container.scrollIntoView({ behavior: "smooth", block: "nearest" });
  addStar(2);
  showToast("🌍 Great! You're learning about the world!");
}

// ============ SENTENCES ============
function buildSentences() {
  const list = document.getElementById("sentencesList");
  if (!list) return;
  SENTENCES.forEach((s, i) => {
    const card = document.createElement("div");
    card.className = "sentence-card";
    card.innerHTML = `<div class="sentence-num">${i+1}</div>
                      <div class="sentence-text">${s.s}</div>
                      <div class="sentence-emoji">${s.emoji}</div>`;
    card.addEventListener("click", () => {
      speakText(s.s);
      addStar(1);
      animateCard(card);
    });
    list.appendChild(card);
  });
}

// ============ TABLES GRID ============
function buildTablesGrid() {
  const grid = document.getElementById("tablesGrid");
  if (!grid) return;
  [2, 3].forEach(n => {
    const card = document.createElement("div");
    card.className = "table-card";
    card.innerHTML = `<h4>Table of ${n}</h4>`;
    for (let i = 1; i <= 10; i++) {
      const row = document.createElement("div");
      row.className = "table-row";
      row.innerHTML = `<span>${n} × ${i}</span><span>=</span><span>${n*i}</span>`;
      row.addEventListener("click", () => speakText(`${n} times ${i} equals ${n*i}`));
      card.appendChild(row);
    }
    grid.appendChild(card);
  });
}

// ============ ADDITION QUIZ ============
function buildAdditionQuiz(id, max) {
  const container = document.getElementById(id);
  if (!container) return;
  let score = 0, total = 0;
  const render = () => {
    const a = rand(1, Math.floor(max/2));
    const b = rand(1, Math.floor(max/2));
    const ans = a + b;
    const opts = shuffle([ans, ans+1, ans-1, ans+2].filter(x=>x>0));
    total++;
    container.innerHTML = `
      <div class="quiz-q">${a} + ${b} = ?</div>
      <div class="quiz-options">
        ${opts.slice(0,4).map(o=>`<button class="quiz-opt" data-val="${o}">${o}</button>`).join("")}
      </div>
      <div class="quiz-feedback"></div>
      <button class="quiz-next" style="display:none">Next ▶</button>`;
    container.querySelectorAll(".quiz-opt").forEach(btn => {
      btn.addEventListener("click", () => {
        const chosen = +btn.dataset.val;
        const fb = container.querySelector(".quiz-feedback");
        container.querySelectorAll(".quiz-opt").forEach(b => b.disabled = true);
        if (chosen === ans) {
          btn.classList.add("correct");
          fb.textContent = "✅ Correct! Great job!";
          fb.style.color = "#27ae60";
          score++; addStar(3); starBurst();
        } else {
          btn.classList.add("wrong");
          container.querySelectorAll(".quiz-opt").forEach(b => { if (+b.dataset.val===ans) b.classList.add("correct"); });
          fb.textContent = `❌ The answer is ${ans}.`;
          fb.style.color = "#e74c3c";
        }
        container.querySelector(".quiz-next").style.display = "block";
      });
    });
    container.querySelector(".quiz-next").addEventListener("click", render);
  };
  render();
}

// ============ SUBTRACTION QUIZ ============
function buildSubtractionQuiz(id, max) {
  const container = document.getElementById(id);
  if (!container) return;
  const render = () => {
    let a = rand(2, max), b = rand(1, a);
    const ans = a - b;
    const opts = shuffle([ans, ans+1, ans-1, ans+2].filter(x=>x>=0));
    container.innerHTML = `
      <div class="quiz-q">${a} − ${b} = ?</div>
      <div class="quiz-options">
        ${opts.slice(0,4).map(o=>`<button class="quiz-opt" data-val="${o}">${o}</button>`).join("")}
      </div>
      <div class="quiz-feedback"></div>
      <button class="quiz-next" style="display:none">Next ▶</button>`;
    container.querySelectorAll(".quiz-opt").forEach(btn => {
      btn.addEventListener("click", () => {
        const chosen = +btn.dataset.val;
        const fb = container.querySelector(".quiz-feedback");
        container.querySelectorAll(".quiz-opt").forEach(b => b.disabled = true);
        if (chosen === ans) {
          btn.classList.add("correct");
          fb.textContent = "✅ Correct! Brilliant!";
          fb.style.color = "#27ae60";
          addStar(3); starBurst();
        } else {
          btn.classList.add("wrong");
          container.querySelectorAll(".quiz-opt").forEach(b => { if (+b.dataset.val===ans) b.classList.add("correct"); });
          fb.textContent = `❌ The answer is ${ans}.`;
          fb.style.color = "#e74c3c";
        }
        container.querySelector(".quiz-next").style.display = "block";
      });
    });
    container.querySelector(".quiz-next").addEventListener("click", render);
  };
  render();
}

// ============ GRAMMAR QUIZ ============
function buildGrammarQuiz() {
  const container = document.getElementById("grammarQuiz");
  if (!container) return;
  let qIndex = 0;
  const render = () => {
    if (qIndex >= NOUN_VERB_QUIZ.length) {
      container.innerHTML = `<div style="text-align:center;font-size:1.3rem;font-weight:800;color:#6C63FF">🎉 Amazing! You completed the Grammar Quiz!</div>
        <button class="quiz-next" onclick="location.reload()" style="margin:14px auto;display:block;background:var(--lkg-color)">🔄 Try Again</button>`;
      addStar(10); earnBadge("reader");
      return;
    }
    const q = NOUN_VERB_QUIZ[qIndex];
    container.innerHTML = `
      <div class="quiz-q">Is "<span style="color:#6C63FF">${q.w}</span>" a Noun or a Verb?</div>
      <div class="quiz-options">
        <button class="quiz-opt" data-val="noun">🏷️ Noun</button>
        <button class="quiz-opt" data-val="verb">🏃 Verb</button>
      </div>
      <div class="quiz-feedback"></div>
      <div class="game-score">Question ${qIndex+1} of ${NOUN_VERB_QUIZ.length}</div>`;
    container.querySelectorAll(".quiz-opt").forEach(btn => {
      btn.addEventListener("click", () => {
        const chosen = btn.dataset.val;
        const fb = container.querySelector(".quiz-feedback");
        container.querySelectorAll(".quiz-opt").forEach(b => b.disabled = true);
        if (chosen === q.type) {
          btn.classList.add("correct");
          fb.textContent = "✅ Correct!";
          fb.style.color = "#27ae60";
          addStar(2);
        } else {
          btn.classList.add("wrong");
          container.querySelectorAll(".quiz-opt").forEach(b => { if (b.dataset.val===q.type) b.classList.add("correct"); });
          fb.textContent = `❌ "${q.w}" is a ${q.type}.`;
          fb.style.color = "#e74c3c";
        }
        setTimeout(() => { qIndex++; render(); }, 1200);
      });
    });
  };
  render();
}

// ============ GAMES ============
function startGame(game) {
  const area = document.getElementById("game-area");
  area.classList.remove("hidden");
  area.scrollIntoView({ behavior: "smooth", block: "nearest" });
  if (game === "letterMatch") letterMatchGame(area);
  if (game === "shapeSort")   shapeSortGame(area);
  if (game === "numberCount") numberCountGame(area);
}

// --- Letter Match ---
function letterMatchGame(area) {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").slice(0,8);
  let score = 0, current = null, total = 0;
  const render = () => {
    current = letters[rand(0, letters.length-1)];
    total++;
    const opts = shuffle([current, ...getRandomLetters(current, 3)]);
    area.innerHTML = `
      <h3>🔤 Letter Match – Pick the small letter for: <span style="color:#FF6B9D;font-size:2rem">${current}</span></h3>
      <div class="game-choices">
        ${opts.map(o=>`<button class="choice-btn">${o.toLowerCase()}</button>`).join("")}
      </div>
      <div class="game-score">Score: ${score} / ${total-1}</div>`;
    area.querySelectorAll(".choice-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        area.querySelectorAll(".choice-btn").forEach(b => b.disabled = true);
        if (btn.textContent === current.toLowerCase()) {
          btn.classList.add("correct");
          score++; addStar(2); starBurst();
          showToast("🎉 Correct! Well done!");
        } else {
          btn.classList.add("wrong");
          showToast("😊 Try again! You'll get it!");
        }
        setTimeout(render, 1000);
      });
    });
  };
  render();
  earnBadge("starter");
}

function getRandomLetters(exclude, n) {
  const all = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").filter(l => l !== exclude);
  return shuffle(all).slice(0, n);
}

// --- Shape Sort ---
function shapeSortGame(area) {
  const shapes = [
    {name:"Circle",emoji:"⭕",svg:`<circle cx="50" cy="50" r="40" fill="#FF6B9D"/>`},
    {name:"Square",emoji:"⬜",svg:`<rect x="10" y="10" width="80" height="80" fill="#4ECDC4"/>`},
    {name:"Triangle",emoji:"🔺",svg:`<polygon points="50,10 90,90 10,90" fill="#FFE66D"/>`},
    {name:"Rectangle",emoji:"▬",svg:`<rect x="5" y="25" width="90" height="50" fill="#A29BFE"/>`}
  ];
  let score = 0;
  const render = () => {
    const target = shapes[rand(0, shapes.length-1)];
    const opts = shuffle(shapes.map(s => s.name));
    area.innerHTML = `
      <h3>🔷 What shape is this?</h3>
      <div style="display:flex;justify-content:center;margin:16px 0">
        <svg viewBox="0 0 100 100" width="120" height="120">${target.svg}</svg>
      </div>
      <div class="game-choices">
        ${opts.map(o=>`<button class="choice-btn">${o}</button>`).join("")}
      </div>
      <div class="game-score">Score: ${score}</div>`;
    area.querySelectorAll(".choice-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        area.querySelectorAll(".choice-btn").forEach(b => b.disabled = true);
        if (btn.textContent === target.name) {
          btn.classList.add("correct");
          score++; addStar(2); starBurst();
          showToast(`✅ Yes! It's a ${target.name}!`);
        } else {
          btn.classList.add("wrong");
          showToast(`😊 It's a ${target.name}! Try again!`);
        }
        setTimeout(render, 1200);
      });
    });
  };
  render();
}

// --- Number Count ---
function numberCountGame(area) {
  let score = 0;
  const render = () => {
    const answer = rand(1, 10);
    const emojis = ["⭐","🍎","🌟","🔵","🎈","🐝","🌸","🍕","🦋","🎀"];
    const emoji = emojis[rand(0, emojis.length-1)];
    const display = Array(answer).fill(emoji).join(" ");
    const opts = shuffle([answer, answer>1?answer-1:answer+2, answer+1, answer+2].filter((v,i,a)=>a.indexOf(v)===i).slice(0,4));
    area.innerHTML = `
      <h3>🔢 How many ${emoji} do you see?</h3>
      <div class="game-question" style="font-size:2rem;letter-spacing:4px;margin:20px 0">${display}</div>
      <div class="game-choices">
        ${opts.map(o=>`<button class="choice-btn">${o}</button>`).join("")}
      </div>
      <div class="game-score">Score: ${score}</div>`;
    area.querySelectorAll(".choice-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        area.querySelectorAll(".choice-btn").forEach(b => b.disabled = true);
        if (+btn.textContent === answer) {
          btn.classList.add("correct");
          score++; addStar(2); starBurst();
          showToast("🎉 You counted correctly!");
        } else {
          btn.classList.add("wrong");
          showToast(`😊 There were ${answer}! Count again!`);
        }
        setTimeout(render, 1200);
      });
    });
  };
  render();
  earnBadge("mathstar");
}

// ============ BADGES ============
function earnBadge(id) {
  if (earnedBadges.includes(id)) return;
  earnedBadges.push(id);
  const el = document.getElementById(`badge-${id}`);
  if (el) {
    el.classList.remove("locked");
    el.classList.add("earned");
  }
  showToast(`🏅 Badge Unlocked: ${id.charAt(0).toUpperCase()+id.slice(1)}!`);
  addStar(5);
}

// ============ STAR SYSTEM ============
function addStar(amount = 1) {

  totalStars += amount;
  kidsStars += amount;

  document.getElementById("totalStars").textContent = totalStars;
updateUserUI();
  saveStarsToDB();

  if (totalStars >= 10) earnBadge("starter");
  if (totalStars >= 30) earnBadge("reader");
  if (totalStars >= 60) earnBadge("mathstar");
  if (totalStars >= 100) earnBadge("champion");
  if (totalStars >= 150) earnBadge("explorer");
  if (totalStars >= 200) earnBadge("superstar");
}

// ============ WORKSHEET DOWNLOAD ============
function downloadSheet(name) {
  // Creates a simple printable HTML worksheet and downloads it
  const content = `<!DOCTYPE html><html><head><title>${name} Worksheet</title>
  <style>
    body{font-family:Arial,sans-serif;padding:40px;max-width:700px;margin:0 auto}
    h1{color:#6C63FF;text-align:center;font-size:2rem}
    h2{color:#FF6B9D;margin-top:24px}
    .line{border-bottom:1px solid #ccc;margin:10px 0;height:40px}
    .dotted{border-bottom:2px dashed #aaa;margin:8px 0;height:50px;display:flex;align-items:center;color:#ccc;font-size:1.5rem;letter-spacing:4px}
    .box{border:2px solid #ddd;border-radius:8px;padding:12px;margin:8px 0}
    @media print{body{padding:20px}}
  </style></head><body>
  <h1>📚 SmartKids – ${name.replace(/_/g," ")}</h1>
  <p style="text-align:center;color:#888">Name: _______________ &nbsp;&nbsp; Date: _______________ &nbsp;&nbsp; Class: ___</p>
  <hr style="margin:16px 0"/>
  ${generateWorksheetContent(name)}
  <p style="text-align:center;margin-top:40px;color:#aaa">SmartKids Learning Platform © 2025 | Print & Practise!</p>
  </body></html>`;

  const blob = new Blob([content], {type: "text/html"});
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `${name}_Worksheet.html`;
  a.click();
  showToast("📄 Worksheet Downloaded! Open it to print.");
  addStar(3);
}

function generateWorksheetContent(name) {
  if (name.includes("Alphabet_Tracing")) {
    return `<h2>✏️ Trace the Alphabets</h2>` +
      "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map(l =>
        `<div class="box"><b style="font-size:2rem;color:#FF6B9D">${l} ${l.toLowerCase()}</b> &nbsp; Trace: <span class="dotted" style="display:inline-block;width:400px;border-bottom:2px dashed #ccc;vertical-align:middle">&nbsp;</span></div>`
      ).join("");
  }
  if (name.includes("2Letter") || name.includes("Phonics")) {
    return `<h2>📝 Write the words</h2>` +
      CVC_WORDS.slice(0,10).map(w =>
        `<div class="box">${w.emoji} <b>${w.w}</b> → Write: <span style="display:inline-block;width:200px;border-bottom:2px solid #ddd;margin-left:10px">&nbsp;</span></div>`
      ).join("");
  }
  if (name.includes("Sentences")) {
    return `<h2>📖 Read and Write</h2>` +
      SENTENCES.map((s,i) =>
        `<div class="box">${i+1}. ${s.emoji} <b>${s.s}</b><div class="line"></div></div>`
      ).join("");
  }
  return `<h2>📝 Practice Sheet</h2>` +
    Array(10).fill(0).map((_,i) =>
      `<div class="box">Q${i+1}. ________________________________________</div>`
    ).join("");
}

// ============ UTILITIES ============
function rand(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function shuffle(arr) {
  return [...arr].sort(() => Math.random() - 0.5);
}

function speakText(text) {
  if ("speechSynthesis" in window) {
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.rate = 0.85; utt.pitch = 1.1;
    window.speechSynthesis.speak(utt);
  }
}

function animateCard(el) {
  el.style.transform = "scale(1.2) rotate(-5deg)";
  setTimeout(() => { el.style.transform = ""; }, 300);
}

function showToast(msg) {
  const toast = document.getElementById("toast");
  toast.textContent = msg;
  toast.classList.remove("hidden");
  toast.classList.add("show");
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.classList.add("hidden"), 400);
  }, 2500);
}

function starBurst() {
  const el = document.getElementById("starBurst");
  el.classList.remove("hidden", "pop");
  void el.offsetWidth;
  el.classList.add("pop");
  setTimeout(() => el.classList.add("hidden"), 900);
}

// ===== SEARCH FUNCTION =====
const searchInput = document.getElementById("searchInput");

if (searchInput) {
  searchInput.addEventListener("keyup", function () {
    const value = this.value.toLowerCase().trim();

    if (value.includes("lkg")) {
      openClassSection("LKG", "lkg");
    }

    else if (value.includes("ukg")) {
      openClassSection("UKG", "ukg");
    }

    else if (value.includes("class")) {
      openClassSection("Class 1", "class1");
    }

    else if (value.includes("home")) {
      goToPage("home");
    }
  });
}
// Handle browser back/forward
window.addEventListener("popstate", function () {
  const hash = window.location.hash.replace("#", "");
  const page = hash ? hash : "home";
  goToPage(page, false);
});

document.querySelectorAll(".pay-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    alert("💖 Thank you for supporting teachers!");
  });
});

async function sendContactMessage() {

  const name = document.getElementById("contactName").value.trim();
  const email = document.getElementById("contactEmail").value.trim();
  const msg = document.getElementById("contactMsg").value.trim();

  if (!name || !email || !msg) {
    alert("Fill all fields");
    return;
  }
//admin ko msg
  const res = await fetch("https://smart-kids-backend.onrender.com/send-message", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      name,
      email,
      msg
    })
  });

  const data = await res.json();

  if (data.success) {
    alert("Message Sent Successfully!");

    document.getElementById("contactName").value = "";
    document.getElementById("contactEmail").value = "";
    document.getElementById("contactMsg").value = "";
  }
}


// ===== BEAR ANIMATION FIX =====
document.addEventListener("DOMContentLoaded", function () {

  const bearContainer = document.getElementById("bearAnimation");

  if (bearContainer) {
    lottie.loadAnimation({
      container: bearContainer,
      renderer: "svg",
      loop: true,
      autoplay: true,
      path: "assets/animations/bear.json" // ✅ FIXED PATH
    });
  }

  let isLeft = true;
  const bearBox = document.getElementById("bearContainer");

  if (bearBox) {
    bearBox.addEventListener("click", () => {
      if (isLeft) {
        bearBox.style.left = "auto";
        bearBox.style.right = "20px";
      } else {
        bearBox.style.right = "auto";
        bearBox.style.left = "20px";
      }
      isLeft = !isLeft;
    });
  }

});

async function studentLogin() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;

  if (!username || !password) {
    alert("Fill all fields");
    return;
  }

  try {
    const res = await fetch("https://smart-kids-backend.onrender.com/student-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ username, password })
    });

    const data = await res.json();

    if (data.success) {

  localStorage.setItem("user", JSON.stringify(data.user));

  if (data.logId) {
    localStorage.setItem("studentLogId", data.logId);
  }

  updateUserUI();
  loadStarsFromDB();
  goToPage("home");


  // save login log id
  if (data.logId) {
    localStorage.setItem("studentLogId", data.logId);
  }

  alert("✅ Login successful");

  updateUserUI();
  loadStarsFromDB();

  goToPage("home");
}
    else {
      alert("❌ " + data.message);
    }

  } catch (err) {
    console.error(err);
    alert("⚠️ Server not running");
  }
}


//naya mal teacher 

function goToTeacher() {
  window.location.href = "http://localhost:3000/teacher.html";
}

function selectRole(role) {
  if (role === "student") {
    goToPage("student-auth");

    // 🔥 IMPORTANT: re-render Google button AFTER page shows
    setTimeout(() => {
      if (window.google && google.accounts) {
        google.accounts.id.initialize({
          client_id: "174875669687-iuekhc1gd6rf058kfp9m1f2mu60hi6a2.apps.googleusercontent.com",
          callback: handleCredentialResponse
        });

        google.accounts.id.renderButton(
          document.querySelector(".g_id_signin"),
          { theme: "outline", size: "large" }
        );
      }
    }, 500);
  } else {
    window.location.href = "teacher.html";
  }
}
//googolllll

function handleCredentialResponse(response) {
  console.log("TOKEN RECEIVED:", response);
  const token = response.credential;

  fetch("https://smart-kids-backend.onrender.com/google-login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ token })
  })
  .then(res => res.json())
  .then(data => {
    console.log("BACKEND RESPONSE:", data);
    if (data.success) {

      localStorage.setItem("user", JSON.stringify(data.user));
updateUserUI();
loadStarsFromDB();

      if (data.role === "teacher") {
        window.location.href = "teacher.html";
      } else {
        goToPage("home");
      }

    } else {
      alert("Login failed");
    }
  });
}
//update fuc
function updateUserUI() {
  const user = JSON.parse(localStorage.getItem("user"));

  const profileBtn = document.getElementById("profileBtn");
  const loginBtn = document.querySelector('[data-page="role"]');

  if (user) {
    profileBtn.style.display = "inline-block";
    loginBtn.style.display = "none";
  } else {
    profileBtn.style.display = "none";
    loginBtn.style.display = "inline-block";
  }

  const starEl = document.getElementById("totalStars");
  if (starEl) {
    starEl.textContent = totalStars;
  }
}

//refress profile 
function loadProfileData() {
  const user = JSON.parse(localStorage.getItem("user"));
  if (!user) return;

  document.getElementById("profileName").textContent = user.name || "";
  document.getElementById("profileEmail").textContent = user.email || "";
  document.getElementById("profileRole").textContent = user.role || "";

  if (user.profileImage) {
    document.getElementById("profileImage").src = user.profileImage;
  }
}

document.addEventListener("DOMContentLoaded", () => {

  updateUserUI();

  const profileBtn = document.getElementById("profileBtn");

  if (profileBtn) {
    profileBtn.addEventListener("click", () => {
      loadProfileData();
      goToPage("profile");
    });
  }

});


// PROFILE IMAGE UPLOAD
document.getElementById("imageUpload").addEventListener("change", function () {
  const file = this.files[0];

  if (!file) return;

  const reader = new FileReader();

  reader.onload = async function (e) {
    const imageData = e.target.result;

    document.getElementById("profileImage").src = imageData;

    const user = JSON.parse(localStorage.getItem("user"));

    const res = await fetch("https://smart-kids-backend.onrender.com/save-profile-image", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: user.email,
        image: imageData
      })
    });

    const data = await res.json();

    if (data.success) {
      localStorage.setItem("user", JSON.stringify(data.user));
    }
  };

  reader.readAsDataURL(file);
});

async function logoutUser() {

  try {
    const logId = localStorage.getItem("studentLogId");

    if (logId) {
      await fetch("https://smart-kids-backend.onrender.com/logout-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ logId })
      });
    }

  } catch (err) {
    console.log(err);
  }

  localStorage.removeItem("studentLogId");
  localStorage.removeItem("user");

  goToPage("role");
}
//new star wala 
// ================= STAR DATABASE =================

// Save stars
async function saveStarsToDB() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.email) return;

  try {
    await fetch("https://smart-kids-backend.onrender.com/save-stars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: user.email,
        totalStars,
        kidsStars,
        gameStars
      })
    });
  } catch (err) {
    console.log("Save error:", err);
  }
}

// Load stars
async function loadStarsFromDB() {
  const user = JSON.parse(localStorage.getItem("user"));

  if (!user || !user.email) return;

  try {
    const res = await fetch("https://smart-kids-backend.onrender.com/get-stars", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: user.email
      })
    });

    const data = await res.json();

    if (data.success && data.user) {
      totalStars = data.user.totalStars || 0;
      kidsStars = data.user.kidsStars || 0;
      gameStars = data.user.gameStars || 0;

      document.getElementById("totalStars").textContent = totalStars;
    }

  } catch (err) {
    console.log("Load error:", err);
  }
}

//msg
document.addEventListener("DOMContentLoaded", () => {

  const form = document.getElementById("contactForm");

  if (form) {

    form.addEventListener("submit", async function(e) {

      e.preventDefault();

      const name = document.getElementById("name").value.trim();
      const email = document.getElementById("email").value.trim();
      const msg = document.getElementById("message").value.trim();

      if (!name || !email || !msg) {
        alert("Please fill all fields");
        return;
      }

      try {

        const res = await fetch("https://smart-kids-backend.onrender.com/contact-message", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            name,
            email,
            msg
          })
        });

        const data = await res.json();

        if (data.success) {
          alert("✅ Message Sent Successfully!");

          form.reset();

        } else {
          alert("Failed to send");
        }

      } catch (err) {
        alert("Server error");
      }

    });

  }

});

//inactive clas
async function openClassSection(className, pageName) {
  try {
    const res = await fetch("https://smart-kids-backend.onrender.com/classes-status");
    const data = await res.json();

    const cls = data.classes.find(
      c => c.name.toLowerCase() === className.toLowerCase()
    );

    if (!cls) {
      alert("Class not found");
      return;
    }

    if (cls.status === "Inactive") {
      alert(className + " is currently inactive.");
      return;
    }

    goToPage(pageName);

  } catch (err) {
    alert("Server error");
  }
}