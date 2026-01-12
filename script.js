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
  console.log(lengthOfPassword + " length selected");
  //checkboxes event
  checkBoxes.forEach((checkbox) => {
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

  function getPasswordStrength(password) {
    let score = 0;

    // Length score
    if (password.length >= 6) score += 1;
    if (password.length >= 10) score += 1;
    if (password.length >= 14) score += 1;

    // Character checks
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    // Max score = 7

    if (score <= 2) return "too-weak";
    if (score <= 4) return "weak";
    if (score <= 5) return "medium";
    if (score <= 6) return "strong";
    // return "Very Strong";
  }

  // GENERATING PASSWORD
  function generatePassword(length, options) {
    console.log(
      `generating password of length ${length} with options:`,
      options
    );
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

    console.log(length);

    if (!length) {
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

    input.value = passwordFinal;

    const strength = getPasswordStrength(passwordFinal);

    strengthOfPass.src = `./assets/images/${strength}.svg`;
    strengthOfPass.style.width = "155px";

    // reset values
    range.value = range.min || 0;
    updateFill(range);
    options = {
      uppercase: false,
      lowercase: false,
      number: false,
      symbols: false,
    };

    // Uncheck all checkboxes visually
    checkBoxes.forEach((checkbox) => {
      checkbox.checked = false;
    });

    lengthOfPassword = null;
  });
});

// fill slider with green color on change
function updateFill(el) {
  const min = el.min || 0;
  const max = el.max || 100;
  const val = el.value;

  const percent = ((val - min) / (max - min)) * 100;
  el.style.setProperty("--fill", `${percent}%`);

  lengthOfPass.textContent = val;
}

// init
updateFill(range);

// update on slide
range.addEventListener("input", () => updateFill(range));
