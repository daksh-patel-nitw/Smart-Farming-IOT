from flask import Flask, jsonify, request
import requests
from flask_cors import CORS

app = Flask(__name__)
first_request_received = False
CORS(app)

class ConsoleColors:
    RED = '\033[91m'
    GREEN = '\033[92m'
    YELLOW = '\033[93m'
    RESET = '\033[0m'

def calculate_median(data):
    # Sort the data
    sorted_data = sorted(data)
    n = len(sorted_data)
    
    # Check if the number of elements is odd or even
    if n % 2 == 1:
        # If odd, return the middle element
        return sorted_data[n // 2]
    else:
        # If even, return the average of the two middle elements
        mid1 = sorted_data[n // 2 - 1]
        mid2 = sorted_data[n // 2]
        return (mid1 + mid2) / 2
    
def get_sensor_data(link, fetched_data):
    try:
        response = requests.get(link)
        if response.status_code == 200:
            # Assuming the response contains the data in the specified format
            data = response.text
            print(data)
            for i, pair in enumerate(data.split(" ")):
                value = pair.split(":")[1]
                print(pair,"->", value)
                fetched_data[i].append(int(value))
            print("returning")
            return 1
        else:
            return 0
    except Exception as e:
        return 0

def enroll_admin():
    try:
        response = requests.get('http://localhost:3051/enrollAdmin')
        if response.status_code == 200:
            print("Admin enrolled successfully")
        else:
            print("Failed to enroll admin")
    except Exception as e:
        print("Failed to enroll admin:", str(e))
        
@app.route('/')
def index():
    global first_request_received
    if first_request_received:
        enroll_admin()
        first_request_received = True
    fetched_data = [[], [], [], [], [],[],[]]
    links = [
        "http://[aaaa::212:7402:2:202]",
        "http://[aaaa::212:7403:3:303]",
        "http://[aaaa::212:7404:4:404]",
        "http://[aaaa::212:7405:5:505]",
        "http://[aaaa::212:7406:6:606]",
    ]
    
    sensor_health = []
    for link in links:
        if get_sensor_data(link, fetched_data):
            print("here")
            sensor_health.append(1)
        else:
            sensor_health.append(0)
            print("in else")
    if all(sensor == 0 for sensor in sensor_health):
        return jsonify({'error': 'All sensors are down'}), 400
    
    key = ["ph", "temperature", "turbudity", "ammonia", "oxygen","moisture", "humidity"]
    final_data = {}
    for i in range(7):
        x = fetched_data[i]
        if x:
            if len(x) == len(set(x)):
                temp = calculate_median(x)
                if key[i] =="oxygen":
                    temp = round((temp + 0.5378) / 1.73, 2)
                elif key[i]== "ammonia":
                    temp=round(temp/1.73+.154)
                final_data[key[i]] = temp
            else:
                temp = max(x, key=x.count)
                if key[i] =="oxygen":
                    temp = round((temp + 0.5378) / 1.73, 2)
                elif key[i]== "ammonia":
                    temp=round(temp/1.73+.154)
                final_data[key[i]] = temp
    final_data["sensor_health"]=sensor_health
    return jsonify(final_data)

@app.route('/sendAccutatorSignal', methods=['POST'])
def send_accutator_signal():
    if request.method == 'POST':
        # Assuming the data is sent as JSON
        data = request.json
        print(f"{ConsoleColors.YELLOW}\n ACTUATOR ACTION: {data['signal_type']} switched on for {data['duration']}\n{ConsoleColors.RESET}")
        # Here you can add code to handle the received data and send signals to actuators
        return jsonify({'message': 'Signal sent successfully'}), 200
    else:
        return jsonify({'error': 'Only POST requests are allowed'}), 405
    
if __name__ == '__main__':
    app.run(debug=True, port=12345)
