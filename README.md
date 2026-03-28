# Energy Efficiency Predictor

A full-stack machine learning web application that predicts the **Heating Load** and **Cooling Load** of residential buildings based on 8 architectural parameters. Built with a trained Random Forest model, a Flask REST API backend, and a premium dark-mode dashboard frontend.

---

## 📊 Dataset

The model was trained on the **UCI Energy Efficiency Dataset** (`ENB2012_data.xlsx`), which contains 768 building samples described by 8 features:

| Feature | Unit | Description |
|---|---|---|
| Relative Compactness | Ratio | Volume to surface ratio |
| Surface Area | m² | Total exterior surface area |
| Wall Area | m² | Total wall surface area |
| Roof Area | m² | Total roof surface area |
| Overall Height | m | Building height |
| Orientation | Class (2–5) | N / E / S / W |
| Glazing Area | Ratio | % of floor area that is glazing |
| Glazing Area Distribution | Class (0–5) | Glazing distribution pattern |

**Target variables:** Heating Load (Y1) and Cooling Load (Y2) in kWh/m²

---

## 🤖 Model Performance

| Metric | Score |
|---|---|
| Algorithm | Random Forest Regressor |
| R² Score | ~0.98 |
| Output | Multi-output (Y1 + Y2 simultaneously) |

---

## 🗂️ Project Structure

```
Energy Efficiency project/
├── ENB2012_data.xlsx       # Raw UCI dataset
├── EnergyEfficiency.ipynb  # EDA, training, and evaluation notebook
├── rf_model.pkl            # Trained Random Forest model (joblib)
├── check_features.py       # Feature importance extraction script
├── app.py                  # Flask REST API backend
├── requirements.txt        # Python dependencies
├── index.html              # Dashboard HTML structure
├── style.css               # Midnight Luxury dark theme
└── app.js                  # Chart.js + Fetch API logic
```

---

## 🚀 Local Setup

### 1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/energy-efficiency-predictor.git
cd energy-efficiency-predictor
```

### 2. Install Python dependencies
```bash
pip install -r requirements.txt
```

### 3. Start the Flask API server
```bash
python app.py
```
The server will start at `http://127.0.0.1:5000`

### 4. Open the Dashboard
In a new terminal window:
```bash
open index.html
```
Or drag `index.html` into your browser.

---

## 📡 API Reference

### `POST /predict`

**Request Body (JSON):**
```json
{
  "relative_compactness": 0.74,
  "surface_area": 686.0,
  "wall_area": 245.0,
  "roof_area": 220.5,
  "overall_height": 3.5,
  "orientation": 4,
  "glazing_area": 0.25,
  "glazing_area_distribution": 3
}
```

**Response (JSON):**
```json
{
  "heating_load": 21.34,
  "cooling_load": 24.87
}
```

---

## 🎨 Tech Stack

| Layer | Technology |
|---|---|
| Model | scikit-learn RandomForestRegressor |
| Backend | Python, Flask, Flask-CORS, joblib |
| Frontend | HTML5, Vanilla CSS, Vanilla JS |
| Charts | Chart.js v4 |
| Fonts | Google Fonts (Playfair Display + Inter) |
