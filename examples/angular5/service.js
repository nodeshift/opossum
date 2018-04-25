'use strict';

const Boom = require('boom');

// reset the delay every 10 seconds
const baseline = 20;
let delay = baseline;
setInterval(() => {
  if (delay !== baseline) {
    delay = baseline;
    console.log('Resetting flakey service delay to', delay);
  }
}, 20000);

function flakeyService (request, h) {
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
        delay
      });
    }, delay);
  });
}

module.exports = flakeyService;
