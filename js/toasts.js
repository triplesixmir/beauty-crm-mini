import {dom} from "./dom.js";

export function showToast({ title, text, type = 'info', duration = 5000 }) {
  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;

  const closeButton = document.createElement('button');
  closeButton.type = 'button';
  closeButton.textContent = '×';

  const titleElement = document.createElement('h3');
  titleElement.textContent = title;

  const textElement = document.createElement('p');
  textElement.textContent = text;

  toast.append(closeButton, titleElement, textElement);
  dom.toastsSection.appendChild(toast);

  let closeTimerId = setTimeout(closeToast, duration);
  let isClosing = false;

  function closeToast() {
    if (isClosing) {
      return;
    }

    isClosing = true;
    clearTimeout(closeTimerId);
    toast.classList.add('toast--closing');

    setTimeout(() => {
      toast.remove();
    }, 300);
  }

  toast.addEventListener('mouseenter', () => {
    clearTimeout(closeTimerId);
  });

  toast.addEventListener('mouseleave', () => {
    closeTimerId = setTimeout(closeToast, duration);
  });

  closeButton.addEventListener('click', closeToast);
}