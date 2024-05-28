import React, { useState } from 'react';
import ttServices from '@tomtom-international/web-sdk-services';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';


// Huvudfunktionen för vår kära karta.
const MapTest = ({ map }) => {
    const [markers, setMarkers] = useState([]);
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');

    // Lägger till markörer i form av flaggor på kartan.
    const addMarker = (lngLat) => {
        const newMarker = new tt.Marker().setLngLat(lngLat).addTo(map);
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    };

    // Tar fram resultatet från sökfälten och söker genom TomTom:s "fuzzysearch".
    const routeSearch = (query) => {
        return ttServices.services.fuzzySearch({
            key: 'AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU',
            query: query,
        }).then(response => {
            const results = response.results;
            if (results.length > 0) {
                return results[0].position;
            } else {
                throw new Error(`No results found for query "${query}"`);
            }
        });
    };

    // TomTom:s route funktion som söker efter 2 angivna ställen och skapar en route till användaren.
    const createRoute = async () => {
        try {
            const startCoordinates = await routeSearch(startLocation);
            const endCoordinates = await routeSearch(endLocation);

            markers.forEach(marker => marker.remove());
            setMarkers([]);

            addMarker([startCoordinates.lng, startCoordinates.lat]);
            addMarker([endCoordinates.lng, endCoordinates.lat]);

            // Inställningar till routefunktionen via TomTom:s API.
            const routeOptions = {
                key: 'AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU',
                locations: [startCoordinates, endCoordinates],
                vehicleCommercial: true,
                vehicleHeading: 0,
            };

            // Skapar linjen samt dess utseende för rutten.
            ttServices.services.calculateRoute(routeOptions).then((response) => {
                const geojson = response.toGeoJson();
                map.addLayer({
                    id: "route",
                    type: "line",
                    source: {
                        type: "geojson",
                        data: geojson,
                    },
                    paint: {
                        "line-color": "#0f8ae2",
                        "line-width": 8,
                    },
                });

                // Zoomar in eller ut baserat på hur lång rout:en är för ett mer användarvänligt användande.
                const bounds = new tt.LngLatBounds();
                geojson.features[0].geometry.coordinates.forEach((point) => {
                    bounds.extend(tt.LngLat.convert(point));
                });
                map.fitBounds(bounds, {
                    duration: 300,
                    padding: 50,
                    maxZoom: 14,
                });

            });
        } catch (error) {
            console.error("Error creating route:", error);
        }
    };

    // Knapp som gör att man kan ta bort markörerna (tömmer listan).
    const clear = () => {
        markers.forEach(marker => marker.remove());
        setMarkers([]);
        removeRoute('route');
        setStartLocation('');  
        setEndLocation('');    
    };

    // Knapp som gör att man kan ta bort rutten (tömmer listan).
    const removeRoute = (id) => {
        if (map.getLayer(id)) {
            map.removeLayer(id);
            map.removeSource(id);
        }
    };

    // Returnerar alla värde i form av utskrift.
    return (
        <div>
            <div>
                <input
                    type="text"
                    placeholder="Start..."
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                />
                <input
                    type="text"
                    placeholder="Slut..."
                    value={endLocation}
                    onChange={(e) => setEndLocation(e.target.value)}
                />
                <button
                    className="btn"
                    onClick={(e) => {
                        e.preventDefault();
                        createRoute();
                    }}
                >
                    Skapa rutt
                </button>
                <button
                    className="btn"
                    onClick={(e) => {
                        e.preventDefault();
                        clear();
                    }}
                >
                    Rensa
                </button>
            </div>
        </div>
    );
};

export default MapTest;