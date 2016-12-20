'use strict';
/* global $ circuitBreaker */

(function appInitialization () {
  const route = '/flakeyService';
  const element = '#flakeyResponse';

  const circuitBreakerOptions = {
    timeout: 500,
    maxFailures: 2,
    resetTimeout: 5000,
    Promise: Promise
  };

  const circuit = circuitBreaker((route, element) => {
    circuit.fallback(() => ({ body: `${route} unavailable right now. Try later.` }));

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

  circuit.on('success',
    (data) => $(element).append(makeNode(`SUCCESS: ${JSON.stringify(data)}`)));

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

  function makeNode (body) {
    const response = document.createElement('p');
    $(response).addClass(body.substring(0, body.indexOf(':')).toLowerCase());
    response.append(body);
    return response;
  }

  function callService () {
    circuit.fire(route, element).catch((e) => console.error(e));
  }

  $(() => {
    $('#flakey').click(callService);
    $('.clear').click(function () { $(this).siblings('p').remove(); });
  });
})();
