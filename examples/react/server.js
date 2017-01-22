'use strict';

const Hapi = require('hapi');
const Boom = require('boom');

const server = new Hapi.Server();

server.connection({
  host: 'localhost',
  port: 3001
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
      return reply(Boom.locked('Flakey service is flakey'));
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
  if (delay !== baseline) {
    delay = baseline;
    console.log('Resetting flakey service delay to', delay);
  }
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
  process._rawDebug(`Uncaught exception ${e}`);
});

function possibleError (err) {
  if (err) throw err;
}

