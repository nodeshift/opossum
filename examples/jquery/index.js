'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
const path = require('path');
const util = require('util');

const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 3000
});

// static file serving
server.register(require('inert', (err) => possibleError(err)));

[ ['/', path.join(__dirname, 'index.html')],
  ['/app.js', path.join(__dirname, 'app.js')],
  ['/jquery.js', path.join(__dirname, 'node_modules', 'jquery', 'dist', 'jquery.js')],
  ['/opossum.js', path.join(__dirname, '..', '..', 'dist', 'opossum.js')]
].map((entry) => {
  server.route({
    method: 'GET',
    path: entry[0],
    handler: {
      file: {
        path: entry[1],
        confine: false
      }
    }
  });
});

const baseline = 20;
let delay = baseline;
server.route({
  method: 'GET',
  path: '/flakeyService',
  handler: function flakeyService (request, reply) {
    console.log('Flakey service delay', delay);
    // if we're really slowing down, just reply with an error
    if (delay > 1000) {
      console.log('Long delay encountered, returning Error 423 (Locked)');
      return reply(
        Boom.locked(util.format({ body: 'Flakey service is flakey' })));
    }
    const response = reply({
      body: 'Flakey service response',
      delay
    }, delay).hold();
    setTimeout(() => {
      console.log('Replying with flakey response after delay of', delay);
      delay = delay * 2;
      response.send();
    }, delay);
  }
});

// reset the delay every 10 seconds
setInterval(() => {
  delay = baseline;
  console.log('Resetting flakey service delay to', delay);
}, 20000);

server.start((err) => {
  possibleError(err);
  console.log(`Server: ${server.info.uri}`);
  console.log('Endpoints:');
  server.table().map((entry) => {
    entry.table.map((route) => {
      console.log(`${route.method} ${route.path}`);
    });
  });
});

process.on('uncaughtException', (e) => {
  process._rawDebug(`Caught exception ${e}`);
});

function possibleError (err) {
  if (err) throw err;
}

