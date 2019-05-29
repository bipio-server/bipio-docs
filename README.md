# **NOTICE:** This repository has been **DEPRECATED**. Do not use.
## bip.io Documentation

Documentation repository for bip.io.

* Uses [metalsmith.io](http://www.metalsmith.io), a static site generator.

### Usage

`$ make build` will read the source documentation files, invoke a series of plugins to manipulate the files, and write the results to the `build/` directory.

### Directory Structure

```
.
|- build/
|- lib/
|– src/
    |– documents/
    |_ styles/
|– templates/
|- Makefile
|- metalsmith.json
|_ package.json
```

* `build/` directory is the destination of the rendered source files and is referenced in `build.js` as such.
* `lib/` directory contains any local plugins for file manipulation.
* `src/` directory contains all the raw source files.
* `templates/` directory contains the templating language templates.
* `metalsmith.json` is the configuration that metalsmith follows.


## The metalsmith.json file

This file handles the configuration for metalsmith and any used plugins and is used by the Metalsmith CLI.

The `plugins` object is a serial list of plugins that are invoked to manipulate and send files to the next step in the chain. It uses plugins found in the dependency list of `package.json` and plugins we've created ourselves and placed in the `lib/` directory.

### Example plugin

### Example Plugin Branch

### Example Custom Plugins

## Source files

The documentation source files are found in `src/`. We've been using [Github flavored Markdown](https://help.github.com/articles/github-flavored-markdown/) document format.

We will also store local stylesheets and JavaScript files in this directory.

### Markdown

* [Github flavored Markdown](https://help.github.com/articles/github-flavored-markdown/)
* [Markdown Basics](https://help.github.com/articles/markdown-basics/)

### Metadata

We can include some metadata in each markdown document to store key/value information about the document and its contents. It follows this format:

```
---
key: string
int: 1
bool: true
foo: [apple, bar, car]
obj: {"foo":"bar"}
---

First line of the documentation.
````

When metalsmith parses a document, it captures and stores whatever falls within the metadata and the document's content becomes whatever follows.

We can use this metadata to our advantage by storing any specific hostnames, an array of applicable versions, etc.

In our custom plugins, we can access the values of the metadata keys in each file object. For example, let's say we have the following markdown document:

```
---
versions: ["0.0.1", "0.0.2"]
---

This document is valid for two versions.
```

Then, let's say we are building the documentation for version 0.0.3. We can create a new plugin to check for valid versions and remove any documents that are not valid.

Example:

In metalsmith.json:

```
...
	"plugins": {
		...
		"./lib/our_plugin.js": { "valid_version": "0.0.3"},
		...
	}
...
```

In our_plugin.js:
```
module.exports = function(config) {
	return function(files, metalsmith, done) {
		Object.keys(files).forEach(function(file) {
			if (files[file].versions.length) {
				if (files[file].versions.indexOf(config.valid_version) > -1) {
					delete files[file];
				}
			}
		});
		done();
	};
}
```

### Stylesheets

### Scripts


## Template files

### Eco

## Developing Locally

```
$ npm update && npm install
$ node build.js
```

For local development, I then started a small http server on my dev machine:

```
$ npm install -g http-server && http-server path/to/the/build/directory
```

## License

Licensed under the Apache License, Version 2.0 (the "License"); you may not use this file except in compliance with the License. You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.


Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
