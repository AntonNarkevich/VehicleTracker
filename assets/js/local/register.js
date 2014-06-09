/*global jQuery*/
(function register($) {
	'use strict';

	function validateRegisterFormHandler(formInstance) {

		if(formInstance.isValid()) {
			return;
		}

		formInstance.submitEvent.preventDefault();

		var $form = formInstance.$element;
		$form.find('.server-error-message').remove();
	}

	$(function () {
		$('.registerForm').parsley().subscribe('parsley:form:validate', validateRegisterFormHandler);
	});

}(jQuery));