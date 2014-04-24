/*global jQuery*/
(function centrizeVertically($, undefined) {
	'use strict';

	/**
	 * Changes margin-top of given element
	 * to make the element centrized relative to
	 * its offset parent.
	 * @param $element - * jQuery element
	 * @param {Object} options
	 * @param {boolean} options.isNegativeMarginAllowed - 
	 * If true negative margins can be used for centrizing
	 * else the plugin don't set negative marginTop values
	 * If marginTop was negative centrizeVertically won't
	 * modify it.
	 * @param {boolean} options.isLoggingEnabled
	 * If true enables logging
	 * @returns {*} - * jQuery element for chaining
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
		
		return this.each(function() {
			var $element = $(this);

			var height = $element.height();
			//Auto throws away 'px'
			var marginTop = parseInt($element.css('margin-top'), 10);
			var offsetTop = $element.offset().top;
			var offsetParentHeight = $element.offsetParent().height();

			log('height value is: ' + height);
			log('marginTop value is: ' + marginTop);
			log('offsetTop value is: ' + offsetTop);
			log('offsetParentHeight value is: ' + offsetParentHeight);

			var neededOffset = (offsetParentHeight - height) / 2;
			var marginChange = Math.round(neededOffset - offsetTop);

			log('neededOffset value is: ' + neededOffset);
			log('marginChange value is: ' + marginChange);

			//Auto adds 'px'
			var newMarginTop = marginTop + marginChange;
			
			if (newMarginTop < 0 && !settings.isNegativeMarginAllowed) {
				log('Negative marginTop value. Aborting.');
				return;
			}

			$element.css('margin-top', newMarginTop);
		});
	};
}(jQuery));