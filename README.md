# FTP Library

A lightweight FTP server library for Node.js. Fully compliant with RFC 959, this library is designed to be fast, reliable, and customizable. It is ideal for developers needing an FTP server for development, testing, or lightweight production use.

## Features
- Simple API for creating FTP servers.
- Customizable port, host, and root directory settings.
- Built-in authentication and directory listing support.
- Lightweight, fast, and easy to extend.
- **Newly Added Commands:** `CWD`, `MKD`, `RMD`, `STAT`, and `HELP` for enhanced functionality.

## Installation
```bash
npm install js-ftp-server
```

## Usage
```js
const { FTPServer } = require('js-ftp-server');

const server = new FTPServer({ port: 2121 });
server.start();
```

## Examples

### **1. Basic Server Setup**
```javascript
const { FTPServer } = require('ftp-library');

const server = new FTPServer({ port: 2121 });
server.start();
```

---

### **2. Custom Port and Host**
```javascript
const { FTPServer } = require('ftp-library');

const server = new FTPServer({ port: 2121, host: '127.0.0.1' });
server.start();
```

---

### **3. Anonymous Access**
```javascript
const { FTPServer } = require('ftp-library');

const server = new FTPServer({ allowAnonymous: true });
server.start();
```

---

### **4. Custom Root Directory**
```javascript
const { FTPServer } = require('ftp-library');

const server = new FTPServer({ rootDir: '/var/ftp' });
server.start();
```

---

### **5. User Authentication**
```javascript
const { FTPServer } = require('ftp-library');
const { validateCredentials } = require('./src/utils');

const server = new FTPServer();

server.handleConnection = (socket) => {
  socket.write('220 Welcome to the custom FTP server\r\n');
  socket.on('data', (data) => {
    const command = data.toString().trim();
    if (command.startsWith('USER admin') && validateCredentials('admin', 'password')) {
      socket.write('230 User logged in, proceed\r\n');
    } else {
      socket.write('530 Login incorrect\r\n');
    }
  });
};

server.start();
```

---

### **6. File Upload**
```javascript
const { FTPServer } = require('ftp-library');
const fs = require('fs');
const path = require('path');

const server = new FTPServer();

server.handleConnection = (socket) => {
  socket.on('data', (data) => {
    const command = data.toString().trim();
    if (command.startsWith('STOR')) {
      const fileName = command.split(' ')[1];
      const writeStream = fs.createWriteStream(path.join(server.rootDir, fileName));
      socket.pipe(writeStream);
      socket.write('226 Transfer complete\r\n');
    }
  });
};

server.start();
```

---

### **7. File Download**
```javascript
const { FTPServer } = require('ftp-library');
const fs = require('fs');
const path = require('path');

const server = new FTPServer();

server.handleConnection = (socket) => {
  socket.on('data', (data) => {
    const command = data.toString().trim();
    if (command.startsWith('RETR')) {
      const fileName = command.split(' ')[1];
      const readStream = fs.createReadStream(path.join(server.rootDir, fileName));
      readStream.pipe(socket);
      socket.write('226 Transfer complete\r\n');
    }
  });
};

server.start();
```

---

### **8. Passive Mode Support**
```javascript
const { FTPServer } = require('ftp-library');

const server = new FTPServer();

server.handleConnection = (socket) => {
  socket.on('data', (data) => {
    const command = data.toString().trim();
    if (command.startsWith('PASV')) {
      socket.write('227 Entering Passive Mode (127,0,0,1,192,168)\r\n');
    }
  });
};

server.start();
```

---

### **9. Logging Commands**
```javascript
const { FTPServer } = require('ftp-library');

const server = new FTPServer();

server.handleConnection = (socket) => {
  socket.on('data', (data) => {
    console.log(`Command received: ${data.toString().trim()}`);
    socket.write('502 Command not implemented\r\n');
  });
};

server.start();
```

---

### **10. Configurable Welcome Message**
```javascript
const { FTPServer } = require('ftp-library');

const server = new FTPServer();

server.handleConnection = (socket) => {
  socket.write('220 Welcome to My Custom FTP Server\r\n');
};

server.start();
```

---

### **11. Multiple Connections**
```javascript
const { FTPServer } = require('ftp-library');

const server = new FTPServer();

server.handleConnection = (socket) => {
  console.log('New connection established');
  socket.write('220 Ready\r\n');
};

server.start();
```

---

### **12. Rename File**
```javascript
const { FTPServer } = require('ftp-library');
const fs = require('fs');

const server = new FTPServer();

server.handleConnection = (socket) => {
  socket.on('data', (data) => {
    const command = data.toString().trim();
    if (command.startsWith('RNFR')) {
      const oldName = command.split(' ')[1];
      socket.once('data', (newData) => {
        const newName = newData.toString().trim().split(' ')[1];
        fs.renameSync(oldName, newName);
        socket.write('250 File renamed\r\n');
      });
    }
  });
};

server.start();
```

---

### **13. Delete File**
```javascript
const { FTPServer } = require('ftp-library');
const fs = require('fs');

const server = new FTPServer();

server.handleConnection = (socket) => {
  socket.on('data', (data) => {
    const command = data.toString().trim();
    if (command.startsWith('DELE')) {
      const fileName = command.split(' ')[1];
      fs.unlinkSync(fileName);
      socket.write('250 File deleted\r\n');
    }
  });
};

server.start();
```

---

### **14. Custom Command Implementation**
```javascript
const { FTPServer } = require('ftp-library');

const server = new FTPServer();

server.handleConnection = (socket) => {
  socket.on('data', (data) => {
    const command = data.toString().trim();
    if (command === 'MYCMD') {
      socket.write('200 Custom command executed\r\n');
    }
  });
};

server.start();
```

---

### **15. Advanced Logging**
```javascript
const { FTPServer } = require('ftp-library');
const fs = require('fs');

const logStream = fs.createWriteStream('./ftp-commands.log', { flags: 'a' });

const server = new FTPServer();

server.handleConnection = (socket) => {
  socket.on('data', (data) => {
    const command = data.toString().trim();
    logStream.write(`${new Date().toISOString()} - ${command}\n`);
    socket.write('502 Command not implemented\r\n');
  });
};

server.start();
```

---

## License
MIT
