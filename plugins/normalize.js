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

module.exports = function(config) {
	return function(files, metalsmith, done) {
		Object.keys(files).forEach(function(file) {
			if (!/.md/.test(file)) return;

			var _f = files[file];

			_f.host = _f.host || config.host;
			_f.absolute_root = _f.absolute_root || config.absolute_root;

			// Normalize Document name to generate title
			// Regex: path/to/document/Document-Name.fileType
			//        (path/to/document/) (Document-Name) . (fileType)
			var regex = /(.+\/)(.+)\.(.+)/i;
			var matches = file.match(regex);
			if (matches) {
				//Clean and set the title
				if (matches[2] && matches[3] && matches[3] === 'md') {
					var title = matches[2].replace(/[`~!@#$%^&*()_|+\-=?;:'",.<>\{\}\[\]\\\/]/gi, ' ').trim();
					_f.title = _f.title || title;
				}
			}
		});

		done();
	};
};
