const input = document.getElementById("pass-input");
const range = document.querySelector('input[type="range"]');
const checkBoxes = document.querySelectorAll('input[type="checkbox"]');
const generateBtn = document.querySelector(".generate-btn");

const lengthOfPass = document.querySelector(".length-of-char");
const strengthOfPass = document.getElementById("strength-of-password");

const LOWER = "abcdefghijklmnopqrstuvwxyz";
const UPPER = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const NUMBERS = "0123456789";
const SYMBOLS = "!@#$%^&*()-_=+[]{};:,.<>?/|~";

let lengthOfPassword;

let options = {
  uppercase: false,
  lowercase: false,
  number: false,
  symbols: false,
};

// length of character
range.addEventListener("change", (e) => {
  lengthOfPassword = +e.target.value;

  //checkboxes event
  checkBoxes.forEach((checkbox) => {
    checkbox.checked = false;

    checkbox.addEventListener("change", (e) => {
      options[checkbox.id] = e.target.checked;
    });
  });

  // generates random char
  function randomChar(str) {
    const array = new Uint32Array(1);
    crypto.getRandomValues(array);
    return str[array[0] % str.length];
  }

  // shuffles password
  function shuffle(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
      const j = crypto.getRandomValues(new Uint32Array(1))[0] % (i + 1);
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  // GENERATING PASSWORD
  function generatePassword(length, options) {
    let charset = "";
    let password = [];

    if (options.lowercase) {
      charset += LOWER;
      password.push(randomChar(LOWER));
    }

    if (options.uppercase) {
      charset += UPPER;
      password.push(randomChar(UPPER));
    }

    if (options.number) {
      charset += NUMBERS;
      password.push(randomChar(NUMBERS));
    }

    if (options.symbols) {
      charset += SYMBOLS;
      password.push(randomChar(SYMBOLS));
    }

    if (!charset.length) {
      throw new Error("Select at least one character type");
    }

    // Edge case: length too small
    if (length < password.length) {
      throw new Error("Password length is too short for selected options");
    }

    // fill the rest
    while (password.length < length) {
      password.push(randomChar(charset));
    }

    // shuffle result
    return shuffle(password).join("");
  }

  generateBtn.addEventListener("click", () => {
    const passwordFinal = generatePassword(lengthOfPassword, options);

    console.log(passwordFinal);
    range.value = range.min || 0;
    updateFill(range);
  });
});

// fill slider with green color on change
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
