// noinspection D

import {useState} from "react";
import {
  formatAppointmentDateTime,
  formatMoney
} from "../../utils/formatters.js";
import {
  Maximize2 as Maximize2Icon,
  Trash as TrashIcon,
  Pencil as PencilIcon
} from "lucide-react";
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

  // Реализация поиска по клиентам
  // TODO: реализовать поиск по клиентам не только по имени, но и по другим параметрам через объект поиска
  const [searchTerm, setSearchTerm] = useState('');
  const searchedClients = clientsState.clients.filter(client => String(`${client.firstname} ${client.surname}`).toLowerCase().includes(searchTerm.toLowerCase()));

  function handleDeleteClick(client) {
    alertsState.openAlert({
      title: `Удаление клиента ${client.firstname} ${client.surname}`,
      description: "Вы уверены, что хотите удалить клиента?",
      secondDescription: "Это действие необратимо и все данные о клиенте будут удалены.",
      submitButtonText: "Да, удалить",
      cancelButtonText: "Нет, не удалять",
      onSubmit: () => {
        clientsState.handleDeleteClient(client.id);
        alertsState.closeAlert();
        toastsState.showToast("info", "Клиент успешно удален", 3000);
      },
      onClose: alertsState.closeAlert,
    })
  }

  function handleOpenClientDetails(client) {
    openSidebarTab({
      type: "client",
      id: client.id,
      title: `${client.firstname} ${client.surname}`,
      key: `client:${client.id}`,
    })
  }

  // Фильтры клиентов
  let filteredClients = [...searchedClients];

  const [didVisitCheckbox, setDidVisitCheckbox] = useState(false);

  const spentValues = clientsState.clients.map((client) => Number(getClientStats(client).clientTotalSpentThisYear));

  const minSpentLimit = spentValues.length > 0 ? Math.min(...spentValues) : 0;
  const maxSpentLimit = spentValues.length > 0 ? Math.max(...spentValues) : 0;

  const [minSpent, setMinSpent] = useState(minSpentLimit);
  const [maxSpent, setMaxSpent] = useState(maxSpentLimit);



  if (didVisitCheckbox) {
    filteredClients = filteredClients.filter(client => getClientStats(client).clientEndedAppointmentsThisYearCount > 0);
  }

  if (minSpent >= 0 && maxSpent >= 0 && minSpent <= maxSpent) {
    filteredClients = filteredClients.filter(client => getClientStats(client).clientTotalSpentThisYear >= Number(minSpent));
    filteredClients = filteredClients.filter(client => getClientStats(client).clientTotalSpentThisYear <= Number(maxSpent));
  }

  function handleMinSpentChange(event) {
    if (Number(event.target.value) < minSpentLimit) {
      setMinSpent(minSpentLimit);
      return;
    }

    if (Number(event.target.value) > maxSpent) {
      setMinSpent(Number(maxSpent) - 1);
      return;
    }

    setMinSpent(Number(event.target.value));
  }

  function handleMaxSpentChange(event) {
    if (Number(event.target.value) > maxSpentLimit) {
      setMaxSpent(maxSpentLimit);
      return;
    }

    if (Number(event.target.value) < minSpent) {
      setMaxSpent(Number(minSpent) + 1);
      return;
    }

    setMaxSpent(Number(event.target.value));
  }

  function handleResetFilters() {
    setDidVisitCheckbox(false);
    setMinSpent(minSpentLimit);
    setMaxSpent(maxSpentLimit);
    setSearchTerm('');
  }

  // Получение информации по клиенту
  // TODO: на будущее — сделать получение инфы по каждому клиенту заранее и поместить в отдельный объект
  function getClientStats(client) {
    const clientTotalSpent = appointments.filter(appointment => appointment.clientId === client.id).reduce((acc, appointment) => acc + Number(appointment.price), 0);
    const clientAppointments = appointments.filter(appointment => appointment.clientId === client.id);
    const clientFutureAppointments = clientAppointments.filter((appointment) => new Date(`${appointment.date}T${appointment.time}`) > now);
    const clientNearestAppointment = [...clientFutureAppointments].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))[0];

    const clientAppointmentsThisYear = clientAppointments.filter((appointment) => {
      const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
      const currentYear = new Date().getFullYear();
      return appointmentDate.getFullYear() === currentYear;
    })
    const clientEndedAppointmentsThisYearCount = clientAppointmentsThisYear.filter((appointment) => new Date(`${appointment.date}T${appointment.time}`) < now).length;
    const clientEndedAppointmentsThisYear = clientAppointmentsThisYear.filter((appointment) => new Date(`${appointment.date}T${appointment.time}`) < now);
    const clientTotalSpentThisYear = clientEndedAppointmentsThisYear.reduce((acc, appointment) => acc + Number(appointment.price), 0);

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
  let sortedClients = [...filteredClients];

  if (currentSort === 'default') {
    sortedClients = [...filteredClients]
  } else if (currentSort === 'a-z') {
    sortedClients = [...filteredClients].sort((a, b) => `${a.firstname} ${a.surname}`.localeCompare(`${b.firstname} ${b.surname}`));
  } else if (currentSort === 'z-a') {
    sortedClients = [...filteredClients].sort((a, b) => `${b.firstname} ${b.surname}`.localeCompare(`${a.firstname} ${a.surname}`));
  } else if (currentSort === 'appointment-up') {
    sortedClients = [...filteredClients].sort((a, b) => `${getClientStats(b).clientNearestAppointment?.date} ${getClientStats(b).clientNearestAppointment?.time}`.localeCompare(`${getClientStats(a).clientNearestAppointment?.date} ${getClientStats(a).clientNearestAppointment?.time}`));
  } else if (currentSort === 'appointment-down') {
    sortedClients = [...filteredClients].sort((a, b) => `${getClientStats(a).clientNearestAppointment?.date} ${getClientStats(a).clientNearestAppointment?.time}`.localeCompare(`${getClientStats(b).clientNearestAppointment?.date} ${getClientStats(b).clientNearestAppointment?.time}`));
  } else if (currentSort === 'sum-up') {
    sortedClients = [...filteredClients].sort((a, b) => getClientStats(a).clientTotalSpentThisYear - getClientStats(b).clientTotalSpentThisYear);
  } else if (currentSort === 'sum-down') {
    sortedClients = [...filteredClients].sort((a, b) => getClientStats(b).clientTotalSpentThisYear - getClientStats(a).clientTotalSpentThisYear);
  }

  return (
    <main className="app-shell clients-page">

      <section className="section clients-page__section">

        <div className="section__header">
          <div>
            <p className="section__eyebrow">Клиентская база</p>
            <h2>Клиенты</h2>
          </div>

          <button
            className="section__add-btn"
            onClick={openClientAddModal}
          >Добавить клиента
          </button>
        </div>

        <div className="clients-page__controls">
          <input
            type="text"
            name="search-field"
            placeholder="Поиск"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select
            name="sort"
            id=""
            value={currentSort}
            onChange={(event) => setCurrentSort(event.target.value)}
          >
            <option value="default">По умолчанию</option>
            <option value="a-z">А – Я</option>
            <option value="z-a">Я – А</option>
            <option value="appointment-down">Ближайшие записи сначала</option>
            <option value="appointment-up">Позднейшие записи сначала</option>
            <option value="sum-up">По потраченной сумме ↑</option>
            <option value="sum-down">По потраченной сумме ↓</option>
          </select>
        </div>

        <div className="clients-page__controls">
          <label>
            Только посещавшие за год
            <input
              type="checkbox"
              name="did-visit"
              id=""
              checked={didVisitCheckbox}
              onChange={() => setDidVisitCheckbox(!didVisitCheckbox)}
            />
          </label>

          <div className="clients-page__controls__total-spent-filter">
            <h4>Сумма за год</h4>
            <p>Доступный диапазон: от {formatMoney(Number(minSpentLimit))} до {formatMoney(Number(maxSpentLimit))}</p>

            <input
              type="number"
              name="total-spent-number-min"
              placeholder="От"
              id=""
              min={minSpentLimit}
              max={maxSpentLimit}
              value={minSpent}
              onChange={(event) => handleMinSpentChange(event)}
            />

            <input
              type="number"
              name="total-spent-number-max"
              placeholder="До"
              id=""
              min={minSpentLimit}
              max={maxSpentLimit}
              value={maxSpent}
              onChange={(event) => handleMaxSpentChange(event)}
            />

            <label>
              От
              <input
                type="range"
                name="total-spent-range-min"
                id=""
                min={minSpentLimit}
                max={maxSpentLimit}
                step={100}
                value={minSpent}
                onChange={(event) => handleMinSpentChange(event)}
              />
            </label>

            <label>
              До
              <input
                type="range"
                name="total-spent-range-max"
                id=""
                min={minSpentLimit}
                max={maxSpentLimit}
                step={100}
                value={maxSpent}
                onChange={(event) => handleMaxSpentChange(event)}
              />
            </label>
          </div>

          <button type="button" onClick={handleResetFilters}>Сбросить фильтры</button>

        </div>

        {/*TODO: сделать тут по клику на заголовок смену сортировки как в Finder (скорее всего, через if-else или типа того)*/}
        <div className="clients-page__table-wrapper">
          <table className="clients-page__table">
            <thead>
              <tr>
                <th>Имя и фамилия</th>
                <th>Телефон</th>
                <th>Telegram</th>
                <th>Визиты за год</th>
                <th>Сумма за год</th>
                <th>Ближайшая запись</th>
                <th>Действия</th>
              </tr>
            </thead>
            <tbody>
              {sortedClients.map(client => (
                <tr key={client.id}>
                  <th>{`${client.firstname} ${client.surname}`}</th>
                  <td>
                    <a href={`tel:+${client.tel}`}>{formatStoredPhone(client.tel)}</a>
                  </td>
                  <td>
                    <a href={`https://t.me/${client.telegram}`}>@{client.telegram}</a>
                  </td>
                  <td>{getClientStats(client).clientEndedAppointmentsThisYearCount}</td>
                  <td>{formatMoney(getClientStats(client).clientTotalSpentThisYear)}</td>
                  <td>{getClientStats(client).clientNearestAppointment ? formatAppointmentDateTime(getClientStats(client).clientNearestAppointment.date, getClientStats(client).clientNearestAppointment.time) : '—'}</td>
                  <td className="clients-page__actions">
                    <button
                      className="clients-page__action-button"
                      onClick={() => openClientEditModal(client)}
                    >
                      <PencilIcon />
                    </button>
                    <button
                      className="clients-page__action-button"
                      onClick={() => handleDeleteClick(client)}
                    >
                      <TrashIcon />
                    </button>
                    <button
                      className="clients-page__action-button"
                      onClick={() => handleOpenClientDetails(client)}
                    >
                      <Maximize2Icon />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </section>

    </main>
  )
}
