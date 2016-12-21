ci:
	npm run lint
	npm run build:browser
	npm run build:compress
	npm run test:ci

clean:
	rm -rf node_modules dist/*.js test/browser/browserified-tests.js

.PHONY: ci