var inputField = document.getElementById("input-expr")

document.addEventListener('keydown', event => {
    if (event.ctrlKey && event.code == 'KeyC') {
        inputChar('MS');
    } else if (event.code == 'Enter') {
        inputChar('=');
    } else if (event.code == 'Backspace') {
        inputChar('⌫')
    } else if (event.key == 'ArrowLeft' || event.key == 'ArrowRight') {
        inputField.focus();
    } else {
        inputChar(event.key);
    }
});

document.querySelector(".calculator-buttoms").addEventListener('click', event => {
    console.log(event.target.value);
    inputChar(event.target.value);
});

inputField.addEventListener('keydown', event => {
    let key = event.key;

    if (key.match(/[0-9]/) || key.match(/[()+\-*/.]/) || 
        key == 'ArrowLeft' || key == 'ArrowRight' || key == 'Delete' || key == 'Backspace') {
        event.stopPropagation();
        return;
    } else {
        event.preventDefault();
    }
});

var showPrompt = function(text) {
    let popUpBlock = document.querySelector('.pop-up-block-text')

    console.log(popUpBlock.firstChild);
    popUpBlock.firstChild.textContent = text;
    popUpBlock.style.cssText = `animation-name: popUpPromt;`;
    setTimeout(() => {popUpBlock.style.cssText = `animation-name: hidePromt;`;
        popUpBlock.firstChild.textContent = "";}, 2000);
}

var inputChar = function(value) {
    switch (value) {
        case 'MS':
            window.navigator.clipboard.writeText(inputField.value);
            showPrompt('Выражение скопировано в буфер обмена');
        break;
        case 'C':
            inputField.value = "";
        break;
        case '⌫':
            inputField.value = inputField.value.slice(0, -1);
        break;
        case '±':
            if (inputField.value != "" && inputField.value.match(/[0-9]$/)) {
                let lastDigit = inputField.value.search(/[-+*/()\s÷]([0-9.]+)$/);
                if (inputField.value[lastDigit] == '-' && (/[-+*/()\s÷]/.test(inputField.value[lastDigit-1]) || 
                        lastDigit == 0)) {
                    inputField.value = inputField.value.slice(0, lastDigit).concat(inputField.value.slice(lastDigit+1));
                } else if (inputField.value[lastDigit] == '-' && inputField.value[lastDigit-1].match(/[0-9]/)) {
                    inputField.value = inputField.value.slice(0, lastDigit).concat('+', 
                        inputField.value.slice(lastDigit+1));
                } else {
                    inputField.value = inputField.value.slice(0, lastDigit + 1).concat('-',
                        inputField.value.slice(lastDigit+1));
                }
            }

        break;
        case '+': case '-': case '*': case '÷': case '/':
            if (inputField.value != "" && inputField.value.match(/[)0-9](\s*)$/)) {
                inputField.value += value;
            } else if (inputField.value != "" && inputField.value.match(/[-+*/÷]\s*$/)) {
                inputField.value = inputField.value.trimRight();
                inputField.value = inputField.value.slice(0, -1).concat(event.target.value);
            }
        break;
        case '0': case '1': case '2': case '3': case '4':
        case '5': case '6': case '7': case '8': case '9':
        case '(':
            inputField.value += value;
        break;
        case '.':
            if (inputField.value != "" && inputField.value.match(/[0-9]$/) &&
                inputField.value.match(/([0-9]+\.[0-9]*)$/) == null) {
                inputField.value += value;
            }
        break;
        case ')':
            let parentheses = getParentheses(inputField.value);
            if (!isValidParentheses(parentheses)) {
                inputField.value += value;
            }
        break;
        case '=':
            let resultField = document.querySelector(".p-result");
            if (inputField.value == "") {
                resultField.innerHTML = "Пустое выражение";
            } else if (confrirmAndValidate(inputField.value)) {
                let expr = transformExpr(inputField.value),
                    result = 0;
                
                expr = infixToPostfix(expr);
                result = postfixEval(expr);
                
                document.querySelector(".p-expr").innerHTML = inputField.value;
                resultField.innerHTML = result;

            } else {
                resultField.innerHTML = "Синтаксическая ошибка";
            }
            showPrompt('Результат записан');
        break;

        default:
            return;
    }
}

var getParentheses = function(s) {
    let parentheses = "";
    for (const character of s) {
        if (character === '(') {
            parentheses += '(';
        } else if (character === ')') {
            parentheses += ')';
        }
    }
    return parentheses;
}

var isValidParentheses = function(s) {
    const stack = [];
    for (const bracket of s) {
        if (bracket === '(') {
            stack.push(bracket);
        } else if (!stack || stack.pop() !== '(') {
            return false;
        }
    }
    return stack.length === 0;
};

var infixToPostfix = function(infixexpr) {
    const prec = {};
    prec["*"] = 3;
    prec["÷"] = 3; 
    prec["/"] = 3;
    prec["+"] = 2;
    prec["-"] = 2;
    prec["("] = 1;
    const opStack = [];
    const postfixList = [];
    const tokenList = infixexpr.split(" ");

    for (const token of tokenList) {
        if (/\d/.test(token)) {
            postfixList.push(token);
        } else if (token === '(') {
            opStack.push(token);
        } else if (token === ')') {
            let topToken = opStack.pop();
            while (topToken !== '(') {
                postfixList.push(topToken);
                topToken = opStack.pop();
            }
        } else {
            while (opStack.length !== 0 && prec[opStack[opStack.length - 1]] >= prec[token]) {
                postfixList.push(opStack.pop());
            }
            opStack.push(token);
        }
    }

    while (opStack.length !== 0) {
        postfixList.push(opStack.pop());
    }
    return postfixList.join(" ");
};

var postfixEval = function(postfixExpr) {
    const operandStack = [];
    const tokenList = postfixExpr.split(" ");

    for (const token of tokenList) {
        if (/\d/.test(token)) {
            operandStack.push(parseFloat(token));
        } else {
            const operand2 = operandStack.pop();
            const operand1 = operandStack.pop();
            const result = doMath(token, operand1, operand2);
            operandStack.push(result);
        }
    }
    return operandStack.pop();
};

var doMath = function(op, op1, op2) {
    if (op === "*") {
        return op1 * op2;
    } else if (op === "/" || op === '÷') {
        return op1 / op2;
    } else if (op === "+") {
        return op1 + op2;
    } else {
        return op1 - op2;
    }
};

var confrirmAndValidate = function(expr) {
    if (/[^0-9+*÷/()\s.\-]+/.test(expr) ||
        /^\s*[+*/÷].*/.test(expr) || /[+*/÷.-](\s*)$/.test(expr) ||
        /.*[0-9]\s+[0-9].*/.test(expr) ||
        /.*[0-9]+\.[0-9]+\.[0-9]+.*/.test(expr) ||
        /.*[0-9]\s*\(/.test(expr) || /.*\)\s*[0-9].*/.test(expr)) {
            return false;
    }

    if (!isValidParentheses(getParentheses(expr))) {
        return false;
    }

    return true;
};

var transformExpr = function(expr) {
    result = ""
    for (let i = 0; i < expr.length; i++) {
        if (/-\d/.test(expr[i] + expr[i+1])) {
            result += expr[i] + expr[i+1];
            i++;
        } else if (/[+*/÷()-]/.test(expr[i])) {
            result += ` ${expr[i]} `;
        } else {
            result += expr[i];
        }
    }

    result = result.replace(/\s\s+/g, ' ');
    result = result.trim();
    return result;
}