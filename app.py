from flask import Flask, request, jsonify
from flask_cors import CORS
import joblib
import numpy as np
import os

app = Flask(__name__)
CORS(app)

# Load the trained model
MODEL_PATH = 'rf_model.pkl'
try:
    if os.path.exists(MODEL_PATH):
        model = joblib.load(MODEL_PATH)
        print("Model loaded successfully.")
    else:
        print(f"Model file not found at {MODEL_PATH}")
        model = None
except Exception as e:
    print(f"Error loading model: {e}")
    model = None

@app.route('/predict', methods=['POST'])
def predict():
    if not model:
        return jsonify({"error": "Model not loaded. Please ensure rf_model.pkl is in the same directory."}), 500

    try:
        data = request.json
        
        # Extract 8 features required by the Random Forest model
        # 1. Relative Compactness
        # 2. Surface Area
        # 3. Wall Area
        # 4. Roof Area
        # 5. Overall Height
        # 6. Orientation
        # 7. Glazing Area
        # 8. Glazing Area Distribution
        
        features = [
            float(data.get('relative_compactness', 0)),
            float(data.get('surface_area', 0)),
            float(data.get('wall_area', 0)),
            float(data.get('roof_area', 0)),
            float(data.get('overall_height', 0)),
            float(data.get('orientation', 0)),
            float(data.get('glazing_area', 0)),
            float(data.get('glazing_area_distribution', 0))
        ]
        
        # Reshape for single prediction [1, 8]
        features_array = np.array(features).reshape(1, -1)
        
        # Predict uses the 8 features to output the target variables
        prediction = model.predict(features_array)
        
        # Multi-output Random Forest yields shape (1, 2)
        heating_load = float(prediction[0][0])
        cooling_load = float(prediction[0][1])
        
        return jsonify({
            "heating_load": round(heating_load, 2),
            "cooling_load": round(cooling_load, 2)
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == '__main__':
    # Run the server on port 5000
    app.run(debug=True, port=5000)
