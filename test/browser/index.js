// webpack needs to know about all of our test files to generate
// its browser based bits. This is the entrypoint for browser/headless
// testing.
'use strict';

const fs = require('fs');
const path = require('path');
const base = path.join(__dirname, '..');

const files = fs.readdirSync(base, 'utf-8');
files.filter(f => f.endsWith('test.js')).map(f => require(path.join(base, f)));
