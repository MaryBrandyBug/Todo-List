import { checkLength, generateRandomId } from './modules/utils.js';

const addNewNote = document.querySelector('.new-note');
const list = document.querySelector('.todo-list');
const footer = document.querySelector('.footer');
const footerMenu = document.querySelector('.filters');
const clearCompletedBtn = document.querySelector('.clear-completed');
const completedNotesList = document.querySelector('.completed-notes');
const activeNotesList = document.querySelector('.active-notes');
const allNotesList = document.querySelector('.all-notes');
const toggleAll = document.querySelector('.toggle-all');
const currentLink = window.location.hash;

const myStorage = JSON.parse(localStorage.getItem('todo'));
let todoList = myStorage ?? [];

// ! Ф-ЦИЯ СОХРАНЯЕТ В STORAGE
const addToStorage = (noteId, meaning) => {
  todoList.find((i) => {
    i.id === noteId ? i.checked = meaning : false;
  });
  localStorage.setItem('todo', JSON.stringify(todoList));
};

// ! Ф-ЦИЯ СЧИТАЕТ КОЛИЧЕСТВО НЕВЫПОЛНЕННЫХ ЗАМЕТОК
const countNotCheckedNotes = () => {
  const allCompletedNotes = document.querySelectorAll('.completed');
  const needsToDo = footer.firstElementChild.firstElementChild;
  needsToDo.innerHTML = list.children.length - allCompletedNotes.length;
};

// ! Ф-ЦИЯ toggleAll проверка
const checkToggleAllBtnColor = () => {
  const completed = document.querySelectorAll('input.toggle:checked');
  if (completed.length === list.children.length) {
    toggleAll.checked = true;
  } else {
    toggleAll.checked = false;
  }
};

// ! Ф-ЦИИ ДЛЯ ПОЯВЛЕНИЯ РАМКИ НА КНОПКЕ АКТИВНОЙ СЕЙЧАС СТРАНИЦЫ
const showComletedNotes = () => {
  completedNotesList.classList.add('current-link');
  allNotesList.classList.remove('current-link');
  activeNotesList.classList.remove('current-link');
};

const showActiveNotes = () => {
  activeNotesList.classList.add('current-link');
  completedNotesList.classList.remove('current-link');
  allNotesList.classList.remove('current-link');
};

const showAllNotes = () => {
  allNotesList.classList.add('current-link');
  completedNotesList.classList.remove('current-link');
  activeNotesList.classList.remove('current-link');
};

// ! Ф-ЦИЯ ПОДГРУЖАЕТ ЗАМЕТКИ СООТВЕТСТВУЮЩИЕ АДРЕСУ СТРАНИЦЫ
const renderRightNotes = () => {
  const completedNotes = document.querySelectorAll('input.toggle:checked');
  const activeNotes = document.querySelectorAll('input.toggle:not(:checked)');

  if (window.location.hash === '#/completed') {
    showComletedNotes();
    completedNotes.forEach((note) => { note.parentNode.parentNode.style.display = ''; });
    activeNotes.forEach((note) => { note.parentNode.parentNode.style.display = 'none'; });
  } else if (window.location.hash === '#/active') {
    showActiveNotes();
    activeNotes.forEach((note) => { note.parentNode.parentNode.style.display = ''; });
    completedNotes.forEach((note) => { note.parentNode.parentNode.style.display = 'none'; });
  } else {
    showAllNotes();
  }

  if (list.children.length === 0) {
    footer.style.display = 'none';
  }
  checkToggleAllBtnColor();
};

// ! Ф-ЦИЯ ДОБАВЛЕНИЯ ЗАМЕТКИ
const addNote = () => {
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
  localStorage.setItem('todo', JSON.stringify(todoList));

  if (currentLink === '#/completed') {
    newListElement.style.display = 'none';
    list.appendChild(newListElement);
    addNewNote.value = '';

    countNotCheckedNotes();
  }
  list.appendChild(newListElement);
  addNewNote.value = '';

  countNotCheckedNotes();
  footer.style.display = '';

  checkToggleAllBtnColor();
};

// ! Ф-ЦИЯ ПОДГРУЖАЕТ ЗАМЕТКИ ИЗ LOCALSTORAGE
const showMyNotes = () => {
  let notesList = '';
  todoList.forEach((note) => {
    notesList += `
    <li id=${note.id} ${note.checked ? 'class="completed"' : ''}>
      <div class="div">
        <input type="checkbox" class="toggle" ${note.checked && 'checked'}>
        <label for="">${note.text}</label>
        <button class="deleteBtn"></button>
      </div>
    </li>
    `;
    list.innerHTML = notesList;
    countNotCheckedNotes();
  });
  checkToggleAllBtnColor();
};

// ! ДОБАВЛЕНИЕ ЗАМЕТКИ НА CLICK
document.addEventListener('click', (event) => {
  if (checkLength(addNewNote.value)) {
    if (event.target.className !== 'new-note') {
      if (event.target.tagName === 'INPUT') {
        event.target.checked = !event.target.checked;
      }
      addNote();
    }
  }
  addNewNote.value = '';
});

// ! ДОБАВЛЕНИЕ НА ENTER
document.addEventListener('keydown', (event) => {
  if (event.code === 'Enter') {
    if (checkLength(addNewNote.value)) {
      addNote();
    }
    addNewNote.value = '';
  }
});

// ! УДАЛЕНИЕ ЗАМЕТКИ
const deleteOneNote = (event) => {
  if (event.target.tagName === 'BUTTON' && addNewNote.value === '') {
    const note = document.getElementById(`${event.target.parentNode.parentNode.id}`);
    note.remove();
    countNotCheckedNotes();
    todoList = todoList.filter((item) => item.id !== event.target.parentNode.parentNode.id);
    localStorage.setItem('todo', JSON.stringify(todoList));

    if (list.children.length === 0) {
      footer.style.display = 'none';
    }

    checkToggleAllBtnColor();
  }
};

list.addEventListener('click', (event) => deleteOneNote(event));

// ! ЗАМЕТКА ВЫПОЛНЕНА
const completeOneNote = (event) => {
  if (event.target.tagName === 'INPUT' && event.target.classList.value === 'toggle') {
    if (event.target.checked === true) {
      const note = document.getElementById(`${event.target.parentNode.parentNode.id}`);
      note.setAttribute('class', 'completed');
      todoList.find((item) => (item.id === event.target.parentNode.parentNode.id ? item.checked = true : false));
      localStorage.setItem('todo', JSON.stringify(todoList));
    } else {
      const note = document.getElementById(`${event.target.parentNode.parentNode.id}`);
      note.classList.remove('completed');
      todoList.find((item) => (item.id === note.id ? item.checked = false : false));
      localStorage.setItem('todo', JSON.stringify(todoList));
    }
    renderRightNotes();
  }
};

list.addEventListener('change', (event) => completeOneNote(event));

// ! АКТИВНЫЕ ЗАМЕТКИ
const changeLinkByFooterButton = (event) => {
  if (event.target.tagName === 'A') {
    const completedNotes = document.querySelectorAll('input.toggle:checked');
    const activeNotes = document.querySelectorAll('input.toggle:not(:checked)');
    if (event.target.innerHTML === 'Active') {
      activeNotes.forEach((note) => { note.parentNode.parentNode.style.display = ''; });
      completedNotes.forEach((note) => { note.parentNode.parentNode.style.display = 'none'; });
    }
    if (event.target.innerHTML === 'Completed') {
      completedNotes.forEach((note) => { note.parentNode.parentNode.style.display = ''; });
      activeNotes.forEach((note) => { note.parentNode.parentNode.style.display = 'none'; });
    }
    if (event.target.innerHTML === 'All') {
      completedNotes.forEach((note) => { note.parentNode.parentNode.style.display = ''; });
      activeNotes.forEach((note) => { note.parentNode.parentNode.style.display = ''; });
    }
  }
  checkToggleAllBtnColor();
};

footerMenu.addEventListener('click', (event) => changeLinkByFooterButton(event));

// ! УДАЛЕНИЕ ВЫПОЛНЕННЫХ ДЕЛ
const deleteAllCompletedNotes = () => {
  if (addNewNote.value === '') {
    const completedNotes = document.querySelectorAll('input.toggle:checked');
    completedNotes.forEach((note) => {
      todoList = todoList.filter((item) => item.id !== note.parentNode.parentNode.id);
      localStorage.setItem('todo', JSON.stringify(todoList));
      note.parentNode.parentNode.remove();
    });
    if (list.children.length === 0) {
      footer.style.display = 'none';
      toggleAll.checked = false;
    }
  }
};

clearCompletedBtn.addEventListener('click', () => deleteAllCompletedNotes());

// ! ПОДГРУЗКА ВСЕХ ЗАМЕТОК
window.addEventListener('load', () => showMyNotes());

// ! ПОЯВЛЕНИЕ РАМКИ НА АКТИВНОЙ КНОПКЕ ПРИ ПЕРЕКЛЮЧЕНИИ
completedNotesList.addEventListener('click', () => showComletedNotes());

activeNotesList.addEventListener('click', () => showActiveNotes());

allNotesList.addEventListener('click', () => showAllNotes());

// ! РЕНДЕРИМ ВЕРНУЮ СТРАНИЦУ ПРИ ПЕРЕЗАГРУЗКЕ (ALL/ACTIVE/COMPLETED)
window.addEventListener('load', () => renderRightNotes());

// ! ОТМЕТИТЬ ВСЕ ЗАМЕТКИ
const changeAllList = () => {
  const completed = document.querySelectorAll('input.toggle:checked');
  const uncompleted = document.querySelectorAll('input.toggle:not(:checked)');

  if (completed && uncompleted.length !== 0) {
    uncompleted.forEach((item) => {
      const noteId = item.parentNode.parentNode.id;
      item.setAttribute('checked', 'checked');
      document.getElementById(noteId).setAttribute('class', 'completed');
      addToStorage(noteId, true);
    });
    toggleAll.checked = true;
  }

  if (completed.length === 0 && uncompleted.length !== 0) {
    uncompleted.forEach((item) => {
      const noteId = item.parentNode.parentNode.id;
      addToStorage(noteId, true);
    });
    toggleAll.checked = true;
  }

  if (completed.length !== 0 && uncompleted.length === 0) {
    completed.forEach((item) => {
      const noteId = item.parentNode.parentNode.id;
      addToStorage(noteId, false);
    });
    toggleAll.checked = false;
  }
  showMyNotes();
  renderRightNotes();
};

toggleAll.addEventListener('click', () => changeAllList());

// ! РЕДАКТИРОВАНИЕ ЗАМЕТКИ
const editOneNote = (event) => {
  if (event.target.tagName !== 'BUTTON' && event.target.tagName !== 'INPUT') {
    const currentBlock = event.target;
    const inputFieldStyle = `
    border-bottom: 1.5px solid transparent;
    background: linear-gradient(90deg, rgb(202, 153, 153), rgb(225, 215, 216), rgb(210, 187, 196));
    box-shadow: inset 0px 0px 0px 100vw #fff; /*Тень направленная внутрь контейнера, перекрывает ненужный фон и оставляет только рамку*/
    `;
    const addEditInput = (noteText, currentItem) => {
      const noteTextTrim = noteText[0].text.replace(/ +/g, ' ').trim();
      const newInputField = document.createElement('input');
      newInputField.style = inputFieldStyle;
      newInputField.setAttribute('value', `${noteTextTrim}`);
      newInputField.setAttribute('class', 'edit');
      newInputField.setAttribute('spellcheck', 'false');
      currentItem.appendChild(newInputField);
      newInputField.focus();
    };

    if (event.target.tagName === 'DIV' && !document.querySelector('.edit')) {
      currentBlock.style.display = 'none';
      const listItem = event.target.parentNode;
      const noteText = todoList.filter((note) => note.id === listItem.id);
      addEditInput(noteText, listItem);
    }

    if (event.target.tagName === 'LI' && !document.querySelector('.edit')) {
      currentBlock.classList.add('for-focus');
      currentBlock.children[0].style.display = 'none';
      const noteText = todoList.filter((note) => note.id === currentBlock.id);
      addEditInput(noteText, currentBlock);
    }

    if (event.target.tagName === 'LABEL' && !document.querySelector('.edit')) {
      currentBlock.parentNode.style.display = 'none';
      const listItem = event.target.parentNode.parentNode;
      currentBlock.classList.add('for-focus');
      const noteText = todoList.filter((note) => note.id === listItem.id);
      addEditInput(noteText, listItem);
    }
  }
};

list.addEventListener(('dblclick'), (event) => editOneNote(event));

// toDo ФУНКЦИЯ ДЛЯ ДОБАВЛЕНИЯ
const editNotes = (editNote) => {
  if (editNote.value) {
    const newNoteText = editNote.value.split(' ');
    const verification = newNoteText.filter((el) => el !== ' ' && el !== '');

    if (verification.length !== 0) {
      const listItem = editNote.parentNode;
      todoList.find((note) => { note.id === listItem.id ? note.text = editNote.value : false; });
      localStorage.setItem('todo', JSON.stringify(todoList));
    }
    showMyNotes();
    renderRightNotes();
  }
  if (editNote.value.length === 0) {
    const listItem = editNote.parentNode;
    const notes = todoList.filter((item) => item.id !== listItem.id);
    listItem.remove();
    todoList = notes;
    localStorage.setItem('todo', JSON.stringify(todoList));
    showMyNotes();
    renderRightNotes();
  }
};

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

// ! ПРИ ЗАПОЛНЕННОМ ИНПУТЕ РЕДАКТИРОВАНИЯ НАЖИМАЕТСЯ ЧЕКБОКС ОТ ЗАМЕТКИ
const addEditedNoteCheckbox = (event) => {
  if (document.querySelector('.edit')) {
    if (event.target.classList.value === 'toggle') {
      const note = document.getElementById(`${event.target.parentNode.parentNode.id}`);

      if (event.target.checked === false && currentLink === '#/completed') {
        note.classList.remove('completed');
        addToStorage(note.id, false);
      }
      if (event.target.checked === true) {
        note.setAttribute('class', 'completed');
        addToStorage(note.id, true);
      } else if (event.target.checked === false) {
        note.classList.remove('completed');
        addToStorage(note.id, false);
      }
    }
  }
};

list.addEventListener('click', (event) => addEditedNoteCheckbox(event));
