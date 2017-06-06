# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

<a name="1.1.0"></a>
# [1.1.0](https://github.com/bucharest-gold/opossum/compare/v1.0.0...v1.1.0) (2017-06-06)


### Bug Fixes

* don't let circuits get stuck half open ([5e1171c](https://github.com/bucharest-gold/opossum/commit/5e1171c))
* fix logic around pendingClose ([4d89ae4](https://github.com/bucharest-gold/opossum/commit/4d89ae4))


### Features

* add ETIMEDOUT error code for timeout error ([#64](https://github.com/bucharest-gold/opossum/issues/64)) ([5df9f65](https://github.com/bucharest-gold/opossum/commit/5df9f65))
* addition of rolling percentile latency's. GH-ISSUE [#38](https://github.com/bucharest-gold/opossum/issues/38) ([ce7b50d](https://github.com/bucharest-gold/opossum/commit/ce7b50d))
* remove fidelity promises. ([3f5827a](https://github.com/bucharest-gold/opossum/commit/3f5827a))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/bucharest-gold/opossum/compare/v0.6.0...v1.0.0) (2017-04-06)


### Bug Fixes

* do not fire failure event on short circuit ([ab87350](https://github.com/bucharest-gold/opossum/commit/ab87350))
* make Status an EventEmitter ([8aad11a](https://github.com/bucharest-gold/opossum/commit/8aad11a))
* remove default maxFailures option ([be65d3b](https://github.com/bucharest-gold/opossum/commit/be65d3b))


### Features

* add a group option.  GH-Issue [#43](https://github.com/bucharest-gold/opossum/issues/43) ([3052f23](https://github.com/bucharest-gold/opossum/commit/3052f23))
* Add an example on how to use the Hystrix Metrics ([fd8246a](https://github.com/bucharest-gold/opossum/commit/fd8246a))
* Addition of Hystrix Mertrics Stream. GH-ISSUE [#39](https://github.com/bucharest-gold/opossum/issues/39) ([2d44df6](https://github.com/bucharest-gold/opossum/commit/2d44df6))
* circuit status now contains a rolling window ([#34](https://github.com/bucharest-gold/opossum/issues/34)) ([05c0a2f](https://github.com/bucharest-gold/opossum/commit/05c0a2f))
* prefer an error percentage threshold ([245d47b](https://github.com/bucharest-gold/opossum/commit/245d47b))



<a name="0.6.0"></a>
# [0.6.0](https://github.com/bucharest-gold/opossum/compare/v0.5.1...v0.6.0) (2017-03-30)


### Bug Fixes

* circuit should emit failure event on fallback ([f2594d8](https://github.com/bucharest-gold/opossum/commit/f2594d8))
* include the error when emitting the 'fallback event' ([40eb2eb](https://github.com/bucharest-gold/opossum/commit/40eb2eb))
* promise should reject when action throws ([58dab98](https://github.com/bucharest-gold/opossum/commit/58dab98))
* typo copy past duplicated property ([54a27b9](https://github.com/bucharest-gold/opossum/commit/54a27b9))


### Features

* add basic rolling stats to a circuit ([8fb9561](https://github.com/bucharest-gold/opossum/commit/8fb9561))
* Add caching capability to circuits ([6c3144f](https://github.com/bucharest-gold/opossum/commit/6c3144f))
* Add caching capability to circuits ([0b717f6](https://github.com/bucharest-gold/opossum/commit/0b717f6))
* Applying code review ([6a0f7ff](https://github.com/bucharest-gold/opossum/commit/6a0f7ff))
* Applying code review ([8445a24](https://github.com/bucharest-gold/opossum/commit/8445a24))
* circuits now have a name based on the action ([f08d46e](https://github.com/bucharest-gold/opossum/commit/f08d46e))



<a name="0.5.1"></a>
## [0.5.1](https://github.com/bucharest-gold/opossum/compare/v0.5.0...v0.5.1) (2017-03-02)



<a name="0.5.0"></a>
# [0.5.0](https://github.com/bucharest-gold/opossum/compare/v0.3.0...v0.5.0) (2016-12-22)


### Bug Fixes

* ensure fallback event emits after function call ([df40ea7](https://github.com/bucharest-gold/opossum/commit/df40ea7))
* ensure pending close flag is reset ([5a1b70b](https://github.com/bucharest-gold/opossum/commit/5a1b70b))
* ensure that promise is rejected on fallback ([d4496d8](https://github.com/bucharest-gold/opossum/commit/d4496d8))
* fix (again) browser load of circuitBreaker ([58a80fb](https://github.com/bucharest-gold/opossum/commit/58a80fb))
* fix export of module in browser environment ([5a0594c](https://github.com/bucharest-gold/opossum/commit/5a0594c))


### Features

* allow for a CircuitBreaker as a fallback ([85cbc34](https://github.com/bucharest-gold/opossum/commit/85cbc34))
* Full featured browser capabilities ([2cc08f0](https://github.com/bucharest-gold/opossum/commit/2cc08f0))



<a name="0.4.0"></a>
# [0.4.0](https://github.com/bucharest-gold/opossum/compare/v0.3.0...v0.4.0) (2016-12-20)


### Features

* Full featured browser capabilities ([427c155](https://github.com/bucharest-gold/opossum/commit/427c155))



<a name="0.3.0"></a>
# [0.3.0](https://github.com/bucharest-gold/opossum/compare/v0.2.0...v0.3.0) (2016-12-16)


### Features

* create a browser distribution ([cc8036c](https://github.com/bucharest-gold/opossum/commit/cc8036c))



<a name="0.2.0"></a>
# [0.2.0](https://github.com/bucharest-gold/opossum/compare/v0.1.1...v0.2.0) (2016-12-13)


### Features

* return 'this' from CircuitBreaker.fallback ([159c006](https://github.com/bucharest-gold/opossum/commit/159c006))



<a name="0.1.1"></a>
## [0.1.1](https://github.com/bucharest-gold/opossum/compare/v0.1.0...v0.1.1) (2016-11-03)


### Bug Fixes

* Don't use Status for managing breaker state ([8c4c659](https://github.com/bucharest-gold/opossum/commit/8c4c659))
* **events:** Include timeout in stats ([abbdb61](https://github.com/bucharest-gold/opossum/commit/abbdb61))



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
