# JQuery Example

This example exposes a simple service at the route `http://localhost:3000/flakeyService`. 
For every request the service receives, the response time is increased.
[The service returns a `423 (Locked)` error if the response time is above 1000ms.](https://github.com/bucharest-gold/opossum/blob/master/examples/jquery/index.js#L43-L46) This example also has a web frontend at `http://localhost:3000/` for interacting with the service.

To build and run this example:

1. From the root of the opossum repository, build the `opossum` module:
  ```sh
  $ npm install 
  $ npm run build:browser
  ```
  This builds the `opossum.js` file [used in this example](https://github.com/bucharest-gold/opossum/blob/master/examples/jquery/index.js#L21). You only need to do this once.

1. Navigate to the `examples/jquery/` directory
  ```sh
  $ cd examples/jquery/
  ```

1. Start the server.
  ```sh
  $ npm install
  $ npm start
  ```

1. Browse to the web frontend at `http://localhost:3000` and click the _Flaky Service_ button repeatedly to interact with the service. 
  Notice the response time increases with every interaction. Once the response time is greater than the [timeout setting](https://github.com/bucharest-gold/opossum/blob/master/examples/jquery/app.js#L16), the [fallback action](https://github.com/bucharest-gold/opossum/blob/master/examples/jquery/app.js#L23) is triggered.

