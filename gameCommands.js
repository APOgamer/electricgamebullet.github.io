// gameCommands.js

// Objeto que contiene las respuestas a diferentes comandos
const commandResponses = {
    help: "Bienvenido a ElectricGameBullet. Puedes utilizar los siguientes comandos:\n" +
          "- help: Muestra esta ayuda.\n" +
          "- comprar: Abre la tienda para comprar mejoras.\n" +
          "- pause: Pausa el juego.\n" +
          "- continue: Reanuda el juego.",
    comprar: "¡Bienvenido a la tienda! Aquí podrás comprar mejoras para tu personaje. Próximamente...",
    pause: "El juego ha sido pausado. Para continuar, escribe 'continue'.",
    continue: "El juego ha sido reanudado.",
    default: "Lo siento, no entendí ese comando. Intenta 'help' para obtener ayuda."
};

// Función para procesar el comando y devolver la respuesta correspondiente
function processCommand(command) {
    return commandResponses[command] || commandResponses.default;
}
