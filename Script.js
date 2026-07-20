// Base de datos local del negocio
const MENU_CATALOG = {
  hamburguesas: [
    { key: "hamburguesa", name: "Hamburguesa clásica", price: 15000 },
    { key: "hamburguesa doble", name: "Hamburguesa doble", price: 18000 }
  ],
  perros: [
    { key: "perro", name: "Perro caliente", price: 12000 }
  ],
  papas: [
    { key: "papas", name: "Papas fritas", price: 8000 }
  ],
  bebidas: [
    { key: "gaseosa", name: "Gaseosa", price: 4000 }
  ],
  combos: [
    { key: "combo", name: "Combo clásico", price: 22000 }
  ],
  promociones: [
    { key: "promo", name: "Promo del día", price: 20000 }
  ]
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

const STORAGE_KEY = "rapibot-state";

const COMBO_DETAILS = {
  combo: {
    name: "Combo clásico",
    price: 22000,
    includes: ["Hamburguesa clásica", "Papas fritas", "Gaseosa"]
  },
  promo: {
    name: "Promo del día",
    price: 20000,
    includes: ["Hamburguesa clásica", "Gaseosa"]
  }
};

function loadState() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");
    return {
      cart: Array.isArray(saved.cart) ? saved.cart : [],
      deliveryAddress: saved.deliveryAddress || "",
      paymentMethod: saved.paymentMethod || "",
      paymentNumber: saved.paymentNumber || "",
      estimatedTime: saved.estimatedTime || ""
    };
  } catch {
    return {
      cart: [],
      deliveryAddress: "",
      paymentMethod: "",
      paymentNumber: "",
      estimatedTime: ""
    };
  }
}

const state = loadState();

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chatBox");
  const userInput = document.getElementById("userInput");
  const sendButton = document.getElementById("sendButton");
  const chips = document.querySelectorAll(".chip");
  const summaryList = document.getElementById("summaryList");
  const clearOrderBtn = document.getElementById("clearOrderBtn");
  const confirmOrderBtn = document.getElementById("confirmOrderBtn");
  const statusPill = document.getElementById("statusPill");
  const addressInput = document.getElementById("addressInput");
  const receiptCard = document.getElementById("receiptCard");
  const receiptContent = document.getElementById("receiptContent");
  const faqQuestions = document.querySelectorAll(".faq-question");
  const editOrderBtn = document.getElementById("editOrderBtn");

  if (!chatBox || !userInput || !sendButton) return;

  function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }

  function normalizeText(text) {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  function setStatus(text) {
    if (statusPill) statusPill.textContent = text;
  }

  function addMessage(role, text, useHtml = false) {
    const message = document.createElement("div");
    message.className = `message ${role}`;

    if (useHtml) {
      message.innerHTML = text;
    } else {
      message.textContent = text;
    }

    chatBox.appendChild(message);
    chatBox.scrollTop = chatBox.scrollHeight;
  }

  function calculateTotal() {
    return state.cart.reduce((sum, item) => sum + item.price * (item.quantity || 1), 0);
  }

  function renderSummary() {
    if (!summaryList) return;

    summaryList.innerHTML = "";

    const hasContent =
      state.cart.length > 0 ||
      state.deliveryAddress ||
      state.paymentMethod ||
      state.estimatedTime;

    if (!hasContent) {
      summaryList.innerHTML = '<div class="summary-empty">Aún no has agregado nada al carrito</div>';
      return;
    }

    const list = document.createElement("div");
    list.className = "summary-items";

    state.cart.forEach((item) => {
      const row = document.createElement("div");
      row.className = "summary-item";

      const label = (item.quantity || 1) > 1 ? `${item.name} x${item.quantity}` : item.name;
      const totalItem = item.price * (item.quantity || 1);
      const detailText = item.includes ? `<div class="summary-detail">Incluye: ${item.includes.join(", ")}</div>` : "";

      row.innerHTML = `
        <div>
          <span>${label}</span>
          ${detailText}
        </div>
        <span>$${totalItem.toLocaleString("es-CO")}</span>
      `;

      list.appendChild(row);
    });

    if (state.deliveryAddress) {
      const addressRow = document.createElement("div");
      addressRow.className = "summary-address";
      addressRow.textContent = `Delivery: ${state.deliveryAddress}`;
      list.appendChild(addressRow);
    }

    if (state.paymentMethod) {
      const paymentRow = document.createElement("div");
      paymentRow.className = "summary-payment";
      const paymentText =
        state.paymentMethod === "Nequi" && state.paymentNumber
          ? `Pago: ${state.paymentMethod} - ${state.paymentNumber}`
          : `Pago: ${state.paymentMethod}`;
      paymentRow.textContent = paymentText;
      list.appendChild(paymentRow);
    }

    if (state.estimatedTime) {
      const timeRow = document.createElement("div");
      timeRow.className = "summary-time";
      timeRow.textContent = `Tiempo: ${state.estimatedTime}`;
      list.appendChild(timeRow);
    }

    const totalRow = document.createElement("div");
    totalRow.className = "summary-total";
    totalRow.textContent = `Total: $${calculateTotal().toLocaleString("es-CO")}`;
    list.appendChild(totalRow);

    summaryList.appendChild(list);
  }

  function addToOrder(item) {
    const quantity = item.quantity || 1;
    const existing = state.cart.find(
      (entry) => entry.name === item.name && entry.price === item.price
    );

    if (existing) {
      existing.quantity += quantity;
    } else {
      state.cart.push({ ...item, quantity });
    }

    saveState();
    renderSummary();
    updateReceiptIfVisible();
  }

  function removeLastItem() {
    if (state.cart.length === 0) {
      addMessage("bot", "Tu pedido está vacío, no hay nada que quitar.");
      setStatus("Pedido vacío");
      return;
    }

    state.cart.pop();
    saveState();
    renderSummary();
    addMessage("bot", "Se quitó el último producto del pedido.");
    setStatus("Producto quitado");
  }

  function resetOrder(hideReceipt = true) {
    state.cart = [];
    state.deliveryAddress = "";
    state.paymentMethod = "";
    state.paymentNumber = "";
    state.estimatedTime = "";
    saveState();
    renderSummary();
    if (hideReceipt) hideReceipt();
  }

  function validateInput(rawValue) {
    const value = rawValue.trim().replace(/\s+/g, " ");

    if (!value) {
      addMessage("bot", "Escribe algo para que pueda ayudarte 😊");
      setStatus("Esperando mensaje");
      return null;
    }

    if (value.length < 2) {
      addMessage("bot", 'Tu mensaje es muy corto. Intenta con "menu", "combo" o "ayuda".');
      setStatus("Mensaje muy corto");
      return null;
    }

    return value;
  }

  function getAddressFromText(text) {
    const patterns = [
      /(?:direccion|dirección)\s*[:\-]?\s*(.+)/i,
      /(?:mi\s+)?(?:direccion|dirección)\s+es\s+(.+)/i
    ];

    for (const pattern of patterns) {
      const match = text.match(pattern);
      if (match && match[1]) return match[1].trim();
    }

    return "";
  }

  function getPaymentMethodFromText(text) {
    if (/(nequi)/.test(text)) return { name: "Nequi", number: "300 123 4567" };
    if (/(efectivo|en efectivo|cash)/.test(text)) return { name: "Efectivo", number: "" };
    if (/(tarjeta|credito|crédito|debito|débito|card)/.test(text)) return { name: "Tarjeta", number: "" };
    return null;
  }

  function toNumber(value) {
    const wordMap = {
      uno: 1,
      una: 1,
      un: 1,
      dos: 2,
      tres: 3,
      cuatro: 4,
      cinco: 5,
      seis: 6,
      siete: 7,
      ocho: 8,
      nueve: 9,
      diez: 10
    };

    const parsed = Number(value);
    return Number.isInteger(parsed) ? parsed : (wordMap[value] || 1);
  }

  function getQuantity(text, keywords) {
    const pattern = new RegExp(
      `(\\d+|uno|una|un|dos|tres|cuatro|cinco|seis|siete|ocho|nueve|diez)\\s*(?:de\\s+)?(?:${keywords})`,
      "i"
    );
    const match = text.match(pattern);
    return match ? toNumber(match[1]) : 1;
  }

  function parseItemsFromText(text) {
    const normalizedText = normalizeText(text);
    const items = [];

    if (/(promo|promocion|promoción)/.test(normalizedText)) {
      const promo = COMBO_DETAILS.promo;
      items.push({
        name: promo.name,
        price: promo.price,
        quantity: 1,
        includes: promo.includes
      });
    }

    if (/(combo|combo clasico|combo clásico)/.test(normalizedText)) {
      const combo = COMBO_DETAILS.combo;
      items.push({
        name: combo.name,
        price: combo.price,
        quantity: 1,
        includes: combo.includes
      });
    }

    if (/(hamburguesa|hamburguesas)/.test(normalizedText)) {
      items.push({
        name: /doble/.test(normalizedText) ? "Hamburguesa doble" : "Hamburguesa clásica",
        price: /doble/.test(normalizedText) ? 18000 : 15000,
        quantity: getQuantity(normalizedText, "hamburguesa(?:s)?")
      });
    }

    if (/(perro|perros)/.test(normalizedText)) {
      items.push({
        name: "Perro caliente",
        price: 12000,
        quantity: getQuantity(normalizedText, "perro(?:s)?")
      });
    }

    if (/(papas|papitas)/.test(normalizedText)) {
      items.push({
        name: "Papas fritas",
        price: 8000,
        quantity: getQuantity(normalizedText, "papas|papitas")
      });
    }

    if (/(bebida|bebidas|refresco|refrescos|gaseosa|gaseosas)/.test(normalizedText)) {
      items.push({
        name: "Gaseosa",
        price: 4000,
        quantity: getQuantity(normalizedText, "bebida|bebidas|refresco|refrescos|gaseosa|gaseosas")
      });
    }

    return items;
  }

  function getBotReply(input) {
    const text = normalizeText(input);
    const addressFromText = getAddressFromText(text);
    const paymentData = getPaymentMethodFromText(text);
    const parsedItems = parseItemsFromText(text);

    if (addressFromText) {
      state.deliveryAddress = addressFromText;
      if (addressInput) addressInput.value = state.deliveryAddress;
      saveState();
      renderSummary();
      updateReceiptIfVisible();
    }

    if (paymentData) {
      state.paymentMethod = paymentData.name;
      state.paymentNumber = paymentData.number || "";
      saveState();
      renderSummary();
      updateReceiptIfVisible();
    }

    if (/(tiempo|entrega|llegar|llega)/.test(text)) {
      state.estimatedTime = "25-35 minutos";
      saveState();
      renderSummary();
      updateReceiptIfVisible();
      return "El tiempo estimado de entrega es de 25 a 35 minutos.";
    }

    if (parsedItems.length > 0) {
      parsedItems.forEach((item) => addToOrder(item));

      const names = parsedItems
        .map((item) => {
          const baseName = item.quantity > 1 ? `${item.name} x${item.quantity}` : item.name;
          return item.includes ? `${baseName} (${item.includes.join(", ")})` : baseName;
        })
        .join(", ");

      let reply = `Perfecto, agregué ${names} a tu pedido.`;

      if (state.deliveryAddress) reply += ` Dirección: ${state.deliveryAddress}.`;
      if (state.paymentMethod) {
        if (state.paymentMethod === "Nequi" && state.paymentNumber) {
          reply += ` Pago: ${state.paymentMethod} (${state.paymentNumber}).`;
        } else {
          reply += ` Pago: ${state.paymentMethod}.`;
        }
      }

      if (state.estimatedTime) reply += ` Tiempo estimado: ${state.estimatedTime}.`;

      return reply;
    }

    if (paymentData) {
      if (paymentData.name === "Nequi" && paymentData.number) {
        return `Perfecto, registraré tu pago con Nequi. Número: ${paymentData.number}.`;
      }
      return `Perfecto, registraré tu pago con ${paymentData.name}.`;
    }

    if (/(editar|quitar|cancelar)/.test(text)) {
      removeLastItem();
      return "He quitado el último producto del pedido.";
    }

    if (text.includes("hola") || text.includes("buenos") || text.includes("buenas") || text.includes("ay")) {
      return "Hola 👋 Soy RapiBot. Puedo ayudarte con el menú, combos, promociones, delivery, direcciones y pagos.";
    }

    if (text.includes("menu") || text.includes("ver menu") || text.includes("que hay")) {
      return buildMenuHtml();
    }

    if (text.includes("horario") || text.includes("abierto") || text.includes("abrimos")) {
      return "Estamos atendiendo de lunes a domingo de 11:00 a 22:00.";
    }

    if (text.includes("delivery") || text.includes("domicilio") || text.includes("envio")) {
      if (state.deliveryAddress) {
        return `Entendido, el delivery se enviará a ${state.deliveryAddress}.`;
      }
      return "Claro, puedo preparar tu delivery. Escribe o guarda una dirección en el campo de abajo.";
    }

    if (text.includes("pago") || text.includes("metodo") || text.includes("forma de pago")) {
      return "Aceptamos efectivo, Nequi y tarjeta.";
    }

    if (text.includes("precio") || text.includes("cuanto") || text.includes("cuesta")) {
      return "Hamburguesa clásica $15.000, hamburguesa doble $18.000, perro $12.000, papas $8.000, gaseosa $4.000, combo clásico $22.000.";
    }

    if (text.includes("confirmar") || text.includes("pedido")) {
      if (state.cart.length > 0) {
        const items = state.cart
          .map((item) => (item.quantity > 1 ? `${item.name} x${item.quantity}` : item.name))
          .join(", ");

        const addressText = state.deliveryAddress ? ` Dirección: ${state.deliveryAddress}.` : "";
        const paymentText = state.paymentMethod
          ? ` Pago: ${state.paymentMethod}${state.paymentNumber ? ` (${state.paymentNumber})` : ""}.`
          : "";
        const timeText = state.estimatedTime ? ` Tiempo: ${state.estimatedTime}.` : "";
        const totalText = ` Total: $${calculateTotal().toLocaleString("es-CO")}.`;

        resetOrder();
        return `Pedido confirmado 😊 Resumen final: ${items}.${totalText}${addressText}${paymentText}${timeText} Te contactaremos pronto.`;
      }
      return "Tu pedido está vacío. Agrega algo antes de confirmar.";
    }

    if (text.includes("limpiar") || text.includes("vaciar")) {
      resetOrder();
      return "El pedido se ha vaciado.";
    }

    if (text.includes("ayuda") || text.includes("como")) {
      return 'Puedo ayudarte con el menú, combos, promociones, horarios, delivery, direcciones y pagos. Prueba con: "combo clásico", "promo", "2 papas" o "confirmar".';
    }

    if (text.includes("gracias")) {
      return "De nada 😊";
    }

    return 'No entendí del todo tu mensaje. Prueba con "menu", "combo clásico", "promo", "2 papas" o "ayuda".';
  }

  function sendMessage() {
    const validatedValue = validateInput(userInput.value);

    if (!validatedValue) {
      userInput.focus();
      return;
    }

    addMessage("user", validatedValue);
    userInput.value = "";
    setStatus("Procesando respuesta");

    const reply = getBotReply(validatedValue);
    const isHtml = typeof reply === "string" && reply.includes("menu-card");
    addMessage("bot", reply, isHtml);
    setStatus("Respuesta enviada");
    userInput.focus();
  }

  sendButton.addEventListener("click", sendMessage);

  userInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      event.preventDefault();
      sendMessage();
    }
  });

  chips.forEach((chip) => {
    chip.addEventListener("click", () => {
      userInput.value = chip.dataset.text || chip.textContent.trim();
      sendMessage();
    });
  });

  function confirmOrder() {
    if (state.cart.length === 0) return;

    const total = calculateTotal();
    const paymentText = state.paymentMethod
      ? `${state.paymentMethod}${state.paymentNumber ? ` (${state.paymentNumber})` : ""}`
      : "";

    const receiptHtml = buildReceiptHtml(
      state.cart,
      total,
      state.deliveryAddress,
      paymentText,
      state.estimatedTime
    );

    showReceipt(receiptHtml);
    setStatus("Pedido confirmado");
    addMessage(
      "bot",
      `Pedido confirmado 😊 Total: $${total.toLocaleString("es-CO")}.`
    );
  }

  function payReceipt() {
    if (state.cart.length === 0) {
      addMessage("bot", "No hay pedido para pagar.");
      return;
    }

    if (!state.paymentMethod) {
      addMessage("bot", "Para pagar necesito que elijas un método de pago. Escribe 'Nequi', 'efectivo' o 'tarjeta'.");
      setStatus("Pago pendiente");
      return;
    }

    const total = calculateTotal();
    addMessage(
      "bot",
      `Recibo pagado 🎉 Total: $${total.toLocaleString("es-CO")}. Gracias por tu compra.`
    );
    setStatus("Recibo pagado");
    resetOrder();
  }

  function buildReceiptHtml(items, total, address, payment, time) {
    return `
      <div class="receipt-title">RECIBO DE PEDIDO</div>
      <div class="receipt-section">
        <strong>Productos</strong>
        ${items
          .map(
            (item) => `
          <div class="receipt-item">
            <span>${item.quantity > 1 ? `${item.name} x${item.quantity}` : item.name}</span>
            <span>$${(item.price * item.quantity).toLocaleString("es-CO")}</span>
          </div>`
          )
          .join("")}
      </div>
      ${address ? `<div class="receipt-section"><strong>Dirección</strong><div>${address}</div></div>` : ""}
      ${payment ? `<div class="receipt-section"><strong>Pago</strong><div>${payment}</div></div>` : ""}
      ${time ? `<div class="receipt-section"><strong>Entrega</strong><div>${time}</div></div>` : ""}
      <div class="receipt-total">
        <span>Total</span>
        <strong>$${total.toLocaleString("es-CO")}</strong>
      </div>
      <div class="receipt-actions">
        <button id="payReceiptBtn" class="receipt-pay-btn">Pagar recibo</button>
      </div>
    `;
  }

  function showReceipt(html) {
    if (receiptCard && receiptContent) {
      receiptCard.hidden = false;
      receiptContent.innerHTML = html;
    }
  }

  function hideReceipt() {
    if (receiptCard && receiptContent) {
      receiptCard.hidden = true;
      receiptContent.innerHTML = "";
    }
  }

  function updateReceiptIfVisible() {
    if (!isReceiptVisible()) return;

    const total = calculateTotal();
    const paymentText = state.paymentMethod
      ? `${state.paymentMethod}${state.paymentNumber ? ` (${state.paymentNumber})` : ""}`
      : "";

    showReceipt(
      buildReceiptHtml(
        state.cart,
        total,
        state.deliveryAddress,
        paymentText,
        state.estimatedTime
      )
    );
  }

  function isReceiptVisible() {
    return receiptCard && !receiptCard.hidden;
  }

  if (receiptCard) {
    receiptCard.addEventListener("click", (event) => {
      if (event.target.id === "payReceiptBtn") {
        payReceipt();
      }
    });
  }

  clearOrderBtn.addEventListener("click", () => {
    resetOrder();
    addMessage("bot", "El pedido se ha limpiado.");
    setStatus("Pedido limpiado");
  });

  if (editOrderBtn) {
    editOrderBtn.addEventListener("click", removeLastItem);
  }

  confirmOrderBtn.addEventListener("click", confirmOrder);

  if (payReceiptBtn) {
    payReceiptBtn.addEventListener("click", payReceipt);
  }

  if (addressInput) {
    addressInput.value = state.deliveryAddress;
  }

  renderSummary();
});

function buildMenuHtml() {
  return `
    <div class="menu-card">
      <div class="menu-card-title">🍽️ Menú</div>

      <div class="menu-section">
        <div class="menu-section-title">🍔 Hamburguesas</div>
        <div class="menu-item">• Hamburguesa clásica — $15.000</div>
        <div class="menu-item">• Hamburguesa doble — $18.000</div>
      </div>

      <div class="menu-section">
        <div class="menu-section-title">🌭 Perros</div>
        <div class="menu-item">• Perro caliente — $12.000</div>
      </div>

      <div class="menu-section">
        <div class="menu-section-title">🍟 Papas</div>
        <div class="menu-item">• Papas fritas — $8.000</div>
      </div>

      <div class="menu-section">
        <div class="menu-section-title">🥤 Bebidas</div>
        <div class="menu-item">• Gaseosa — $4.000</div>
      </div>

      <div class="menu-section">
        <div class="menu-section-title">🎁 Combos</div>
        <div class="menu-item">• Combo clásico — $22.000</div>
        <div class="menu-item menu-item--muted">Incluye: hamburguesa clásica, papas y gaseosa</div>
      </div>

      <div class="menu-section">
        <div class="menu-section-title">✨ Promociones</div>
        <div class="menu-item">• Promo del día — $20.000</div>
        <div class="menu-item menu-item--muted">Incluye: hamburguesa clásica y gaseosa</div>
      </div>
    </div>
  `;
}

function buildReceiptHtml(items, total, address, payment, time) {
  return `
    <div class="receipt-title">RECIBO DE PEDIDO</div>
    <div class="receipt-section">
      <strong>Productos</strong>
      ${items
        .map(
          (item) => `
        <div class="receipt-item">
          <span>${item.quantity > 1 ? `${item.name} x${item.quantity}` : item.name}</span>
          <span>$${(item.price * item.quantity).toLocaleString("es-CO")}</span>
        </div>`
        )
        .join("")}
    </div>
    ${address ? `<div class="receipt-section"><strong>Dirección</strong><div>${address}</div></div>` : ""}
    ${payment ? `<div class="receipt-section"><strong>Pago</strong><div>${payment}</div></div>` : ""}
    ${time ? `<div class="receipt-section"><strong>Entrega</strong><div>${time}</div></div>` : ""}
    <div class="receipt-total">
      <span>Total</span>
      <strong>$${total.toLocaleString("es-CO")}</strong>
    </div>
    <div class="receipt-actions">
      <button id="payReceiptBtn" class="receipt-pay-btn">Pagar recibo</button>
    </div>
  `;
}

function showReceipt(html) {
  if (receiptCard && receiptContent) {
    receiptCard.hidden = false;
    receiptContent.innerHTML = html;
  }
}

function hideReceipt() {
  if (receiptCard && receiptContent) {
    receiptCard.hidden = true;
    receiptContent.innerHTML = "";
  }
}

function updateReceiptIfVisible() {
  if (!isReceiptVisible()) return;

  const total = calculateTotal();
  const paymentText = state.paymentMethod
    ? `${state.paymentMethod}${state.paymentNumber ? ` (${state.paymentNumber})` : ""}`
    : "";

  showReceipt(
    buildReceiptHtml(
      state.cart,
      total,
      state.deliveryAddress,
      paymentText,
      state.estimatedTime
    )
  );
}

function isReceiptVisible() {
  return receiptCard && !receiptCard.hidden;
}

if (receiptCard) {
  receiptCard.addEventListener("click", (event) => {
    if (event.target.id === "payReceiptBtn") {
      payReceipt();
    }
  });
}