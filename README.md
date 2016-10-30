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

### Promises vs. Callbacks
The `opossum` API uses a `Promise` as a return value for a breaker that
has been fired. But your circuit action - the async function that might fail -
doesn't have to return a promise. In fact it doesn't have to even be a function.
Check this out.

```javascript
const breaker = circuitBreaker('foo', options);

breaker.fire()
  .then((result) => console.log(result)) // logs 'foo'
  .catch(console.error);
```

OK, that's kind of intesting, but maybe you're still stuck on this whole
promises thing. What about Node.js APIs? All those async I/O bound functions
take a callback. How do you deal with that? Easy, my friend - just `promisify` it.

```javascript
const fs = require('fs');
const circuitBreaker = require('opossum');

const readFile = circuitBreaker.promisify(fs.readFile);
const breaker = circuitBreaker(readFile, options);

breaker.fire('./package.json', 'utf-8')
  .then((result) => console.log(result.toString()))
  .catch(console.error);
```

## More to come
