const server = require('./src/app');
const config = require('./src/config/config');

server.listen(config.PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${config.PORT}`);
});

