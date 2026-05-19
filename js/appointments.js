import {dom} from "./dom.js";
import {appointmentFilters, states} from "./states.js";
import {renderDashboardStats} from "./dashboard.js";
import {
  formatDate,
  formatMoney,
  services,
  setTextForSelector,
  today
} from "./utils.js";
import {showToast} from "./toasts.js";
import {showConfirm} from "./confirm.js";

export function initAppointments() {
  updateAppointmentsView();
  dom.appointmentForm.addEventListener('submit', handleAppointmentFormSubmit);
  dom.appointmentsList.addEventListener('click', handleAppointmentDelete);
  dom.appointmentsList.addEventListener('click', handleShowMoreAppointmentsButtonClick);
  dom.appointmentsContainer.addEventListener('click', handleEditAppointmentButtonClick);
  dom.appointmentModal.addEventListener('click', handleCloseAppointmentModalButton);
  dom.htmlBodyElement.addEventListener('keydown', handleCloseAppointmentModalEscape);
  dom.appointmentModal.addEventListener('click', handleCloseAppointmentModalBackdrop);
  dom.appointmentSearchInput.addEventListener('input', handleAppointmentSearchInput);
  dom.appointmentSortSelect.addEventListener('change', handleAppointmentSortSelectChange);
  dom.appointmentsFiltersButton.addEventListener('click', handleToggleAppointmentFiltersPopup);
  dom.htmlBodyElement.addEventListener('keydown', handleCloseAppointmentFiltersPopupEscape);
  dom.appointmentFiltersPopupOptionClientSelect.addEventListener('change', handleAppointmentFiltersPopupClientSelectChange);
  dom.appointmentsFiltersPopupOnlyFutureLabel.addEventListener('change', handleAppointmentFiltersPopupOnlyFutureToggle);
  dom.appointmentsFiltersPopupDateFromSelector.addEventListener('change', handleAppointmentFiltersPopupDateFromChange);
  dom.appointmentsFiltersPopupDateToSelector.addEventListener('change', handleAppointmentFiltersPopupDateToChange);
  dom.appointmentsFiltersPopupResetButton.addEventListener('click', handleAppointmentFiltersPopupResetButtonClick);
  document.addEventListener('click', handleCloseAppointmentFiltersPopupOnOutsideClick);
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
    showToast({title: 'Ошибка', text: 'Не выбран клиент', type: 'error', duration: 5000})
    return;
  }

  const clientId = Number(selectedClientId);

  if (!states.clients.some(client => client.id === clientId)) {
    showToast({title: 'Ошибка', text: 'Клиент не найден', type: 'error', duration: 5000})
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
    showToast({title: 'Успешно', text: 'Запись успешно отредактирована', type: 'success', duration: 5000})
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
    showToast({title: 'Успешно', text: 'Запись успешно создана', type: 'success', duration: 5000})
  }

  states.editingAppointmentId = null;
  saveAppointments();
  updateAppointmentsView();
  renderDashboardStats();
  hideAppointmentModal();
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
            
            <div class="appointment-card__actions">
              <button class="appointment-card__edit-btn">
                  Редактировать
              </button>
              <button class="appointment-card__delete-btn">
                  Удалить
              </button>
            </div>
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

async function handleAppointmentDelete(event) {
  if (event.target.classList.contains('appointment-card__delete-btn')) {
    const appointmentId = Number(event.target.dataset.id);

    const isConfirmed = await showConfirm({
      title: 'Удаление записи',
      text: 'Вы уверены, что хотите удалить запись? Это действие будет невозможно отменить'
    });

    if (!isConfirmed) { return; }

    states.appointments = states.appointments.filter(appointment => appointment.appointmentId !== appointmentId);
    showToast({title: 'Успешно', text: 'Запись успешно удалена', type: 'success', duration: 5000})
    saveAppointments();
    updateAppointmentsView();
    renderDashboardStats();

  }
}

function handleShowMoreAppointmentsButtonClick(event) {
  if (event.target.classList.contains('show-more-btn')) {
    states.visibleAppointmentsCount += 4;
    updateAppointmentsView()
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

function handleAppointmentSearchInput(event) {
  appointmentFilters.searchTerm = event.target.value.toLowerCase();
  states.visibleAppointmentsCount = 4
  updateAppointmentsView();
}

function handleAppointmentSortSelectChange(event) {
  appointmentFilters.sortOrder = event.target.value;
  states.visibleAppointmentsCount = 4
  updateAppointmentsView();
}

// TODO: нужно еще добавить в HTML блок с фильтрами (либо поп-апом его сделать, либо сайд-баром)

export function updateAppointmentsView() {
  let result = [...states.appointments];

  if (appointmentFilters.clientId !== 'all') {
    result = result.filter(appointment =>
    appointment.clientId === Number(appointmentFilters.clientId))
  }

  if (appointmentFilters.searchTerm) {
    result = result.filter(appointment => {
      const client = states.clients.find(client => client.id === appointment.clientId)
      return client?.name.toLowerCase().includes(appointmentFilters.searchTerm)
    });
  }

  if (appointmentFilters.onlyFuture === true) {
    result = result.filter(appointment => appointment.date >= today);
  }

  if (appointmentFilters.dateFrom) {
    result = result.filter(appointment => appointment.date >= appointmentFilters.dateFrom);
  }

  if (appointmentFilters.dateTo) {
    result = result.filter(appointment => appointment.date <= appointmentFilters.dateTo);
  }

  if (appointmentFilters.sortOrder !== 'default-sort') {

    if (appointmentFilters.sortOrder === 'top-price-sort') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (appointmentFilters.sortOrder === 'low-price-sort') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (appointmentFilters.sortOrder === 'date-up-sort') {
      result.sort((a, b) => new Date(a.date + 'T' + a.time) - new Date(b.date + 'T' + b.time));
    } else if (appointmentFilters.sortOrder === 'date-down-sort') {
      result.sort((a, b) => new Date(b.date + 'T' + b.time) - new Date(a.date + 'T' + a.time));
    }

  }

  renderAppointments(result.slice(0, states.visibleAppointmentsCount));

  if (result.length <= states.visibleAppointmentsCount) return;

  const showMoreButton = document.createElement('button');
  showMoreButton.className = 'show-more-btn';
  showMoreButton.id = 'show-more-appointments-btn';
  showMoreButton.textContent = 'Показать еще';

  dom.appointmentsList.appendChild(showMoreButton);
}

function renderAppointmentsFiltersPopupClientSelectOptions() {
  dom.appointmentFiltersPopupOptionClientSelect.innerHTML = '';

  const allOption = document.createElement('option');
  allOption.value = 'all';
  allOption.textContent = 'Все клиенты';
  dom.appointmentFiltersPopupOptionClientSelect.appendChild(allOption);

  states.clients.forEach(client => {
    const option = document.createElement('option');
    option.value = client.id;
    option.textContent = client.name;

    dom.appointmentFiltersPopupOptionClientSelect.appendChild(option);
  });

  dom.appointmentFiltersPopupOptionClientSelect.value = appointmentFilters.clientId;

}

function showAppointmentsFiltersPopup() {
  dom.appointmentsFiltersPopup.classList.remove('hidden');
  appointmentFilters.isPopupOpen = true;

  dom.htmlBodyElement.classList.add('popup-open');
  renderAppointmentsFiltersPopupClientSelectOptions();

  handleAppointmentsFiltersPopupPosition();
}

function hideAppointmentsFiltersPopup() {
  dom.appointmentsFiltersPopup.classList.add('hidden');
  appointmentFilters.isPopupOpen = false;

  dom.htmlBodyElement.classList.remove('popup-open');
}

function handleToggleAppointmentFiltersPopup() {
  appointmentFilters.isPopupOpen ? hideAppointmentsFiltersPopup() : showAppointmentsFiltersPopup();
}

function handleAppointmentsFiltersPopupPosition() {
  const buttonRect = dom.appointmentsFiltersButton.getBoundingClientRect();

  dom.appointmentsFiltersPopup.style.left = `${buttonRect.left}px`;
  dom.appointmentsFiltersPopup.style.top = `${buttonRect.bottom + 16}px`;
}

function handleCloseAppointmentFiltersPopupOnOutsideClick(event) {
  const isClickInsidePopup = dom.appointmentsFiltersPopup.contains(event.target);
  const isClickOnFilterButton = dom.appointmentsFiltersButton.contains(event.target);

  if (!isClickInsidePopup && !isClickOnFilterButton) {
    hideAppointmentsFiltersPopup();
  }
}

function handleCloseAppointmentFiltersPopupEscape(event) {
  if (event.key === 'Escape') {
    hideAppointmentsFiltersPopup();
  }
}

function handleAppointmentFiltersPopupClientSelectChange(event) {
  appointmentFilters.clientId = event.target.value;

  states.visibleAppointmentsCount = 4;
  updateAppointmentsView();
}

function handleAppointmentFiltersPopupOnlyFutureToggle(event) {
  appointmentFilters.onlyFuture = event.target.checked;

  states.visibleAppointmentsCount = 4;
  updateAppointmentsView();
}

function handleAppointmentFiltersPopupDateFromChange(event) {
  appointmentFilters.dateFrom = event.target.value;

  states.visibleAppointmentsCount = 4;
  updateAppointmentsView();
}

function handleAppointmentFiltersPopupDateToChange(event) {
  appointmentFilters.dateTo = event.target.value;

  states.visibleAppointmentsCount = 4;
  updateAppointmentsView();
}

function handleAppointmentFiltersPopupResetButtonClick(event) {
  appointmentFilters.clientId = 'all';
  appointmentFilters.onlyFuture = true;
  appointmentFilters.dateFrom = '';
  appointmentFilters.dateTo = '';
  dom.appointmentsFiltersPopupDateFromSelector.value = '';
  dom.appointmentsFiltersPopupDateToSelector.value = '';
  dom.appointmentFiltersPopupOptionClientSelect.value = 'all';
  dom.appointmentsFiltersPopupOnlyFutureCheckbox.checked = true;

  states.visibleAppointmentsCount = 4;
  showToast({title: 'Фильтры сброшены', text: 'Все фильтры были успешно сброшены', type: 'info', duration: 5000})
  updateAppointmentsView();
}