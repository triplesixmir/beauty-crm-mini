Inputmask("+7 999 999-99-99").mask("#client-tel");

//<editor-fold desc="Получение HTML элементов">
const htmlBodyElement = document.querySelector('body');
const htmlMainElement = document.querySelector('.dashboard');
const addClientForm = document.getElementById('addClientForm');
const appointmentForm = document.getElementById('appointment-form');
const clientsContainer = document.getElementById('clients-section__content');
const clientsActionsContainer = document.getElementById('add-client-btn-container');
const appointmentsContainer = document.getElementById('appointments-section__content');
const appointmentClientsSelect = document.getElementById('appointment-clients');
const appointmentsList = document.getElementById('appointments-section__list');
const dateInput = document.getElementById('client-last_visit');
//</editor-fold>

//<editor-fold desc="UI-mapping массивы">
const services = {
  'service-manicure': 'Маникюр',
  'service-pedicure': 'Педикюр',
  'service-haircut': 'Стрижка',
  'service-depilation': 'Депиляция',
  'service-laying': 'Укладка'
};
//</editor-fold>

const today = new Date().toISOString().split('T')[0];
dateInput.max = today;
dateInput.value = today;

let clients = JSON.parse(localStorage.getItem('clients')) || [];
let currentClientsView = clients;
let visibleClientsCount = 5;
let editingClientId = null;
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let visibleAppointmentsCount = 6;

//<editor-fold desc="Форматирование даты и стоимости">
function formatDate(dateString) { return new Intl.DateTimeFormat("ru-RU", {
  dateStyle: 'full',}).format(new Date(dateString)); }
function formatMoney(price) { return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price) }
//</editor-fold>

renderLatestClients(currentClientsView);
renderClientOptions();
renderNearestAppointments();
renderDashboardStats();

//<editor-fold desc="Сохранение массива клиентов">
function saveClients() {

  localStorage.setItem('clients', JSON.stringify(clients));

}
//</editor-fold>

//<editor-fold desc="Обновление/добавление клиента">
addClientForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const name = document.getElementById('client-name').value;
  const tel = document.getElementById('client-tel').value;
  const telegram = document.getElementById('client-tg').value.replace('@', '');
  const lastVisit = document.getElementById('client-last_visit').value;
  const totalSpent = document.getElementById('client-total_spent').value;

  if (editingClientId) {
    // обновить клиента через map
    clients = clients.map(client => {
      if(client.id === editingClientId) {
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

    clients.push(newClient);

  }

  resetClientForm();
  saveClients();
  currentClientsView = clients;
  renderLatestClients(currentClientsView);
  renderClientOptions();
  renderNearestAppointments();
  renderDashboardStats();
  closeClientModal();
});
//</editor-fold>

//<editor-fold desc="Рендер клиентов">
function renderLatestClients(clientsArray) {
  const latestClients = [...clientsArray].slice(0, visibleClientsCount);

  renderClients(latestClients);

  if (clientsArray.length <= visibleClientsCount) return;

  const showMoreButton = document.createElement('button');
  showMoreButton.className = 'show-more-btn';
  showMoreButton.id = 'show-more-btn';
  showMoreButton.textContent = 'Показать еще';

  clientsContainer.appendChild(showMoreButton);
}

function renderClients(clientsArray) {
  clientsContainer.innerHTML = '';

  if (clientsArray.length === 0) {
    const noClients = document.createElement('p');
    noClients.className = 'no-clients';
    noClients.innerHTML = `
        Клиентов не найдено
        `
    clientsContainer.appendChild(noClients);
    return;
  }

  clientsArray.forEach(client => {
    const card = document.createElement('div');
    card.className = 'client-card';

    const cleanTel = client.tel.replace(/\D/g, '');
    const localeDate = formatDate(client.lastVisit);
    const totalSpent = formatMoney(client.totalSpent);

    card.innerHTML = `
        <div class="client-card__main-info">
            <img src="clients-pictures/default-profile-picture.jpg" alt="Фото клиента">
            <div class="client-card__name">
                <h4>${client.name}</h4>
                <p>${client.id}</p>
            </div>
        </div>

        <div class="client-card__details">
            <p><span>Телефон</span><a href="tel:+${cleanTel}">${client.tel}</a></p>
            <p><span>Telegram</span><a href="https://t.me/${client.telegram.replace('@', '')}" target="_blank" rel="noopener noreferrer">@${client.telegram}</a></p>
            <p><span>Последний визит</span>${localeDate}</p>
            <p><span>Всего потрачено</span>${totalSpent}</p>
        </div>
        
        <div class="client-card__actions">
            <button class="client-card__edit-btn" data-id="${client.id}">Редактировать</button>
            <button class="client-card__delete-btn" data-id="${client.id}">Удалить</button>
        </div>
        `;

    clientsContainer.appendChild(card);
  });

}
//</editor-fold>

//<editor-fold desc="Обработка нажатия по 'Показать еще'">
clientsContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('show-more-btn')) {
    visibleClientsCount += 5;
    renderLatestClients(currentClientsView);
  }
});
//</editor-fold>

//<editor-fold desc="Обработка нажатия по 'Показать еще' записей">
appointmentsContainer.addEventListener('click', function (event) {
  if (event.target.classList.contains('show-more-btn')) {
    visibleAppointmentsCount += 6;
    renderNearestAppointments()
  }
});
//</editor-fold>

//<editor-fold desc="Удаление и редактирование клиента">
clientsContainer.addEventListener('click', function (event) {
  if(event.target.classList.contains('client-card__delete-btn')) {
    const clientId = Number(event.target.dataset.id);

    if (window.confirm('Вы уверены, что хотите удалить клиента?')) {

      clients = clients.filter(client => client.id !== clientId);
      saveClients();

      currentClientsView = clients;
      renderLatestClients(currentClientsView);
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
    const clientToEdit = clients.find(client => client.id === clientId);

    // Ищем каждый инпут и вставляем туда инфу нашего клиента
    document.getElementById('client-name').value = clientToEdit.name;
    document.getElementById('client-tel').value = clientToEdit.tel;
    document.getElementById('client-tg').value = '@' + clientToEdit.telegram;
    document.getElementById('client-last_visit').value = clientToEdit.lastVisit;
    document.getElementById('client-total_spent').value = clientToEdit.totalSpent;

    editingClientId = clientId;
    renderDashboardStats()
  }
});
//</editor-fold>

//<editor-fold desc="Поиск клиентов">
const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', function () {
  let searchTerm = searchInput.value.toLowerCase();

  currentClientsView = clients.filter(client => {
    return client.name.toLowerCase().includes(searchTerm);
  });

  visibleClientsCount = 4;
  renderLatestClients(currentClientsView);
});
//</editor-fold>

//<editor-fold desc="Сортировка клиентов">
const sortSelect = document.getElementById('sort-clients');

sortSelect.addEventListener('change', function () {
  const sortOrder = sortSelect.value;
  visibleClientsCount = 4;

  if(sortOrder === 'alphabet-up-sort') {
    currentClientsView = [...clients].sort((a, b) => a.name.localeCompare(b.name));
    renderLatestClients(currentClientsView);
  } else if(sortOrder === 'alphabet-down-sort') {
    currentClientsView = [...clients].sort((a, b) => b.name.localeCompare(a.name));
    renderLatestClients(currentClientsView);
  } else if(sortOrder === 'last-visit-sort') {
    currentClientsView = [...clients].sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit));
    renderLatestClients(currentClientsView);
  } else if(sortOrder === 'total-spent-sort') {
    currentClientsView = [...clients].sort((a, b) => Number(b.totalSpent) - Number(a.totalSpent));
    renderLatestClients(currentClientsView);
  } else {
    console.warn('Такая сортировка не предусмотрена:', sortOrder);
  }
});
//</editor-fold>

//<editor-fold desc="Рендер клиентов при создании записи">
function renderClientOptions() {
  appointmentClientsSelect.innerHTML = '';

  clients.forEach(client => {
    const option = document.createElement('option');
    option.value = client.id;
    option.textContent = client.name;
    appointmentClientsSelect.appendChild(option);
  });

}
//</editor-fold>

//<editor-fold desc="Сохранение массива при создании записи">
function saveAppointments() {

  localStorage.setItem('appointments', JSON.stringify(appointments));

}
//</editor-fold>

//<editor-fold desc="Сброс формы после редактирования/создания клиента">
function resetClientForm() {
  editingClientId = null;
  document.getElementById('submit-client-btn').textContent = 'Добавить клиента';
  addClientForm.reset();
  dateInput.value = today;
}
//</editor-fold>

//<editor-fold desc="Обработка создания новой записи">
appointmentForm.addEventListener('submit', function (event) {
  event.preventDefault();

  const clientId = Number(appointmentClientsSelect.value);
  const date = document.getElementById('appointment-date').value;
  const time = document.getElementById('appointment-time').value;
  const price = Number(document.getElementById('appointment-price').value);
  const service = document.querySelector('input[name="appointment-service"]:checked').value

  const newAppointment = {
    appointmentId: Date.now(),
    clientId,
    date,
    time,
    price,
    service
  }

  appointments.push(newAppointment);
  saveAppointments();
  renderNearestAppointments();
  renderDashboardStats();
  appointmentForm.reset();
});
//</editor-fold>

//<editor-fold desc="Рендер БЛИЖАЙШИХ записей">
function renderNearestAppointments() {
  const nearestAppointments = [...appointments]
    .filter(appointment => appointment.date >= today)
    .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
    .slice(0, visibleAppointmentsCount);
  const futureAppointments = [...appointments].filter(appointment => appointment.date >= today);

  renderAppointments(nearestAppointments);

  if (futureAppointments.length <= visibleAppointmentsCount) return;

  const showMoreButton = document.createElement('button');
  showMoreButton.className = 'show-more-btn';
  showMoreButton.id = 'show-more-appointments-btn';
  showMoreButton.textContent = 'Показать еще';

  appointmentsList.appendChild(showMoreButton);
}
//</editor-fold>

//<editor-fold desc="Рендер ВСЕХ записей">
function renderAppointments(appointmentsArray) {
  appointmentsList.innerHTML = '';

  if (appointmentsArray.length === 0) {
    const noAppointments = document.createElement('p');
    noAppointments.className = 'no-appointments';
    noAppointments.innerHTML = `
        Записей не найдено
        `
    appointmentsList.appendChild(noAppointments);
    return;
  }

  appointmentsArray.forEach(appointment => {
    const card = document.createElement('div');
    card.className = 'appointment-card';
    const client = clients.find(client => {
      return client.id === appointment.clientId;
    });
    const price = formatMoney(appointment.price);
    const date = formatDate(appointment.date);

    card.innerHTML = `
            <p>Клиент: ${client ? client.name : 'Клиент удалён'}</p>
            <p>Дата: ${date}</p>
            <p>Время: ${appointment.time}</p>
            <p>Услуга: ${services[appointment.service] || 'Неизвестная услуга'}</p>
            <p>Цена: ${price}</p>
            
            <button class="appointment-card__delete-btn" data-id="${appointment.appointmentId}">
                Удалить
            </button>
        `;

    appointmentsList.appendChild(card);
  });
}
//</editor-fold>

//<editor-fold desc="Удаление записи">
appointmentsList.addEventListener('click', function (event) {
  if (event.target.classList.contains('appointment-card__delete-btn')) {
    const appointmentId = Number(event.target.dataset.id);

    if (window.confirm('Вы уверены, что хотите удалить запись?')) {
      appointments = appointments.filter(appointment => appointment.appointmentId !== appointmentId);
      saveAppointments();
      renderNearestAppointments();
      renderDashboardStats();
    }
  }
});
//</editor-fold>

//<editor-fold desc="Отрытие модалки">
clientsActionsContainer.addEventListener('click', function (event) {
  if (event.target.id === 'open-add-client-modal-btn') {
    openClientModal()

    resetClientForm();
  }
});
//</editor-fold>

//<editor-fold desc="Закрытие модалки">
document.querySelector('.add-client-modal__close-btn').addEventListener('click', function () {
  closeClientModal()

  // Сброс состояния при закрытии модалки на "Отменить"
  resetClientForm();
});
//</editor-fold>

//<editor-fold desc="Функции скрытия/показа модалки">
function openClientModal() {
  document.getElementById('add-client-modal').classList.remove('hidden');
}

function closeClientModal() {
  document.getElementById('add-client-modal').classList.add('hidden');
}
//</editor-fold>

//<editor-fold desc="Выход из модалки по нажатию Escape">
htmlBodyElement.addEventListener('keydown', function (event) {
  if (event.key === 'Escape') {
    if (!document.getElementById('add-client-modal').classList.contains('hidden')) {
      closeClientModal();
    }
  }
});
//</editor-fold>

//<editor-fold desc="Выход из модалки по нажатию на бэкдроп">
document.getElementById('add-client-modal').addEventListener('click', function (event) {
  if (event.target.id === 'add-client-modal') {
    closeClientModal();
    resetClientForm();
  }
});
//</editor-fold>

//<editor-fold desc="Рендер дэшборд-статистики">
function renderDashboardStats() {
  const clientsCount = clients.length;
  const appointmentsCount = appointments.length;

  const initialValue = 0;
  const overallMoney = formatMoney(clients.reduce((accumulator, client) => {
    return accumulator + Number(client.totalSpent);
  }, initialValue))

  const nearestAppointment = [...appointments]
    .filter(appointment => appointment.date >= today)
    .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
    [0];

  const nearestAppointmentText = nearestAppointment ? formatDate(nearestAppointment.date) + ' в ' + nearestAppointment.time : 'Нет ближайших записей';

  const statsContainer = document.querySelector('.dashboard__stats');
  statsContainer.innerHTML = `
    <div class="stats-item" id="dashboard__stats-clients">
      <div class="stats-icon">
        <img
          src="/svg/stats-icons/total-clients.svg"
          alt=""
        ></div>
      <div class="stats-info">
        <h2>Всего клиентов</h2>
        <p>${clientsCount} клиентов</p>
      </div>
    </div>

    <div class="stats-item" id="dashboard__stats-appointments">
      <div class="stats-icon">
        <img
          src="/svg/stats-icons/total-appointments.svg"
          alt=""
        ></div>
      <div class="stats-info">
        <h2>Всего записей</h2>
        <p>${appointmentsCount} записей</p>
      </div>
    </div>

    <div class="stats-item" id="dashboard__stats-money">
      <div class="stats-icon">
        <img
          src="/svg/stats-icons/overall-money.svg"
          alt=""
        ></div>
      <div class="stats-info">
        <h2>Всего выручки</h2>
        <p>${overallMoney}</p>
      </div>
    </div>

    <div class="stats-item" id="dashboard__stats-nearest-appointment">
      <div class="stats-icon">
        <img
          src="/svg/stats-icons/nearest-appointment.svg"
          alt=""
        ></div>
      <div class="stats-info">
        <h2>Ближайшая запись</h2>
        <p>${nearestAppointmentText}</p>
      </div>
    </div>
  </div>
  `

}
//</editor-fold>