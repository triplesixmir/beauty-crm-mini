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

}