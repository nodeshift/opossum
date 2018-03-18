# Hystrix Example

This example shows how to access the Hystrix Metrics and create an SSE stream that can be plugged into the Hystrix Dashboard.

Similiar to the jQuery example, a simple service is exposed at the route `http://localhost:3000`. As the service receives requests, it gets slower and slower. Once it takes more than 1 second to respond, the service just returns a `423 (Locked)` error.  There is also a SSE stream available at `http://localhost:3000/hystrix.stream`

To see the Hystrix Metrics in action, you will need to run the Hystrix Dashboard. There is a standalone Hystrix Dashboard that you can run for the purposes of this example at https://github.com/kennedyoliveira/standalone-hystrix-dashboard. The easiest way is to just download the fat jar and run it in its own terminal window.

```sh
java -jar standalone-hystrix-dashboard-1.5.6-all.jar
```

Once the dashboard is running, navigate to `http://localhost:7979/hystrix-dashboard`, and add the hystrix stream at `http://localhost:3000/hystrix.stream`.

Now make a few requests to `http://localhost:3000` and you should see movement on the dashboard


Install the dependecies

```sh
$ npm install
```

Start the server.

```sh
$ npm start
```
