// webpack needs to know about all of our test files to generate
// its browser based bits. This is the entrypoint for browser/headless
// testing.
'use strict';

// We have to hard code the test file names because fs.readdirSync
// and friends won't really work in a browser, now will they?
require('../enable-disable-test');
require('../half-open-test.js');
require('../health-check-test.js');
require('../hystrix-test.js');
require('../semaphore-test.js');
require('../test.js');
