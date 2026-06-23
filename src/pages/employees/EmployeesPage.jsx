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
} from "lucide-react"
import {ReviewsSection} from "./sections/ReviewsSection.jsx";
import {
  formatAppointmentDateTime,
  formatMoney, formatReviewsCount
} from "../../utils/formatters.js";
import {useState} from "react";

export function EmployeesPage({
                                employeesState,
                                appointments,
                                openEmployeeAddModal,
                                openEmployeeEditModal,
                                openReviewAddModal,
                                // openReviewEditModal,
                                reviewsState,
                                clientsState,
                                alertsState,
                                toastsState,
                                now,
                              }) {

  // + карточки: активные + и неактивные мастера +, общая зп +, свободные мастера +
  // + график мастеров
  // + таблица со всеми сотрудниками: статистика для мастеров внутри таблицы: кол-во записей, выручка, рейтинг
  // + отзывы от клиентов (пока добавляться будут вручную, но предполагается авто-подтяг)
  // - фильтры периодов (для карточек, для отзывов, для графиков, самих сотрудников не фильтруем, фильтруем только их результаты), сортировка по сотрудникам

  // + колонки для таблицы: имя, фамилия, статус, кол-во записей (за период), рейтинг, свободен/не свободен, ближайшая запись, действия

  // КАРТОЧКИ СТАТИСТИКИ
  const activeEmployees = employeesState.employees.filter(employee => employee.status === 'active');
  const inactiveEmployees = employeesState.employees.filter(employee => employee.status === 'inactive' || employee.status === 'vacation');
  const totalEmployeesPaycheck = employeesState.employees.reduce((sum, employee) => sum + Number(employee.salary), 0);
  const employeesAtWork = employeesState.employees.filter(employee => employee.status === 'active' && employee.workDays.includes(now.getDay()));

  const [selectedSort, setSelectedSort] = useState('default');
  const [selectedPeriod, setSelectedPeriod] = useState('all-time');
  const [selectedStatus, setSelectedStatus] = useState('all-statuses');

  let filteredEmployees = [...employeesState.employees];
  let sortedEmployees = [...filteredEmployees];

  let filteredAppointments = [...appointments];

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

  function getEmployeeStats(employeeId) {

    const employee = employeesState.employees.find(employee => employee.id === employeeId);
    const employeeAppointments = [...filteredAppointments].filter(appointment => appointment.employeeId === employeeId);
    const employeeEndedPaidAppointments = [...employeeAppointments].filter(appointment => new Date(`${appointment.date}T${appointment.time}`) < now && appointment.didntCome === false);
    const employeeFutureAppointments = [...employeeAppointments].filter(appointment => new Date(`${appointment.date}T${appointment.time}`) > new Date());
    const employeeReviews = reviewsState.reviews.filter(review => review.employeeId === employeeId);

    const revenue = [...employeeEndedPaidAppointments].reduce((revenue, appointment) => revenue + Number(appointment.price), 0);
    const rating = [...employeeReviews].reduce((rating, review) => rating + review.rating, 0) / employeeReviews.length;
    const nextAppointment = employeeFutureAppointments.length > 0 ? [...employeeFutureAppointments].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))[0] : null;

    // TODO: доделать доступность. Большая бизнес-логика
    return {
      appointmentsCount: employeeAppointments.length,
      revenue: revenue,
      rating: Number.isNaN(rating) ? null : rating,
      schedule: [...employee.workDays],
      reviewsCount: employeeReviews.length,
      availability: "—",
      nextAppointment: nextAppointment || null,
    }
  }

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
    filteredAppointments = [...filteredAppointments].filter(appointment =>
      new Date(`${appointment.date}T${appointment.time}:00`) >= new Date(period.start) &&
      new Date(`${appointment.date}T${appointment.time}:00`) <= new Date(period.end));

  } else if (selectedPeriod === 'this-week') {
    filteredAppointments = [...filteredAppointments].filter(appointment =>
      new Date(`${appointment.date}T${appointment.time}:00`) >= new Date(period.start) &&
      new Date(`${appointment.date}T${appointment.time}:00`) <= new Date(period.end));

  } else if (selectedPeriod === 'this-year') {
    filteredAppointments = [...filteredAppointments].filter(appointment =>
      new Date(`${appointment.date}T${appointment.time}:00`) >= new Date(period.start) &&
      new Date(`${appointment.date}T${appointment.time}:00`) <= new Date(period.end));

  } else if (selectedPeriod === 'all-time') {
    filteredAppointments = [...appointments];
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

  // СОРТИРОВКА

  function handleChangeSort(event) {
    setSelectedSort(event.target.value);
  }

  if (selectedSort === 'default') {
    sortedEmployees = [...filteredEmployees];
  } else if (selectedSort === 'a-z') {
    sortedEmployees = [...filteredEmployees].sort((a, b) => `${a.firstname} ${a.surname}`.localeCompare(`${b.firstname} ${b.surname}`));
  } else if (selectedSort === 'z-a') {
    sortedEmployees = [...filteredEmployees].sort((a, b) => `${b.firstname} ${b.surname}`.localeCompare(`${a.firstname} ${a.surname}`));
  } else if (selectedSort === 'rating-up') {
    sortedEmployees = [...filteredEmployees].sort((a, b) => getEmployeeStats(b.id).rating - getEmployeeStats(a.id).rating);
  } else if (selectedSort === 'rating-down') {
    sortedEmployees = [...filteredEmployees].sort((a, b) => getEmployeeStats(a.id).rating - getEmployeeStats(b.id).rating);
  } else if (selectedSort === 'revenue-up') {
    sortedEmployees = [...filteredEmployees].sort((a, b) => getEmployeeStats(b.id).revenue - getEmployeeStats(a.id).revenue);
  } else if (selectedSort === 'revenue-down') {
    sortedEmployees = [...filteredEmployees].sort((a, b) => getEmployeeStats(a.id).revenue - getEmployeeStats(b.id).revenue);
  } else if (selectedSort === 'appointments-up') {
    sortedEmployees = [...filteredEmployees].sort((a, b) => getEmployeeStats(b.id).appointmentsCount - getEmployeeStats(a.id).appointmentsCount);
  } else if (selectedSort === 'appointments-down') {
    sortedEmployees = [...filteredEmployees].sort((a, b) => getEmployeeStats(a.id).appointmentsCount - getEmployeeStats(b.id).appointmentsCount);
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

  return (
    <main className="app-shell employees-page">
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
              const stats = getEmployeeStats(employee.id);

              return (
                <tr key={employee.id}>
                  <th scope="row">{`${employee.firstname} ${employee.surname}`}</th>
                  <td>{stats.schedule.includes(1) ? "✔" : ""}</td>
                  <td>{stats.schedule.includes(2) ? "✔" : ""}</td>
                  <td>{stats.schedule.includes(3) ? "✔" : ""}</td>
                  <td>{stats.schedule.includes(4) ? "✔" : ""}</td>
                  <td>{stats.schedule.includes(5) ? "✔" : ""}</td>
                  <td>{stats.schedule.includes(6) ? "✔" : ""}</td>
                  <td>{stats.schedule.includes(0) ? "✔" : ""}</td>
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
            <p className="section__eyebrow">Команда</p>
            <h2>Сотрудники</h2>
          </div>
        <button
          className="section__add-btn"
          type="button"
          onClick={openEmployeeAddModal}
        >Добавить сотрудника
        </button>

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

        {sortedEmployees.length > 0
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
              {sortedEmployees.map(employee => {

                const stats = getEmployeeStats(employee.id);

                return (
                  <tr key={employee.id}>
                    <td>{`${employee.firstname} ${employee.surname}`}</td>
                    <td>{statuses.find(status => status.value === employee.status).label}</td>
                    <td>{stats.appointmentsCount}</td>
                    <td>{formatMoney(stats.revenue)}</td>
                    <td>{stats.availability}</td>
                    <td>{stats.nextAppointment ? formatAppointmentDateTime(stats.nextAppointment.date, stats.nextAppointment.time) : "Пока нет записей"}</td>
                    <td>
                      <span>{stats.rating ? stats.rating : null}</span> {formatReviewsCount(stats.reviewsCount)}
                    </td>
                    <td className="employees-page__actions">
                      <button className="employees-page__action-button" onClick={() => openEmployeeEditModal(employee)} aria-label={`Редактировать ${employee.firstname} ${employee.surname}`}>
                        <PencilIcon />
                      </button>
                      <button className="employees-page__action-button employees-page__action-button--danger" onClick={() => handleDeleteClick(employee)} aria-label={`Удалить ${employee.firstname} ${employee.surname}`}>
                        <TrashIcon />
                      </button>
                      <button className="employees-page__action-button" aria-label={`Открыть данные ${employee.firstname} ${employee.surname}`}>
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
            <h2>Нет результатов</h2>
            <p>Попробуйте изменить фильтры</p>
          </div>
        }

      </section>

      {/*== ОТЗЫВЫ КЛИЕНТОВ ==*/}
      <ReviewsSection
        reviewsState={reviewsState}
        appointments={appointments}
        openReviewAddModal={openReviewAddModal}
        clients={clientsState.clients}
      />

    </main>
  )
}
