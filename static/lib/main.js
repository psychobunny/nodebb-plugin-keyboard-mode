'use strict';

/* globals document, $ */

$(document).ready(function () {
	var container;
	var menu;
	var labels = {};
	var animating = false;
	var activated = false;

	var quickBookmarks = [];

	function setupKBM() {
		function toggleLabel(label, active) {
			//labels[label].toggleClass('label-default', !active);
			labels[label].toggleClass('label-primary', active);
		}


		$(document).on('keydown keyup', function(ev) {
			if ($('input:focus, textarea:focus').length > 0 ) {
				return;
			}

			if (animating && ev.type === 'keyup') {
				animate.activate();
				return;
			}

			if ($('#content').hasClass('ajaxifying') && ev.type === 'keydown') {
				return;
			}

			if (ev.keyCode === 16) {
				toggleLabel('shift', ev.type === 'keydown')
				container.toggleClass('kbm-visible', ev.type === 'keydown');
				if (ev.type === 'keydown') {
					if (!activated) {
						labels.help.html('Activate Keyboard Mode');
						menu.addClass('hidden');
						labels.key.removeClass('hidden').html('K');
					} else {
						labels.key.addClass('hidden');
						menu.removeClass('hidden');
					}
				} else {
					//container.removeClass('animate-activate');
				}
			}
			if (ev.keyCode === 18) {
				toggleLabel('alt', ev.type === 'keydown')
			}

			if (ev.keyCode === 75) {
				labels['key'].removeClass('hidden').toggleClass('label-success', ev.type === 'keydown').html('K');
				labels.help.html('Keyboard Mode ' + (!activated ? 'Activated' : 'Deactivated'));
				activated = !activated;
				animate.activate();
			}

			if (ev.keyCode === 66) {
				labels['key'].removeClass('hidden').toggleClass('label-success', ev.type === 'keydown').html('B');
				quickBookmarks = quickBookmarks.filter(x => x !== ajaxify.currentPage);
				quickBookmarks.push(ajaxify.currentPage);
				labels.help.html('<i class="fa fa-bookmark"></i> Page Bookmarked');
				animate.activate();
			}

			if (ev.keyCode === 65 || ev.keyCode === 68) {
				labels['key'].removeClass('hidden').toggleClass('label-success', ev.type === 'keydown').html(ev.keyCode === 65 ? 'A' : 'D');
				
				var index = quickBookmarks.indexOf(ajaxify.currentPage);
				var count = quickBookmarks.length;

				if (!count) {
					labels.help.html('<i class="fa fa-bookmark"></i> No Quick Bookmarks Found');
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

				var url = quickBookmarks[index];

				labels.help.html('<i class="fa fa-bookmark"></i> [' + (index + 1) + '/' + count + '] ' + url);
				ajaxify.go(url);
				animate.activate();
			}
		});

		container.removeClass('hidden');
	}

	$(window).on('action:ajaxify.end', function(ev, data) {
		if ($('.kbm-container').length) {
			return;
		}

		require(['benchpress'], function(bch) {
			bch.parse('plugins/keyboard-mode/menu', {}, function(html) {
				$('body').append($(html));

				container = $('.kbm-container');
				menu = $('.kbm-menu');
				labels = {
					alt:  $('#kbm-alt'),
					shift:  $('#kbm-shift'),
					key:  $('#kbm-key'),
					help:  $('#kbm-help'),
					esc:  $('#kbm-esc'),
				};
				setupKBM();
			});
		});
	});

	var animate = {};
	animate.activate = function() {
		clearTimeout(animating);

		container.removeClass('animate-activate').addClass('animate-activate');
		animating = setTimeout(function() {
			container.removeClass('animate-activate kbm-visible');
			container.find('.label').removeClass('label-primary label-success')
			animating = false;
			labels.help.html('');
		}, 1500);
	}
});