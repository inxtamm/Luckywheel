const inputfield = document.getElementById('input-box');
const listclass = document.getElementById('form');
const wheel = document.getElementById('wheel');
const dropdown = document.getElementById('indx-dropdown');
let wordsectors = document.getElementsByClassName('word')

let filteredWords = [];
let spinvalue = Math.ceil(Math.random() * 360);

const initial_circle = wheel.children[0]
let centerPos = []
centerPos[0] = parseInt(initial_circle.getAttribute('cx'))
centerPos[1] = parseInt(initial_circle.getAttribute('cy'))
const radius = parseInt(initial_circle.getAttribute('r'))


inputfield.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addWord();
    } else if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '+'].indexOf(e.key) >= 0) {
        e.preventDefault();
        let text = inputfield.value;
        let index = inputfield.selectionStart;
        text = text.split('');
        text.splice(index, 0, replace_text(e.key));
        text = text.join('');
        inputfield.value = text;
    }
});

function addWord() {
    let words = inputfield.value.split('\n')
    for (let word of words) {

        word = replace_text(word.trim());
        if (!word) continue;
        filteredWords.push(word);

        inputfield.value = '';

        let wordsector = document.createElement('div');
        let textonsector = document.createElement('text');
        let button = document.createElement('button');
        let button_img = document.createElement('img');
        
        button_img.setAttribute('src', 'data/x-button.png');

        button.appendChild(button_img);
        button.setAttribute('id', 'x-button');
        button.setAttribute('onclick', 'removeWord(' + '"' + word + '"' + ')');

        textonsector.innerHTML = word;
        
        wordsector.setAttribute('class', 'word');
        wordsector.appendChild(textonsector);
        wordsector.appendChild(button);

        listclass.appendChild(wordsector)
    }
    genSectors(filteredWords);
}

function removeWord(text)
{
    filteredWords.splice(filteredWords.indexOf(text), 1);
    for (let i = 0; i < wordsectors.length; i++) {
        if (text ==  wordsectors[i].children[0].innerHTML) {
            listclass.removeChild(wordsectors[i]);
            break;
        }
    }
    genSectors(filteredWords);
}

function spin() {
    wheel.setAttribute("transform", "rotate(" + spinvalue + ")");
    spinvalue += Math.ceil(Math.random() * 3600);
}

function replace_text(text)
{
    if (dropdown.value == 'sub') {
        return text.replace(/1/g, '₁')
        .replace(/2/g, '₂')
        .replace(/3/g, '₃')
        .replace(/4/g, '₄')
        .replace(/5/g, '₅')
        .replace(/6/g, '₆')
        .replace(/7/g, '₇')
        .replace(/8/g, '₈')
        .replace(/9/g, '₉')
        .replace(/0/g, '₀');
    }
    else if (dropdown.value == 'sup') {
        return text.replace('1', '¹')
        .replace('2', '²')
        .replace('3', '³')
        .replace('4', '⁴')
        .replace('5', '⁵')
        .replace('6', '⁶')
        .replace('7', '⁷')
        .replace('8', '⁸')
        .replace('9', '⁹')
        .replace('0', '⁰')
        .replace('+', '⁺')
        .replace('-', '⁻');
    }
    else {
        return text;
    }
}

function genSectors(filteredWords)
{
    const angle = (2 * Math.PI) / filteredWords.length;
    const elements = new Array();

    if (filteredWords.length <= 1) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', `${centerPos[0]}`);
        circle.setAttribute('cy', `${centerPos[1]}`);
        circle.setAttribute('r', `${radius}`);
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', 'black');
        elements.push(circle);
    } else {
        for (let i = 0; i < filteredWords.length; i++) {
            const startAngle = i * angle;
            const endAngle = (i + 1) * angle;
            
            const startX = centerPos[0] + Math.sin(startAngle) * radius;
            const startY = centerPos[1] - Math.cos(startAngle) * radius;
            const endX = centerPos[0] + Math.sin(endAngle) * radius;
            const endY = centerPos[1] - Math.cos(endAngle) * radius;
    
            const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
            path.setAttribute('d', `M${centerPos[0]},${centerPos[1]} L${startX},${startY} A${radius},${radius} 0 0,1 ${endX},${endY} Z`);
            path.setAttribute('fill', 'white');
            path.setAttribute('stroke', 'black')
            elements.push(path);
        }
    }
    addLabels(filteredWords, elements);
    wheel.replaceChildren(...elements);
}

function addLabels(filteredWords, elements)
{
    if (filteredWords.length == 1) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.style = 'user-select: none; text-anchor: middle'
        text.setAttribute('x', `${centerPos[0]}`);
        text.setAttribute('y', `${centerPos[1] + 3}`);
        text.innerHTML = filteredWords[0];
        elements.push(text);
        return;
    }
    for (let i = 0; i < filteredWords.length; i++) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', `${centerPos[0]}`);
        text.setAttribute('y', `${centerPos[1]}`);

        text.innerHTML = filteredWords[i];

        let rotation_value = (360 / filteredWords.length) * i;
        text.setAttribute("transform", "rotate(" + rotation_value + ") translate(15 0)");
        elements.push(text);

        if (filteredWords.length % 4 == 0) {
            text.setAttribute("transform", "rotate(" + (rotation_value + (45 / (filteredWords.length / 4))) + ") translate(15 0)");
        }
        if (filteredWords.length == 3 | filteredWords.length == 9) {
            text.setAttribute("transform", "rotate(" + (rotation_value - 30) + ") translate(15 0)");
        }
        if (filteredWords.length == 5) {
            text.setAttribute("transform", "rotate(" + (rotation_value + 20) + ") translate(15 0)");
        }
    }
}