/*global jQuery*/
(function removeServerErrMsg($) {
	'use strict';

	function validateFormHandler(formInstance) {

		if(formInstance.isValid()) {
			return;
		}

		formInstance.submitEvent.preventDefault();

		var $form = formInstance.$element;
		$form.find('.server-error-message').remove();
	}

	$(function () {
		$('form[data-parsley-validate]').parsley().subscribe('parsley:form:validate', validateFormHandler);
	});

}(jQuery));