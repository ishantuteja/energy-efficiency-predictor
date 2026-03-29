import joblib
import pandas as pd

# Load the trained Random Forest model
rf_model = joblib.load('rf_model.pkl')

# Extract feature importances from the model
importances = rf_model.feature_importances_

feature_names = [
    'Relative Compactness',
    'Surface Area',
    'Wall Area',
    'Roof Area',
    'Overall Height',
    'Orientation',
    'Glazing Area',
    'Glazing Area Dist'
]

# Display as a ranked table
importance_df = pd.DataFrame({'Feature': feature_names, 'Importance': importances})
print("\n--- FEATURE IMPORTANCE ---")
print(importance_df.sort_values(by='Importance', ascending=False).to_string(index=False))
print("--------------------------\n")
