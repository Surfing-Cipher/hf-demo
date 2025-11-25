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
    if (!token) {
        throw new Error("Please enter your Hugging Face API Token in the top field.");
    }

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
        throw new Error(error.error || `API Request Failed: ${response.statusText}`);
    }

    return await response.json();
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
        const summary = result[0].summary_text;
        summaryResult.innerHTML = `<div class="generated-summary">${summary}</div>`;
    } catch (err) {
        console.error(err);
        summaryResult.innerHTML = `<div class="placeholder-text" style="color: #ef4444;">Error: ${err.message}</div>`;
    } finally {
        setLoading(summarizeBtn, false);
    }
});
