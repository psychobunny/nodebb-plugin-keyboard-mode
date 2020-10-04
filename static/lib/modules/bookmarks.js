'use strict';

/* global define, $, window, ajaxify */

define('kbm/modules/bookmarks', ['kbm/modules/animate'], function (animate) {
	const bookmarks = {};
	let kbm;

	bookmarks.init = function(_kbm) {
		kbm = _kbm;
	};

	bookmarks.bookmark = function() {
		kbm.bookmarks = kbm.bookmarks.filter(x => x !== ajaxify.currentPage);
		kbm.bookmarks.push(ajaxify.currentPage);
		kbm.labels.help.html('<i class="fa fa-bookmark"></i> Page Bookmarked');
		animate.activate();
	};

	bookmarks.cycle = function(ev) {
		var index = kbm.bookmarks.indexOf(ajaxify.currentPage);
		var count = kbm.bookmarks.length;

		if (!count) {
			kbm.labels.help.html('<i class="fa fa-bookmark"></i> No Quick Bookmarks Found');
			return animate.activate();
		}

		if (ev.keyCode === 68) {
			index++;
			if (index >= count || index < 0) {
				index = 0;
			}
		}

		if (ev.keyCode === 65) {
			index--;
			if (index < 0) {
				index = count - 1;
			}
		}

		var url = kbm.bookmarks[index];

		kbm.labels.help.html('<i class="fa fa-bookmark"></i> [' + (index + 1) + '/' + count + '] ' + url);
		ajaxify.go(url);
		animate.activate();
	};

	return bookmarks;
});