const DISCORD_WEBHOOK_URL = "https://discord.com/api/webhooks/1515199569686823113/eAtu7a0PbPN3xoIzhWB70wYdkUAxNSHyS1ZrylJRDSNnZ1Q-OcSrkuLRzebJrhYiJyNY"; 

// Configuramos los IDs para el escaneo automático
const ID_INICIAL = 5001700; 
const ID_MAXIMO  = 5002500; // Un rango inicial para probar cómo avanza

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
    console.log(`=== Iniciando escaneo de IDs desde ${ID_INICIAL} hasta ${ID_MAXIMO} ===`);
    for (let id = ID_INICIAL; id <= ID_MAXIMO; id++) {
        await verificarGrupo(id);
        // Espera de 100 milisegundos para evitar que Roblox bloquee la IP rápido
        await new Promise(resolve => setTimeout(resolve, 100));
    }
    console.log("=== Escaneo finalizado por hoy ===");
}

iniciarEscaneo();
