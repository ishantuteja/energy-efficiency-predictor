/* ═══════════════════════════════════════════════════════════
   app.js — Dashboard Logic
   Energy Efficiency Predictor
   - Feature Importance Chart (Chart.js)
   - Prediction Form (Fetch API → Flask /predict)
═══════════════════════════════════════════════════════════ */

/* ── FEATURE IMPORTANCE CHART ─────────────────────────────
   Real importances extracted from rf_model.pkl via joblib.
   See check_features.py for the extraction script.
──────────────────────────────────────────────────────────── */
(function initFeatureChart() {
    const features = [
        'Relative Compactness',
        'Overall Height',
        'Surface Area',
        'Roof Area',
        'Glazing Area',
        'Wall Area',
        'Glazing Area Dist',
        'Orientation',
    ];

    // Importance values sorted descending (source: rf_model.pkl)
    const importances = [0.4665, 0.1991, 0.1444, 0.0659, 0.0655, 0.0389, 0.0134, 0.0062];

    const ctx = document.getElementById('featureChart').getContext('2d');

    // Cyan → Purple gradient per bar
    const gradients = importances.map(() => {
        const g = ctx.createLinearGradient(0, 0, 600, 0);
        g.addColorStop(0, 'rgba(79,  172, 254, 0.90)');
        g.addColorStop(1, 'rgba(161, 140, 209, 0.70)');
        return g;
    });

    new Chart(ctx, {
        type: 'bar',
        data: {
            labels: features,
            datasets: [{
                label: 'Importance Score',
                data: importances,
                backgroundColor: gradients,
                borderColor: 'transparent',
                borderRadius: 6,
                borderSkipped: false,
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: true,
            plugins: {
                legend: { display: false },
                tooltip: {
                    backgroundColor: 'rgba(19, 25, 45, 0.95)',
                    borderColor: 'rgba(79, 172, 254, 0.3)',
                    borderWidth: 1,
                    titleColor: '#e8eaf0',
                    bodyColor: '#8890a8',
                    padding: 12,
                    callbacks: {
                        label: ctx => ` ${(ctx.parsed.x * 100).toFixed(2)}%`
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255,255,255,0.04)' },
                    border: { color: 'transparent' },
                    ticks: {
                        color: '#555f7a',
                        font: { family: 'Inter', size: 11 },
                        callback: v => `${(v * 100).toFixed(0)}%`
                    }
                },
                y: {
                    grid: { display: false },
                    border: { color: 'transparent' },
                    ticks: {
                        color: '#8890a8',
                        font: { family: 'Inter', size: 12, weight: '500' },
                    }
                }
            },
            animation: {
                duration: 1000,
                easing: 'easeOutQuart',
            }
        }
    });
})();


/* ── PREDICTION FORM ──────────────────────────────────────
   Collects 8 building parameter inputs, POSTs to the
   Flask /predict endpoint, and renders the results.
──────────────────────────────────────────────────────────── */
document.getElementById('prediction-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const btn       = document.getElementById('submit-btn');
    const btnText   = btn.querySelector('.btn-text');
    const errorMsg  = document.getElementById('error-msg');
    const resultsEl = document.getElementById('results');

    // Loading state
    btn.classList.add('loading');
    btnText.textContent    = 'Processing…';
    errorMsg.style.display = 'none';
    resultsEl.style.display = 'none';

    const payload = {
        relative_compactness:      parseFloat(document.getElementById('relative_compactness').value),
        surface_area:              parseFloat(document.getElementById('surface_area').value),
        wall_area:                 parseFloat(document.getElementById('wall_area').value),
        roof_area:                 parseFloat(document.getElementById('roof_area').value),
        overall_height:            parseFloat(document.getElementById('overall_height').value),
        orientation:               parseFloat(document.getElementById('orientation').value),
        glazing_area:              parseFloat(document.getElementById('glazing_area').value),
        glazing_area_distribution: parseFloat(document.getElementById('glazing_area_distribution').value),
    };

    try {
        const response = await fetch('http://127.0.0.1:5000/predict', {
            method:  'POST',
            headers: { 'Content-Type': 'application/json' },
            body:    JSON.stringify(payload),
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || 'Failed to process prediction request.');
        }

        document.getElementById('heating-result').textContent = data.heating_load.toFixed(2);
        document.getElementById('cooling-result').textContent = data.cooling_load.toFixed(2);

        // Re-trigger slide-up animation
        resultsEl.style.animation = 'none';
        requestAnimationFrame(() => {
            resultsEl.style.animation = '';
            resultsEl.style.display   = 'block';
        });

    } catch (err) {
        let msg = err.message;
        if (err.message === 'Failed to fetch') {
            msg = 'Cannot connect to the model server. Make sure app.py is running on port 5000.';
        }
        errorMsg.textContent    = msg;
        errorMsg.style.display  = 'block';
    } finally {
        btn.classList.remove('loading');
        btnText.textContent = 'Predict Efficiency';
    }
});
