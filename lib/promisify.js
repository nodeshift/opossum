const Fidelity = require('fidelity');

module.exports = exports = function promisify (func) {
  return function promisifiedFunction () {
    return new Fidelity((resolve, reject) => {
      const cb = (err, result) => {
        if (err) reject(err);
        resolve(result);
      };
      const args = Array.prototype.slice.call(arguments);
      args.push(cb);
      func.apply(func, args);
    });
  };
};
