# exoplanet-catalog
# Milestone 1: project setup and README

🔭 Exoplanet Catalog

A web application that lets you explore thousands of confirmed exoplanets discovered beyond our solar system, using NASA's Exoplanet Archive API. Users can search, filter, and sort planets by discovery method, size, distance, and more.

🌐 Live Demo

Will be added after deployment (Milestone 4)


🚀 Purpose

This project was built as part of a JavaScript web development assignment. The goal is to demonstrate:

Integration of a public REST API using fetch
Dynamic rendering of data on a webpage
Interactive features (search, filter, sort) using Array Higher-Order Functions
Responsive UI design


🛸 API Used

NASA Exoplanet Archive — TAP Service

Base URL: https://api.nasa.gov/

Docs: https://exoplanetarchive.ipac.caltech.edu/docs/TAP/usingTAP.html





Sample request:

GET https://exoplanetarchive.ipac.caltech.edu/cgi-bin/nstedAPI/nph-nstedAPI?&table=exoplanets&format=ipac&where=pl_kepflag=1

| Field Name          | Description                                   |
| ------------------- | --------------------------------------------- |
| **pl_name**         | Planet name                                   |
| **hostname**        | Host star name                                |
| **discoverymethod** | How it was found (Transit, RV, Imaging, etc.) |
| **disc_year**       | Year of discovery                             |
| **pl_rade**         | Planet radius (in Earth radii)                |
| **pl_bmasse**       | Planet mass (in Earth masses)                 |
| **pl_orbper**       | Orbital period (in days)                      |
| **sy_dist**         | Distance from Earth (in parsecs)              |


✨ Planned Features
Core (Milestones 2 & 3)

Fetch and display confirmed exoplanet data from NASA's archive

Planet cards showing: name, host star, discovery method, year, size, distance

Summary stats: total planets, discovery methods count, closest planet, largest planet

Search — search planets by name or host star using Array.filter()

Filter — filter by discovery method (Transit / Radial Velocity / Imaging / Microlensing / Other) using Array.filter()

Sort — sort by distance, planet radius, discovery year, or name using Array.sort()

Planet size classification badges (Earth-like / Super-Earth / Neptune-like / Gas Giant)

Responsive design (mobile, tablet, desktop)



Bonus (Milestone 4)



Debouncing on the search input

Pagination for large result sets (5,000+ planets)

Loading indicator during API fetch

Dark / Light mode toggle

localStorage to save favourite planets


🛠️ Technologies
TechnologyPurposeHTML5Page structureCSS3Styling and responsive layoutJavaScript (ES6+)Logic, API calls, DOM manipulationNASA Exoplanet Archive APIPlanet data sourceVercel / NetlifyDeployment (Milestone 4)
