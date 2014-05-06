/*global google, jQuery, VT, _*/
(function ($, google) {
	'use strict';

	var managerId = $('#manager-id').val();

	if (!managerId) {
		VT.logger.error('ManagerId id not found in the markup');
		return;
	}

	$.ajax({
		url: '/m/' + managerId + '/trackData'
	}).done(function (vehicleTrackInfos) {
		VT.logger.debug('AJAX get to /trackData has been tracked.');
		VT.logger.debug(vehicleTrackInfos);

		//TODO: Write to WebStorm about Win+Right with debugger window as in Chrome.
		var lastVehicleTrackInfo = _(vehicleTrackInfos).last();
		var lastVehicleLastPositionInfo = _(lastVehicleTrackInfo).last().positionInfo;
		var lastVehicleLastPosition = new google.maps.LatLng(lastVehicleLastPositionInfo.Latitude, lastVehicleLastPositionInfo.Longitude);

		var mapOptions = {
			center: lastVehicleLastPosition,
			zoom: 13,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		var map = new google.maps.Map($('.vt-google-map')[0], mapOptions);

		vehicleTrackInfos.forEach(function(vehicleTrackInfos) {
			var lastPositionInfo = _(vehicleTrackInfos).last().positionInfo;
			var lastPosition = new google.maps.LatLng(lastPositionInfo.Latitude, lastPositionInfo.Longitude);

			//TODO: Add marker title with driver info and vehicle info.
			var marker = new google.maps.Marker({
				position: lastPosition
			});

			marker.setMap(map);

			var traversedPath = _(vehicleTrackInfos).map(function (position) {
				return new google.maps.LatLng(position.positionInfo.Latitude, position.positionInfo.Longitude);
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