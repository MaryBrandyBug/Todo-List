const addNewNote = document.querySelector('.new-note');
const list = document.querySelector('.todo-list');

// ! Ф-ЦИЯ РАНДОМАЙЗЕР СЛУЧАЙНОГО БОЛЬШОГО ЧИСЛА
function generateRandomId() {
  const randomIdNumber = Math.round(Math.random() * 100000000000);
  return randomIdNumber;
}

// ! ДОБАВЛЕНИЕ ЗАМЕТКИ
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

// ! УДАЛЕНИЕ ЗАМЕТКИ
list.addEventListener('click', (event) => {
  if (event.target.tagName === 'BUTTON') {
    const note = document.getElementById(`${event.target.parentNode.parentNode.id}`);
    note.remove();
  }
});
