require('dotenv').config();

import "core-js/stable";
import "regenerator-runtime/runtime";

const fetch = require('node-fetch');

const cors = require('cors');
const express = require('express');
const bodyParser = require('body-parser');

const { helloWorld } = require('./scan-scripts');

const jsonParser = bodyParser.json();

const app = express();

app.use(cors());

const API_PORT = process.env.API_PORT || 4040;

// async port requester - calls scan script for each port
async function portRequest(address, port) {
  const { url, status, responseText } = await helloWorld(address, port);
  return { 
    port,
    url,
    status,
    responseText,
  };
}

app.post('/scanner', jsonParser, (req, res) => {
  // destructure request values into variables
  const { address, ports, scanWellKnown } = req.body;

  // log requests to std out
  console.log({
    headers: req.headers,
    body: req.body,
  });

  // convert ports body data into clean array
  let parsedPorts = !ports.includes(',') ? [ports.trim()] : ports.split(/[ ,]+/);
  parsedPorts = parsedPorts.filter(Boolean);

  if (scanWellKnown) {
    // spread in well-known port values
    parsedPorts = [...parsedPorts, ...Array(1023).keys()].map(String);
    // filter out duplicates
    parsedPorts = [...new Set(parsedPorts)];
  }

  // build up requests
  const portRequestPromises = parsedPorts.map(port => portRequest(address, port));
  
  let openPorts = [];
  // handle requests
  Promise.allSettled(portRequestPromises)
    .then(portResults => {
      // loop request results for successes
      portResults.forEach(portResult => {
        const { status } = portResult;
        if (status === 'fulfilled') {
          const { port, responseText, } = portResult.value;
          openPorts.push({ port, status, responseText });
        }
      })
      // send open port data to requester
      res.send(openPorts);
    })
});

app.listen(API_PORT);

console.log(`api server is listening on port ${API_PORT}.`);
