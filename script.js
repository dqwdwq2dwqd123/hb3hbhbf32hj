// ================== SETUP ==================
const gridContainer = document.getElementById("grid");
const wordListElement = document.getElementById("word-list");
const progressEl = document.getElementById("progress");

const SAVE_KEY = "wordsearch-progress";

// Words
const words = [
  "POOP",
  "POOPDICORN",
  "DUH",
  "CLIMATECHANGE",
  "LISTEN",
  "PREVAILING",
  "KHALID",
  "SEX",
  "BACKSHOTS",
  "MOTEL",
  "YOTEL",
  "CENTRAL",
  "AVANTI",
  "ROBLOX"
].map(w => w.toUpperCase());

let remainingWords = [...words];

// Grid size (same logic as your example)
const longestWord = Math.max(...words.map(w => w.length));
const gridSize = Math.max(
  longestWord + 2,
  Math.ceil(Math.sqrt(words.join("").length) * 1.5)
);

// Grid data
let grid = Array.from({ length: gridSize }, () =>
  Array.from({ length: gridSize }, () => "")
);

// ================== WORD BANK ==================
function renderWordBank() {
  wordListElement.innerHTML = "";
  remainingWords.forEach(word => {
    const li = document.createElement("li");
    li.dataset.word = word;
    li.innerHTML = `<span>🤍</span><span>${word}</span>`;
    wordListElement.appendChild(li);
  });

  if (progressEl) {
    progressEl.textContent =
      `${words.length - remainingWords.length} / ${words.length} found`;
  }
}

// ================== GRID GENERATION ==================
function placeWord(word) {
  const directions = ["horizontal", "vertical", "diagonal"];
  let placed = false;
  let safety = 0;

  while (!placed && safety < 5000) {
    safety++;
    const direction = directions[Math.floor(Math.random() * directions.length)];
    let row, col;

    if (direction === "horizontal") {
      row = Math.floor(Math.random() * gridSize);
      col = Math.floor(Math.random() * (gridSize - word.length));
      if (canPlaceWord(word, row, col, 0, 1)) {
        for (let i = 0; i < word.length; i++) grid[row][col + i] = word[i];
        placed = true;
      }
    }

    if (direction === "vertical") {
      row = Math.floor(Math.random() * (gridSize - word.length));
      col = Math.floor(Math.random() * gridSize);
      if (canPlaceWord(word, row, col, 1, 0)) {
        for (let i = 0; i < word.length; i++) grid[row + i][col] = word[i];
        placed = true;
      }
    }

    if (direction === "diagonal") {
      row = Math.floor(Math.random() * (gridSize - word.length));
      col = Math.floor(Math.random() * (gridSize - word.length));
      if (canPlaceWord(word, row, col, 1, 1)) {
        for (let i = 0; i < word.length; i++) grid[row + i][col + i] = word[i];
        placed = true;
      }
    }
  }
}

function canPlaceWord(word, row, col, rowStep, colStep) {
  for (let i = 0; i < word.length; i++) {
    const r = row + i * rowStep;
    const c = col + i * colStep;

    if (
      r >= gridSize ||
      c >= gridSize ||
      (grid[r][c] !== "" && grid[r][c] !== word[i])
    ) {
      return false;
    }
  }
  return true;
}

function fillGrid() {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  for (let r = 0; r < gridSize; r++) {
    for (let c = 0; c < gridSize; c++) {
      if (grid[r][c] === "") {
        grid[r][c] = letters[Math.floor(Math.random() * letters.length)];
      }
    }
  }
}

// ================== RENDER GRID ==================
function renderGrid() {
  gridContainer.innerHTML = "";
  gridContainer.style.gridTemplateColumns = `repeat(${gridSize}, 1fr)`;

  grid.forEach((row, r) => {
    row.forEach((letter, c) => {
      const cell = document.createElement("div");
      cell.className = "cell";
      cell.textContent = letter;
      cell.dataset.r = r;
      cell.dataset.c = c;
      gridContainer.appendChild(cell);
    });
  });
}

// ================== SAVE / LOAD ==================
function saveProgress() {
  const foundCells = Array.from(document.querySelectorAll(".cell.found"))
    .map(cell => ({ r: cell.dataset.r, c: cell.dataset.c }));

  const data = {
    grid,
    remainingWords,
    foundCells
  };

  localStorage.setItem(SAVE_KEY, JSON.stringify(data));
}

function loadProgress() {
  const raw = localStorage.getItem(SAVE_KEY);
  if (!raw) return false;

  const data = JSON.parse(raw);
  grid = data.grid;
  remainingWords = data.remainingWords;

  renderWordBank();
  renderGrid();

  data.foundCells.forEach(({ r, c }) => {
    const cell = document.querySelector(
      `.cell[data-r="${r}"][data-c="${c}"]`
    );
    if (cell) cell.classList.add("found");
  });

  if (progressEl) {
    progressEl.textContent =
      `${words.length - remainingWords.length} / ${words.length} found`;
  }

  return true;
}

// ================== GAME START ==================
if (!loadProgress()) {
  renderWordBank();
  words.forEach(w => placeWord(w));
  fillGrid();
  renderGrid();
}

// ================== CLICK LOGIC ==================
let selectedCells = [];

gridContainer.addEventListener("click", (e) => {
  const cell = e.target;
  if (!cell.classList.contains("cell")) return;
  if (cell.classList.contains("found")) return;
  if (cell.classList.contains("selected")) return;

  cell.classList.add("selected");
  selectedCells.push(cell);

  const selectedWord = selectedCells.map(c => c.textContent).join("");

  if (words.includes(selectedWord)) {
    selectedCells.forEach(c => {
      c.classList.remove("selected");
      c.classList.add("found");
    });

    removeWordFromBank(selectedWord);
    saveProgress();
    selectedCells = [];
    return;
  }

  if (selectedCells.length > longestWord) {
    resetSelection();
  }
});

function resetSelection() {
  selectedCells.forEach(c => c.classList.remove("selected"));
  selectedCells = [];
}

// ================== WORD FOUND ==================
function removeWordFromBank(word) {
  remainingWords = remainingWords.filter(w => w !== word);

  const li = wordListElement.querySelector(`li[data-word="${word}"]`);
  if (li) {
    li.style.opacity = "0";
    li.style.transform = "translateX(10px)";
    setTimeout(() => li.remove(), 200);
  }

  if (progressEl) {
    progressEl.textContent =
      `${words.length - remainingWords.length} / ${words.length} found`;
  }

  if (remainingWords.length === 0) {
    localStorage.removeItem(SAVE_KEY);
    window.location.href = "invite.html";
  }
}
