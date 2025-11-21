import requests
from collections import Counter
from datetime import datetime

DATA_URL = "https://www.datos.gov.co/resource/gt2j-8ykr.json?$limit=20000"

def fetch_covid_data():
    try:
        response = requests.get(DATA_URL)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        print(f"Error fetching data: {e}")
        return []

def process_summary(data):
    total_cases = len(data)
    deceased = sum(1 for case in data if case.get('estado') == 'Fallecido')
    recovered = sum(1 for case in data if case.get('recuperado') == 'Recuperado')
    active = sum(1 for case in data if case.get('estado') == 'Leve' or case.get('estado') == 'Moderado' or case.get('estado') == 'Grave') # Approximation
    
    # Gender
    gender_counts = Counter(case.get('sexo') for case in data if case.get('sexo'))
    gender_stats = {k: v for k, v in gender_counts.items()}
    
    # Status distribution
    status_counts = Counter(case.get('estado') for case in data if case.get('estado'))
    status_stats = {k: v for k, v in status_counts.items()}

    return {
        "total_cases": total_cases,
        "deceased": deceased,
        "recovered": recovered,
        "active": active,
        "gender": gender_stats,
        "status": status_stats
    }

def process_timeline(data):
    # Filter deceased
    deceased_cases = [case for case in data if case.get('fecha_muerte')]
    # Count by date
    date_counts = Counter(case.get('fecha_muerte').split('T')[0] for case in deceased_cases)
    sorted_dates = sorted(date_counts.keys())
    return {
        "dates": sorted_dates,
        "values": [date_counts[date] for date in sorted_dates]
    }

def process_demographics(data):
    ages = []
    for case in data:
        age = case.get('edad')
        if age:
            try:
                ages.append(int(age))
            except ValueError:
                pass
    
    # Group by ranges: 0-10, 11-20, etc.
    ranges = ["0-10", "11-20", "21-30", "31-40", "41-50", "51-60", "61-70", "71-80", "81+"]
    counts = {r: 0 for r in ranges}
    
    for age in ages:
        if age <= 10: counts["0-10"] += 1
        elif age <= 20: counts["11-20"] += 1
        elif age <= 30: counts["21-30"] += 1
        elif age <= 40: counts["31-40"] += 1
        elif age <= 50: counts["41-50"] += 1
        elif age <= 60: counts["51-60"] += 1
        elif age <= 70: counts["61-70"] += 1
        elif age <= 80: counts["71-80"] += 1
        else: counts["81+"] += 1
        
    return {
        "labels": list(counts.keys()),
        "values": list(counts.values())
    }

def process_locations(data):
    locations = {}
    for case in data:
        dept = case.get('departamento_nom')
        city = case.get('ciudad_municipio_nom')
        if dept and city:
            if dept not in locations:
                locations[dept] = set()
            locations[dept].add(city)
            
    # Convert sets to lists
    return {k: sorted(list(v)) for k, v in locations.items()}

def filter_data(data, department=None, city=None, gender=None):
    filtered = data
    if department:
        filtered = [c for c in filtered if c.get('departamento_nom') == department]
    if city:
        filtered = [c for c in filtered if c.get('ciudad_municipio_nom') == city]
    if gender:
        filtered = [c for c in filtered if c.get('sexo') == gender]
    return filtered

