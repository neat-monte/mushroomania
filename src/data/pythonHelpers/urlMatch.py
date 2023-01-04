import json

with open('src/data/pythonHelpers/url-data.json', 'r') as f:
    url_data = json.load(f)

with open('src/data/mushroom-data.json', 'r') as f:
    mushroom_data = json.load(f)

url_mapping = {data['name']: data['url'] for data in url_data}

for mushroom in mushroom_data:
    mushroom['url'] = url_mapping.get(mushroom['name'])

with open('src/data/updated-mushroom-data.json', 'w') as f:
    json.dump(mushroom_data, f)