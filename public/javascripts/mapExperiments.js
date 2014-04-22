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
			title: 'Click to zoom',
			icon: {
				path: google.maps.SymbolPath.CIRCLE,
				scale: 10,
				strokeWeight: 2
			}
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


		var poly = new google.maps.Polyline({
			strokeColor: '#000000',
			strokeOpacity: 1.0,
			strokeWeight: 3,
			editable: true
		});

		poly.setMap(map);

		function addLngLatToPolyline(event) {
			var path = poly.getPath();

			path.push(event.latLng);
		}

		google.maps.event.addListener(map, 'click', addLngLatToPolyline);

		var drawingManager = new google.maps.drawing.DrawingManager();
		drawingManager.setMap(map);
	}

	$(initGoogleMaps);
}(jQuery, google));