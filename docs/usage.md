# Usage Guide
1. Install the package using `npm install my-ftp-library`.
2. Import and configure your server.

```js
const { FTPServer } = require('my-ftp-library');

const server = new FTPServer({ port: 2121 });
server.start();
```