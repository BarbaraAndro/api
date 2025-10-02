const socket = io();
const form = document.getElementById("addForm");
const btndelete = document.getElementsByClassName("btnDelete");
const productsContainer = document.querySelector(".card_container");

document.addEventListener("DOMContentLoaded", () => {
    const btnAddProduct = document.querySelectorAll(".btnAddProduct");
    btnAddProduct.forEach((btn) => {
        btn.addEventListener("click", async () => {
            const pid = btn.dataset.id;
            let cid = localStorage.getItem("cartId");
            if (!cid) {
                
                const res = await fetch("/api/carts", { method: "POST" });
                if (!res.ok) {
                    alert("Error creando el carrito ❌");
                    return;
                }
                const newCart = await res.json();
                cid = newCart._id;
                localStorage.setItem("cartId", cid);
            }
            const res = await fetch(`/api/carts/${cid}/product/${pid}`, {
                method: "POST",
            });
            if (res.ok) {
                Swal.fire({
                    position: "top-end",
                    icon: "success",
                    title: "Se añadió el producto al carrito",
                    showConfirmButton: false,
                    timer: 1500
                });
            } else {
                alert("Error al agregar al carrito ❌");
            }
        });
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const btnEmpty = document.querySelector(".btnEmptyCart");
    if (!btnEmpty) return;
    btnEmpty.addEventListener("click", async () => {
        const cid = btnEmpty.dataset.id;
        try {
            const res = await fetch(`/api/carts/${cid}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Error vaciando carrito");
            window.location.reload();
        } catch (err) {
            console.error(err);
            alert("Error vaciando carrito");
        }
    });
});

document.addEventListener("DOMContentLoaded", () => {
    const container = document.querySelector(".cart_container");
    if (!container) return console.warn("No existe .cart_container");
    container.addEventListener("click", async (e) => {
        const btn = e.target.closest(".btnDeleteOfCart");
        if (!btn) return;
        const pid = btn.dataset.id;
        const cid = window.location.pathname.split("/").pop();
        console.log("Click detectado:", pid, cid);
        try {
            const res = await fetch(`/api/carts/${cid}/product/${pid}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Error eliminando producto");
            btn.closest("li.card").remove(); // elimina del DOM
        } catch (err) {
            console.error(err);
            alert("Error eliminando producto");
        }
    });
});


productsContainer.addEventListener("click", (e) => {
    const btn = e.target.closest(".btnDelete");
    if (!btn) return;
    const productId = btn.dataset.id;
    socket.emit("deleteProduct", productId);
});

socket.on("productDeleted", (productId) => {
    const card = document.querySelector(`.card[data-id="${productId}"]`);
    if (card) card.remove();
});

socket.on("updateProducts", (products) => {
    productsContainer.innerHTML += `
        <li class="card" data-id="${products._id}">
            <img src="${products.thumbnails}" alt="${products.title}">
            <div class="card_text">
                <h2>${products.title}</h2>
                <p>${products.description}</p>
                <h3>$${products.price}</h3>
            </div>
            <button class="btn btnDelete" data-id="${products._id}">❌</button>
        </li>
    `;
});

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

