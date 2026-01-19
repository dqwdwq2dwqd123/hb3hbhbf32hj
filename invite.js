const yesBtn = document.getElementById("yesBtn");
const noBtn = document.getElementById("noBtn");
const result = document.getElementById("result");

let noMoves = 0;

yesBtn.addEventListener("click", () => {
  result.textContent = "YIPPPEE 🤍🤍";
  confettiHearts();
});

noBtn.addEventListener("mouseenter", () => {
  // Make the "No" button dodge the mouse a bit
  noMoves++;
  const x = Math.floor(Math.random() * 240) - 120;
  const y = Math.floor(Math.random() * 160) - 80;
  noBtn.style.transform = `translate(${x}px, ${y}px)`;

  if (noMoves >= 4) {
    result.textContent = "HEYYY";
  }
});

noBtn.addEventListener("click", () => {
  result.textContent = "HEYY";
});

function confettiHearts() {
  // tiny cute effect: spawn hearts
  for (let i = 0; i < 22; i++) {
    const heart = document.createElement("div");
    heart.textContent = "🤍";
    heart.style.position = "fixed";
    heart.style.left = `${Math.random() * 100}vw`;
    heart.style.top = `-5vh`;
    heart.style.fontSize = `${18 + Math.random() * 18}px`;
    heart.style.opacity = "0.9";
    heart.style.transition = "transform 1.6s linear, opacity 1.6s linear";
    document.body.appendChild(heart);

    requestAnimationFrame(() => {
      heart.style.transform = `translateY(${110 + Math.random() * 30}vh)`;
      heart.style.opacity = "0";
    });

    setTimeout(() => heart.remove(), 1700);
  }
}
