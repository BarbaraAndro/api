const socket = io();
const form = document.getElementById("addForm");
const btndelete = document.getElementById("btnDelete");
const productsContainer = document.querySelector(".card_container");

productsContainer.addEventListener("click", (e) => {
    console.log('entre a eliminar producto');

    const btn = e.target.closest(".btnDelete");
    console.log("imprimo btn",btn)
    if (!btn) return; // si no es botón, salir

    const productId = btn.dataset.id;
    console.log("Eliminar producto con ID:", productId);

    // Emitimos al servidor
    socket.emit("deleteProduct", productId);
});
socket.on("productDeleted", (productId) => {
    console.log("estoy entrando al socket on de productDeleted");
    const card = document.querySelector(`.card[data-id="${productId}"]`);
    if (card) card.remove();
});

// Listener que actualiza los productos en tiempo real
socket.on("updateProducts", (products) => {
    console.log("Recibí productos:", products);
    productsContainer.innerHTML += `
        <li class="card" data-id="${products.id}">
            <img src="${products.thumbnails}" alt="${products.title}">
            <div class="card_text">
                <h2>${products.title}</h2>
                <p>${products.description}</p>
                <h3>$${products.price}</h3>
            </div>
            <button class="btn btnDelete" data-id="${products.id}">❌</button>
        </li>
    `;
});



// Listener del formulario
form.addEventListener("submit", (e) => {
    e.preventDefault();

    const newProduct = {
        title: document.getElementById("input_nombre").value,
        description: document.getElementById("input_descripcion").value,
        code: document.getElementById("input_codigo").value,
        price: document.getElementById("input_precio").value,
        status: document.getElementById("input_estado").value,
        stock: document.getElementById("input_stock").value,
        category: document.getElementById("input_categoria").value,
        thumbnails: document.getElementById("input_imagen").value,
    };

    socket.emit("newProduct", newProduct);

    form.reset();
});

