# Distributed Opossum 

Distributed Opossum is an efficient production-ready library for implementing distributed circuit breakers in a microservices architecture. It provides a way to protect against cascading failures that can occur when one service fails and causes multiple other services to fail as a result.

This project builds on top of the amazing work Red hat and team (refer https://github.com/nodeshift/opossum) but it diverges in it's targeted usage patterns. 
Distributed Opossum enhances the power of the project multifold by introducing some constraints explaiend further below. 

## Concept and Architecture

A circuit breaker is a design pattern that helps prevent cascading failures in distributed systems. It works by wrapping calls to remote services or resources with a circuit breaker object, which monitors the success and failure rates of the calls. If the failure rate exceeds a certain threshold, the circuit breaker trips and subsequent calls are prevented from reaching the remote service, instead being handled with a fallback response or action. This helps to isolate faults and prevent them from causing further damage or slowing down the entire system. A good place to start digging is this excellent blog by Martin fowler : https://martinfowler.com/bliki/CircuitBreaker.html

A distributed circuit breaker is an extension of the circuit breaker pattern that is designed to handle failures in distributed systems. In a distributed system, multiple services or nodes may be involved in a single request or transaction, and failures in one service can potentially cascade and affect other services. A distributed circuit breaker provides a way to coordinate and manage circuit breakers across multiple services or nodes, to help prevent these cascading failures.

The basic idea behind a distributed circuit breaker is to use a centralized registry or control plane to monitor the health of each service and coordinate the state of the circuit breakers. When a circuit breaker trips in one service, the control plane can notify the other services and prevent them from sending requests to the failed service. This can help isolate the failure and prevent it from spreading to other parts of the system.

Distributed Opossum uses redis as a central registry to notify all involved pods of such eccentricities occuring in one pod 

However, Distributed Opossum doesn't work on browser for obvious reasons. This is one of the places where Distributed opossum presents itself as a more powerful solution to a specific usecase


## Usage 

Because Distributed Opossum is a fork of opossum project, the api remains almost the same. You just need 
to pass the redis client in options: 

```angular2html
const options = {
  timeout: 3000, // If our function takes longer than 3 seconds, trigger a failure
  errorThresholdPercentage: 50, // When 50% of requests fail, trip the circuit
  resetTimeout: 30000, // After 30 seconds, try again.
  distributed: {
    client: createClient({ url: 'redis://127.0.0.1:6379', connect_timeout: 10 })
  }
};

```

That's all! Distributed opossum automatically does all management internall. This includes communication of state to 
the central registry, updating local circuit breaker where required. 

### Cleanup

Because we store our state information in list, it's vital to clear this information. 
The ideal way is to run a cron based lua script within the redis server. Here is a simple lua script to remove any element that is older than 30 minutes from the redis key


```angular2html
local timestamp_threshold = os.time() * 1000 - 1800000 -- 1800000 milliseconds = 30 minutes

local elements = redis.call("LRANGE", "distributedStats", 0, -1)

for i, element in ipairs(elements) do
local json_data = cjson.decode(element)
local timestamp = json_data.timestamp
if timestamp < timestamp_threshold then
redis.call("LREM", "distributedStats", 0, element)
end
end

return "Done"


```


## Contributing

If you'd like to contribute to Distributed Opossum, please see the contribution guidelines  for more information.


## Futher Imporvements

1. Quorum based decisions: A good reason to not adopt Distributed opossum would be for high prioirty request calls. Even if circuit breaker in one of the serveral pods spun up starts facing issues not due to the downstream service but due to the pod itself (eg: resource constraints), this false information cascades to neighbouring pods 


2. Exponential Backoffs: Currently the opossum project has a single resetTimeout, a fixed time after which an open state enters half open state. This is not useful
for high latency request calls. A very useful fix here would be to have exponentially increasing resetTimeouts

