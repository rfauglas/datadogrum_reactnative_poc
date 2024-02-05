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

app.use(express.json());
app.use(function (req, res, next) {
  if (req.originalUrl.match('logs')) {
    console.log('logs request are not compressed');
    next();
    return;
  }
  const callback = (err, result) => {
    if (!err) {
      req.body = result;
      next();
    } else {
      next(err);
    }
  };
  var data = [];
  var encoding = req.headers['content-encoding'];
  req.addListener('data', function (chunk) {
    data.push(new Buffer(chunk));
  });
  req.addListener('end', function () {
    buffer = Buffer.concat(data);
    if (encoding == 'gzip') {
      zlib.gunzip(buffer, function (err, decoded) {
        callback(err, decoded && decoded.toString());
      });
    } else if (encoding == 'deflate') {
      zlib.inflate(buffer, function (err, decoded) {
        callback(err, decoded && decoded.toString());
      });
    } else {
      callback(null, buffer.toString());
    }
  });
});

app.post('/api/v2/*', (req, res) => {
  const repostOptions = {
    hostname: 'browser-intake-datadoghq.eu',
    port: 443,
    path: req.path,
    method: 'POST',
    headers: req.headers,
    body: req.body,
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

  repostReq.write(JSON.stringify(req.body));
  repostReq.end();
});

// app.post('/api/v2/logs', (req, res) => {
//   logReceivedRequest('logs', req, res);
// });

// app.post('/api/v2/rum', (req, res) => {

//   logReceivedRequest('rum', req, res);
// });

// app.post('/api/v2/spans', (req, res) => {
//   logReceivedRequest('trace', req, res);
// });

// app.post('/api/v2/replay', (req, res) => {
//   logReceivedRequest('sr', req, res);
// });

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
