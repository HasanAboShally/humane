import { createServer } from 'node:http';
import { readFileSync, realpathSync, statSync } from 'node:fs';
import { extname, join, resolve, sep } from 'node:path';
import { repositoryRoot } from './skill-package.mjs';

const root = realpathSync(join(repositoryRoot, 'dist/site'));
const port = Number(process.env.PORT || 4178);
const types = { '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.svg': 'image/svg+xml', '.png': 'image/png', '.woff2': 'font/woff2', '.zip': 'application/zip', '.skill': 'application/zip', '.md': 'text/markdown; charset=utf-8', '.txt': 'text/plain; charset=utf-8', '.xml': 'application/xml; charset=utf-8' };

createServer((request, response) => {
  const method = request.method;
  if (!['GET', 'HEAD'].includes(method)) { response.writeHead(405, { Allow: 'GET, HEAD' }); response.end(); return; }
  try {
    const url = new URL(request.url, 'http://localhost');
    if (url.pathname === '/' || url.pathname === '/humane' || url.pathname === '/humane/index.html') {
      response.writeHead(301, { Location: `/humane/${url.search}`, 'X-Robots-Tag': 'noindex' }); response.end(); return;
    }
    if (url.pathname !== '/robots.txt' && !url.pathname.startsWith('/humane/')) throw new Error('Unknown route');
    const relative = url.pathname === '/robots.txt' ? 'robots.txt' : decodeURIComponent(url.pathname.slice('/humane/'.length));
    let file = resolve(root, relative || 'index.html');
    if (file !== root && !file.startsWith(root + sep)) throw new Error('Invalid path');
    if (statSync(file).isDirectory()) {
      if (!url.pathname.endsWith('/')) { response.writeHead(301, { Location: url.pathname + '/' }); response.end(); return; }
      file = join(file, 'index.html');
    }
    if (!realpathSync(file).startsWith(root + sep)) throw new Error('Invalid path');
    const bytes = readFileSync(file);
    response.writeHead(200, { 'Content-Type': types[extname(file)] || 'application/octet-stream', 'Content-Length': bytes.length, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff', 'X-Robots-Tag': 'noindex' });
    response.end(method === 'HEAD' ? undefined : bytes);
  } catch {
    response.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8', 'X-Robots-Tag': 'noindex', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
    response.end(method === 'HEAD' ? undefined : readFileSync(join(root, '404.html')));
  }
}).listen(port, '127.0.0.1', () => console.log(`Humane local preview: http://127.0.0.1:${port}/humane/`));
