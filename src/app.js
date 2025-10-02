const express = require('express');
const app = express();
const path = require("path");
const { paths } = require("./config/config");


//MONGOOSE
const config = require("./config/config");
const mongoose = require("mongoose")
require("dotenv").config();
mongoose.connect(config.MONGO_URI)
    .then(() => console.log("MongodB connected"))
    .catch((error) => console.log("Error al conectarse a MongodB", error));

//HANDLEBARS    
const handlebar = require("express-handlebars");
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

//ROUTES
const routes = require('./routes/index');
app.use("/api", routes);

//ERROR PAGE
app.use((req, res) => {
    res.status(404).send('404 - Page not found');
});

//SERVER SOCKET.IO
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server);
const ProductController = require("./controllers/product.controller");
const productsController = new ProductController();

io.on("connection", (socket) => {
    console.log(`Usuario ID: ${socket.id} conectado`);

    socket.on("newProduct", async (newProductData) => {
        const newProduct = await productsController.addProductSocket(newProductData);
        if (newProduct) io.emit("updateProducts", newProduct);
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


