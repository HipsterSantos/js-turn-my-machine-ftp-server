const { FTPServer } = require('../src');

const server = new FTPServer({ port: 2121 });
server.start();