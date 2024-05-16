import React, { useEffect } from "react";
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';

const MapTest = () => {
    useEffect(() => {
        const center = [4, 44.4];
        const map = tt.map({
            key: "AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU",
            container: 'map',
            center: center,
            zoom: 10
        });

        map.on('load', () => {
            new tt.Marker().setLngLat(center).addTo(map);
        });

        return () => map.remove();
    }, []);

    return (
        <div id="map" style={{ height: "500px", width: "100%" }}></div>
    );
};

export default MapTest;
