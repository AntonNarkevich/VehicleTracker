/*global jQuery, bootbox*/
(function($, bootbox) {
	'use strict';

	var applyFireButtonsConfirmation = function() {
		$('.btn-fire').on('click.confirm', function( e) {
			e.preventDefault();

			var confirmMessage = this.getAttribute('data-confirm-message');
			var href = this.href;

			bootbox.confirm(confirmMessage, function (isConfirmed) {
				if (isConfirmed) {
					window.location = href;
				}
			});
		});
	};

	$(applyFireButtonsConfirmation);
}(jQuery, bootbox));