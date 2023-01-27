const myStorage = window.localStorage;

const addNewNote = document.querySelector('.new-note');
const list = document.querySelector('.todo-list');
const footer = document.querySelector('.footer');
const footerMenu = document.querySelector('.filters');
const clearCompletedBtn = document.querySelector('.clear-completed');
const counter = document.querySelector('.need-to-do').firstElementChild.innerHTML;

let todoList = [];
if (myStorage.getItem('todo')) {
  todoList = JSON.parse(myStorage.getItem('todo'));
}

// ! Ф-ЦИЯ РАНДОМАЙЗЕР СЛУЧАЙНОГО БОЛЬШОГО ЧИСЛА
function generateRandomId() {
  const randomIdNumber = Math.round(Math.random() * 100000000000);
  return randomIdNumber;
}

// ! Ф-ЦИЯ ПРОВЕРКИ НА ДЛИНУ ЗАМЕТКИ
function checkLength() {
  if (addNewNote.value) {
    const newNoteText = addNewNote.value.split(' ');
    const verification = newNoteText.filter((el) => el !== ' ' && el !== '');
    if (verification.length !== 0) {
      return true;
    }
    addNewNote.value = '';
    return false;
  }
}

// ! Ф-ЦИЯ ДОБАВЛЕНИЯ ЗАМЕТКИ
function addNote() {
  const newListElement = document.createElement('li');
  newListElement.setAttribute('id', generateRandomId());
  newListElement.innerHTML = `
  <div class="div">
    <input type="checkbox" class="toggle">
    <label for="">${addNewNote.value}</label>
    <button class="deleteBtn"></button>
  </div>`;

  const newNote = { text: addNewNote.value, checked: false, id: newListElement.id };
  todoList.push(newNote);
  myStorage.setItem('todo', JSON.stringify(todoList));

  const complitedNotesLink = window.location.href.split('').slice(window.location.href.length - 9).join('');
  if (complitedNotesLink === 'completed') {
    newListElement.style.display = 'none';
    list.appendChild(newListElement);
    addNewNote.value = '';

    const allComplitedNotes = document.querySelectorAll('.complited');
    const needsToDo = footer.firstElementChild.firstElementChild;
    needsToDo.innerHTML = list.children.length - allComplitedNotes.length;
  }
  list.appendChild(newListElement);
  addNewNote.value = '';

  const allComplitedNotes = document.querySelectorAll('.complited');
  const needsToDo = footer.firstElementChild.firstElementChild;
  needsToDo.innerHTML = list.children.length - allComplitedNotes.length;
}

// ! Ф-ЦИЯ ПОДГРУЖАЕТ ЗАМЕТКИ ИЗ LOCALSTORAGE
function showMyNotes() {
  let notesList = '';
  todoList.forEach((note) => {
    notesList += `
    <li id=${note.id} ${note.checked ? 'class="complited"' : ''}>
      <div class="div">
        <input type="checkbox" class="toggle" ${note.checked ? 'checked' : ''}>
        <label for="">${note.text}</label>
        <button class="deleteBtn"></button>
      </div>
    </li>
    `;
    list.innerHTML = notesList;
    const allComplitedNotes = document.querySelectorAll('.complited');
    const needsToDo = footer.firstElementChild.firstElementChild;
    needsToDo.innerHTML = list.children.length - allComplitedNotes.length;
  });
}

// ! ДОБАВЛЕНИЕ ЗАМЕТКИ НА CLICK
document.addEventListener('click', (event) => {
  if (checkLength()) {
    if (event.target.className !== 'new-note') {
      addNote();
    }
  }
});

// ! ДОБАВЛЕНИЕ НА ENTER
document.addEventListener('keydown', (event) => {
  if (event.code === 'Enter') {
    if (checkLength()) {
      addNote();
    }
  }
});

// ! УДАЛЕНИЕ ЗАМЕТКИ
list.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON' && addNewNote.value === '') {
    const note = document.getElementById(`${event.target.parentNode.parentNode.id}`);
    note.remove();
    const needsToDo = footer.firstElementChild.firstElementChild;
    const allComplitedNotes = document.querySelectorAll('.complited');
    needsToDo.innerHTML = list.children.length - allComplitedNotes.length;
    todoList = todoList.filter((item) => item.id !== event.target.parentNode.parentNode.id);
    myStorage.setItem('todo', JSON.stringify(todoList));
  }
});

// ! ЗАМЕТКА ВЫПОЛНЕНА
list.addEventListener('change', (event) => {
  if (event.target.tagName === 'INPUT') {
    if (event.target.checked === true) {
      const note = document.getElementById(`${event.target.parentNode.parentNode.id}`);
      note.setAttribute('class', 'complited');
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id === event.target.parentNode.parentNode.id) {
          todoList[i].checked = true;
          myStorage.setItem('todo', JSON.stringify(todoList));
        }
      }
    } else {
      const note = document.getElementById(`${event.target.parentNode.parentNode.id}`);
      note.classList.remove('complited');
    }
  }
});

// ! ИЗМЕНЕНИЕ СПИСКА ЗАМЕТОК
list.addEventListener('change', (event) => {
  const allComplitedNotes = document.querySelectorAll('.complited');
  const needsToDo = footer.firstElementChild.firstElementChild;
  needsToDo.innerHTML = `${list.children.length - allComplitedNotes.length}`;

  const activeNotesLink = window.location.href.split('').slice(window.location.href.length - 6).join('');
  const complitedNotes = document.querySelectorAll('input:checked');

  const complitedNotesLink = window.location.href.split('').slice(window.location.href.length - 9).join('');
  const activeNotes = document.querySelectorAll('input:not(:checked)');

  if (activeNotesLink === 'active') {
    for (let i = 0; i < complitedNotes.length; i++) {
      complitedNotes[i].parentNode.parentNode.style.display = 'none';
    }
  }

  if (complitedNotesLink === 'completed') {
    for (let j = 1; j < activeNotes.length; j++) {
      activeNotes[j].parentNode.parentNode.style.display = 'none';
    }
  }
});

// ! АКТИВНЫЕ ЗАМЕТКИ
footerMenu.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    const complitedNotes = document.querySelectorAll('input:checked');
    const activeNotes = document.querySelectorAll('input:not(:checked)');
    if (event.target.innerHTML === 'Active') {
      for (let j = 1; j < activeNotes.length; j++) {
        activeNotes[j].parentNode.parentNode.style.display = '';
      }
      for (let i = 0; i < complitedNotes.length; i++) {
        complitedNotes[i].parentNode.parentNode.style.display = 'none';
      }
    } else if (event.target.innerHTML === 'Completed') {
      for (let i = 0; i < complitedNotes.length; i++) {
        complitedNotes[i].parentNode.parentNode.style.display = '';
      }
      for (let j = 1; j < activeNotes.length; j++) {
        activeNotes[j].parentNode.parentNode.style.display = 'none';
      }
    } else if (event.target.innerHTML === 'All') {
      for (let i = 0; i < complitedNotes.length; i++) {
        complitedNotes[i].parentNode.parentNode.style.display = '';
      }
      for (let j = 1; j < activeNotes.length; j++) {
        activeNotes[j].parentNode.parentNode.style.display = '';
      }
    }
  }
});

// ! УДАЛЕНИЕ ВЫПОЛНЕННЫХ ДЕЛ
clearCompletedBtn.addEventListener('click', (event) => {
  if (addNewNote.value === '') {
    const complitedNotes = document.querySelectorAll('input:checked');
    for (let i = 0; i < complitedNotes.length; i++) {
      const noteId = complitedNotes[i].parentNode.parentNode.id;
      todoList = todoList.filter((item) => item.id !== noteId);
      myStorage.setItem('todo', JSON.stringify(todoList));
      complitedNotes[i].parentNode.parentNode.remove();
    }
  }
});

// ! ПОЯВЛЕНИЕ НИЖНЕГО МЕНЮ
window.addEventListener('load', (event) => {
  showMyNotes();
});

// toDo если в поле ввода заметки пробелы, их можно добавить в список заметок по
// toDo   клику/кнопке, нужно пофиксить(написать условие)
