// script.js
const gameArea = document.getElementById('game-area');
const startButton = document.getElementById('start-button');
const scoreDisplay = document.getElementById('score');

let blocks = [];
let speed = 1;  // Decreased speed for slower blocks
let direction = 1;
let score = 0;
let gameActive = false;
let playerName = '';

startButton.addEventListener('click', () => {
    if (!gameActive) {
        playerName = prompt("Please enter your name to start the game:");
        if (playerName) {
            startGame();
        }
    }
});

document.addEventListener('keyup', handleKeyPress);

function handleKeyPress(event) {
    if (event.key === ' ' && gameActive) {
        stopBlock();
    }
}

function startGame() {
    resetGame();
    gameActive = true;
    addBlock();
    startButton.style.display = 'none';  // Hide the start button during the game
}

function resetGame() {
    blocks.forEach(block => block.remove());
    blocks = [];
    speed = 1;  // Slow down the speed
    direction = 1;
    score = 0;
    scoreDisplay.textContent = 'Score: 0';
    gameActive = true;
}

function addBlock() {
    const newBlock = document.createElement('div');
    newBlock.classList.add('block');

    const width = blocks.length === 0 ? 60 : blocks[blocks.length - 1].offsetWidth;
    newBlock.style.width = `${width}px`;
    newBlock.style.height = '12px';
    newBlock.style.position = 'absolute';
    newBlock.style.backgroundColor = getRandomColor();

    // Position the new block at the top of the game area on the left
    newBlock.style.top = `${300 - blocks.length * 12}px`;
    newBlock.style.left = '0px';

    gameArea.appendChild(newBlock);
    blocks.push(newBlock);

    moveBlock(newBlock);
}

function moveBlock(block) {
    block.moveInterval = setInterval(() => {
        const left = parseInt(block.style.left);
        if (left + block.offsetWidth >= gameArea.offsetWidth || left <= 0) {
            direction *= -1;
        }
        block.style.left = `${left + direction * speed}px`;
    }, 15);  // Increased interval for slower block movement
}

function stopBlock() {
    const currentBlock = blocks[blocks.length - 1];
    clearInterval(currentBlock.moveInterval);

    if (blocks.length > 1) {
        const previousBlock = blocks[blocks.length - 2];
        const overlap = calculateOverlap(currentBlock, previousBlock);

        if (overlap <= 0) {
            gameOver();
            return;
        }

        currentBlock.style.width = `${overlap}px`;
        currentBlock.style.left = `${Math.max(currentBlock.offsetLeft, previousBlock.offsetLeft)}px`;
    }

    score++;
    scoreDisplay.textContent = `Score: ${score}`;
    speed += 0.1;  // Increase speed slightly with each block placed

    addBlock();
}

function calculateOverlap(current, previous) {
    const currentLeft = current.offsetLeft;
    const currentRight = currentLeft + current.offsetWidth;
    const previousLeft = previous.offsetLeft;
    const previousRight = previousLeft + previous.offsetWidth;

    return Math.min(currentRight, previousRight) - Math.max(currentLeft, previousLeft);
}

function gameOver() {
    gameActive = false;
    alert(`${playerName}, you did great! Game Over! Your final score is ${score}.`);
    startButton.style.display = 'block';  // Show the start button again
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
