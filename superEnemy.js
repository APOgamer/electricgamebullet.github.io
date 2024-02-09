// superEnemy.js
const superEnemies = [];
const superEnemySize = 50;
const superEnemySpeedX = 5; // Velocidad horizontal
let superEnemySpeedY = 5; // Velocidad vertical (inicial)

function createSuperEnemy() {
    const superEnemy = {
        x: 0,
        y: Math.random() * (canvas.height - superEnemySize),
        width: superEnemySize,
        height: superEnemySize,
        color: 'white',
        canBounce: true,
    };
    superEnemies.push(superEnemy);
}

function moveSuperEnemies() {
    for (let i = superEnemies.length - 1; i >= 0; i--) {
        const superEnemy = superEnemies[i];
        superEnemy.x += superEnemySpeedX;
        superEnemy.y += superEnemySpeedY;

        // Rebotar en los bordes horizontales
        if (superEnemy.x + superEnemy.width > canvas.width || superEnemy.x < 0) {
            superEnemySpeedX *= -1;
        }

        // Rebotar en los bordes verticales
        if (superEnemy.y + superEnemy.height > canvas.height || superEnemy.y < 0) {
            superEnemySpeedY *= -1;
        }

        // Eliminar superEnemy que salen de la pantalla
        if (superEnemy.y > canvas.height || superEnemy.y < -superEnemy.height) {
            superEnemies.splice(i, 1);
        }
    }
}

function drawSuperEnemies() {
    for (const superEnemy of superEnemies) {
        ctx.fillStyle = superEnemy.color;
        ctx.fillRect(superEnemy.x, superEnemy.y, superEnemy.width, superEnemy.height);
    }
}

function handleBulletCollision(superEnemy) {
    // Crear nuevas balas rojas
    const redBullets = [];
    for (let i = 0; i < 5; i++) {
        const redBullet = {
            x: superEnemy.x + superEnemy.width / 2,
            y: superEnemy.y + superEnemy.height / 2,
            radius: 5,
            color: 'red',
            speedX: (Math.random() - 0.5) * 5,
            speedY: Math.random() * 5 + 2,
        };
        redBullets.push(redBullet);
    }

    // Agregar las nuevas balas al arreglo de balas
    bullets.push(...redBullets);
}

function checkSuperEnemyCollision() {
    for (let i = superEnemies.length - 1; i >= 0; i--) {
        const superEnemy = superEnemies[i];

        for (let j = bullets.length - 1; j >= 0; j--) {
            const bullet = bullets[j];

            if (
                bullet.x < superEnemy.x + superEnemy.width &&
                bullet.x + bullet.radius > superEnemy.x &&
                bullet.y < superEnemy.y + superEnemy.height &&
                bullet.y + bullet.radius > superEnemy.y
            ) {
                if (superEnemy.canBounce) {
                    handleBulletCollision(superEnemy);
                    superEnemies.splice(i, 1);
                    score -= 10; // Reducir el puntaje al colisionar con el superEnemy
                }
            }
        }
    }
}

// Llamar a esta función en tu gameloop
function updateSuperEnemies() {
    if (score >= 100 && score % 100 === 0 && superEnemies.length === 0) {
        createSuperEnemy();
    }

    moveSuperEnemies();
    drawSuperEnemies();
    checkSuperEnemyCollision();
}
