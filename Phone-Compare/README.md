# PhoneCompare

A static, high-performance web application for exploring and comparing detailed specifications of over 13,289 mobile phones. Built with vanilla HTML, CSS, and JavaScript, and designed to run entirely on GitHub Pages with no backend required.

## Live Demo

https://phone-compare-eight.vercel.app

## Data Source

This project uses the [Mobile Phone Specifications Dataset](https://www.kaggle.com/datasets/sulthonaqthoris/mobile-phone-specifications-dataset) from Kaggle as its primary data source. The original dataset contains 13,727 devices but was provided in a malformed JSON format with missing or inconsistent fields. After cleaning and validation, 438 entries were excluded due to invalid or completely empty specifications, resulting in a final dataset of 13,289 valid devices.

## Data Processing

To prepare the dataset for reliable client-side usage, two Python scripts were developed:

- **`fixJson.py`**: Cleans and validates the original `phone.json` file by:
  - Removing invalid control characters and unusual terminators
  - Filtering out devices with completely empty specifications
  - Producing two output files:
    - `phones_fixed.json`: Contains only devices with valid, non-empty technical specifications
    - `missedInfo.json`: Contains devices excluded due to missing specification data (for auditing purposes)

- **`getCommonFeatures.py`**: Analyzes `phones_fixed.json` to identify specification fields present in every device. The result is saved as `common_features.json`, which was used to determine which properties to include in the filtering UI.

All processed JSON files are stored in the `data/` directory.

## Features

- **Detailed Device Pages**: Click any phone to view a modal with complete specifications organized by category
- **Advanced Filtering**: Filter devices by RAM, storage, battery capacity, screen size, and key features (5G, NFC, headphone jack)
- **Smart Comparison**: Select a phone and search for a second to view a side-by-side comparison of common specifications
- **Responsive Design**: Optimized for desktop and mobile (comparison table prompts device rotation on narrow screens)
- **Light/Dark Mode**: System-aware theme with manual toggle
- **Offline-Compatible**: Entire site is static and can be cached for offline use

## Project Structure

```
.
├── index.html          # Main application page
├── style.css           # Complete styling with theme support
├── script.js           # Application logic and data handling
├── fixJson.py          # Data cleaning and validation script
├── getCommonFeatures.py # Common specification analyzer
└── data/
    ├── phones_fixed.json   # Cleaned and filtered dataset
    ├── missedInfo.json     # Excluded devices (empty specs)
    └── common_features.json # Specification fields common to all devices
```

## Deployment

The application is designed to be deployed directly to **GitHub Pages**:
1. Ensure all files are in the repository root
2. The `data/` directory must contain the processed JSON files
3. Enable GitHub Pages in repository settings (source: root, branch: main)

No build step is required — the site runs entirely from static assets.

## Notes

- All data processing is performed client-side after initial JSON load
- The comparison view is intentionally optimized for landscape/desktop viewing
- The original phone.json file was excluded from the repository due to its large size
- Only the cleaned dataset (phones_fixed.json) is included; auxiliary outputs like missedInfo.json and common_features.json were omitted to reduce repo size

---

Created by Ismail Oksuz. Dataset sourced from Kaggle.
