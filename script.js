const range = document.querySelector('input[type="range"]');

function updateFill(el) {
  const min = el.min || 0;
  const max = el.max || 100;
  const val = el.value;

  const percent = ((val - min) / (max - min)) * 100;
  el.style.setProperty("--fill", `${percent}%`);
}

// init
updateFill(range);

// update on slide
range.addEventListener("input", () => updateFill(range));
