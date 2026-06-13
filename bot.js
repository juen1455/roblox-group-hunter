const fs = require('fs');

// Tu enlace de Discord configurado perfectamente
const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1515199569686823113/eAtu7a0PbPN3xoIzhWB70wYdkUAxNSHyS1ZrylJRDSNnZ1Q-OcSrkuLRzebJrhYiJyNY"; 

// Archivo local donde el bot recordará en qué ID se quedó
const ARCHIVO_PROGRESO = 'ultimo_id.txt';
const CANTIDAD_A_ESCANEAR = 1000; // Cuántos IDs revisará automáticamente en cada hora

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

async function verificarGrupo(id) {
    const url = `https://groups.roblox.com/v1/groups/${id}`;
    try {
        const respuesta = await fetch(url);
        if (!respuesta.ok) return;
        
        const datos = await respuesta.json();
        
        // El filtro definitivo: sin dueño, público y con 0 miembros reales antes de entrar
        if (datos.owner === null && datos.isPublicEntryAllowed === true && datos.memberCount === 0) {
            console.log(`🚨 ¡Grupo libre encontrado! ID: ${id}`);
            await enviarAlertaDiscord(id, datos.name);
        }
    } catch (error) {
        // Salta errores si Roblox tarda en responder
    }
}

async function enviarAlertaDiscord(id, nombre) {
    if (DISCORD_WEBHOOK_URL.includes("AQUÍ_PEGA")) {
        console.log("⚠️ Falta configurar el link del Webhook de Discord.");
        return;
    }
    
    const cuerpo = {
        content: `🚨 **¡GRUPO 100% VACÍO Y RECLAMABLE DETECTADO!** 🚨\n\n**Nombre:** ${nombre}\n**ID:** ${id}\n🔗 **Enlace:** https://www.roblox.com/groups/${id}`
    };

    try {
        await fetch(DISCORD_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(cuerpo)
        });
    } catch (e) {
        console.error("Error al mandar mensaje a Discord:", e);
    }
}

async function iniciarEscaneo() {
    const idInicial = obtenerUltimoId();
    const idFinal = idInicial + CANTIDAD_A_ESCANEAR;
    
    console.log(`=== Iniciando escaneo automático: Desde ${idInicial} hasta ${idFinal} ===`);
    
    for (let id = idInicial; id <= idFinal; id++) {
        await verificarGrupo(id);
        // Espera de 100 milisegundos para evitar que Roblox bloquee la IP rápido
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Guardamos el siguiente ID inicial para que la próxima hora continúe de largo al infinito
    guardarUltimoId(idFinal + 1);
    console.log(`=== Escaneo finalizado. Guardado para continuar en el ID: ${idFinal + 1} ===`);
}

iniciarEscaneo();
