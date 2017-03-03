# Change Log

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

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
