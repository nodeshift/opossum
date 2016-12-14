ci:
	npm run lint
	npm run build:browser
	npm run build:compress
	npm run test:ci

.PHONY: ci