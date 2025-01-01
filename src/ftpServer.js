const net = require('net');
const fs = require('fs').promises;
const path = require('path');
const EventEmitter = require('events');

class FTPServer extends EventEmitter {
  constructor({ host = '0.0.0.0', port = 21, rootDir = process.cwd(), welcomeMessage = '220 Welcome to the FTP server' } = {}) {
    super();
    this.host = host;
    this.port = port;
    this.rootDir = rootDir;
    this.welcomeMessage = welcomeMessage;
    this.server = net.createServer(this.handleConnection.bind(this));
  }

  start() {
    this.server.listen(this.port, this.host, () => {
      console.log(`FTP server started on ${this.host}:${this.port}`);
      this.emit('server:start', { host: this.host, port: this.port });
    });
  }

  async handleConnection(socket) {
    socket.write(`${this.welcomeMessage}\r\n`);
    let currentDir = this.rootDir;

    socket.on('data', async (data) => {
      const command = data.toString().trim();
      const [cmd, ...args] = command.split(' ');
      console.log(`Command received: ${command}`);
      this.emit('command:received', { command });

      try {
        switch (cmd.toUpperCase()) {
          case 'USER':
            socket.write('331 User name okay, need password\r\n');
            break;

          case 'PASS':
            socket.write('230 User logged in, proceed\r\n');
            break;

          case 'PWD':
            socket.write(`257 "${currentDir}" is the current directory\r\n`);
            break;

          case 'LIST':
            try {
              const files = await fs.readdir(currentDir);
              socket.write('150 Here comes the directory listing\r\n');
              socket.write(files.join('\r\n') + '\r\n226 Directory send okay\r\n');
            } catch (err) {
              socket.write('450 Requested file action not taken\r\n');
            }
            break;

          case 'CWD':
            const newDir = path.join(currentDir, args.join(' '));
            try {
              await fs.access(newDir);
              currentDir = newDir;
              socket.write(`250 Directory successfully changed to ${currentDir}\r\n`);
            } catch (err) {
              socket.write('550 Failed to change directory\r\n');
            }
            break;

          case 'MKD':
            try {
              const dirToCreate = path.join(currentDir, args.join(' '));
              await fs.mkdir(dirToCreate);
              socket.write(`257 "${dirToCreate}" directory created\r\n`);
            } catch (err) {
              socket.write('550 Failed to create directory\r\n');
            }
            break;

          case 'RMD':
            try {
              const dirToRemove = path.join(currentDir, args.join(' '));
              await fs.rmdir(dirToRemove);
              socket.write(`250 Directory "${dirToRemove}" removed\r\n`);
            } catch (err) {
              socket.write('550 Failed to remove directory\r\n');
            }
            break;

          case 'QUIT':
            socket.write('221 Goodbye\r\n');
            socket.end();
            break;

          case 'STAT':
            socket.write('211 FTP server status OK\r\n');
            break;

          case 'HELP':
            socket.write('214 Supported commands: USER, PASS, PWD, LIST, CWD, MKD, RMD, QUIT, STAT, HELP\r\n');
            break;

          default:
            socket.write('502 Command not implemented\r\n');
        }
      } catch (error) {
        console.error(`Error processing command: ${error.message}`);
        socket.write('550 Internal server error\r\n');
      }
    });

    socket.on('error', (err) => {
      console.error(`Socket error: ${err.message}`);
      this.emit('connection:error', { error: err });
    });

    socket.on('end', () => {
      console.log('Client disconnected.');
      this.emit('connection:close');
    });
  }
}

module.exports = FTPServer;
