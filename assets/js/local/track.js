/*global google, jQuery, VT, _, MarkerWithLabel*/
(function ($, google) {
	'use strict';

	var managerId = $('#manager-id').val();

	if (!managerId) {
		VT.logger.error('ManagerId id not found in the markup');
		return;
	}

	$.ajax({
		url: '/m/' + managerId + '/trackData'
	}).done(function (trackInfos) {
		VT.logger.debug('Got positions.', trackInfos);

		//Initializing google map
		var map = new google.maps.Map($('.vt-google-map')[0], {
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		});

		var viewVehicle = function (vehicleId) {
			var selectedTrackInfo = _(trackInfos).find(function (trackInfo) {
				return trackInfo.vehicleId === vehicleId;
			});

			var centerPositionInfo = _(selectedTrackInfo.positions).last();
			var mapCenter = new google.maps.LatLng(centerPositionInfo.latitude, centerPositionInfo.longitude);

			map.panTo(mapCenter);
		};

		//Setting initial map position
		var lastVehicleId = _(trackInfos).last().vehicleId;
		viewVehicle(lastVehicleId);

		//Configure view vehicle controls
		var $viewVehicleButton = $('.view-vehicle-button');
		var $viewVehicleSelect = $('.view-vehicle-select');

		_(trackInfos).each(function (trackInfo) {
			$viewVehicleSelect.append(new Option(trackInfo.vehicleName, trackInfo.vehicleId));
		});

		$viewVehicleButton.click(function () {
			var vehicleId = $viewVehicleSelect.val();

			viewVehicle(vehicleId);
		});

		//Adding movement lines
		trackInfos.forEach(function(trackInfo) {
			var lastPositionInfo = _(trackInfo.positions).last();
			var lastPosition = new google.maps.LatLng(lastPositionInfo.latitude, lastPositionInfo.longitude);

			var getRandomInt = function getRandomInt(min, max) {
				return Math.floor(Math.random() * (max - min + 1)) + min;
			};

			var iconNumber = getRandomInt(1, 3);

			var marker = new MarkerWithLabel({
				position: lastPosition,
				map: map,
				icon: {
					url: '/images/marker' + iconNumber + '.png',
					anchor: new google.maps.Point(42, 15)
				},
				labelContent: trackInfo.vehicleName,
				labelAnchor: new google.maps.Point(-10, 20),
				labelClass: 'label-vehicle-name'
			});

			google.maps.event.addListener(marker, "click", function () {
				//TODO: Remove owner id from here.
				window.open('/v/' + trackInfo.vehicleId + '/view/' + managerId,'_blank');
			});

			var traversedPath = _(trackInfo.positions).map(function (position) {
				return new google.maps.LatLng(position.latitude, position.longitude);
			});

			var movementLine = new google.maps.Polyline({
				path: traversedPath,
				strokeColor: '#000000',
				strokeOpacity: 1.0,
				strokeWeight: 2
			});

			movementLine.setMap(map);
		});
	});

}(jQuery, google));