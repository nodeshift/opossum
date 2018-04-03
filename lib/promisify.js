'use strict';

function promisify (func) {
  function promisifiedFunction () {
    return new Promise((resolve, reject) => {
      const cb = (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      };
      const args = Array.prototype.slice.call(arguments);
      args.push(cb);
      func.apply(func, args);
    });
  }
  return promisifiedFunction;
}

module.exports = promisify;
