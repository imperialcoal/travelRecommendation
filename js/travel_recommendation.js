// Fetch JSON data
let travelData = null;

// Load data on page load
async function loadTravelData() {
    try {
        const response = await fetch("travel_recommendation_api.json");
        travelData = await response.json();
        console.log("Travel Data Loaded:", travelData);
    } catch (error) {
        console.error("Error fetching travel data:", error);
    }
}

// --- Utility: Levenshtein distance ---
function levenshtein(a, b) {
    const matrix = Array.from({ length: a.length + 1 }, (_, i) =>
        Array(b.length + 1).fill(0)
    );

    for (let i = 0; i <= a.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= b.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
            matrix[i - 1][j] + 1,     // deletion
            matrix[i][j - 1] + 1,     // insertion
            matrix[i - 1][j - 1] + cost // substitution
        );
        }
    }
    return matrix[a.length][b.length];
}

// --- Find closest match ---
function findClosestMatch(input, options) {
    let bestMatch = null;
    let minDistance = Infinity;

    options.forEach(option => {
        const distance = levenshtein(input, option.toLowerCase());
        if (distance < minDistance) {
        minDistance = distance;
        bestMatch = option;
        }
    });

    // Only accept match if "close enough"
    return minDistance <= 2 ? bestMatch : null;
}

// Search functionality
function handleSearch(event) {
    event.preventDefault();

    const searchInput = document.querySelector('input[name="q"]');
    const resultsContainer = document.getElementById("results");
    let keyword = searchInput.value.trim().toLowerCase();

    resultsContainer.innerHTML = "";

    if (!keyword) {
        resultsContainer.innerHTML = "<p>Please enter a keyword.</p>";
        return;
    }

    // Normalize keywords
    if (keyword.includes("beach")) {
        displayResults(travelData.beaches, resultsContainer);
    } else if (keyword.includes("temple")) {
        displayResults(travelData.temples, resultsContainer);
    } else {
        // Fuzzy match against country names
        const countryNames = travelData.countries.map(c => c.name.toLowerCase());
        const closest = findClosestMatch(keyword, countryNames);

        if (closest) {
        const country = travelData.countries.find(
            c => c.name.toLowerCase() === closest
        );
        displayResults(country.cities, resultsContainer);
        } else {
        resultsContainer.innerHTML = "<p>No results found. Try 'beach', 'temple', or a country name.</p>";
        }
    }
}

// Display results
function displayResults(items, container) {
    items.forEach(item => {
        const card = document.createElement("div");
        card.classList.add("result-card");

        card.innerHTML = `
        <img src="images/${item.imageUrl}" alt="${item.name}">
        <h3>${item.name}</h3>
        <p>${item.description}</p>
        <p><strong>Local Time:</strong> ${getLocalTime(item.name)}</p>
        <a href="#" class="btn-visit">Visit</a>
        `;

        container.appendChild(card);
    });
}

// Get local time by location
function getLocalTime(locationName) {
    let timeZone = "UTC";

    if (locationName.toLowerCase().includes("sydney")) timeZone = "Australia/Sydney";
    if (locationName.toLowerCase().includes("melbourne")) timeZone = "Australia/Melbourne";
    if (locationName.toLowerCase().includes("tokyo")) timeZone = "Asia/Tokyo";
    if (locationName.toLowerCase().includes("kyoto")) timeZone = "Asia/Tokyo";
    if (locationName.toLowerCase().includes("rio")) timeZone = "America/Sao_Paulo";
    if (locationName.toLowerCase().includes("são paulo") || locationName.toLowerCase().includes("sao paulo")) timeZone = "America/Sao_Paulo";

    const options = { timeZone, hour12: true, hour: "numeric", minute: "numeric" };
    return new Date().toLocaleTimeString("en-US", options);
}

// Clear results
function handleClear() {
    document.querySelector('input[name="q"]').value = "";
    document.getElementById("results").innerHTML = "";
}

// Attach listeners
document.addEventListener("DOMContentLoaded", () => {
    loadTravelData();

    const searchForm = document.querySelector(".search-form");
    const clearButton = document.querySelector(".btn-clear");

    if (searchForm) {
        searchForm.addEventListener("submit", handleSearch);
    }
    if (clearButton) {
        clearButton.addEventListener("click", (e) => {
        e.preventDefault();
        handleClear();
        });
    }
});
