
# -------------------------------------------------------------------------------------------------------------
# This code will simulate:
# [a] Operator enter metadata on Android mobile app
# [b] App tell operator what component to take picture
# [c] Operator take picture of component
# [d] Operator click to send picture of component to deep learning model in server to classify into pass or fail
# [e] Server will reply with pass or fail
# --------------------------------------------------------------------------------------------------------------


import requests


server_ip = "deep-learning-celestica-senai.onrender.com"
url = f"https://{server_ip}/predict"


image_path = "ANDELI_DZ47_63_4000A_S02_C02_FAIL_01.jpg"
# image_path = "ANDELI_DZ47_63_4000A_S02_C02_FAIL_07.jpg"
# image_path = "ANDELI_DZ47_63_4000A_S02_C02_FAIL_13.jpg"
# image_path = "ANDELI_DZ47_63_4000A_S02_C02_PASS_01.jpg"
# image_path = "ANDELI_DZ47_63_4000A_S02_C02_PASS_04.jpg"
# image_path = "ANDELI_DZ47_63_4000A_S02_C02_PASS_10.jpg"


def send_image():
    try:
        with open(image_path, 'rb') as f:
            files = {'file': f}
            
            print(f"Sending {image_path} to {url}...")
            response = requests.post(url, files=files)
            
            if response.status_code == 200:
                print("Success!")
                print("Server response:", response.text)
            else:
                print(f"Failed with status code: {response.status_code}")
                print(response.text)
                
    except FileNotFoundError:
        print("Error: The image file was not found.")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    send_image()
