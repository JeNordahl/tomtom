/* var apiKey = 'AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU'; // Byt ut 'DIN_API_NYCKEL' mot din faktiska API-nyckel från TomTom
var latitude = 55.60498; // Malmö's latitude
var longitude = 13.00382; // Malmö's longitude
var apiUrl = 'https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=' + apiKey + '&point=' + latitude + ',' + longitude;

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    console.log(data); // Kontrollera trafikdata i konsolen först
    var coordinates = data.flowSegmentData.coordinates.coordinate;
    for (var i = 0; i < coordinates.length; i += 5) {
      var coord = coordinates[i];
      new tt.Marker().setLngLat([coord.longitude, coord.latitude]).addTo(map);
    }
  })
  .catch(error => {
    console.error('Error:', error);
  }); */