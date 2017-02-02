'use strict';

const Boom = require('boom');

module.exports = exports = function flakeyService (options) {
  console.log('Flakey seneca service delay', options.delay);
  const baseline = options.delay;
  let delay = baseline;

  // reset the delay every 20 seconds
  setInterval(() => {
    if (delay !== baseline) {
      delay = baseline;
      console.log('Resetting flakey seneca service delay to', delay);
    }
  }, 20000);

  this.add('name:flakeyService', (msg, respond) => {
    // if we're really slowing down, just reply with an error
    if (delay > 1000) {
      console.log('Long delay encountered, returning Error 423 (Locked)');
      return respond(Boom.locked('Flakey seneca service is flakey'));
    }
    const response = {
      body: 'Flakey seneca service response',
      delay
    };
    // simplistic way to block
    const now = Date.now();
    const stop = now + delay;
    while (Date.now() < stop) {
      // sit-n-spin
    }
    console.log('Replying with flakey response after delay of', delay);
    delay = delay * 2;
    respond(null, response);
  });
};
