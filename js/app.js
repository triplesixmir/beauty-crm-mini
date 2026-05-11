Inputmask("+7 999 999-99-99").mask("#client-tel");

const htmlBodyElement = document.querySelector('body');
const addClientForm = document.getElementById('addClientForm');
const appointmentForm = document.getElementById('appointment-form');
const clientsContainer = document.getElementById('clients-section__content');
const clientsActionsContainer = document.getElementById('add-client-btn-container');
const appointmentClientsSelect = document.getElementById('appointment-clients');
const appointmentsList = document.getElementById('appointments-section__list');
const services = {
    'service-manicure': 'Маникюр',
    'service-pedicure': 'Педикюр',
    'service-haircut': 'Стрижка',
    'service-depilation': 'Депиляция',
    'service-laying': 'Укладка'
};

const dateInput = document.getElementById('client-last_visit');
const today = new Date().toISOString().split('T')[0];
dateInput.max = today;
dateInput.value = today;

let visibleClientsCount = 5;
let clients = JSON.parse(localStorage.getItem('clients')) || [];
let currentClientsView = clients;
let appointments = JSON.parse(localStorage.getItem('appointments')) || [];
let editingClientId = null;

//region Форматирование даты и стоимости
function formatDate(dateString) { return new Intl.DateTimeFormat("ru-RU", {
    dateStyle: "full",}).format(new Date(dateString)); }
function formatMoney(price) { return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price) }
//endregion

renderLatestClients(currentClientsView);
renderClientOptions();
renderNearestAppointments();

function saveClients() {

    localStorage.setItem('clients', JSON.stringify(clients));

}

// Добавление клиента
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
    closeClientModal();
});

//region Рендер клиентов
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
//endregion

clientsContainer.addEventListener('click', function (event) {
    if (event.target.classList.contains('show-more-btn')) {
        visibleClientsCount += 5;
        renderLatestClients(currentClientsView);
    }
});

// Удаление клиента
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

    }
});

// Поиск клиента

const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', function () {
    let searchTerm = searchInput.value.toLowerCase();

    currentClientsView = clients.filter(client => {
        return client.name.toLowerCase().includes(searchTerm);
    });

    visibleClientsCount = 4;
    renderLatestClients(currentClientsView);
});

//region Сортировка клиентов
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
//endregion

// Записи

function renderClientOptions() {
    appointmentClientsSelect.innerHTML = '';

    clients.forEach(client => {
        const option = document.createElement('option');
        option.value = client.id;
        option.textContent = client.name;
        appointmentClientsSelect.appendChild(option);
    });

}

// Сохранение записей

function saveAppointments() {

    localStorage.setItem('appointments', JSON.stringify(appointments));

}

function resetClientForm() {
    editingClientId = null;
    document.getElementById('submit-client-btn').textContent = 'Добавить клиента';
    addClientForm.reset();
    dateInput.value = today;
}

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
    appointmentForm.reset();
});

function renderNearestAppointments() {
    const nearestAppointments = [...appointments]
        .filter(appointment => appointment.date >= today)
        .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
        .slice(0, 5);

    renderAppointments(nearestAppointments);
}

// Рендер записей
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

// Удаление записи
appointmentsList.addEventListener('click', function (event) {
    if (event.target.classList.contains('appointment-card__delete-btn')) {
        const appointmentId = Number(event.target.dataset.id);

        if (window.confirm('Вы уверены, что хотите удалить запись?')) {
            appointments = appointments.filter(appointment => appointment.appointmentId !== appointmentId);
            saveAppointments();
            renderNearestAppointments();
        }
    }
});

// Появление модалки
clientsActionsContainer.addEventListener('click', function (event) {
    if (event.target.id === 'open-add-client-modal-btn') {
        openClientModal()

        resetClientForm();
    }
});

// Закрытие модалки

document.querySelector('.add-client-modal__close-btn').addEventListener('click', function () {
    closeClientModal()

    // Сброс состояния при закрытии модалки на "Отменить"
    resetClientForm();
});

// Функции для открытия/закрытия модалки

function openClientModal() {
    document.getElementById('add-client-modal').classList.remove('hidden');
}

function closeClientModal() {
    document.getElementById('add-client-modal').classList.add('hidden');
}

// Выход из модалки по нажатию Escape
htmlBodyElement.addEventListener('keydown', function (event) {
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