const fs = require('fs');

// Archivo local donde el bot recordará en qué ID se quedó
const ARCHIVO_PROGRESO = 'ultimo_id.txt';
const CANTIDAD_A_ESCANEAR = 10000; // Cuántos IDs se revisarán automáticamente en cada hora

function obtenerUltimoId() {
    if (fs.existsSync(ARCHIVO_PROGRESO)) {
        const contenido = fs.readFileSync(ARCHIVO_PROGRESO, 'utf8');
        const id = parseInt(contenido.trim());
        if (!isNaN(id)) return id;
    }
    // Si el archivo no existe todavía, empieza desde tu número inicial preferido
    return 5001700; 
}

function guardarUltimoId(id) {
    fs.writeFileSync(ARCHIVO_PROGRESO, id.toString(), 'utf8');
}

async function iniciarCaceria() {
    const idInicial = obtenerUltimoId();
    const idFinal = idInicial + CANTIDAD_A_ESCANEAR;

    console.log(`=== Iniciando escaneo automático: Desde ${idInicial} hasta ${idFinal} ===`);

    // Aquí va tu bucle actual que revisa los grupos en Roblox...
    // (Tu lógica de peticiones y envío de webhooks a Discord)
    
    // Suponiendo que el bucle termina con éxito sin errores graves:
    const siguienteId = idFinal + 1;
    guardarUltimoId(siguienteId);
    console.log(`=== Escaneo finalizado. Guardado para continuar en el ID: ${siguienteId} ===`);
}

iniciarCaceria();
