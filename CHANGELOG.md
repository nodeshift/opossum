# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

## [9.0.0](https://github.com/nodeshift/opossum/compare/v8.5.0...v9.0.0) (2025-05-30)


### ⚠ BREAKING CHANGES

* remove Node 16 and Node 18 support ([#921](https://github.com/nodeshift/opossum/issues/921))

### Features

* remove Node 16 and Node 18 support ([#921](https://github.com/nodeshift/opossum/issues/921)) ([dbae7b1](https://github.com/nodeshift/opossum/commit/dbae7b1e2862e001911c15bd835808f1d1c7af48))

## [8.5.0](https://github.com/nodeshift/opossum/compare/v8.4.0...v8.5.0) (2025-05-29)


### Features

* upgrade husky from 8.0.3 to 9.1.7 ([#912](https://github.com/nodeshift/opossum/issues/912)) ([0f7e56c](https://github.com/nodeshift/opossum/commit/0f7e56c9949dfc31a37596cc5eae0753e103a051))


### Bug Fixes

* package.json & package-lock.json to reduce vulnerabilities ([#915](https://github.com/nodeshift/opossum/issues/915)) ([66f2b48](https://github.com/nodeshift/opossum/commit/66f2b487fff89e2ab0fe5ecb85691632b7b3e1af))

## [8.4.0](https://github.com/nodeshift/opossum/compare/v8.3.1...v8.4.0) (2024-11-27)


### Features

* Coalesce reset options, reset coalesce based on result. (error, success, timeout) ([#908](https://github.com/nodeshift/opossum/issues/908)) ([c9782ae](https://github.com/nodeshift/opossum/commit/c9782aef22b00467e20d67bf1ada89f1e868f212))

## [8.3.1](https://github.com/nodeshift/opossum/compare/v8.3.0...v8.3.1) (2024-11-11)


### Bug Fixes

* Incorrect default value of maxEntries for MemoryCache [#904](https://github.com/nodeshift/opossum/issues/904) ([#906](https://github.com/nodeshift/opossum/issues/906)) ([f7abe3f](https://github.com/nodeshift/opossum/commit/f7abe3fe468a4b212ebae40e74f98e3c0e02e8c9))

## [8.3.0](https://github.com/nodeshift/opossum/compare/v8.2.0...v8.3.0) (2024-10-28)


### Features

* renewing the AbortController when the circuit enters the 'halfClose' or 'close' state ([#892](https://github.com/nodeshift/opossum/issues/892)) ([2ba3a31](https://github.com/nodeshift/opossum/commit/2ba3a31def3f11305778490c7c2b858f02d8ca2a))


### Bug Fixes

* disabled breaker emits fire events ([#895](https://github.com/nodeshift/opossum/issues/895)) ([d0ee9e6](https://github.com/nodeshift/opossum/commit/d0ee9e6853493a97761e5c4976dcad6e2a58d08d))

## [8.2.0](https://github.com/nodeshift/opossum/compare/v8.1.4...v8.2.0) (2024-10-23)


### Features

* coalescing calls + feature: max cache size ([#877](https://github.com/nodeshift/opossum/issues/877)) ([d50c912](https://github.com/nodeshift/opossum/commit/d50c912ebb5b642f9bd16efc24afda94432cd666))
* upgrade nyc from 15.1.0 to 17.0.0 ([#862](https://github.com/nodeshift/opossum/issues/862)) ([ccf7803](https://github.com/nodeshift/opossum/commit/ccf78033462e74533e3cbb74a865d659745e4dd9))


### Bug Fixes

* package.json & package-lock.json to reduce vulnerabilities ([#890](https://github.com/nodeshift/opossum/issues/890)) ([6cd2895](https://github.com/nodeshift/opossum/commit/6cd28950244218fde9c2d75ca04e753bd37761e4))
* upgrade tape from 5.7.2 to 5.9.0 ([#885](https://github.com/nodeshift/opossum/issues/885)) ([2896676](https://github.com/nodeshift/opossum/commit/2896676745d26b08912bb547b80af8916d1ddeeb))

## [8.1.4](https://github.com/nodeshift/opossum/compare/v8.1.3...v8.1.4) (2024-04-30)


### Bug Fixes

* upgrade eslint from 8.49.0 to 8.51.0 ([#835](https://github.com/nodeshift/opossum/issues/835)) ([99481d5](https://github.com/nodeshift/opossum/commit/99481d588970491bd5ead09f7fd10fdd63c7fd2f))
* upgrade tape from 5.7.0 to 5.7.2 ([#841](https://github.com/nodeshift/opossum/issues/841)) ([0929749](https://github.com/nodeshift/opossum/commit/0929749fa4f942cc08e062db9a33941cfdb7cf07))

## [8.1.3](https://github.com/nodeshift/opossum/compare/v8.1.2...v8.1.3) (2023-11-06)


### Bug Fixes

* push.apply with an unbounded array leads to stack overflow exceptions. ([#830](https://github.com/nodeshift/opossum/issues/830)) ([2cfb1ae](https://github.com/nodeshift/opossum/commit/2cfb1aeb8649359b0e8adc44b20bce61ee2bb3c1))
* upgrade tape from 5.6.6 to 5.7.0 ([#828](https://github.com/nodeshift/opossum/issues/828)) ([650807a](https://github.com/nodeshift/opossum/commit/650807ac5a4e6a8417c9165914559f452110f460))

## [8.1.2](https://github.com/nodeshift/opossum/compare/v8.1.1...v8.1.2) (2023-10-05)


### Bug Fixes

* fix bug where options couldn't be set to zero. ([#825](https://github.com/nodeshift/opossum/issues/825)) ([e6b3b77](https://github.com/nodeshift/opossum/commit/e6b3b77eaaf2abbec118da1470fb78418b0dfd90)), closes [#824](https://github.com/nodeshift/opossum/issues/824)
* upgrade eslint from 8.44.0 to 8.48.0 ([#814](https://github.com/nodeshift/opossum/issues/814)) ([178294e](https://github.com/nodeshift/opossum/commit/178294e632e78142166e5f4698f9e0e608d23978))
* upgrade eslint from 8.48.0 to 8.49.0 ([#822](https://github.com/nodeshift/opossum/issues/822)) ([fc5c002](https://github.com/nodeshift/opossum/commit/fc5c00216cc62ff4600db0edace0b5489e90f7eb))

## [8.1.1](https://github.com/nodeshift/opossum/compare/v8.1.0...v8.1.1) (2023-09-13)


### Bug Fixes

* upgrade multiple dependencies with Snyk ([#800](https://github.com/nodeshift/opossum/issues/800)) ([d1b22a2](https://github.com/nodeshift/opossum/commit/d1b22a28b2cf059a204b66fc61cf533e8dfe8cdb))
* upgrade tape from 5.6.3 to 5.6.5 ([#803](https://github.com/nodeshift/opossum/issues/803)) ([f48ba4c](https://github.com/nodeshift/opossum/commit/f48ba4cfe28eff0ecc27442bec815fb64c61dfce))
* upgrade tape from 5.6.5 to 5.6.6 ([#806](https://github.com/nodeshift/opossum/issues/806)) ([2d915be](https://github.com/nodeshift/opossum/commit/2d915becb7f268a0b0917de5e55977c17a1f90d7))
* upgrade webpack from 5.88.0 to 5.88.2 ([#805](https://github.com/nodeshift/opossum/issues/805)) ([7e3d6ca](https://github.com/nodeshift/opossum/commit/7e3d6ca3286dd46b74cb533f1c7fb93ffc662d1e))

## [8.1.0](https://github.com/nodeshift/opossum/compare/v8.0.1...v8.1.0) (2023-07-31)


### Features

* add option to disable stats snapshots ([#799](https://github.com/nodeshift/opossum/issues/799)) ([a9c5935](https://github.com/nodeshift/opossum/commit/a9c5935adfd740ed514134c9f3615425b6381cb8))


### Bug Fixes

* package.json & package-lock.json to reduce vulnerabilities ([#789](https://github.com/nodeshift/opossum/issues/789)) ([74a45c5](https://github.com/nodeshift/opossum/commit/74a45c5544fa5d7505339fb6130c2f7af82e4d96))
* upgrade eslint from 8.40.0 to 8.43.0 ([#790](https://github.com/nodeshift/opossum/issues/790)) ([fda48ca](https://github.com/nodeshift/opossum/commit/fda48ca84f8e763c666635142a7bb3415913a237))
* upgrade eslint from 8.43.0 to 8.44.0 ([#794](https://github.com/nodeshift/opossum/issues/794)) ([3dffb78](https://github.com/nodeshift/opossum/commit/3dffb78f9874f49f765484a9d615d8d7d06004fa))
* upgrade webpack from 5.82.0 to 5.82.1 ([#772](https://github.com/nodeshift/opossum/issues/772)) ([c84639f](https://github.com/nodeshift/opossum/commit/c84639f73212aaeee7901b7c6f99984be00f0a86))
* upgrade webpack from 5.82.1 to 5.83.1 ([#775](https://github.com/nodeshift/opossum/issues/775)) ([01443c6](https://github.com/nodeshift/opossum/commit/01443c685fc160d43e1565376db48cd894e0e1df))
* upgrade webpack from 5.83.1 to 5.88.0 ([#791](https://github.com/nodeshift/opossum/issues/791)) ([5296413](https://github.com/nodeshift/opossum/commit/5296413faecea205b75a8af8f0c37f5d870f5acc))
* upgrade webpack-cli from 5.0.2 to 5.1.4 ([#782](https://github.com/nodeshift/opossum/issues/782)) ([e66ca47](https://github.com/nodeshift/opossum/commit/e66ca474eb2e43555fd08f9bba04a4c33c7b4752))

## [8.0.1](https://github.com/nodeshift/opossum/compare/v8.0.0...v8.0.1) (2023-05-30)


### Bug Fixes

* Reduce apply() calls to improve call times. ([#765](https://github.com/nodeshift/opossum/issues/765)) ([8d559e4](https://github.com/nodeshift/opossum/commit/8d559e4ab82643ddbf03a55b9164014ddcacc516))
* upgrade eslint from 8.39.0 to 8.40.0 ([#766](https://github.com/nodeshift/opossum/issues/766)) ([197cc6d](https://github.com/nodeshift/opossum/commit/197cc6dc24673a717f154d3c4903ab532b7249c2))

## [8.0.0](https://github.com/nodeshift/opossum/compare/v7.1.0...v8.0.0) (2023-05-25)


### ⚠ BREAKING CHANGES

* remove Node 14 ([#762](https://github.com/nodeshift/opossum/issues/762))

### Features

* improve caching - adds TTL, cacheTransport and cacheGetKey ([#739](https://github.com/nodeshift/opossum/issues/739)) ([dc9be53](https://github.com/nodeshift/opossum/commit/dc9be538146235ad06d0e4fbd46d09ee88174253))
* remove Node 14 ([#762](https://github.com/nodeshift/opossum/issues/762)) ([e950d0e](https://github.com/nodeshift/opossum/commit/e950d0e1df1d534c01c8827860c1ad320d6fdfed))


### Bug Fixes

* package.json & package-lock.json to reduce vulnerabilities ([#737](https://github.com/nodeshift/opossum/issues/737)) ([6f65ff2](https://github.com/nodeshift/opossum/commit/6f65ff2d1261015b4baa592d6d23632e8ed62f45))
* upgrade @babel/core from 7.20.12 to 7.21.0 ([#738](https://github.com/nodeshift/opossum/issues/738)) ([2ab63f4](https://github.com/nodeshift/opossum/commit/2ab63f4b0b7aad67e4192e520e43a0618ee86233))
* upgrade @babel/core from 7.20.7 to 7.20.12 ([#724](https://github.com/nodeshift/opossum/issues/724)) ([734e10e](https://github.com/nodeshift/opossum/commit/734e10e2bcebc319e16523836713afc3797cd2db))
* upgrade @babel/core from 7.21.5 to 7.21.8 ([#761](https://github.com/nodeshift/opossum/issues/761)) ([fceb955](https://github.com/nodeshift/opossum/commit/fceb955bbe9a345bedff1d97324141a846b1d123))
* upgrade babel-loader from 9.1.0 to 9.1.2 ([#723](https://github.com/nodeshift/opossum/issues/723)) ([10d3294](https://github.com/nodeshift/opossum/commit/10d3294d75badd73c6fec09f04b0dd5f887f2bca))
* upgrade eslint from 8.30.0 to 8.31.0 ([#721](https://github.com/nodeshift/opossum/issues/721)) ([7af314b](https://github.com/nodeshift/opossum/commit/7af314b8fe92b0ebadb6dbed0f74b1823a2dc9bb))
* upgrade eslint from 8.31.0 to 8.32.0 ([#729](https://github.com/nodeshift/opossum/issues/729)) ([d858b11](https://github.com/nodeshift/opossum/commit/d858b113ab166532f8af62ba52d8a2c636fea7ed))
* upgrade eslint from 8.32.0 to 8.33.0 ([#733](https://github.com/nodeshift/opossum/issues/733)) ([5de4b15](https://github.com/nodeshift/opossum/commit/5de4b1570ce9a2ea23f87bb35da8dc3764226c63))
* upgrade eslint from 8.33.0 to 8.34.0 ([#736](https://github.com/nodeshift/opossum/issues/736)) ([941ba0b](https://github.com/nodeshift/opossum/commit/941ba0bf45f146acda8783555039502c74459ec6))
* upgrade eslint from 8.34.0 to 8.39.0 ([#755](https://github.com/nodeshift/opossum/issues/755)) ([3c12586](https://github.com/nodeshift/opossum/commit/3c12586b2a183efa44904957aafaf26c6864583d))
* upgrade eslint-plugin-import from 2.26.0 to 2.27.5 ([#731](https://github.com/nodeshift/opossum/issues/731)) ([979b898](https://github.com/nodeshift/opossum/commit/979b898f67844585ca17b5ef027c4e41dd21c2fc))
* upgrade eslint-plugin-n from 15.6.0 to 15.6.1 ([#725](https://github.com/nodeshift/opossum/issues/725)) ([84d94d1](https://github.com/nodeshift/opossum/commit/84d94d111e61f8f94808cb5ef06e7d68baea92b5))
* upgrade husky from 8.0.1 to 8.0.3 ([#722](https://github.com/nodeshift/opossum/issues/722)) ([9de3755](https://github.com/nodeshift/opossum/commit/9de3755c25759547da88efd38196cf2d2e4ae4a9))
* upgrade multiple dependencies with Snyk ([#759](https://github.com/nodeshift/opossum/issues/759)) ([053a5a5](https://github.com/nodeshift/opossum/commit/053a5a53cbb6a0bb3e4a413397a225dc85ccac28))
* upgrade serve from 14.1.2 to 14.2.0 ([#732](https://github.com/nodeshift/opossum/issues/732)) ([3a84d3e](https://github.com/nodeshift/opossum/commit/3a84d3e944d172fd5f04eb3266bb52f6e6a00103))
* upgrade tape from 5.6.1 to 5.6.3 ([#730](https://github.com/nodeshift/opossum/issues/730)) ([3af33ce](https://github.com/nodeshift/opossum/commit/3af33ce5a814ccd0e26c8deb3fceb33fb6a2ce2e))
* upgrade webpack from 5.76.0 to 5.76.3 ([#742](https://github.com/nodeshift/opossum/issues/742)) ([3f9edea](https://github.com/nodeshift/opossum/commit/3f9edea30ed1cad670f3ac46393155e9eb1fc9fa))
* upgrade webpack from 5.76.3 to 5.82.0 ([#760](https://github.com/nodeshift/opossum/issues/760)) ([529747c](https://github.com/nodeshift/opossum/commit/529747c27ebbc87b84a90a18dcd34e95d47e5745))
* upgrade webpack-cli from 5.0.1 to 5.0.2 ([#754](https://github.com/nodeshift/opossum/issues/754)) ([155d321](https://github.com/nodeshift/opossum/commit/155d3215be8ef397bafd70c8e1a11305274edfd5))

## [7.1.0](https://www.github.com/nodeshift/opossum/compare/v7.0.1...v7.1.0) (2023-01-19)


### Features

* enter halfOpen state on reinitialization if required ([#720](https://www.github.com/nodeshift/opossum/issues/720)) ([f20c63c](https://www.github.com/nodeshift/opossum/commit/f20c63c548faddc5f324661802c93d92803099de))
* upgrade babel-loader from 8.2.5 to 9.1.0 ([#714](https://www.github.com/nodeshift/opossum/issues/714)) ([2226eb4](https://www.github.com/nodeshift/opossum/commit/2226eb427996a9643877b170fbe5ac0bca98ee57))
* upgrade webpack-cli from 4.10.0 to 5.0.1 ([#715](https://www.github.com/nodeshift/opossum/issues/715)) ([47fd10e](https://www.github.com/nodeshift/opossum/commit/47fd10ec565d414c850bdc53a644c2e11a82368e))


### Bug Fixes

* package.json & package-lock.json to reduce vulnerabilities ([#707](https://www.github.com/nodeshift/opossum/issues/707)) ([7376408](https://www.github.com/nodeshift/opossum/commit/7376408d71510100bb04ad65781292662787a2c3))
* upgrade @babel/core from 7.19.3 to 7.19.6 ([#695](https://www.github.com/nodeshift/opossum/issues/695)) ([3c55164](https://www.github.com/nodeshift/opossum/commit/3c551645f5f76b47419d6e2a43571be2e87b9765))
* upgrade @babel/core from 7.19.6 to 7.20.5 ([#713](https://www.github.com/nodeshift/opossum/issues/713)) ([46e4d63](https://www.github.com/nodeshift/opossum/commit/46e4d638048657fca52832e4077a60de671f75ed))
* upgrade @babel/core from 7.20.5 to 7.20.7 ([#717](https://www.github.com/nodeshift/opossum/issues/717)) ([fe2a93a](https://www.github.com/nodeshift/opossum/commit/fe2a93ac97ff80fd8225301e7f1cff02d9e6fb5b))
* upgrade eslint from 8.25.0 to 8.29.0 ([#711](https://www.github.com/nodeshift/opossum/issues/711)) ([3a59b42](https://www.github.com/nodeshift/opossum/commit/3a59b42bd226f2a59ee7613dc24e9f426e480be7))
* upgrade eslint from 8.29.0 to 8.30.0 ([#716](https://www.github.com/nodeshift/opossum/issues/716)) ([acd4cd3](https://www.github.com/nodeshift/opossum/commit/acd4cd373f65541fde2de499e6fbd930e46ff7e2))
* upgrade eslint-plugin-n from 15.3.0 to 15.6.0 ([#710](https://www.github.com/nodeshift/opossum/issues/710)) ([f5297b8](https://www.github.com/nodeshift/opossum/commit/f5297b88b514f6a16ce3ecb9b9bd265989b3a16f))
* upgrade serve from 14.0.1 to 14.1.2 ([#712](https://www.github.com/nodeshift/opossum/issues/712)) ([0667152](https://www.github.com/nodeshift/opossum/commit/0667152df35bdff3fb42df380582d05c89d6d679))
* upgrade webpack from 5.74.0 to 5.75.0 ([#705](https://www.github.com/nodeshift/opossum/issues/705)) ([99c6b0d](https://www.github.com/nodeshift/opossum/commit/99c6b0dae4f8fe6856afa48d2745f7e14b1d14bf))

### [7.0.1](https://www.github.com/nodeshift/opossum/compare/v7.0.0...v7.0.1) (2022-11-28)


### Bug Fixes

* upgrade @babel/preset-env from 7.19.3 to 7.19.4 ([#691](https://www.github.com/nodeshift/opossum/issues/691)) ([26c3ce7](https://www.github.com/nodeshift/opossum/commit/26c3ce75fb33e62aa1abedbacc4a87f966319eef))
* upgrade eslint from 8.14.0 to 8.24.0 ([#686](https://www.github.com/nodeshift/opossum/issues/686)) ([c030d9c](https://www.github.com/nodeshift/opossum/commit/c030d9cf0bf6e5196003168e3f390eb354ce9b53))
* upgrade eslint from 8.24.0 to 8.25.0 ([#690](https://www.github.com/nodeshift/opossum/issues/690)) ([8c37e10](https://www.github.com/nodeshift/opossum/commit/8c37e1021048d852b2dee0688481e7a4194b35a3))
* upgrade eslint-plugin-n from 15.2.0 to 15.3.0 ([#687](https://www.github.com/nodeshift/opossum/issues/687)) ([e9f540e](https://www.github.com/nodeshift/opossum/commit/e9f540e11260a215fc16abcaba2f5cbc47bb8a88))
* upgrade eslint-plugin-promise from 6.0.1 to 6.1.0 ([#692](https://www.github.com/nodeshift/opossum/issues/692)) ([fd03739](https://www.github.com/nodeshift/opossum/commit/fd0373986471a884c80046a83987b37ea7a228d0))
* upgrade multiple dependencies with Snyk ([#688](https://www.github.com/nodeshift/opossum/issues/688)) ([4c634a4](https://www.github.com/nodeshift/opossum/commit/4c634a419e66ba3ca097f35efc759c92a443d120))
* upgrade util from 0.12.4 to 0.12.5 ([#693](https://www.github.com/nodeshift/opossum/issues/693)) ([dec7c75](https://www.github.com/nodeshift/opossum/commit/dec7c75e554c55ce7c0adf947ffb072592e70821))

## [7.0.0](https://www.github.com/nodeshift/opossum/compare/v6.4.0...v7.0.0) (2022-10-13)


### ⚠ BREAKING CHANGES

* drop Node.js 12 (#664)

### Features

* adds `AbortController` support ([#674](https://www.github.com/nodeshift/opossum/issues/674)) ([4b5f9f6](https://www.github.com/nodeshift/opossum/commit/4b5f9f637ddda324ddffb7ff4c3a066b6f1aed22))
* upgrade eslint-config-semistandard from 16.0.0 to 17.0.0 ([#667](https://www.github.com/nodeshift/opossum/issues/667)) ([dab109b](https://www.github.com/nodeshift/opossum/commit/dab109b2ed6c56fd566d9ae634d6d0f8e92f86de))
* upgrade husky from 7.0.4 to 8.0.0 ([#654](https://www.github.com/nodeshift/opossum/issues/654)) ([5807884](https://www.github.com/nodeshift/opossum/commit/5807884dfc3a8336ab263a5dbe40712b7fcaacac))
* upgrade serve from 13.0.4 to 14.0.1 ([#677](https://www.github.com/nodeshift/opossum/issues/677)) ([3af0318](https://www.github.com/nodeshift/opossum/commit/3af03187374906fe9e4f1a43e09a470f86937521))


### Bug Fixes

* package.json & package-lock.json to reduce vulnerabilities ([#672](https://www.github.com/nodeshift/opossum/issues/672)) ([00c6b08](https://www.github.com/nodeshift/opossum/commit/00c6b08fdba4995d97d9688c0f33b5bace5b3367))
* upgrade eslint-plugin-promise from 6.0.0 to 6.0.1 ([#678](https://www.github.com/nodeshift/opossum/issues/678)) ([27e3446](https://www.github.com/nodeshift/opossum/commit/27e344691c77b88b5a69ba10384940f48d27b16f))
* upgrade husky from 8.0.0 to 8.0.1 ([#679](https://www.github.com/nodeshift/opossum/issues/679)) ([2b24410](https://www.github.com/nodeshift/opossum/commit/2b244104f7e64b3de1c083b489ce7f686559bb04))
* upgrade serve from 13.0.2 to 13.0.4 ([#666](https://www.github.com/nodeshift/opossum/issues/666)) ([9bcbc19](https://www.github.com/nodeshift/opossum/commit/9bcbc19030c442c36d53dbaa83866e8daa8e53ab))
* upgrade tape from 5.5.3 to 5.6.0 ([#676](https://www.github.com/nodeshift/opossum/issues/676)) ([54fc8d0](https://www.github.com/nodeshift/opossum/commit/54fc8d0cc069e3196a9bbb4ca7b3ec11eadfac43))
* upgrade tape from 5.6.0 to 5.6.1 ([#683](https://www.github.com/nodeshift/opossum/issues/683)) ([626038f](https://www.github.com/nodeshift/opossum/commit/626038f6f07094e9407c570d3546d1d54061999f))


### Miscellaneous Chores

* drop Node.js 12 ([#664](https://www.github.com/nodeshift/opossum/issues/664)) ([db37766](https://www.github.com/nodeshift/opossum/commit/db37766dcfadc95dbe3861cbfd407346e6807d4a))

## [6.4.0](https://www.github.com/nodeshift/opossum/compare/v6.3.0...v6.4.0) (2022-06-13)


### Features

* upgrade eslint-config-semistandard from 15.0.1 to 16.0.0 ([#632](https://www.github.com/nodeshift/opossum/issues/632)) ([6d96a26](https://www.github.com/nodeshift/opossum/commit/6d96a26ee8e2464639101764fb6efae11afd23ee))
* upgrade husky from 6.0.0 to 7.0.4 ([#630](https://www.github.com/nodeshift/opossum/issues/630)) ([fbaa492](https://www.github.com/nodeshift/opossum/commit/fbaa49229c2f88693208841f643ac948e5cedf86))
* upgrade serve from 11.3.2 to 13.0.2 ([#631](https://www.github.com/nodeshift/opossum/issues/631)) ([5bbb4a8](https://www.github.com/nodeshift/opossum/commit/5bbb4a845ac3479256ab0cef2b83c8eed60ea3d1))


### Bug Fixes

* upgrade @babel/core from 7.17.4 to 7.17.5 ([#644](https://www.github.com/nodeshift/opossum/issues/644)) ([8a31e72](https://www.github.com/nodeshift/opossum/commit/8a31e72862ee5318f9e016c048e683a47d5fd554))
* upgrade @babel/core from 7.17.5 to 7.17.7 ([#646](https://www.github.com/nodeshift/opossum/issues/646)) ([2eb0e25](https://www.github.com/nodeshift/opossum/commit/2eb0e25b79606b5c6d0ae1a7cbc26bedd3fe4963))
* upgrade @babel/preset-env from 7.16.10 to 7.16.11 ([#637](https://www.github.com/nodeshift/opossum/issues/637)) ([20e9379](https://www.github.com/nodeshift/opossum/commit/20e9379f93f18aeb5a1555c1e794e02639d34de7))
* upgrade babel-loader from 8.2.3 to 8.2.4 ([#647](https://www.github.com/nodeshift/opossum/issues/647)) ([caf22ee](https://www.github.com/nodeshift/opossum/commit/caf22eea829e26a88dac6cc26c439407d54815f0))
* upgrade eslint-plugin-import from 2.25.4 to 2.26.0 ([#649](https://www.github.com/nodeshift/opossum/issues/649)) ([60d5f21](https://www.github.com/nodeshift/opossum/commit/60d5f21b84dd01c9969fb160f990e82538300d31))
* upgrade multiple dependencies with Snyk ([#636](https://www.github.com/nodeshift/opossum/issues/636)) ([3561571](https://www.github.com/nodeshift/opossum/commit/3561571dfffe18f78969dfe56e5928d73b9f8d1a))
* upgrade tape from 5.3.2 to 5.4.0 ([#626](https://www.github.com/nodeshift/opossum/issues/626)) ([308ff6a](https://www.github.com/nodeshift/opossum/commit/308ff6ad102eee1055c3f5c804620c7431554f97))
* upgrade tape from 5.4.1 to 5.5.0 ([#642](https://www.github.com/nodeshift/opossum/issues/642)) ([e657ab1](https://www.github.com/nodeshift/opossum/commit/e657ab1fa580078ffc3f1b51f5dbbee7456ffaa9))
* upgrade webpack-cli from 4.9.1 to 4.9.2 ([#639](https://www.github.com/nodeshift/opossum/issues/639)) ([3d28b3d](https://www.github.com/nodeshift/opossum/commit/3d28b3d9279257c3dbcfe4a43bc66165c9fcc68b))

## [6.3.0](https://www.github.com/nodeshift/opossum/compare/v6.2.1...v6.3.0) (2022-01-10)


### Features

* using semistandard and fixed some typos ([#617](https://www.github.com/nodeshift/opossum/issues/617)) ([7506923](https://www.github.com/nodeshift/opossum/commit/750692388dedd8134f1e83260529482d1b186029))


### Bug Fixes

* breaker should emit a shutdown event when it is shutdown ([#625](https://www.github.com/nodeshift/opossum/issues/625)) ([ea4d058](https://www.github.com/nodeshift/opossum/commit/ea4d058775918c075740fcf625de91555fddbc6c)), closes [#620](https://www.github.com/nodeshift/opossum/issues/620)
* upgrade @babel/core from 7.15.4 to 7.15.5 ([#604](https://www.github.com/nodeshift/opossum/issues/604)) ([709530d](https://www.github.com/nodeshift/opossum/commit/709530d204b8714491d69e34a765d081b262f855))
* upgrade @babel/core from 7.16.0 to 7.16.5 ([#622](https://www.github.com/nodeshift/opossum/issues/622)) ([43edde6](https://www.github.com/nodeshift/opossum/commit/43edde67052b830d4c9bc11f5a93c6d6935c8a52))
* upgrade @babel/preset-env from 7.15.4 to 7.15.6 ([#605](https://www.github.com/nodeshift/opossum/issues/605)) ([eb1d279](https://www.github.com/nodeshift/opossum/commit/eb1d279b2d5dfe3ea440d15303179d62a0938d46))
* upgrade @babel/preset-env from 7.16.0 to 7.16.5 ([#623](https://www.github.com/nodeshift/opossum/issues/623)) ([b875a23](https://www.github.com/nodeshift/opossum/commit/b875a2377609c3f96eefebf9373b494e1e818376))
* upgrade babel-loader from 8.2.2 to 8.2.3 ([#611](https://www.github.com/nodeshift/opossum/issues/611)) ([dc31373](https://www.github.com/nodeshift/opossum/commit/dc31373b1d3a43c91bd059cb55cfd3323a9882fc))
* upgrade eslint-plugin-import from 2.24.1 to 2.24.2 ([#602](https://www.github.com/nodeshift/opossum/issues/602)) ([940d3f6](https://www.github.com/nodeshift/opossum/commit/940d3f6b6fc9dc2f7dd2998e056d211209237ead))
* upgrade eslint-plugin-import from 2.24.2 to 2.25.1 ([#608](https://www.github.com/nodeshift/opossum/issues/608)) ([f827090](https://www.github.com/nodeshift/opossum/commit/f82709020b33d7b966be9ffbb468b905f179397f))
* upgrade eslint-plugin-import from 2.25.1 to 2.25.2 ([#609](https://www.github.com/nodeshift/opossum/issues/609)) ([c589ad0](https://www.github.com/nodeshift/opossum/commit/c589ad04c7cc1b8883c915c3bede64b47c70c8da))
* upgrade eslint-plugin-import from 2.25.2 to 2.25.3 ([#614](https://www.github.com/nodeshift/opossum/issues/614)) ([2084fcc](https://www.github.com/nodeshift/opossum/commit/2084fcc49e1d06ee824ef80d095ada060889c1a6))
* upgrade eslint-plugin-promise from 5.1.0 to 5.1.1 ([#619](https://www.github.com/nodeshift/opossum/issues/619)) ([0139be6](https://www.github.com/nodeshift/opossum/commit/0139be6ec967ca759fa3c574fd0efc438ebeeb30))
* upgrade eslint-plugin-promise from 5.1.1 to 5.2.0 ([#621](https://www.github.com/nodeshift/opossum/issues/621)) ([a2d11b8](https://www.github.com/nodeshift/opossum/commit/a2d11b84277b3f16dd79f826bc18a6a8f9f955fa))
* upgrade multiple dependencies with Snyk ([#603](https://www.github.com/nodeshift/opossum/issues/603)) ([ed3fe4f](https://www.github.com/nodeshift/opossum/commit/ed3fe4fa429f3baf193a17f70953fda16b304730))
* upgrade multiple dependencies with Snyk ([#606](https://www.github.com/nodeshift/opossum/issues/606)) ([0385cbd](https://www.github.com/nodeshift/opossum/commit/0385cbd77c495305f3b0b5aea73c0f8c7ce2e807))
* upgrade multiple dependencies with Snyk ([#612](https://www.github.com/nodeshift/opossum/issues/612)) ([78982f8](https://www.github.com/nodeshift/opossum/commit/78982f82fa80859504c315fa4d4f69afe3812e0e))
* upgrade tape from 5.2.2 to 5.3.1 ([#599](https://www.github.com/nodeshift/opossum/issues/599)) ([54b2a64](https://www.github.com/nodeshift/opossum/commit/54b2a642cc67b1e8d24db80c4fbfc80d8204d915))
* upgrade tape from 5.3.1 to 5.3.2 ([#616](https://www.github.com/nodeshift/opossum/issues/616)) ([42f21ed](https://www.github.com/nodeshift/opossum/commit/42f21ed451a77389261a6b9bd38c97da280a44e1))
* upgrade webpack-cli from 4.7.2 to 4.8.0 ([#600](https://www.github.com/nodeshift/opossum/issues/600)) ([09744be](https://www.github.com/nodeshift/opossum/commit/09744bedeadd2920a124ae6ea9bd94480f2e4ed1))
* upgrade webpack-cli from 4.8.0 to 4.9.0 ([#607](https://www.github.com/nodeshift/opossum/issues/607)) ([ebadc43](https://www.github.com/nodeshift/opossum/commit/ebadc43e0051df56268a36a288681385df4cd3c6))
* upgrade webpack-cli from 4.9.0 to 4.9.1 ([#610](https://www.github.com/nodeshift/opossum/issues/610)) ([b390eb1](https://www.github.com/nodeshift/opossum/commit/b390eb15e6d208a61fa319d6a1628a76412ec09d))

### [6.2.1](https://www.github.com/nodeshift/opossum/compare/v6.2.0...v6.2.1) (2021-08-23)


### Bug Fixes

* @babel/core, @babel/preset-env ([#582](https://www.github.com/nodeshift/opossum/issues/582)) ([b5291ac](https://www.github.com/nodeshift/opossum/commit/b5291ac7c97b0693067d79c2491cafce8607dfef))
* upgrade coveralls from 3.1.0 to 3.1.1 ([#590](https://www.github.com/nodeshift/opossum/issues/590)) ([211dffa](https://www.github.com/nodeshift/opossum/commit/211dffa1035b2a1a3b3ccd0a0e6b3eb34c2791a9))
* upgrade documentation from 13.1.1 to 13.2.5 ([#583](https://www.github.com/nodeshift/opossum/issues/583)) ([b9d7bc2](https://www.github.com/nodeshift/opossum/commit/b9d7bc25caa8cbf6f4b82eff1192f4b51512e692))
* upgrade eslint from 7.24.0 to 7.29.0 ([#585](https://www.github.com/nodeshift/opossum/issues/585)) ([c4570f8](https://www.github.com/nodeshift/opossum/commit/c4570f808caef026a4c4ac594c7f18d7e9bdbe3f))
* upgrade eslint from 7.29.0 to 7.30.0 ([#592](https://www.github.com/nodeshift/opossum/issues/592)) ([2747b82](https://www.github.com/nodeshift/opossum/commit/2747b82619c022905c565c0e2bc834dfcf8665d1))
* upgrade eslint from 7.30.0 to 7.31.0 ([#594](https://www.github.com/nodeshift/opossum/issues/594)) ([536b312](https://www.github.com/nodeshift/opossum/commit/536b312b7cc9f00156c83b87dc268c0ab14e023b))
* upgrade eslint from 7.31.0 to 7.32.0 ([#597](https://www.github.com/nodeshift/opossum/issues/597)) ([1e7ca08](https://www.github.com/nodeshift/opossum/commit/1e7ca0870059da8963fa1a6a36c42ab6489aaee8))
* upgrade eslint-config-standard from 16.0.2 to 16.0.3 ([#589](https://www.github.com/nodeshift/opossum/issues/589)) ([ec1c3de](https://www.github.com/nodeshift/opossum/commit/ec1c3de6b15cff0ace131ca4a7f308d53a794fd4))
* upgrade eslint-plugin-import from 2.22.1 to 2.23.4 ([#584](https://www.github.com/nodeshift/opossum/issues/584)) ([15a0b18](https://www.github.com/nodeshift/opossum/commit/15a0b184938129890cd6204c04456c09f2ce326b))
* upgrade tape from 5.2.0 to 5.2.2 ([#588](https://www.github.com/nodeshift/opossum/issues/588)) ([4139fd7](https://www.github.com/nodeshift/opossum/commit/4139fd7f3f113147650dada672e376d8f579385b))
* upgrade webpack-cli from 4.5.0 to 4.7.2 ([#586](https://www.github.com/nodeshift/opossum/issues/586)) ([d588890](https://www.github.com/nodeshift/opossum/commit/d5888908011cc6b9a7ce5ec80a7936a2a0e8dbce))

## [6.2.0](https://www.github.com/nodeshift/opossum/compare/v6.1.0...v6.2.0) (2021-07-07)


### Features

* initialize the state of a breaker on creation ([#574](https://www.github.com/nodeshift/opossum/issues/574)) ([b3dd431](https://www.github.com/nodeshift/opossum/commit/b3dd431bee343dd58c8612868333c90d0edbb83a))

## [6.1.0](https://www.github.com/nodeshift/opossum/compare/v6.0.1...v6.1.0) (2021-05-06)


### Features

* Add the ability to prime a breaker with previous stats ([#568](https://www.github.com/nodeshift/opossum/issues/568)) ([be26d74](https://www.github.com/nodeshift/opossum/commit/be26d74e30e7c13386cd2b2eacf89ca964e1467d))

### [6.0.1](https://www.github.com/nodeshift/opossum/compare/v6.0.0...v6.0.1) (2021-04-15)


### Bug Fixes

* return errors from invocation filtered errors ([#567](https://www.github.com/nodeshift/opossum/issues/567)) ([737e1b1](https://www.github.com/nodeshift/opossum/commit/737e1b1bbd5e440791d0b06f5b837073c0d2bdbf)), closes [#556](https://www.github.com/nodeshift/opossum/issues/556)
* **docs:** Fix documentation for default value of rollingPercentilesEnabled ([#563](https://www.github.com/nodeshift/opossum/issues/563)) ([93d5969](https://www.github.com/nodeshift/opossum/commit/93d59697c614a4b567fee63d76201f151a6ecef8))

## [6.0.0](https://www.github.com/nodeshift/opossum/compare/v5.1.3...v6.0.0) (2021-03-18)


### ⚠ BREAKING CHANGES

A succesful erroFilter should not trigger the fallback function.

Previously, if an errorFilter  function passed it would emit success but still call the fallback function.  This corrects this behavior.  even a passing errorFilter is a success

### Bug Fixes

* upgrade multiple dependencies with Snyk ([#545](https://www.github.com/nodeshift/opossum/issues/545)) ([9191afb](https://www.github.com/nodeshift/opossum/commit/9191afba6c433371d897c8cfe0f800f5a00b4efc))
* upgrade multiple dependencies with Snyk ([#548](https://www.github.com/nodeshift/opossum/issues/548)) ([8db0e9e](https://www.github.com/nodeshift/opossum/commit/8db0e9ec57b510a6f929cdbcfa0c474f6dc1950c))
* upgrade multiple dependencies with Snyk ([#552](https://www.github.com/nodeshift/opossum/issues/552)) ([7efcf91](https://www.github.com/nodeshift/opossum/commit/7efcf91f919a4517750b1da79293dd4bf93fe6ef))
* upgrade standard-version from 9.1.0 to 9.1.1 ([#551](https://www.github.com/nodeshift/opossum/issues/551)) ([16341bb](https://www.github.com/nodeshift/opossum/commit/16341bb806c14fec29cb25e7bd301e975ae23631))
* upgrade tape from 5.1.1 to 5.2.0 ([#553](https://www.github.com/nodeshift/opossum/issues/553)) ([fa69c06](https://www.github.com/nodeshift/opossum/commit/fa69c060199ef5910f541de79ef4eafe6aa36ae8))
* upgrade webpack from 5.11.1 to 5.12.1 ([#538](https://www.github.com/nodeshift/opossum/issues/538)) ([34b6d61](https://www.github.com/nodeshift/opossum/commit/34b6d618c892205f6478d20dbf6171181edbaab7))
* upgrade webpack from 5.12.1 to 5.20.1 ([#543](https://www.github.com/nodeshift/opossum/issues/543)) ([38b3e61](https://www.github.com/nodeshift/opossum/commit/38b3e61ad09fecb8e6fd22ff06069d9ff5465f2f))
* upgrade webpack from 5.20.1 to 5.20.2 ([#546](https://www.github.com/nodeshift/opossum/issues/546)) ([d7952d5](https://www.github.com/nodeshift/opossum/commit/d7952d5cf0dfd4e546f104d513469e9ca6f2e649))
* upgrade webpack from 5.20.2 to 5.22.0 ([#549](https://www.github.com/nodeshift/opossum/issues/549)) ([41efe20](https://www.github.com/nodeshift/opossum/commit/41efe20243b9584e43a545bc2a27d323f8e3f2be))
* upgrade webpack-cli from 4.3.1 to 4.4.0 ([#539](https://www.github.com/nodeshift/opossum/issues/539)) ([b089f0b](https://www.github.com/nodeshift/opossum/commit/b089f0b8650f69fa204c8c14a6879f46894a965d))
* upgrade webpack-cli from 4.4.0 to 4.5.0 ([#544](https://www.github.com/nodeshift/opossum/issues/544)) ([83110a4](https://www.github.com/nodeshift/opossum/commit/83110a4936230c58783d73741e88f6a1878c668f))


*  fix!: A succesful erroFilter should not trigger the fallback function. ([8a4fb7c](https://www.github.com/nodeshift/opossum/commit/8a4fb7c48922a39a1e3df7f646fbcf11b31e0872)), closes [#540](https://www.github.com/nodeshift/opossum/issues/540)

### [5.1.3](https://www.github.com/nodeshift/opossum/compare/v5.1.2...v5.1.3) (2021-01-25)


### Bug Fixes

* package.json & package-lock.json to reduce vulnerabilities ([#533](https://www.github.com/nodeshift/opossum/issues/533)) ([deaa258](https://www.github.com/nodeshift/opossum/commit/deaa2586c51b5ae5fbb528a5dc93d1909b2139bc))
* upgrade standard-version from 9.0.0 to 9.1.0 ([#535](https://www.github.com/nodeshift/opossum/issues/535)) ([3665bb0](https://www.github.com/nodeshift/opossum/commit/3665bb03f036dfc2728964441039df475a9e0269))
* upgrade tape from 5.0.1 to 5.1.0 ([#534](https://www.github.com/nodeshift/opossum/issues/534)) ([be93012](https://www.github.com/nodeshift/opossum/commit/be9301256ce137b0a7c32e2c437d72955eb44e95))
* upgrade tape from 5.1.0 to 5.1.1 ([#537](https://www.github.com/nodeshift/opossum/issues/537)) ([78db7ba](https://www.github.com/nodeshift/opossum/commit/78db7ba38cda4986d77c2642d2c318912a5244da))
* upgrade webpack from 5.10.3 to 5.11.0 ([#529](https://www.github.com/nodeshift/opossum/issues/529)) ([039fb48](https://www.github.com/nodeshift/opossum/commit/039fb487c61aaf2a582b9feb7efa5d0ae40ecfe8))
* upgrade webpack from 5.11.0 to 5.11.1 ([#532](https://www.github.com/nodeshift/opossum/issues/532)) ([67d850e](https://www.github.com/nodeshift/opossum/commit/67d850ea5f1289bac1bdb8ade2db0d1e10309f75))
* upgrade webpack-cli from 4.2.0 to 4.3.0 ([#531](https://www.github.com/nodeshift/opossum/issues/531)) ([9625ff7](https://www.github.com/nodeshift/opossum/commit/9625ff7fc0ca66fd84e9999e1a8c14784360324a))
* upgrade webpack-cli from 4.3.0 to 4.3.1 ([#536](https://www.github.com/nodeshift/opossum/issues/536)) ([afcc950](https://www.github.com/nodeshift/opossum/commit/afcc9505080e5564144f5d25e4ad9fa28c2a7cbe))

### [5.1.2](https://www.github.com/nodeshift/opossum/compare/v5.1.1...v5.1.2) (2021-01-07)


### Bug Fixes

* type-error on empty action ([#528](https://www.github.com/nodeshift/opossum/issues/528)) ([7b51dba](https://www.github.com/nodeshift/opossum/commit/7b51dba305ee4dfdbec16a034549a7538910c41b)), closes [#524](https://www.github.com/nodeshift/opossum/issues/524)
* upgrade @babel/core from 7.12.7 to 7.12.9 ([#517](https://www.github.com/nodeshift/opossum/issues/517)) ([2a28a73](https://www.github.com/nodeshift/opossum/commit/2a28a733087da5544c361406089b825633c9d60e))
* upgrade @babel/preset-env from 7.12.10 to 7.12.11 ([#527](https://www.github.com/nodeshift/opossum/issues/527)) ([bce3bfc](https://www.github.com/nodeshift/opossum/commit/bce3bfc78938ff37ad7bc5226fb2841a01ef5fc4))
* upgrade babel-loader from 8.2.1 to 8.2.2 ([#519](https://www.github.com/nodeshift/opossum/issues/519)) ([654af20](https://www.github.com/nodeshift/opossum/commit/654af20a492cc878ad93113f1890d9a735cbc9b4))
* upgrade multiple dependencies with Snyk ([#513](https://www.github.com/nodeshift/opossum/issues/513)) ([7e3ef5c](https://www.github.com/nodeshift/opossum/commit/7e3ef5c8218e45aa48b1eff159ef97aca2cc9dbe))
* upgrade multiple dependencies with Snyk ([#523](https://www.github.com/nodeshift/opossum/issues/523)) ([480d2ff](https://www.github.com/nodeshift/opossum/commit/480d2ff490fa53dadae61124638a65c69788f4aa))
* upgrade webpack from 5.10.1 to 5.10.3 ([#526](https://www.github.com/nodeshift/opossum/issues/526)) ([e72394c](https://www.github.com/nodeshift/opossum/commit/e72394c9b28bd4a2db6a7307ea46bb45f677facd))
* upgrade webpack from 5.4.0 to 5.6.0 ([#512](https://www.github.com/nodeshift/opossum/issues/512)) ([dc8f308](https://www.github.com/nodeshift/opossum/commit/dc8f308b1b6bd800657de4908a75a968e13f52e9))
* upgrade webpack from 5.6.0 to 5.8.0 ([#518](https://www.github.com/nodeshift/opossum/issues/518)) ([f4438c8](https://www.github.com/nodeshift/opossum/commit/f4438c84019c79d7d491f4563b61c707ef0f29fc))
* upgrade webpack from 5.8.0 to 5.9.0 ([#520](https://www.github.com/nodeshift/opossum/issues/520)) ([119ac47](https://www.github.com/nodeshift/opossum/commit/119ac47c34bcb23ee9080b865a8732d87660838e))
* upgrade webpack from 5.9.0 to 5.10.1 ([#525](https://www.github.com/nodeshift/opossum/issues/525)) ([d552015](https://www.github.com/nodeshift/opossum/commit/d552015888b7635578b18b87d96a7e9daf611da9))
* using default parameter to avoid runtime error ([#522](https://www.github.com/nodeshift/opossum/issues/522)) ([6a6f08b](https://www.github.com/nodeshift/opossum/commit/6a6f08b258ffb5db15df04bb189a2f31e6279e8a))

### [5.1.1](https://www.github.com/nodeshift/opossum/compare/v5.1.0...v5.1.1) (2020-12-07)


### Bug Fixes

* catch exceptions in fallback functions ([#510](https://www.github.com/nodeshift/opossum/issues/510)) ([34f75a2](https://www.github.com/nodeshift/opossum/commit/34f75a2994b3efd95fbd86fab5f6cf73f3fa39d8))
* upgrade webpack from 5.3.2 to 5.4.0 ([#507](https://www.github.com/nodeshift/opossum/issues/507)) ([05a8876](https://www.github.com/nodeshift/opossum/commit/05a88768ca4aae185787fed5eafa3f3b538bf326))
* upgrade webpack-cli from 4.1.0 to 4.2.0 ([#506](https://www.github.com/nodeshift/opossum/issues/506)) ([ba91b77](https://www.github.com/nodeshift/opossum/commit/ba91b77947f4657d60172d3991b851000a54c9c3))

## [5.1.0](https://www.github.com/nodeshift/opossum/compare/v5.0.2...v5.1.0) (2020-12-02)


### Features

* pass circuit params to error filter ([#492](https://www.github.com/nodeshift/opossum/issues/492)) ([29175d7](https://www.github.com/nodeshift/opossum/commit/29175d75d03adf4ebfd4d7603dc454349b056b94))


### Bug Fixes

* lint issues in test ([#499](https://www.github.com/nodeshift/opossum/issues/499)) ([35ddd8c](https://www.github.com/nodeshift/opossum/commit/35ddd8c9326d0d882d0ab3a089ac87a3279ffa6c))
* package.json & package-lock.json to reduce vulnerabilities ([#493](https://www.github.com/nodeshift/opossum/issues/493)) ([03fed29](https://www.github.com/nodeshift/opossum/commit/03fed29b3ac5c75662868800feda86b787ed7d9b))
* upgrade @babel/core from 7.12.1 to 7.12.3 ([#490](https://www.github.com/nodeshift/opossum/issues/490)) ([6a73957](https://www.github.com/nodeshift/opossum/commit/6a73957a52a290a30039b846bb5785f8503b15cd))
* upgrade babel-loader from 8.1.0 to 8.2.1 ([#505](https://www.github.com/nodeshift/opossum/issues/505)) ([885403b](https://www.github.com/nodeshift/opossum/commit/885403b58e4084d2abe71f1a65e666413abd4f32))
* upgrade documentation from 13.0.2 to 13.1.0 ([#491](https://www.github.com/nodeshift/opossum/issues/491)) ([cc94100](https://www.github.com/nodeshift/opossum/commit/cc94100c665096c830e04653016662c8c19dc5ce))
* upgrade multiple dependencies with Snyk ([#485](https://www.github.com/nodeshift/opossum/issues/485)) ([efe299e](https://www.github.com/nodeshift/opossum/commit/efe299e1d1cc0311a5ea406dad659ccd5d105754))
* upgrade multiple dependencies with Snyk ([#487](https://www.github.com/nodeshift/opossum/issues/487)) ([3afaa17](https://www.github.com/nodeshift/opossum/commit/3afaa1757a1defc7d1b6050aedb301e188fe35c6))
* upgrade webpack from 5.1.1 to 5.3.2 ([#500](https://www.github.com/nodeshift/opossum/issues/500)) ([1562a41](https://www.github.com/nodeshift/opossum/commit/1562a4148bbfbc8cc9d98e6b2241bbf942941c4e))
* upgrade webpack-cli from 4.0.0 to 4.1.0 ([#501](https://www.github.com/nodeshift/opossum/issues/501)) ([63d20c2](https://www.github.com/nodeshift/opossum/commit/63d20c27475319a5c8de434b6eb66b5e866376b7))


### Reverts

* Revert "build: use pull_request_target in actions workflow (#476)" ([3fa32b9](https://www.github.com/nodeshift/opossum/commit/3fa32b9d20c97a7f4e02cf602b8d4831f1ed1c83)), closes [#476](https://www.github.com/nodeshift/opossum/issues/476)

### [5.0.2](https://www.github.com/nodeshift/opossum/compare/v5.0.1...v5.0.2) (2020-10-14)


### Bug Fixes

* Adding docs about fallback parameters ([#460](https://www.github.com/nodeshift/opossum/issues/460)) ([e8989b6](https://www.github.com/nodeshift/opossum/commit/e8989b688c32d12519783fcd900ea9992e6ec2b6)), closes [#459](https://www.github.com/nodeshift/opossum/issues/459)
* upgrade @babel/core from 7.11.0 to 7.11.1 ([#458](https://www.github.com/nodeshift/opossum/issues/458)) ([bd59b48](https://www.github.com/nodeshift/opossum/commit/bd59b4860ce412608c520c757af1bf2b9398577b))
* upgrade @babel/core from 7.11.1 to 7.11.4 ([#463](https://www.github.com/nodeshift/opossum/issues/463)) ([2d4318d](https://www.github.com/nodeshift/opossum/commit/2d4318dd31e78af98e61ef355b451a19c0947bad))
* upgrade @babel/core from 7.11.5 to 7.11.6 ([#467](https://www.github.com/nodeshift/opossum/issues/467)) ([c0edb40](https://www.github.com/nodeshift/opossum/commit/c0edb40c75dd85eb829f459c86f42de2bc58b394))
* upgrade multiple dependencies with Snyk ([#466](https://www.github.com/nodeshift/opossum/issues/466)) ([4dc36ef](https://www.github.com/nodeshift/opossum/commit/4dc36ef7936b1cfa0a142dcf6683ee401eb6cefb))
* upgrade opener from 1.5.1 to 1.5.2 ([#465](https://www.github.com/nodeshift/opossum/issues/465)) ([96df963](https://www.github.com/nodeshift/opossum/commit/96df963ec70b1affa96c2045cfe56ddd8b6774e7))
* upgrade webpack from 4.44.1 to 4.44.2 ([#471](https://www.github.com/nodeshift/opossum/issues/471)) ([a9d8b86](https://www.github.com/nodeshift/opossum/commit/a9d8b8647544db60f42d32d515f1999cc4324ae0))

### [5.0.1](https://github.com/nodeshift/opossum/compare/v5.0.0...v5.0.1) (2020-08-21)


### Bug Fixes

* [Snyk] Upgrade documentation from 12.1.4 to 12.2.0 ([#411](https://github.com/nodeshift/opossum/issues/411)) ([4ed0b30](https://github.com/nodeshift/opossum/commit/4ed0b303c8c6de70d39b8bfd828f2ae0c2643265))
* package.json to reduce vulnerabilities ([#405](https://github.com/nodeshift/opossum/issues/405)) ([186b464](https://github.com/nodeshift/opossum/commit/186b46425c1db454bb1a2aa42712875b9790ee03))
* upgrade @babel/core from 7.10.4 to 7.10.5 ([#449](https://github.com/nodeshift/opossum/issues/449)) ([a18d669](https://github.com/nodeshift/opossum/commit/a18d669088682be0f5ef645e65792b8499124829))
* upgrade coveralls from 3.0.3 to 3.0.9 ([#408](https://github.com/nodeshift/opossum/issues/408)) ([d3bf2b4](https://github.com/nodeshift/opossum/commit/d3bf2b4168841b7335c31c5797ecdd38ece88f19))
* upgrade documentation from 12.0.0 to 12.1.4 ([#407](https://github.com/nodeshift/opossum/issues/407)) ([f2a2a67](https://github.com/nodeshift/opossum/commit/f2a2a6724592b9e28c25b2a9e3cadb4cc18679b0))
* upgrade multiple dependencies with Snyk ([#406](https://github.com/nodeshift/opossum/issues/406)) ([c485c2d](https://github.com/nodeshift/opossum/commit/c485c2d596075d94b960ab746f98446e1776db19))
* upgrade multiple dependencies with Snyk ([#455](https://github.com/nodeshift/opossum/issues/455)) ([1fb7791](https://github.com/nodeshift/opossum/commit/1fb77917be2604f93b9321033916c599b1e4e222))
* upgrade serve from 11.0.0 to 11.3.0 ([#409](https://github.com/nodeshift/opossum/issues/409)) ([8f35473](https://github.com/nodeshift/opossum/commit/8f3547307eec5a4164e7de3b679316bb08f3f54c))
* upgrade standard-version from 8.0.1 to 8.0.2 ([#448](https://github.com/nodeshift/opossum/issues/448)) ([dcba522](https://github.com/nodeshift/opossum/commit/dcba5225869c3534b17d33a89ee9b536581b848b))
* upgrade tape from 4.13.0 to 4.13.2 ([#410](https://github.com/nodeshift/opossum/issues/410)) ([b6bbf55](https://github.com/nodeshift/opossum/commit/b6bbf55382c8804861eacd3b2bc1df45fc4abb2f))
* upgrade webpack from 4.43.0 to 4.44.0 ([#451](https://github.com/nodeshift/opossum/issues/451)) ([ff127d5](https://github.com/nodeshift/opossum/commit/ff127d55a5fe4213166a9ceee61c8e0c0c9823dd))
* upgrade webpack from 4.44.0 to 4.44.1 ([#456](https://github.com/nodeshift/opossum/issues/456)) ([544fcd9](https://github.com/nodeshift/opossum/commit/544fcd9ddc34c4401ad71f056e31f2991ad5d63c))
* **test:** Avoiding an UnhandledPromiseRejection ([196457f](https://github.com/nodeshift/opossum/commit/196457fe1da4c32d2f36b7aee70b2b2a424ff984))

## [5.0.0](https://github.com/nodeshift/opossum/compare/v4.2.4...v5.0.0) (2020-02-20)

### [4.2.4](https://github.com/nodeshift/opossum/compare/v4.2.3...v4.2.4) (2020-01-22)


### Bug Fixes

* **circuit:** allow timeout option to be false ([#396](https://github.com/nodeshift/opossum/issues/396)) ([2453326](https://github.com/nodeshift/opossum/commit/2453326)), closes [#393](https://github.com/nodeshift/opossum/issues/393)

### [4.2.3](https://github.com/nodeshift/opossum/compare/v4.2.2...v4.2.3) (2020-01-03)

### [4.2.2](https://github.com/nodeshift/opossum/compare/v4.2.1...v4.2.2) (2020-01-02)

### [4.2.1](https://github.com/nodeshift/opossum/compare/v4.2.0...v4.2.1) (2019-11-08)


### Bug Fixes

* Fix stuck open ([#386](https://github.com/nodeshift/opossum/issues/386)) ([2c5b4a2](https://github.com/nodeshift/opossum/commit/2c5b4a2)), closes [#385](https://github.com/nodeshift/opossum/issues/385)

## [4.2.0](https://github.com/nodeshift/opossum/compare/v4.1.0...v4.2.0) (2019-10-28)


### Bug Fixes

* clear intervals on shutdown ([#378](https://github.com/nodeshift/opossum/issues/378)) ([91e2dbe](https://github.com/nodeshift/opossum/commit/91e2dbe))
* Clear reset timer on open() ([#383](https://github.com/nodeshift/opossum/issues/383)) ([7f488f1](https://github.com/nodeshift/opossum/commit/7f488f1))
* do not close if preexisting task resolves when state is not OPEN ([#382](https://github.com/nodeshift/opossum/issues/382)) ([7b92602](https://github.com/nodeshift/opossum/commit/7b92602))
* **circuit:** remove unneeded resolve() ([#377](https://github.com/nodeshift/opossum/issues/377)) ([cde55eb](https://github.com/nodeshift/opossum/commit/cde55eb))


### Features

* implement `isOurError()` ([#376](https://github.com/nodeshift/opossum/issues/376)) ([f6a3e3a](https://github.com/nodeshift/opossum/commit/f6a3e3a))
* Implement babel-loader in webpack ([#380](https://github.com/nodeshift/opossum/issues/380)) ([7b97914](https://github.com/nodeshift/opossum/commit/7b97914))

## [4.1.0](https://github.com/nodeshift/opossum/compare/v4.0.0...v4.1.0) (2019-10-16)


### Features

* add call() method to CircuitBreaker ([#374](https://github.com/nodeshift/opossum/issues/374)) ([ef05d2b](https://github.com/nodeshift/opossum/commit/ef05d2b))

## [4.0.0](https://github.com/nodeshift/opossum/compare/v3.1.0...v4.0.0) (2019-08-21)

### Breaking Changes

* The factory function has been removed in favor of simply using the `CircuitBreaker` constructor.
* Prometheus and Hystrix metrics have been moved into their own repositories.
* We no longer keep a set of all circuits

### Features

* refactor Prometheus and Hystrix metrics ([#350](https://github.com/nodeshift/opossum/issues/350)) ([3adbb90](https://github.com/nodeshift/opossum/commit/3adbb90))

## [3.0.0](https://github.com/nodeshift/opossum/compare/v2.3.0...v3.0.0) (2019-07-26)


### src

* Remove the Promisify function ([#354](https://github.com/nodeshift/opossum/issues/354)) ([86a6154](https://github.com/nodeshift/opossum/commit/86a6154)), closes [#352](https://github.com/nodeshift/opossum/issues/352)


### BREAKING CHANGES

* Remove the Promisify function from the CircuitBreaker factory

* Node has its own built-in promisify function that can be used instead.



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
