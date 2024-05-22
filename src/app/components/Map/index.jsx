import React, { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import ttServices from '@tomtom-international/web-sdk-services';
import Button from '../Button';

const MapTest = () => {
    const mapElement = useRef();
    const map = useRef();

    const [markers, setMarkers] = useState([]);

    const addMarker = (event) => {
        if (markers.length < 2) {
            const newMarker = new tt.Marker().setLngLat(event.lngLat).addTo(map.current);
            setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
        }
    }

    const createRoute = () => {
        if (markers.length < 2) return;

        const locations = markers.map(marker => marker.getLngLat());

        const routeOptions = {
            key: 'AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU',
            locations,
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

        map.current.on('click', addMarker);

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
                <button
                    className="btn"
                    onClick={(e) => {
                        e.preventDefault();
                        clear();
                    }}
                >
                    Clear
                </button>
                <Button map={map.current} />
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