const server = require('./src/app');
const PORT = 8080;

server.listen(PORT, () => { //volver esto a app
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});

