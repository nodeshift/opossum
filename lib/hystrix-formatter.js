'use strict';

// A function to map our stats data to the hystrix format
// returns JSON
function hystrixFormatter (stats) {
  const json = {};
  json.type = 'HystrixCommand';
  json.name = stats.name;
  json.group = stats.group;
  json.currentTime = new Date();
  json.isCircuitBreakerOpen = !stats.closed;
  json.errorPercentage = stats.fires === 0 ? 0 : (stats.failures / stats.fires) * 100;
  json.errorCount = stats.failures;
  json.requestCount = stats.fires;
  json.rollingCountBadRequests = stats.failures;
  json.rollingCountCollapsedRequests = 0;
  json.rollingCountEmit = stats.fires;
  json.rollingCountExceptionsThrown = 0;
  json.rollingCountFailure = stats.failures;
  json.rollingCountFallbackEmit = stats.fallbacks;
  json.rollingCountFallbackFailure = 0;
  json.rollingCountFallbackMissing = 0;
  json.rollingCountFallbackRejection = 0;
  json.rollingCountFallbackSuccess = 0;
  json.rollingCountResponsesFromCache = stats.cacheHits;
  json.rollingCountSemaphoreRejected = stats.semaphoreRejections;
  json.rollingCountShortCircuited = stats.rejects;
  json.rollingCountSuccess = stats.successes;
  json.rollingCountThreadPoolRejected = 0;
  json.rollingCountTimeout = stats.timeouts;
  json.currentConcurrentExecutionCount = 0;
  json.rollingMaxConcurrentExecutionCount = 0;
  // TODO: caluclate these latency values
  json.latencyExecute_mean = stats.latencyMean || 0;
  json.latencyExecute = {
    0: stats.percentiles['0'],
    25: stats.percentiles['0.25'],
    50: stats.percentiles['0.5'],
    75: stats.percentiles['0.75'],
    90: stats.percentiles['0.9'],
    95: stats.percentiles['0.95'],
    99: stats.percentiles['0.99'],
    99.5: stats.percentiles['0.995'],
    100: stats.percentiles['1']
  };
  // Whats the difference between execute and total?
  json.latencyTotal_mean = stats.latencyMean;
  json.latencyTotal = {
    0: stats.percentiles['0'],
    25: stats.percentiles['0.25'],
    50: stats.percentiles['0.5'],
    75: stats.percentiles['0.75'],
    90: stats.percentiles['0.9'],
    95: stats.percentiles['0.95'],
    99: stats.percentiles['0.99'],
    99.5: stats.percentiles['0.995'],
    100: stats.percentiles['1']
  };
  json.propertyValue_circuitBreakerRequestVolumeThreshold = 5;
  json.propertyValue_circuitBreakerSleepWindowInMilliseconds = stats.options.resetTimeout;
  json.propertyValue_circuitBreakerErrorThresholdPercentage = stats.options.errorThresholdPercentage;
  json.propertyValue_circuitBreakerForceOpen = false;
  json.propertyValue_circuitBreakerForceClosed = false;
  json.propertyValue_circuitBreakerEnabled = true; // Whether circuit breaker should be enabled.
  json.propertyValue_executionIsolationStrategy = 'THREAD';
  json.propertyValue_executionIsolationThreadTimeoutInMilliseconds = 300;
  json.propertyValue_executionTimeoutInMilliseconds = stats.options.timeout;
  json.propertyValue_executionIsolationThreadInterruptOnTimeout = true;
  json.propertyValue_executionIsolationThreadPoolKeyOverride = null;
  json.propertyValue_executionIsolationSemaphoreMaxConcurrentRequests = stats.options.capacity;
  json.propertyValue_fallbackIsolationSemaphoreMaxConcurrentRequests = stats.options.capacity;
  json.propertyValue_metricsRollingStatisticalWindowInMilliseconds = 10000;
  json.propertyValue_requestCacheEnabled = stats.options.cache || false;
  json.propertyValue_requestLogEnabled = true;
  json.reportingHosts = 1;

  return json;
}

module.exports = exports = hystrixFormatter;
