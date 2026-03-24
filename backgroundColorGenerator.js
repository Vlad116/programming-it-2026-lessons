const btn = document.getElementById("getRandomBgColorBtn");

const getRandomColorValue = () => Math.floor(Math.random() * 256);

btn.addEventListener("click", () => {
  const r = getRandomColorValue();
  const g = getRandomColorValue();
  const b = getRandomColorValue();

  const color = `rgb(${r}, ${g}, ${b})`;
  document.body.style.backgroundColor = color;
});
