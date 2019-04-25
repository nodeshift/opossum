ci:
	npm run lint
	npm run build:docs
	npm run build:browser
	npm run test:ci

clean:
	rm -rf node_modules dist/*.js test/browser/browserified-tests.js

.PHONY: ci