# AI Nexus - Hugging Face API Demo 🤖

A modern web application demonstrating **Sentiment Analysis** and **Text Summarization** using Hugging Face's AI models.

## 🌟 Live Demo

**🔗 [Live Demo on Railway](YOUR_RAILWAY_URL_HERE)**

![Positive Sentiment](/C:/Users/user/.gemini/antigravity/brain/a8f6e577-bbe4-49a0-8cee-c82b1a509e3b/uploaded_image_0_1764157574128.png)

## ✨ Features

### 1. **Sentiment Analysis** 😊😞
Analyzes text to determine positive or negative sentiment with confidence scores.

- **Model**: `distilbert-base-uncased-finetuned-sst-2-english`
- **Visual Feedback**: Emoji + color-coded results
- **Real-time**: Instant analysis with loading states

**Examples:**
- "I love this" → 😊 POSITIVE (100.0%)
- "terrible product" → 😞 NEGATIVE (98.0%)

![Negative Sentiment](/C:/Users/user/.gemini/antigravity/brain/a8f6e577-bbe4-49a0-8cee-c82b1a509e3b/uploaded_image_1_1764157574128.png)

### 2. **Text Summarization** 📝
Condenses long articles into concise summaries while preserving key information.

- **Model**: `facebook/bart-large-cnn`
- **Smart**: Configurable summary length
- **Accurate**: Maintains context and meaning

## 🎨 Design

- **Glassmorphism UI** with backdrop blur effects
- **Animated Background** with floating gradient blobs
- **Responsive Design** works on all devices
- **Premium Feel** with smooth transitions

## 🚀 Quick Start

### Prerequisites
- Node.js v18 or higher
- Hugging Face API Token ([Get one free](https://huggingface.co/settings/tokens))

### Local Setup

```bash
# Clone the repository
git clone https://github.com/Surfing-Cipher/hf-demo.git
cd hf-demo

# Install dependencies
npm install

# Start the server
npm start

# Open in browser
http://localhost:3000
```

### Using the App

1. **Enter your Hugging Face API Token** in the top input field
2. **Choose a feature** from the tabs (Sentiment Analysis or Summarization)
3. **Enter your text** and click the button
4. **View results** with beautiful visual feedback

## 🛠️ Tech Stack

| Component | Technology |
|-----------|-----------|
| **Frontend** | HTML, CSS (Glassmorphism), Vanilla JavaScript |
| **Backend** | Node.js (HTTP server) |
| **AI/ML** | Hugging Face Inference API v4.13.4 |
| **Deployment** | Railway |
| **Models** | DistilBERT (Sentiment), BART-Large (Summarization) |

## 📁 Project Structure

```
hf-demo/
├── index.html           # Main UI
├── style.css            # Glassmorphism design
├── app.js               # Frontend logic + fallback mode
├── server-sdk.js        # Node.js proxy server
├── package.json         # Dependencies
└── README.md            # This file
```

## 🔧 How It Works

```
User Input → Browser → Node.js Server → Hugging Face API → AI Model (GPU) → Results
```

The Node.js proxy server handles:
- CORS restrictions
- API token security
- Error handling with fallback mode

## 🎯 Demo Fallback Mode

The app includes a **smart fallback system** that:
- ✅ Automatically detects API failures
- ✅ Switches to simulated responses
- ✅ Ensures demos never fail
- ✅ Simulates realistic delays

This guarantees reliable demonstrations even during API outages.

## 🚢 Deployment

### Railway (Recommended)

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push
   ```

2. **Deploy to Railway**
   - Go to [Railway.app](https://railway.app)
   - Connect your GitHub repository
   - Railway auto-deploys on every push

3. **Done!** Get your public URL and share

## 🔑 Environment Variables

No environment variables needed! The API token is entered by users in the browser for security.

## 📊 Example Use Cases

### Sentiment Analysis
- **Social Media Monitoring**: Track brand sentiment
- **Customer Feedback**: Analyze reviews automatically
- **Market Research**: Understand public opinion

### Text Summarization
- **News Aggregation**: Summarize articles
- **Research**: Condense academic papers
- **Meeting Notes**: Generate key takeaways

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| **Server won't start** | Make sure you're in `hf-demo` directory |
| **Port 3000 in use** | Kill the process or change port in `server-sdk.js` |
| **API errors** | Check your HF token has "Read" permissions |
| **Fallback mode activating** | Your token may have hit rate limits |

## 📝 License

MIT License - feel free to use for learning and presentations!

## 👨‍💻 Author

Created for a Hugging Face API demonstration project.

**GitHub**: [Surfing-Cipher](https://github.com/Surfing-Cipher)

---

**⭐ If this helped you, consider starring the repo!**

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co) for amazing AI models
- [Railway](https://railway.app) for free hosting
- Open-source AI/ML community
