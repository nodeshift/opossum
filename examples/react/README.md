# React Example

This example exposes a simple service at the route `http://localhost:3001/flakeyService`. As the service receives requests, it gets slower and slower. Once it takes more than 1 second to respond, the service just returns a `423 (Locked)` error. Also at the route `http://localhost:3000` has a server running a react app responsible to consume the flakey service.

Install dependencies.


```sh
$ npm i && cd client && npm i && cd ..

```

Start the server.


```sh
$ npm start
```

Browse to `http://localhost:3000` and click the button to see the service in action.
