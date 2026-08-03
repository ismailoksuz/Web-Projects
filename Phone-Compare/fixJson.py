import json
import os

def remove_unusual_terminators(text):
    unusual_chars = {
        '\u2028': ' ',  # LINE SEPARATOR
        '\u2029': ' ',  # PARAGRAPH SEPARATOR
        '\u0085': ' ',  # NEXT LINE
        '\u000C': ' ',  # FORM FEED
        '\u000B': ' ',  # VERTICAL TAB
        '\u001C': ' ',  # FILE SEPARATOR
        '\u001D': ' ',  # GROUP SEPARATOR
        '\u001E': ' ',  # RECORD SEPARATOR
        '\u001F': ' ',  # UNIT SEPARATOR
    }
    
    for char, replacement in unusual_chars.items():
        text = text.replace(char, replacement)
    
    text = text.replace('\r\n', '\n').replace('\r', '\n')   
    return text

def clean_json_file(input_file, output_file, chunk_size=1024*1024):
    print(f"Cleaning JSON: {input_file}")
    print(f"Size: {os.path.getsize(input_file) / (1024*1024):.2f} MB")
    
    total_chars = 0
    unusual_count = 0
    
    with open(input_file, 'r', encoding='utf-8', errors='replace') as f_in, \
         open(output_file, 'w', encoding='utf-8') as f_out:
        
        while True:
            chunk = f_in.read(chunk_size)
            if not chunk:
                break
            
            total_chars += len(chunk)
            
            for char in ['\u2028', '\u2029', '\u0085']:
                unusual_count += chunk.count(char)
            
            cleaned = remove_unusual_terminators(chunk)
            f_out.write(cleaned)
            
            if total_chars % (10 * chunk_size) == 0:
                print(f"Processing... {total_chars / (1024*1024):.1f} MB")
    
    print(f"Cleaned. {total_chars:,} chars, {unusual_count} unusual terminators found.")
    return unusual_count

def validate_json_file(filename):
    print(f"\nValidating {filename}...")
    
    try:
        with open(filename, 'r', encoding='utf-8') as f:
            data = json.load(f)
        
        print(f"✅ VALID JSON!")
        print(f"Total brands: {len(data)}")
        
        device_count = sum(len(brand.get('devices', [])) for brand in data)
        print(f"Total devices: {device_count:,}")
        
        return True, data
        
    except json.JSONDecodeError as e:
        print(f"❌ JSON ERROR: {e}")
        return False, None

def create_safe_json():
    safe_data = [
        {
            "brand_name": "Samsung",
            "devices": [
                {
                    "model_name": "Galaxy S24",
                    "imageUrl": "https://fdn2.gsmarena.com/vv/bigpic/samsung-galaxy-s24.jpg",
                    "specifications": {
                        "Network": {"Technology": "5G"},
                        "Platform": {"OS": "Android 14"},
                        "Memory": {"Internal": "256GB 8GB RAM"},
                        "Battery": {"Type": "4000 mAh"},
                        "Misc": {"Price": "$999", "Colors": "Black, Gray"}
                    }
                }
            ]
        }
    ]
    
    with open('safe_phones.json', 'w', encoding='utf-8') as f:
        json.dump(safe_data, f, ensure_ascii=False, indent=2)
    
    print("\n✅ Safe JSON created: safe_phones.json")
    return 'safe_phones.json'

def split_valid_and_missing(data):
    valid_brands = {}
    missing_brands = {}

    total_valid = 0
    total_missing = 0

    for brand_obj in data:
        if not isinstance(brand_obj, dict):
            continue

        brand_name = brand_obj.get("brand_name")
        devices = brand_obj.get("devices", [])
        if not brand_name or not isinstance(devices, list):
            continue

        valid_devices = []
        missing_devices = []

        for device in devices:
            specs = device.get("specifications")
            if isinstance(specs, dict) and specs and len(specs) > 0:
                valid_devices.append(device)
                total_valid += 1
            else:
                missing_devices.append(device)
                total_missing += 1

        if valid_devices:
            valid_brands[brand_name] = valid_devices
        if missing_devices:
            missing_brands[brand_name] = missing_devices

    valid_list = [{"brand_name": brand, "devices": devices} for brand, devices in valid_brands.items()]
    missing_list = [{"brand_name": brand, "devices": devices} for brand, devices in missing_brands.items()]

    print(f"\n📊 Veri Bölme Sonucu:")
    print(f"✅ Geçerli cihazlar: {total_valid:,}")
    print(f"⚠️  Eksik/boş cihazlar: {total_missing:,}")
    print(f"   → Geçerli marka sayısı: {len(valid_list)}")
    print(f"   → Eksik verili marka sayısı: {len(missing_list)}")

    return valid_list, missing_list

if __name__ == "__main__":
    input_file = "data/phone.json"
    cleaned_temp = "data/phones_cleaned_temp.json"
    valid_output = "data/phones_fixed.json"
    missing_output = "data/missedInfo.json"

    if not os.path.exists(input_file):
        print(f"❌ {input_file} not found!")
        input_file = create_safe_json()
        with open(input_file, 'r', encoding='utf-8') as f:
            fake_data = json.load(f)
        valid_data, missing_data = fake_data, []
    else:
        unusual_count = clean_json_file(input_file, cleaned_temp)
        if unusual_count > 0:
            print(f"\n⚠️ {unusual_count} unusual terminators cleaned.")

        is_valid, raw_data = validate_json_file(cleaned_temp)
        if not is_valid:
            print("\n🚨 Temizlenen dosya bile geçersiz! Safe JSON kullanılıyor.")
            input_file = create_safe_json()
            with open(input_file, 'r', encoding='utf-8') as f:
                raw_data = json.load(f)

        valid_data, missing_data = split_valid_and_missing(raw_data)

        if os.path.exists(cleaned_temp):
            os.remove(cleaned_temp)

    with open(valid_output, 'w', encoding='utf-8') as f:
        json.dump(valid_data, f, ensure_ascii=False, indent=2)
    with open(missing_output, 'w', encoding='utf-8') as f:
        json.dump(missing_data, f, ensure_ascii=False, indent=2)

    print(f"\n✅ Nihai çıktılar:")
    print(f"  - Geçerli modeller: {valid_output}")
    print(f"  - Eksik bilgili modeller: {missing_output}")

    print(f"\n💡 Artık Next.js projende sadece {valid_output} dosyasını kullanabilirsin.")