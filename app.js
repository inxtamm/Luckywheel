const inputfield = document.getElementById('input-box');
const list = document.getElementById('list');
const svg = document.getElementById('circle');

let spinvalue = Math.ceil(Math.random() * 360);

let centerPos = []
centerPos[0] = parseInt(svg.getAttribute('viewBox').split(' ')[2]) / 2
centerPos[1] = parseInt(svg.getAttribute('viewBox').split(' ')[3]) / 2
console.log(centerPos)


const radius = Math.min(centerPos[0], centerPos[1]) - 1;

function addWord() {
    const empty_circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');

    empty_circle.setAttribute('r', radius);
    empty_circle.style.position = 'absolute';
    empty_circle.setAttribute('cx', centerPos[0]);
    empty_circle.setAttribute('cy', centerPos[1]);
    empty_circle.setAttribute('fill', 'white');
    empty_circle.setAttribute('stroke', 'black');

    svg.appendChild(empty_circle);
    let words = inputfield.value.split('\n')
    const filteredWords = [];
    for (let word of words) {

        word = replace_text(word.trim());
        if (!word) continue;
        filteredWords.push(word);

        inputfield.value = filteredWords.join('\n') + '\n';
    }
    genSectors(filteredWords);

    console.log(filteredWords.length);
}

function spin() {
    svg.style.transform = "rotate(" + spinvalue + "deg)";
    spinvalue += Math.ceil(Math.random() * 3600);
}
function replace_text(text)
{
    return text.replace('^1', '¹')
        .replace('^2', '²')
        .replace('^3', '³')
        .replace('^4', '⁴')
        .replace('^5', '⁵')
        .replace('^6', '⁶')
        .replace('^7', '⁷')
        .replace('^8', '⁸')
        .replace('^9', '⁹')
        .replace('^0', '⁰')
        .replace('^+', '⁺')
        .replace('^-', '⁻')
        .replace('1', '₁')
        .replace('2', '₂')
        .replace('3', '₃')
        .replace('4', '₄')
        .replace('5', '₅')
        .replace('6', '₆')
        .replace('7', '₇')
        .replace('8', '₈')
        .replace('9', '₉')
        .replace('0', '₀');
}
function genSectors(filteredWords)
{
    const angle = (2 * Math.PI) / filteredWords.length;
    const elements = new Array(filteredWords.length * 2);

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
    addLabels(filteredWords, elements)
    svg.replaceChildren(...elements)
}
function addLabels(filteredWords, elements)
{
    if (filteredWords.length == 1) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.style = 'user-select: none;'
        text.setAttribute('x', `${centerPos[0]}`);
        text.setAttribute('y', `${centerPos[1] + 3}`);
        text.setAttribute('text-anchor', 'middle');
        text.innerHTML = filteredWords[0];
        elements.push(text);
        return;
    }

    for (let i = 0; i < filteredWords.length; i++) {
        const text = document.createElementNS('http://www.w3.org/2000/svg', 'text');
        text.setAttribute('x', `${centerPos[0] + 20}`);
        text.setAttribute('y', `${centerPos[1] + 3}`);

        text.innerHTML = filteredWords[i];
        text.style = 'transform-origin: center; text-align: center; user-select: none;'
        text.style.fontSize = Math.min(70, (((radius / filteredWords.length) / radius) * 360)) + '%';
        text.style.maxWidth = radius + 'px';

        console.log(radius - (radius / filteredWords.length - text.textLength.value))

        let rotation_value = (360 / filteredWords.length) * i
        text.style.transform = "rotate(" + rotation_value + "deg)";

        if (filteredWords.length % 4 == 0) {
            text.style.transform = "rotate(" + (rotation_value + (45 / (filteredWords.length / 4))) + "deg)";
        }
        if (filteredWords.length == 3 | filteredWords.length == 9) {
            text.style.transform = "rotate(" + (rotation_value - 30) + "deg)";
        }
        if (filteredWords.length == 5) {
            text.style.transform = "rotate(" + (rotation_value + 20) + "deg)";
        }

        //console.log("i=" + i + ", wordIndex=" + filteredWords.length + ", transform=" + text.style.transform);
        elements.push(text);
    }
}