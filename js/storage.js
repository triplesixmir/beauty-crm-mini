export function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

export function loadFromStorage(key, fallback) {
  try {
    const data = localStorage.getItem(key);

    if (data === null) {
      return fallback;
    }

    return JSON.parse(data);
  } catch (error) {
    console.warn(`Не удалось прочитать ${key} из localStorage:`, error);
    return fallback;
  }
}