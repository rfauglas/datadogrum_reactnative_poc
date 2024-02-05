const express = require('express');
const zlib = require('node:zlib');
const https = require('https');
// const http = require('http');
const fs = require('fs');
const app = express();
const port = 8080;

const options = {
  key: fs.readFileSync('server.key'),
  cert: fs.readFileSync('server.crt'),
};

// Use this middleware to get the raw body
app.use((req, res, next) => {
  let data = [];
  req.on('data', chunk => {
    data.push(chunk);
  });
  req.on('end', () => {
    req.rawBody = Buffer.concat(data);
    next();
  });
});

app.post('/api/v2/*', (req, res) => {
  const repostOptions = {
    hostname: 'browser-intake-datadoghq.eu',
    // hostname: 'browser-intake-datadoghq.com',
    port: 443,
    path: req.originalUrl,
    method: 'POST',
    headers: req.headers,
  };
  const repostReq = https.request(repostOptions, repostRes => {
    console.log(`STATUS: ${repostRes.statusCode}`);
    res.writeHead(repostRes.statusCode, repostRes.headers);

    let bodyChunks = [];
    repostRes.on('data', chunk => {
      bodyChunks.push(chunk);
      res.write(chunk);
    });

    repostRes.on('end', () => {
      const responseBody = Buffer.concat(bodyChunks).toString();
      console.log('Responce body');
      console.log(responseBody);
      res.end();
    });
  });

  repostReq.on('error', e => {
    console.error(`problem with request: ${e.message}`);
    res.status(500).send(`Error reposting request: ${e.message}`);
  });

  // Write the raw body to the request
  if (req.rawBody) {
    repostReq.write(req.rawBody);
  }
  repostReq.end();
});

app.connect('*', (req, res) => {
  // Handle the CONNECT request here
  logReceivedRequest('connect', req, res);
});

const logReceivedRequest = (type, req, res) => {
  console.log('Received ', type);
  console.log(req.headers);
  console.log(req.body);
  res.send('hello');
};

https.createServer(options, app).listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
