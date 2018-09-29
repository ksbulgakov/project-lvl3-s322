install:
	npm install

start:
	npm run babel-node -- src/bin/page-loader.js --output /tmp https://ru.hexlet.io/courses


publish:
	npm publish

lint:
	npm run eslint .

test:
	npm test

testw:
	npm run test-jest-watch

build:
	rm -rf dist
	npm run build
