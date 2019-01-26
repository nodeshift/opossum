'use strict';

// Gateway for our seneca microservices
const Hapi = require('hapi');
const path = require('path');
const seneca = require('seneca')();
const opossum = require('opossum');

const server = Hapi.Server({
  host: 'localhost',
  port: 3000
});
const circuit = opossum(serviceFactory({ name: 'flakeyService' }));

function serviceFactory (service) {
  return () =>
    new Promise((resolve, reject) => {
      seneca.act(service, (error, result) => {
        error ? reject(error) : resolve(result);
      });
    });
}

// in process seneca
seneca.use('service', { delay: 20 });

async function start () {
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

  server.route({
    method: 'GET',
    path: '/flakeyService',
    handler: (request, h) => circuit.fire()
  });

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

  process.on('uncaughtException', e => {
    process._rawDebug(`Uncaught exception ${e}`);
  });

  function possibleError (err) {
    if (err) throw err;
  }
}

start();
