import requests
import json
import time
import csv

API_KEY = "hFrOJqMpsucczR4U3jahJA==ZMJMSPHE3HVvZAQc"
API_URL = "https://api.api-ninjas.com/v1/geocoding"

def read_cities_from_csv():
    cities = []
    with open('data/combined.csv', 'r', encoding='utf-8') as f:
        reader = csv.DictReader(f)
        for row in reader:
            cities.append({
                'city': row['CITY'],
                'country': row['COUNTRY']
            })
    return cities

def get_coordinates(city, country):
    params = {
        'city': city,
        'country': country
    }
    
    headers = {
        'X-Api-Key': API_KEY
    }
    
    try:
        response = requests.get(API_URL, params=params, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            if data and len(data) > 0:
                return {
                    'city': city,
                    'country': country,
                    'latitude': data[0]['latitude'],
                    'longitude': data[0]['longitude'],
                    'success': True
                }
        elif response.status_code == 429:
            print(f"Rate limit! Bekliyor...")
            time.sleep(2) 
            return get_coordinates(city, country)
        else:
            print(f"Error {response.status_code} for {city}, {country}")
            
    except Exception as e:
        print(f"Exception for {city}, {country}: {e}")
    
    return {
        'city': city,
        'country': country,
        'latitude': None,
        'longitude': None,
        'success': False
    }

def main():
    print("Şehirleri CSV'den okuyorum...")
    cities = read_cities_from_csv()
    
    print(f"Toplam {len(cities)} şehir bulundu")
    
    results = []
    
    for i, city_data in enumerate(cities):
        print(f"Processing {i+1}/{len(cities)}: {city_data['city']}, {city_data['country']}")
        
        result = get_coordinates(city_data['city'], city_data['country'])
        results.append(result)
        
        if (i + 1) % 10 == 0:
            print(f"10 şehir tamamlandı, 1 saniye bekliyor...")
            time.sleep(1)
    
    with open('data/city_coordinates.csv', 'w', newline='', encoding='utf-8') as f:
        fieldnames = ['city', 'country', 'latitude', 'longitude', 'success']
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(results)
    
    success_count = sum(1 for r in results if r['success'])
    print(f"\nİşlem tamamlandı!")
    print(f"Toplam şehir: {len(results)}")
    print(f"Başarılı: {success_count}")
    print(f"Başarısız: {len(results) - success_count}")
    print(f"CSV dosyası: city_coordinates.csv")

if __name__ == "__main__":
    main()