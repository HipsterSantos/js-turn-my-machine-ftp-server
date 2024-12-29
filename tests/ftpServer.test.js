const { FTPServer } = require('../src');
const net = require('net');
const assert = require('assert');

// Example test: check server start
(async () => {
  const server = new FTPServer({ port: 2121 });
  server.start();

  const client = net.createConnection({ port: 2121 }, () => {
    console.log('Connected to server');
    client.end();
    server.server.close();
  });
})();