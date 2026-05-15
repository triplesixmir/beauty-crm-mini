import {formatDate, formatMoney, setTextForSelector, today} from "./utils.js";
import {states} from "./states.js";

export function renderDashboardStats() {
  const clientsCount = states.clients.length;

  const futureAppointments = [...states.appointments]
    .filter(appointment => appointment.date >= today)
  const appointmentsCount = futureAppointments.length;

  const initialValue = 0;
  const overallMoney = formatMoney(states.clients.reduce((accumulator, client) => {
    return accumulator + Number(client.totalSpent);
  }, initialValue))

  const nearestAppointment = [...states.appointments]
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
        <p class="stats-info__clients"></p>
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
        <p class="stats-info__appointments"></p>
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
        <p class="stats-info__money"></p>
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
        <p class="stats-info__nearest-appointment"></p>
      </div>
    </div>
  </div>
  `
  setTextForSelector(statsContainer, '.stats-info__clients', `${clientsCount} клиентов`);
  setTextForSelector(statsContainer, '.stats-info__appointments', `${appointmentsCount} записей`);
  setTextForSelector(statsContainer, '.stats-info__money', overallMoney);
  setTextForSelector(statsContainer, '.stats-info__nearest-appointment', nearestAppointmentText);

}