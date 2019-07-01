'use strict';

/* eslint max-len: ["error", { "ignoreUrls": true }] */

// Data reference:
// https://github.com/Netflix/Hystrix/wiki/Metrics-and-Monitoring#metrics-publisher
// A function to map our stats data to the hystrix format
// returns JSON
function hystrixFormatter (stats) {
  return {
    type: 'HystrixCommand',
    name: stats.name,
    group: stats.group,
    currentTime: Date.now(),
    isCircuitBreakerOpen: !stats.closed,
    errorPercentage:
      stats.fires === 0 ? 0 : (stats.failures / stats.fires) * 100,
    errorCount: stats.failures,
    requestCount: stats.fires,
    rollingCountBadRequests: stats.failures,
    rollingCountCollapsedRequests: 0,
    rollingCountEmit: stats.fires,
    rollingCountExceptionsThrown: 0,
    rollingCountFailure: stats.failures,
    rollingCountFallbackEmit: stats.fallbacks,
    rollingCountFallbackFailure: 0,
    rollingCountFallbackMissing: 0,
    rollingCountFallbackRejection: 0,
    rollingCountFallbackSuccess: 0,
    rollingCountResponsesFromCache: stats.cacheHits,
    rollingCountSemaphoreRejected: stats.semaphoreRejections,
    rollingCountShortCircuited: stats.rejects,
    rollingCountSuccess: stats.successes,
    rollingCountThreadPoolRejected: 0,
    rollingCountTimeout: stats.timeouts,
    currentConcurrentExecutionCount: 0,
    rollingMaxConcurrentExecutionCount: 0,
    // TODO: calculate these latency values
    latencyExecute_mean: stats.latencyMean || 0,
    latencyExecute: percentiles(stats),
    // Whats the difference between execute and total?
    latencyTotal_mean: stats.latencyMean,
    latencyTotal: percentiles(stats),
    propertyValue_circuitBreakerRequestVolumeThreshold: 5,
    propertyValue_circuitBreakerSleepWindowInMilliseconds:
      stats.options.resetTimeout,
    propertyValue_circuitBreakerErrorThresholdPercentage:
      stats.options.errorThresholdPercentage,
    propertyValue_circuitBreakerForceOpen: false,
    propertyValue_circuitBreakerForceClosed: false,
    propertyValue_circuitBreakerEnabled: true,
    propertyValue_executionIsolationStrategy: 'THREAD',
    propertyValue_executionIsolationThreadTimeoutInMilliseconds: 300,
    propertyValue_executionTimeoutInMilliseconds: stats.options.timeout,
    propertyValue_executionIsolationThreadInterruptOnTimeout: true,
    propertyValue_executionIsolationThreadPoolKeyOverride: null,
    propertyValue_executionIsolationSemaphoreMaxConcurrentRequests:
      stats.options.capacity,
    propertyValue_fallbackIsolationSemaphoreMaxConcurrentRequests:
      stats.options.capacity,
    propertyValue_metricsRollingStatisticalWindowInMilliseconds: 10000,
    propertyValue_requestCacheEnabled: stats.options.cache || false,
    propertyValue_requestLogEnabled: true,
    reportingHosts: 1
  };
}

function percentiles (stats) {
  return {
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
}

module.exports = exports = hystrixFormatter;
