import {dom} from "./dom.js";

export function showConfirm({title, text}) {
  return new Promise((resolve) => {

    const modal = document.createElement('div');
    modal.className = 'confirm-modal';
    modal.id = 'confirm-modal';

    modal.innerHTML = `
    <h3 class="confirm-modal__heading"></h3>
    <p class="confirm-modal__text"></p>

    <div class="confirm-modal__buttons">
      <button
        type="button"
        class="confirm-modal__button"
        id="confirm-modal__button-yes"
      >Да, удалить
      </button>

      <button
        type="button"
        class="confirm-modal__button"
        id="confirm-modal__button-no"
      >Нет, отменить
      </button>
    </div>
    `

    modal.querySelector('.confirm-modal__heading').textContent = title;
    modal.querySelector('.confirm-modal__text').textContent = text;

    dom.htmlBodyElement.appendChild(modal);
    let isClosed = false;

    function closeConfirm(result) {
      if (isClosed) return;
      isClosed = true;
      resolve(result);
      modal.remove();
    }

    modal.querySelector('#confirm-modal__button-yes').addEventListener('click', () => {
      closeConfirm(true);
    });

    modal.querySelector('#confirm-modal__button-no').addEventListener('click', () => {
      closeConfirm(false);
    });

  });
}