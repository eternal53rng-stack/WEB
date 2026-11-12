import { createServer } from 'node:http';
import { getNotes } from './db.js';

const PORT = 3000;
const HOST = '127.0.0.1';

const server = createServer(async(req, res) => {
    //await getNotes()
    if (req.method === 'GET' && req.url === '/notes'){
        try {
            const { rows } = await getNotes()
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows))
        } catch (err) {
            console.error(err)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({error: 'Internal Server Error'}))
        }
        return
    }
    
    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({error: 'Not Found'}))
});

server.listen(PORT, HOST, () => {
  console.log(`Listening on ${HOST}:${PORT}`);
});