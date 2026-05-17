import {dom} from "./dom.js";
import {states} from "./states.js";
import {renderDashboardStats} from "./dashboard.js";
import {
  formatDate,
  formatMoney,
  services,
  setTextForSelector,
  today
} from "./utils.js";

export function initAppointments() {
  renderNearestAppointments();
  dom.appointmentForm.addEventListener('submit', handleAppointmentFormSubmit);
  dom.appointmentsList.addEventListener('click', handleAppointmentDelete);
  dom.appointmentsContainer.addEventListener('click', handleShowMoreAppointmentsButtonClick);
  dom.appointmentsContainer.addEventListener('click', handleEditAppointmentButtonClick);
  dom.appointmentModal.addEventListener('click', handleCloseAppointmentModalButton);
  dom.htmlBodyElement.addEventListener('keydown', handleCloseAppointmentModalEscape);
  dom.appointmentModal.addEventListener('click', handleCloseAppointmentModalBackdrop);
  document.getElementById('open-appointment-modal-btn')
    .addEventListener('click', handleOpenAppointmentModalClick);
}

function handleAppointmentFormSubmit(event) {
  event.preventDefault();

  const selectedClientId = dom.appointmentClientsSelect.value;
  const date = document.getElementById('appointment-date').value;
  const time = document.getElementById('appointment-time').value;
  const price = Number(document.getElementById('appointment-price').value);
  const service = document.querySelector('input[name="appointment-service"]:checked').value

  if (!selectedClientId) {
    globalThis.alert('Выберите клиента!');
    return;
  }

  const clientId = Number(selectedClientId);

  if (!states.clients.some(client => client.id === clientId)) {
    globalThis.alert('Такой клиент не найден!');
    return;
  }

  if (states.editingAppointmentId) {
    states.appointments = states.appointments.map(appointment => {
      if (appointment.appointmentId === states.editingAppointmentId) {
        return {
          ...appointment,
          clientId,
          date,
          time,
          price,
          service
        };
      } else {
        return appointment;
      }
    });

  } else {

    const newAppointment = {
      appointmentId: Date.now(),
      clientId,
      date,
      time,
      price,
      service
    };

    states.appointments.push(newAppointment);

  }

  states.editingAppointmentId = null;
  saveAppointments();
  renderNearestAppointments();
  renderDashboardStats();
  hideAppointmentModal();
}

export function renderNearestAppointments() {
  const nearestAppointments = [...states.appointments]
    .filter(appointment => appointment.date >= today)
    .sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time))
    .slice(0, states.visibleAppointmentsCount);
  const futureAppointments = [...states.appointments].filter(appointment => appointment.date >= today);

  renderAppointments(nearestAppointments);

  if (futureAppointments.length <= states.visibleAppointmentsCount) return;

  const showMoreButton = document.createElement('button');
  showMoreButton.className = 'show-more-btn';
  showMoreButton.id = 'show-more-appointments-btn';
  showMoreButton.textContent = 'Показать еще';

  dom.appointmentsList.appendChild(showMoreButton);
}

export function renderAppointments(appointmentsArray) {
  dom.appointmentsList.innerHTML = '';

  if (appointmentsArray.length === 0) {
    const noAppointments = document.createElement('p');
    noAppointments.className = 'no-appointments';
    noAppointments.textContent = 'Записей не найдено';

    dom.appointmentsList.appendChild(noAppointments);
    return;
  }

  appointmentsArray.forEach(appointment => {
    const card = document.createElement('div');
    card.className = 'appointment-card';
    const client = states.clients.find(client => {
      return client.id === appointment.clientId;
    });
    const price = formatMoney(appointment.price);
    const date = formatDate(appointment.date);

    card.innerHTML = `
            <p class="appointment-card__client"></p>
            <p class="appointment-card__date"></p>
            <p class="appointment-card__time"></p>
            <p class="appointment-card__service"></p>
            <p class="appointment-card__price"></p>
            
            <button class="appointment-card__delete-btn">
                Удалить
            </button>
            <button class="appointment-card__edit-btn">
                Редактировать
            </button>
        `;

    const appointmentCardEditButton = card.querySelector('.appointment-card__edit-btn');
    appointmentCardEditButton.dataset.id = appointment.appointmentId;
    setTextForSelector(card, '.appointment-card__client', `Клиент: ${client ? client.name : 'Клиент удалён'}`);
    setTextForSelector(card, '.appointment-card__date', `Дата: ${date}`);
    setTextForSelector(card, '.appointment-card__time', `Время: ${appointment.time}`);
    setTextForSelector(card, '.appointment-card__service', `Услуга: ${services[appointment.service] || 'Неизвестная услуга'}`);
    setTextForSelector(card, '.appointment-card__price', `Цена: ${price}`);
    const appointmentCardDeleteButton = card.querySelector('.appointment-card__delete-btn');
    appointmentCardDeleteButton.dataset.id = appointment.appointmentId;

    dom.appointmentsList.appendChild(card);
  });
}

function handleAppointmentDelete(event) {
  if (event.target.classList.contains('appointment-card__delete-btn')) {
    const appointmentId = Number(event.target.dataset.id);

    if (globalThis.confirm('Вы уверены, что хотите удалить запись?')) {
      states.appointments = states.appointments.filter(appointment => appointment.appointmentId !== appointmentId);
      saveAppointments();
      renderNearestAppointments();
      renderDashboardStats();
    }
  }
}

function handleShowMoreAppointmentsButtonClick(event) {
  if (event.target.classList.contains('show-more-btn')) {
    states.visibleAppointmentsCount += 6;
    renderNearestAppointments()
  }
}

function handleOpenAppointmentModalClick(event) {
  states.editingAppointmentId = null;
  document.getElementById('appointment-submit-btn').textContent = 'Добавить запись';
  event.preventDefault();
  dom.appointmentForm.reset();
  showAppointmentModal();
}

function handleEditAppointmentButtonClick(event) {
  if (event.target.classList.contains('appointment-card__edit-btn')) {
    const appointmentId = Number(event.target.dataset.id);
    const appointmentToEdit = states.appointments.find(appointment => appointment.appointmentId === appointmentId);
    states.editingAppointmentId = appointmentId;

    document.getElementById('appointment-clients').value = appointmentToEdit.clientId;
    document.getElementById('appointment-date').value = appointmentToEdit.date;
    document.getElementById('appointment-time').value = appointmentToEdit.time;
    document.getElementById('appointment-price').value = appointmentToEdit.price;
    document.querySelector(`input[name="appointment-service"][value="${appointmentToEdit.service}"]`).checked = true;

    showAppointmentModal();
    document.getElementById('appointment-submit-btn').textContent = 'Сохранить';
  }
}

function handleCloseAppointmentModalBackdrop(event) {
  if (event.target.classList.contains('appointment-modal')) {
    hideAppointmentModal();
  }
}

function handleCloseAppointmentModalEscape(event) {
  if (event.key === 'Escape') {
    hideAppointmentModal();
  }
}

function handleCloseAppointmentModalButton(event) {
  if (event.target.classList.contains('close-modal-btn')) {
    hideAppointmentModal();
  }
}

function saveAppointments() {

  localStorage.setItem('appointments', JSON.stringify(states.appointments));

}

function showAppointmentModal() {
  dom.appointmentModal.classList.remove('hidden');
}

function hideAppointmentModal() {
  states.editingAppointmentId = null;
  dom.appointmentModal.classList.add('hidden');
}