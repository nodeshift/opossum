'use strict';
/* global $ window */

(function appInitialization () {
  $(() => {
    $('#flakey').click(_ => circuit.fire().catch(console.error));
    $('.clear').click(_ => {
      $('.clear').parent().find('#flakeyResponse').remove();
    });
  });

  const route = '/flakeyService';
  const element = '#flakeyResponse';

  const circuitBreakerOptions = {
    timeout: 500,
    errorThresholdPercentage: 50,
    resetTimeout: 5000
  };

  const circuit = circuitBreaker(_ => $.get(route), circuitBreakerOptions);

  circuit.fallback(_ =>
    ({ body: `${route} unavailable right now. Try later.` }));

  circuit.status.on('snapshot', stats => {
    const response = document.createElement('p');
    $(response).addClass('stats');
    Object.keys(stats).forEach(key => {
      const p = document.createElement('p');
      p.append(`${key}: ${stats[key]}`);
      $(response).append(p);
    });

    $('#stats').children().replaceWith($(response));
  });

  circuit.on('success',
    result => $(element).prepend(
      makeNode(`SUCCESS: ${JSON.stringify(result)}`)));

  circuit.on('timeout',
    () => $(element).prepend(
      makeNode(`TIMEOUT: ${route} is taking too long to respond.`)));

  circuit.on('reject',
    () => $(element).prepend(
      makeNode(`REJECTED: The breaker for ${route} is open. Failing fast.`)));

  circuit.on('open',
    () => $(element).prepend(
      makeNode(`OPEN: The breaker for ${route} just opened.`)));

  circuit.on('halfOpen',
    () => $(element).prepend(
      makeNode(`HALF_OPEN: The breaker for ${route} is half open.`)));

  circuit.on('close',
    () => $(element).prepend(
      makeNode(`CLOSE: The breaker for ${route} has closed. Service OK.`)));

  circuit.on('fallback',
    data => $(element).prepend(
      makeNode(`FALLBACK: ${JSON.stringify(data)}`)));

  function makeNode (body) {
    const response = document.createElement('p');
    $(response).addClass(body.substring(0, body.indexOf(':')).toLowerCase());
    response.append(body);
    return response;
  }
})();
