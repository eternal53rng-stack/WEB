const iconHide = document.getElementById('hide');
const app = document.getElementById('app');
const createBtn = document.getElementById('create-btn');
const modal = document.getElementById('shadow');
const btnSave = document.getElementById('btn-save');
const btnClose = document.getElementById('btn-close');
const formTitle = document.getElementById('form-title');
const formDescription = document.getElementById('form-description');

const NOTES_KEY = 'notes';
let notes = JSON.parse(localStorage.getItem(NOTES_KEY)) || [];
let currentNote = null;

iconHide.addEventListener('click', () => {
    app.classList.toggle('app_navbar-hidden');
});

createBtn.addEventListener('click', () => {
    modal.style.display = 'flex';
});

btnClose.addEventListener('click', (e) => {
    e.preventDefault();
    modal.style.display = 'none';
});

btnSave.addEventListener('click', (e) => {
    e.preventDefault();
    const titleValue = formTitle.value;
    const descriptionValue = formDescription.value;
    const date = '2026-10-26'; 

    notes.unshift({
        title: titleValue || 'Новая заметка',
        description: descriptionValue,
        date: date
    });

    modal.style.display = 'none';
    localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    renderNavbar();
});

function getNoteHTML(note) {
    const rootElement = document.createElement('div');
    rootElement.classList.add('navbar__month-note');
    
    const dateElement = document.createElement('div');
    dateElement.classList.add('navbar__month-note-date');
    
    const num = document.createElement('div');
    num.classList.add('navbar__month-note-num');
    const tmp = new Date(note.date).getDate();
    num.innerHTML = `${tmp}`;

    const day = document.createElement('div');
    day.classList.add('navbar__month-note-day');
    const days = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    day.innerHTML = days[new Date(note.date).getDay() - 1];

    const fullDate = document.createElement('div');
    fullDate.classList.add('navbar__month-note-full'); 
    fullDate.innerHTML = note.date;

    dateElement.appendChild(num);
    dateElement.appendChild(day);
    dateElement.appendChild(fullDate);

    const descElement = document.createElement('div');
    descElement.classList.add('navbar__month-note-description');

    const title = document.createElement('div');
    title.innerHTML = `<b>${note.title}</b>`;
    
    const description = document.createElement('div');
    description.innerHTML = note.description;

    descElement.appendChild(title);
    descElement.appendChild(description);

    rootElement.appendChild(dateElement);
    rootElement.appendChild(descElement);

    return rootElement;
}

const navbarElement = document.getElementById('navbar');

function renderNavbar() {
    if (!navbarElement) return;
    navbarElement.innerHTML = '';
    
    for (let note of notes) {
        const noteHTML = getNoteHTML(note);
        if (note === currentNote) {
            noteHTML.classList.add('navbar__month-note_active');
        }
        noteHTML.addEventListener('click', () => {
            currentNote = note;
            renderNavbar(); 
        });
        navbarElement.appendChild(noteHTML);
    }
}

renderNavbar();