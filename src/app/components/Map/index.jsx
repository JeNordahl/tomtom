import React, { useState, useEffect } from 'react';
import ttServices from '@tomtom-international/web-sdk-services';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';


// Huvudfunktionen för vår kära karta.
const MapTest = ({ map }) => {
    const [markers, setMarkers] = useState([]);
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');
    const [searches, setSearches] = useState([]);

    useEffect(() => {
        const savedSearches = localStorage.getItem('rutt');
        if (savedSearches) {
            setSearches(JSON.parse(savedSearches));
        }
    }, []);

    // Lägger till markörer i form av flaggor på kartan.
    const addMarker = (lngLat) => {
        const newMarker = new tt.Marker().setLngLat(lngLat).addTo(map);
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    };

    // Tar fram resultatet från sökfälten och söker genom TomTom:s "fuzzysearch".
    const routeSearch = async (query) => {
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

    const saveSearch = (startLocation, endLocation) => {
        const routeLabel = `${startLocation}-${endLocation}`;
        const newSearch = { start: startLocation, end: endLocation, label: routeLabel };
        const exists = searches.some(search => search.label === routeLabel);

        if (!exists) {
            const updatedSearches = [...searches, newSearch];
            setSearches(updatedSearches);
            localStorage.setItem('rutt', JSON.stringify(updatedSearches));
        }
    }

    // TomTom:s route funktion som söker efter 2 angivna ställen och skapar en route till användaren.
    const createRoute = async (startLoc = startLocation, endLoc = endLocation) => {
        try {
            const startCoordinates = await routeSearch(startLoc);
            const endCoordinates = await routeSearch(endLoc);

            if (markers.length > 0) {
                alert("Vänligen ta bort din tidigare rutt innan du gör en ny sökning")
                return;
            }

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
                saveSearch(startLoc, endLoc);
            });
        } catch (error) {
            console.error("Error creating route:", error);
        }
    };

    // funktion som gör att man kan ta bort markörerna (tömmer listan).
    const clear = () => {
        markers.forEach(marker => marker.remove());
        setMarkers([]);
        removeRoute('route');
        setStartLocation('');
        setEndLocation('');
    };

    // funktion som gör att man kan ta bort rutten (tömmer listan).
    const removeRoute = (id) => {
        if (map.getLayer(id)) {
            map.removeLayer(id);
            map.removeSource(id);
        }
    };

    const handleSelectedRoute = (start, end) => {
        setStartLocation(start);
        setEndLocation(end);
        createRoute(start, end);
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
                <h3>Tidigare "ruttor":</h3>
                <ul>
                    {searches.map((search, index) => (
                        <li className="recentroute" key={index} onClick={() =>
                            handleSelectedRoute(search.start, search.end)
                        }>{search.label}</li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default MapTest;