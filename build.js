/**
 *
 * Copyright (c) 2017 InterDigital, Inc. All Rights Reserved
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

var Metalsmith = require('metalsmith'),
	markdown   = require('metalsmith-markdown'),
	layouts    = require('metalsmith-layouts'),
	in_place   = require('metalsmith-in-place');

var normalize  = require('./plugins/normalize.js');
var paths      = require('./plugins/paths.js');

Metalsmith(__dirname)
	// Normalize each source file with out own plugin
	.use(normalize({
		host: 'shipiot.net',
		absolute_root: 'docs'
	}))

	// Pass each source file through handlebars for token replacement
	.use(in_place({
		engine: 'handlebars'
	}))

	// Render markdown files as html
	.use(markdown())

	// Pass html files through handlebars to build pages
	.use(layouts({
		engine: 'handlebars',
		default: 'default.handlebars',
		pattern: ['**.html', '**/*.html'],
		partials: {
			header: 'partials/header',
			footer: 'partials/footer',
			sidebar: 'partials/sidebar'
		}
	}))

	// Correct the URI for each document
	.use(paths({
		root: ""
	}))

	// Set detination directory
	.destination('./build')
	// Build
	.build(function (err) { if(err) console.log(err) })
