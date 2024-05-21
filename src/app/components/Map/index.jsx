import React, { useEffect, useRef, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import ttServices from '@tomtom-international/web-sdk-services';

const MapTest = () => {
    const map = useRef();
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        map.current = tt.map({
            key: "AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU",
            container: 'map',
            zoom: 2,
        });

        map.current.addControl(new tt.FullscreenControl());
        map.current.addControl(new tt.NavigationControl());

        return () => {
            map.current.remove();
        };

    }, []);

    useEffect(() => {
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
    }, [query]);

    return (
        <div>
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
            </ul>
            <div id="map" style={{ height: '500px', width: '100%' }}></div>
        </div>
    );
};

export default MapTest;
