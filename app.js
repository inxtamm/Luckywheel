const inputfield = document.getElementById('input-box');
const list = document.getElementById('list');


let circle = document.getElementById('ring');


let wheel = document.querySelector('.circle');
let value = Math.ceil(Math.random() * 3600);
let maxwords = 1;
let wordindex = 1

function addWord(){
    if (inputfield.value === '') {
        alert("Peab kirjutama midagi!");
    }
    else {
        let words = inputfield.value.split('\n')
        for (let word of words) {

            console.log(word);
            word = word.trim();
            if (!word) continue;

            let addedWord = document.createElement('li');
            let circlesector = document.createElement('div');
            let circlesectorcontent = document.createElement('span');


            addedWord.innerHTML = word;
            circlesectorcontent.innerHTML = word;


            list.appendChild(addedWord);
            circlesector.setAttribute('class', 'textoncircle')
            circlesector.setAttribute('style', '--i:' + (wordindex) + ';')
            
            circlesector.appendChild(circlesectorcontent);
            circle.appendChild(circlesector);
            maxwords = Math.max(maxwords, wordindex)
            wordindex += 1;
        }
        circle.setAttribute('style', '--words:' + maxwords + ';')
    }
    inputfield.value = '';
}

function spin() 
{
    wheel.style.transform = "rotate(" + value + "deg)";
    value += Math.ceil(Math.random() * 3600);
}