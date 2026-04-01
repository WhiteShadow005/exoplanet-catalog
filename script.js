let API_KEY = "6mLhKBOFyoMeS64Gw7ztYdWRjKvySda2pgAD1BUB";
let QUERY = "select top 100 pl_name,hostname,discoverymethod,disc_year,pl_rade,pl_bmasse,pl_orbper,sy_dist from ps";
let BASE_URL = "https://exoplanetarchive.ipac.caltech.edu/TAP/sync?query=" + encodeURIComponent(QUERY) + "&format=json&api_key=" + API_KEY;

let PROXIES = [
  "https://corsproxy.io/?" + encodeURIComponent(BASE_URL),
  "https://api.allorigins.win/raw?url=" + encodeURIComponent(BASE_URL),
  "https://thingproxy.freeboard.io/fetch/" + BASE_URL,
];

let allPlanets = [];
let filtered = [];

let loaderEl     = document.getElementById("loader");
let loaderText   = document.getElementById("loader-text");
let errorEl      = document.getElementById("error-state");
let errorMsg     = document.getElementById("error-msg");
let gridEl       = document.getElementById("catalog-grid");
let emptyEl      = document.getElementById("empty-state");
let controlsEl   = document.getElementById("controls");
let searchInput  = document.getElementById("search-input");
let methodFilter = document.getElementById("method-filter");
let yearFilter   = document.getElementById("year-filter");
let sortSelect   = document.getElementById("sort-select");
let resetBtn     = document.getElementById("reset-btn");
let resultsCount = document.getElementById("results-count");

function buildStarField() {
  let container = document.getElementById("stars");
  for (let i = 0; i < 140; i++) {
    let star = document.createElement("div");
    star.className = "star";
    let size = Math.random() * 2 + 0.5;
    star.style.cssText =
      "width:" + size + "px; height:" + size + "px;" +
      "top:" + Math.random() * 100 + "%;" +
      "left:" + Math.random() * 100 + "%;" +
      "--dur:" + (Math.random() * 3 + 2).toFixed(1) + "s;" +
      "animation-delay:" + (Math.random() * 4).toFixed(1) + "s;";
    container.appendChild(star);
  }
}

async function fetchPlanets() {
  loaderText.textContent = "Establishing connection to the stars...";

  for (let i = 0; i < PROXIES.length; i++) {
    try {
      loaderText.textContent = "Trying connection " + (i + 1) + " of " + PROXIES.length + "...";
      let response = await fetch(PROXIES[i]);
      if (!response.ok) throw new Error("HTTP " + response.status);
      let data = await response.json();
      if (!Array.isArray(data) || data.length === 0) throw new Error("Empty or invalid data.");
      allPlanets = data;
      onDataReady();
      return;
    } catch (err) {
      console.warn("Proxy " + (i + 1) + " failed:", err.message);
    }
  }

  showError("Failed to load data. All connection attempts failed. Please check your internet connection and try again.");
}

function onDataReady() {
  loaderEl.classList.add("hidden");
  populateFilterOptions();
  controlsEl.classList.add("visible");
  applyFiltersAndRender();
}

function populateFilterOptions() {
  let methods = [];
  let years = [];

  allPlanets.forEach(function(p) {
    if (p.discoverymethod && methods.indexOf(p.discoverymethod) === -1) methods.push(p.discoverymethod);
    if (p.disc_year && years.indexOf(p.disc_year) === -1) years.push(p.disc_year);
  });

  methods.sort().forEach(function(m) {
    let opt = document.createElement("option");
    opt.value = m; opt.textContent = m;
    methodFilter.appendChild(opt);
  });

  years.sort(function(a, b) { return b - a; }).forEach(function(y) {
    let opt = document.createElement("option");
    opt.value = y; opt.textContent = y;
    yearFilter.appendChild(opt);
  });
}

function applyFiltersAndRender() {
  let query  = searchInput.value.trim().toLowerCase();
  let method = methodFilter.value;
  let year   = yearFilter.value;
  let sort   = sortSelect.value;

  filtered = allPlanets.filter(function(p) {
    let name = (p.pl_name || "").toLowerCase();
    let host = (p.hostname || "").toLowerCase();
    let matchSearch = !query || name.indexOf(query) !== -1 || host.indexOf(query) !== -1;
    let matchMethod = !method || p.discoverymethod === method;
    let matchYear   = !year   || String(p.disc_year) === String(year);
    return matchSearch && matchMethod && matchYear;
  });

  if (sort) {
    filtered = filtered.slice().sort(function(a, b) {
      switch (sort) {
        case "name-asc":    return (a.pl_name || "").localeCompare(b.pl_name || "");
        case "name-desc":   return (b.pl_name || "").localeCompare(a.pl_name || "");
        case "year-asc":    return (a.disc_year || 0) - (b.disc_year || 0);
        case "year-desc":   return (b.disc_year || 0) - (a.disc_year || 0);
        case "mass-asc":    return (a.pl_bmasse == null ? Infinity : a.pl_bmasse) - (b.pl_bmasse == null ? Infinity : b.pl_bmasse);
        case "mass-desc":   return (b.pl_bmasse == null ? -Infinity : b.pl_bmasse) - (a.pl_bmasse == null ? -Infinity : a.pl_bmasse);
        case "radius-asc":  return (a.pl_rade == null ? Infinity : a.pl_rade) - (b.pl_rade == null ? Infinity : b.pl_rade);
        case "radius-desc": return (b.pl_rade == null ? -Infinity : b.pl_rade) - (a.pl_rade == null ? -Infinity : a.pl_rade);
        default: return 0;
      }
    });
  }

  renderCards(filtered);
  resultsCount.textContent = filtered.length === allPlanets.length
    ? "Showing all " + allPlanets.length + " planets"
    : "Showing " + filtered.length + " of " + allPlanets.length + " planets";
}

function resetFilters() {
  searchInput.value = "";
  methodFilter.value = "";
  yearFilter.value = "";
  sortSelect.value = "";
  applyFiltersAndRender();
}

function renderCards(planets) {
  gridEl.innerHTML = "";

  if (planets.length === 0) {
    gridEl.classList.add("hidden");
    emptyEl.classList.remove("hidden");
    return;
  }

  emptyEl.classList.add("hidden");
  gridEl.classList.remove("hidden");

  planets.forEach(function(planet, index) {
    let card = buildCard(planet);
    gridEl.appendChild(card);
    (function(c, delay) {
      requestAnimationFrame(function() {
        setTimeout(function() { c.classList.add("visible"); }, delay);
      });
    })(card, index * 40);
  });
}

function buildCard(p) {
  let name   = p.pl_name   || "Unknown Planet";
  let host   = p.hostname  || "Unknown Host";
  let method = p.discoverymethod || "Unknown";
  let year   = p.disc_year || "-";
  let mass   = p.pl_bmasse != null ? parseFloat(p.pl_bmasse).toFixed(2) + " Me" : null;
  let radius = p.pl_rade   != null ? parseFloat(p.pl_rade).toFixed(2)   + " Re" : null;
  let period = p.pl_orbper != null ? parseFloat(p.pl_orbper).toFixed(2) + " days" : null;
  let dist   = p.sy_dist   != null ? parseFloat(p.sy_dist).toFixed(1)   + " pc" : null;

  let card = document.createElement("article");
  card.className = "planet-card";
  card.setAttribute("data-method", method);

  card.innerHTML =
    '<div class="card-planet-name" title="' + name + '">' + name + '</div>' +
    '<div class="card-host">Host: ' + host + '</div>' +
    '<div class="card-divider"></div>' +
    '<div class="card-stats">' +
      '<div class="stat-item"><div class="stat-label">Mass</div><div class="stat-value' + (mass ? '' : ' na') + '">' + (mass || 'N/A') + '</div></div>' +
      '<div class="stat-item"><div class="stat-label">Radius</div><div class="stat-value' + (radius ? '' : ' na') + '">' + (radius || 'N/A') + '</div></div>' +
      '<div class="stat-item"><div class="stat-label">Orbital Period</div><div class="stat-value' + (period ? '' : ' na') + '">' + (period || 'N/A') + '</div></div>' +
      '<div class="stat-item"><div class="stat-label">Distance</div><div class="stat-value' + (dist ? '' : ' na') + '">' + (dist || 'N/A') + '</div></div>' +
    '</div>' +
    '<div class="card-footer">' +
      '<span class="method-tag ' + methodClass(method) + '">' + method + '</span>' +
      '<span class="year-badge">' + year + '</span>' +
    '</div>';

  return card;
}

function methodClass(method) {
  let map = { "Transit": "transit", "Radial Velocity": "radial-velocity", "Imaging": "imaging", "Microlensing": "microlensing" };
  return map[method] || "other";
}

function showError(message) {
  loaderEl.classList.add("hidden");
  errorMsg.textContent = message;
  errorEl.classList.remove("hidden");
}

searchInput.addEventListener("input", applyFiltersAndRender);
methodFilter.addEventListener("change", applyFiltersAndRender);
yearFilter.addEventListener("change", applyFiltersAndRender);
sortSelect.addEventListener("change", applyFiltersAndRender);
resetBtn.addEventListener("click", resetFilters);

document.addEventListener("DOMContentLoaded", function() {
  buildStarField();
  fetchPlanets();
});