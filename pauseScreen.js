// pauseScreen.js

const pauseScreen = document.getElementById('pauseScreen');
const resumeButton = document.getElementById('resumeButton');
const restartButton = document.getElementById('restartButton');
function drawPauseScreen() {
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

    // Fondo oscuro semitransparente
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Caja de pausa
    ctx.fillStyle = '#fff';
    ctx.fillRect(centerX - 150, centerY - 75, 300, 150);

    // Texto de pausa
    ctx.fillStyle = '#000';
    ctx.font = '30px Arial';
    ctx.fillText('Juego Pausado', centerX - 80, centerY - 20);
    ctx.font = '20px Arial';
    ctx.fillText('Presiona "continue" para continuar', centerX - 135, centerY + 20);
}
function showPauseScreen() {
    drawPauseScreen();
    document.removeEventListener('keydown', handleConsoleInput); // Desactivar la entrada de la consola durante la pausa
}

function hidePauseScreen() {
    isGamePaused=false;
    document.addEventListener('keydown', handleConsoleInput); // Reactivar la entrada de la consola al reanudar el juego
}

resumeButton.addEventListener('click', () => {
    hidePauseScreen();
    resumeGame();
});

restartButton.addEventListener('click', () => {
    hidePauseScreen();
    resetGame();
});

