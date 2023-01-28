const myStorage = window.localStorage;

const addNewNote = document.querySelector('.new-note');
const list = document.querySelector('.todo-list');
const footer = document.querySelector('.footer');
const footerMenu = document.querySelector('.filters');
const clearCompletedBtn = document.querySelector('.clear-completed');
const showCompletedNotes = document.querySelector('.completed-notes');
const showActiveNotes = document.querySelector('.active-notes');
const showAllNotes = document.querySelector('.all-notes');

let todoList = [];
if (myStorage.getItem('todo')) {
  todoList = JSON.parse(myStorage.getItem('todo'));
}

// ! Ф-ЦИЯ РАНДОМАЙЗЕР СЛУЧАЙНОГО БОЛЬШОГО ЧИСЛА
function generateRandomId() {
  const randomIdNumber = Math.round(Math.random() * 100000000000);
  return randomIdNumber;
}

// ! Ф-ЦИЯ ПРОВЕРКИ НА ДЛИНУ ЗАМЕТКИ (НА ПУСТУЮ ЗАМЕТКУ)
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

  const completedNotesLink = window.location.href.split('').slice(window.location.href.length - 9).join('');
  if (completedNotesLink === 'completed') {
    newListElement.style.display = 'none';
    list.appendChild(newListElement);
    addNewNote.value = '';

    const allcompletedNotes = document.querySelectorAll('.completed');
    const needsToDo = footer.firstElementChild.firstElementChild;
    needsToDo.innerHTML = list.children.length - allcompletedNotes.length;
  }
  list.appendChild(newListElement);
  addNewNote.value = '';

  const allcompletedNotes = document.querySelectorAll('.completed');
  const needsToDo = footer.firstElementChild.firstElementChild;
  needsToDo.innerHTML = list.children.length - allcompletedNotes.length;
  console.log(needsToDo.innerHTML);
}

// ! Ф-ЦИЯ ПОДГРУЖАЕТ ЗАМЕТКИ ИЗ LOCALSTORAGE
function showMyNotes() {
  let notesList = '';
  todoList.forEach((note) => {
    notesList += `
    <li id=${note.id} ${note.checked ? 'class="completed"' : ''}>
      <div class="div">
        <input type="checkbox" class="toggle" ${note.checked ? 'checked' : ''}>
        <label for="">${note.text}</label>
        <button class="deleteBtn"></button>
      </div>
    </li>
    `;
    list.innerHTML = notesList;
    const allcompletedNotes = document.querySelectorAll('.completed');
    const needsToDo = footer.firstElementChild.firstElementChild;
    needsToDo.innerHTML = list.children.length - allcompletedNotes.length;
  });
}

// ! ДОБАВЛЕНИЕ ЗАМЕТКИ НА CLICK
document.addEventListener('click', (event) => {
  if (checkLength()) {
    if (event.target.className !== 'new-note') {
      if (event.target.tagName === 'INPUT') {
        event.target.checked = !event.target.checked;
      }
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
    const allcompletedNotes = document.querySelectorAll('.completed');
    needsToDo.innerHTML = list.children.length - allcompletedNotes.length;
    todoList = todoList.filter((item) => item.id !== event.target.parentNode.parentNode.id);
    myStorage.setItem('todo', JSON.stringify(todoList));
  }
});

// ! ЗАМЕТКА ВЫПОЛНЕНА
list.addEventListener('change', (event) => {
  if (event.target.tagName === 'INPUT') {
    if (event.target.checked === true) {
      const note = document.getElementById(`${event.target.parentNode.parentNode.id}`);
      note.setAttribute('class', 'completed');
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id === event.target.parentNode.parentNode.id) {
          todoList[i].checked = true;
          myStorage.setItem('todo', JSON.stringify(todoList));
        }
      }
    } else {
      const note = document.getElementById(`${event.target.parentNode.parentNode.id}`);
      note.classList.remove('completed');
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id === note.id) {
          todoList[i].checked = false;
          myStorage.setItem('todo', JSON.stringify(todoList));
        }
      }
    }
  }
});

// ! ИЗМЕНЕНИЕ СПИСКА ЗАМЕТОК
list.addEventListener('change', (event) => {
  const allcompletedNotes = document.querySelectorAll('.completed');
  const needsToDo = footer.firstElementChild.firstElementChild;
  needsToDo.innerHTML = `${list.children.length - allcompletedNotes.length}`;

  const activeNotesLink = window.location.href.split('').slice(window.location.href.length - 6).join('');
  const completedNotes = document.querySelectorAll('input:checked');

  const completedNotesLink = window.location.href.split('').slice(window.location.href.length - 9).join('');
  const activeNotes = document.querySelectorAll('input:not(:checked)');

  if (activeNotesLink === 'active') {
    for (let i = 0; i < completedNotes.length; i++) {
      completedNotes[i].parentNode.parentNode.style.display = 'none';
    }
  }

  if (completedNotesLink === 'completed') {
    for (let j = 1; j < activeNotes.length; j++) {
      activeNotes[j].parentNode.parentNode.style.display = 'none';
    }
  }
});

// ! АКТИВНЫЕ ЗАМЕТКИ
footerMenu.addEventListener('click', (event) => {
  if (event.target.tagName === 'A') {
    const completedNotes = document.querySelectorAll('input:checked');
    const activeNotes = document.querySelectorAll('input:not(:checked)');
    if (event.target.innerHTML === 'Active') {
      for (let j = 1; j < activeNotes.length; j++) {
        activeNotes[j].parentNode.parentNode.style.display = '';
      }
      for (let i = 0; i < completedNotes.length; i++) {
        completedNotes[i].parentNode.parentNode.style.display = 'none';
      }
    } else if (event.target.innerHTML === 'Completed') {
      for (let i = 0; i < completedNotes.length; i++) {
        completedNotes[i].parentNode.parentNode.style.display = '';
      }
      for (let j = 1; j < activeNotes.length; j++) {
        activeNotes[j].parentNode.parentNode.style.display = 'none';
      }
    } else if (event.target.innerHTML === 'All') {
      for (let i = 0; i < completedNotes.length; i++) {
        completedNotes[i].parentNode.parentNode.style.display = '';
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
    const completedNotes = document.querySelectorAll('input:checked');
    for (let i = 0; i < completedNotes.length; i++) {
      const noteId = completedNotes[i].parentNode.parentNode.id;
      todoList = todoList.filter((item) => item.id !== noteId);
      myStorage.setItem('todo', JSON.stringify(todoList));
      completedNotes[i].parentNode.parentNode.remove();
    }
  }
});

// ! ПОЯВЛЕНИЕ НИЖНЕГО МЕНЮ
window.addEventListener('load', (event) => {
  showMyNotes();
});

// ! ПОЯВЛЕНИЕ РАМКИ НА АКТИВНОЙ КНОПКЕ ПРИ ПЕРЕКЛЮЧЕНИИ
showCompletedNotes.addEventListener('click', () => {
  showCompletedNotes.style.borderBottom = '2px solid rgba(175, 47, 47, 0.2)';
  showAllNotes.style.border = 'none';
  showActiveNotes.style.border = 'none';
});

showActiveNotes.addEventListener('click', () => {
  showActiveNotes.style.borderBottom = '2px solid rgba(175, 47, 47, 0.2)';
  showCompletedNotes.style.border = 'none';
  showAllNotes.style.border = 'none';
});

showAllNotes.addEventListener('click', () => {
  showAllNotes.style.borderBottom = '2px solid rgba(175, 47, 47, 0.2)';
  showActiveNotes.style.border = 'none';
  showCompletedNotes.style.border = 'none';
});

// ! РЕНДЕРИМ ВЕРНУЮ СТРАНИЦУ ПРИ ПЕРЕЗАГРУЗКЕ (ALL/ACTIVE/COMPLETED)
window.addEventListener('load', (event) => {
  const completedNotesLink = window.location.href.split('').slice(window.location.href.length - 9).join('');
  const activeNotesLink = window.location.href.split('').slice(window.location.href.length - 6).join('');

  const completedNotes = document.querySelectorAll('input:checked');
  const activeNotes = document.querySelectorAll('input:not(:checked)');

  if (completedNotesLink === 'completed') {
    showCompletedNotes.style.borderBottom = '2px solid rgba(175, 47, 47, 0.2)';
    showAllNotes.style.border = 'none';
    showActiveNotes.style.border = 'none';
    for (let i = 0; i < completedNotes.length; i++) {
      completedNotes[i].parentNode.parentNode.style.display = '';
    }
    for (let j = 1; j < activeNotes.length; j++) {
      activeNotes[j].parentNode.parentNode.style.display = 'none';
    }
  } else if (activeNotesLink === 'active') {
    showActiveNotes.style.borderBottom = '2px solid rgba(175, 47, 47, 0.2)';
    showCompletedNotes.style.border = 'none';
    showAllNotes.style.border = 'none';
    for (let j = 1; j < activeNotes.length; j++) {
      activeNotes[j].parentNode.parentNode.style.display = '';
    }
    for (let i = 0; i < completedNotes.length; i++) {
      completedNotes[i].parentNode.parentNode.style.display = 'none';
    }
  } else {
    showAllNotes.style.borderBottom = '2px solid rgba(175, 47, 47, 0.2)';
    showActiveNotes.style.border = 'none';
    showCompletedNotes.style.border = 'none';
  }
});
