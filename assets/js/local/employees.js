/*global jQuery*/
(function employees($) {
	'use strict';

	var $modal = $('.confirmation');
	var $confirmButton = $modal.find('.btn-confirm');

	function showConfirmModal($linkToConfirm) {
		$confirmButton.off('click.confirm');
		$confirmButton.on('click.confirm', function () {
			$linkToConfirm.attr('data-is-confirmed', 'true');
			$linkToConfirm[0].click();
		});

		$modal.modal('show');
	}

	function hideConfirmModal() {
		$modal.modal('hide');
	}

	function applyFireButtonsConfirmation() {
		var $fireButtons = $('.btn-fire');

		$fireButtons.on('click.confirm', function(e) {
			var $button = $(this);

			if (!$button.attr('data-is-confirmed')) {
				e.preventDefault();

				showConfirmModal($button);

				return;
			}

			$fireButtons.removeAttr('data-is-confirmed');
			hideConfirmModal();
		});

	}

	$(applyFireButtonsConfirmation);
}(jQuery));