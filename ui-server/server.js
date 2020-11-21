require('dotenv').config();

const express = require('express');
const path = require('path');

const UI_PORT = process.env.UI_PORT || 8080;

const app = express();
app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, '../build')));
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, '../build', 'index.html'));
});

app.listen(UI_PORT);

console.log(`ui server is listening on port ${UI_PORT}.`);
