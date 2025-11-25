const http = require('http');
const fs = require('fs');
const path = require('path');
const https = require('https');

const PORT = 3000;

const MIME_TYPES = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'text/javascript',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
};

const server = http.createServer(async (req, res) => {
    console.log(`${req.method} ${req.url}`);

    // Handle API Proxy
    if (req.url.startsWith('/api/proxy')) {
        if (req.method !== 'POST') {
            res.writeHead(405);
            res.end('Method Not Allowed');
            return;
        }

        const model = new URL(req.url, `http://${req.headers.host}`).searchParams.get('model');
        const token = req.headers['authorization']?.replace('Bearer ', '');
        
        if (!model || !token) {
            res.writeHead(400);
            res.end(JSON.stringify({ error: 'Missing model or token' }));
            return;
        }

        // Collect request body
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', async () => {
            try {
                const data = JSON.parse(body);
                
                // Use the NEW router endpoint
                const hfUrl = `https://api-inference.huggingface.co/models/${model}`;
                console.log(`Proxying to: ${hfUrl}`);
                
                const options = {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                };

                const proxyReq = https.request(hfUrl, options, (proxyRes) => {
                    let responseData = '';
                    
                    proxyRes.on('data', chunk => {
                        responseData += chunk;
                    });
                    
                    proxyRes.on('end', () => {
                        if (proxyRes.statusCode >= 400) {
                            console.log(`API Error (${proxyRes.statusCode}): ${responseData}`);
                        }
                        
                        res.writeHead(proxyRes.statusCode, {
                            'Content-Type': 'application/json'
                        });
                        res.end(responseData);
                    });
                });

                proxyReq.on('error', (e) => {
                    console.error('Proxy error:', e);
                    res.writeHead(500);
                    res.end(JSON.stringify({ error: e.message }));
                });

                proxyReq.write(JSON.stringify(data));
                proxyReq.end();
                
            } catch (err) {
                console.error('Request error:', err.message);
                res.writeHead(500);
                res.end(JSON.stringify({ error: err.message }));
            }
        });
        return;
    }

    // Serve Static Files
    let filePath = '.' + req.url;
    if (filePath === './') filePath = './index.html';
    
    filePath = filePath.split('?')[0];
    const extname = path.extname(filePath);
    const contentType = MIME_TYPES[extname] || 'application/octet-stream';

    fs.readFile(filePath, (error, content) => {
        if (error) {
            if (error.code === 'ENOENT') {
                res.writeHead(404);
                res.end('File Not Found');
            } else {
                res.writeHead(500);
                res.end('Server Error: ' + error.code);
            }
        } else {
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content, 'utf-8');
        }
    });
});

server.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}/`);
    console.log(`Direct API proxy (no SDK dependency)`);
});
