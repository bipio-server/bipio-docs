include ../wot-make/npm.mk

build: node_modules
	node build.js

node_modules: package.json
	npm install

.PHONY: build
