import requests
import datetime

def main():
  headers = {
    'Accept': 'application/json'
  }

  dateFrom = datetime.datetime.now().isoformat()
  requestString = "https://api.carbonintensity.org.uk/intensity/{dateFrom}/fw48h"
  
  urlData = requests.get(requestString.format(dateFrom = dateFrom), params={}, headers = headers)
  
  print(urlData.json())

if __name__ == "__main__":
  main()