'use strict';

const Hapi = require('hapi');
const Boom = require('boom');
const path = require('path');

const server = Hapi.Server({
  host: 'localhost',
  port: 3000
});

async function start() {
  // static file serving
  await server.register({ plugin: require('inert') });

  [ ['/', path.join(__dirname, 'index.html')],
  ['/app.js', path.join(__dirname, 'app.js')],
  ['/jquery.js',
    path.join(__dirname, 'node_modules', 'jquery', 'dist', 'jquery.js')],
  ['/opossum.js', path.join(__dirname, 'node_modules', 'opossum', 'dist', 'opossum.js')]
  ].map(entry => {
    server.route({
      method: 'GET',
      path: entry[0],
      handler: (request, h) => h.file(entry[1])
    });
  });

  const baseline = 20;
  let delay = baseline;
  server.route({
    method: 'GET',
    path: '/flakeyService',
    handler: function flakeyService (request, h) {
      console.log('Flakey service delay', delay);
      // if we're really slowing down, just reply with an error
      if (delay > 1000) {
        console.log('Long delay encountered, returning Error 423 (Locked)');
        return Boom.locked('Flakey service is flakey');
      }
      return new Promise((resolve, reject) => {
        setTimeout(() => {
          console.log('Replying with flakey response after delay of', delay);
          delay = delay * 2;
          resolve({
            body: 'Flakey service response',
            delay        })
        }, delay);
      });
    }
  });

  // reset the delay every 10 seconds
  setInterval(() => {
    if (delay !== baseline) {
      delay = baseline;
      console.log('Resetting flakey service delay to', delay);
    }
  }, 20000);


  await server.start(err => {
    possibleError(err);
    console.log(`Server: ${server.info.uri}`);
    console.log('Endpoints:');
    server.table().map(entry => {
      entry.table.map(route => {
        console.log(`${route.method} ${route.path}`);
      });
    });
  });
  
}

process.on('uncaughtException', e => {
  process._rawDebug(`Uncaught exception ${e}`);
});

function possibleError (err) {
  if (err) throw err;
}

start();