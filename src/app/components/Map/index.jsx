import React, { useEffect } from "react";
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const MapTest = () => {
    useEffect(() => {
        const apiKey = 'AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU'; // API-nyckel
        const latitude = 55.60498; // Malmö's latitude
        const longitude = 13.00382; // Malmö's longitude
        const apiUrl = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${apiKey}&point=${latitude},${longitude}`;

        

        const fetchTrafficData = async () => {
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                console.log(data); // Kontrollera trafikdata i konsolen först
                const coordinates = data.flowSegmentData.coordinates.coordinate;
                const map = tt.map({
                    key: apiKey,
                    container: 'map',
                    center: [longitude, latitude],
                    zoom: 10
                });

                map.on('load', () => {
                    for (let i = 0; i < coordinates.length; i += 2) {
                        const coord = coordinates[i];
                        new tt.Marker().setLngLat([coord.longitude, coord.latitude]).addTo(map);
                    }
                });

                return () => map.remove();
            } catch (error) {
                console.error('Error:', error);
            }
        };

        fetchTrafficData();
    }, []);

    return (
         <div id="map"></div>
        
    
    );
};

export default MapTest;