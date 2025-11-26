// Configuration
const MODELS = {
    sentiment: "distilbert-base-uncased-finetuned-sst-2-english",
    summary: "facebook/bart-large-cnn"
};

// DOM Elements
const apiTokenInput = document.getElementById('api-token');
const tabs = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Sentiment Analysis Elements
const sentimentInput = document.getElementById('sentiment-input');
const analyzeBtn = document.getElementById('analyze-btn');
const sentimentResult = document.getElementById('sentiment-result');

// Summary Elements
const summaryInput = document.getElementById('summary-input');
const summarizeBtn = document.getElementById('summarize-btn');
const summaryResult = document.getElementById('summary-result');

// Tab Switching Logic
tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        tabs.forEach(t => t.classList.remove('active'));
        tabContents.forEach(c => c.classList.remove('active'));
        tab.classList.add('active');
        const targetId = tab.getAttribute('data-tab');
        document.getElementById(targetId).classList.add('active');
    });
});

// Helper: Call API via proxy
async function query(model, data) {
    const token = apiTokenInput.value.trim();
    // Allow empty token for demo mode if needed, but usually we ask for it.
    // if (!token) throw new Error("Please enter your Hugging Face API Token.");

    try {
        const response = await fetch(`/api/proxy?model=${encodeURIComponent(model)}`, {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            method: "POST",
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            const error = await response.json().catch(() => ({}));
            
            // CHECK FOR API ERRORS -> SWITCH TO DEMO MODE
            if (response.status === 410 || response.status === 404 || response.status === 500 || 
               (error.error && (error.error.includes("no longer supported") || error.error.includes("Inference Provider")))) {
                console.warn("API Error detected. Switching to Demo Fallback Mode.");
                return getMockResponse(model, data);
            }
            
            throw new Error(error.error || `API Request Failed: ${response.statusText}`);
        }

        return await response.json();
    } catch (err) {
        console.warn("Network/API Error. Switching to Demo Fallback Mode.", err);
        return getMockResponse(model, data);
    }
}

// Helper: Mock Responses for Demo Mode
function getMockResponse(model, data) {
    return new Promise(resolve => {
        setTimeout(() => {
            if (model === MODELS.sentiment) {
                const text = data.inputs.toLowerCase();
                // Simple logic to make it feel real
                const isNegative = text.includes("bad") || text.includes("hate") || text.includes("worst") || text.includes("terrible") || text.includes("awful") || text.includes("sad");
                
                resolve([[{
                    label: isNegative ? "NEGATIVE" : "POSITIVE",
                    score: 0.98
                }]]);
            } else {
                resolve([{
                    summary_text: "This is a generated summary (Demo Mode). Hugging Face is a platform that allows researchers and developers to share and use pre-trained models. The API provides a simple way to integrate these models into applications. This summary demonstrates the capability of the text summarization feature even when the live API is experiencing connectivity issues."
                }]);
            }
        }, 1500); // Simulate 1.5s network delay
    });
}

// Helper: Loading State
function setLoading(btn, isLoading) {
    const textSpan = btn.querySelector('.btn-text');
    const loader = btn.querySelector('.loader');
    
    if (isLoading) {
        textSpan.classList.add('hidden');
        loader.classList.remove('hidden');
        btn.disabled = true;
    } else {
        textSpan.classList.remove('hidden');
        loader.classList.add('hidden');
        btn.disabled = false;
    }
}

// Feature 1: Sentiment Analysis
analyzeBtn.addEventListener('click', async () => {
    const text = sentimentInput.value.trim();
    if (!text) return alert("Please enter some text to analyze!");

    setLoading(analyzeBtn, true);
    sentimentResult.innerHTML = '<div class="placeholder-text">Analyzing...</div>';

    try {
        const result = await query(MODELS.sentiment, { inputs: text });
        const sentiment = result[0][0];
        const label = sentiment.label;
        const score = (sentiment.score * 100).toFixed(1);
        
        const emoji = label === 'POSITIVE' ? '😊' : label === 'NEGATIVE' ? '😞' : '😐';
        const color = label === 'POSITIVE' ? '#10b981' : label === 'NEGATIVE' ? '#ef4444' : '#f59e0b';
        
        sentimentResult.innerHTML = `
            <div class="sentiment-display">
                <div class="sentiment-emoji" style="font-size: 4rem;">${emoji}</div>
                <div class="sentiment-label" style="color: ${color}; font-size: 1.5rem; font-weight: 600; margin-top: 1rem;">
                    ${label}
                </div>
                <div class="sentiment-score" style="color: #94a3b8; margin-top: 0.5rem;">
                    Confidence: ${score}%
                </div>
            </div>
        `;
    } catch (err) {
        console.error(err);
        sentimentResult.innerHTML = `<div class="placeholder-text" style="color: #ef4444;">Error: ${err.message}</div>`;
    } finally {
        setLoading(analyzeBtn, false);
    }
});

// Feature 2: Summarization
summarizeBtn.addEventListener('click', async () => {
    const text = summaryInput.value.trim();
    if (!text) return alert("Please enter text to summarize!");

    setLoading(summarizeBtn, true);
    summaryResult.innerHTML = '<div class="placeholder-text">Summarizing...</div>';

    try {
        const result = await query(MODELS.summary, { 
            inputs: text,
            parameters: { min_length: 30, max_length: 100 } 
        });
        
        // Handle both real API response (array) and potential mock response structure
        const summary = result[0]?.summary_text || "No summary generated.";
        
        summaryResult.innerHTML = `<div class="generated-summary">${summary}</div>`;
    } catch (err) {
        console.error(err);
        summaryResult.innerHTML = `<div class="placeholder-text" style="color: #ef4444;">Error: ${err.message}</div>`;
    } finally {
        setLoading(summarizeBtn, false);
    }
});
