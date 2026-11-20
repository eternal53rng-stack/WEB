import { createServer } from 'node:http';
import { getNotes, createNote, updateNote } from './db.js';

const PORT = 3000;
const HOST = '127.0.0.1';

const server = createServer(async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
    
    if (req.method === 'PUT' && req.url.startsWith('/notes/')) {
    const id = Number(req.url.split('/')[2])
    const buffers = []
    for await (const chunk of req) buffers.push(chunk)
    const { description } = JSON.parse(Buffer.concat(buffers).toString())
    await updateNote(id, description)
    res.end(JSON.stringify({ status: true }))
    return
    }

    if (req.method === 'OPTIONS') {
        res.writeHead(204);
        res.end();
        return;
    }

    if (req.method === 'POST' && req.url === '/notes') {
        const buffers = []

        for await (const chunk of req){
            buffers.push(chunk)
        }

        const rawBody = Buffer.concat(buffers).toString()
        const parsedData = JSON.parse(rawBody)
        const result = await createNote(parsedData)
        res.end(JSON.stringify(result))
        return
    }

    if (req.method === 'GET' && req.url === '/notes') {
        try {
            const { rows } = await getNotes()
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(rows))
        } catch (err) {
            console.error(err)
            res.writeHead(500, { 'Content-Type': 'application/json' })
            res.end(JSON.stringify({ error: 'Internal Server Error' }))
        }
        return
    }

    res.writeHead(404, { 'Content-Type': 'application/json' })
    res.end(JSON.stringify({ error: 'Not Found' }))
});

server.listen(PORT, HOST, () => {
    console.log(`Listening on ${HOST}:${PORT}`);
});