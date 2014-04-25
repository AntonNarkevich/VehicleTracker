/*global jQuery, console*/
(function centrizeVertically($) {
	'use strict';

	/**
	 * Changes margin-top of given element.
	 * to make the element centrized relatively to window
	 * @param {Object} options - Options.
	 * @param {boolean} options.isNegativeMarginAllowed -
	 * If true negative margins can be used for centrizing
	 * else if negative margin is needed for centrizing
	 * centrizeVertically will set marginTop to 0.
	 * @param {boolean} options.isLoggingEnabled -
	 * If true enables logging.
	 * @returns {*} - * jQuery element for chaining.
	 */
	$.fn.centrizeVertically = function changeMarginsToCentrize(options) {
		var defaults = {
			isNegativeMarginAllowed: false,
			isLoggingEnabled: false
		};

		var settings = $.extend(defaults, options);

		function log() {
			if (!settings.isLoggingEnabled) {
				return;
			}

			if (console === undefined) {
				return;
			}

			var slice = Array.prototype.slice;
			var args = slice.call(arguments, 0);

			console.log.apply(console, args);
		}

		return this.each(function () {
			var $element = $(this);
			var $window = $(window);

			var height = $element.height();
			//Auto throws away 'px'
			var marginTop = parseInt($element.css('margin-top'), 10);
			var offsetTop = $element.offset().top;
			var windowHeight = $window.height();

			log('height value is: ' + height);
			log('marginTop value is: ' + marginTop);
			log('offsetTop value is: ' + offsetTop);
			log('windowHeight value is: ' + windowHeight);

			var neededOffset = (windowHeight - height) / 2;
			var marginChange = Math.round(neededOffset - offsetTop);

			log('neededOffset value is: ' + neededOffset);
			log('marginChange value is: ' + marginChange);

			var newMarginTop = marginTop + marginChange;

			if (newMarginTop < 0 && !settings.isNegativeMarginAllowed) {
				log('Negative marginTop value. Setting 0.');
				newMarginTop = 0;
			}

			$element.css('margin-top', newMarginTop);
		});
	};
}(jQuery));