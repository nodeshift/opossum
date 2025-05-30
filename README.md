# opossum

![Node.js CI](https://github.com/nodeshift/opossum/workflows/Node.js%20CI/badge.svg)
[![Coverage Status](https://coveralls.io/repos/github/nodeshift/opossum/badge.svg?branch=master)](https://coveralls.io/github/nodeshift/opossum?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/npm/opossum/badge.svg)](https://snyk.io/test/npm/opossum)
[![Dependency Status](https://img.shields.io/librariesio/github/nodeshift/opossum)](https://libraries.io/nodeshift/opossum)

Opossum is a Node.js circuit breaker that executes asynchronous functions
and monitors their execution status. When things start failing, `opossum`
plays dead and fails fast. If you want, you can provide a fallback function
to be executed when in the failure state.

For more about the circuit breaker pattern, there are lots of resources
on the web - search it! Fowler's blog post is one place to
[start reading](http://martinfowler.com/bliki/CircuitBreaker.html).

|                 | Project Info  |
| --------------- | ------------- |
| License:        | Apache-2.0  |
| Documentation:  | https://nodeshift.dev/opossum/ |
| Typings:        | https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/opossum
| Issue tracker:  | https://github.com/nodeshift/opossum/issues  |
| Engines:        | Node.js >= 20 |

## Usage

Let's say you've got an API that depends on something that might fail -
a network operation, or disk read, for example. Wrap those functions up in a
`CircuitBreaker` and you have control over your destiny.

```javascript
const CircuitBreaker = require('opossum');

function asyncFunctionThatCouldFail(x, y) {
  return new Promise((resolve, reject) => {
    // Do something, maybe on the network or a disk
  });
}

const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000 // After 30 seconds, try again.
};
const breaker = new CircuitBreaker(asyncFunctionThatCouldFail, options);

breaker.fire(x, y)
  .then(console.log)
  .catch(console.error);
```

### AbortController support

You can provide an `AbortController` (https://developer.mozilla.org/en-US/docs/Web/API/AbortController, https://nodejs.org/docs/latest/api/globals.html#globals_class_abortcontroller) for aborting on going request upon
reaching Opossum timeout.

```javascript
const CircuitBreaker = require('opossum');
const http = require('http');

function asyncFunctionThatCouldFail(abortSignal, x, y) {
  return new Promise((resolve, reject) => {
    http.get(
      'http://httpbin.org/delay/10',
      { signal: abortSignal },
      (res) => {
        if(res.statusCode < 300) {
          resolve(res.statusCode);
          return;
        }

        reject(res.statusCode);
      }
    );
  });
}

const abortController = new AbortController();
const options = {
  abortController,
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
};
const breaker = new CircuitBreaker(asyncFunctionThatCouldFail, options);

breaker.fire(abortController.signal)
  .then(console.log)
  .catch(console.error);
```

### Auto Renew AbortController

The `autoRenewAbortController` option allows the automatic renewal of the `AbortController` when the circuit breaker transitions into the `halfOpen` or `closed` states. This feature ensures that the `AbortController` can be reused properly for ongoing requests without manual intervention.

```javascript
const CircuitBreaker = require('opossum');
const http = require('http');

function asyncFunctionThatCouldFail(abortSignal, x, y) {
  return new Promise((resolve, reject) => {
    http.get(
      'http://httpbin.org/delay/10',
      { signal: abortSignal },
      (res) => {
        if(res.statusCode < 300) {
          resolve(res.statusCode);
          return;
        }

        reject(res.statusCode);
      }
    );
  });
}

const abortController = new AbortController();
const options = {
  autoRenewAbortController: true,
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
};
const breaker = new CircuitBreaker(asyncFunctionThatCouldFail, options);

const signal = breaker.getSignal();
breaker.fire(signal)
  .then(console.log)
  .catch(console.error);
```

### Fallback

You can also provide a fallback function that will be executed in the
event of failure. To take some action when the fallback is performed,
listen for the `fallback` event.

```javascript
const breaker = new CircuitBreaker(asyncFunctionThatCouldFail, options);
// if asyncFunctionThatCouldFail starts to fail, firing the breaker
// will trigger our fallback function
breaker.fallback(() => 'Sorry, out of service right now');
breaker.on('fallback', (result) => reportFallbackEvent(result));
```

Once the circuit has opened, a timeout is set based on `options.resetTimeout`.
When the `resetTimeout` expires, `opossum` will enter the `halfOpen` state.
Once in the `halfOpen` state, the next time the circuit is fired, the circuit's
action will be executed again. If successful, the circuit will close and emit
the `close` event. If the action fails or times out, it immediately re-enters
the `open` state.

When a fallback function is triggered, it's considered a failure, and the
fallback function will continue to be executed until the breaker is closed.

The fallback function accepts the same parameters as the fire function:

```javascript
const delay = (delay, a, b, c) =>
  new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, delay);
  });

const breaker = new CircuitBreaker(delay);
breaker.fire(20000, 1, 2, 3);
breaker.fallback((delay, a, b, c) => `Sorry, out of service right now. But your parameters are: ${delay}, ${a}, ${b} and ${c}`);
```
### Breaker State Initialization

There may be times where you will need to initialize the state of a Circuit Breaker.  Primary use cases for this are in a serverless environment such as Knative or AWS Lambda, or any container based platform, where the container being deployed is ephemeral.

The `toJSON` method is a helper function to get the current state and status of a breaker:

```
const breakerState = breaker.toJSON();
```

This will return an object that might look similar to this:

```
{
  state: {
    enabled: true,
    name: 'functionName'
    closed: true,
    open: false,
    halfOpen: false,
    warmUp: false,
    shutdown: false
  },
  status: {
    ...
  }
};
```

A new circuit breaker instance can be created with this state by passing this object in:

```
const breaker = new CircuitBreaker({state: state});
```

### Status Initialization

There may also be times where you will need to pre-populate the stats of the Circuit Breaker Status Object.  Primary use cases for this are also in a serverless environment such as Knative or AWS Lambda, or any container based platform, where the container being deployed is ephemeral.

Getting the existing cumulative stats for a breaker can be done like this:

```
const stats = breaker.stats;
```

`stats` will be an object that might look similar to this:

```
{
  failures: 11,
  fallbacks: 0,
  successes: 5,
  rejects: 0,
  fires: 16,
  timeouts: 0,
  cacheHits: 0,
  cacheMisses: 0,
  coalesceCacheHits: 0,
  coalesceCacheMisses: 0,
  semaphoreRejections: 0,
  percentiles: {
    '0': 0,
    '1': 0,
    '0.25': 0,
    '0.5': 0,
    '0.75': 0,
    '0.9': 0,
    '0.95': 0,
    '0.99': 0,
    '0.995': 0
  },
  latencyTimes: [ 0 ],
  latencyMean: 0
}
```

To then re-import those stats, first create a new `Status` object with the previous stats and then pass that as an option to the CircuitBreaker constructor:

```
const statusOptions = {
  stats: {....}
};

const newStatus = CircuitBreaker.newStatus(statusOptions);

const breaker = new CircuitBreaker({status: newStatus});
```

### Browser

Opossum really shines in a browser. You can use it to guard against network
failures in your AJAX calls.

We recommend using [webpack](https://webpack.js.org/) to bundle your applications,
since it does not have the effect of polluting the `window` object with a global.
However, if you need it, you can access a `circuitBreaker` function in the global
namespace by doing something similar to what is shown in the below example.

Here is an example using [hapi.js](https://hapijs.com). See the
[opossum-examples](https://github.com/nodeshift-starters/opossum-examples/)
repository for more detail.

Include `opossum.js` in your HTML file.

```html
<html>
<head>
  <title>My Super App</title>
  <script type='text/javascript' src="/jquery.js"></script>
  <script type='text/javascript' src="/opossum.js"></script>
  <script type='text/javascript' src="/app.js"></script>
<body>
...
</body>
</head>
</html>
```

In your application, set a route to the file, pointing to
`node_modules/opossum/dist/opossum-min.js`.

```js
// server.js
const server = new Hapi.Server();
server.register(require('inert', (err) => possibleError(err)));
server.route({
  method: 'GET',
  path: '/opossum.js',
  handler: {
    file: {
      path: path.join(__dirname, 'node_modules', 'opossum', 'dist', 'opossum-min.js'),
    }
  }
});
```
In the browser's global scope will be a `CircuitBreaker` constructor. Use it
to create circuit breakers, guarding against network failures in your REST
API calls.

```js
// app.js
const route = 'https://example-service.com/rest/route';
const circuitBreakerOptions = {
  timeout: 500,
  errorThresholdPercentage: 50,
  resetTimeout: 5000
};

const breaker = new CircuitBreaker(() => $.get(route), circuitBreakerOptions);
breaker.fallback(() => `${route} unavailable right now. Try later.`));
breaker.on('success', (result) => $(element).append(JSON.stringify(result)}));

$(() => {
  $('#serviceButton').click(() => breaker.fire().catch((e) => console.error(e)));
});

```

### Events

A `CircuitBreaker` will emit events for important things that occur.
Here are the events you can listen for.

  * `fire` - emitted when the breaker is fired.
  * `reject` - emitted when the breaker is open (or halfOpen).
  * `timeout` - emitted when the breaker action times out.
  * `success` - emitted when the breaker action completes successfully
  * `failure` - emitted when the breaker action fails, called with the error
  * `open` - emitted when the breaker state changes to `open`
  * `close` - emitted when the breaker state changes to `closed`
  * `halfOpen` - emitted when the breaker state changes to `halfOpen`
  * `fallback` - emitted when the breaker has a fallback function and executes it
  * `semaphoreLocked` - emitted when the breaker is at capacity and cannot execute the request
  * `healthCheckFailed` - emitted when a user-supplied health check function returns a rejected promise
  * `shutdown` - emitted when the breaker shuts down

Handling events gives a greater level of control over your application behavior.

```js
const breaker = new CircuitBreaker(() => $.get(route), circuitBreakerOptions);

breaker.fallback(() => ({ body: `${route} unavailable right now. Try later.` }));

breaker.on('success',
  (result) => $(element).append(
    makeNode(`SUCCESS: ${JSON.stringify(result)}`)));

breaker.on('timeout',
  () => $(element).append(
    makeNode(`TIMEOUT: ${route} is taking too long to respond.`)));

breaker.on('reject',
  () => $(element).append(
    makeNode(`REJECTED: The breaker for ${route} is open. Failing fast.`)));

breaker.on('open',
  () => $(element).append(
    makeNode(`OPEN: The breaker for ${route} just opened.`)));

breaker.on('halfOpen',
  () => $(element).append(
    makeNode(`HALF_OPEN: The breaker for ${route} is half open.`)));

breaker.on('close',
  () => $(element).append(
    makeNode(`CLOSE: The breaker for ${route} has closed. Service OK.`)));

breaker.on('fallback',
  (data) => $(element).append(
    makeNode(`FALLBACK: ${JSON.stringify(data)}`)));
```


### Promises vs. Callbacks
The `opossum` API returns a `Promise` from `CircuitBreaker.fire()`.
But your circuit action - the async function that might fail -
doesn't have to return a promise. You can easily turn Node.js style
callback functions into something `opossum` understands by using the built in
Node core utility function `util.promisify()` .

```javascript
const fs = require('fs');
const { promisify } = require('util');
const CircuitBreaker = require('opossum');

const readFile = promisify(fs.readFile);
const breaker = new CircuitBreaker(readFile, options);

breaker.fire('./package.json', 'utf-8')
  .then(console.log)
  .catch(console.error);
```

And just for fun, your circuit doesn't even really have to be a function.
Not sure when you'd use this - but you could if you wanted to.

```javascript
const breaker = new CircuitBreaker('foo', options);

breaker.fire()
  .then(console.log) // logs 'foo'
  .catch(console.error);
```

### Calculating errorThresholdPercentage

The `errorThresholdPercentage` value is compared to the error rate. That rate is determined by dividing the number of failures by the number of times the circuit has been fired. You can see this comparison here:

```js
// check stats to see if the circuit should be opened
  const stats = circuit.stats;
  if ((stats.fires < circuit.volumeThreshold) && !circuit.halfOpen) return;
  const errorRate = stats.failures / stats.fires * 100;
  if (errorRate > circuit.options.errorThresholdPercentage || circuit.halfOpen) {
    circuit.open();
  }
```

The numbers for `fires` and `failures` come from the stats that are indeed governed by `rollingCountTimeout` and `rollingCountBuckets`. The timeout value is the total number of seconds for which the stats are being maintained, and the buckets value is the number of slots in the window. The defaults are 10 seconds and 10 buckets. So, the statistics that are being compared against `errorThresholdPercentage` are based on 10 samples, one per second over the last 10 seconds.

Example: a circuit is fired 24 times over 10 seconds with a somewhat bursty pattern, failing three times.

```
| fires: 2 | fires: 1 | fires: 3 | fires: 0 | fires: 9 | fires: 3 | fires: 2 | fires: 0 | fires: 4 | fires: 0 |
| fails: 0 | fails: 0 | fails: 0 | fails: 0 | fails: 0 | fails: 3 | fails: 0 | fails: 0 | fails: 0 | fails: 0 |
```
The failure rate here is 3/24 or 1/8 or 12.5%. The default error threshold is 50%, so in this case, the circuit would not open. However, if you modified the `rollingCountTimeout` to 3 seconds, and the `rollingCountBuckets` to 3  (not recommended), then the stats array might look like these three seconds from above.

```
| fires: 3 | fires: 2 | fires: 0 |
| fails: 3 | fails: 0 | fails: 0 |
```
Now, without changing `errorThresholdPercentage` our circuit will open because our error rate is now 3/5 or 60%. It's tricky to test this stuff because the array of statistics is a rolling count. Every second the oldest bucket is removed and a new one is added, so the totals change constantly in a way that may not be intuitive.

For example, if the first example is shifted right, dropping the first bucket and adding another with `fires: 3` the total number of `fires` now in the stats is not 27 (24+3) but 25 (24-2+3).

The code that is summing the stats samples is here:

```js
  const totals = this[WINDOW].reduce((acc, val) => {
    if (!val) { return acc; }
    Object.keys(acc).forEach(key => {
      if (key !== 'latencyTimes' && key !== 'percentiles') {
        (acc[key] += val[key] || 0);
      }
    });

    if (this.rollingPercentilesEnabled) {
      acc.latencyTimes.push.apply(acc.latencyTimes, val.latencyTimes || []);
    }
    return acc;
  }, bucket());
```

### Coalesce calls

Circuitbreaker offers coalescing your calls. If options.coalesce is set, multiple calls to the circuitbreaker will be handled as one, within the given timeframe (options.coalesceTTL). Performance will improve when rapidly firing the circuitbreaker with the same request, especially on a slower action. This is especially useful if multiple events can trigger the same functions at the same time. Of course, caching has the same function, but will only be effective when the call has been successfully executed once to store the return value. Coalescing and cache can be used at the same time, coalescing calls will always use the internal cache. Accessing cache is done prior to coalescing. When using `capacity` option, coalescing reduces the capacity used for the CircuitBreaker and will allow higher throughput of the rest of the application without actually firing the CircuitBreaker protected function. The `cacheGetKey` option is used for coalescing as well.

#### Finetuning Coalesce behavior

By default, all calls within given timeframe are coalesced, including errors and timeouts. This might be unwanted, as this twarths retry mechanisms etc. To finetune coalesce behavior, use the coalesceResetOn parameter. Some examples:

| coalesceResetOn value | behavior |
| --------------------- | -------- |
| `error`, `success`, `timeout` | coalescing is reset after every 'done' status, so only concurrent 'running' calls are coalesced. One could consider this the most essential form of coalescing. |
| `error`, `timeout` | No error state is being stored for longer than the running call, you might want to start here if you use any retry mechanisms. |
| `error` | Reset on errors. |
| `timeout` | Reset on timeouts. |
| `success` | Reset on success. |

You can use any combination of `error`, `success`, `timeout`.

#### Using CircuitBreaker with Coalescing and fetch.

When using the CircuitBreaker with Coalescing enabled to protect calling external services using the Fetch API, it's important to keep this in mind: The Response interface of the Fetch API does not allow reading the same body multiple times, cloning the Response will not help either as it will delay the reading of the response until the slowest reader is done. To work around this you can either choose to wrap handling of the response (e.g. parsing) in the protected function as well, keep in mind any errors and delays in this process will amount to the error thresholds configured. This might not be suitable for complexer setups. Another option would be to flatten the response and revive it. This might come in handy when working with libraries that expect a Response object. Example below:

```js
const flattenResponse = async (r) => ({
  arrayBuffer: await r.arrayBuffer(),
  init: {
    headers: r.headers,
    ok: r.ok,
    redirected: r.redirected,
    status: r.status,
    statusText: r.statusText,
    type: r.type,
    url: r.url,
  },
});

const reviveResponse = (r) => new Response(r.arrayBuffer, r.init);
```

Also note, Fetch doesn't fail on HTTP errors (e.g. 50x). If you want to protect your application from calling failing APIs, check the response status and throw errors accordingly.


### Typings

Typings are available [here](https://github.com/DefinitelyTyped/DefinitelyTyped/tree/master/types/opossum).

If you'd like to add them, run `npm install @types/opossum` in your project.

### Metrics

#### Prometheus
The [`opossum-prometheus`](https://github.com/nodeshift/opossum-prometheus) module
can be used to produce metrics that are consumable by Prometheus.
These metrics include information about the circuit itself, for example how many
times it has opened, as well as general Node.js statistics, for example event loop lag.


#### Hystrix
The [`opossum-hystrix`](https://github.com/nodeshift/opossum-hystrix) module can
be used to produce metrics that are consumable by the Hystrix Dashboard.

## Troubleshooting

You may run into issues related to too many listeners on an `EventEmitter` like this.

```sh
(node:25619) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 10 unpipe listeners added. Use emitter.setMaxListeners() to increase limit
(node:25619) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 drain listeners added. Use emitter.setMaxListeners() to increase limit
(node:25619) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 error listeners added. Use emitter.setMaxListeners() to increase limit
(node:25619) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 close listeners added. Use emitter.setMaxListeners() to increase limit
(node:25619) MaxListenersExceededWarning: Possible EventEmitter memory leak detected. 11 finish listeners added. Use emitter.setMaxListeners() to increase limit
```

In some cases, seeing this error might indicate a bug in client code, where many `CircuitBreaker`s are inadvertently being created. But there are legitimate scenarios where this may not be the case. For example, it could just be that you need more than 10 `CircuitBreaker`s in your app. That's ok.

To get around the error, you can set the number of listeners on the stream.

```js
breaker.stats.getHystrixStream().setMaxListeners(100);
```

Or it could be that you have a large test suite which exercises some code that creates `CircuitBreaker`s and does so repeatedly. If the `CircuitBreaker` being created is only needed for the duration of the test, use `breaker.shutdown()` when the circuit is no longer in use to clean up all listeners.
