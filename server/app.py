from flask import Flask, request, jsonify #jsonify to json(javascript obejct notation) format
import traceback  #to trace exceptions
import numpy as np #mathematical operations
import joblib #load the model
import os #to interact with os

app = Flask(__name__) #making app as an instance of class

# Loading pre-trained model
model_path = os.path.join(os.path.dirname(__file__), '../models/hyper_model1.pkl')
model = joblib.load(model_path) 

# Define the expected number of features
EXPECTED_FEATURES = 21

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()

        # Extract input_data from the request JSON
        input_data = data.get('input_data')

        # Check if input_data is a list and has the expected number of features
        if not isinstance(input_data, list) or len(input_data) != EXPECTED_FEATURES:
            raise ValueError(f"Invalid number of features. Expected {EXPECTED_FEATURES}.")

        # Perform prediction
        result = model.predict(np.array(input_data).reshape(1, -1)) #convert 1d to 2d for scikit-learn
        prediction = result[0]

        # Print debug information
        print("Debug Info:")
        print("Input Data:", input_data)
        print("Prediction Result:", prediction)

        # Return the prediction in the response
        return jsonify({'prediction': int(prediction), 'message': 'Success'}) #coverting the result to json and send to client

    except ValueError as ve:
        print(f"ValueError: {str(ve)}")
        return jsonify({'prediction': None, 'message': str(ve)}), 400

    except Exception as e:
        print(f"Error: {e}")
        traceback.print_exc()  # Print the traceback
        return jsonify({'prediction': None, 'message': 'Error'}), 500

if __name__ == '__main__':
    app.run(debug=True)