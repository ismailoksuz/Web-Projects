# Global-Urban-Rail-Transit-Data-UI

An interactive web application for visualizing and analyzing urban rail transit systems worldwide.

## Features

- **Interactive Map**: Visualize cities with rail transit systems using clustered markers
- **City Details**: View detailed information about each city's transit systems
- **Advanced Filtering**: 
  - Filter by system types (Metro, Tram, Light Rail, etc.)
  - Filter by continent (Europe, Asia, North America, etc.)
  - Filter by country (dynamic list based on dataset)
  - Filter by length preset (Short: 0-50km, Medium: 50-200km, Long: 200+km)
  - Filter by system count (Single system, 2-4 systems, 5+ systems)
  - Multiple systems checkbox filter
- **Smart Zoom**: Automatic zoom to single city or region when filtered
- **Rankings**: See top cities ranked by length, stations, lines, or number of systems
- **Comparison**: Compare two cities side-by-side
- **Statistics**: View charts and statistical distributions
- **Export Data**: Export city data and comparisons to CSV
- **Responsive Design**: Works on desktop and mobile devices
- **Draggable Elements**: City cards and charts can be dragged for better viewing

## Dataset

The application uses a custom dataset containing information about:
- Metro systems
- Tram networks
- Light rail systems
- Monorails
- Maglev systems
- People movers
- Airport shuttles
- Amusement park systems
- Heritage trams
- Tram trains
- Interurban systems
- Special trams
- Streetcars

## Live Demo

The application is live and accessible at: [https://ismailoksuz.github.io/Global-Urban-Rail-Transit-Data-UI/](https://ismailoksuz.github.io/Global-Urban-Rail-Transit-Data-UI/)

Try it now to explore global urban rail transit systems interactively!

## Installation

1. Clone the repository:
```bash
git clone https://github.com/ismailoksuz/Global-Urban-Rail-Transit-Data-UI.git
```

2. The application runs directly in the browser - no build process required.

## Usage

1. Open index.html in a modern web browser
2. Use the sidebar to navigate between different views:
  - **Map**: Interactive world map with city markers
  - **Rankings**: Top cities by various metrics
  - **Compare**: Side-by-side city comparison
  - **Stats**: Statistical charts and visualizations
3. Click on map markers to view city details
4. Use filters to narrow down the displayed cities
5. Export data using the CSV export buttons

## Data Processing

The src/ directory contains Python scripts for processing the dataset:
- `filterCSV.py`: Filters the original dataset to create specific transit system CSV files
- `mergeCSV.py`: Combines filtered data into a comprehensive `combined.csv`
- `get_coordinates.py`: Fetches city coordinates via API and creates `city_coordinates.csv`

## Technologies Used

- **Frontend**: HTML5, CSS3, JavaScript
- **Mapping**: Leaflet.js with Marker Clustering
- **Charts**: Chart.js
- **Data Parsing**: Papa Parse
- **Styling**: Custom CSS with Urbanist font
- **Icons**: Unicode emojis

## Key Features Added

### Recent Updates
- **Enhanced filtering system** with continent and country selectors
- **Length preset filters** for quick categorization
- **System count preset filters** for multi-system cities
- **Smart zoom functionality** - automatically focuses on filtered results
- **Dynamic country lists** based on dataset contents
- **Removed Train system** due to data inconsistencies

### Filtering Capabilities
- **Continent-based filtering**: 6 continents (Europe, Asia, North America, South America, Africa, Oceania)
- **Country-based filtering**: Dynamic dropdown showing only countries with transit systems
- **Preset filters**: One-click filters for common use cases
- **Combined filtering**: All filters work together for precise results

## Dataset Source

The dataset used in this application was created and compiled by the author. It is also available on Kaggle: [Global Urban Rail Transit Dataset](https://www.kaggle.com/datasets/ismailoksuz/global-urban-rail-transit-dataset)

## Author

**İsmail ÖKSÜZ**  
GitHub: [@ismailoksuz](https://github.com/ismailoksuz)  
Kaggle: [ismailoksuz](https://www.kaggle.com/ismailoksuz)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
