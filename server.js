const express = require('express');
const cors = require('cors');
const http = require('http');
const logger = require('morgan');
const { dbCriptografia } = require('./criptografia/database/config.js');

class Server {
    constructor(){
        this.app = express();
        this.port = process.env.PORT || 3000;
	console.log(this.port)
        this.middlewares();
        this.conectarDB();
        this.routes();
    }

    async conectarDB(){
      try {
        await dbCriptografia.authenticate();
      } catch (error) {
        console.log(error);
        throw new Error(error);
      }
    }

    middlewares(){
    this.app.use(cors());
    this.app.use(logger('dev'));
    this.app.set('port', this.port);

    this.app.use(express.json())

    // directorio publico
    this.app.use(express.static('public'));

    }

    routes(){
      this.app.use('/auth', require('./criptografia/routes/auth.js'));
        this.app.use('/admin', require('./criptografia/routes/admin.js'));
        this.app.use('/firma-ciega', require('./criptografia/routes/firmaciega.js'));
        this.app.use('/encuestas', require('./criptografia/routes/encuestas.js'));
        this.app.use('/respuestas', require('./criptografia/routes/respuestas.js'));
    }

    listen(){
        const server =
          http.createServer(this.app);
          server.listen(this.port);
          server.on('error', (error) => {
            console.log(error);
            process.exit(1);
          });
        server.on('listening', () => {
          console.log('Api listen on port', this.port);
          });
    }

}
module.exports = Server;
