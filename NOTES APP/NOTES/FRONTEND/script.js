import { Editor } from '@tiptap/core'
import StarterKit from '@tiptap/starter-kit'

const editor = new Editor({
    element: document.querySelector('#editor__content'),
    extensions: [StarterKit],
    content: '',
    onUpdate: ()=>{
        currentNote.desc = editor.getJSON()
        localStorage.setItem(NOTES_KEY, JSON.stringify(notes))
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



iconHide.addEventListener('click', () => {
    main.classList.toggle('main_navbar-hidden')
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

saveBtn.addEventListener('click', (e) => {
    e.preventDefault()
    const titleValue = title.value || 'Новая заметка'
    const descValue = desc.value
    const dateValue = date

    notes.unshift(
        {
            title: titleValue,
            desc: descValue,
            date: dateValue
        }
    )
    modal.style.display = 'none'
    localStorage.setItem('notes', JSON.stringify(notes))
    renderNavbar()
})


const notes = initDB()

const days = [
    'вск',
    'пн',
    'вт',
    'ср',
    'чт',
    'пт',
    'сб'
]

function initDB() {
    const items = localStorage.getItem(NOTES_KEY)
    return JSON.parse(items || '[]')
}

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
    //description.innerHTML = `${obj.desc.slice(0, 20)}...`

    descEl.appendChild(title)
    descEl.appendChild(description)

    mainEl.appendChild(dateEl)
    mainEl.appendChild(descEl)

    return mainEl
}

let currentNote = notes[0]
editor.commands.setContent(currentNote.desc)

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
            editor.commands.setContent(currentNote.desc)
            renderNavbar()
        })
        navbarEl.appendChild(noteHTML)
    }
}

renderNavbar()