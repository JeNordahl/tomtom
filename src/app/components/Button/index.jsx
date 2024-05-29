import React, { useEffect, useState } from "react";
import ttServices from '@tomtom-international/web-sdk-services';


// Huvudfunktionen för våra knappar i appen
const Button = ({ map }) => {
    const [searches, setSearches] = useState([]);

    // Skapar en variabel (key) för localstorage under namnet "stad".
    useEffect(() => {
        const savedSearches = localStorage.getItem('stad');
        if (savedSearches) {
            setSearches(JSON.parse(savedSearches));
        }
    }, []);

    // TomTom funktion som gör att man på ett snyggt sätt flyger till den stad man sökt på.
    const moveMap = (lnglat) => {
        if (map) {
            map.flyTo({
                center: lnglat,
                zoom: 14,
            });
        } else {
            alert("Kartan kunde inte hittas.")
            return;
            //console.error("Map instance is not available");
        }
    };

    // Hanterar resultatet från sökningen och "flyger" sedan till staden genom funktionen moveMap.
    const handleResults = (result) => {
        if (result.results && result.results.length > 0) {
            moveMap(result.results[0].position);
        } else {
            alert("Inga resultat hittades.")
            return;
            //console.log("No results found");
        }
    };

    // Sökfunktion som kollar ifall något är inskrivet i fältet, om inte får man upp felmeddelande. 
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
            alert("Sökfältet är tomt.")
            return;
            //console.error("Search query is empty");
        }
    };

    // Sparar sökningen och slänger in den i en lista genom local storage.
    const saveSearch = (query) => {
        let updatedSearches = [...searches];
        if (!updatedSearches.includes(query)) {
            updatedSearches.push(query);
            setSearches(updatedSearches);
            localStorage.setItem('stad', JSON.stringify(updatedSearches));
        }
    };

    // Om man trycker på en tidigare sökning så körs search funktionen med tidigare stad.
    const handleSelectSearch = (query) => {
        document.getElementById("searchfunction").value = query;
        search(query);
    };

    return (
        <div>
            <button onClick={() => search()} className="btn btn-primary m-2">Sök plats</button>
            <div>
                <h3>Tidigare sökningar:</h3>
                <ul>
                    {searches.map((search, index) => (
                        <li className="recentsearch" key={index} onClick={() => handleSelectSearch(search)}>
                            {search}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default Button;