test: lint
	npm test

ci: lint
	npm run prepublish
	npm run coverage

lint: node_modules
	npm run lint

publish: test
	npm publish

clean:
	rm -rf node_modules coverage

node_modules: package.json
	npm install

.PHONY: node_modules