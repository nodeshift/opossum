# opossum

Opossum is a Node.js circuit breaker that executes asynchronous functions
and monitors their execution status. When things start failing, `opossum`
plays dead and fails fast. If you want, you can provide a fallback function
to be executed when in the failure state.

For more about the circuit breaker pattern, there are lots of resources
on the web - search it! Here is one place to
[start reading](http://martinfowler.com/bliki/CircuitBreaker.html).

## Usage

Let's say you've got an API that depends on something that might fail -
a network operation, or disk read, for example. Wrap that puppy up in a
`CircuitBreaker` and you have control over your destiny.

```javascript
const circuitBreaker = require('opossum');

function asyncFunctionThatCouldFail (x, y) {
  return new Promise((resolve, reject) => {
    // Do something, maybe on the network or a disk
  });
}

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  maxFailures: 5, // Once we fail this many times in a row, start failing fast
  resetTimeout: 30000 // After 30 seconds, try again.
};
const breaker = circuitBreaker(asyncFunctionThatCouldFail, options);

breaker.fire('foo', 'bar')
  .then((result) => console.log(result))
  .catch(console.error);
```

You could also provide a fallback function that will be executed instead
of indicating failure. After the `resetTimeout` expires, `opossum` will try
the circuit again.

```javascript
const breaker = circuitBreaker(asyncFunctionThatCouldFail, options);
// if asyncFunctionThatCouldFail starts to fail, firing the breaker
// will trigger our fallback function
breaker.fallback(() => 'Sorry, out of service right now');
```