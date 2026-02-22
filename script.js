let input = document.getElementById("inputBox");
let buttons = document.querySelectorAll("button");
let string = "";

// Factorial function
function factorial(n) {
    if (n < 0 || !Number.isInteger(n)) return "Error";
    let fact = 1;
    for (let i = 1; i <= n; i++) {
        fact *= i;
    }
    return fact;
}

buttons.forEach((button) => {
    button.addEventListener("click", (e) => {
        let value = e.target.innerHTML;

        if (value === "=") {
            try {
                string = eval(string);
                input.value = string;
                string = "";
            } catch {
                input.value = "Error";
                string = "";
            }
        }

        else if (value === "AC") {
            string = "";
            input.value = "";
        }

        else if (value === "DEL") {
            string = string.slice(0, -1);
            input.value = string;
        }

        else if (value === "√") {
            let num = parseFloat(input.value);
            if (num < 0 || isNaN(num)) {
                input.value = "Error";
            } else {
                input.value = Math.sqrt(num);
            }
            string = "";
        }

        else if (value === "!") {
            let num = parseFloat(input.value);
            input.value = factorial(num);
            string = "";
        }

        else {
            string += value;
            input.value = string;
        }
    });
});

// Enter key support
document.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        try {
            string = eval(input.value);
            input.value = string;
            string = "";
        } catch {
            input.value = "Error";
            string = "";
        }
    }
});

// Block invalid keyboard input
const allowedKeys = "0123456789+-*/().!";
input.addEventListener("keypress", (e) => {
    if (!allowedKeys.includes(e.key)) {
        e.preventDefault();
    }
});