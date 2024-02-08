
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const bullets = [];
const bulletSpeed = 8;
const bulletCooldown = 20;
let bulletCooldownCounter = 0;
let bulletsFired = 0; // Contador de balas disparadas
const bulletsPerReload = 10; // Cantidad de balas por recarga
const reloadSound = new Audio('sounds/reload.mp3'); // Reemplaza 'path/to/reload_sound.mp3' con la ruta correcta de tu sonido
const boomSound = new Audio('sounds/boom.mp3'); // Reemplaza 'path/to/reload_sound.mp3' con la ruta correcta de tu sonido
const shootSound = new Audio('sounds/shoot.mp3');
const enemyHitSound = new Audio('sounds/bullethit.mp3');
const defeatSound = new Audio('sounds/defeat.mp3');
const timestopSound = new Audio('sounds/time.mp3');

// Reproducir música al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    backgroundMusic.play();
});
let timeCounter = 0;  // Agregamos un contador de tiempo
let canShoot = true; // Variable para controlar si se puede disparar
// Nuevas variables para la habilidad de detener el tiempo
let isTimeStopped = false;
const timeStopCooldownDuration = 400; // Duración del cooldown en frames (ajusta según sea necesario)
let timeStopCooldown = 0;

let superFastEnemyTimer = 0; // Nuevo temporizador para el superFastEnemy

document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'w':
            shootBullet(0, -1); // Arriba
            break;
        case 's':
            shootBullet(0, 1); // Abajo
            break;
        case 'a':
            shootBullet(-1, 0); // Izquierda
            break;
        case 'd':
            shootBullet(1, 0); // Derecha
            break;
        case 'q':
            activateTimeStop();
            break;
    }
});
function activateTimeStop() {
    // Verificar si la habilidad está en cooldown
    if (timeStopCooldown === 0) {
        isTimeStopped = true;
        
        // Iniciar el cooldown
        timeStopCooldown = timeStopCooldownDuration;
        if (timestopSound) {
            timestopSound.volume = 0.3;  // Ajusta el valor según sea necesario (0.0 a 1.0)
            //timestopSound.playbackRate = 16;  // Ajusta el valor según sea necesario (2 sería el doble de rápido)
            timestopSound.play();
        }
        // Mostrar el estado del cooldown de la habilidad de detener el tiempo
        console.log('Habilidad de detener el tiempo activada');

        // Después de 3 segundos, reactivar el tiempo
        setTimeout(() => {
            isTimeStopped = false;
        }, 3000);
    }
}

function shootBullet(directionX, directionY) {
    if (canShoot) {
        const bullet = {
            x: player.x + player.width / 2,
            y: player.y + player.height / 2,
            radius: 5,
            color: 'orange',
            speedX: directionX * bulletSpeed,
            speedY: directionY * bulletSpeed,
        };
        bullets.push(bullet);

        // Incrementar el contador de balas disparadas
        bulletsFired++;

        // Verificar si se alcanzó la cantidad de balas por recarga
        if (bulletsFired >= bulletsPerReload) {
            canShoot = false;
            reloadBullets();
        }

        // Reproducir sonido de disparo con volumen reducido y duración acelerada
        if (shootSound) {
            shootSound.volume = 0.3;  // Ajusta el valor según sea necesario (0.0 a 1.0)
            shootSound.playbackRate = 16;  // Ajusta el valor según sea necesario (2 sería el doble de rápido)
            shootSound.play();
        }
    }
}

function reloadBullets() {
    // Reproducir sonido de recarga
    reloadSound.play();

    // Reiniciar el contador de balas disparadas
    bulletsFired = 0;

    // Esperar unos segundos antes de poder disparar nuevamente
    setTimeout(() => {
        canShoot = true;
    }, 5000); // 5000 milisegundos (5 segundos)
    setTimeout(() => {
        bulletCooldownCounter = 0;
    }, 2000); // Ajusta el tiempo de espera en milisegundos según sea necesario
}


function moveBullets() {
    for (let i = bullets.length - 1; i >= 0; i--) {
        const bullet = bullets[i];
        //!isTimeStopped
        if (true) {
            bullet.x += bullet.speedX;
            bullet.y += bullet.speedY;
        }

        // Eliminar balas que salen de la pantalla
        if (
            bullet.x < 0 || bullet.x > canvas.width ||
            bullet.y < 0 || bullet.y > canvas.height
        ) {
            bullets.splice(i, 1);
        }
    }
}

function drawBullets() {
    for (const bullet of bullets) {
        ctx.fillStyle = bullet.color;
        ctx.beginPath();
        ctx.arc(bullet.x, bullet.y, bullet.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function updateBulletCooldown() {
    // Reducir el cooldown de disparo si es mayor que cero
    if (bulletCooldownCounter > 0) {
        bulletCooldownCounter--;
    }
    // Reducir el cooldown de la habilidad de detener el tiempo si es mayor que cero
    if (timeStopCooldown > 0) {
        timeStopCooldown--;
    }    
}
// Jugador
const player = {
    x: 350,
    y: 270,
    width: 30,
    height: 30,
    color: 'blue',
    speed: 40
};

// Lista de enemigos, muros e imitadores
let entities = [];
let skillCooldown = 0; // Tiempo de cooldown para la habilidad
const skillCooldownDuration = 300; // Duración del cooldown en frames (5 segundos a 60 fps)

// Variables relacionadas con la creación de enemigos, muros e imitadores
let enemyCreationFrequency = 50; // Controla la frecuencia de creación de enemigos
let enemyCreationCounter = 0;

let score = 1;



// Manejo de eventos del teclado
document.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            player.y -= player.speed;
            break;
        case 'ArrowDown':
            player.y += player.speed;
            break;
        case 'ArrowLeft':
            player.x -= player.speed;
            break;
        case 'ArrowRight':
            player.x += player.speed;
            break;
        case 'e':
            activateSkill();
            break;
    }
});

const explosionParticles = [];
const explosionRadius = 140; // Ajusta el radio de la explosión

function activateSkill() {
  

    // Verificar si la habilidad está en cooldown
    if (skillCooldown === 0) {
        boomSound.play();
        // Crear partículas de explosión alrededor del punto donde el jugador está
        for (let i = 0; i < 360; i += 10) {
            const angle = (i * Math.PI) / 180;
            const particle = {
                x: player.x + player.width / 2 + Math.cos(angle) * explosionRadius,
                y: player.y + player.height / 2 + Math.sin(angle) * explosionRadius,
                radius: 5,
                color: 'orange',
                speed: 5,
            };
            explosionParticles.push(particle);
        }

        // Eliminar entidades cercanas
        for (let j = entities.length - 1; j >= 0; j--) {
            const entity = entities[j];
            const distance = Math.sqrt(Math.pow(player.x - entity.x, 2) + Math.pow(player.y - entity.y, 2));

            if (distance <= explosionRadius + entity.width) {
                entities.splice(j, 1);
                score += 2; // Aumentar el puntaje al eliminar una entidad cercana
            }
        }

        // Iniciar el cooldown
        skillCooldown = skillCooldownDuration;
    }
}

function moveExplosionParticles() {
    for (let i = explosionParticles.length - 1; i >= 0; i--) {
        const particle = explosionParticles[i];
        particle.x += Math.cos(Math.atan2(player.y - particle.y, player.x - particle.x)) * particle.speed;
        particle.y += Math.sin(Math.atan2(player.y - particle.y, player.x - particle.x)) * particle.speed;
        particle.radius -= 0.1;

        if (particle.radius <= 0) {
            explosionParticles.splice(i, 1);
        }
    }
}

function drawExplosionParticles() {
    for (const particle of explosionParticles) {
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, 2 * Math.PI);
        ctx.fill();
    }
}

function generateEntity() {
    const randomValue = Math.random() * 100; // Multiplicar por 100 para obtener un valor entre 0 y 100
    let entityType, entityWidth, entityHeight, entitySpeed, entityColor;

    if (randomValue < 40) {
        entityType = 'enemy';
        entityWidth = 30;
        entityHeight = 30;
        entitySpeed = 2;
        entityColor = 'red';
    } else if (randomValue < 65) {
        entityType = 'wall';
        entityWidth = 100;
        entityHeight = 150;
        entitySpeed = 1;
        entityColor = 'green';
    } else if (randomValue < 85) {
        entityType = 'imitator';
        entityWidth = 4;
        entityHeight = 4;
        entitySpeed = 1;
        entityColor = 'black';
    } else {
        entityType = 'superFastEnemy';
        entityWidth = 20;
        entityHeight = 20;
        entitySpeed = 8;
        entityColor = 'purple';
    }

    return {
        type: entityType,
        x: 0,
        y: Math.random() * (canvas.height - entityHeight),
        width: entityWidth,
        height: entityHeight,
        color: entityColor,
        speed: entitySpeed
    };
}


function moveSuperFastEnemy(entity) {
    // Atacar
    entity.color = 'purple'; // Restablecer el color a morado
    entity.x += 10; // Puedes ajustar la velocidad según sea necesario

    if (entity.x > canvas.width) {
        // Reiniciar posición al llegar al borde derecho
        entity.x = 0;
        entity.y = Math.random() * (canvas.height - entity.height);
    }
}

// Función para agregar el temporizador de 2 segundos antes de comenzar a moverse
function startMovingSuperFastEnemy(entity) {
    setTimeout(() => {
        moveSuperFastEnemy(entity);
    }, 2000); // 2000 milisegundos (2 segundos)
}
function moveEntities() {
    // Reducir el cooldown de la habilidad si es mayor que cero
    if (skillCooldown > 0) {
        skillCooldown--;
    }

    // Mover todos los enemigos, muros e imitadores
    for (const entity of entities) {
        if (!isTimeStopped) {
            if (entity.type === 'imitator') {
                // Mover el imitador hacia el jugador
                entity.x += (player.x < entity.x) ? -entity.speed : entity.speed;
                entity.y += (player.y < entity.y) ? -entity.speed : entity.speed;
            } else if (entity.type === 'superFastEnemy') {
                // Parpadeo antes de atacar
                const pulseInterval = 5;
                entity.color = (enemyCreationCounter % pulseInterval === 0) ? 'transparent' : 'purple';

                // Después de 2 segundos, comenzar a moverse
                startMovingSuperFastEnemy(entity);
            } else {
                entity.x += entity.speed;

                if (entity.x > canvas.width) {
                    // Reiniciar posición al llegar al borde derecho
                    entity.x = 0;
                    entity.y = Math.random() * (canvas.height - entity.height);

                    // Incrementar puntos cuando un enemigo, muro o imitador pasa
                    if (entity.type === 'enemy' || entity.type === 'imitator') {
                        score++;
                    }
                }
            }
        }
    }

    // Incrementar el contador de creación de enemigos, muros e imitadores
    enemyCreationCounter++;

    // Crear una nueva entidad si el contador alcanza la frecuencia deseada o si no hay entidades
    if (enemyCreationCounter === enemyCreationFrequency || entities.length === 0) {
        entities.push(generateEntity());
        enemyCreationCounter = 1; // Reiniciar el contador
        
    }

    // Ajustar la frecuencia gradualmente para hacerlo más difícil
    if (score % 10 === 0 && score > 0) {
        enemyCreationFrequency = Math.max(20, enemyCreationFrequency - 5);
    }
}




function checkCollisions() {
    // Detección de colisión entre jugador y todos los enemigos, muros e imitadores
    for (let i = entities.length - 1; i >= 0; i--) {
        const entity = entities[i];

        // Verificar colisión con balas
        for (let j = bullets.length - 1; j >= 0; j--) {
            const bullet = bullets[j];

            if (
                bullet.x < entity.x + entity.width &&
                bullet.x + bullet.radius > entity.x &&
                bullet.y < entity.y + entity.height &&
                bullet.y + bullet.radius > entity.y
            ) {
                // Eliminar la entidad y la bala
                entities.splice(i, 1);
                bullets.splice(j, 1);
                score += 2; // Aumentar el puntaje al eliminar una entidad con una bala
                // Reproducir sonido de impacto contra enemigo
                if (enemyHitSound) {
                    enemyHitSound.playbackRate = 8;  // Ajusta el valor según sea necesario (2 sería el doble de rápido)
                    enemyHitSound.play();
                }
                
                break; // Salir del bucle interno, ya que la bala solo puede colisionar con una entidad a la vez
            }
        }

        if (
            player.x < entity.x + entity.width &&
            player.x + player.width > entity.x &&
            player.y < entity.y + entity.height &&
            player.y + player.height > entity.y
        ) {
            if (entity.type === 'skill') {
                // Eliminar la habilidad
                entities.splice(i, 1);

                // Iterar sobre las entidades restantes y eliminar las cercanas
                for (let j = entities.length - 1; j >= 0; j--) {
                    const nearbyEntity = entities[j];
                    const distance = Math.sqrt(Math.pow(player.x - nearbyEntity.x, 2) + Math.pow(player.y - nearbyEntity.y, 2));

                    if (distance <= player.width + 40) {
                        entities.splice(j, 1);
                        score += 2; // Aumentar el puntaje al eliminar una entidad cercana
                    }
                }

                // Romper el bucle para evitar colisiones múltiples en el mismo marco
                break;
            } else {
                // Reseteo de posición para el jugador
                player.x = 350;
                player.y = 270;
                score = Math.max(0, score - 1);

                // Restablecer el contador de tiempo cuando el jugador es golpeado
                timeCounter = 0;
            }
        }
    }
}


function updateTimer() {
    // Incrementar el contador de tiempo si el puntaje es mayor que cero
    if (score > 0) {
        timeCounter++;
        console.log('Tiempo: ' + timeCounter);
    }

    // Reiniciar el contador de tiempo cuando el puntaje es restablecido a cero
    if (score === 0) {
        timeCounter = 0;
    }
}
function adjustPlayerPosition() {
    // Ajustar la posición del jugador para que no salga de los límites del canvas
    player.x = Math.max(0, Math.min(canvas.width - player.width, player.x));
    player.y = Math.max(0, Math.min(canvas.height - player.height, player.y));
}
function drawGame() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Dibujar jugador
    ctx.fillStyle = player.color;
    ctx.fillRect(player.x, player.y, player.width, player.height);

    // Dibujar todos los enemigos, muros, imitadores y habilidades
    for (const entity of entities) {
        ctx.fillStyle = entity.color;
        ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
    }
    
    // Mostrar puntaje
    ctx.fillStyle = '#fff';
    ctx.font = '20px Arial';
    ctx.fillText('Puntaje: ' + score, 10, 30);

    // Mostrar tiempo
    ctx.fillText('Tiempo: ' + timeCounter, 10, 60);

    // Mostrar el estado del cooldown de la habilidad
    const cooldownText = skillCooldown > 0 ? 'Habilidad en cooldown' : 'Habilidad lista (E)';
    ctx.fillText(cooldownText, canvas.width - 200, 30);
    // Mostrar el estado del cooldown de la habilidad de detener el tiempo
    const cooldownText1 = timeStopCooldown > 0 ? 'Habilidad en cooldown (Q)' : 'Habilidad lista (Q)';
    ctx.fillText(cooldownText1, canvas.width - 200, 90);

    // Mostrar contador de balas lanzadas
    ctx.fillText('Balas: ' + bulletsFired + '/' + bulletsPerReload, canvas.width - 200, 60);
    
}
// Lista de mejores registros
const highScores = [];
let gameActive = true;
function showSurvivalScreen() {
    ctx.fillStyle = '#000';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#fff';
    ctx.font = '30px Arial';
    ctx.fillText('¡Has sobrevivido!', canvas.width / 2 - 150, canvas.height / 2 - 30);
    ctx.fillText('Tiempo: ' + timeCounter, canvas.width / 2 - 150, canvas.height / 2 + 10);
    ctx.fillText('Puntaje: ' + score, canvas.width / 2 - 150, canvas.height / 2 + 50);

    // Guardar el récord si es un nuevo récord
    const currentRecord = { time: timeCounter, score: score };
    highScores.push(currentRecord);
    highScores.sort((a, b) => b.score - a.score); // Ordenar de mayor a menor puntuación

    // Mostrar solo los 3 mejores registros
    ctx.fillText('Mejores Registros:', canvas.width / 2 - 150, canvas.height / 2 + 90);
    const numTopScores = Math.min(3, highScores.length);
    for (let i = 0; i < numTopScores; i++) {
        ctx.fillText((i + 1) + '. Tiempo: ' + highScores[i].time + ', Puntaje: ' + highScores[i].score, canvas.width / 2 - 150, canvas.height / 2 + 130 + i * 40);
    }

    ctx.fillText('Presiona "r" para reiniciar', canvas.width / 2 - 150, canvas.height / 2 + 250);
    gameActive = false;
}

document.addEventListener('keydown', (e) => {
    if (e.key === 'r' && !gameActive) {
        resetGame();
    }
});
function resetGame() {
    // Restablecer variables y listas
    timeCounter = 0;
    canShoot = true;
    bullets.length = 0;
    entities.length = 0;
    score = 1;
    gameActive = true;

    // ... (Restablecer otras variables según sea necesario)
    backgroundMusic.play();

    // Reiniciar el bucle del juego
    gameLoop();
}
// Iniciar el bucle del juego
function gameLoop() {
    if (score >= 10 || !gameActive) {
        showSurvivalScreen();
        backgroundMusic.pause();
        return; // Detener el bucle del juego cuando alcanzas 10000 puntos o gameActive es falso
    }
    else if (score > 0) {
        adjustPlayerPosition(); // Llamada a la nueva función para ajustar la posición del jugador
        updateBulletCooldown();
        moveEntities();
        moveExplosionParticles();
        moveBullets();
        checkCollisions();
        drawGame();
        drawExplosionParticles();
        drawBullets();
        updateTimer();
        requestAnimationFrame(gameLoop);
    } else {
        // Muestra la pantalla de pérdida
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = '#fff';
        ctx.font = '30px Arial';
        ctx.fillText('Has perdido, pulsa "r" para reiniciar', canvas.width / 2 - 250, canvas.height / 2);
        if (defeatSound) {
            defeatSound.play();
        }
        // Captura la tecla 'r' para recargar la página
        document.addEventListener('keydown', (e) => {
            if (e.key === 'r') {
                location.reload();
            }
        });
        backgroundMusic.pause();

    }
}

// Inicializar el juego
gameLoop();

