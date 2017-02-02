# JQuery Example

This example exposes a simple service at the route `http://localhost:3000/flakeyService`. As the service receives requests, it gets slower and slower. Once it takes more than 1 second to respond, the service just returns a `423 (Locked)` error.

Start the server.

```sh
$ npm start
```

Browse to `http://localhost:3000` and click the button to see the service in action.