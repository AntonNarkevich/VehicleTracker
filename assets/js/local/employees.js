/*global jQuery*/
(function( $) {
	'use strict';

	var $modal = $('.confirmation');
	var $confirmButton = $modal.find('.btn-confirm');

	var modalConfirm = function (href) {
		$confirmButton.off('click.confirm');
		$confirmButton.on('click.confirm', function () {
			window.location = href;
		});

		$modal.modal('show');
	};

	var applyFireButtonsConfirmation = function() {
		$('.btn-fire').on('click.confirm', function( e) {
			e.preventDefault();

			modalConfirm(this.href);
		});
	};

	$(applyFireButtonsConfirmation);
}(jQuery));