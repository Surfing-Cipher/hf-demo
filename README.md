# Hugging Face API Demo 🤖

A modern web application showcasing **Sentiment Analysis** and **Text Summarization** using Hugging Face's Inference API.

![AI Nexus](https://img.shields.io/badge/Powered%20by-Hugging%20Face-yellow)
![Node.js](https://img.shields.io/badge/Node.js-18%2B-green)
![License](https://img.shields.io/badge/License-MIT-blue)

## 🌟 Features

### 1. Sentiment Analysis
- Analyzes text to determine if it's **positive** or **negative**
- Uses `distilbert-base-uncased-finetuned-sst-2-english` model
- Returns confidence score with visual feedback (emoji + color-coded)

### 2. Text Summarization
- Condenses long paragraphs into concise summaries
- Uses Facebook's `bart-large-cnn` model
- Maintains key information while reducing length

## 🚀 Live Demo

**[View Live Demo](https://your-railway-url-here.up.railway.app)** *(Replace with your actual Railway URL)*

## 🛠️ Tech Stack

- **Frontend**: HTML, CSS (Vanilla with Glassmorphism), JavaScript
- **Backend**: Node.js with Express-like HTTP server
- **API**: Hugging Face Inference API via `@huggingface/inference` SDK
- **Deployment**: Railway (Free Tier)

## 📋 Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- [Hugging Face Account](https://huggingface.co/join) (Free)
- Hugging Face API Token ([Get it here](https://huggingface.co/settings/tokens))

## 🏃‍♂️ Local Development

1. **Clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/hf-demo.git
   cd hf-demo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   node server-sdk.js
   ```

5. **Open in browser**
   - Navigate to `http://localhost:3000`
   - Enter your Hugging Face API token
   - Start testing!

## 🎯 Usage

### Getting Your API Token
1. Go to [Hugging Face Settings](https://huggingface.co/settings/tokens)
2. Click **"Create new token"**
3. Select **"Read"** permissions
4. Copy the token (starts with `hf_...`)

### Testing Sentiment Analysis
Try these examples:
- **Positive**: *"I absolutely love this product! It exceeded all my expectations."*
- **Negative**: *"This is the worst experience I've ever had."*

### Testing Summarization
Paste any long article or paragraph to get a concise summary.

## 📁 Project Structure

```
hf-demo/
├── index.html          # Main HTML structure
├── style.css           # Glassmorphism UI styles
├── app.js              # Frontend JavaScript
├── server-sdk.js       # Node.js proxy server
├── package.json        # Dependencies & scripts
└── README.md           # This file
```

## 🌐 Deployment

This app is deployed on [Railway](https://railway.app). To deploy your own:

1. Push to GitHub
2. Connect repository to Railway
3. Railway auto-detects Node.js and deploys
4. Get your public URL from Railway dashboard

## 🔧 API Models Used

| Feature | Model | Provider |
|---------|-------|----------|
| Sentiment Analysis | `distilbert-base-uncased-finetuned-sst-2-english` | Hugging Face |
| Text Summarization | `facebook/bart-large-cnn` | Meta AI |

## 🎨 Design Features

- **Glassmorphism UI** with backdrop blur effects
- **Animated background blobs** with smooth floating animations
- **Color-coded sentiment** results (Green = Positive, Red = Negative)
- **Responsive design** works on all devices
- **Loading states** with animated spinners

## ⚠️ Known Limitations

- **Free Tier Limits**: Hugging Face free tier has rate limits
- **Cold Starts**: Railway free tier may sleep after inactivity (~30s wake time)
- **Image Generation**: Not available on free tier (switched to Sentiment Analysis)

## 🤝 Contributing

Feel free to fork this project and submit pull requests!

## 📝 License

MIT License - feel free to use this for learning and presentations.

## 🙏 Acknowledgments

- [Hugging Face](https://huggingface.co) for the amazing API
- [Railway](https://railway.app) for free hosting
- AI/ML community for open-source models

## 📧 Contact

Created for a lab presentation - Thursday Demo

---

**⭐ If you found this helpful, consider starring the repo!**
