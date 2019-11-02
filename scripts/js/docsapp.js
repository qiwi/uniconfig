const express = require('express');
const path = require('path');
const app = express();
const ROOT = path.join(__dirname, '../docs/');

app
  .use('/', express.static(`${ROOT}`))
  .listen(3333, '127.0.0.1', () => {
    console.log('Docs are exposed at http://127.0.0.1:3333');
  });