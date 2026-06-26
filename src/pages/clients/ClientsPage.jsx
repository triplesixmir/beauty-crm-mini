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
import {getClientStats} from "../../utils/clientStats.js";

export function ClientsPage({
                              clientsState,
                              appointmentsArray,
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

  const spentValues = clientsState.clients.map((client) => Number(getClientStats(client, appointmentsArray, now).totalSpentThisYear));

  const minSpentLimit = spentValues.length > 0 ? Math.min(...spentValues) : 0;
  const maxSpentLimit = spentValues.length > 0 ? Math.max(...spentValues) : 0;

  const [minSpent, setMinSpent] = useState(minSpentLimit);
  const [maxSpent, setMaxSpent] = useState(maxSpentLimit);

  if (didVisitCheckbox) {
    filteredClients = filteredClients.filter(client => getClientStats(client, appointmentsArray, now).endedAppointmentsThisYearCount > 0);
  }

  if (minSpent >= 0 && maxSpent >= 0 && minSpent <= maxSpent) {
    filteredClients = filteredClients.filter(client => getClientStats(client, appointmentsArray, now).totalSpentThisYear >= Number(minSpent));
    filteredClients = filteredClients.filter(client => getClientStats(client, appointmentsArray, now).totalSpentThisYear <= Number(maxSpent));
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
    sortedClients = [...filteredClients].sort((a, b) => `${getClientStats(b, appointmentsArray, now).nearestAppointment?.date} ${getClientStats(b, appointmentsArray, now).nearestAppointment?.time}`.localeCompare(`${getClientStats(a, appointmentsArray, now).nearestAppointment?.date} ${getClientStats(a, appointmentsArray, now).nearestAppointment?.time}`));
  } else if (currentSort === 'appointment-down') {
    sortedClients = [...filteredClients].sort((a, b) => `${getClientStats(a, appointmentsArray, now).nearestAppointment?.date} ${getClientStats(a, appointmentsArray, now).nearestAppointment?.time}`.localeCompare(`${getClientStats(b, appointmentsArray, now).nearestAppointment?.date} ${getClientStats(b, appointmentsArray, now).nearestAppointment?.time}`));
  } else if (currentSort === 'sum-up') {
    sortedClients = [...filteredClients].sort((a, b) => getClientStats(a, appointmentsArray, now).totalSpentThisYear - getClientStats(b, appointmentsArray, now).totalSpentThisYear);
  } else if (currentSort === 'sum-down') {
    sortedClients = [...filteredClients].sort((a, b) => getClientStats(b, appointmentsArray, now).totalSpentThisYear - getClientStats(a, appointmentsArray, now).totalSpentThisYear);
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

        <div className="clients-page__controls data-page__toolbar">
          <input
            className="data-page__search"
            type="text"
            name="search-field"
            placeholder="Поиск"
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
            <option value="a-z">А – Я</option>
            <option value="z-a">Я – А</option>
            <option value="appointment-down">Ближайшие записи сначала</option>
            <option value="appointment-up">Позднейшие записи сначала</option>
            <option value="sum-up">По потраченной сумме ↑</option>
            <option value="sum-down">По потраченной сумме ↓</option>
          </select>
        </div>

        <div className="clients-page__controls data-page__filters">
          <label className="data-page__checkbox">
            <span>Только посещавшие за год</span>
            <input
              type="checkbox"
              name="did-visit"
              id=""
              checked={didVisitCheckbox}
              onChange={() => setDidVisitCheckbox(!didVisitCheckbox)}
            />
          </label>

          <div className="clients-page__controls__total-spent-filter data-page__range-card">
            <div className="data-page__range-header">
              <h4>Сумма за год</h4>
              <p>Доступный диапазон: от {formatMoney(Number(minSpentLimit))} до {formatMoney(Number(maxSpentLimit))}</p>
            </div>

            <div className="data-page__number-pair">
              <label className="data-page__field">
                <span>От</span>
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
              </label>

              <label className="data-page__field">
                <span>До</span>
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
              </label>
            </div>

            <label className="data-page__range">
              <span>От</span>
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

            <label className="data-page__range">
              <span>До</span>
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

          <button
            className="data-page__reset-button"
            type="button"
            onClick={handleResetFilters}
          >Сбросить фильтры
          </button>

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
              {sortedClients.map(client => {
                const clientStats = getClientStats(client, appointmentsArray, now)

                return <tr key={client.id}>
                  <th>{`${client.firstname} ${client.surname}`}</th>
                  <td>{client.tel ?
                    <a href={`tel:+${client.tel}`}>{formatStoredPhone(client.tel)}</a> : 'Телефон не указан'}</td>
                  <td>
                    <a href={`https://t.me/${client.telegram}`}>@{client.telegram}</a>
                  </td>
                  <td>
                    <span className="data-page__badge">{clientStats.endedAppointmentsThisYearCount}</span>
                  </td>
                  <td>
                    <span className="data-page__money">{formatMoney(clientStats.totalSpentThisYear)}</span>
                  </td>
                  <td>{clientStats.nearestAppointment ? formatAppointmentDateTime(clientStats.nearestAppointment.date, clientStats.nearestAppointment.time) : '—'}</td>
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
              })}
            </tbody>
          </table>
        </div>

        <div className="clients-page__statistics-under-table data-page__summary">
          <p>Всего клиентов: {clientsState.clients.length}</p>
          <p>Скрыто клиентов: {clientsState.clients.length - sortedClients.length}</p>
          <p>Показано клиентов: {sortedClients.length}</p>
        </div>

      </section>

    </main>
  )
}
