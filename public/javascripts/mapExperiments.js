/*global google, jQuery*/
(function ($, google) {
	'use strict';

	function initGoogleMaps() {
		var mapOptions = {
			center: new google.maps.LatLng(-34.397, 150.644),
			zoom: 8,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		var map = new google.maps.Map($('.google-map')[0], mapOptions);

		var marker = new google.maps.Marker({
			position: map.getCenter(),
			map: map,
			title: 'Click to zoom'
		});

		google.maps.event.addListener(map, 'click', function (event) {
			console.log('Sending to the server' + event.latLng);

			var mapPointData = {
				lat: event.latLng.k,
				lng: event.latLng.A
			};

			console.log(JSON.stringify(event));
			console.log(mapPointData);

			$.post('/positions', mapPointData, function (data) {
					console.log('POST has been completed');
					console.log(data);
				}
			);
		});
	}

	$(initGoogleMaps);
}(jQuery, google));