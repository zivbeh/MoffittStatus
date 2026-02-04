from flask import Flask, jsonify, request
import livepopulartimes
import urllib.parse
import sys
import datetime
import requests

app = Flask(__name__)

def unshorten_url(url):
    """
    Follows a short link (goo.gl) to find the real long URL.
    """
    try:
        headers = {'User-Agent': 'Mozilla/5.0'}
        response = requests.head(url, allow_redirects=True, headers=headers)
        return response.url
    except:
        return url

@app.route('/get-capacity', methods=['GET'])
def get_capacity():
    url = request.args.get('url')
    if not url:
        return jsonify({"error": "Missing 'url' parameter"}), 400

    try:
        if "goo.gl" in url or "maps.app.goo.gl" in url:
            print(f"Expanding short URL: {url}")
            url = unshorten_url(url)
            print(f"Expanded to: {url}")

        if '/place/' in url:
            raw_name = url.split('/place/')[1].split('/')[0]
        else:
            return jsonify({"error": "Could not find library name in URL. Try a standard Google Maps link."}), 400

        clean_name = urllib.parse.unquote(raw_name).replace('+', ' ')
        
        search_term = f"{clean_name} Berkeley"
        
        print(f"Searching Google for: '{search_term}'")
        
        data = livepopulartimes.get_populartimes_by_address(search_term)
        
        percentage = data.get('current_popularity')
        MAX_CAPACITY = 200

        if percentage is not None:
            count = int((percentage / 100) * MAX_CAPACITY)
            return jsonify({
                "success": True,
                "library_name": clean_name,
                "status": "Live",
                "percentage": percentage,
                "estimated_students": count,
                "is_open": True
            })
        
        elif 'populartimes' in data:
            now = datetime.datetime.now()
            day_idx = now.weekday()
            hour_idx = now.hour
            
            try:
                historical_pct = data['populartimes'][day_idx]['data'][hour_idx]
                count = int((historical_pct / 100) * MAX_CAPACITY)
                
                status_msg = "Historical Estimate"
                if historical_pct == 0:
                    status_msg = "Likely Closed"

                return jsonify({
                    "success": True,
                    "library_name": clean_name,
                    "status": status_msg,
                    "percentage": historical_pct,
                    "estimated_students": count,
                    "is_open": historical_pct > 0
                })
            except:
                pass

        return jsonify({
            "success": True, 
            "library_name": clean_name,
            "status": "No Data Found",
            "percentage": 0,
            "estimated_students": 0, 
            "is_open": False
        })

    except Exception as e:
        print(f"Error: {e}")
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == '__main__':
    port = 5001
    if len(sys.argv) > 1:
        port = int(sys.argv[1])
    app.run(port=port)