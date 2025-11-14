require('dotenv').config();
const Server = require('./server.js');

const server = new Server();

server.listen();
