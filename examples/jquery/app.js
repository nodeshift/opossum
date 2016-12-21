'use strict';
/* global $ circuitBreaker */

(function appInitialization () {
  $(() => {
    $('#flakey').click(() => circuit.fire());
    $('.clear').click(() => $(this).siblings('p').remove());
  });

  const route = '/flakeyService';
  const element = '#flakeyResponse';

  const circuitBreakerOptions = {
    timeout: 500,
    maxFailures: 2,
    resetTimeout: 5000,
    Promise: Promise
  };

  const circuit = circuitBreaker(() => {
    // Return a promise to the circuit
    return new Promise((resolve, reject) => {
      $.get(route)
        .done((data) => resolve(data))
        .fail((err) => {
          reject(err);
          console.error(err);
        });
    });
  }, circuitBreakerOptions);

  circuit.fallback(() => ({ body: `${route} unavailable right now. Try later.` }));

  circuit.on('success',
    (result) => $(element).append(
      makeNode(`SUCCESS: ${JSON.stringify(result)}`)));

  circuit.on('timeout',
    () => $(element).append(
      makeNode(`TIMEOUT: ${route} is taking too long to respond.`)));

  circuit.on('reject',
    () => $(element).append(
      makeNode(`REJECTED: The breaker for ${route} is open. Failing fast.`)));

  circuit.on('open',
    () => $(element).append(
      makeNode(`OPEN: The breaker for ${route} just opened.`)));

  circuit.on('halfOpen',
    () => $(element).append(
      makeNode(`HALF_OPEN: The breaker for ${route} is half open.`)));

  circuit.on('close',
    () => $(element).append(
      makeNode(`CLOSE: The breaker for ${route} has closed. Service OK.`)));

  circuit.on('fallback',
    (data) => $(element).append(
      makeNode(`FALLBACK: ${JSON.stringify(data)}`)));

  function callService () {
    circuit.fire()
      .catch((e) => {
        $(element).append(makeNode(`ERROR: ${JSON.stringify(e)}`));
        console.error(e);
      });
  }

  function makeNode (body) {
    const response = document.createElement('p');
    $(response).addClass(body.substring(0, body.indexOf(':')).toLowerCase());
    response.append(body);
    return response;
  }
})();
