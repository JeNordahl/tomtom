"use client";

import React, { useState, useEffect } from "react";
import tt from '@tomtom-international/web-sdk-maps';
import MapTest from "./components/Map";
import "./globals.css";
import Button from "./components/Buttons";

const HomePage = () => {
    const [map, setMap] = useState(null);

    useEffect(() => {
        const apiKey = 'AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU'; // API-nyckel
        const latitude = 40.730610; // Malmö's latitude
        const longitude = -73.935242; // Malmö's longitude

        const mapInstance = tt.map({
            key: apiKey,
            container: 'map',
            center: [longitude, latitude],
            zoom: 10
        });

        setMap(mapInstance);

        return () => mapInstance.remove();
    }, []);

    return (
        <div>
            <h1>Traffic Locator</h1>
            <input placeholder="Sök stad..." id="searchfunction"></input>
            <Button map={map} />
            <MapTest map={map} />
        </div>
            //<SearchButton />
    );
};
//<MyForm />


export default HomePage;