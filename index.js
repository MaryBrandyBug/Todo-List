const myStorage = window.localStorage;

const addNewNote = document.querySelector('.new-note');
const list = document.querySelector('.todo-list');
const footer = document.querySelector('.footer');
const footerMenu = document.querySelector('.filters');
const clearCompletedBtn = document.querySelector('.clear-completed');
const completedNotesList = document.querySelector('.completed-notes');
const activeNotesList = document.querySelector('.active-notes');
const allNotesList = document.querySelector('.all-notes');
const toggleAll = document.querySelector('.toggle-all');

let todoList = [];
if (myStorage.getItem('todo')) {
  todoList = JSON.parse(myStorage.getItem('todo'));
}

// ! Ф-ЦИЯ ПОДГРУЖАЕТ ЗАМЕТКИ СООТВЕТСТВУЮЩИЕ АДРЕСУ СТРАНИЦЫ
function renderRightNotes() {
  const completedNotesLink = window.location.href.split('').slice(window.location.href.length - 9).join('');
  const activeNotesLink = window.location.href.split('').slice(window.location.href.length - 6).join('');

  const completedNotes = document.querySelectorAll('input.toggle:checked');
  const activeNotes = document.querySelectorAll('input.toggle:not(:checked)');

  if (completedNotesLink === 'completed') {
    completedNotesList.style.border = '2px solid rgba(175, 47, 47, 0.2)';
    allNotesList.style.border = 'none';
    activeNotesList.style.border = 'none';
    for (let i = 0; i < completedNotes.length; i++) {
      completedNotes[i].parentNode.parentNode.style.display = '';
    }
    for (let j = 0; j < activeNotes.length; j++) {
      activeNotes[j].parentNode.parentNode.style.display = 'none';
    }
  } else if (activeNotesLink === 'active') {
    activeNotesList.style.border = '2px solid rgba(175, 47, 47, 0.2)';
    completedNotesList.style.border = 'none';
    allNotesList.style.border = 'none';
    for (let j = 0; j < activeNotes.length; j++) {
      activeNotes[j].parentNode.parentNode.style.display = '';
    }
    for (let i = 0; i < completedNotes.length; i++) {
      completedNotes[i].parentNode.parentNode.style.display = 'none';
    }
  } else {
    allNotesList.style.border = '2px solid rgba(175, 47, 47, 0.2)';
    activeNotesList.style.border = 'none';
    completedNotesList.style.border = 'none';
  }

  if (list.children.length === 0) {
    footer.style.display = 'none';
    toggleAll.checked = false;
  }
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

    const allCompletedNotes = document.querySelectorAll('.completed');
    const needsToDo = footer.firstElementChild.firstElementChild;
    needsToDo.innerHTML = list.children.length - allCompletedNotes.length;
  }
  list.appendChild(newListElement);
  addNewNote.value = '';

  const allCompletedNotes = document.querySelectorAll('.completed');
  const needsToDo = footer.firstElementChild.firstElementChild;
  needsToDo.innerHTML = list.children.length - allCompletedNotes.length;

  footer.style.display = '';
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
    const allCompletedNotes = document.querySelectorAll('.completed');
    const needsToDo = footer.firstElementChild.firstElementChild;
    needsToDo.innerHTML = list.children.length - allCompletedNotes.length;
  });
  const completed = document.querySelectorAll('input.toggle:checked');
  if (completed.length === list.children.length) {
    toggleAll.checked = true;
  } else {
    toggleAll.checked = false;
  }
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
    const allCompletedNotes = document.querySelectorAll('.completed');
    needsToDo.innerHTML = list.children.length - allCompletedNotes.length;
    todoList = todoList.filter((item) => item.id !== event.target.parentNode.parentNode.id);
    myStorage.setItem('todo', JSON.stringify(todoList));

    if (list.children.length === 0) {
      footer.style.display = 'none';
      toggleAll.checked = false;
    }
  }
});

// ! ЗАМЕТКА ВЫПОЛНЕНА
list.addEventListener('change', (event) => {
  if (event.target.tagName === 'INPUT' && event.target.classList.value === 'toggle') {
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
list.addEventListener('change', () => {
  const allCompletedNotes = document.querySelectorAll('.completed');
  const needsToDo = footer.firstElementChild.firstElementChild;
  needsToDo.innerHTML = `${list.children.length - allCompletedNotes.length}`;

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
    const completedNotes = document.querySelectorAll('input.toggle:checked');
    const activeNotes = document.querySelectorAll('input.toggle:not(:checked)');
    if (event.target.innerHTML === 'Active') {
      for (let j = 0; j < activeNotes.length; j++) {
        activeNotes[j].parentNode.parentNode.style.display = '';
      }
      for (let i = 0; i < completedNotes.length; i++) {
        completedNotes[i].parentNode.parentNode.style.display = 'none';
      }
    } else if (event.target.innerHTML === 'Completed') {
      for (let i = 0; i < completedNotes.length; i++) {
        completedNotes[i].parentNode.parentNode.style.display = '';
      }
      for (let j = 0; j < activeNotes.length; j++) {
        activeNotes[j].parentNode.parentNode.style.display = 'none';
      }
    } else if (event.target.innerHTML === 'All') {
      for (let i = 0; i < completedNotes.length; i++) {
        completedNotes[i].parentNode.parentNode.style.display = '';
      }
      for (let j = 0; j < activeNotes.length; j++) {
        activeNotes[j].parentNode.parentNode.style.display = '';
      }
    }
  }
  const completed = document.querySelectorAll('input.toggle:checked');
  if (completed.length === list.children.length) {
    toggleAll.checked = true;
  } else {
    toggleAll.checked = false;
  }
});

// ! УДАЛЕНИЕ ВЫПОЛНЕННЫХ ДЕЛ
clearCompletedBtn.addEventListener('click', () => {
  if (addNewNote.value === '') {
    const completedNotes = document.querySelectorAll('input.toggle:checked');
    for (let i = 0; i < completedNotes.length; i++) {
      const noteId = completedNotes[i].parentNode.parentNode.id;
      todoList = todoList.filter((item) => item.id !== noteId);
      myStorage.setItem('todo', JSON.stringify(todoList));
      completedNotes[i].parentNode.parentNode.remove();
    }
    if (list.children.length === 0) {
      footer.style.display = 'none';
      toggleAll.checked = false;
    }
  }
});

// ! ПОДГРУЗКА ВСЕХ ЗАМЕТОК
window.addEventListener('load', () => {
  showMyNotes();
});

// ! ПОЯВЛЕНИЕ РАМКИ НА АКТИВНОЙ КНОПКЕ ПРИ ПЕРЕКЛЮЧЕНИИ
completedNotesList.addEventListener('click', () => {
  completedNotesList.style.border = '2px solid rgba(175, 47, 47, 0.2)';
  allNotesList.style.border = 'none';
  activeNotesList.style.border = 'none';
});

activeNotesList.addEventListener('click', () => {
  activeNotesList.style.border = '2px solid rgba(175, 47, 47, 0.2)';
  completedNotesList.style.border = 'none';
  allNotesList.style.border = 'none';
});

allNotesList.addEventListener('click', () => {
  allNotesList.style.border = '2px solid rgba(175, 47, 47, 0.2)';
  activeNotesList.style.border = 'none';
  completedNotesList.style.border = 'none';
});

// ! РЕНДЕРИМ ВЕРНУЮ СТРАНИЦУ ПРИ ПЕРЕЗАГРУЗКЕ (ALL/ACTIVE/COMPLETED)
window.addEventListener('load', () => {
  renderRightNotes();
});

// ! ОТМЕТИТЬ ВСЕ ЗАМЕТКИ
toggleAll.addEventListener('click', () => {
  const completed = document.querySelectorAll('input.toggle:checked');
  const uncompleted = document.querySelectorAll('input.toggle:not(:checked)');

  if (completed && uncompleted.length !== 0) {
    for (let i = 0; i < uncompleted.length; i++) {
      const noteId = uncompleted[i].parentNode.parentNode.id;
      uncompleted[i].setAttribute('checked', 'checked');
      document.getElementById(noteId).setAttribute('class', 'completed');
      for (let j = 0; j < todoList.length; j++) {
        if (todoList[j].id === noteId) {
          todoList[j].checked = true;
          myStorage.setItem('todo', JSON.stringify(todoList));
        }
      }
    }
    toggleAll.checked = true;
  } else if (completed.legth === 0 && uncompleted.length !== 0) {
    for (let i = 0; i < uncompleted.length; i++) {
      const noteId = uncompleted[i].parentNode.parentNode.id;
      for (let j = 0; j < todoList.length; j++) {
        if (todoList[j].id === noteId) {
          todoList[j].checked = true;
          myStorage.setItem('todo', JSON.stringify(todoList));
        }
      }
    }
    toggleAll.checked = true;
  } else if (completed.legth !== 0 && uncompleted.length === 0) {
    for (let i = 0; i < completed.length; i++) {
      const noteId = completed[i].parentNode.parentNode.id;
      for (let j = 0; j < todoList.length; j++) {
        if (todoList[j].id === noteId) {
          todoList[j].checked = false;
          myStorage.setItem('todo', JSON.stringify(todoList));
        }
      }
    }
    toggleAll.checked = false;
  }
  showMyNotes();
  renderRightNotes();
});

// ! РЕДАКТИРОВАНИЕ ЗАМЕТКИ
list.addEventListener(('dblclick'), (event) => {
  if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'INPUT') {
    if (event.target.tagName === 'DIV' && !document.querySelector('.edit')) {
      const currentBlock = event.target;
      currentBlock.style.display = 'none';
      const listItem = event.target.parentNode;
      const noteText = todoList.filter((note) => note.id === listItem.id);
      const newInputField = document.createElement('input');
      newInputField.setAttribute('value', `${noteText[0].text}`);
      newInputField.setAttribute('class', 'edit');
      listItem.appendChild(newInputField);
      newInputField.focus();
    }

    if (event.target.tagName === 'LI' && !document.querySelector('.edit')) {
      const currentBlock = event.target;
      currentBlock.children[0].style.display = 'none';
      const noteText = todoList.filter((note) => note.id === currentBlock.id);
      const newInputField = document.createElement('input');
      newInputField.setAttribute('value', `${noteText[0].text}`);
      newInputField.setAttribute('class', 'edit');
      currentBlock.appendChild(newInputField);
      newInputField.focus();
    }

    if (event.target.tagName === 'LABEL' && !document.querySelector('.edit')) {
      const currentBlock = event.target;
      currentBlock.parentNode.style.display = 'none';
      const listItem = event.target.parentNode.parentNode;
      const noteText = todoList.filter((note) => note.id === listItem.id);
      const newInputField = document.createElement('input');
      newInputField.setAttribute('value', `${noteText[0].text}`);
      newInputField.setAttribute('class', 'edit');
      listItem.appendChild(newInputField);
      newInputField.focus();
    }
  }
});

// toDo ФУНКЦИЯ ДЛЯ ДОБАВЛЕНИЯ
function editNotes(editNote) {
  if (editNote.value) {
    const newNoteText = editNote.value.split(' ');
    const verification = newNoteText.filter((el) => el !== ' ' && el !== '');

    if (verification.length !== 0) {
      const listItem = editNote.parentNode;
      for (let i = 0; i < todoList.length; i++) {
        if (todoList[i].id === listItem.id) {
          todoList[i].text = editNote.value;
          myStorage.setItem('todo', JSON.stringify(todoList));
          listItem.children[0].style.display = '';
        }
      }
    }
    showMyNotes();
    renderRightNotes();
    document.querySelector('.container').style.display = '';
    list.style.display = '';
  } else if (editNote.value.length === 0) {
    const listItem = editNote.parentNode;
    const notes = todoList.filter((item) => item.id !== listItem.id);
    listItem.remove();
    todoList = notes;
    myStorage.setItem('todo', JSON.stringify(todoList));
  }
}

document.addEventListener('click', (event) => {
  const editNote = document.querySelector('.edit');
  if (editNote) {
    if (event.target.classList.value !== 'edit' && event.target !== editNote.parentNode) {
      editNotes(editNote);
    }
  }
});

document.addEventListener('keydown', (event) => {
  const editNote = document.querySelector('.edit');
  if (event.code === 'Enter') {
    if (editNote) {
      editNotes(editNote);
    }
  }
});
