import React from "react";
import tt from '@tomtom-international/web-sdk-services';

const Button = ({ map }) => {
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
        console.log(result);
        if (result.results && result.results.length > 0) {
            moveMap(result.results[0].position);
        } else {
            console.log("No results found");
        }
    };

    const search = () => {
        const query = document.getElementById("searchfunction").value;
        if (query) {
            tt.services.fuzzySearch({
                key: 'AYZjZsp49t0NLJRpgZM77rW2VqGbKyfU',
                query: query,
            }).then(handleResults).catch(err => console.error("Error with fuzzySearch:", err));
        } else {
            console.error("Search query is empty");
        }
    };

    return (
        <div>
            <input placeholder="Search City..." id="searchfunction"></input>
            <button onClick={search} className="btn btn-primary m-2">Search City</button>
        </div>
    );
};

export default Button;