// noinspection D

import {
  EmployeesPageStatsCard
} from "../../components/employees/EmployeesPageStatsCard.jsx";

// Иконки
import {
  Lock as LockIcon,
  LockOpen as LockOpenIcon,
  PiggyBank as PiggyBankIcon,
  Scissors as ScissorsIcon,
  Pencil as PencilIcon,
  Trash as TrashIcon,
  Maximize2 as Maximize2Icon,
  Check as CheckIcon,
  X as XIcon,
} from "lucide-react"
import {ReviewsSection} from "./sections/ReviewsSection.jsx";
import {
  formatAppointmentDateTime,
  formatMoney, formatReviewsCount
} from "../../utils/formatters.js";
import {useState} from "react";
import {getEmployeeStats} from "../../utils/employeeStats.js";

export function EmployeesPage({
                                employeesState,
                                appointmentsArray,
                                openEmployeeAddModal,
                                openEmployeeEditModal,
                                openReviewAddModal,
                                openReviewEditModal,
                                reviewsState,
                                clientsState,
                                alertsState,
                                toastsState,
                                openSidebarTab,
                                now,
                              }) {

  // КАРТОЧКИ СТАТИСТИКИ
  const activeEmployees = employeesState.employees.filter(employee => employee.status === 'active');
  const inactiveEmployees = employeesState.employees.filter(employee => employee.status === 'inactive' || employee.status === 'vacation');
  const totalEmployeesPaycheck = formatMoney(employeesState.employees.reduce((sum, employee) => sum + Number(employee.salary), 0));
  const employeesAtWork = employeesState.employees.filter(employee => employee.status === 'active' && employee.workDays.includes(now.getDay()));

  const [selectedSort, setSelectedSort] = useState('default');
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const [selectedStatus, setSelectedStatus] = useState('all-statuses');

  let filteredEmployees = [...employeesState.employees];
  let sortedEmployeesRows = [...filteredEmployees];

  let filteredAppointmentsArray = [...appointmentsArray];

  const sorts = [
    {value: 'default', label: "По умолчанию"},
    {value: 'a-z', label: "А – Я"},
    {value: 'z-a', label: "Я – А"},
    {value: 'rating-up', label: "По рейтингу ↑"},
    {value: 'rating-down', label: "По рейтингу ↓"},
    {value: 'revenue-up', label: "По выручке ↑"},
    {value: 'revenue-down', label: "По выручке ↓"},
    {value: 'appointments-up', label: "По количеству записей ↑"},
    {value: 'appointments-down', label: "По количеству записей ↓"},
  ]

  const statuses = [
    {value: 'active', label: "Активный"},
    {value: 'inactive', label: "Неактивный"},
    {value: 'vacation', label: "Отпуск"}
  ]

  // ФИЛЬТРАЦИЯ
  // === ПО ПЕРИОДУ ===
  // получение начала и конца периода
  function getPeriodStartEnd(period) {
    if (period === 'this-month') {
      return {
        start: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
        end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
      }
    } else if (period === 'this-week') {
      const daysFromMonday = (now.getDay() + 6) % 7;

      const currentMoment = new Date(now);
      const monday = new Date(currentMoment.setDate(currentMoment.getDate() - daysFromMonday));
      const end = new Date(monday);
      const sunday = new Date(end.setDate(end.getDate() + 6));

      return {
        start: monday.setHours(0, 0, 0, 0),
        end: sunday.setHours(23, 59, 59, 999),
      }
    } else if (period === 'this-year') {
      return {
        start: new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0),
        end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
      }
    }
  }

  const period = getPeriodStartEnd(selectedPeriod)

  // фильтрация записей
  // по периоду
  if (selectedPeriod === 'this-month') {
    filteredAppointmentsArray = [...filteredAppointmentsArray].filter(appointment =>
      new Date(`${appointment.date}T${appointment.time}:00`) >= new Date(period.start) &&
      new Date(`${appointment.date}T${appointment.time}:00`) <= new Date(period.end));

  } else if (selectedPeriod === 'this-week') {
    filteredAppointmentsArray = [...filteredAppointmentsArray].filter(appointment =>
      new Date(`${appointment.date}T${appointment.time}:00`) >= new Date(period.start) &&
      new Date(`${appointment.date}T${appointment.time}:00`) <= new Date(period.end));

  } else if (selectedPeriod === 'this-year') {
    filteredAppointmentsArray = [...filteredAppointmentsArray].filter(appointment =>
      new Date(`${appointment.date}T${appointment.time}:00`) >= new Date(period.start) &&
      new Date(`${appointment.date}T${appointment.time}:00`) <= new Date(period.end));

  } else if (selectedPeriod === 'all-time') {
    filteredAppointmentsArray = [...appointmentsArray];
  }

  // фильтрация сотрудников
  // по статусу
  if (selectedStatus === 'active') {
    filteredEmployees = [...filteredEmployees].filter(employee => employee.status === 'active');
  } else if (selectedStatus === 'inactive') {
    filteredEmployees = [...filteredEmployees].filter(employee => employee.status === 'inactive');
  } else if (selectedStatus === 'vacation') {
    filteredEmployees = [...filteredEmployees].filter(employee => employee.status === 'vacation');
  } else if (selectedStatus === 'all-statuses') {
    filteredEmployees = [...filteredEmployees];
  }

  // TODO: потом добавить сюда можно: доступен/нет, есть отзывы/нет (с привязкой к периоду) и т.д.

  // СОЗДАНИЕ ОБЪЕКТА СТАТИСТИКИ + СОТРУДНИКА ДЛЯ СОРТИРОВКИ
  const employeeRows = [...filteredEmployees].map(row => {
    return {
      employee: row,
      stats: getEmployeeStats(row, filteredAppointmentsArray, reviewsState.reviews, now),
    }
  })

  // СОРТИРОВКА

  function handleChangeSort(event) {
    setSelectedSort(event.target.value);
  }

  if (selectedSort === 'default') {
    sortedEmployeesRows = [...employeeRows];
  } else if (selectedSort === 'a-z') {
    sortedEmployeesRows = [...employeeRows].sort((a, b) => `${a.employee.firstname} ${a.employee.surname}`.localeCompare(`${b.employee.firstname} ${b.employee.surname}`));
  } else if (selectedSort === 'z-a') {
    sortedEmployeesRows = [...employeeRows].sort((a, b) => `${b.employee.firstname} ${b.employee.surname}`.localeCompare(`${a.employee.firstname} ${a.employee.surname}`));
  } else if (selectedSort === 'rating-up') {
    sortedEmployeesRows = [...employeeRows].sort((a, b) => a.stats.rating - b.stats.rating);
  } else if (selectedSort === 'rating-down') {
    sortedEmployeesRows = [...employeeRows].sort((a, b) => b.stats.rating - a.stats.rating);
  } else if (selectedSort === 'revenue-up') {
    sortedEmployeesRows = [...employeeRows].sort((a, b) => a.stats.revenue - b.stats.revenue);
  } else if (selectedSort === 'revenue-down') {
    sortedEmployeesRows = [...employeeRows].sort((a, b) => b.stats.revenue - a.stats.revenue);
  } else if (selectedSort === 'appointments-up') {
    sortedEmployeesRows = [...employeeRows].sort((a, b) => a.stats.appointmentsCount - b.stats.appointmentsCount);
  } else if (selectedSort === 'appointments-down') {
    sortedEmployeesRows = [...employeeRows].sort((a, b) => b.stats.appointmentsCount - a.stats.appointmentsCount);
  }

  // ДЕЙСТВИЯ С СОТРУДНИКАМИ
  function handleDeleteClick(employee) {
    alertsState.openAlert({
      title: `Удаление сотрудника ${employee.firstname} ${employee.surname}`,
      description: "Вы уверены, что хотите удалить сотрудника?",
      secondDescription: "Это действие необратимо и все данные о сотруднике будут удалены.",
      submitButtonText: "Да, удалить",
      cancelButtonText: "Нет, не удалять",
      onSubmit: () => {
        employeesState.handleDeleteEmployee(employee.id);
        alertsState.closeAlert();
        toastsState.showToast("info", "Сотрудник успешно удален", 3000);
      },
      onClose: alertsState.closeAlert,
    })
  }

  function handleOpenEmployeeDetails(employee) {
    openSidebarTab({
      type: "employee",
      id: employee.id,
      title: `${employee.firstname} ${employee.surname}`,
      key: `employee:${employee.id}`,
    });
  }

  return (
    <main className="app-shell employees-page">
      <header className="employees-page__header">
        <div className="employees-page__section-heading">
          <p className="section__eyebrow">Команда</p>
          <h2>Сотрудники</h2>
        </div>
        <button
          className="section__add-btn"
          type="button"
          onClick={openEmployeeAddModal}
        >Добавить сотрудника
        </button>
      </header>

      {/*== ФИЛЬТРЫ ==*/}
      <section className="employees-page__filters">
        <select
          className="employees-page__filter"
          name="choose-status"
          id=""
          value={selectedStatus}
          onChange={(event) => setSelectedStatus(event.target.value)}
        >
          <option value="all-statuses">Все</option>
          <option value="active">Активные</option>
          <option value="inactive">Неактивные</option>
          <option value="vacation">В отпуске</option>
        </select>

        <select
          className="employees-page__filter"
          name="choose-period"
          id=""
          value={selectedPeriod}
          onChange={(event) => setSelectedPeriod(event.target.value)}
        >
          <option value="all-time">За все время</option>
          <option value="this-month">Текущий месяц</option>
          <option value="this-week">Текущая неделя</option>
          <option value="this-year">Текущий год</option>
        </select>
      </section>

      {/*== КАРТОЧКИ СТАТИСТИКИ ==*/}
      <section className="employees-page__metrics">

        <EmployeesPageStatsCard
          heading="Активные мастера"
          value={activeEmployees.length}
        >
          <LockOpenIcon />
        </EmployeesPageStatsCard>

        <EmployeesPageStatsCard
          heading="Неактивные мастера"
          value={inactiveEmployees.length}
        >
          <LockIcon />
        </EmployeesPageStatsCard>

        <EmployeesPageStatsCard
          heading="Общая зарплата"
          value={totalEmployeesPaycheck}
        >
          <PiggyBankIcon />
        </EmployeesPageStatsCard>

        <EmployeesPageStatsCard
          heading="Работают сегодня"
          value={employeesAtWork.length}
        >
          <ScissorsIcon />
        </EmployeesPageStatsCard>

      </section>

      {/*== ГРАФИК МАСТЕРОВ ==*/}
      <section className="employees-page__schedule">
        <div className="employees-page__section-heading">
          <p className="section__eyebrow">Нагрузка</p>
          <h2>График мастеров</h2>
        </div>

        <div className="employees-page__table-wrapper">
          <table className="employees-page__schedule-table">
            <thead>
              <tr>
                <th scope="col">Сотрудник</th>
                <th scope="col">Пн</th>
                <th scope="col">Вт</th>
                <th scope="col">Ср</th>
                <th scope="col">Чт</th>
                <th scope="col">Пт</th>
                <th scope="col">Сб</th>
                <th scope="col">Вс</th>
              </tr>
            </thead>
            <tbody>
              {employeesState.employees.map((employee) => {
                const workDays = employee.workDays;

                return (
                  <tr key={employee.id}>
                    <th scope="row">{`${employee.firstname} ${employee.surname}`}</th>
                    <td>{workDays.includes(1) ? <CheckIcon /> : <XIcon />}</td>
                    <td>{workDays.includes(2) ? <CheckIcon /> : <XIcon />}</td>
                    <td>{workDays.includes(3) ? <CheckIcon /> : <XIcon />}</td>
                    <td>{workDays.includes(4) ? <CheckIcon /> : <XIcon />}</td>
                    <td>{workDays.includes(5) ? <CheckIcon /> : <XIcon />}</td>
                    <td>{workDays.includes(6) ? <CheckIcon /> : <XIcon />}</td>
                    <td>{workDays.includes(0) ? <CheckIcon /> : <XIcon />}</td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

      </section>

      {/*== ТАБЛИЦА СОТРУДНИКОВ ==*/}
      <section className="employees-page__directory">
        <div className="employees-page__directory-header">
          <div className="employees-page__section-heading">
            <p className="section__eyebrow">Список</p>
            <h2>Все сотрудники</h2>
          </div>

          <select
            className="employees-page__sort"
            name="sort"
            id=""
            value={selectedSort}
            onChange={handleChangeSort}
          >
            {sorts.map(sort => (
              <option
                key={sort.value}
                value={sort.value}
              >{sort.label}
              </option>
            ))}
          </select>
        </div>

        {sortedEmployeesRows.length > 0
          ?
          <div className="employees-page__table-wrapper">
            <table className="employees-page__table">
              <thead>
                <tr>
                  <th scope="col">Имя и фамилия</th>
                  <th scope="col">Статус</th>
                  <th scope="col">Кол-во записей</th>
                  <th scope="col">Выручка</th>
                  <th scope="col">Доступность</th>
                  <th scope="col">Ближайшая запись</th>
                  <th scope="col">Рейтинг</th>
                  <th scope="col">Действия</th>
                </tr>
              </thead>
              <tbody>
                {sortedEmployeesRows.map(row => {

                  return (
                    <tr key={row.employee.id}>
                      <td>{`${row.employee.firstname} ${row.employee.surname}`}</td>
                      <td>{statuses.find(status => status.value === row.employee.status).label}</td>
                      <td>{row.stats.appointmentsCount}</td>
                      <td>{formatMoney(row.stats.revenue)}</td>
                      <td>{row.stats.availability}</td>
                      <td>{row.stats.nextAppointment ? formatAppointmentDateTime(row.stats.nextAppointment.date, row.stats.nextAppointment.time) : "Пока нет записей"}</td>
                      <td>
                        <span>{row.stats.rating ? row.stats.rating : null}</span> {formatReviewsCount(row.stats.reviewsCount)}
                      </td>
                      <td className="employees-page__actions">
                        <button
                          className="employees-page__action-button"
                          onClick={() => openEmployeeEditModal(row.employee)}
                          aria-label={`Редактировать ${row.employee.firstname} ${row.employee.surname}`}
                        >
                          <PencilIcon />
                        </button>
                        <button
                          className="employees-page__action-button employees-page__action-button--danger"
                          onClick={() => handleDeleteClick(row.employee)}
                          aria-label={`Удалить ${row.employee.firstname} ${row.employee.surname}`}
                        >
                          <TrashIcon />
                        </button>
                        <button
                          className="employees-page__action-button"
                          onClick={() => handleOpenEmployeeDetails(row.employee)}
                          aria-label={`Открыть данные ${row.employee.firstname} ${row.employee.surname}`}
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
          :
          <div className="employees-page__empty">
            <h2>Нет подходящих сотрудников</h2>
            <p>Попробуйте изменить настройки фильтра</p>
          </div>
        }

      </section>

      {/*== ОТЗЫВЫ КЛИЕНТОВ ==*/}
      <ReviewsSection
        reviewsState={reviewsState}
        alertsState={alertsState}
        toastsState={toastsState}
        appointmentsArray={appointmentsArray}
        openReviewAddModal={openReviewAddModal}
        openReviewEditModal={openReviewEditModal}
        clientsArray={clientsState.clients}
        employeesArray={employeesState.employees}
      />

    </main>
  )
}
