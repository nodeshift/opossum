# Hystrix Example

This example shows how to access the Hystrix Metrics and create an SSE stream that can be plugged into the Hystrix Dashboard.

Similiar to the jQuery example, a simple service is exposed at the route `http://localhost:3000`. As the service receives requests, it gets slower and slower. Once it takes more than 1 second to respond, the service just returns a `423 (Locked)` error.  There is also a SSE stream available at `http://localhost:3000/hystrix.stream`

To see the Hystrix Metrics in action, you will need to run the Hystrix Dashboard.  There are instructions on how to do that here: https://github.com/Netflix/Hystrix/tree/master/hystrix-dashboard

Once the dashboard is running, navigate to `http://localhost:7979/hystrix-dashboard` (this assumes you are running it from the git repo), and add our servers hystrix stream.

Now make a few requests to `http://localhost:3000` and you should see movement on the dashboard


Install the dependecies

```sh
$ npm install
```

Start the server.

```sh
$ npm start
```
