/*global jQuery, VT*/
(function initPage($) {
	'use strict';

	var $initRegistrationBlock = $('.vt-init-registration-block');

	$initRegistrationBlock.centrizeVertically();

	$(window).resize(function initPage() {
		$initRegistrationBlock.centrizeVertically();
	});
}(jQuery));