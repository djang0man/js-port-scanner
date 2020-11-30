require('dotenv').config();

import "core-js/stable";
import "regenerator-runtime/runtime";

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const { scanner } = require('./scan-scripts');

const jsonParser = bodyParser.json();

const app = express();

app.use(cors());

const API_PORT = process.env.API_PORT || 4040;

// async port requester - calls scan script for each port
async function portRequest(ip, port, scanType) {
  console.log(`Scanning port ${port} on ${ip} with ${scanType}`);
  const { address, responseText } = await scanner(ip, port, scanType);
  if (responseText) console.log(`Found ${port}`);
  return { 
    ip,
    port,
    address,
    scanType,
    responseText,
  };
}

const range = (begin, end) =>
  Array(Math.ceil(end - begin)).fill(begin).map((x, y) => x + y);

app.post('/scanner', jsonParser, (req, res) => {
  // destructure request values into variables
  const { ip, ports, scanType, scanWellKnown, scanRegistered, scanEphemeral } = req.body;

  // convert ports body data into clean array
  let parsedPorts = !ports.includes(',') ? [ports.trim()] : ports.split(/[ ,]+/);
  parsedPorts = parsedPorts.filter(Boolean);

  if (scanWellKnown) {
    // spread in well-known port range
    parsedPorts = [...parsedPorts, ...range(0, 1024)].map(String);
  }

  if (scanRegistered) {
    // spread in registered port range
    parsedPorts = [...parsedPorts, ...range(1025, 49152)].map(String);
  }

  if (scanEphemeral) {
    // spread in ephemeral port range
    parsedPorts = [...parsedPorts, ...range(49152, 65536)].map(String);
  }

  // filter out duplicates
  parsedPorts = [...new Set(parsedPorts)];

  // build up requests
  const portRequestPromises = parsedPorts.map(port => portRequest(ip, port, scanType));
  
  let openPorts = [];
  // handle requests
  Promise.allSettled(portRequestPromises)
    .then(portResults => {
      // loop request results for successes
      portResults.forEach(portResult => {
        const { status } = portResult;
        const { port, address, scanType, responseText, } = portResult.value;
        if (status === 'fulfilled' && responseText !== '') {
          openPorts.push({ port, address, scanType, responseText });
        }
      })
    })
    .catch(err => console.error(err))
    // send open port data to requester
    .finally(() => res.send(openPorts))
});

app.listen(API_PORT);

console.log(`api server is listening on port ${API_PORT}.`);
