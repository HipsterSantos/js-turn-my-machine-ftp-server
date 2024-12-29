const { FTPServer } = require('../src');

const server = new FTPServer({ host: '127.0.0.1', port: 2222, rootDir: '/tmp' });
server.start();