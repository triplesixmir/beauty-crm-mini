import {states} from "./states.js";
import {dom} from "./dom.js";
import {formatDate, formatMoney, setTextForSelector, today} from "./utils.js";
import {renderDashboardStats} from "./dashboard.js";
import {saveToStorage} from "./storage.js";
import {updateAppointmentsView} from "./appointments.js";

export function initClients() {
  dom.addClientForm.addEventListener('submit', handleAddClientFormSubmit);
  dom.clientsContainer.addEventListener('click', handleClientsShowMoreButtonClick);
  dom.clientsContainer.addEventListener('click', handleClientsDeleteEdit);
  dom.clientsSection.addEventListener('click', handleOpenClientModal);
  dom.addClientModalCloseButton.addEventListener('click', handleCloseClientModalButton);
  dom.htmlBodyElement.addEventListener('keydown', handleCloseClientModalEscape);
  dom.addClientModal.addEventListener('click', handleCloseClientModalBackdrop);
  dom.clientsSortSelect.addEventListener('change', handleSortSelectChange);
  dom.clientsSearchInput.addEventListener('input', handleSearchInput);

  renderLatestClients(states.clients);
  renderClientOptions();
}

function updateClientsView() {

  let result = [...states.clients];

  if (states.searchTerm) {
    result = result.filter(client =>
      client.name.toLowerCase().includes(states.searchTerm)
    );
  }

  if (states.sortOrder !== 'default-sort') {

    if (states.sortOrder === 'alphabet-up-sort') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (states.sortOrder === 'alphabet-down-sort') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (states.sortOrder === 'last-visit-sort') {
      result.sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
    } else if (states.sortOrder === 'total-spent-sort') {
      result.sort((a, b) => Number(b.totalSpent) - Number(a.totalSpent));
    } else {
      alert("Такая сортировка не предусмотрена: " + states.sortOrder);
    }

  }

  states.currentClientsView = result;
  renderLatestClients(states.currentClientsView);
}

function handleSearchInput(event) {
  states.searchTerm = event.target.value.toLowerCase();
  states.visibleClientsCount = 4;
  updateClientsView();
}

function handleSortSelectChange(event) {
  states.sortOrder = event.target.value;
  states.visibleClientsCount = 4;
  updateClientsView();
}

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

function handleClientsShowMoreButtonClick(event) {
  if (event.target.classList.contains('show-more-btn')) {
    states.visibleClientsCount += 4;
    updateClientsView();
  }
}

// TODO: переработать CSS-отображение информации о клиентах (все полетело из-за изменения принципа работы функции)

function handleAddClientFormSubmit(event) {
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
      if (client.id === states.editingClientId) {
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
  updateClientsView();
  renderClientOptions();
  updateAppointmentsView();
  renderDashboardStats();
  hideClientModal();
}

function handleClientsDeleteEdit(event) {
  if (event.target.classList.contains('client-card__delete-btn')) {
    const clientId = Number(event.target.dataset.id);

    if (globalThis.confirm('Вы уверены, что хотите удалить клиента?')) {

      states.clients = states.clients.filter(client => client.id !== clientId);
      saveClients();

      states.currentClientsView = states.clients;
      updateClientsView();
      renderClientOptions();
      updateAppointmentsView();
      renderDashboardStats();

    } else {
      return;
    }
  }

  // Редактирование клиента
  if (event.target.classList.contains('client-card__edit-btn')) {

    showClientModal()
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
}

function resetClientForm() {
  states.editingClientId = null;
  document.getElementById('submit-client-btn').textContent = 'Добавить клиента';
  dom.addClientForm.reset();
  dom.dateInput.value = today;
}

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

function handleOpenClientModal(event) {
  if (event.target.id === 'open-add-client-modal-btn') {
    showClientModal()
    resetClientForm();
  }
}

function handleCloseClientModalButton() {
  hideClientModal()
  resetClientForm();
}

function showClientModal() {
  document.getElementById('add-client-modal').classList.remove('hidden');
}

function hideClientModal() {
  document.getElementById('add-client-modal').classList.add('hidden');
}

function handleCloseClientModalEscape(event) {
  if (event.key === 'Escape') {
    if (!document.getElementById('add-client-modal').classList.contains('hidden')) {
      hideClientModal();
    }
  }
}

function handleCloseClientModalBackdrop(event) {
  if (event.target.id === 'add-client-modal') {
    hideClientModal();
    resetClientForm();
  }
}