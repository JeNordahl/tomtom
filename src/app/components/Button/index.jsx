import React, { useEffect, useState } from "react";
import ttServices from '@tomtom-international/web-sdk-services';

const Button = ({ map }) => {
    const [searches, setSearches] = useState([]);

    useEffect(() => {
        const savedSearches = localStorage.getItem('stad');
        if (savedSearches) {
            setSearches(JSON.parse(savedSearches));
        }
    }, []);

    const moveMap = (lnglat) => {
        if (map) {
            map.flyTo({
                center: lnglat,
                zoom: 14,
            });
        } else {
            console.error("Map instance is not available");
        }
    };

    const handleResults = (result) => {
        if (result.results && result.results.length > 0) {
            moveMap(result.results[0].position);
        } else {
            console.log("No results found");
        }
    };

    const search = (query) => {
        if (!query) {
            query = document.getElementById("searchfunction").value;
        }
        if (query) {
            ttServices.services.fuzzySearch({
                key: 'AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU',
                query: query,
            }).then(result => {
                handleResults(result);
                saveSearch(query);
            }).catch(err => console.error("Error with fuzzySearch:", err));
        } else {
            console.error("Search query is empty");
        }
    };

    const saveSearch = (query) => {
        let updatedSearches = [...searches];
        if (!updatedSearches.includes(query)) {
            updatedSearches.push(query);
            setSearches(updatedSearches);
            localStorage.setItem('stad', JSON.stringify(updatedSearches));
        }
    };

    const handleSelectSearch = (query) => {
        document.getElementById("searchfunction").value = query;
        search(query);
    };

    return (
        <div>
            <button onClick={() => search()} className="btn btn-primary m-2">Search City</button>
            <div>
                <h3>Recent Searches:</h3>
                <ul>
                    {searches.map((search, index) => (
                        <li key={index} onClick={() => handleSelectSearch(search)} style={{ cursor: 'pointer', color: 'blue' }}>
                            {search}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Button;