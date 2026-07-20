# RapiBot
## Chatbot de pedidos para un negocio local



RapiBot es un sistema de interacción conversacional diseñado para simular un asistente virtual de pedidos en un negocio de comidas rápidas. Su propósito es permitir que un usuario realice pedidos de forma natural mediante texto, seleccione productos, indique datos de entrega, elija un método de pago y consulte información básica del negocio.

---

## 1. Portada del proyecto

Proyecto: RapiBot  
Tipo: Prototipo de chatbot interactivo  
Asignatura: Desarrollo de Interfaces o Programación Web  
Autor: [Tu nombre]  
Fecha: 2026  
Tecnología utilizada: HTML, CSS y JavaScript puro

---

## 2. Introducción

En la actualidad, los chatbots han cobrado gran relevancia en la atención al cliente y en la automatización de procesos básicos. RapiBot representa una solución sencilla y funcional para mostrar cómo un negocio local puede incorporar una experiencia de pedido mediante conversación.

Este proyecto tiene como finalidad demostrar la capacidad de un sistema para:
- recibir pedidos en lenguaje natural,
- organizar los productos en un resumen,
- gestionar datos de entrega y pago,
- y ofrecer una interacción amigable con el usuario.

---

## 3. Objetivo general

Desarrollar un chatbot web que permita simular la experiencia de pedir productos en un restaurante o negocio de comida rápida mediante una conversación sencilla e intuitiva.

---

## 4. Objetivos específicos

- Implementar una interfaz visual clara y atractiva.
- Permitir al usuario ver el menú organizado por categorías.
- Incorporar lógica para agregar productos al pedido.
- Soportar cantidades como “2 papas” o “3 hamburguesas”.
- Incluir combos, promociones y tiempo estimado de entrega.
- Permitir indicar una dirección de delivery.
- Gestionar métodos de pago como Nequi, efectivo y tarjeta.
- Ofrecer una experiencia de uso básica, pero funcional, para demostraciones o exposiciones.

---

## 5. Alcance del proyecto

Este proyecto corresponde a una versión demostrativa del chatbot. No utiliza base de datos externa ni backend real. Toda la información se gestiona de forma local en el navegador mediante JavaScript y almacenamiento local.

---

## 6. Funcionalidades implementadas

### 6.1 Menú interactivo
El sistema muestra un menú dividido en categorías, entre las que se incluyen:
- Hamburguesas
- Perros
- Papas
- Bebidas
- Combos
- Promociones

### 6.2 Agregado de productos
El usuario puede escribir mensajes como:
- `hamburguesa`
- `2 papas`
- `una bebida`
- `combo clásico`
- `promo`

### 6.3 Resumen del pedido
En la interfaz lateral se muestran:
- productos agregados,
- dirección de delivery,
- método de pago,
- tiempo estimado,
- y total del pedido.

### 6.4 Métodos de pago
El chatbot acepta:
- Nequi
- Efectivo
- Tarjeta

### 6.5 Edición del pedido
El usuario puede:
- quitar el último producto agregado,
- limpiar el pedido,
- o confirmar la compra.

### 6.6 Preguntas frecuentes
Se incluye una sección de preguntas frecuentes con respuestas desplegables para:
- delivery,
- horario,
- y métodos de pago.

---

## 7. Requisitos técnicos

Para ejecutar el proyecto se necesita:
- un navegador moderno,
- y acceso a los archivos del proyecto.

No se requiere instalación adicional si se abre directamente el archivo `Index.html`.

---

## 8. Instalación y ejecución

### Opción 1: abrir directamente
1. Abrir la carpeta del proyecto.
2. Ejecutar el archivo `Index.html`.

### Opción 2: usar un servidor local
1. Abrir la carpeta en Visual Studio Code.
2. Instalar la extensión Live Server.
3. Hacer clic derecho en `Index.html`.
4. Seleccionar `Open with Live Server`.

---

## 9. Manual de usuario

### 9.1 Interfaz principal
La interfaz está dividida en dos partes:
- panel del chat,
- y panel lateral del pedido.

### 9.2 Cómo interactuar
El usuario puede escribir mensajes en la caja de texto o usar los botones rápidos.

#### Ejemplos de mensajes válidos
- `menu`
- `combo clásico`
- `promo`
- `2 papas`
- `una bebida`
- `pago con nequi`
- `dirección: Calle 123 #45-67`
- `tiempo de entrega`
- `editar`
- `confirmar`

### 9.3 Botones rápidos
El sistema incluye botones para:
- ver el menú,
- probar un combo,
- ver promociones,
- y obtener ayuda.

### 9.4 Flujo de uso recomendado
1. Escribir `menu`.
2. Seleccionar o pedir un producto.
3. Agregar dirección.
4. Elegir método de pago.
5. Consultar tiempo de entrega.
6. Confirmar el pedido.

---

## 10. Estructura de archivos

- `Index.html`: estructura de la interfaz principal.
- `Sytle.css`: estilos visuales del proyecto.
- `Script.js`: lógica del chatbot, manejo del carrito, parsing de mensajes y resumen del pedido.
- `README.md`: documentación del proyecto.

---

## 11. Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript ES6
- LocalStorage del navegador

---

## 12. Limitaciones del proyecto

- No existe conexión real con una base de datos.
- El sistema funciona como prototipo demostrativo.
- Los pagos y direcciones se almacenan de manera local.
- No hay autenticación de usuarios ni integración con plataformas externas.

---

## 13. Conclusiones

RapiBot demuestra cómo una interfaz simple puede convertir una experiencia de compra tradicional en una conversación interactiva y amigable. El proyecto permite visualizar de forma práctica cómo un chatbot puede apoyar procesos básicos de pedidos, mejorando la experiencia del usuario y mostrando el potencial de la automatización en negocios locales.

---

## 14. Recomendaciones para la presentación

Para una mejor demostración en exposición:
- usar frases naturales como `quiero una hamburguesa y papas`,
- mostrar el resumen del pedido,
- indicar una dirección y un método de pago,
- y confirmar el pedido al final.

---

## 15. Anexos

Ejemplo de interacción:
- Usuario: `combo clásico`
- Bot: agrega el combo al pedido y muestra el resumen.
- Usuario: `pago con nequi`
- Bot: registra el método de pago.
- Usuario: `confirmar`
- Bot: muestra el pedido final confirmado.

Si quieres, puedo dejarte una segunda versión aún más formal, con formato tipo informe universitario, portada, abstract y bibliografía.