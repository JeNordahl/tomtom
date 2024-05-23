/*import React from 'react';
import ttServices from '@tomtom-international/web-sdk-services';

const MyForm = () => {

    const createRoute = () => {
        const routeOptions = {
            key: "AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU",
            locations: [[4.91191, 52.36619], [5.0, 52.5]], // Assuming two locations for routing
            vehicleCommercial: true,
            vehicleHeading: 0,
        };

        ttServices.services.calculateRoute(routeOptions).then((response) => {
            routeOptions.locations.map((location) =>
                new tt.Marker().setLngLat(location).addTo(map)
            );

            const geojson = response.toGeoJson();
            map.addLayer({
                id: "route" + Math.random().toString(36).substring(7),
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
            geojson.features[0].geometry.coordinates.forEach(point => {
                bounds.extend(tt.LngLat.convert(point));
            });
            map.fitBounds(bounds, {
                duration: 300,
                padding: 50,
                maxZoom: 14,
            });
        }).catch(error => {
            console.error('Error calculating route:', error);
        });
    };

    return (
        <div>
            <button className="btn" onClick={createRoute}>
                Calculate Route
            </button>
        </div>
    );
};

export default MyForm;
*/