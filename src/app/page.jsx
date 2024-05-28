"use client";

import React, { useRef, useEffect, useState } from "react";
import MapTest from "./components/Map";
import tt from '@tomtom-international/web-sdk-maps';
import "./globals.css";
import Button from "./components/Button";

const HomePage = () => {
    const mapElement = useRef(null);
    const map = useRef(null);
    const [mapReady, setMapReady] = useState(false);

    useEffect(() => {

        map.current = tt.map({
            key: "AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU",
            container: mapElement.current,
            center: [40.730610, -73.935242],
            zoom: 2,
        });

        map.current.addControl(new tt.NavigationControl());

        map.current.on('load', () => {
            setMapReady(true);
        });

        return () => {
            if (map.current) {
                map.current.remove();
            }
        };

    }, []);

    return (
        <div>
            <div ref={mapElement} id="map"></div>
            <div className="container">
                <h1>Traffic Locator</h1>
                <input placeholder="Sök stad..." id="searchfunction" />
                <Button map={map.current} />
                {mapReady && <MapTest map={map.current} />}
            </div>
        </div>
    );
};

export default HomePage;