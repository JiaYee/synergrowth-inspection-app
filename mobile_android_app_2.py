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


image_path = "junction_box_a_station_2_component_1_08.jpg"


metadata = {
    "product_code": "AC_Box_A",
    "production_line": "Line_1",
    "line_station": "Station_2",
    "component_number": "Comp_1",
    "operator_id": "OP_99",
    "current_datetime": datetime.now().strftime("%Y-%m-%d %H:%M:%S"),
    "device_id": "Android_Device_01",
    "machine_prediction": "fail",
    "human_prediction": "pass"
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
