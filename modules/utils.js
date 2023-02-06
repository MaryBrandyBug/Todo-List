// ! Ф-ЦИЯ РАНДОМАЙЗЕР СЛУЧАЙНОГО БОЛЬШОГО ЧИСЛА
export function generateRandomId() {
  const randomIdNumber = Math.round(Math.random() * 100000000000);
  return randomIdNumber;
}

// ! Ф-ЦИЯ ПРОВЕРКИ НА ДЛИНУ ЗАМЕТКИ (НА ПУСТУЮ ЗАМЕТКУ)
export function checkLength(note) {
  if (note) {
    const verification = note.trim();
    if (verification.length !== 0) {
      return true;
    }
  }
  return false;
}
