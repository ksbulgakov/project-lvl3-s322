install:
	npm install

start:
	npm run babel-node -- src/bin/page-loader.js --output /tmp https://hexlet.io/courses


publish:
	npm publish

lint:
	npm run eslint .

test:
	DEBUG=page-loader:* npm test

testw:
	npm run test-jest-watch

build:
	rm -rf dist
	npm run build
