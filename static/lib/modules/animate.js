'use strict';

/* global define, $, window, ajaxify */

define('kbm/modules/animate', [], function () {
	const animate = {};
	let kbm;

	animate.init = function(_kbm) {
		kbm = _kbm;
	};

	animate.activate = function() {
		clearTimeout(kbm.animating);

		kbm.container.removeClass('animate-activate').addClass('animate-activate');
		kbm.animating = setTimeout(function() {
			kbm.container.removeClass('animate-activate kbm-visible');
			kbm.container.find('#kbm-shift, #kbm-alt, #kbm-key').removeClass('label-primary label-success label-info')
			kbm.animating = false;
			kbm.labels.help.html('');
		}, 1200);
	}

	return animate;
});