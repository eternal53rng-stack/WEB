const SRV = 'http://127.0.0.1:3000'

async function getNotes(){
    const result = await fetch(`${SRV}/notes`,{ method: 'GET' })

    const chunks = [];
    for await (const chunk of result.body) {
        chunks.push(Buffer.from(chunk));
    }
    const data = JSON.parse(Buffer.concat(chunks).toString('utf-8'));
    console.log(data)
}
getNotes()