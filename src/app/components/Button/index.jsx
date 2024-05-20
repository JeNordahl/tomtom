import React, { useState } from "react";

const SearchButton = () => {
    const [input, setInput] = useState("")

    // kanske?

    const fetchData = (value) => {
        
    }

    return (
        <div className="searchbutton">
            <input type="text" placeholder="sök" value={input} onChange={(e) => setInput(e.target.value)}/>
        </div>
    )
}

export default SearchButton