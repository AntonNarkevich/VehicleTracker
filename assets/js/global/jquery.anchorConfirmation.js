/*global jQuery, bootbox*/
(function anchorConfirmation($, bootbox) {
	'use strict';

	$(function() {
		$('.anchor-confirm').on('click.confirm', function( e) {
			e.preventDefault();

			var confirmMessage = this.getAttribute('data-confirm-message');
			var href = this.href;

			bootbox.confirm(confirmMessage, function (isConfirmed) {
				if (isConfirmed) {
					window.location = href;
				}
			});
		});
	});
}(jQuery, bootbox));