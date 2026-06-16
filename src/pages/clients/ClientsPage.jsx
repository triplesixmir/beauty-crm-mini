import {useState} from "react";
import {formatAppointmentDateTime, formatMoney} from "../../utils/formatters.js";
import {Maximize2 as Maximize2Icon, Trash as TrashIcon, Pencil as PencilIcon} from "lucide-react";
import {formatStoredPhone} from "../../utils/phone.js";

export function ClientsPage({
                              clientsState,
                              appointments,
                              openSidebarTab,
                              openClientEditModal,
                              openClientAddModal,
                              alertsState,
                              toastsState,
                              now
                            }) {

  // Стейт клиентов под рендер
  const [finalClients, setFinalClients] = useState([...clientsState.clients]);

  // Реализация поиска по клиентам
  const [searchTerm, setSearchTerm] = useState('');
  const searchedClients = clientsState.clients.filter(client => String(`${client.firstname} ${client.surname}`).toLowerCase().includes(searchTerm.toLowerCase()));

  // Получение информации по клиенту
  function getClientStats(client) {
    const clientTotalSpent = appointments.filter(appointment => appointment.clientId === client.id).reduce((acc, appointment) => acc + appointment.price, 0);
    const clientAppointments = appointments.filter(appointment => appointment.clientId === client.id);
    const clientNearestAppointment = clientAppointments.sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))[0];

    const clientAppointmentsThisYear = clientAppointments.filter((appointment) => {
      const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
      const currentYear = new Date().getFullYear();
      return appointmentDate.getFullYear() === currentYear;
    })
    const clientEndedAppointmentsThisYearCount = clientAppointmentsThisYear.filter((appointment) => new Date(`${appointment.date}T${appointment.time}`) < now).length;
    const clientEndedAppointmentsThisYear = clientAppointmentsThisYear.filter((appointment) => new Date(`${appointment.date}T${appointment.time}`) < now);
    const clientTotalSpentThisYear = formatMoney(clientEndedAppointmentsThisYear.reduce((total, appointment) => total + Number(appointment.price), 0));

    return {
      clientTotalSpent: clientTotalSpent,
      clientTotalSpentThisYear: clientTotalSpentThisYear,
      clientAppointments: clientAppointments,
      clientNearestAppointment: clientNearestAppointment,
      clientAppointmentsThisYear: clientAppointmentsThisYear,
      clientEndedAppointmentsThisYearCount: clientEndedAppointmentsThisYearCount,
      clientEndedAppointmentsThisYear: clientEndedAppointmentsThisYear,
    }
  }

  // Работа с сортировкой клиентов
  const [currentSort, setCurrentSort] = useState('default');
  if (currentSort === 'default') {
    const sortedClients = [...searchedClients]
  } else if (currentSort === 'a-z') {
    const sortedClients = [...searchedClients].sort((a, b) => `${a.firstname} ${a.surname}`.localeCompare(`${b.firstname} ${b.surname}`));
  } else if (currentSort === 'z-a') {
    const sortedClients = [...searchedClients].sort((a, b) => `${b.firstname} ${b.surname}`.localeCompare(`${a.firstname} ${a.surname}`));
  } else if (currentSort === 'appointment-up') {
    const sortedClients = [...searchedClients].sort((a, b) => `${getClientStats(a).clientNearestAppointment.date} ${getClientStats(a).clientNearestAppointment.time}`.localeCompare(`${getClientStats(b).clientNearestAppointment.date} ${getClientStats(b).clientNearestAppointment.time}`));
  } else if (currentSort === 'appointment-down') {
    const sortedClients = [...searchedClients].sort((a, b) => `${getClientStats(b).clientNearestAppointment.date} ${getClientStats(b).clientNearestAppointment.time}`.localeCompare(`${getClientStats(a).clientNearestAppointment.date} ${getClientStats(a).clientNearestAppointment.time}`));
  } else if (currentSort === 'sum-up') {
    const sortedClients = [...searchedClients].sort((a, b) => getClientStats(a).clientTotalSpent - getClientStats(b).clientTotalSpent);
  } else if (currentSort === 'sum-down') {
    const sortedClients = [...searchedClients].sort((a, b) => getClientStats(b).clientTotalSpent - getClientStats(a).clientTotalSpent);
  }

  return (
    <>

      <h2>Клиенты</h2>
      <button onClick={openClientAddModal}>Добавить клиента</button>

      <input
        type="text"
        name="search-field"
        placeholder="Поиск"
        onChange={(event) => setSearchTerm(event.target.value)}
      />

      <select
        name="sort"
        id=""
        onChange={(event) => setCurrentSort(event.target.value)}
      >
        <option value="default">По умолчанию</option>
        <option value="a-z">А – Я</option>
        <option value="z-a">Я – А</option>
        <option value="appointment-up">По ближайшей записи ↑</option>
        <option value="appointment-down">По ближайшей записи ↓</option>
        <option value="sum-up">По потраченной сумме ↑</option>
        <option value="sum-down">По потраченной сумме ↓</option>
      </select>

      <table>
        <thead>
          <tr>
            <th>Имя и фамилия</th>
            <th>Телефон</th>
            <th>Telegram</th>
            <th>Email</th>
            <th>Визиты за год</th>
            <th>Сумма за год</th>
            <th>Ближайшая запись</th>
            <th>Действия</th>
          </tr>
        </thead>
        <tbody>
          {finalClients.map(client => (
            <tr key={client.id}>
              <th>{`${client.firstname} ${client.surname}`}</th>
              <td>{formatStoredPhone(client.tel)}</td>
              <td>@{client.telegram}</td>
              <td>{client.email}</td>
              <td>{getClientStats(client).clientEndedAppointmentsThisYearCount}</td>
              <td>{getClientStats(client).clientTotalSpentThisYear}</td>
              <td>{getClientStats(client).clientNearestAppointment ? formatAppointmentDateTime(getClientStats(client).clientNearestAppointment.date, getClientStats(client).clientNearestAppointment.time) : '—'}</td>
              <td>
                <button>
                  <PencilIcon onClick={() => openClientEditModal(client)} />
                </button>
                <button>
                  <TrashIcon onClick={() => console.log("Нажата кнопка удаления клиента")} />
                </button>
                <button>
                  <Maximize2Icon onClick={() => console.log("Нажата кнопка открытия вкладки")} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

    </>
  )
}
