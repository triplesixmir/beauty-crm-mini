Inputmask("+7 999 999-99-99").mask("#client-tel");

// Обработка добавления нового клиента

const form = document.getElementById('form');
const clientsContainer = document.getElementById('clients-section__content');

let clients = JSON.parse(localStorage.getItem('clients')) || [];
renderClients();

function saveClients() {

    localStorage.setItem('clients', JSON.stringify(clients));

}

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('client-name').value;
    const tel = document.getElementById('client-tel').value;
    const telegram = document.getElementById('client-tg').value;

    const newClient = {
        id: Date.now(),
        name,
        tel,
        telegram
    };

    clients.push(newClient);
    saveClients();

    renderClients();

    form.reset();
});

function renderClients() {
    clientsContainer.innerHTML = '';

    clients.forEach(client => {
        const card = document.createElement('div');
        card.className = 'client-card';

        card.innerHTML = `
        <div class="client-card__main-info">
            <img src="clients-pictures/default-profile-picture.jpg" alt="Фото клиента">
            <div class="client-card__name">
                <h2>${client.name}</h2>
                <p>Новый клиент</p>
            </div>
        </div>

        <div class="client-card__details">
            <p><span>Телефон</span><a href="tel:${client.tel}">${client.tel}</a></p>
            <p><span>Telegram</span>${client.telegram}</p>
        </div>
        
        <button class="client-card__delete-btn" data-id="${client.id}">Удалить</button>
        `;

        clientsContainer.appendChild(card);
        });
}

clientsContainer.addEventListener('click', function (event) {
    if(event.target.classList.contains('client-card__delete-btn')) {
        const clientId = Number(event.target.dataset.id);

        clients = clients.filter(client => client.id !== clientId);
        saveClients();

        renderClients();
    }
});