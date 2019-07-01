# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [2.3.0](https://github.com/nodeshift/opossum/compare/v2.2.0...v2.3.0) (2019-07-01)


### Features

* provide an Iterator of all active circuits ([#344](https://github.com/nodeshift/opossum/issues/344)) ([13616b0](https://github.com/nodeshift/opossum/commit/13616b0))



## [2.2.0](https://github.com/nodeshift/opossum/compare/v2.1.0...v2.2.0) (2019-06-24)


### Bug Fixes

* ensure that including dist/opossum.js works ([#341](https://github.com/nodeshift/opossum/issues/341)) ([873deb5](https://github.com/nodeshift/opossum/commit/873deb5)), closes [/github.com/lance/elizabethan-insults/commit/ebabdf359c54090cfde31a06ad09576eeba82488#diff-23fce1009af5652674e09470cda3c008R9](https://github.com/nodeshift/opossum/issues/diff-23fce1009af5652674e09470cda3c008R9)


### Features

* add prometheusRegistry option ([#332](https://github.com/nodeshift/opossum/issues/332)) ([0056cdc](https://github.com/nodeshift/opossum/commit/0056cdc))



## [2.1.0](https://github.com/nodeshift/opossum/compare/v2.0.0...v2.1.0) (2019-06-12)


### Features

* add function to get metrics for all circuits ([#328](https://github.com/nodeshift/opossum/issues/328)) ([ff29f2e](https://github.com/nodeshift/opossum/commit/ff29f2e))
* Add original function parameters to the failure and timeout events ([#326](https://github.com/nodeshift/opossum/issues/326)) ([f8918c4](https://github.com/nodeshift/opossum/commit/f8918c4)), closes [#324](https://github.com/nodeshift/opossum/issues/324)



## [2.0.0](https://github.com/nodeshift/opossum/compare/v1.11.1...v2.0.0) (2019-06-05)


### Build System

* use node 12 on ci/cd in addition to 8 and 10 ([93f8008](https://github.com/nodeshift/opossum/commit/93f8008))


### Features

* prometheus client integration ([282b467](https://github.com/nodeshift/opossum/commit/282b467))

### Breaking Changes

* `health-check-failed` and `semaphore-locked` events have been changed to `healthCheckFailed` and `semaphoreLocked` respectively


### [1.11.1](https://github.com/nodeshift/opossum/compare/v1.11.0...v1.11.1) (2019-05-22)


### Build System

* don't fail coverage from untrusted forks ([194e18d](https://github.com/nodeshift/opossum/commit/194e18d))
* remove travis-ci now that circleci is good ([9756bf5](https://github.com/nodeshift/opossum/commit/9756bf5))
* rename the workflow to test_node_versions in circleci ([c7cc277](https://github.com/nodeshift/opossum/commit/c7cc277))
* set circleci to ignore gh-pages branch ([23e1384](https://github.com/nodeshift/opossum/commit/23e1384))
* set up coveralls (again); remove Makefile ([d099b45](https://github.com/nodeshift/opossum/commit/d099b45))
* switch to standardx for linting ([4967736](https://github.com/nodeshift/opossum/commit/4967736))
* try circleci for continuous integration ([1a77f3a](https://github.com/nodeshift/opossum/commit/1a77f3a))
* try workflows for multiple version builds ([5e9e6c8](https://github.com/nodeshift/opossum/commit/5e9e6c8))
* use codacy for coverage instead of coveralls ([e359ab9](https://github.com/nodeshift/opossum/commit/e359ab9))


### Tests

* generate browser/headless test suite ([2d24b35](https://github.com/nodeshift/opossum/commit/2d24b35))
* improve circuit.shutdown() test ([6841abc](https://github.com/nodeshift/opossum/commit/6841abc))
* switch to serve instead of http-server for browser tests ([50ccab7](https://github.com/nodeshift/opossum/commit/50ccab7))



# [1.11.0](https://github.com/nodeshift/opossum/compare/v1.10.1...v1.11.0) (2019-03-14)


### Features

* add errorFilter option to bypass incrementing failure stats ([8018012](https://github.com/nodeshift/opossum/commit/8018012))



## [1.10.1](https://github.com/nodeshift/opossum/compare/v1.10.0...v1.10.1) (2019-02-25)


### Bug Fixes

* eliminates a bug where the circuit could remain halfOpen forever ([0039ee1](https://github.com/nodeshift/opossum/commit/0039ee1))



<a name="1.10.0"></a>
# [1.10.0](https://github.com/nodeshift/opossum/compare/v1.9.0...v1.10.0) (2019-01-28)


### Features

* add circuit.shutdown() to shut a circuit down ([e14796c](https://github.com/nodeshift/opossum/commit/e14796c))



<a name="1.9.0"></a>
# [1.9.0](https://github.com/nodeshift/opossum/compare/v1.8.0...v1.9.0) (2018-10-27)


### Features

* add options.volumeThreshold ([f9a720e](https://github.com/nodeshift/opossum/commit/f9a720e))



<a name="1.8.0"></a>
# [1.8.0](https://github.com/nodeshift/opossum/compare/v1.7.1...v1.8.0) (2018-10-02)


### Bug Fixes

* changed currentTime to number as specified in the docs ([e816f43](https://github.com/nodeshift/opossum/commit/e816f43))


### Features

* add options.allowWarmUp as a creation option ([#218](https://github.com/nodeshift/opossum/issues/218)) ([ff42d1b](https://github.com/nodeshift/opossum/commit/ff42d1b))
* change default capacity from 10 to MAX_SAFE_INTEGER ([4a8b98b](https://github.com/nodeshift/opossum/commit/4a8b98b))



<a name="1.7.1"></a>
## [1.7.1](https://github.com/nodeshift/opossum/compare/v1.7.0...v1.7.1) (2018-07-18)



<a name="1.7.0"></a>
# [1.7.0](https://github.com/nodeshift/opossum/compare/v1.6.0...v1.7.0) (2018-06-06)


### Bug Fixes

* avoid calling fallback function twice ([#198](https://github.com/nodeshift/opossum/issues/198)) ([#201](https://github.com/nodeshift/opossum/issues/201)) ([b561a43](https://github.com/nodeshift/opossum/commit/b561a43))


### Features

* optional timeout ([#200](https://github.com/nodeshift/opossum/issues/200)) ([#202](https://github.com/nodeshift/opossum/issues/202)) ([7611d6f](https://github.com/nodeshift/opossum/commit/7611d6f))



<a name="1.6.0"></a>
# [1.6.0](https://github.com/nodeshift/opossum/compare/v1.5.0...v1.6.0) (2018-05-24)


### Features

* pass error as parameter to fallback function ([#197](https://github.com/nodeshift/opossum/issues/197)) ([ae6c1cc](https://github.com/nodeshift/opossum/commit/ae6c1cc))



<a name="1.5.0"></a>
# [1.5.0](https://github.com/nodeshift/opossum/compare/v1.3.1...v1.5.0) (2018-04-25)


### Bug Fixes

* add full support for webpack and angular ([#185](https://github.com/nodeshift/opossum/issues/185)) ([a8cdad6](https://github.com/nodeshift/opossum/commit/a8cdad6))
* address sec vuln in marked coming from jsdoc ([224c6ef](https://github.com/nodeshift/opossum/commit/224c6ef))
* security issue related to electron version ([#138](https://github.com/nodeshift/opossum/issues/138)) ([4739c62](https://github.com/nodeshift/opossum/commit/4739c62))


### Features

* add enable/disable for a circuit ([#160](https://github.com/nodeshift/opossum/issues/160)) ([016eba5](https://github.com/nodeshift/opossum/commit/016eba5))
* allow multiple circuits to aggregate stats ([#140](https://github.com/nodeshift/opossum/issues/140)) ([ba71840](https://github.com/nodeshift/opossum/commit/ba71840))



<a name="1.4.0"></a>
# [1.4.0](https://github.com/nodeshift/opossum/compare/v1.3.1...v1.4.0) (2018-03-26)


### Bug Fixes

* address sec vuln in marked coming from jsdoc ([224c6ef](https://github.com/nodeshift/opossum/commit/224c6ef))
* security issue related to electron version ([#138](https://github.com/nodeshift/opossum/issues/138)) ([4739c62](https://github.com/nodeshift/opossum/commit/4739c62))


### Features

* add enable/disable for a circuit ([#160](https://github.com/nodeshift/opossum/issues/160)) ([016eba5](https://github.com/nodeshift/opossum/commit/016eba5))
* allow multiple circuits to aggregate stats ([#140](https://github.com/nodeshift/opossum/issues/140)) ([ba71840](https://github.com/nodeshift/opossum/commit/ba71840))



<a name="1.3.1"></a>
## [1.3.1](https://github.com/nodeshift/opossum/compare/v1.3.0...v1.3.1) (2017-12-14)


### Bug Fixes

* build on windows10 due browserify limitations ([#112](https://github.com/nodeshift/opossum/issues/112)) ([dee4a9a](https://github.com/nodeshift/opossum/commit/dee4a9a))
* halfOpen state does not reject and doesn't trigger a later re-try. ([#120](https://github.com/nodeshift/opossum/pull/120) ([04df6f7](https://github.com/nodeshift/opossum/commit/04df6f7b9a9b9e9ce672ea1665f1d95586f039a6))


<a name="1.3.0"></a>
# [1.3.0](https://github.com/nodeshift/opossum/compare/v1.2.1...v1.3.0) (2017-10-16)


### Bug Fixes

* ensure breaker.fire() returns rejected promise when fallback fails ([fbedb07](https://github.com/nodeshift/opossum/commit/fbedb07))
* ensure fallback event always fires ([27c3f8b](https://github.com/nodeshift/opossum/commit/27c3f8b))
* JSDoc now available for semaphore-locked event ([6f6c9bd](https://github.com/nodeshift/opossum/commit/6f6c9bd))


### Features

* Add health check function to a circuit breaker ([#76](https://github.com/nodeshift/opossum/issues/76)) ([0e39faa](https://github.com/nodeshift/opossum/commit/0e39faa))



<a name="1.2.1"></a>
## [1.2.1](https://github.com/nodeshift/opossum/compare/v1.2.0...v1.2.1) (2017-06-20)



<a name="1.2.0"></a>
# [1.2.0](https://github.com/nodeshift/opossum/compare/v1.1.0...v1.2.0) (2017-06-20)


### Features

* semaphore added ([#72](https://github.com/nodeshift/opossum/issues/72)) ([8c0a46b](https://github.com/nodeshift/opossum/commit/8c0a46b)), closes [#60](https://github.com/nodeshift/opossum/issues/60)



<a name="1.1.0"></a>
# [1.1.0](https://github.com/nodeshift/opossum/compare/v1.0.0...v1.1.0) (2017-06-06)


### Bug Fixes

* don't let circuits get stuck half open ([5e1171c](https://github.com/nodeshift/opossum/commit/5e1171c))
* fix logic around pendingClose ([4d89ae4](https://github.com/nodeshift/opossum/commit/4d89ae4))


### Features

* add ETIMEDOUT error code for timeout error ([#64](https://github.com/nodeshift/opossum/issues/64)) ([5df9f65](https://github.com/nodeshift/opossum/commit/5df9f65))
* addition of rolling percentile latency's. GH-ISSUE [#38](https://github.com/nodeshift/opossum/issues/38) ([ce7b50d](https://github.com/nodeshift/opossum/commit/ce7b50d))
* remove fidelity promises. ([3f5827a](https://github.com/nodeshift/opossum/commit/3f5827a))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/nodeshift/opossum/compare/v0.6.0...v1.0.0) (2017-04-06)


### Bug Fixes

* do not fire failure event on short circuit ([ab87350](https://github.com/nodeshift/opossum/commit/ab87350))
* make Status an EventEmitter ([8aad11a](https://github.com/nodeshift/opossum/commit/8aad11a))
* remove default maxFailures option ([be65d3b](https://github.com/nodeshift/opossum/commit/be65d3b))


### Features

* add a group option.  GH-Issue [#43](https://github.com/nodeshift/opossum/issues/43) ([3052f23](https://github.com/nodeshift/opossum/commit/3052f23))
* Add an example on how to use the Hystrix Metrics ([fd8246a](https://github.com/nodeshift/opossum/commit/fd8246a))
* Addition of Hystrix Mertrics Stream. GH-ISSUE [#39](https://github.com/nodeshift/opossum/issues/39) ([2d44df6](https://github.com/nodeshift/opossum/commit/2d44df6))
* circuit status now contains a rolling window ([#34](https://github.com/nodeshift/opossum/issues/34)) ([05c0a2f](https://github.com/nodeshift/opossum/commit/05c0a2f))
* prefer an error percentage threshold ([245d47b](https://github.com/nodeshift/opossum/commit/245d47b))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/nodeshift/opossum/compare/v0.5.1...v0.6.0) (2017-03-30)


### Bug Fixes

* circuit should emit failure event on fallback ([f2594d8](https://github.com/nodeshift/opossum/commit/f2594d8))
* include the error when emitting the 'fallback event' ([40eb2eb](https://github.com/nodeshift/opossum/commit/40eb2eb))
* promise should reject when action throws ([58dab98](https://github.com/nodeshift/opossum/commit/58dab98))
* typo copy past duplicated property ([54a27b9](https://github.com/nodeshift/opossum/commit/54a27b9))


### Features

* add basic rolling stats to a circuit ([8fb9561](https://github.com/nodeshift/opossum/commit/8fb9561))
* Add caching capability to circuits ([6c3144f](https://github.com/nodeshift/opossum/commit/6c3144f))
* Add caching capability to circuits ([0b717f6](https://github.com/nodeshift/opossum/commit/0b717f6))
* Applying code review ([6a0f7ff](https://github.com/nodeshift/opossum/commit/6a0f7ff))
* Applying code review ([8445a24](https://github.com/nodeshift/opossum/commit/8445a24))
* circuits now have a name based on the action ([f08d46e](https://github.com/nodeshift/opossum/commit/f08d46e))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/nodeshift/opossum/compare/v0.5.0...v0.5.1) (2017-03-02)



<a name="0.5.0"></a>
# [0.5.0](https://github.com/nodeshift/opossum/compare/v0.3.0...v0.5.0) (2016-12-22)


### Bug Fixes

* ensure fallback event emits after function call ([df40ea7](https://github.com/nodeshift/opossum/commit/df40ea7))
* ensure pending close flag is reset ([5a1b70b](https://github.com/nodeshift/opossum/commit/5a1b70b))
* ensure that promise is rejected on fallback ([d4496d8](https://github.com/nodeshift/opossum/commit/d4496d8))
* fix (again) browser load of circuitBreaker ([58a80fb](https://github.com/nodeshift/opossum/commit/58a80fb))
* fix export of module in browser environment ([5a0594c](https://github.com/nodeshift/opossum/commit/5a0594c))


### Features

* allow for a CircuitBreaker as a fallback ([85cbc34](https://github.com/nodeshift/opossum/commit/85cbc34))
* Full featured browser capabilities ([2cc08f0](https://github.com/nodeshift/opossum/commit/2cc08f0))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/nodeshift/opossum/compare/v0.3.0...v0.4.0) (2016-12-20)


### Features

* Full featured browser capabilities ([427c155](https://github.com/nodeshift/opossum/commit/427c155))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/nodeshift/opossum/compare/v0.2.0...v0.3.0) (2016-12-16)


### Features

* create a browser distribution ([cc8036c](https://github.com/nodeshift/opossum/commit/cc8036c))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/nodeshift/opossum/compare/v0.1.1...v0.2.0) (2016-12-13)


### Features

* return 'this' from CircuitBreaker.fallback ([159c006](https://github.com/nodeshift/opossum/commit/159c006))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/nodeshift/opossum/compare/v0.1.0...v0.1.1) (2016-11-03)


### Bug Fixes

* Don't use Status for managing breaker state ([8c4c659](https://github.com/nodeshift/opossum/commit/8c4c659))
* **events:** Include timeout in stats ([abbdb61](https://github.com/nodeshift/opossum/commit/abbdb61))



<a name="0.1.0"></a>
# 0.1.0 (2016-11-01)


### Bug Fixes

* Add 'use strict'; everywhere! ([87ea863](https://github.com/lance/opossum/commit/87ea863))
* Add status for fallback calls. ([fe1eeee](https://github.com/lance/opossum/commit/fe1eeee))
* Reset after resetTimeout when using fallbacks ([47de312](https://github.com/lance/opossum/commit/47de312)), closes [#1](https://github.com/lance/opossum/issues/1)


### Features

* **events:** Make CircuitBreaker an EventEmitter ([dea7c53](https://github.com/lance/opossum/commit/dea7c53))
* add methods to open and close the circuit manually ([9c78ecf](https://github.com/lance/opossum/commit/9c78ecf))
* Handling for node-like callback functions ([77f3d6b](https://github.com/lance/opossum/commit/77f3d6b))
* Make actions flexible ([2672c34](https://github.com/lance/opossum/commit/2672c34))
