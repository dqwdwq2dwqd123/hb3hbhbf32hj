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
];

const gridSize = 12;
const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const gridElement = document.getElementById("grid");
const wordList = document.getElementById("word-list");

// Fill word list
words.forEach(word => {
  const li = document.createElement("li");
  li.textContent = `🤍 ${word}`;
  wordList.appendChild(li);
});

// Generate grid letters
for (let i = 0; i < gridSize * gridSize; i++) {
  const cell = document.createElement("div");
  cell.className = "cell";
  cell.textContent = letters[Math.floor(Math.random() * letters.length)];
  gridElement.appendChild(cell);
}
