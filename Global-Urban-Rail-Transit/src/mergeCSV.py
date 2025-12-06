import csv
import os
from pathlib import Path

def merge_all_systems():
    data_dir = Path("data")    
    systems = {
        'metro': ('metro.csv', 'STATION NUMBER', 'LINES', 'TOTAL LENGTH', 'TOTAL LENGTH'),
        'train': ('train.csv', 'STATION NUMBER', 'LINES', 'TOTAL LENGTH', 'TOTAL LENGTH'),
        'tram': ('tram.csv', 'STATIONS', 'LINES', 'LENGTH', 'LENGTH'),
        'light_rail': ('light_rail.csv', 'STATIONS', 'LINES', 'LENGTH', 'LENGTH'),
        'monorail': ('Monorail.csv', 'STATIONS', None, 'LENGTH_KM', 'LENGTH_KM'),
        'maglev': ('Maglev.csv', 'STATIONS', None, 'LENGTH_KM', 'LENGTH_KM'),
        'people_mover': ('PeopleMover.csv', 'STATIONS', None, 'LENGTH_KM', 'LENGTH_KM'),
        'airport_shuttle': ('AirportShuttle.csv', 'STATIONS', None, 'LENGTH_KM', 'LENGTH_KM'),
        'amusement_park': ('AmusementPark.csv', 'STATIONS', None, 'LENGTH_KM', 'LENGTH_KM'),
        'heritage_tram': ('heritage_tram.csv', 'STATIONS', 'LINES', 'LENGTH', 'LENGTH'),
        'tram_train': ('tram_train.csv', 'STATIONS', 'LINES', 'LENGTH', 'LENGTH'),
        'interurban': ('interurban.csv', 'STATIONS', 'LINES', 'LENGTH', 'LENGTH'),
        'special': ('specialTram.csv', 'STATIONS', 'LINES', 'LENGTH', 'LENGTH'),
        'streetcar': ('streetcar.csv', 'STATIONS', 'LINES', 'LENGTH', 'LENGTH')
    }    
    cities_data = {}
    for system_name, (filename, station_col, lines_col, length_col, length_type) in systems.items():
        filepath = data_dir / filename
        if not filepath.exists():
            print(f"Uyarı: {filename} bulunamadı!")
            continue
        try:
            with open(filepath, 'r', encoding='utf-8') as f:
                reader = csv.DictReader(f)
                for row in reader:
                    city = row['CITY'].strip()
                    country = row['COUNTRY'].strip()                    
                    key = f"{city},{country}"
                    if key not in cities_data:
                        cities_data[key] = {
                            'CITY': city,
                            'COUNTRY': country,
                            'HAS_METRO': False,
                            'HAS_TRAIN': False,
                            'HAS_TRAM': False,
                            'HAS_LIGHT_RAIL': False,
                            'HAS_MONORAIL': False,
                            'HAS_MAGLEV': False,
                            'HAS_PEOPLE_MOVER': False,
                            'HAS_AIRPORT_SHUTTLE': False,
                            'HAS_AMUSEMENT_PARK': False,
                            'HAS_HERITAGE_TRAM': False,
                            'HAS_TRAM_TRAIN': False,
                            'HAS_INTERURBAN': False,
                            'HAS_SPECIAL': False,
                            'HAS_STREETCAR': False,
                            'TOTAL_LENGTH': 0.0 
                        }                    
                    column_name = f"HAS_{system_name.upper()}"
                    if column_name in cities_data[key]:
                        cities_data[key][column_name] = True                    
                    if length_col in row and row[length_col]:
                        try:
                            length_value = float(row[length_col])
                            cities_data[key]['TOTAL_LENGTH'] += length_value
                        except (ValueError, TypeError):
                            print(f"Uyarı: {city}, {country} için uzunluk değeri sayısal değil: {row[length_col]}")
        except Exception as e:
            print(f"Hata: {filename} okunurken hata oluştu: {e}")    
    merged_data = list(cities_data.values())
    for city_data in merged_data:
        city_data['TOTAL_LENGTH'] = round(city_data['TOTAL_LENGTH'], 2)
    
    output_file = data_dir / "combined.csv"
    fieldnames = [
        'CITY', 'COUNTRY', 'HAS_METRO', 'HAS_TRAIN', 'HAS_TRAM', 'HAS_LIGHT_RAIL',
        'HAS_MONORAIL', 'HAS_MAGLEV', 'HAS_PEOPLE_MOVER', 'HAS_AIRPORT_SHUTTLE',
        'HAS_AMUSEMENT_PARK', 'HAS_HERITAGE_TRAM', 'HAS_TRAM_TRAIN', 'HAS_INTERURBAN',
        'HAS_SPECIAL', 'HAS_STREETCAR', 'TOTAL_LENGTH'
    ]
    with open(output_file, 'w', newline='', encoding='utf-8') as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(merged_data)
if __name__ == "__main__":
    merge_all_systems()