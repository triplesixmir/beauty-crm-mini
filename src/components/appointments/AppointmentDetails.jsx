// noinspection D

import {
  formatAppointmentDateTime, formatMoney,
  formatTimeUntilAppointment
} from "../../utils/formatters.js";
import {useState} from "react";
import {formatStoredPhone} from "../../utils/phone.js";

export function AppointmentDetails({
                                     appointment,
                                     clientsArray,
                                     employeesArray,
                                     handleUpdateAppointment,
                                   }) {

  // Стейты должны быть выше, чем early return
  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [draftNotes, setDraftNotes] = useState(appointment?.notes ?? '');

  // Early return, если нет записи
  if (!appointment) return null;

  const now = new Date();

  // Получение клиента
  const client = (clientsArray.find(client => client.id === appointment.clientId) ? clientsArray.find(client => client.id === appointment.clientId) : null)

  // Получение сотрудника
  const employee = (employeesArray.find(employee => employee.id === appointment.employeeId) ? employeesArray.find(employee => employee.id === appointment.employeeId) : null)

  // Работа с временем записи
  const timeToAppointmentMs = new Date(`${appointment.date}T${appointment.time}`).getTime() - now.getTime();
  const isAppointmentEnded = timeToAppointmentMs < 0;

  // Работа с заметками по записи
  function handleChangeNotesMode() {
    setIsEditingNotes(!isEditingNotes);
  }

  function handleEditNotes(event) {
    setDraftNotes(event.target.value);
  }

  function handleSubmitChangingNotes() {
    setIsEditingNotes(false);
    handleUpdateAppointment({...appointment, notes: draftNotes});
  }

  // Аватар клиентской карточки
  const AVATAR_COLOR_STYLES = [
    'avatar--sage',
    'avatar--rose',
    'avatar--sky',
    'avatar--lavender',
    'avatar--sand',
  ];
  const avatarColorStyle = client ? AVATAR_COLOR_STYLES[client.id % AVATAR_COLOR_STYLES.length] : null;
  const clientInitials = client && `${client?.firstname?.[0]}${client?.surname?.[0]}`;

  return (
    <>

      {/*== ЗАГОЛОВОК ==*/}
      <h2>{client ? client.firstname + ' ' + client.surname : "Удаленный клиент"} | {formatAppointmentDateTime(appointment?.date, appointment?.time)}</h2>

      {/*== ДО ЗАПИСИ ОСТАЛОСЬ ==*/}
      {isAppointmentEnded
        ?
        <p>Запись завершена {formatTimeUntilAppointment(Math.abs(timeToAppointmentMs))} назад</p>
        :
        <p>До начала сеанса осталось {formatTimeUntilAppointment(timeToAppointmentMs)}</p>}

      {/*== КЛИЕНТСКАЯ ИНФОРМАЦИЯ ==*/}
      {client
        ? (<>
          <div className="appointment-details__client-card">
            <div className={`appointment-details__client-avatar ${avatarColorStyle}`}>{clientInitials}</div>
            <h3>{client?.firstname} {client?.surname}</h3>
          </div>
          <p>Почта: {client.email ? client?.email : 'Не указана'}</p>
          <p>Телефон: {client.tel ? formatStoredPhone(client?.tel) : 'Не указан'}
          </p>
          <p>Telegram: {client.telegram ? `@${client?.telegram}` : 'Не указан'}</p>
        </>)
        :
        (
          <div>
            <h2>Клиент не найден</h2>
            <p>Эта запись связана с клиентом, который был удален.
            </p>
          </div>
        )
      }

      {/*== ИНФОРМАЦИЯ ПО ЗАПИСИ ==*/}
      {/*TODO: для мастера сделать похожую карточку как у клиента в деталях записи*/}
      {employee ?
        <div>
          <p>Мастер: {employee ? `${employee.firstname} ${employee.surname}` : 'Не указан'}</p>
          <p>Телефон мастера: {employee?.tel ? formatStoredPhone(employee?.tel) : 'Не указан'}
          </p>
          <p>Telegram мастера: {employee?.telegram ? `@${employee?.telegram}` : 'Не указан'}</p>
        </div>
        :
        <div>
          <h2>Сотрудник не найден</h2>
          <p>Эта запись связана с сотрудником, который был удален.
          </p>
        </div>
      }
      <p>Стоимость: {appointment.price ? formatMoney(appointment.price) : 'Не указана'}</p>

      {/*== ЗАМЕТКИ ПО ЗАПИСИ ==*/
      }
      <h2>Заметки по записи</h2>
      {
        isEditingNotes
          ? <textarea
            value={draftNotes}
            onChange={handleEditNotes}
          />
          : <p>{appointment.notes || 'Заметок пока нет. Добавьте первую!'}</p>
      }
      {
        isEditingNotes
          ? <button
            type="button"
            onClick={handleSubmitChangingNotes}
          >Сохранить</button>
          : <button
            type="button"
            onClick={handleChangeNotesMode}
          >Редактировать</button>
      }

      {/*TODO: реализовать "календарик" соседних записей (+- 3 записи в будущее и в прошлое от активной)*/
      }

      {/*TODO: реализовать кнопки действий с записями (удалить, редактировать, "не пришел(ла)", позвонить, написать и т.д.*/
      }

    </>
  )
}