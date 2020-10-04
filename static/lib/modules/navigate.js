'use strict';

/* global define, $, window, ajaxify */

define('kbm/modules/navigate', ['navigator', 'kbm/modules/animate'], function (navigator, animate) {
	const navigate = {};
	let kbm;

	navigate.init = function(_kbm) {
		kbm = _kbm;
	};

	navigate.scroll = function(ev) {
		var index = ajaxify.data.template.category ? ajaxify.data.topicIndex : ajaxify.data.postIndex;
		var count = ajaxify.data.template.category ? ajaxify.data.topic_count : ajaxify.data.postcount;

		if (ajaxify.data.template.category && $('[component="category/topic"].highlight').length) {
			index = parseInt($('[component="category/topic"].highlight').attr('data-index'), 10);
		}

		if (!(index < 1 && ev.keyCode === 87) && !(index >= (count - 1) && ev.keyCode === 83)) {	
			index = index + (ev.keyCode === 83 ? 1 : -1);
			ajaxify.data[ajaxify.data.template.category ? 'topicIndex' : 'postIndex'] = index;
			navigator.scrollToIndex(index, true, 150);
		}
		
		kbm.labels.help.removeClass('hidden').html('<i class="fa fa-list-ul ' + (ev.keyCode === 83 ? 'down' : 'up') + '"></i> [' + (index + 1) + '/' + count + ']');
		if (ajaxify.data.template.category) {
			kbm.menu.options.removeClass('hidden');
			kbm.menu.alt.addClass('hidden');
			kbm.menu.shift.addClass('hidden');
		}
		animate.activate();
	};

	return navigate;
});