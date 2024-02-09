// Nuevas variables relacionadas con los superEnemies
const superEnemies = [];
const superEnemySize = 160;
let superEnemySpeedX = 2; // Velocidad horizontal
let superEnemySpeedY = 2; // Velocidad vertical (inicial)

// Funciones relacionadas con los superEnemies
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

            // Ajustar la posición para evitar que desaparezca (puedes ajustar este valor según sea necesario)
            superEnemy.x = Math.min(canvas.width - superEnemy.width, Math.max(0, superEnemy.x));
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

function handlePlayerCollision(superEnemy) {
    // Reducir el puntaje al colisionar con el jugador
    score -= 1;

    // Empujar al jugador con una animación
    const pushSpeed = 5;
    if (player.x < superEnemy.x) {
        player.x -= pushSpeed;
    } else {
        player.x += pushSpeed;
    }

    // Puedes ajustar el empuje vertical según sea necesario
    player.y += pushSpeed / 2;
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
                // Eliminar la bala
                bullets.splice(j, 1);

                // Aumentar el puntaje al eliminar un superEnemy con una bala
                score += 5;

                // Reducir tamaño del superEnemy y verificar si ha recibido 5 balas
                superEnemy.width *= 0.8;
                superEnemy.height *= 0.8;

                if (superEnemy.width < superEnemySize / 5) {
                    // Si el superEnemy se hace demasiado pequeño, eliminarlo
                    superEnemies.splice(i, 1);

                    // Reproducir sonido de impacto contra enemigo
                    if (enemyHitSound) {
                        enemyHitSound.playbackRate = 8;  // Ajusta el valor según sea necesario (2 sería el doble de rápido)
                        enemyHitSound.play();
                    }
                }

                break; // Salir del bucle interno, ya que la bala solo puede colisionar con un superEnemy a la vez
            }
        }

        // Verificar colisión con el jugador
        if (
            player.x < superEnemy.x + superEnemy.width &&
            player.x + player.width > superEnemy.x &&
            player.y < superEnemy.y + superEnemy.height &&
            player.y + player.height > superEnemy.y
        ) {
            handlePlayerCollision(superEnemy);
        }
    }
}

// Llamar a esta función en tu gameloop
function updateSuperEnemies() {
    if (superEnemies.length === 0 && score%100===0) {
        createSuperEnemy();
    }

    moveSuperEnemies();
    drawSuperEnemies();
    checkSuperEnemyCollision();
}
