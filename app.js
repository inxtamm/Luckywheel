const inputfield = document.getElementById('input-box');
const list = document.getElementById('list');
const circle1 = document.getElementById('ring1');
const circle = document.getElementById('ring');

words = [];

function addWord(){
    if (inputfield.value === '') {
        alert("Peab kirjutama midagi!");
    }
    else {
        let addedWord = document.createElement('li');
        addedWord.innerHTML = inputfield.value;
        list.appendChild(addedWord);
        words.push(inputfield.value);
        let circleText = document.createElement('span')
        let content = document.createTextNode(inputfield.value);
        circleText.appendChild(content);
        circle.appendChild(circleText);
        console.log(circle1);
    }
    inputfield.value = '';
}
