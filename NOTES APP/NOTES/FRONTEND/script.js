import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'
import { getNotes, createNote } from './db.js'

const saveTimers = {}

const editor = new Editor({
    element: document.querySelector('#editor__content'),
    extensions: [StarterKit],
    content: '',

    onUpdate: () => {
    if (!currentNote || !currentNote.id) return

    currentNote.description = editor.getJSON()

    const note = currentNote
    clearTimeout(saveTimers[note.id])
    saveTimers[note.id] = setTimeout(() => {
        fetch(`http://127.0.0.1:3000/notes/${note.id}`, {
            method: 'PUT',
            body: JSON.stringify({ description: note.description })
        })
    }, 500)
}
})

const buttons = document.querySelectorAll('[data-tiptap-button]')
buttons.forEach((button) => {
    button.addEventListener('click', () => {
        const command = button.dataset.tiptapButton

        switch (command) {
            case 'bold':
                editor.chain().focus().toggleBold().run()
                break
            case 'italic':
                editor.chain().focus().toggleItalic().run()
                break
            case 'strike':
                editor.chain().focus().toggleStrike().run()
                break
            case 'code':
                editor.chain().focus().toggleCode().run()
                break
            case 'h1':
                editor.chain().focus().toggleHeading({ level: 1 }).run()
                break
            case 'h2':
                editor.chain().focus().toggleHeading({ level: 2 }).run()
                break
            case 'bulletList':
                editor.chain().focus().toggleBulletList().run()
                break
            case 'orderedList':
                editor.chain().focus().toggleOrderedList().run()
                break
            case 'blockquote':
                editor.chain().focus().toggleBlockquote().run()
                break
            case 'codeBlock':
                editor.chain().focus().toggleCodeBlock().run()
                break
        }

        updateActiveButtons()
    })
})

function updateActiveButtons() {
    const map = {
        bold: () => editor.isActive('bold'),
        italic: () => editor.isActive('italic'),
        strike: () => editor.isActive('strike'),
        code: () => editor.isActive('code'),
        h1: () => editor.isActive('heading', { level: 1 }),
        h2: () => editor.isActive('heading', { level: 2 }),
        bulletList: () => editor.isActive('bulletList'),
        orderedList: () => editor.isActive('orderedList'),
        blockquote: () => editor.isActive('blockquote'),
        codeBlock: () => editor.isActive('codeBlock'),
    }

    buttons.forEach((button) => {
        const command = button.dataset.tiptapButton
        const check = map[command]
        if (check && check()) {
            button.classList.add('is-active')
        } else {
            button.classList.remove('is-active')
        }
    })
}

editor.on('selectionUpdate', updateActiveButtons)
editor.on('update', updateActiveButtons)

const iconHide = document.getElementById('hide')
const main = document.getElementById('main')
const createBtn = document.getElementById('create-btn')
const modal = document.getElementById('shadow')
const saveBtn = document.getElementById('save-btn')
const closeBtn = document.getElementById('close-btn')
const title = document.getElementById('form-create__title')
const desc = document.getElementById('form-create__desc')
const date = new Date().toISOString().slice(0, 10)
const NOTES_KEY = 'notes'
const backBtn = document.getElementById('back-btn')
const nextBtn = document.getElementById('next-btn')


iconHide.addEventListener('click', () => {
    main.classList.toggle('main_navbar-hidden')
    iconHide.classList.toggle('rotated')
})

createBtn.addEventListener('click', () => {
    title.value = ''
    desc.value = ''
    modal.style.display = 'flex'
})

closeBtn.addEventListener('click', (e) => {
    e.preventDefault()
    modal.style.display = 'none'
})

saveBtn.addEventListener('click', async (e) => {
    e.preventDefault()
    const note = {
        title: title.value || "Новая заметка",
        description: {
            content: [{
                type: 'paragraph',
                content: [{
                    text: desc.value,
                    type: 'text'
                }]
            }],
            type: 'doc'
        },
        date: date
    }
    try {
        const res = await createNote(note)
        if (res.status === false) {
            console.log("что-то пошло не так при сохранении")
            return
        }
        notes.unshift(res.data)
        currentNote = res.data
        editor.commands.setContent(currentNote.description)
    } catch (e) {
        console.log(e)
    }
    modal.style.display = 'none'
    renderNavbar()
})


const notes = await initDB()

const days = [
    'вск',
    'пн',
    'вт',
    'ср',
    'чт',
    'пт',
    'сб'
]

function objToHTML(obj) {
    const mainEl = document.createElement('div')
    mainEl.classList.add('navbar__content-note')

    const dateEl = document.createElement('div')
    dateEl.classList.add('navbar__content-note-date')

    const num = document.createElement('div')
    num.classList.add('num')
    num.innerHTML = new Date(obj.date).getDate()

    const word = document.createElement('div')
    word.classList.add('word')
    word.innerHTML = days[new Date(obj.date).getDay()]

    const fullDate = document.createElement('div')
    fullDate.classList.add('fullDate')
    fullDate.innerHTML = obj.date

    dateEl.appendChild(num)
    dateEl.appendChild(word)
    dateEl.appendChild(fullDate)

    const descEl = document.createElement('div')
    descEl.classList.add('navbar__content-note-textpiece')

    const title = document.createElement('div')
    title.innerHTML = `<b>${obj.title}</b>`

    const description = document.createElement('div')

    descEl.appendChild(title)
    descEl.appendChild(description)

    mainEl.appendChild(dateEl)
    mainEl.appendChild(descEl)

    return mainEl
}

let currentNote = notes[0] || null
if (currentNote) {
    editor.commands.setContent(currentNote.description)
}

async function initDB() {
    try {
        return await getNotes()
    } catch (e) {
        console.log(e)
        return []
    }
}

const navbarEl = document.getElementById('navbar__content')

function renderNavbar() {
    navbarEl.innerHTML = ''
    for (let note of notes) {
        const noteHTML = objToHTML(note)
        if (note === currentNote) {
            noteHTML.classList.add('active-note')
        }
        noteHTML.addEventListener('click', () => {
            currentNote = note
            editor.commands.setContent(currentNote.description)
            renderNavbar()
        })
        navbarEl.appendChild(noteHTML)
    }
}

function changeNote(index) {
    if (index < 0 || index >= notes.length) return
    currentNote = notes[index]
    editor.commands.setContent(currentNote.description)
    renderNavbar()
}

backBtn.addEventListener('click', () => {
    changeNote(notes.indexOf(currentNote) - 1)
})

nextBtn.addEventListener('click', () => {
    changeNote(notes.indexOf(currentNote) + 1)
})

renderNavbar()