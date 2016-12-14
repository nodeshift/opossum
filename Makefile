ci:
	npm run lint
	npm run build:browser
	npm run test:ci

.PHONY: ci