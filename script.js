const API_KEY = "NXInS3eaDKeslw7zlCATubSzVuWNX5tfED9DegVU";
const API_URL = `https://api.nasa.gov/planetary/apod?api_key=${API_KEY}&count=100`;

async function fetchRawNasaData() {
    const loaderText = document.querySelector("#loader p");
    const rawDataContainer = document.getElementById("raw-data");

    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (loaderText) {
            loaderText.textContent = "Data fetched successfully from NASA API:";
            loaderText.style.color = "green";
            loaderText.style.fontWeight = "bold";
        }

        if (rawDataContainer) {
            rawDataContainer.textContent = JSON.stringify(data, null, 4);
        }

    } catch (error) {
        console.error("Failed to fetch API data:", error);
        if (loaderText) {
            loaderText.textContent = "Failed to load data. Please check your API Key and Network.";
            loaderText.style.color = "red";
        }
    }
}

document.addEventListener("DOMContentLoaded", fetchRawNasaData);
