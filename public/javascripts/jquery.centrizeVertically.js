/*global jQuery*/
(function centrizeVertically($) {
	'use strict';

	/**
	 * Changes margin-top of given element
	 * to make the element centrized relative to
	 * its offset parent.
	 * @param $element
	 * jQuery element
	 */
	$.fn.centrizeVertically = function changeMarginsToCentrize($element) {
		return this.each(function() {
			$element = $(this);

			var height = $element.height();
			//Auto throws away 'px'
			var marginTop = parseInt($element.css('margin-top'));
			var offsetTop = $element.offset().top;
			var offsetParentHeight = $element.offsetParent().height();

			console.log('height value is: ' + height);
			console.log('marginTop value is: ' + marginTop);
			console.log('offsetTop value is: ' + offsetTop);
			console.log('offsetParentHeight value is: ' + offsetParentHeight);

			var neededOffset = (offsetParentHeight - height) / 2;
			var marginChange = Math.round(neededOffset - offsetTop);

			console.log('neededOffset value is: ' + neededOffset);
			console.log('marginChange value is: ' + marginChange);

			//Auto adds 'px'
			$element.css('margin-top', marginTop + marginChange);
		});
	};
}(jQuery));