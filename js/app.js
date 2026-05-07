Inputmask("+7 999 999-99-99").mask("#client-tel");

// Обработка добавления нового клиента

const form = document.getElementById('form');
const clientsContainer = document.getElementById('clients-section__content');

let clients = JSON.parse(localStorage.getItem('clients')) || [];
let editingClientId = null;
renderClients();

function saveClients() {

    localStorage.setItem('clients', JSON.stringify(clients));

}

// Добавление клиента
form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('client-name').value;
    const tel = document.getElementById('client-tel').value;
    const telegram = document.getElementById('client-tg').value.replace('@', '');

    if (editingClientId) {
        // обновить клиента через map
        clients = clients.map(client => {
           if(client.id === editingClientId) {
               return {
                   ...client,
                   name,
                   tel,
                   telegram
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
            telegram
        };

        clients.push(newClient);

    }

    editingClientId = null;
    saveClients();
    renderClients();
    form.reset();
});

function renderClients() {
    clientsContainer.innerHTML = '';

    clients.forEach(client => {
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
            <p><span>Telegram</span><a href="https://t.me/${client.telegram.replace('@', '')}" target="_blank" rel="noopener noreferrer">${client.telegram}</a></p>
        </div>
        
        <button class="client-card__delete-btn" data-id="${client.id}">Удалить</button>
        <button class="client-card__edit-btn" data-id="${client.id}">Редактировать</button>
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

        renderClients();
    }

    // Поведение кнопки при редактировании клиента
    if(event.target.classList.contains('client-card__edit-btn')) {

        const clientId = Number(event.target.dataset.id);
        const clientToEdit = clients.find(client => client.id === clientId);

        // Ищем каждый инпут и вставляем туда инфу нашего клиента
        document.getElementById('client-name').value = clientToEdit.name;
        document.getElementById('client-tel').value = clientToEdit.tel;
        document.getElementById('client-tg').value = clientToEdit.telegram;

        editingClientId = clientId;

    }
});