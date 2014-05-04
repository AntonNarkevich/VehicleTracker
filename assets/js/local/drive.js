/*global google, jQuery, VT, _*/
(function ($, google) {
	'use strict';

	var vehicleId = $('#vehicle-id').val();

	if (!vehicleId) {
		VT.logger.error('Vehicle id not found in the markup');
		return;
	}

	$.ajax({
		url: '/d/' + vehicleId + '/positions'
	}).done(function (data) {
		VT.logger.debug('AJAX get to /positions has been completed.');
		VT.logger.debug(data);

		var lastPositionInfo = _(data).last();
		var lastPosition = new google.maps.LatLng(lastPositionInfo.Latitude, lastPositionInfo.Longitude);

		var mapOptions = {
			center: lastPosition,
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		var map = new google.maps.Map($('.vt-google-map')[0], mapOptions);

		var marker = new google.maps.Marker({
			position: lastPosition,
			map: map,
			title: 'You are here.'
		});

		var traversedPath = _(data).map(function (position) {
			return new google.maps.LatLng(position.Latitude, position.Longitude);
		});

		var movementLine = new google.maps.Polyline({
			path: traversedPath,
			strokeColor: '#000000',
			strokeOpacity: 1.0,
			strokeWeight: 2
		});

		movementLine.setMap(map);

		google.maps.event.addListener(map, 'click', function (event) {
			$.ajax({
				type: 'POST',
				url: '/d/' + vehicleId + '/positions',
				data: {longitude: event.latLng.A,
					latitude: event.latLng.k}
			}).done(function () {
				var path = movementLine.getPath();
				path.push(event.latLng);
				marker.setPosition(event.latLng);
			});
		});
	});

}(jQuery, google));