'use strict';

module.exports = exports = semaphore;

function semaphore (count) {
  const resolvers = [];
  let counter = count;

  const sem = {
    take,
    release,
    test
  };

  Object.defineProperty(sem, 'count', {
    get: _ => counter,
    enumerable: true
  });

  return sem;

  function take (timeout) {
    if (counter > 0) {
      --counter;
      return Promise.resolve(release);
    }
    return new Promise((resolve, reject) => {
      resolvers.push(_ => {
        --counter;
        resolve(release);
      });
      if (timeout) {
        setTimeout(_ => {
          resolvers.shift();
          const err = new Error(`Timed out after ${timeout}ms`);
          err.code = 'ETIMEDOUT';
          reject(err);
        }, timeout);
      }
    });
  }

  function release () {
    counter++;
    if (resolvers.length > 0) {
      resolvers.shift()();
    }
  }

  function test () {
    if (counter < 1) return false;
    return take() && true;
  }
}
