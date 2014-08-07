/*global google, jQuery, VT, _, MarkerWithLabel*/
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

		var marker = new MarkerWithLabel({
			position: lastPosition,
			map: map,
			icon: {
				url: '/images/marker2.png',
				anchor: new google.maps.Point(25, 9)
			}
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
				data: {longitude: event.latLng.B,
					latitude: event.latLng.k}
			}).done(function () {
				var path = movementLine.getPath();
				path.push(event.latLng);
				marker.setPosition(event.latLng);
			});
		});
	});

}(jQuery, google));