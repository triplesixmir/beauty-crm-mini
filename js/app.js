Inputmask("+7 999 999-99-99").mask("#client-tel");

const form = document.getElementById('form');
const clientsContainer = document.getElementById('clients-section__content');

const dateInput = document.getElementById('client-last_visit');
const today = new Date().toISOString().split('T')[0];
dateInput.max = today;
dateInput.value = today;

let clients = JSON.parse(localStorage.getItem('clients')) || [];
let editingClientId = null;
renderClients(clients);

function saveClients() {

    localStorage.setItem('clients', JSON.stringify(clients));

}

// Добавление клиента
form.addEventListener('submit', function (event) {
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

    editingClientId = null;
    document.getElementById('client-add-btn').textContent = 'Добавить клиента';
    saveClients();
    renderClients(clients);
    form.reset();
});

// Рендер клиентов

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

        card.innerHTML = `
        <div class="client-card__main-info">
            <img src="clients-pictures/default-profile-picture.jpg" alt="Фото клиента">
            <div class="client-card__name">
                <h2>${client.name}</h2>
                <p>Новый клиент</p>
            </div>
        </div>

        <div class="client-card__details">
            <p><span>Телефон</span><a href="tel:+${cleanTel}">${client.tel}</a></p>
            <p><span>Telegram</span><a href="https://t.me/${client.telegram.replace('@', '')}" target="_blank" rel="noopener noreferrer">@${client.telegram}</a></p>
            <p><span>Последний визит</span>${client.lastVisit}</p>
            <p><span>Всего потрачено</span>${client.totalSpent}</p>
        </div>
        
        <div class="client-card__actions">
            <button class="client-card__edit-btn" data-id="${client.id}">Редактировать</button>
            <button class="client-card__delete-btn" data-id="${client.id}">Удалить</button>
        </div>
        `;

        clientsContainer.appendChild(card);
        });
}

// Поведение кнопки при удалении клиента
clientsContainer.addEventListener('click', function (event) {
    if(event.target.classList.contains('client-card__delete-btn')) {
        const clientId = Number(event.target.dataset.id);

        clients = clients.filter(client => client.id !== clientId);
        saveClients();

        renderClients(clients);
    }

    // Поведение кнопки при редактировании клиента
    if(event.target.classList.contains('client-card__edit-btn')) {

        document.getElementById('client-add-btn').textContent = 'Обновить клиента';

        const clientId = Number(event.target.dataset.id);
        const clientToEdit = clients.find(client => client.id === clientId);

        // Ищем каждый инпут и вставляем туда инфу нашего клиента
        document.getElementById('client-name').value = clientToEdit.name;
        document.getElementById('client-tel').value = clientToEdit.tel;
        document.getElementById('client-tg').value = clientToEdit.telegram;
        document.getElementById('client-last_visit').value = clientToEdit.lastVisit;
        document.getElementById('client-total_spent').value = clientToEdit.totalSpent;

        editingClientId = clientId;

    }
});

// Поиск клиента

const searchInput = document.getElementById('search-input');

searchInput.addEventListener('input', function () {
    let searchTerm = searchInput.value.toLowerCase();

    const filteredClients = clients.filter(client => {
        return client.name.toLowerCase().includes(searchTerm);
    });

    renderClients(filteredClients);
});

// Сортировка

const sortSelect = document.getElementById('sort-clients');

sortSelect.addEventListener('change', function () {
    const sortOrder = sortSelect.value;

    if(sortOrder === 'alphabet-up-sort') {
        const sortedClients = [...clients].sort((a, b) => a.name.localeCompare(b.name))
        renderClients(sortedClients);
    } else if(sortOrder === 'alphabet-down-sort') {
        const sortedClients = [...clients].sort((a, b) => b.name.localeCompare(a.name))
        renderClients(sortedClients);
    } else if(sortOrder === 'last-visit-sort') {
        const sortedClients = [...clients].sort((a, b) => new Date(b.lastVisit) - new Date(a.lastVisit))
        renderClients(sortedClients);
    } else if(sortOrder === 'total-spent-sort') {
        const sortedClients = [...clients].sort((a, b) => Number(b.totalSpent) - Number(a.totalSpent))
        renderClients(sortedClients);
    } else {
        console.warn('Такая сортировка не предусмотрена:', sortOrder);
    }
})