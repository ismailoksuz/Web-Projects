# Global-Urban-Rail-Transit-Data-UI
An interactive web application for visualizing and analyzing urban rail transit systems worldwide.

## Features

- **Interactive Map**: Visualize cities with rail transit systems using clustered markers
- **City Details**: View detailed information about each city's transit systems
- **Filtering**: Filter cities by system types, number of systems, lines, and length range
- **Rankings**: See top cities ranked by length, stations, lines, or number of systems
- **Comparison**: Compare two cities side-by-side
- **Statistics**: View charts and statistical distributions
- **Export Data**: Export city data and comparisons to CSV
- **Responsive Design**: Works on desktop and mobile devices

## Dataset

The application uses a custom dataset containing information about:
- Metro systems
- Tram networks
- Light rail systems
- Monorails
- Maglev systems
- Train networks
- People movers
- Airport shuttles
- Amusement park systems
- Heritage trams
- Tram trains
- Interurban systems
- Special trams
- Streetcars

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ismailoksuz/Global-Urban-Rail-Transit-Data-UI.git
```

2. The application runs directly in the browser - no build process required.

## Usage

1. Open index.html in a modern web browser
2. Use the sidebar to navigate between different views:
  <ul>
    <li>Map: Interactive world map with city markers</li>
    <li>Rankings: Top cities by various metrics</li>
    <li>Compare: Side-by-side city comparison</li>
    <li>Stats: Statistical charts and visualizations</li>
  </ul>
3. Click on map markers to view city details
4. Use filters to narrow down the displayed cities
5. Export data using the CSV export buttons

## Data Processing

The src/ directory contains Python scripts for processing the dataset:
<ul>
<li>filterCSV.py: Filters the original dataset to create specific transit system CSV files.</li>
<li>mergeCSV.py: Combines filtered data into a comprehensive <code>combined.csv</code>.</li>
<li>get_coordinates.py: Fetches city coordinates via API and creates <code>city_coordinates.csv</code>.</li>
</ul>

## Technologies Used

<ul>
  <li><b>Frontend:</b> HTML5, CSS3, JavaScript</li>
  <li><b>Mapping:</b> Leaflet.js with Marker Clustering</li>
  <li><b>Charts:</b> Chart.js</li>
  <li><b>Data Parsing:</b> Papa Parse</li>
  <li><b>Styling:</b> Custom CSS with Urbanist font</li>
  <li><b>Icons:</b> Unicode emojis</li>
</ul>

## Dataset Source

The dataset used in this application was created and compiled by the author. It is also available on Kaggle: [Global Urban Rail Transit Dataset](https://www.kaggle.com/datasets/ismailoksuz/global-urban-rail-transit-dataset)

## Author

İsmail ÖKSÜZ

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
