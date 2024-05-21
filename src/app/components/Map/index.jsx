import React, { useEffect } from "react";
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const MapTest = ({ map }) => {
    useEffect(() => {
        if (!map) return; // Ensure map instance is available

        const apiKey = 'AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU'; // API-nyckel
        const latitude = 40.730610; // Malmö's latitude
        const longitude = -73.935242; // Malmö's longitude
        const apiUrl = `https://api.tomtom.com/traffic/services/4/flowSegmentData/absolute/10/json?key=${apiKey}&point=${latitude},${longitude}`;

        const fetchTrafficData = async () => {
            try {
                const response = await fetch(apiUrl);
                const data = await response.json();
                console.log(data); // Kontrollera trafikdata i konsolen först

                if (data.flowSegmentData && data.flowSegmentData.coordinates) {
                    const coordinates = data.flowSegmentData.coordinates.coordinate;
                    const geojson = {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                geometry: {
                                    type: 'LineString',
                                    coordinates: coordinates.map(coord => [coord.longitude, coord.latitude])
                                }
                            }
                        ]
                    };

                    map.on('load', () => {
                        if (map.getSource('traffic')) {
                            map.removeLayer('traffic');
                            map.removeSource('traffic');
                        }

                        map.addSource('traffic', {
                            type: 'geojson',
                            data: geojson
                        });

                        map.addLayer({
                            id: 'traffic',
                            type: 'line',
                            source: 'traffic',
                            layout: {
                                'line-join': 'round',
                                'line-cap': 'round'
                            },
                            paint: {
                                'line-color': '#FF0000',
                                'line-width': 4
                            }
                        });
                    });
                }
            } catch (error) {
                console.error('Error fetching traffic data:', error);
            }
        };

        fetchTrafficData();
    }, [map]);

    return (
        <div id="map" style={{ height: '500px' }}></div>
    );
};

export default MapTest;