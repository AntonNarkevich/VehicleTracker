/*global google, jQuery, VT*/
(function ($, google) {
	'use strict';

	function initGoogleMaps() {
		var mapOptions = {
			center: new google.maps.LatLng(-34.397, 150.644),
			zoom: 8,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};

		var map = new google.maps.Map($('.vt-google-map')[0], mapOptions);

		var markerPosition = map.getCenter();

		var marker = new google.maps.Marker({
			position: markerPosition,
			map: map,
			title: 'Vehicle position',
			icon: {
				url: '/images/marker2.png',
				anchor: new google.maps.Point(25, 9)
			}
		});

		var longitude = $('#vehicle-longitude');
		var latitude = $('#vehicle-latitude');

		longitude.val(markerPosition.B);
		latitude.val(markerPosition.k);

		google.maps.event.addListener(map, 'click', function (event) {
			VT.logger.debug('Setting hidden input value:');
			VT.logger.debug(event.latLng);

			marker.setPosition(event.latLng);

			longitude.val(event.latLng.B);
			latitude.val(event.latLng.k);
		});
	}

	$(initGoogleMaps);
}(jQuery, google));