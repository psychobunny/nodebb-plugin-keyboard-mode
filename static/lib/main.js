'use strict';

/* globals document, $ */

require([
	'benchpress',
	'kbm/modules/bookmarks',
	'kbm/modules/navigate',
	'kbm/modules/animate',
], function (bch, bookmarks, navigate, animate) {
	const kbm = {
		container: null,
		menu: {},
		labels: {},
		animating: false,
		activated: false,
		keys: { shift: false, alt: false },
		bookmarks: [],
		modules: {
			bookmarks: bookmarks,
			navigate: navigate,
			animate: animate,
		},
		console: false,
		consoleMode: false,
	};

	bookmarks.init(kbm);
	navigate.init(kbm);
	animate.init(kbm);

	function onKeyChange(ev) {
		if (kbm.consoleMode) {
			if (ev.keyCode === 27) {
				animate.end();
				//kbm.labels.key.removeClass('hidden').toggleClass('label-success', keyDown).html('Escape');
				kbm.labels.shift.removeClass('hidden');
				kbm.labels.alt.removeClass('hidden');
				kbm.console.addClass('hidden');
				kbm.consoleMode = false;
			}

			return;
		}

		if ($('input:focus, textarea:focus').length > 0 ) {
			return;
		}

		var keyUp = ev.type === 'keyup';
		var keyDown = ev.type === 'keydown';

		if (kbm.animating && keyUp) {
			animate.activate();
			return;
		}

		if ($('#content').hasClass('ajaxifying') && keyDown) {
			return;
		}

		kbm.labels.help.removeClass('hidden');

		if (ev.keyCode === 191) {
			kbm.labels.key.removeClass('hidden').toggleClass('label-default', keyDown).html('/');
			kbm.labels.shift.addClass('hidden');
			kbm.labels.alt.addClass('hidden');
			kbm.console.removeClass('hidden');
			kbm.consoleMode = true;
			animate.activate(true);
			if (ev.type === 'keydown') {
				setTimeout(function() {
					kbm.console.focus();
				}, 1);
			}


			kbm.menu.shift.addClass('hidden');
			kbm.menu.alt.addClass('hidden');
			kbm.menu.options.removeClass('hidden');
			kbm.menu.options.find('.label').addClass('hidden');
			kbm.labels.esc.removeClass('hidden');
		}

		if (ev.keyCode === 13 && keyDown && ajaxify.data.template.category) {
			kbm.labels.key.removeClass('hidden').html('Enter');
			kbm.labels.help.addClass('hidden');
			$('[component="category/topic"].highlight').find('[component="topic/header"] a')[0].click();
			animate.activate();
			return;
		}

		if (ev.keyCode === 16) {
			kbm.keys.shift = keyDown;

			kbm.labels.shift.toggleClass('label-primary', kbm.keys.shift);
			kbm.container.toggleClass('kbm-visible', kbm.keys.shift);
			if (kbm.keys.shift) {
				if (!kbm.activated) {
					kbm.labels.help.html('Activate Keyboard Mode');
					kbm.labels.key.removeClass('hidden').html('K');
				} else {
					kbm.labels.key.addClass('hidden');
				}
			}

			kbm.menu.shift.toggleClass('hidden', !kbm.activated || !kbm.keys.shift);
			kbm.menu.alt.addClass('hidden');
			kbm.menu.options.addClass('hidden');
		}
		if (ev.keyCode === 18) {
			kbm.keys.alt = keyDown;

			kbm.labels.alt.toggleClass('label-info', kbm.keys.alt);
			kbm.menu.shift.toggleClass('hidden', !kbm.activated || kbm.keys.alt);
			kbm.menu.alt.toggleClass('hidden', !kbm.activated || !kbm.keys.alt);
		}

		if (ev.keyCode === 75) {
			kbm.labels.key.removeClass('hidden').toggleClass('label-success', keyDown).html('K');
			kbm.labels.help.html('Keyboard Mode ' + (!kbm.activated ? 'Activated' : 'Deactivated'));
			kbm.activated = !kbm.activated;
			animate.activate();
		}

		if (ev.keyCode === 66) {
			kbm.labels.key.removeClass('hidden').toggleClass('label-success', keyDown).html('B');
			bookmarks.bookmark();
		}

		if (ev.keyCode === 65 || ev.keyCode === 68) {
			kbm.labels.key.removeClass('hidden').toggleClass('label-success', keyDown).html(ev.keyCode === 65 ? 'A' : 'D');
			bookmarks.cycle(ev);
		}

		if ((ev.keyCode === 83 || ev.keyCode === 87) && keyDown) {
			if (ajaxify.data.template.category || ajaxify.data.template.topic) {
				kbm.labels.key.removeClass('hidden').toggleClass('label-success', keyDown).html(ev.keyCode === 83 ? 'S' : 'W');
				navigate.scroll(ev);
			}
		}
	}

	function onConsoleInput() {
		
	}

	bch.parse('plugins/keyboard-mode/menu', {}, function(html) {
		$('body').append($(html));

		kbm.container = $('.kbm-container');
		kbm.menu = {
			alt: $('.kbm-menu[data-modifier="alt"]'),
			shift: $('.kbm-menu[data-modifier="shift"]'),
			options: $('.kbm-menu[data-modifier="options"]'),
		};
		kbm.console = $('#kbm-console');
		kbm.labels = {
			alt:  $('#kbm-alt'),
			shift:  $('#kbm-shift'),
			key:  $('#kbm-key'),
			help:  $('#kbm-help'),
			esc:  $('#kbm-esc'),
			enter:  $('#kbm-enter'),
		};

		$(document).on('keydown keyup', onKeyChange);
		$(kbm.console).on('change', onConsoleInput)
		kbm.container.removeClass('hidden');
	});
});