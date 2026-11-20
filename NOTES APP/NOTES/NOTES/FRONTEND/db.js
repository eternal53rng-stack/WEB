const SRV = 'http://127.0.0.1:3000'

export async function getNotes() {
    const result = await fetch(`${SRV}/notes`, { method: 'GET' })

    const data = await result.json()
    return data
}

export async function createNote(note) {
    const result = await fetch(`${SRV}/notes`, { 
        method: 'POST',
        body: JSON.stringify(note)
    })
    const data = await result.json()
    return data
}

export async function updateNote(id, description) {
    await fetch(`${SRV}/notes/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ description })
    })
}