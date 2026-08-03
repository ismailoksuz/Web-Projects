import csv
import os
from pathlib import Path

def fix_country_code(country):
    fixes = {
        "UAE": "United Arab Emirates",
        "UK": "United Kingdom",
        "US": "United States"
    }
    return fixes.get(country, country)

def filter_tram_data():
    input_file = Path("data/tram.csv")
    
    if not input_file.exists():
        print(f"Hata: {input_file} bulunamadı!")
        return
    
    with open(input_file, 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        data = list(reader)
    
    type_groups = {}
    for row in data:
        type_name = row['TYPE']
        row['COUNTRY'] = fix_country_code(row['COUNTRY'])        
        filtered_row = {
            'CITY': row['CITY'],
            'COUNTRY': row['COUNTRY'],
            'STATIONS': row['STATIONS'],
            'LINES': row['LINES'],
            'LENGTH': row['LENGTH']
        }
        if type_name not in type_groups:
            type_groups[type_name] = []
        type_groups[type_name].append(filtered_row)
    for type_name, rows in type_groups.items():
        filename = type_name.lower().replace(" ", "_").replace("-", "_") + ".csv"        
        with open(filename, 'w', newline='', encoding='utf-8') as f:
            fieldnames = ['CITY', 'COUNTRY', 'STATIONS', 'LINES', 'LENGTH']
            writer = csv.DictWriter(f, fieldnames=fieldnames)       
            writer.writeheader()
            writer.writerows(rows)   
        print(f"{len(rows)} satır '{filename}' dosyasına kaydedildi.")
if __name__ == "__main__":
    filter_tram_data()