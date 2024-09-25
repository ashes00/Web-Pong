const canvas = document.getElementById('pongCanvas');
const ctx = canvas.getContext('2d');

canvas.width = 800;
canvas.height = 400;

const paddleWidth = 10;
const paddleHeight = 100;
const ballSize = 10;

let leftPaddleY = (canvas.height - paddleHeight) / 2;
let rightPaddleY = (canvas.height - paddleHeight) / 2;
let ballX = canvas.width / 2;
let ballY = canvas.height / 2;
let ballSpeedX = 5;
let ballSpeedY = 5;

let player1Score = 0;
let player2Score = 0;
let misses = 0;

const player1ScoreElement = document.getElementById('player1Score');
const player2ScoreElement = document.getElementById('player2Score');
const gameOverElement = document.getElementById('gameOver');
const restartButton = document.getElementById('restartButton');

document.addEventListener('mousemove', (event) => {
    const mouseY = event.clientY - canvas.getBoundingClientRect().top;
    leftPaddleY = mouseY - paddleHeight / 2;

    // Prevent the left paddle from going out of bounds
    if (leftPaddleY < 0) leftPaddleY = 0;
    if (leftPaddleY + paddleHeight > canvas.height) leftPaddleY = canvas.height - paddleHeight;
});

function draw() {
    // Clear the canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw paddles
    ctx.fillStyle = 'white';
    ctx.fillRect(0, leftPaddleY, paddleWidth, paddleHeight);
    ctx.fillRect(canvas.width - paddleWidth, rightPaddleY, paddleWidth, paddleHeight);

    // Draw ball
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballSize, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();

    // Update scores
    player1ScoreElement.textContent = player1Score;
    player2ScoreElement.textContent = player2Score;
}

function update() {
    if (misses >= 5) {
        gameOverElement.classList.remove('hidden');
        return;
    }

    // Move the ball
    ballX += ballSpeedX;
    ballY += ballSpeedY;

    // Bounce off top and bottom walls
    if (ballY + ballSize > canvas.height || ballY - ballSize < 0) {
        ballSpeedY = -ballSpeedY;
    }

    // Paddle collision
    if (ballX - ballSize < paddleWidth && ballY > leftPaddleY && ballY < leftPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }
    if (ballX + ballSize > canvas.width - paddleWidth && ballY > rightPaddleY && ballY < rightPaddleY + paddleHeight) {
        ballSpeedX = -ballSpeedX;
    }

    // Reset ball if it goes out of bounds
    if (ballX + ballSize < 0) {
        player2Score++;
        misses++;
        resetBall();
    }
    if (ballX - ballSize > canvas.width) {
        player1Score++;
        misses++;
        resetBall();
    }

    // Simple AI for right paddle with randomness
    if (Math.random() < 0.8) {
        if (rightPaddleY + paddleHeight / 2 < ballY) {
            rightPaddleY += 3; // Adjust speed for AI
        } else {
            rightPaddleY -= 3;
        }
    }

    // Prevent the right paddle from going out of bounds
    if (rightPaddleY < 0) rightPaddleY = 0;
    if (rightPaddleY + paddleHeight > canvas.height) rightPaddleY = canvas.height - paddleHeight;
}

function resetBall() {
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
    ballSpeedX = -ballSpeedX; // Change direction
}

function gameLoop() {
    draw();
    update();
    requestAnimationFrame(gameLoop);
}

restartButton.addEventListener('click', () => {
    // Reset scores and misses
    player1Score = 0;
    player2Score = 0;
    misses = 0;
    gameOverElement.classList.add('hidden');
    resetBall();
    gameLoop();
});

// Start the game loop
gameLoop();

