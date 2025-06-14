from flask import Flask, request, jsonify
import traceback
import numpy as np
import joblib
import os

app = Flask(__name__)

# Load the trained model
model_path = os.path.join(os.path.dirname(__file__), 'model.pkl')
model = joblib.load(model_path)

# Expected number of features
EXPECTED_FEATURES = 21

@app.route('/predict', methods=['POST'])
def predict():
    try:
        data = request.get_json()
        input_data = data.get('input_data')

        # ✅ Validate input
        if not isinstance(input_data, list):
            raise ValueError("Input data should be a list.")
        if len(input_data) != EXPECTED_FEATURES:
            raise ValueError(f"Expected {EXPECTED_FEATURES} features, but got {len(input_data)}.")

        # ✅ Perform prediction
        result = model.predict(np.array(input_data).reshape(1, -1))

        # ✅ Safely convert result to plain integer
        prediction_value = int(result.item()) if hasattr(result, 'item') else int(result[0])

        # 🪵 Debug info
        print("Debug Info:")
        print("Input Data:", input_data)
        print("Prediction Result:", prediction_value)

        # ✅ Return safe response
        return jsonify({
            'prediction': prediction_value,
            'message': 'Success'
        })

    except ValueError as ve:
        print(f"[ValueError] {ve}")
        return jsonify({
            'prediction': None,
            'message': str(ve)
        }), 400

    except Exception as e:
        print(f"[Error] {e}")
        traceback.print_exc()
        return jsonify({
            'prediction': None,
            'message': 'Internal server error'
        }), 500



if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)