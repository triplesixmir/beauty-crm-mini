export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromStorage(key, fallback) {
  return JSON.parse(localStorage.getItem(key)) || fallback;
}

// TODO: сделать fallback для loadFromStorage