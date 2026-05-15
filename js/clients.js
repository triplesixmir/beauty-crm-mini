import {states} from "./states.js";
import {dom} from "./dom.js";
import {formatDate, formatMoney, setTextForSelector, today} from "./utils.js";
import {renderDashboardStats} from "./dashboard.js";
import {saveToStorage} from "./storage.js";
import {renderNearestAppointments} from "./appointments.js";

export function renderLatestClients(clientsArray) {
  const latestClients = [...clientsArray].slice(0, states.visibleClientsCount);

  renderClients(latestClients);

  if (clientsArray.length <= states.visibleClientsCount) return;

  const showMoreButton = document.createElement('button');
  showMoreButton.className = 'show-more-btn';
  showMoreButton.id = 'show-more-btn';
  showMoreButton.textContent = 'Показать еще';

  dom.clientsContainer.appendChild(showMoreButton);
}

export function renderClients(clientsArray) {
  dom.clientsContainer.innerHTML = '';

  if (clientsArray.length === 0) {
    const noClients = document.createElement('p');
    noClients.className = 'no-clients';
    noClients.textContent = 'Клиентов не найдено';

    dom.clientsContainer.appendChild(noClients);
    return;
  }

  clientsArray.forEach(client => {
    const card = document.createElement('div');
    card.className = 'client-card';

    const cleanTel = client.tel.replaceAll(/\D/g, '');
    const localeDate = formatDate(client.lastVisit);
    const totalSpent = formatMoney(client.totalSpent);

    card.innerHTML = `
        <div class="client-card__main-info">
            <img src="/clients-pictures/default-profile-picture.jpg" alt="Фото клиента">
            <div class="client-card__identity">
                <h2 class="client-card__name"></h2>
                <p class="client-card__id"></p>
            </div>
        </div>

        <div class="client-card__details">
            <p>Телефон<a class="client-card__tel"></a></p>
            <p>Telegram<a class="client-card__telegram" target="_blank" rel="noopener noreferrer"></a></p>
            <p>Последний визит<span class="client-card__last-visit"></span></p>
            <p>Всего потрачено<span class="client-card__total-spent"></span></p>
        </div>
        
        <div class="client-card__actions">
            <button class="client-card__edit-btn">Редактировать</button>
            <button class="client-card__delete-btn">Удалить</button>
        </div>
        `;

    // Вставка переменных через textContent для безопасности от XSS-атак
    setTextForSelector(card, '.client-card__name', client.name);
    setTextForSelector(card, '.client-card__id', client.id);
    setTextForSelector(card, '.client-card__tel', `+${cleanTel}`);
    const clientCardTelLink = card.querySelector('.client-card__tel');
    clientCardTelLink.href = `tel:+${cleanTel}`;
    setTextForSelector(card, '.client-card__telegram', `@${client.telegram}`);
    const clientCardTelegramLink = card.querySelector('.client-card__telegram');
    clientCardTelegramLink.href = `https://t.me/${client.telegram.replace('@', '')}`;
    setTextForSelector(card, '.client-card__last-visit', localeDate);
    setTextForSelector(card, '.client-card__total-spent', totalSpent);
    const clientCardEditButton = card.querySelector('.client-card__edit-btn');
    clientCardEditButton.dataset.id = client.id;
    const clientCardDeleteButton = card.querySelector('.client-card__delete-btn');
    clientCardDeleteButton.dataset.id = client.id;

    dom.clientsContainer.appendChild(card);
  });

}

dom.clientsContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('show-more-btn')) {
    states.visibleClientsCount += 5;
    renderLatestClients(states.currentClientsView);
  }
});

// TODO: переработать CSS-отображение информации о клиентах (все полетело из-за изменения принципа работы функции)

dom.addClientForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const name = document.getElementById('client-name').value;
  const tel = document.getElementById('client-tel').value;
  const telegram = document.getElementById('client-tg').value.trim().replace(/^@/, '');
  const telegramRegex = /^[a-zA-Z]\w{4,31}$/;
  const lastVisit = document.getElementById('client-last_visit').value;
  const totalSpent = document.getElementById('client-total_spent').value;

  if (!name || !tel || !telegram || !lastVisit || !totalSpent) {
    alert('Пожалуйста, заполните все поля');
    return;
  }

  if (!telegramRegex.test(telegram)) {
    alert('Telegram должен быть 5-32 символа: латиница, цифры и _, первый символ буква');
    return;
  }

  if (states.editingClientId) {
    // обновить клиента через map
    states.clients = states.clients.map(client => {
      if(client.id === states.editingClientId) {
        return {
          ...client,
          name,
          tel,
          telegram,
          lastVisit,
          totalSpent
        }
      } else {
        return client;
      }
    });

  } else {
    // создать newClient и push
    const newClient = {
      id: Date.now(),
      name,
      tel,
      telegram,
      lastVisit,
      totalSpent
    };

    states.clients.push(newClient);

  }

  resetClientForm();
  saveClients();
  states.currentClientsView = states.clients;
  renderLatestClients(states.currentClientsView);
  renderClientOptions();
  renderNearestAppointments();
  renderDashboardStats();
  closeClientModal();
});

dom.clientsContainer.addEventListener('click', function (event) {
  if(event.target.classList.contains('client-card__delete-btn')) {
    const clientId = Number(event.target.dataset.id);

    if (globalThis.confirm('Вы уверены, что хотите удалить клиента?')) {

      states.clients = states.clients.filter(client => client.id !== clientId);
      saveClients();

      states.currentClientsView = states.clients;
      renderLatestClients(states.currentClientsView);
      renderClientOptions();
      renderNearestAppointments();
      renderDashboardStats();

    } else {
      return;
    }
  }

  // Редактирование клиента
  if(event.target.classList.contains('client-card__edit-btn')) {

    openClientModal()
    document.getElementById('submit-client-btn').textContent = 'Обновить клиента';

    const clientId = Number(event.target.dataset.id);
    const clientToEdit = states.clients.find(client => client.id === clientId);

    // Ищем каждый инпут и вставляем туда инфу нашего клиента
    document.getElementById('client-name').value = clientToEdit.name;
    document.getElementById('client-tel').value = clientToEdit.tel;
    document.getElementById('client-tg').value = '@' + clientToEdit.telegram;
    document.getElementById('client-last_visit').value = clientToEdit.lastVisit;
    document.getElementById('client-total_spent').value = clientToEdit.totalSpent;

    states.editingClientId = clientId;
    renderDashboardStats()
  }
});

const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', function () {
  let searchTerm = searchInput.value.toLowerCase();

  states.currentClientsView = states.clients.filter(client => {
    return client.name.toLowerCase().includes(searchTerm);
  });

  states.visibleClientsCount = 5;
  renderLatestClients(states.currentClientsView);
});

const sortSelect = document.getElementById('sort-clients');

sortSelect.addEventListener('change', function () {
  const sortOrder = sortSelect.value;
  states.visibleClientsCount = 5;

  if(sortOrder === 'alphabet-up-sort') {
    states.currentClientsView = [...states.clients].sort((a, b) => a.name.localeCompare(b.name));
    renderLatestClients(states.currentClientsView);
  } else if(sortOrder === 'alphabet-down-sort') {
    states.currentClientsView = [...states.clients].sort((a, b) => b.name.localeCompare(a.name));
    renderLatestClients(states.currentClientsView);
  } else if(sortOrder === 'last-visit-sort') {
    states.currentClientsView = [...states.clients].sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
    renderLatestClients(states.currentClientsView);
  } else if(sortOrder === 'total-spent-sort') {
    states.currentClientsView = [...states.clients].sort((a, b) => Number(b.totalSpent) - Number(a.totalSpent));
    renderLatestClients(states.currentClientsView);
  } else {
    alert("Такая сортировка не предусмотрена: " + sortOrder);
  }
});

function resetClientForm() {
  states.editingClientId = null;
  document.getElementById('submit-client-btn').textContent = 'Добавить клиента';
  dom.addClientForm.reset();
  dom.dateInput.value = today;
}

dom.clientsContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('show-more-btn')) {
    states.visibleClientsCount += 5;
    renderLatestClients(states.currentClientsView);
  }
});

function saveClients() {

  saveToStorage('clients', states.clients)

}

export function renderClientOptions() {
  dom.appointmentClientsSelect.innerHTML = '';

  states.clients.forEach(client => {
    const option = document.createElement('option');
    option.value = client.id;
    option.textContent = client.name;
    dom.appointmentClientsSelect.appendChild(option);
  });

}

dom.clientsActionsContainer.addEventListener('click', function (event) {
  if (event.target.id === 'open-add-client-modal-btn') {
    openClientModal()

    resetClientForm();
  }
});

document.querySelector('.add-client-modal__close-btn').addEventListener('click', function () {
  closeClientModal()

  resetClientForm();
});

function openClientModal() {
  document.getElementById('add-client-modal').classList.remove('hidden');
}

function closeClientModal() {
  document.getElementById('add-client-modal').classList.add('hidden');
}

dom.htmlBodyElement.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    if (!document.getElementById('add-client-modal').classList.contains('hidden')) {
      closeClientModal();
    }
  }
});

document.getElementById('add-client-modal').addEventListener('click', function (event) {
  if (event.target.id === 'add-client-modal') {
    closeClientModal();
    resetClientForm();
  }
});