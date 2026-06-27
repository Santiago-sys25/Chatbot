// Base de datos local del negocio
const MENU = {
    hamburguesa: 15000,
    perro: 12000,
    papas: 8000,
    gaseosa: 4000
};

const MAPA_CONVERSACIONAL = {
    inicio: {
        mensaje: "Hola, soy RapiBot. Puedo ayudarte a ver el menú, agregar productos y generar tu recibo."
    },
    menu: {
        mensaje: "📋 Menú disponible:\n• Hamburguesa: $15.000\n• Perro: $12.000\n• Papas: $8.000\n• Gaseosa: $4.000\n\nEscribe el nombre del producto que deseas." 
    },
    ayuda: {
        mensaje: "🧭 Puedes escribir:\n• menu para ver opciones\n• hamburguesa para agregarla\n• recibo para terminar tu pedido\n• ayuda para ver estas instrucciones otra vez."
    },
    fallback: {
        mensaje: "No entendí del todo. Puedes escribir 'menu', 'ayuda' o el nombre de un producto como 'hamburguesa'."
    }
};

let carrito = [];

function sendMessage() {
    const input = document.getElementById("userInput");
    const text = input.value.trim();
    if (text === "") return;

    addMessage(text, "user");
    input.value = "";

    const chatBox = document.getElementById("chatBox");
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot typing";
    typingDiv.id = "typing";
    typingDiv.innerText = "Escribiendo...";
    chatBox.appendChild(typingDiv);
    chatBox.scrollTop = chatBox.scrollHeight;

    setTimeout(() => {
        const typing = document.getElementById("typing");
        if (typing) typing.remove();

        const respuestaBot = procesarMensajeLocal(text.toLowerCase());
        addMessage(respuestaBot, "bot");
    }, 600);
}

function procesarMensajeLocal(msg) {
    if (msg.includes("menu") || msg.includes("carta") || msg.includes("comida")) {
        return MAPA_CONVERSACIONAL.menu.mensaje;
    }

    if (msg.includes("ayuda") || msg.includes("como") || msg.includes("ayúdame")) {
        return MAPA_CONVERSACIONAL.ayuda.mensaje;
    }

    if (msg.includes("recibo") || msg.includes("cuenta") || msg.includes("listo") || msg.includes("pagar")) {
        if (carrito.length === 0) {
            return "Tu pedido está vacío. Elige algo del menú para empezar. 🍔";
        }

        let total = 0;
        let detalle = "🧾 Recibo de compra\nRapigood Comidas\n";

        carrito.forEach(item => {
            detalle += `• ${item.nombre}: $${item.precio.toLocaleString("es-CO")}\n`;
            total += item.precio;
        });

        detalle += `\n💰 Total a pagar: $${total.toLocaleString("es-CO")}\n¡Gracias por tu compra!`;
        carrito = [];
        updateOrderSummary();
        return detalle;
    }

    let productoAgregado = false;

    for (let producto in MENU) {
        if (msg.includes(producto)) {
            carrito.push({ nombre: producto.toUpperCase(), precio: MENU[producto] });
            productoAgregado = true;
        }
    }

    if (productoAgregado) {
        updateOrderSummary();
        const cantidad = carrito.length;
        return `✅ Agregado al pedido. Ahora tienes ${cantidad} producto${cantidad > 1 ? "s" : ""}. Si quieres, escribe "recibo" para ver el total.`;
    }

    return MAPA_CONVERSACIONAL.fallback.mensaje;
}

function addMessage(text, sender) {
    const chatBox = document.getElementById("chatBox");
    const div = document.createElement("div");
    div.className = "message " + sender;
    div.innerHTML = text.replace(/\n/g, "<br>");
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function updateOrderSummary() {
    const summaryList = document.getElementById("summaryList");
    if (!summaryList) return;

    if (carrito.length === 0) {
        summaryList.innerHTML = '<div class="summary-empty">Aún no has agregado nada al carrito</div>';
        return;
    }

    let html = "";
    let total = 0;

    carrito.forEach(item => {
        total += item.precio;
        html += `<div class="summary-item"><span>${item.nombre}</span><span>$${item.precio.toLocaleString("es-CO")}</span></div>`;
    });

    html += `<div class="summary-total">Total: $${total.toLocaleString("es-CO")}</div>`;
    summaryList.innerHTML = html;
}

function setupQuickActions() {
    document.querySelectorAll(".chip").forEach((chip) => {
        chip.addEventListener("click", () => {
            const input = document.getElementById("userInput");
            input.value = chip.dataset.text;
            sendMessage();
        });
    });
}

function clearOrder() {
    carrito = [];
    updateOrderSummary();
    addMessage("🧹 El pedido ha sido limpiado.", "bot");
}

function confirmOrder() {
    if (carrito.length === 0) {
        addMessage("⚠️ Tu pedido está vacío. Agrega algo antes de confirmar.", "bot");
        return;
    }

    const total = carrito.reduce((sum, item) => sum + item.precio, 0);
    addMessage(`✅ Pedido confirmado. Total a pagar: $${total.toLocaleString("es-CO")}.`, "bot");
    carrito = [];
    updateOrderSummary();
}

document.getElementById("userInput").addEventListener("keypress", function (e) {
    if (e.key === "Enter") sendMessage();
});

const sendButton = document.getElementById("sendButton");
if (sendButton) {
    sendButton.addEventListener("click", sendMessage);
}

const clearOrderBtn = document.getElementById("clearOrderBtn");
if (clearOrderBtn) {
    clearOrderBtn.addEventListener("click", clearOrder);
}

const confirmOrderBtn = document.getElementById("confirmOrderBtn");
if (confirmOrderBtn) {
    confirmOrderBtn.addEventListener("click", confirmOrder);
}

setupQuickActions();
updateOrderSummary();