import webbrowser
import requests
import json
from bs4 import BeautifulSoup

def get_image_urls(name):
    query = '+'.join(name.split())
    webbrowser.open(f'https://www.google.com/search?q={query}&tbm=isch', new=0)
    page = requests.get(f'https://www.google.com/search?q={query}&tbm=isch')
    soup = BeautifulSoup(page.text, 'html.parser')
    return [img.get('src') for img in soup.findAll('img')]

def main():
    with open('src/data/mushroom-data.json', 'r') as f:
        mushroom_data = json.load(f)
    names = [f"{mushroom['family']} {mushroom['name']}" for mushroom in mushroom_data]
    data = []
    for name in names:
        image_urls = get_image_urls(name)
        print(f'Choose an image for {name}:')
        for i, url in enumerate(image_urls):
            print(f'{i}: {url}')
        choice = int(input())
        data.append({'name': name.split(' Family ')[-1], 'image_url': image_urls[choice]})
    with open('src/data/mushroom-image-url-data.json', 'w') as f:
        json.dump(data, f)

if __name__ == '__main__':
    main()