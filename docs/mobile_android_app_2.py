
# -----------------------------------------------------------------------------------------
# This code will simulate
# [a] Operator will get reply from deep learning model in server if component pass or fail
# [b] Operator will agree or disagree with deep learning model in server
# [c] Image and metadata will be sent to deep learning model in server to store in database
# -----------------------------------------------------------------------------------------


import requests
from datetime import datetime


server_ip = "deep-learning-celestica-senai.onrender.com"
url = f"https://{server_ip}/final" 


image_path = "ANDELI_DZ47_63_4000A_S02_C02_FAIL_01.jpg"


metadata = {
    "product_code": "ANDELI_DZ47_63",
    "production_line": "Line_01",
    "line_station": "Station_02",
    "production_shift": "Shift_C",
    "component_number": "Component_02",
    "operator_id": "OP_98",
    "current_datetime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "device_id": "Android_Device_01",
    "machine_prediction": "fail",
    "human_prediction": "fail"
}


def send_image_metadata():
    try:
        with open(image_path, 'rb') as f:
            files = {'file': f}
            
            print(f"Sending data and {image_path} to {url}...")
            response = requests.post(url, files=files, data=metadata)
            
            if response.status_code == 200:
                print("Success!")
                print("Server response:", response.json())
            else:
                print(f"Failed with status code: {response.status_code}")
                print(response.text)
                
    except FileNotFoundError:
        print("Error: The image file was not found.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    send_image_metadata()
