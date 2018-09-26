install:
	npm install

start:
	npm run babel-node -- src/bin/page-loader.js --output /home/user/Documents/hexlet/Nodejs/projects/project-lvl3-s322/__tests__/__fixtures__ https://hexlet.io/courses


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
