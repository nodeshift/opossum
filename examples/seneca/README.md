# Seneca.js Example

This example exposes a simple HTTP service at the route `http://localhost:3000/flakeyService`. The HTTP service calls an in memory seneca microservice to obtain the response. The Seneca service is configured to progressively get slower with each request. Once a request takes more than 1 second to respond, the service just returns a `423 (Locked)` error.

Start the server.

```sh
$ npm start
```

Browse to `http://localhost:3000` and click the button to see the service in action.
