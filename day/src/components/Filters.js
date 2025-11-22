import React, { useState, useEffect } from "react"; // NEW: Import useEffect

const Filters = ({ setFilters, initialFilters = {} }) => { // NEW: Accept initialFilters prop
    const [cuisine, setCuisine] = useState(initialFilters.cuisine || "");
    const [maxTime, setMaxTime] = useState(initialFilters.maxReadyTime || "");

    // NEW: useEffect to update filter states when initialFilters prop changes
    useEffect(() => {
        setCuisine(initialFilters.cuisine || "");
        // Max time might be 0, so explicitly check for null/undefined/empty string
        setMaxTime(initialFilters.maxReadyTime !== null && initialFilters.maxReadyTime !== undefined && initialFilters.maxReadyTime !== '' ? initialFilters.maxReadyTime : "");
    }, [initialFilters]);

    const applyFilters = () => {
        setFilters({
            cuisine: cuisine,
            maxReadyTime: maxTime ? Number(maxTime) : null // Ensure maxTime is a number or null
        });
    };

    return (
        <div>
            <div className="filters"> {/* Corrected class from 'class' to 'className' */}
                <select value={cuisine} onChange={(e) => setCuisine(e.target.value)}>
                    <option value="">Select Cuisine</option>
                    <option value="indian">Indian</option>
                    <option value="italian">Italian</option>
                    <option value="chinese">Chinese</option>
                    <option value="mexican">Mexican</option>
                    {/* Add more cuisine options if needed */}
                </select>

                
                <button onClick={applyFilters}>Apply Filters</button>
            </div>
        </div>
    );
};

export default Filters;    ,user input any value,but this always shows 45 minutes,change this and update what value user give for maximum time
