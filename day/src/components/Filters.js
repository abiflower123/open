import React, { useState } from "react"; // Removed useEffect from import

const Filters = ({ setFilters, initialFilters = {} }) => {
    const [cuisine, setCuisine] = useState(initialFilters.cuisine || "");

    // Initialization fixed to correctly handle '0' (zero) as a valid initial value.
    // This ensures that the state only uses the prop if it's defined, otherwise it defaults to "".
    const [maxTime, setMaxTime] = useState(
        initialFilters.maxReadyTime !== null && initialFilters.maxReadyTime !== undefined
            ? initialFilters.maxReadyTime : ""
    );

    // *** The useEffect block that was resetting user input has been removed. ***

    const applyFilters = () => {
        setFilters({
            cuisine: cuisine,
            // Ensure maxTime is converted to a number or null if the input is empty
            maxReadyTime: maxTime ? Number(maxTime) : null 
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

                <input
                    type="number"
                    placeholder="Max Cooking Time(min)"
                    value={maxTime} // The value is now controlled solely by local state
                    onChange={(e) => setMaxTime(e.target.value)} // User input updates local state directly and is preserved
                />

                <button onClick={applyFilters}>Apply Filters</button>
            </div>
        </div>
    );
};

export default Filters;
