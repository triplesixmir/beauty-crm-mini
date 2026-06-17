// noinspection D

import {useState} from "react";
import {
  formatAppointmentDateTime,
  formatMoney
} from "../../utils/formatters.js";
import {formatStoredPhone} from "../../utils/phone.js";
import {
  Maximize2 as Maximize2Icon,
  Pencil as PencilIcon,
  Trash as TrashIcon
} from "lucide-react";
import {SERVICES_LABELS} from "../../constants/services.js";

export function AppointmentsPage({
                                   appointmentsState,
                                   clientsState,
                                   alertsState,
                                   toastsState,
                                   openSidebarTab,
                                   openAppointmentEditModal,
                                   openAppointmentAddModal,
                                   now,
                                 }) {

  // Поиск по записям
  const [searchTerm, setSearchTerm] = useState('');
  const searchedAppointments = appointmentsState.appointments.filter(appointment => String(getAppointmentStats(appointment).clientName).toLowerCase().includes(searchTerm.toLowerCase()));

  // Фильтрация записей
  let filteredAppointments = [...searchedAppointments];

  const minCostLimit = appointmentsState.appointments.length > 0 ? Math.min(...appointmentsState.appointments.map(appointment => Number(appointment.price))) : 0;
  const maxCostLimit = appointmentsState.appointments.length > 0 ? Math.max(...appointmentsState.appointments.map(appointment => Number(appointment.price))) : 0;

  const [minCost, setMinCost] = useState(minCostLimit);
  const [maxCost, setMaxCost] = useState(maxCostLimit);

  if (minCost >= 0 && maxCost >= 0 && minCost <= maxCost) {
    filteredAppointments = filteredAppointments.filter(appointment => Number(appointment.price) >= Number(minCost));
    filteredAppointments = filteredAppointments.filter(appointment => Number(appointment.price) <= Number(maxCost));
  }

  const [didVisitCheckbox, setDidVisitCheckbox] = useState(false);
  const [isAppointmentEndedCheckbox, setIsAppointmentEndedCheckbox] = useState(false);
  filteredAppointments = filteredAppointments.filter(appointment => didVisitCheckbox ? !appointment.didntCome && new Date(`${appointment.date}T${appointment.time}`) < now : true);
  filteredAppointments = filteredAppointments.filter(appointment => isAppointmentEndedCheckbox ? new Date(`${appointment.date}T${appointment.time}`) < now : true);

  // Сортировка записей
  const [currentSort, setCurrentSort] = useState('default');
  let sortedAppointments = [...filteredAppointments];

  if (currentSort === 'default') {
    sortedAppointments = [...filteredAppointments];
  } else if (currentSort === 'appointment-down') {
    sortedAppointments = [...filteredAppointments].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  } else if (currentSort === 'appointment-up') {
    sortedAppointments = [...filteredAppointments].sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));
  } else if (currentSort === 'sum-up') {
    sortedAppointments = [...filteredAppointments].sort((a, b) => Number(a.price) - Number(b.price));
  } else if (currentSort === 'sum-down') {
    sortedAppointments = [...filteredAppointments].sort((a, b) => Number(b.price) - Number(a.price));
  }

  function handleMinCostChange(event) {
    if (Number(event.target.value) < minCostLimit) {
      setMinCost(minCostLimit);
      return;
    }

    if (Number(event.target.value) > maxCost) {
      setMinCost(Number(maxCost) - 1);
      return;
    }

    setMinCost(Number(event.target.value));
  }

  function handleMaxCostChange(event) {
    if (Number(event.target.value) > maxCostLimit) {
      setMaxCost(maxCostLimit);
      return;
    }

    if (Number(event.target.value) < minCost) {
      setMaxCost(Number(minCost) + 1);
      return;
    }

    setMaxCost(Number(event.target.value));
  }

  function handleResetFilters() {
    setDidVisitCheckbox(false);
    setIsAppointmentEndedCheckbox(false);
    setMinCost(minCostLimit);
    setMaxCost(maxCostLimit);
    setSearchTerm('');
  }

  // Получение информации о записи
  function getAppointmentStats(appointment) {
    const client = clientsState.clients.find(client => client.id === appointment.clientId);

    return {
      clientName: client ? `${client.firstname} ${client.surname}` : 'Неизвестный клиент',
      clientPhone: client ? client.tel : null,
      clientTelegram: client ? client.telegram : null,

      appointmentDateTime: new Date(`${appointment.date}T${appointment.time}`),
      appointmentDidVisit: new Date(`${appointment.date}T${appointment.time}`) < now ? !appointment.didntCome ? 'Явился(ась)' : 'Не явился(ась)' : 'Сеанс не закончился'
    }
  }

  // Действия с записями
  function handleDeleteClick(appointment) {
    alertsState.openAlert({
      title: `Удаление записи ${formatAppointmentDateTime(appointment.date, appointment.time)}`,
      description: "Вы уверены, что хотите удалить запись?",
      secondDescription: "Это действие необратимо и все данные о записи будут удалены.",
      submitButtonText: "Да, удалить",
      cancelButtonText: "Нет, не удалять",
      onSubmit: () => {
        appointmentsState.handleDeleteAppointment(appointment.id);
        alertsState.closeAlert();
        toastsState.showToast("info", "Запись успешно удалена", 3000)
      },
      onClose: alertsState.closeAlert,
    })
  }

  function handleOpenAppointmentDetails(appointment) {
    openSidebarTab({
      type: 'appointment',
      id: appointment.id,
      title: `${formatAppointmentDateTime(appointment.date, appointment.time)}`,
      key: `appointment:${appointment.id}`,
    });
  }


  return (
    <main className="app-shell appointments-page">

      <section className="section appointments-page__section">

        <div className="section__header">
          <div>
            <p className="section__eyebrow">Расписание</p>
            <h2>Записи</h2>
          </div>

          <button
            className="section__add-btn"
            onClick={openAppointmentAddModal}
          >Добавить запись
          </button>
        </div>

        <div className="appointments-page__controls data-page__toolbar">
          <input
            className="data-page__search"
            type="text"
            name="search-field"
            placeholder="Поиск по клиенту"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
          />

          <select
            className="data-page__sort"
            name="sort"
            id=""
            value={currentSort}
            onChange={(event) => setCurrentSort(event.target.value)}
          >
            <option value="default">По умолчанию</option>
            <option value="appointment-down">Ближайшие сначала</option>
            <option value="appointment-up">Позднейшие сначала</option>
            <option value="sum-up">По стоимости ↑</option>
            <option value="sum-down">По стоимости ↓</option>
          </select>
        </div>

        <div className="appointments-page__controls data-page__filters">
          <label className="data-page__checkbox">
            <span>Только с явкой клиента</span>
            <input
              type="checkbox"
              name="did-visit"
              id=""
              checked={didVisitCheckbox}
              onChange={() => setDidVisitCheckbox(!didVisitCheckbox)}
            />
          </label>

          <label className="data-page__checkbox">
            <span>Только прошедшие</span>
            <input
              type="checkbox"
              name="is-ended"
              id=""
              checked={isAppointmentEndedCheckbox}
              onChange={() => setIsAppointmentEndedCheckbox(!isAppointmentEndedCheckbox)}
            />
          </label>

          <div className="appointments-page__controls__cost-filter data-page__range-card">
            <div className="data-page__range-header">
              <h4>Стоимость услуги</h4>
              <p>Доступный диапазон: от {formatMoney(Number(minCostLimit))} до {formatMoney(Number(maxCostLimit))}</p>
            </div>

            <div className="data-page__number-pair">
              <label className="data-page__field">
                <span>От</span>
                <input
                  type="number"
                  name="total-spent-number-min"
                  placeholder="От"
                  id=""
                  min={minCostLimit}
                  max={maxCostLimit}
                  value={minCost}
                  onChange={(event) => handleMinCostChange(event)}
                />
              </label>

              <label className="data-page__field">
                <span>До</span>
                <input
                  type="number"
                  name="total-spent-number-max"
                  placeholder="До"
                  id=""
                  min={minCostLimit}
                  max={maxCostLimit}
                  value={maxCost}
                  onChange={(event) => handleMaxCostChange(event)}
                />
              </label>
            </div>

            <label className="data-page__range">
              <span>От</span>
              <input
                type="range"
                name="total-spent-range-min"
                id=""
                min={minCostLimit}
                max={maxCostLimit}
                step={100}
                value={minCost}
                onChange={(event) => handleMinCostChange(event)}
              />
            </label>

            <label className="data-page__range">
              <span>До</span>
              <input
                type="range"
                name="total-spent-range-max"
                id=""
                min={minCostLimit}
                max={maxCostLimit}
                step={100}
                value={maxCost}
                onChange={(event) => handleMaxCostChange(event)}
              />
            </label>
          </div>

          <button
            className="data-page__reset-button"
            type="button"
            onClick={handleResetFilters}
          >Сбросить фильтры
          </button>

        </div>

        {/*TODO: сделать тут по клику на заголовок смену сортировки как в Finder (скорее всего, через if-else или типа того)*/}
        {filteredAppointments.length > 0
          ? <div className="appointments-page__table-wrapper">
            <table className="appointments-page__table">
              <thead>
                <tr>
                  <th>Дата и время</th>
                  <th>Услуга</th>
                  <th>Стоимость</th>
                  <th>Имя и фамилия клиента</th>
                  <th>Телефон клиента</th>
                  <th>Явка клиента</th>
                  <th>Действия</th>
                </tr>
              </thead>
              <tbody>
                {sortedAppointments.map(appointment => {
                  const appointmentStats = getAppointmentStats(appointment);

                  return (
                    <tr key={appointment.id}>
                      <th>{formatAppointmentDateTime(appointment.date, appointment.time)}</th>
                      <td>{SERVICES_LABELS[appointment.service]}</td>
                      <td><span className="data-page__money">{formatMoney(appointment.price)}</span></td>
                      <td>{appointmentStats.clientName}</td>
                      <td>
                        {appointmentStats.clientPhone ? <a href={`tel:+${appointmentStats.clientPhone}`}>{formatStoredPhone(appointmentStats.clientPhone)}</a> : 'Телефон не указан'}
                      </td>
                      <td><span className="data-page__badge">{appointmentStats.appointmentDidVisit}</span></td>
                      <td className="appointments-page__actions">
                        <button
                          className="appointments-page__action-button"
                          onClick={() => openAppointmentEditModal(appointment)}
                        >
                          <PencilIcon />
                        </button>
                        <button
                          className="appointments-page__action-button"
                          onClick={() => handleDeleteClick(appointment)}
                        >
                          <TrashIcon />
                        </button>
                        <button
                          className="appointments-page__action-button"
                          onClick={() => handleOpenAppointmentDetails(appointment)}
                        >
                          <Maximize2Icon />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          : <div className="appointments-page__no-results data-page__empty"><p>Нет результатов</p></div>
        }

        <div className="appointments-page__statistics-under-table data-page__summary">
          <p>Всего записей: {appointmentsState.appointments.length}</p>
          <p>Скрыто записей: {appointmentsState.appointments.length - sortedAppointments.length}</p>
          <p>Показано записей: {sortedAppointments.length}</p>
        </div>

      </section>

    </main>
  )
}
