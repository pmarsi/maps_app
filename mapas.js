var map, lat, lng;
var puntoInicial;

$(function(){

function enlazarMarcador(e){

	map.drawRoute({
		origin: [lat, lng], //es el punto inicial
		//modificar el script para cuando se pulse el boton compactar mostrar unicamente puntos inicial y final
		//Asignar un evento DOM al boton de compactar ($("#compactar").on('click', function()))
		destination: [e.latLng.lat(), e.latLng.lng()],
		travelMode: 'driving',
		strokeColor: '#000000',
		strokeOpacity: 0.6,
		strokeWeight: 5
	});
	lat = e.latLng.lat();
	lng = e.latLng.lng();
	map.addMarker({lat:lat, lng:lng});
};
function geolocalizar()
{
	GMaps.geolocate({
		success: function(position)
		{
			lat = position.coords.latitude; //guarda las coordenadas en latitud y longitud
			lng = position.coords.longitude;
			puntoInicial = [lat, lng]; //se almacena el punto inicial en esta variable
			map = new GMaps({ //muestra el mapa centrado en las coordenadas latitud y longitud
				el: '#map',
				lat: lat,
				lng: lng,
				click: enlazarMarcador,
				tap: enlazarMarcador
			});
			map.addMarker({lat:lat, lng:lng});//muestra un marcador en esas coordenadas.
		},
		error: function(error)
		{
			alert("error: "+error.message); 
		},
		not_supported: function(){alert("No soporta geolocalización");},
	});
};
function compactar(){
	//función que renderiza el mapa de nuevo eliminando rutas intermedias.
	//posición inicial = puntoInicial(0), puntoInicial(1)
	//posición final = lat, lng
	map.cleanRoute();
	map.removeMarkers();
	//pintamos de nuevo el mapa con el valor de la nueva variable
	map.drawRoute({
		origin: [puntoInicial[0], puntoInicial[1]], //es el punto inicial
		//modificar el script para cuando se pulse el boton compactar mostrar unicamente puntos inicial y final
		//Asignar un evento DOM al boton de compactar ($("#compactar").on('click', function()))
		destination: [lat, lng],
		travelMode: 'driving',
		strokeColor: '#000000',
		strokeOpacity: 0.6,
		strokeWeight: 5
	});
	map.addMarker({lat:puntoInicial[0], lng:puntoInicial[1]});
	map.addMarker({lat:lat, lng:lng});
};
function direccion(){
	//map.cleanRoute();
	//map.removeMarkers();
	GMaps.geocode({
		address: $('#address').val(),
		callback: function(results, status){
			if(status=='OK'){
				var latlng = 
				results[0].geometry.location;
				map.setCenter(latlng.lat(),latlng.lng());
				map.addMarker({lat:latlng.lat(), lng:latlng.lng()});
				map.drawRoute({
				origin: [lat, lng], //es el punto inicial
				//modificar el script para cuando se pulse el boton compactar mostrar unicamente puntos inicial y final
				//Asignar un evento DOM al boton de compactar ($("#compactar").on('click', function()))
				destination: [latlng.lat(), latlng.lng()],
				travelMode: 'driving',
				strokeColor: '#000000',
				strokeOpacity: 0.6,
				strokeWeight: 5
			});
			}
		}
	});
};
function limpiar(){
	map.cleanRoute();
	map.removeMarkers();
	geolocalizar();				
	map.addMarker({lat:puntoInicial[0], lng:puntoInicial[1]});
};
geolocalizar();
$('#compact').on('click', compactar);
$('#compact').on('touch', compactar);
$('#btn_form').on('click', direccion);
$('#btn_form').on('touch', direccion);
$('#reset').on('click', limpiar);
$('#reset').on('touch', limpiar);

});