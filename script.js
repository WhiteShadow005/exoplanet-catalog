let QUERY = "select top 50 pl_name,hostname,disc_year from ps where default_flag=1";

let BASE_URL =
  "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query="
  + encodeURIComponent(QUERY)
  + "&format=json";

let PROXIES = [
  "https://corsproxy.io/?" + encodeURIComponent(BASE_URL),
  "https://api.allorigins.win/raw?url=" + encodeURIComponent(BASE_URL),
  "https://thingproxy.freeboard.io/fetch/" + BASE_URL
];

let container = document.getElementById("catalog-grid");
let searchInput = document.getElementById("search-input");
let resetBtn = document.getElementById("reset-btn");
let loaderEl = document.getElementById("loader");

let allData = [];


async function fetchData() {
  for (let i = 0; i < PROXIES.length; i++) {
    try {
      let res = await fetch(PROXIES[i]);
      if (!res.ok) {
        throw new Error("HTTP " + res.status);
      }
      let data = await res.json();
      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Invalid API Data Format");
      }
      if (loaderEl) loaderEl.style.display = "none";
      allData = data;
      displayData(data);
      return;
    } catch (err) {
      console.log("Proxy " + (i + 1) + " failed:", err);
    }
  }
  
  if (loaderEl) loaderEl.style.display = "none";
  container.innerHTML = "<p>Failed to load data. Please check your network or API parameters.</p>";
}


function displayData(data) {
  container.innerHTML = "";

  if (data.length === 0) {
    container.innerHTML = "<p>No data found</p>";
    return;
  }
  
  for (let i = 0; i < data.length; i++) {
    let p = data[i];

    let card = document.createElement("div");
    card.className = "card";

    let name = p.pl_name || "Unknown";
    let host = p.hostname || "Unknown";
    let year = p.disc_year || "-";

    card.innerHTML =
      "<h3>" + name + "</h3>" +
      "<p>Host: " + host + "</p>" +
      "<p>Year: " + year + "</p>";

    container.appendChild(card);
  }
}


searchInput.addEventListener("input", function() {
  let value = searchInput.value.toLowerCase();

  let filtered = allData.filter(function(p) {
    return (p.pl_name || "").toLowerCase().includes(value);
  });

  displayData(filtered);
});


resetBtn.addEventListener("click", function() {
  searchInput.value = "";
  displayData(allData);
});


fetchData();