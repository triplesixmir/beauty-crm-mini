Inputmask("+7 999 999-99-99").mask("#client-tel");

// Обработка добавления нового клиента

const form = document.getElementById('form');
const clientsContainer = document.getElementById('clients-section__content');

let clients = [];

form.addEventListener('submit', function (event) {
    event.preventDefault();

    const name = document.getElementById('client-name').value;
    const tel = document.getElementById('client-tel').value;
    const telegram = document.getElementById('client-tg').value;

    const newClient = {
        id: clients.length + 1,
        name,
        tel,
        telegram
    };

    clients.push(newClient);

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
            ${client.telegram ? `<p><span>Telegram</span>${client.telegram}</p>` : ''}
        </div>
        `;

        clientsContainer.appendChild(card);
        });
}