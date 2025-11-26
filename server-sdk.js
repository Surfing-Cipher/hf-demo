const http = require("http");
const fs = require("fs");
const path = require("path");
const { HfInference } = require("@huggingface/inference");
const PORT = 3000;
const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};
const server = http.createServer(async (req, res) => {
  console.log(`${req.method} ${req.url}`);
  // Handle API Proxy
  if (req.url.startsWith("/api/proxy")) {
    if (req.method !== "POST") {
      res.writeHead(405);
      res.end("Method Not Allowed");
      return;
    }
    const model = new URL(
      req.url,
      `http://${req.headers.host}`
    ).searchParams.get("model");
    const token = req.headers["authorization"]?.replace("Bearer ", "");

    if (!model || !token) {
      res.writeHead(400);
      res.end(JSON.stringify({ error: "Missing model or token" }));
      return;
    }
    // Collect request body
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", async () => {
      try {
        const data = JSON.parse(body);
        const hf = new HfInference(token);

        console.log(`Processing model: ${model}`);

        // Handle different model types
        if (model.includes("sst-2") || model.includes("sentiment")) {
          // Sentiment analysis
          const result = await hf.textClassification({
            model: model,
            inputs: data.inputs,
          });

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify([result]));
        } else {
          // Text summarization
          const result = await hf.summarization({
            model: model,
            inputs: data.inputs,
            parameters: data.parameters,
          });

          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify([result]));
        }
      } catch (err) {
        console.error("API Error:", err.message);
        res.writeHead(500);
        res.end(JSON.stringify({ error: err.message }));
      }
    });
    return;
  }
  // Serve Static Files
  let filePath = "." + req.url;
  if (filePath === "./") filePath = "./index.html";

  filePath = filePath.split("?")[0];
  const extname = path.extname(filePath);
  const contentType = MIME_TYPES[extname] || "application/octet-stream";
  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === "ENOENT") {
        res.writeHead(404);
        res.end("File Not Found");
      } else {
        res.writeHead(500);
        res.end("Server Error: " + error.code);
      }
    } else {
      res.writeHead(200, { "Content-Type": contentType });
      res.end(content, "utf-8");
    }
  });
});
server.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}/`);
  console.log(`Using official Hugging Face SDK`);
});
