import pandas as pd
import requests
import io

def main():
  headers = {
    'Accept': 'application/json'
  }
  
  urlData = requests.get('https://api.carbonintensity.org.uk/regional/regionid/3', params={}, headers = headers)
  
  # df = pd.read_csv(io.StringIO(urlData.decode('utf-8')))
  print(urlData.json())

if __name__ == "__main__":
  main()