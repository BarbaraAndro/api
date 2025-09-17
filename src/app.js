const express = require('express')
const routes = require('./routes/index')
const app = express();
const fs = require("fs");
const path = require("path")
const { paths } = require("./config/config");
const products = require("./data/products.json")
const handlebar = require("express-handlebars");
const { Server } = require("socket.io")
const http = require("http");
const server = http.createServer(app);

app.engine("hbs", handlebar.engine({
    extname: ".hbs",
    defaultLayout: "main",
    partialsDir: path.join(__dirname, "views/partials"),
    pagesDir: path.join(__dirname, "views/pages"),
}));
app.set("view engine", "hbs")
app.set("views", path.join(__dirname, "views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/public", express.static(paths.public));

function getProducts() {
    const data = fs.readFileSync(path.join(__dirname, "data/products.json"), "utf-8");
    return JSON.parse(data);
}

app.get("/", (req, res) => {
    const products = getProducts()
    return res.render("pages/home", { products })
})
app.get("/products", (req, res) => {
    const products = getProducts()
    return res.render("pages/realTimeProducts", { products })
})
app.use("/api", routes);

app.use((req, res) => {
    res.status(404).send('404 - Page not found');
});

const ProductController = require("../src/controllers/product.controler");
const productsController = new ProductController();

const io = new Server(server);
io.on("connection", (socket) => {
    console.log(`Usuario ID: ${socket.id} conectado`);

    socket.on("newProduct", async (newProduct) => {
        const savedProduct = await productsController.addProductSocket(newProduct);
        const updatedProducts = await productsController.getProductsSocket();
        io.emit("updateProducts", savedProduct);
    });

    socket.on("deleteProduct", async (productId) => {
        console.log("deleteProduct recibido:", productId);
        await productsController.deleteProductSocket(productId);
        console.log("emitiendo productDeleted:", productId);
        io.emit("productDeleted", productId);
    });

    socket.on("disconnect", (data) => {
        console.log("----> ", data);
        console.log("Cliente desconectado:", socket.id);
    });
});

module.exports = server;


