require('dotenv').config();

import "core-js/stable";
import "regenerator-runtime/runtime";

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const { helloWorld, tcpScan } = require('./scan-scripts');

const jsonParser = bodyParser.json();

const app = express();

app.use(cors());

const API_PORT = process.env.API_PORT || 4040;

// async port requester - calls scan script for each port
async function portRequest(ip, port) {
  const { address, responseText } = await tcpScan(ip, port);
  return { 
    port,
    address,
    responseText,
  };
}

const range = (begin, end) =>
  Array(Math.ceil(end - begin)).fill(begin).map((x, y) => x + y);

app.post('/scanner', jsonParser, (req, res) => {
  // destructure request values into variables
  const { address, ports, scanWellKnown, scanRegistered, scanEphemeral } = req.body;

  // convert ports body data into clean array
  let parsedPorts = !ports.includes(',') ? [ports.trim()] : ports.split(/[ ,]+/);
  parsedPorts = parsedPorts.filter(Boolean);

  if (scanWellKnown) {
    // spread in well-known port range
    parsedPorts = [...parsedPorts, ...range(0, 1023)].map(String);
  }

  if (scanRegistered) {
    // spread in registered port range
    parsedPorts = [...parsedPorts, ...range(1024, 49151)].map(String);
  }

  if (scanEphemeral) {
    // spread in ephemeral port range
    parsedPorts = [...parsedPorts, ...range(49152, 65535)].map(String);
  }

  // filter out duplicates
  parsedPorts = [...new Set(parsedPorts)];

  // build up requests
  const portRequestPromises = parsedPorts.map(port => portRequest(address, port));
  
  let openPorts = [];
  // handle requests
  Promise.allSettled(portRequestPromises)
    .then(portResults => {
      // loop request results for successes
      portResults.forEach(portResult => {
        const { status } = portResult;
        const { port, responseText, } = portResult.value;
        if (status === 'fulfilled' && responseText !== '') {
          openPorts.push({ port, status, responseText });
        }
      })
      // send open port data to requester
      res.send(openPorts);
    })
});

app.listen(API_PORT);

console.log(`api server is listening on port ${API_PORT}.`);
