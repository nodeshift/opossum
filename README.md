# opossum
[![Build Status](https://travis-ci.org/bucharest-gold/opossum.svg?branch=master)](https://travis-ci.org/bucharest-gold/opossum)
[![Known Vulnerabilities](https://snyk.io/test/npm/opossum/badge.svg)](https://snyk.io/test/npm/opossum)
[![dependencies Status](https://david-dm.org/bucharest-gold/opossum/status.svg)](https://david-dm.org/bucharest-gold/opossum)

[![NPM](https://nodei.co/npm/opossum.png)](https://npmjs.org/package/opossum)

Opossum is a Node.js circuit breaker that executes asynchronous functions
and monitors their execution status. When things start failing, `opossum`
plays dead and fails fast. If you want, you can provide a fallback function
to be executed when in the failure state.

For more about the circuit breaker pattern, there are lots of resources
on the web - search it! Here is one place to
[start reading](http://martinfowler.com/bliki/CircuitBreaker.html).

|                 | Project Info  |
| --------------- | ------------- |
| License:        | Apache-2.0  |
| Build:          | make  |
| Documentation:  | https://bucharest-gold.github.io/opossum/ |
| Issue tracker:  | https://github.com/bucharest-gold/opossum/issues  |
| Engines:        | Node.js 4.x, 5.x, 6.x

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

When a fallback function is triggered, it's considered a failure, and the
fallback function will continue to be executed until the breaker is closed,
after the `resetTimeout` has expired.

### Promises vs. Callbacks
The `opossum` API uses a `Promise` as a return value for a breaker that
has been fired. But your circuit action - the async function that might fail -
doesn't have to return a promise. Check this out.

```javascript
const fs = require('fs');
const circuitBreaker = require('opossum');

const readFile = circuitBreaker.promisify(fs.readFile);
const breaker = circuitBreaker(readFile, options);

breaker.fire('./package.json', 'utf-8')
  .then(console.log)
  .catch(console.error);
```

Now, you've got easy monitoring of all those Node.js I/O bount functions.
How do you deal with that? Easy, my friend - just `promisify` it.

And just for fun, your circuit doesn't even really have to be a function.
Not sure when you'd use this - but you could if you wanted to.

```javascript
const breaker = circuitBreaker('foo', options);

breaker.fire()
  .then((result) => console.log(result)) // logs 'foo'
  .catch(console.error);
```

### Promise Interoperability

The `Promise` implementation used in `opossum` is compliant with both the
ES6 `Promise` API as well as the `promises/A+` API. This means that it doesn't
matter what flavor of promise your API uses, `opossum` should work fine with
them. If you would like to control what `Promise` implementation used in
`opossum`, provide a `Promise` constructor function in your options when
you create the breaker. E.g.

```javascript
// Force to use native JS promises
const breaker = circuitBreaker(readFile, { Promise: Promise });
```

### Events

A `CircuitBreaker` will emit events for important things that occur.
Here are the events you can listen for.

* `fire` (or `execute`) - emitted when the breaker is fired.
* `reject` - emitted when the breaker is open (or halfOpen).
* `timeout` - emitted when the breaker action times out.
* `success` - emitted when the breaker action completes successfully
* `failure` - emitted when the breaker action fails, called with the error
* `open` - emitted when the breaker state changes to `open`
* `close` - emitted when the breaker state changes to `closed`
* `halfOpen` - emitted when the breaker state changes to `halfOpen`
* `fallback` - emitted when the breaker has a fallback function and executes it
