// STATE
let currentInputArray = [];

let prevInput       = null;
let currentInput    = null;
let currentOperator = null;
let prevOperator    = null;
let sum             = null;

// HTML

// -- operators

const add       = document.getElementById("add");
const subtract  = document.getElementById("subtract");
const multiply  = document.getElementById("multiply");
const divide    = document.getElementById("divide");

const currentOperation      = document.querySelector(".current-operation");
const currentInputContainer = document.querySelector(".current-input");
const calculatorNumbers     = document.querySelector(".calculator-numbers");

for(let i = 3; i >= 0; i--){
    const newRowDiv = document.createElement("div");
    newRowDiv.innerHTML = 
    `
        <button class="calculator-number"onclick="pressNumber(${i*3-2})" >${i*3-2}</button>
        <button class="calculator-number"onclick="pressNumber(${i*3-1})" >${i*3-1}</button>
        <button class="calculator-number"onclick="pressNumber(${i*3})"   >${i*3}</button>
    `;
    if(i === 0){
    newRowDiv.innerHTML = 
    `
        <button id="clear"  class="calculator-number" onclick="allClear()">AC</button>
        <button             class="calculator-number" onclick="pressNumber(0)">0</button>
        <button id="equals" class="calculator-number">=</button>
    `;
    }
    calculatorNumbers.appendChild(newRowDiv);
}

// EVENT LISTENERS

add.addEventListener('click', e => {
    const number = currentInput;
    renderOperator(number,'+');
    
})

subtract.addEventListener('click', e => {
    const number = currentInput;
    renderOperator(number,'-');
})

multiply.addEventListener('click', e => {
    const number = currentInput;
    renderOperator(number,'*');
})

divide.addEventListener('click', e => {
    const number = currentInput;
    renderOperator(number,'/');
})


// FUNCTIONS

function pressNumber(n){
    currentInputArray.push(n);
    let concatInput = '';
    currentInputArray.forEach((n, i) => {
        concatInput+=n;
    })
    const parseConcat   = parseInt(concatInput);
    currentInput        = parseConcat;
    renderInput();
}

function renderInput(){
    currentInputContainer.value = currentInput
}

function allClear(){
    currentInputArray = [];

    prevInput       = null;
    currentInput    = null;
    prevOperator    = null;
    currentOperator = null;
    sum             = null;

    currentInputContainer.value     = '';
    currentOperation.value          = '';

}

function renderOperator(number, operator){
    prevOperator    = currentOperator;
    currentOperator = operator;

    switch(operator){
        case('+'):
            if(sum === null){
                if(prevInput === null && currentInput !== null){
                    prevInput  = number;
                }else if(prevInput !== null && currentInput !== null){
                    sum        += number;
                    prevInput  = number;
                    currentInputContainer.value = `${sum}`
                }
            }else{
                if(currentInput !== null){
                    sum        += currentInput;
                    prevNumber = sum;
                    currentInputContainer.value = `${sum}`
                }
            }
            break;
        case('-'):
            break;
        case('*'):
            break;
        case('/'):
            break;
    }
    currentInput = null;
    currentInputArray = [];
    renderNewContent(number, operator);
}

function renderNewContent(number, operator)
{   
    if(sum === null){
        currentOperation.value = `${prevInput} ${currentOperator}`
        currentInputContainer.value = `${prevInput}`

    }else{
        currentOperation.value = `${prevInput} ${currentOperator}`
        currentInputContainer.value = `${sum}`
    }

}