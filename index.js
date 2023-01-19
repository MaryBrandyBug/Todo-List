const addNewNote = document.querySelector('.new-note');
const list = document.querySelector('.todo-list');

document.addEventListener('click', () => {
  if (addNewNote.value) {
    const newNoteText = addNewNote.value.split(' ');
    const verification = newNoteText.filter((el) => el !== ' ');

    if (verification.length !== 0) {
      if (event.target.className !== 'new-note') {
        const newListElement = document.createElement('li');
        newListElement.innerHTML = `
        <div class="div">
          <input type="checkbox" class="toggle">
          <label for="">${newNoteText.join(' ')}</label>
        </div>`;
        list.appendChild(newListElement);
        addNewNote.value = '';
      }
    } else {
      addNewNote.value = '';
    }
  }
});
