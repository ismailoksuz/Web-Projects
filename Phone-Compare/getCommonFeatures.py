import json
import os

def extract_all_keys(obj, parent_key=""):
    keys = []
    if isinstance(obj, dict):
        for k, v in obj.items():
            new_key = f"{parent_key}.{k}" if parent_key else k
            keys.append(new_key)
            keys.extend(extract_all_keys(v, new_key))
    return keys

def main():
    input_path = "data/phones_fixed.json"
    output_path = "data/common_features.json"

    if not os.path.exists(input_path):
        print(f"❌ {input_path} bulunamadı.")
        return

    print("📱 Ortak özellikler analiz ediliyor...")
    with open(input_path, "r", encoding="utf-8") as f:
        brands = json.load(f)

    all_devices = []
    for brand in brands:
        for device in brand.get("devices", []):
            all_devices.append(device)

    if not all_devices:
        print("⚠️ Cihaz bulunamadı.")
        return

    print(f"✅ Toplam {len(all_devices)} cihaz bulundu.")

    device_key_sets = []
    for device in all_devices:
        specs = device.get("specifications", {})
        keys = set(extract_all_keys(specs))
        device_key_sets.append(keys)

    if device_key_sets:
        common_keys = set.intersection(*device_key_sets)
        common_keys = sorted(common_keys)
    else:
        common_keys = []

    print(f"🔍 Her cihazda ortak {len(common_keys)} özellik bulundu.")
    print("Ortak özellikler:")
    for key in common_keys:
        print(f"  - {key}")
    with open(output_path, "w", encoding="utf-8") as f:
        json.dump(common_keys, f, indent=2, ensure_ascii=False)

    print(f"\n✅ Ortak özellikler kaydedildi: {output_path}")

if __name__ == "__main__":
    main()