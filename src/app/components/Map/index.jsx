import React, { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import ttServices from '@tomtom-international/web-sdk-services';

const MapTest = () => {
    const mapElement = useRef();
    const map = useRef();

    const [markers, setMarkers] = useState([]);
    const [startLocation, setStartLocation] = useState('');
    const [endLocation, setEndLocation] = useState('');

    const addMarker = (lngLat) => {
        const newMarker = new tt.Marker().setLngLat(lngLat).addTo(map.current);
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
    };

    const geocodeLocation = (query) => {
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

    const createRoute = async () => {
        try {
            const startCoordinates = await geocodeLocation(startLocation);
            const endCoordinates = await geocodeLocation(endLocation);

            markers.forEach(marker => marker.remove());
            setMarkers([]);

            addMarker([startCoordinates.lng, startCoordinates.lat]);
            addMarker([endCoordinates.lng, endCoordinates.lat]);

            const routeOptions = {
                key: 'AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU',
                locations: [startCoordinates, endCoordinates],
                vehicleCommercial: true,
                vehicleHeading: 0,
            };

            ttServices.services.calculateRoute(routeOptions).then((response) => {
                const geojson = response.toGeoJson();
                map.current.addLayer({
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

                const bounds = new tt.LngLatBounds();
                geojson.features[0].geometry.coordinates.forEach((point) => {
                    bounds.extend(tt.LngLat.convert(point));
                });
                map.current.fitBounds(bounds, {
                    duration: 300,
                    padding: 50,
                    maxZoom: 14,
                });
            });
        } catch (error) {
            console.error("Error creating route:", error);
        }
    };

    const clear = () => {
        markers.forEach(marker => marker.remove());
        setMarkers([]);
        removeRoute('route');
    };

    const removeRoute = (id) => {
        if (map.current.getLayer(id)) {
            map.current.removeLayer(id);
            map.current.removeSource(id);
        }
    };

    useEffect(() => {
        map.current = tt.map({
            key: "AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU",
            container: mapElement.current,
            center: [4.91191, 59.36619],
            zoom: 2,
        });

        map.current.addControl(new tt.FullscreenControl());
        map.current.addControl(new tt.NavigationControl());

        return () => {
            map.current.remove();
        };

    }, []);

    return (
        <div>
            <div className="container">
                <div ref={mapElement} style={{ height: '500px', width: '100%' }} />
                <div>
                    <input
                        type="text"
                        placeholder="Start Location"
                        value={startLocation}
                        onChange={(e) => setStartLocation(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="End Location"
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
                        Create Route
                    </button>
                    <button
                        className="btn"
                        onClick={(e) => {
                            e.preventDefault();
                            clear();
                        }}
                    >
                        Clear
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MapTest;
