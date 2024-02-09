// Lista para almacenar instancias de SuperIntelligentEnemy
const superIntelligentEnemies = [];
// Lista para almacenar balas del enemigo
const enemyBullets = [];





// Define la clase SuperIntelligentEnemy
class SuperIntelligentEnemy {
    constructor(x, y, width, height, color, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.speed = speed;
    }

    // Añade un método para que el enemigo dispare en la dirección del jugador
    shootTowardsPlayer(playerX, playerY) {
        const deltaX = playerX - this.x;
        const deltaY = playerY - this.y;
        const angle = Math.atan2(deltaY, deltaX);

        const bulletSpeed = 5; // Puedes ajustar la velocidad de las balas según sea necesario

        const newBullet = new EnemyBullet(this.x, this.y, 5, 'red', bulletSpeed, angle);
        enemyBullets.push(newBullet);
    }

    evadeBullets(bullets) {
        for (const bullet of bullets) {
            const deltaX = bullet.x - this.x;
            const deltaY = bullet.y - this.y;
            const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

            const evasionSpeed = this.speed * 1.5;

            if (distance < evasionSpeed) {
                const angle = Math.atan2(deltaY, deltaX);
                const evasionX = Math.cos(angle) * evasionSpeed;
                const evasionY = Math.sin(angle) * evasionSpeed;
                this.x -= evasionX;
                this.y -= evasionY;
            }
        }
    }
    checkBulletCollision(bullets) {
        for (let i = bullets.length - 1; i >= 0; i--) {
            const bullet = bullets[i];
            if (
                bullet.x < this.x + this.width &&
                bullet.x + bullet.radius > this.x &&
                bullet.y < this.y + this.height &&
                bullet.y + bullet.radius > this.y
            ) {
                bullets.splice(i, 1);
                return true;
            }
        }
        return false;
    }
    checkExplosionCollision(explosionParticles) {
        for (let i = explosionParticles.length - 1; i >= 0; i--) {
            const particle = explosionParticles[i];
            if (
                particle.x + particle.radius > this.x &&
                particle.x - particle.radius < this.x + this.width &&
                particle.y + particle.radius > this.y &&
                particle.y - particle.radius < this.y + this.height
            ) {
                return true;
            }
        }
        return false;
    }
    moveToPlayer(playerX, playerY) {
        const deltaX = playerX - this.x;
        const deltaY = playerY - this.y;
        const angle = Math.atan2(deltaY, deltaX);
        const speedX = Math.cos(angle) * this.speed;
        const speedY = Math.sin(angle) * this.speed;
        this.x += speedX;
        this.y += speedY;
    }
}

// Define la clase EnemyBullet para representar las balas del enemigo
class EnemyBullet {
    constructor(x, y, radius, color, speed, angle) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.color = color;
        this.speed = speed;
        this.angle = angle; // Agrega el ángulo
        this.attractionForce = 30; // Puedes ajustar la fuerza de atracción según sea necesario
    }

    move(playerX, playerY) {
        // Mover en la dirección del ángulo
        this.x += Math.cos(this.angle) * this.speed;
        this.y += Math.sin(this.angle) * this.speed;

        // Atraer al jugador
        const deltaX = playerX - this.x;
        const deltaY = playerY - this.y;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (distance > 0) {
            const attractionX = (deltaX / distance) * this.attractionForce;
            const attractionY = (deltaY / distance) * this.attractionForce;
            this.x += attractionX;
            this.y += attractionY;
        }
    }
}

// Función para actualizar enemigos inteligentes
function updateIntelligentEnemy() {
    // Lógica para generar y actualizar enemigos inteligentes (SuperIntelligentEnemy)
    if (superIntelligentEnemies.length === 0 && score >= 500) {
        // Crear un nuevo SuperIntelligentEnemy cuando no hay ninguno en el juego
        const newEnemy = new SuperIntelligentEnemy(
            Math.random() * canvas.width,
            Math.random() * canvas.height,
            20,
            20,
            'yellow',
            0.5
        );
        superIntelligentEnemies.push(newEnemy);
    }

    // Iterar sobre los enemigos inteligentes y actualizar cada uno
    for (let i = superIntelligentEnemies.length - 1; i >= 0; i--) {
        const enemy = superIntelligentEnemies[i];

        // Verificar colisión con balas del jugador y eliminar enemigo si es alcanzado
        const isHitByBullet = enemy.checkBulletCollision(bullets);
        const isHitByExplosion = enemy.checkExplosionCollision(explosionParticles);

        if (isHitByBullet || isHitByExplosion) {
            superIntelligentEnemies.splice(i, 1);
            score += 5; // Ajusta la puntuación según sea necesario
            continue; // Pasa al siguiente enemigo si el actual ha sido eliminado
        }

        // Esquivar balas antes de mover hacia el jugador
        enemy.evadeBullets(bullets);

        // Mover hacia el jugador solo si no ha sido alcanzado por una bala
        enemy.moveToPlayer(player.x, player.y);

        // Verificar colisión con el jugador
        if (
            player.x < enemy.x + enemy.width &&
            player.x + player.width > enemy.x &&
            player.y < enemy.y + enemy.height &&
            player.y + player.height > enemy.y
        ) {
            handlePlayerCollision(enemy);
        }

        // Verificar si el enemigo debe disparar en la dirección del jugador
        if (Math.random() < 0.01) {
            enemy.shootTowardsPlayer(player.x, player.y);
        }

        // Mover las balas del enemigo y aplicar atracción al jugador
        for (let j = enemyBullets.length - 1; j >= 0; j--) {
            const bullet = enemyBullets[j];
            bullet.move(player.x, player.y);

            // Verificar colisión de las balas del enemigo con el jugador
            if (
                player.x < bullet.x + bullet.radius &&
                player.x + player.width > bullet.x - bullet.radius &&
                player.y < bullet.y + bullet.radius &&
                player.y + player.height > bullet.y - bullet.radius
            ) {
                // Atraer al jugador
                const deltaX = player.x - bullet.x;
                const deltaY = player.y - bullet.y;
                const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

                if (distance > 0) {
                    const attractionX = (deltaX / distance) * bullet.attractionForce;
                    const attractionY = (deltaY / distance) * bullet.attractionForce;
                    player.x += attractionX;
                    player.y += attractionY;
                }

                // Eliminar la bala del enemigo
                enemyBullets.splice(j, 1);
            }

            // Verificar colisión de las balas del enemigo con otras entidades
            for (let k = entities.length - 1; k >= 0; k--) {
                const entity = entities[k];
                if (
                    entity.x < bullet.x + bullet.radius &&
                    entity.x + entity.width > bullet.x - bullet.radius &&
                    entity.y < bullet.y + bullet.radius &&
                    entity.y + entity.height > bullet.y - bullet.radius
                ) {
                    // Eliminar la entidad
                    entities.splice(k, 1);

                    // Incrementar la puntuación (opcional)
                    score += 10; // Puedes ajustar la puntuación según sea necesario

                    // Eliminar la bala del enemigo
                    enemyBullets.splice(j, 1);
                }
            }

            // Dibujar las balas del enemigo en el canvas
            ctx.fillStyle = bullet.color;
            ctx.beginPath();
            ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
            ctx.fill();
        }

        // Dibujar el enemigo superinteligente en el canvas
        ctx.fillStyle = enemy.color;
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    }
}