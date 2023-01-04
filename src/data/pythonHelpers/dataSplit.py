import json

with open('src/data/mushroom-data.json') as f:
  data = json.load(f)

families = [d['family'] for d in data]
names = [d['name'] for d in data]

num_items = len(families)
split_index = num_items // 2
first_half_families = families[:split_index]
second_half_families = families[split_index:]
first_half_names = names[:split_index]
second_half_names = names[split_index:]

first_half_data = [{'name': n, 'family': f, 'url': ''} for n, f in zip(first_half_names, first_half_families)]
second_half_data = [{'name': n, 'family': f, 'url': ''} for n, f in zip(second_half_names, second_half_families)]

with open('src/data/pythonHelpers/1_half_data.json', 'w') as f:
  json.dump(first_half_data, f)

with open('src/data/pythonHelpers/2_half_data.json', 'w') as f:
  json.dump(second_half_data, f)

print('First half of the data: ', len(first_half_data))
print('Second half of the data: ', len(second_half_data))
