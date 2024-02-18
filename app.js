const inputfield = document.getElementById('inputbox');
const listclass = document.getElementById('form');
const wheel = document.getElementById('wheel');
const superindex = document.getElementById('superindex');
const subindex = document.getElementById('subindex');
let wordsectors = document.getElementsByClassName('word')

let filteredWords = [];
let wordAngles = {};
let spinvalue = Math.ceil(Math.random() * 360);

const initialCircle = wheel.children[0]
let centerPos = []
centerPos[0] = parseInt(initialCircle.getAttribute('cx'))
centerPos[1] = parseInt(initialCircle.getAttribute('cy'))
const radius = parseInt(initialCircle.getAttribute('r'))


inputfield.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addWord();
        return;
    }
    
    const maxlength = inputfield.getAttribute('maxlength');
    const lengthOk = maxlength && inputfield.value.length < parseInt(maxlength);
    const updateChars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '-', '+'];
    if (lengthOk && updateChars.indexOf(e.key) >= 0) {
        e.preventDefault();
        const text = inputfield.value;
        const index = inputfield.selectionStart;
        inputfield.value = text.substring(0, index) + replace_text(e.key) + text.substring(index);;
    }
});
superindex.addEventListener("click", () => {
    subindex.checked = false;
});
subindex.addEventListener("click", () => {
    superindex.checked = false;
});

function showWinText() {
    document.getElementById("winningWord").innerHTML = winningWord();
}

function addWord() {
    const word = inputfield.value.trim();
    if (!word) return;
    filteredWords.push(word);
    inputfield.value = '';

    let wordsector = document.createElement('div');
    let textonsector = document.createElement('span');
    let button = document.createElement('button');
    let button_img = document.createElement('img');
    
    button_img.setAttribute('src', 'data/x-button.png');

    button.appendChild(button_img);
    button.setAttribute('id', 'x-button');
    button.addEventListener('click', removeWord);

    textonsector.innerHTML = word;
    
    wordsector.setAttribute('class', 'word');
    wordsector.appendChild(textonsector);
    wordsector.appendChild(button);

    listclass.appendChild(wordsector)
    genSectors(filteredWords);
}

function removeWord(event)
{
    const words = document.getElementsByClassName('word');
    for (let i = 0; i < words.length; i++) {
        const wordElement = words[i];
        if (event.target.parentElement.parentElement == wordElement) {
            wordElement.remove();
            filteredWords.splice(i, 1);
            genSectors(filteredWords);
            return;
        }
    }
}

function spin() {
    setTimeout(showWinText, 5000);
    spinvalue += Math.ceil(Math.random() * 3600);
    wheel.setAttribute("transform", "rotate(" + spinvalue + ")");
}

function replace_text(text)
{
    if (subindex.checked) {
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
    else if (superindex.checked) {
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

function winningWord(){
    const rotAngle = parseInt(wheel.getAttribute('transform').split('(')[1].split(')')[0]);

    for (const word in wordAngles){
        let startAngle = wordAngles[word][0] + rotAngle;
        let endAngle = wordAngles[word][1] + rotAngle;
        startAngle %= 360;
        endAngle %= 360;
        if (startAngle > endAngle){
            return word;
        }
    } 
}

function radians_to_degrees(radians)
{
  return radians * (180 / Math.PI);
}

function genSectors(filteredWords)
{
    const angle = (2 * Math.PI) / filteredWords.length;
    const elements = new Array();

    if (filteredWords.length == 1) {
        const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
        circle.setAttribute('cx', `${centerPos[0]}`);
        circle.setAttribute('cy', `${centerPos[1]}`);
        circle.setAttribute('r', `${radius}`);
        circle.setAttribute('fill', 'white');
        circle.setAttribute('stroke', 'black');
        elements.push(circle);
        elements.push(createLabel(filteredWords[0], Math.PI, 0, 1));
    } else {
        wordAngles = {};
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
            path.setAttribute('stroke', 'black');
            elements.push(path);
            elements.push(createLabel(filteredWords[i], startAngle, endAngle, filteredWords.length));
            wordAngles[filteredWords[i]] = [radians_to_degrees(startAngle), radians_to_degrees(endAngle)];
        }
    }
    wheel.replaceChildren(...elements);
}

function createLabel(label, angleStart, angleEnd, count)
{
    const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
    text.style = 'user-select: none; text-anchor: middle';
    text.style.fontSize = `${15 - Math.round(count / 30)}px`;
    text.setAttribute('x', `${centerPos[0]}`);
    text.setAttribute('y', `${centerPos[1] + 3}`);
    text.innerHTML = label;

    const angleMiddle = (angleEnd + angleStart) / 2 - Math.PI / 2;
    const rotation_value = radians_to_degrees(angleMiddle);
    let transform = "rotate(" + rotation_value + ")"
    if (count > 1) transform += " translate(30 0)"
    text.setAttribute("transform", transform);
    return text;
}
