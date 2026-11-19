import http from 'node:http';
import path from 'node:path';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../src/', import.meta.url));
const types = {'.html':'text/html; charset=utf-8','.css':'text/css','.js':'text/javascript'};
const port = Number(process.env.PORT || 4173);
const server = http.createServer(async (req, res) => {
  try {
    const url = new URL(req.url, 'http://localhost');
    let file = path.resolve(root, '.' + decodeURIComponent(url.pathname));
    if (path.relative(root, file).startsWith('..')) throw new Error('Outside source');
    if ((await stat(file)).isDirectory()) file = path.join(file, 'index.html');
    const data = await readFile(file);
    res.writeHead(200, {'content-type':types[path.extname(file)] || 'application/octet-stream','cache-control':'no-store'});
    res.end(data);
  } catch {
    res.writeHead(404); res.end('File not found');
  }
});
server.listen(port, '127.0.0.1', () => console.log('Portfolio running at http://localhost:' + port));
