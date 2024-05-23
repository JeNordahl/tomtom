import React, { useEffect, useState } from 'react';
import tt from '@tomtom-international/web-sdk-maps';
import '@tomtom-international/web-sdk-maps/dist/maps.css';
import ttServices from '@tomtom-international/web-sdk-services';


const MapTest = () => {
    const [themap, setMap] = useState(null);
    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);

    useEffect(() => {
        const map = tt.map({
            key: "AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU",
            container: 'map',
            zoom: 2,
        });

        map.addControl(new tt.FullscreenControl());
        map.addControl(new tt.NavigationControl());

        setMap(themap);

        return () => map.remove();

    }, []);

    useEffect(() => {
        if (query.length > 2) {
            const searchService = ttServices.services.fuzzySearch({
                key: "AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU",
                query: query,
                limit: 5,
            });

            searchService.then(response => {
                setResults(response.results);
                console.log(results)
            });
        } else {
            setResults([]);
        }
    }, [query]);

    return (
        <div>
            
            <div id="map" style={{ height: '500px', width: '100%' }}></div>
        </div>
    );


};
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


export default MapTest;
