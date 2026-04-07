let api = "svVD505ciuwi0o4IBBhrV6nJ8onbB8hq2XpjbT75";

let grid = document.getElementById("grid");
let loader = document.getElementById("loader");

let searchInput = document.getElementById("search");
let searchBtn = document.getElementById("search-btn");
let resetBtn = document.getElementById("reset");
let sortSelect = document.getElementById("sort");
let yearSelect = document.getElementById("year");

let themeBtn = document.getElementById("theme-toggle");

let allData = [];

function display() {
  fetch(`https://api.nasa.gov/planetary/apod?api_key=${api}&count=50`)
    .then(res => res.json())
    .then(function (data) {
      allData = data.filter(item => item.media_type === "image");

      loader.style.display = "none";
      grid.classList.remove("hidden");

      applyFilters();
    })
    .catch(function () {
      loader.innerText = "Failed to load data";
    });
}

function applyFilters() {
  let data = [...allData];

  let searchValue = searchInput.value.trim().toLowerCase();

  if (searchValue !== "") {
    data = data.filter(item =>
      (item.title || "").toLowerCase() === searchValue
    );
  }

  let yearValue = yearSelect.value;

  if (yearValue !== "") {
    let parts = yearValue.split("-");
    let start = Number(parts[0]);
    let end = Number(parts[1]);

    data = data.filter(item => {
      if (!item.date) return false;
      let year = Number(item.date.split("-")[0]);
      return year >= start && year <= end;
    });
  }

  let sortValue = sortSelect.value;

  if (sortValue === "year-asc") {
    data.sort((a, b) => new Date(a.date) - new Date(b.date));
  }

  if (sortValue === "year-desc") {
    data.sort((a, b) => new Date(b.date) - new Date(a.date));
  }

  displayData(data);
}

function displayData(data) {
  let cards = data.map(function (item) {
    let year = item.date ? item.date.split("-")[0] : "N/A";

    let shortText = item.explanation
      ? item.explanation.substring(0, 120) + "..."
      : "No description";

    return `
      <div class="card">
        <img src="${item.url}" alt="image">
        <h3>${item.title}</h3>
        <p>Date: ${item.date} (${year})</p>
        <p>${shortText}</p>
        <span class="like">♡</span>
      </div>
    `;
  });

  grid.innerHTML = cards.join("");

  let likes = document.querySelectorAll(".like");

  likes.forEach(function (like) {
    like.addEventListener("click", function () {
      like.classList.toggle("active");
      like.innerText = like.classList.contains("active") ? "♥" : "♡";
    });
  });
}

searchBtn.addEventListener("click", applyFilters);

sortSelect.addEventListener("change", applyFilters);

yearSelect.addEventListener("change", applyFilters);

resetBtn.addEventListener("click", function () {
  searchInput.value = "";
  sortSelect.value = "";
  yearSelect.value = "";
  applyFilters();
});

themeBtn.addEventListener("click", function () {
  document.body.classList.toggle("light");

  if (document.body.classList.contains("light")) {
    themeBtn.innerText = "☀️";
  } else {
    themeBtn.innerText = "🌙";
  }
});

display();