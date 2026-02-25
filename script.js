let input = document.getElementById("inputBox");
let buttons = document.querySelectorAll(".calc button");
let preview = document.getElementById("preview");
let string = "";

// ==================== COPY BUTTON ====================
const copyBtn = document.getElementById("copyBtn");
let copyTimeout = null;

function showCopyBtn() {
    copyBtn.style.display = "block";
}

function hideCopyBtn() {
    copyBtn.style.display = "none";
    copyBtn.textContent = "📋";
    copyBtn.classList.remove("copied");
    clearTimeout(copyTimeout);
}

copyBtn.addEventListener("click", () => {
    const result = input.value;
    if (!result || result === "Error" || result === "Can't divide by zero") return;

    navigator.clipboard.writeText(result).then(() => {
        copyBtn.textContent = "Copied!";
        copyBtn.classList.add("copied");

        clearTimeout(copyTimeout);
        copyTimeout = setTimeout(() => {
            copyBtn.textContent = "📋";
            copyBtn.classList.remove("copied");
        }, 2000);
    }).catch(() => {
        input.select();
        document.execCommand("copy");
    });
});
// =====================================================


// ==================== FACTORIAL ====================
function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return "Error";
    if (n > 170) return "Too Large"; // prevent overflow
    let fact = 1;
    for (let i = 1; i <= n; i++) {
        fact *= i;
    }
    return fact;
}
// =====================================================


// ==================== LIVE PREVIEW ====================
function updatePreview() {
    if (!input.value) {
        preview.textContent = "";
        return;
    }

    try {
        let result = eval(input.value);

        if (!isFinite(result)) {
            preview.textContent = "";
            return;
        }

        preview.textContent = "= " + result;
    } catch {
        preview.textContent = "";
    }
}

/** Handles the evaluation of the current string expression */
function calculate() {
    try {
        // Ensure no leading zeros to prevent octal interpretation
        string = string.replace(/(^|[+\-*/(])0+(?=\d)/g, '$1');
        string = eval(string);
        // eval("5/0") returns Infinity — treat it as an error
        if (!isFinite(string)) {
            input.value = "Can't divide by zero";
            string = "";
            hideCopyBtn();
        } else {
            input.value = string;
            string = "";
            showCopyBtn();
        }
    } catch {
        input.value = "Error";
        string = "";
        hideCopyBtn();
    }
}
// =====================================================


// ==================== BUTTON CLICK ====================
buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
        let value = e.target.innerHTML;

        if (value === "=") {
            calculate();
        }

        else if (value === "AC") {
            input.value = "";
            string = "";
            preview.textContent = "";
            hideCopyBtn();
        }

        else if (value === "DEL") {
            string = string.slice(0, -1);
            input.value = string;
            if (!string) hideCopyBtn();
            updatePreview();
        }

        else if (value === "√") {
            let num = parseFloat(input.value);
            if (num < 0 || isNaN(num)) {
                input.value = "Error";
                hideCopyBtn();
            } else {
                input.value = Math.sqrt(num);
                string = "";
                showCopyBtn();
            }
            preview.textContent = "";
        }

        else if (value === "!") {
            let num = parseFloat(input.value);
            let result = factorial(num);
            input.value = result;
            string = "";
            preview.textContent = "";
            result !== "Error" ? showCopyBtn() : hideCopyBtn();
        }

        else {
            // Prevent double operators
            if ("+-*/".includes(value) && "+-*/".includes(string.slice(-1))) {
                string = string.slice(0, -1);
            }

            string += value;
            string = string.replace(/(^|[+\-*/(])0+(?=\d)/g, '$1');

            input.value = string;
            hideCopyBtn();
            updatePreview();
        }

        input.scrollLeft = input.scrollWidth;
    });
});
// =====================================================

// Enter key support
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        // If the user types directly into the box, we need to update 'string' before calculating
        string = input.value;
        calculate();
    }
});
// =====================================================


// ==================== BLOCK INVALID KEYBOARD INPUT ====================
const allowedKeys = "0123456789+-*/().!";

input.addEventListener("keydown", (e) => {
    if (
        !allowedKeys.includes(e.key) &&
        e.key !== "Backspace" &&
        e.key !== "Delete" &&
        e.key !== "Enter" &&
        e.key !== "ArrowLeft" &&
        e.key !== "ArrowRight"
    ) {
        e.preventDefault();
    }
});
// =====================================================


// ==================== PASTE SUPPORT ====================
input.addEventListener("paste", (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData("text");

    if (!isNaN(pasted) && pasted.trim() !== "") {
        input.value = pasted.trim();
        string = input.value;
        hideCopyBtn();
        updatePreview();
    }
    if ("+-*/".includes(e.key) && "+-*/".includes(input.value.slice(-1))) input.value = input.value.slice(0, -1);
// =====================================================


// ==================== INPUT LISTENER ====================
input.addEventListener("input", () => {
    string = input.value;
    updatePreview();
});
// =====================================================