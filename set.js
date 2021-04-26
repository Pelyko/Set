const inputContainer = document.querySelector('#input-container');
const nameSelector = document.querySelector('#name-selector');
const modeSelector = document.querySelector('#mode-selector');
const detectorSelector = document.querySelector('#detector-selector');
const helperSelector = document.querySelector('#helper-selector');
const extendSelector = document.querySelector('#extend-selector');
const startButton = document.querySelector('#start-button');
const startContainer = document.querySelector('#start-container');
const gameContainer = document.querySelector('#game-container');
let objects = document.querySelectorAll('object');
const playersBox = document.querySelector('#playersBox');
const board = document.querySelector('#board');
const timerDiv = document.querySelector('#timer');
const findSet = document.querySelector('#find-set');
const showSet = document.querySelector('#show-set');
const dealNewCards = document.querySelector('#deal-new-cards');
const deckCounter = document.querySelector('#deck-counter');
const findSetDiv = document.querySelector('#find-set-div');
const endGame = document.querySelector('#end-game');
const winners = document.querySelector('#winners');
const moreOptions = document.querySelector('#more-options');
const difficultySelector = document.querySelector('#difficulty-selector');
const topScoreDiv = document.querySelector('#top-score-div');
const topScoreButton = document.querySelector('#top-score-button');
const onePlayerEasy = document.querySelector('#one-player-easy');
const onePlayerHard = document.querySelector('#one-player-hard');
const multiPlayerTen = document.querySelector('#multi-player-ten');

//let deck = ['3HgD','1HgP','1HgS','2HpS','1HpP','1HpS','1OgD','1OgP','1OpP','1OpS','1OrD','1OrP','1OrS','2OpP','2OpS','2SpD','2SpP','3OpS','3OpD','3OrD','3SpS','3SpD','3HgD','3HgP','3HgS','3HpD','3HrP']
let deck = [];
let score = [];
let deckIndex = 0;
let selectedCards = [];
let selectedPlayer;
let inArr;
let index;
let isThereSet;
let playerNames;
let setNum;

inputContainer.innerHTML += `<div class=row flex-edges><div class="sm-4 col">Játékos1:</div> <div class="sm-4 col"><input class='player-name' id='player1' type=text value=Játékos1></input></div></div>`;
modeSelector.value = 'gyakorlo';
gameContainer.setAttribute('style','display:none');
topScoreDiv.setAttribute('style','display:none');

function topScore(){    
    topScoreDiv.removeAttribute('style');
    startContainer.setAttribute('style','display:none');
    if(localStorage['onePlayerEasy']){

    }else{
        onePlayerEasy.innerHTML = "Még nincs eltárolt eredmény ebben a kategóriában.";
    }

    if(localStorage['onePlayerHard']){

    }else{
        onePlayerHard.innerHTML = "Még nincs eltárolt eredmény ebben a kategóriában.";
    }

    if(localStorage['lastTen']){
    
    }else{
        multiPlayerTen.innerHTML = "Még nincs eltárolt eredmény ebben a kategóriában.";
    }
}

topScoreButton.addEventListener('click',topScore);

function compareFunc(a,b){
    return -1*(a-b);
}

function goBack(){
    gameContainer.setAttribute('style','display:none;');
    startContainer.removeAttribute('style');
    endGame.removeAttribute('checked');
}

function end(){
    const playerNames = document.querySelectorAll('.player-name');
    endGame.setAttribute('checked','true');
    let scoreSet = new Set(score);
    scoreSet = Array.from(scoreSet);
    scoreSet.sort(compareFunc);
    let div;
    for(let i =0; i<scoreSet.length; i++){
        div = document.createElement('div');
        div.setAttribute('class','row');
        div.innerHTML += `${i+1}. helyezés (${scoreSet[i]} pont): `
        for(let j = 0; j<score.length; j++){
            if(score[j]===scoreSet[i]){
                div.innerHTML += ` ${playerNames[j].value}`
            }
        }
        winners.appendChild(div);
    }
    winners.innerHTML += '<div class="row"><button id="back-btn">Vissza</button><button id="new-game">Új játék</button></div>';
    const backBtn = document.querySelector('#back-btn');
    backBtn.addEventListener('click',goBack);
    const newGame = document.querySelector('#new-game');
    newGame.addEventListener('click',startFunc);
}

function setFinder(){
    gameCards = document.querySelectorAll('.game-card');
    isThereSet = false;
    let setExample = []
    for(let i = 0; i < gameCards.length-2; i++){
        for(let j = i+1; j < gameCards.length-1; j++){
            for(let k = j+1; k < gameCards.length; k++){
                if(isSet([gameCards[i].getAttribute('id'),gameCards[j].getAttribute('id'),gameCards[k].getAttribute('id')])){
                    isThereSet = true;
                    setExample = [gameCards[i].getAttribute('id'),gameCards[j].getAttribute('id'),gameCards[k].getAttribute('id')];
                }
            }
        }
    }
    if(isThereSet){
        return setExample;
    }else{
        return [];
    }
}

function setShower(){
    if(setFinder().length !== 0){
        for(let i = 0; i<gameCards.length; i++){
            if(setFinder().includes(gameCards[i].getAttribute('id'))){
                gameCards[i].setAttribute('style','border:2.5px solid #000099; border-radius: 5px;');
            }
        }
    }
}

function isThereSetFunc(){
    if(setFinder().length === 0){
        findSetDiv.innerHTML = 'Nincs set az asztalon';
    }else{
        findSetDiv.innerHTML = 'Van set az asztalon';
    }
}

function makeDeck(){
    deck = []
    deckIndex = 0;
    const nums = [1,2,3];
    const textures = ['H','O','S'];
    const colors = ['g','p','r'];
    const shapes = ['D','P','S'];
    let card;
    while(deck.length < 27){
        card = '';
        card += nums[Math.floor(Math.random()*3)];
        card += textures[Math.floor(Math.random()*3)];
        card += colors[Math.floor(Math.random()*3)];
        card += shapes[Math.floor(Math.random()*3)];
        if(!deck.includes(card)){
            deck.push(card);
        }
    }
}

function selectCard(event){
    inArr = false;
    index = 0;
    for(let i = 0; i<selectedCards.length; i++){
        if(selectedCards[i]===event.target.getAttribute('id')){
            index = i;
            inArr = true;
        }
    }
    if(inArr){
        selectedCards.splice(index,1);
        event.target.removeAttribute('style');
    }else{
        event.target.setAttribute('style','border:2.5px solid red; border-radius: 5px;');
        selectedCards.push(event.target.getAttribute('id'));
    }
}

function isSet(arr){
    let number = [];
    let texture = [];
    let color = [];
    let shape = [];
    for(let i = 0; i < arr.length; i++){
        number.push(arr[i].charAt(0));
        texture.push(arr[i].charAt(1));
        color.push(arr[i].charAt(2));
        shape.push(arr[i].charAt(3));
    }
    let numberSet = new Set(number);
    let textureSet = new Set(texture);
    let colorSet = new Set(color);
    let shapeSet = new Set(shape);
    if(setNum === 3){
        return numberSet.size !== 2 && colorSet.size !== 2 && shapeSet.size !== 2 && !arr.includes('null');
    }else{
        return numberSet.size !== 2 && numberSet.size !== 3 && colorSet.size !== 2 && colorSet.size !== 2 && shapeSet.size !== 2 && shapeSet.size !== 3 && textureSet.size !== 2 && textureSet.size !== 3 && !arr.includes('null');
    }
    

}

function dealCards(sC){
    for(let i = 0; i < sC.length; i++){
        for(let j = 0; j<gameCards.length; j++){
            if(gameCards[j].getAttribute('id')===sC[i]){
                if(deckIndex < deck.length){
                    gameCards[j].setAttribute('id',deck[deckIndex]);
                    gameCards[j].setAttribute('src',`icons/${deck[deckIndex]}.svg`);
                    gameCards[j].removeAttribute('style');
                    deckIndex++;
                }else{
                   gameCards[j].parentNode.innerHTML = '';
                }
            }
        }
    }
    deckCounter.innerHTML = `${deck.length - deckIndex} lap található a pakliban.`
}

let minute;
let time;
let interval;
function timer(){
    timerDiv.removeAttribute('style');
    timerDiv.innerHTML = `${10-time} másodperc`;
    time+=1;
    const playerBtns = document.querySelectorAll('.players');
    if(selectedCards.length === setNum){
        if(isSet(selectedCards)){
            dealCards(selectedCards);
            for(let i = 0; i<gameCards.length; i++){
                gameCards[i].removeEventListener('click',selectCard);
            }
            score[selectedPlayer]+=1;
            const playerBtns = document.querySelectorAll('.players');
            for(let i = 0; i<score.length; i++){
                playerBtns[i].setAttribute('popover-top',`Pontszám: ${score[i]}`);
                playerBtns[i].removeAttribute('disabled');
            }
            if(setFinder().length === 0 && deck.length - deckIndex === 0){
                end();
            }
        }else{
            for(let i = 0; i<gameCards.length; i++){
                gameCards[i].removeAttribute('style');
            }
            const players = document.querySelectorAll('.players');
            for(let i = 0; i<players.length; i++){
                if(players[i].id == selectedPlayer){
                    playerBtns[i].setAttribute('disabled','true');
                    score[i] -= 1;
                }
            }
            for(let i = 0; i<score.length; i++){
                playerBtns[i].setAttribute('popover-top',`Pontszám: ${score[i]}`);
            }
        }
        timerDiv.setAttribute('style','display:none');
        selectedCards = [];
        clearInterval(interval);
        const players = document.querySelectorAll('.players');
        for(let i = 0; i<players.length; i++){
            players[i].addEventListener('click',playerSelect);
        }
    }
    if(time >= 11){
        clearInterval(interval);
        timerDiv.setAttribute('style','display:none');
        for(let i = 0; i<gameCards.length; i++){
            gameCards[i].removeAttribute('style')
            gameCards[i].removeEventListener('click',selectCard);
        }
        const players = document.querySelectorAll('.players');
        for(let i = 0; i<players.length; i++){
            players[i].addEventListener('click',playerSelect);
            if(players[i].id == selectedPlayer){
                playerBtns[i].setAttribute('disabled','true');
                score[i] -= 1;
            }
        }
        for(let i = 0; i<score.length; i++){
            playerBtns[i].setAttribute('popover-top',`Pontszám: ${score[i]}`);
        }
        selectedCards = [];
    }
    let allDisabled = true;
    for(let i = 0; i<playerBtns.length; i++){
        if(playerBtns[i].getAttribute('disabled') === false || playerBtns[i].getAttribute('disabled') === null){
            allDisabled = false;
        }
    }
    if(allDisabled){
        for(let i = 0; i <playerBtns.length; i++){
            playerBtns[i].removeAttribute('disabled');
        }
    }
}

function playerSelect(event){
    findSetDiv.innerHTML = '';
    time = 0;
    interval = setInterval(timer,1000);
    selectedCards = [];
    gameCards = document.querySelectorAll('.game-card');
    for(let i = 0; i < gameCards.length; i++){
        gameCards[i].addEventListener('click',selectCard);
    }
    const players = document.querySelectorAll('.players');
    for(let i = 0; i<players.length; i++){
        players[i].removeEventListener('click',playerSelect);
    }
}

function onePlayerTimer(){
    time += 1;
    if(time > 59){
        time = 0;
        minute += 1;
    }
    if(minute > 0){
        timerDiv.innerHTML = `${minute} perc ${time} másodperc`;
    }else{
        timerDiv.innerHTML = `${time} másodperc`;
    }
    if(selectedCards.length === setNum){
        if(isSet(selectedCards)){
            dealCards(selectedCards);
            score[0] += 1;
        }else{
            score[0] -= 1;
        }
        playersBox.innerHTML = `${playerNames[0].value} pontszáma: ${score[0]}`
        selectedCards = []
        for(let i = 0; i<gameCards.length; i++){
            gameCards[i].removeAttribute('style');
        }
    }
    if(setFinder().length === 0 && deck.length - deckIndex === 0){
        clearInterval(interval);
        end();
    }
}

function startFunc(){
    endGame.removeAttribute('checked');
    if(difficultySelector.value === 'easy'){
        setNum = 3;
    }else{
        setNum = 4;
    }
    makeDeck();
    console.log(deck);
    let div;
    startContainer.setAttribute('style','display:none');
    gameContainer.removeAttribute('style');
    playerNames = document.querySelectorAll('.player-name');
    if(nameSelector.value === '1'){
        playersBox.innerHTML = `${playerNames[0].value} pontszáma: 0`
        timerDiv.removeAttribute('style');
        timerDiv.innerHTML = '0 másodperc';
        time = 0;
        minute = 0;
        interval = setInterval(onePlayerTimer,1000);
        selectedPlayer = 0;
        score.push(0);
    }else{
        const playerNames = document.querySelectorAll('.player-name');
        playersBox.innerHTML = '';
        for(let i = 0; i<Math.floor(nameSelector.value/2); i++){
            div = document.createElement('div');
            div.setAttribute('class','row');
            for(let j = 0; j<2; j++){
            div.innerHTML+=`<button popover-top="Pontszám: 0" class='players' id='${i*2+j}'>${playerNames[i*2+j].value}</button>`;
            }
            playersBox.appendChild(div);
        }
        if(nameSelector.value%2 !==0){
            div = document.createElement('div');
            div.setAttribute('class','row');
            div.innerHTML=`<button popover-top="Pontszám: 0" class='players' id='${nameSelector.value-1}'>${playerNames[nameSelector.value-1].value}</button>`;
            playersBox.appendChild(div);
        }
        const players = document.querySelectorAll('.players');
        for(let i = 0; i<players.length; i++){
            players[i].addEventListener('click',playerSelect);
        }
    }
    const players = document.querySelectorAll('.players');
    let innerDiv;
    board.innerHTML = '';
    for(let i = 0; i<3; i++){
        div = document.createElement('div');
        div.setAttribute('class','row');
        for(let j = 0; j<4; j++){
            innerDiv = document.createElement('div');
            innerDiv.setAttribute('class','col-3 col');
            innerDiv.innerHTML = `<img id=${deck[deckIndex]} class="game-card" src='icons/${deck[deckIndex]}.svg'></img>`;
            deckIndex++;
            div.appendChild(innerDiv);
        }
        board.appendChild(div);
    }
    if(nameSelector.value='1'){
        gameCards = document.querySelectorAll('.game-card');
        for(let i = 0; i < gameCards.length; i++){
            gameCards[i].addEventListener('click',selectCard);
        }
    }
    for(let i = 0; i<players.length; i++){
        score.push(0);
    }
    selectedCards = [];
    if(detectorSelector.value === 'nem'){
        findSet.setAttribute('disabled','true');
    }else{
        findSet.removeAttribute('disabled');
        findSet.addEventListener('click',isThereSetFunc);
    }
    if(helperSelector.value === 'nem'){
        showSet.setAttribute('disabled','true');
    }else{
        helperSelector.removeAttribute('disabled');
        showSet.addEventListener('click',setShower);
    }
    if(extendSelector.value === 'automatikus'){
        dealNewCards.setAttribute('disabled','true');
    }else{
        dealNewCards.removeAttribute('disabled');
    }
    deckCounter.innerHTML = `${deck.length - deckIndex} lap található a pakliban.`;
}

startButton.addEventListener('click',startFunc);

function modeHandler(){
    if(modeSelector.value === 'verseny'){
        detectorSelector.value = 'nem';
        helperSelector.value = 'nem';
        extendSelector.value = 'automatikus';
        detectorSelector.setAttribute('disabled',true);
        helperSelector.setAttribute('disabled',true);
        extendSelector.setAttribute('disabled',true);
        moreOptions.setAttribute('style','display:none');

    }else{
        detectorSelector.removeAttribute('disabled');
        helperSelector.removeAttribute('disabled');
        extendSelector.removeAttribute('disabled');
        moreOptions.removeAttribute('style');
    }
    
}

modeSelector.addEventListener('click',modeHandler);

function selectHandler(){
    inputContainer.innerHTML = '';
    for(let i = 0; i < nameSelector.value; i++){
        inputContainer.innerHTML += `<div class=row flex-edges><div class="sm-4 col">Játékos${i+1}:</div><div class="sm-4 col"> <input class='player-name' id='player${i+1}' type=text value=Játékos${i+1}></input></div></div>`
        
    }
}
nameSelector.addEventListener('change',selectHandler);
