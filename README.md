# My FTP Library

A lightweight FTP server library built from scratch. Fully compliant with RFC 959.

## Features
- Simple API
- Lightweight and fast
- Built-in examples

## Installation
```bash
npm install my-ftp-library
```

## Usage
```js
const { FTPServer } = require('my-ftp-library');

const server = new FTPServer({ port: 2121 });
server.start();
```

## License
MIT

// LICENSE
MIT License