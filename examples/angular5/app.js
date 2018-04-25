'use strict';

const Hapi = require('hapi');
const flakeyService = require('./service');

const server = Hapi.Server({
  host: 'localhost',
  port: 3030
});
init(server);

process.on('uncaughtException', e => {
  process._rawDebug(`Uncaught exception ${e}`);
  process.exit(1);
});

async function init (server) {
  // static file serving
  await server.register(require('inert'));
  server.route({
    method: 'GET',
    path: '/{param*}',
    handler: {
      directory: {
        path: 'dist'
      }
    }
  });

  // flakey service
  server.route({
    method: 'GET',
    path: '/flakeyService',
    handler: flakeyService
  });

  await server.start().catch(err => {
    console.error(err);
    process.exit(1);
  });

  console.log(`Server: ${server.info.uri}`);
  console.log('Endpoints:');
  server.table().map(route => {
    console.log(`${route.method} ${route.path}`);
  });
}
