// noinspection D

import {useState} from "react";
import {formatStoredPhone} from "../../utils/phone.js";
import {
  formatAppointmentDateTime,
  formatDate,
  formatMoney,
  formatTime
} from "../../utils/formatters.js";
import {SERVICES_LABELS} from "../../constants/services.js";

// ИКОНКИ
import {Check as CheckIcon, X as XIcon} from 'lucide-react';
import {
  getEmployeeServiceStats,
  getEmployeeStats
} from "../../utils/employeeStats.js";

function getAppointmentDateTime(date, time) {
  return new Date(`${date}T${time}`);
}

export function EmployeeDetails({
                                  activeEmployee,
                                  reviewsArray,
                                  handleUpdateEmployee,
                                  openSidebarTab,
                                  appointmentsArray,
                                  now,
                                }) {

  // Стейты должны быть выше, чем early return
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [draftNotes, setDraftNotes] = useState(activeEmployee?.notes || '');

  // Early return, если нет сотрудника
  if (!activeEmployee) return null;

  // Дни недели
  const weekDays = [
    {value: 1, label: 'Понедельник', short: 'Пн'},
    {value: 2, label: 'Вторник', short: 'Вт'},
    {value: 3, label: 'Среда', short: 'Ср'},
    {value: 4, label: 'Четверг', short: 'Чт'},
    {value: 5, label: 'Пятница', short: 'Пт'},
    {value: 6, label: 'Суббота', short: 'Сб'},
    {value: 0, label: 'Воскресенье', short: 'Вс'},
  ]

  // Аватар сотрудника
  const AVATAR_COLOR_STYLES = [
    'avatar--sage',
    'avatar--rose',
    'avatar--sky',
    'avatar--lavender',
    'avatar--sand',
  ];
  const avatarColorStyle = AVATAR_COLOR_STYLES[activeEmployee.id % AVATAR_COLOR_STYLES.length];
  const employeeInitials = `${activeEmployee.firstname?.[0] ?? ''}${activeEmployee.surname?.[0] ?? ''}`.toUpperCase();

  // Работа с заметками
  function handleChangeNotesMode() {
    setIsEditingNotes(true);
  }

  function handleSubmitChangingNotes(event) {
    event.preventDefault();

    handleUpdateEmployee({...activeEmployee, notes: draftNotes});
    setIsEditingNotes(false);
  }

  function handleEditNotes(event) {
    setDraftNotes(event.target.value);
  }

  // Получение статистики сотрудника
  const employeeStats = getEmployeeStats(activeEmployee, appointmentsArray, reviewsArray, now)
  const sortedEmployeeAppointments = [...employeeStats.employeeAppointments].sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));
  const serviceStats = getEmployeeServiceStats(employeeStats.employeeAppointments);

  function openAppointmentDetailsSidebar(appointment) {
    openSidebarTab({
      type: 'appointment',
      id: appointment.id,
      title: `${formatAppointmentDateTime(appointment.date, appointment.time)}`,
      key: `appointment:${appointment.id}`,
    });
  }

  return (
    <div className="employee-details">

      {/*== АВАТАР СОТРУДНИКА ==*/}
      <div className="employee-details__profile">
        <div className={`employee-details__avatar ${avatarColorStyle}`}>
          <span className="employee-details__avatar-initials">{employeeInitials}</span>
        </div>

        <h2 className="employee-details__name">{`${activeEmployee.firstname} ${activeEmployee.surname}`}</h2>
      </div>

      {/*== ОСНОВНАЯ ИНФОРМАЦИЯ О СОТРУДНИКЕ ==*/}
      <div className="employee-details__info-list">
        <p>
          <span>Telegram</span>
          <span>{activeEmployee.telegram ?
            <a href={`https://t.me/${activeEmployee.telegram}`}>@{activeEmployee.telegram}</a> : 'Не указан'}</span>
        </p>
        <p>
          <span>Телефон</span>
          <span>{activeEmployee.tel ?
            <a href={`tel:${activeEmployee.tel}`}>{formatStoredPhone(activeEmployee.tel)}</a> : 'Не указан'}</span>
        </p>
        <div className="employee-details__block">
          <h2>Рабочие дни</h2>
          <table className="employee-details__schedule-table">
            <thead>
              <tr>
                {weekDays.map(day => {
                  return (
                    <th
                      key={day.value}
                      scope="col"
                    >{day.short}</th>
                  )
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                {weekDays.map(day => {
                  return (
                    <td key={day.value}>{activeEmployee.workDays.includes(day.value) ?
                      <CheckIcon /> : <XIcon />}</td>
                  )
                })}
              </tr>
            </tbody>
          </table>
        </div>
        <div className="employee-details__block">
          <h2>Специализации</h2>
          <ul className="employee-details__specializations">{activeEmployee.specialization.map(specialization => {
            return (
              <li key={specialization}>
                {SERVICES_LABELS[specialization]}
              </li>
            )
          })}
          </ul>
        </div>
      </div>

      {/*== ТАБЛИЦА ЗАПИСЕЙ СОТРУДНИКА ==*/}
      <h2 className="employee-details__section-title">Записи сотрудника</h2>
      {sortedEmployeeAppointments.length > 0
        ? <div className="table-wrapper employee-details__table-wrapper">
          <table>
            <thead>
              <tr>
                <th scope="col">ID записи</th>
                <th scope="col">Дата</th>
                <th scope="col">Время</th>
                <th scope="col">Услуга</th>
                <th scope="col">Стоимость</th>
                <th scope="col">Рейтинг</th>
              </tr>
            </thead>
            <tbody>
              {sortedEmployeeAppointments.map(appointment => (
                <tr key={appointment.id}>
                  <th
                    scope="row"
                    onClick={() => openAppointmentDetailsSidebar(appointment)}
                  >{appointment.id}</th>
                  <td>{formatDate(getAppointmentDateTime(appointment.date, appointment.time))}</td>
                  <td>{formatTime(getAppointmentDateTime(appointment.date, appointment.time))}</td>
                  <td>{SERVICES_LABELS[appointment.service]}</td>
                  <td>{formatMoney(appointment.price)}</td>
                  <td>{reviewsArray.find(review => review.appointmentId === appointment.id)?.rating ?? '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        : <p className="employee-details__empty">Записей пока нет</p>
      }

      {/*== СТАТИСТИКА СОТРУДНИКА ПО УСЛУГАМ ==*/}
      <h2 className="employee-details__section-title">Статистика по услугам</h2>
      <div className="table-wrapper employee-details__table-wrapper">
        <table>
          <thead>
            <tr>
              <th scope="col">Услуга</th>
              <th scope="col">Количество</th>
              <th scope="col">Процент</th>
            </tr>
          </thead>
          <tbody>
            {serviceStats.map((service) => (
              <tr key={service.value}>
                <th scope="row">{service.label}</th>
                <td>{service.count}</td>
                <td>{Number.isNaN(service.percent) ? '–' : `${service.percent}%`}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/*TODO: статистику сотрудника в целом*/}
      {/*== ОБЩАЯ СТАТИСТИКА СОТРУДНИКА ==*/}
      <table className="employee-details__summary-table">
        <thead>
          <tr>
            <th scope="col">Кол-во записей</th>
            <th scope="col">Выручка</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>{employeeStats.appointmentsCount}</td>
            <td>{employeeStats.revenue}</td>
          </tr>
        </tbody>
      </table>

      {/*== ЗАМЕТКИ СОТРУДНИКА ==*/}
      <section className="employee-details__notes">
        <h2>Заметки</h2>
        {isEditingNotes
          ? <textarea
            value={draftNotes}
            onChange={handleEditNotes}
          />
          : <p>{activeEmployee.notes || 'Заметок пока нет. Добавьте первую!'}</p>
        }
        {isEditingNotes
          ? <button
            type="button"
            onClick={handleSubmitChangingNotes}
          >Сохранить</button>
          : <button
            type="button"
            onClick={handleChangeNotesMode}
          >Редактировать</button>}
      </section>

      {/*TODO: реализовать кнопки действий с сотрудником (удалить, редактировать, позвонить, написать и так далее)*/}

    </div>
  )
}
