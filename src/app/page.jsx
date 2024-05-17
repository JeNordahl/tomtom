"use client";

import React from "react";
import MapTest from "./components/Map";
import "./globals.css";
import Button from "./components/Buttons";

const HomePage = () => {
    return (
            <div>
                <h1>Traffic Locator</h1>
                <input placeholder="Sök stad..." id="searchfunction"></input>
                <Button />
                <MapTest />
            </div>
        
    );
};

export default HomePage;
