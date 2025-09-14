const express = require('express')
const routes = require('./routes/index')
const app = express();


app.use(express.json());
//app.use(express.urlencoded({ extended: true })); //No se si se usa


app.use("/api", routes);

app.use((req, res) => {
    res.status(404).send('404 - Page not found');
});


module.exports = app;
