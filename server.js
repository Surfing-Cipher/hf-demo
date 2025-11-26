const http = require("http");
const fs = require("fs");
const path = require("path");
const https = require("https");

const PORT = 3000;

const MIME_TYPES = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "text/javascript",
  ".png": "image/png",
  ".jpg": "image/jpeg",
};

const server = http.createServer((req, res) => {
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
    if (!model) {
      res.writeHead(400);
      res.end("Missing model parameter");
      return;
    }

    const hfUrl = `https://router.huggingface.co/${model}`;
    console.log(`Proxying to: ${hfUrl}`);

    // Forward headers (especially Authorization)
    const headers = {
      "Content-Type": "application/json",
      Authorization: req.headers["authorization"],
    };

    const proxyReq = https.request(
      hfUrl,
      {
        method: "POST",
        headers: headers,
      },
      (proxyRes) => {
        res.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(res);

        // Log error body for debugging
        if (proxyRes.statusCode >= 400) {
          let body = "";
          proxyRes.on("data", (chunk) => (body += chunk));
          proxyRes.on("end", () =>
            console.log(`API Error (${proxyRes.statusCode}): ${body}`)
          );
        }
      }
    );

    proxyReq.on("error", (e) => {
      console.error(e);
      res.writeHead(500);
      res.end(e.message);
    });

    req.pipe(proxyReq);
    return;
  }

  // Serve Static Files
  let filePath = "." + req.url;
  if (filePath === "./") filePath = "./index.html";

  // Remove query params for file lookup
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
  console.log(`Proxy endpoint ready at http://localhost:${PORT}/api/proxy`);
});
