import livepopulartimes
import urllib.parse
import sys
import datetime
import requests
import json 
import pytz 

def unshorten_url(url):
    """
    Follows a short link (goo.gl) to find the real long URL.
    """
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        if "goo.gl" in url or "googleusercontent" in url:
            response = requests.head(url, allow_redirects=True, headers=headers)
            return response.url
        return url
    except:
        return url

def get_capacity(url: str):
    result = {"success": False, "error": "Unknown error"}

    if not url:
        print(json.dumps({"success": False, "error": "Missing URL"}))
        return

    try:
        if "goo.gl" in url or "googleusercontent" in url:
            url = unshorten_url(url)

        if '/place/' in url:
            raw_name = url.split('/place/')[1].split('/')[0]
        else:
            print(json.dumps({"success": False, "error": "Invalid URL format: Missing /place/"}))
            return

        clean_name = urllib.parse.unquote(raw_name).replace('+', ' ')
        search_term = "{} Berkeley".format(clean_name)
        
        data = livepopulartimes.get_populartimes_by_address(search_term)
        
        percentage = data.get('current_popularity')
        MAX_CAPACITY = 200

        if percentage is not None:
            count = int((percentage / 100) * MAX_CAPACITY)
            result = {
                "success": True,
                "library_name": clean_name,
                "status": "Live",
                "percentage": percentage,
                "estimated_students": count,
                "is_open": True,
                "schedule": data.get('populartimes', []) 
            }
        
        elif 'populartimes' in data:
            berkeley_tz = pytz.timezone('America/Los_Angeles')
            now = datetime.datetime.now(berkeley_tz)
            day_idx = now.weekday()
            hour_idx = now.hour
            
            try:
                historical_pct = data['populartimes'][day_idx]['data'][hour_idx]
                count = int((historical_pct / 100) * MAX_CAPACITY)
                
                status_msg = "Historical Estimate"
                if historical_pct == 0:
                    status_msg = "Likely Closed"

                result = {
                    "success": True,
                    "library_name": clean_name,
                    "status": status_msg,
                    "percentage": historical_pct,
                    "estimated_students": count,
                    "is_open": historical_pct > 0,
                    "schedule": data.get('populartimes', [])
                }
            except:
                result = {
                    "success": True,
                    "library_name": clean_name,
                    "status": "Error Parsing History",
                    "percentage": 0,
                    "estimated_students": 0,
                    "is_open": False,
                    "schedule": []
                }
        else:
            result = {
                "success": True, 
                "library_name": clean_name,
                "status": "No Data Found",
                "percentage": 0,
                "estimated_students": 0, 
                "is_open": False,
                "schedule": []
            }

    except Exception as e:
        result = {"success": False, "error": str(e)}

    print(json.dumps(result))

if __name__ == '__main__':
    if len(sys.argv) > 1:
        get_capacity(sys.argv[1])
    else:
        print(json.dumps({"success": False, "error": "No URL provided"}))
