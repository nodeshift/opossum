ci:
	npm install
	npm run test:ci

clean:
	rm -rf node_modules dist/*.js test/browser/webpack-test.js

.PHONY: ci