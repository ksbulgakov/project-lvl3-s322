install:
	npm install

start:
	npm run babel-node -- src/bin/gendiff.js --format plain __tests__/__fixtures__/beforeAST.ini __tests__/__fixtures__/afterAST.ini

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
