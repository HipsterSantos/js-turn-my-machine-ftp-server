const net = require('net');
const fs = require('fs');
const path = require('path');

class FTPServer {
  constructor({ host = '0.0.0.0', port = 21, rootDir = process.cwd() } = {}) {
    this.host = host;
    this.port = port;
    this.rootDir = rootDir;
    this.server = net.createServer(this.handleConnection.bind(this));
  }

  start() {
    this.server.listen(this.port, this.host, () => {
      console.log(`FTP server started on ${this.host}:${this.port}`);
    });
  }

  handleConnection(socket) {
    socket.write('220 Welcome to the custom FTP server\r\n');
    let currentDir = this.rootDir;

    socket.on('data', (data) => {
      const command = data.toString().trim();
      console.log(`Command received: ${command}`);

      if (command.startsWith('USER')) {
        socket.write('331 User name okay, need password\r\n');
      } else if (command.startsWith('PASS')) {
        socket.write('230 User logged in, proceed\r\n');
      } else if (command.startsWith('PWD')) {
        socket.write(`257 "${currentDir}" is the current directory\r\n`);
      } else if (command.startsWith('LIST')) {
        const files = fs.readdirSync(currentDir).join('\r\n');
        socket.write('150 Here comes the directory listing\r\n');
        socket.write(files + '\r\n226 Directory send okay\r\n');
      } else if (command.startsWith('QUIT')) {
        socket.write('221 Goodbye\r\n');
        socket.end();
      } else {
        socket.write('502 Command not implemented\r\n');
      }
    });
  }
}

module.exports = FTPServer;