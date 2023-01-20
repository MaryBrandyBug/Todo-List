const addNewNote = document.querySelector('.new-note');
const list = document.querySelector('.todo-list');
const footer = document.querySelector('.footer');
const footerMenu = document.querySelector('.filters');

// ! Ф-ЦИЯ РАНДОМАЙЗЕР СЛУЧАЙНОГО БОЛЬШОГО ЧИСЛА
function generateRandomId() {
  const randomIdNumber = Math.round(Math.random() * 100000000000);
  return randomIdNumber;
}

// ! ДОБАВЛЕНИЕ ЗАМЕТКИ НА CLICK
document.addEventListener('click', (event) => {
  if (addNewNote.value) {
    const newNoteText = addNewNote.value.split(' ');
    const verification = newNoteText.filter((el) => el !== ' ');

    if (verification.length !== 0) {
      if (event.target.className !== 'new-note') {
        const newListElement = document.createElement('li');
        newListElement.setAttribute('id', generateRandomId());
        newListElement.innerHTML = `
        <div class="div">
          <input type="checkbox" class="toggle">
          <label for="">${newNoteText.join(' ')}</label>
          <button class="deleteBtn"></button>
        </div>`;
        list.appendChild(newListElement);
        addNewNote.value = '';
      }
    } else {
      addNewNote.value = '';
    }
  }
});

// ! ДОБАВЛЕНИЕ НА ENTER
document.addEventListener('keydown', (event) => {
  if (event.code === 'Enter') {
    if (addNewNote.value) {
      const newNoteText = addNewNote.value.split(' ');
      const verification = newNoteText.filter((el) => el !== ' ');

      if (verification.length !== 0) {
        const newListElement = document.createElement('li');
        newListElement.setAttribute('id', generateRandomId());
        newListElement.innerHTML = `
          <div class="div">
            <input type="checkbox" class="toggle">
            <label for="">${newNoteText.join(' ')}</label>
            <button class="deleteBtn"></button>
          </div>`;
        list.appendChild(newListElement);
        addNewNote.value = '';
      } else {
        addNewNote.value = '';
      }
    }
  }
});

// ! УДАЛЕНИЕ ЗАМЕТКИ
list.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    const note = document.getElementById(`${event.target.parentNode.parentNode.id}`);
    note.remove();
  }
});

// ! ЗАМЕТКА ВЫПОЛНЕНА
list.addEventListener('change', (event) => {
  if (event.target.tagName === 'INPUT') {
    if (event.target.checked === true) {
      const note = document.getElementById(`${event.target.parentNode.parentNode.id}`);
      note.setAttribute('class', 'complited');
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
  needsToDo.innerHTML = `${allComplitedNotes.length}`;

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
