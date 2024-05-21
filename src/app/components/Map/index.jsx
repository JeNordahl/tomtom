import React, { useEffect, useRef } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import ttServices from '@tomtom-international/web-sdk-services';

const MapTest = () => {
    const mapElement = useRef();
    const map = useRef();

    function createRoute() {
        const routeOptions = {
            key: 'AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU',
            locations: [
                [4.91191, 52.36619],
                [4.87631, 52.36366],
            ],
            vehicleCommercial: true,
            vehicleHeading: 0,
        };

        ttServices.services.calculateRoute(routeOptions).then((response) => {
            routeOptions.locations.forEach((location) => 
                new tt.Marker().setLngLat(location).addTo(map.current)
            );

            const geojson = response.toGeoJson();
            map.current.addLayer({
                id: "route" + Math.random().toString(36).substr(2, 9),
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
                bounds.extend(tt.LngLat.convert(point)); // creates a bounding area
            });
            map.current.fitBounds(bounds, {
                duration: 300,
                padding: 50,
                maxZoom: 14,
            }); // zooms the map to the searched route
        });
    }

    useEffect(() => {
        map.current = tt.map({
            key: "AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU",
            container: mapElement.current,
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
                <button
                    className="btn"
                    onClick={(e) => {
                        e.preventDefault();
                        createRoute();
                    }}
                >
                    Calculate Route
                </button>
            </div>
        </div>
    );
};

export default MapTest;


/*

<input
                type="text"
                placeholder="Search..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
            />
            <ul>
                {results.map((result, index) => (
                    <li key={index}>
                        {result.address.freeformAddress}
                    </li>
                ))}
            </ul>*/

            /*useEffect(() => {
        if (query.length > 2) {
            ttServices.services.fuzzySearch({
                key: "AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU",
                query: query,
                limit: 5,
            }).go().then(response => {
                setResults(response.results);
                console.log(response.results);
            }).catch(error => {
                console.error('Error fetching search results:', error);
                setResults([]);
            });
        } else {
            setResults([]);
        }
    }, [query]);*/