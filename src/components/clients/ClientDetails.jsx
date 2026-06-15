// noinspection D

import {SERVICES, SERVICES_LABELS} from "../../constants/services.js";
import {formatDate, formatMoney, formatTime} from "../../utils/formatters.js";
import {useState} from "react";
import {formatStoredPhone} from "../../utils/phone.js";

export function ClientDetails({
                                client,
                                appointments,
                                handleUpdateClient,
                              }) {

  // Это должно быть на самом верху
  if (!client) return null;

  const now = new Date();

  const AVATAR_COLOR_STYLES = [
    'avatar--sage',
    'avatar--rose',
    'avatar--sky',
    'avatar--lavender',
    'avatar--sand',
  ];
  const avatarColorStyle = AVATAR_COLOR_STYLES[client.id % AVATAR_COLOR_STYLES.length];
  const clientInitials = `${client.firstname?.[0] ?? ''}${client.surname?.[0] ?? ''}`.toUpperCase();

  const clientAppointments = appointments.filter(appointment => appointment.clientId === client.id);

  const sortedClientAppointments = [...clientAppointments].sort((a, b) => {
    const firstDate = new Date(`${a.date}T${a.time}`);
    const secondDate = new Date(`${b.date}T${b.time}`);

    return firstDate - secondDate;
  })

  function getAppointmentDateTime(date, time) {
    return new Date(`${date}T${time}`);
  }

  const serviceStats = SERVICES.map(service => ({
    ...service,
    count: clientAppointments.filter(appointment => appointment.service === service.value).length,
  }));

  const [isEditingNotes, setIsEditingNotes] = useState(false);
  const [draftNotes, setDraftNotes] = useState(client.notes ?? '');

  function handleChangeNotesMode() {
    setIsEditingNotes(!isEditingNotes);
  }

  function handleEditNotes(event) {
    setDraftNotes(event.target.value);
  }

  function handleSubmitChangingNotes() {
    setIsEditingNotes(false);
    handleUpdateClient({...client, notes: draftNotes});
  }

  // noinspection D
  return (
    <>

      {/*== АВАТАР КЛИЕНТА ==*/}
      <div className="client-details__profile">
        <div className={`client-details__avatar ${avatarColorStyle}`}>
          <span className="client-details__avatar-initials">{clientInitials}</span>
        </div>

        <h2 className="client-details__name">{`${client.firstname} ${client.surname}`}</h2>
      </div>

      {/*== ОСНОВНАЯ ИНФОРМАЦИЯ О КЛИЕНТЕ ==*/}
      <div className="client-details__info-list">
        <p>
          <span>Telegram</span>
          <span>@{client.telegram ? client.telegram : 'Не указан'}</span>
        </p>
        <p>
          <span>Телефон</span>
          <span>{client.tel ? formatStoredPhone(client.tel) : 'Не указан'}</span>
        </p>
        <p>
          <span>Почта</span>
          <span>{client.email ? client.email : 'Не указана'}</span>
        </p>
      </div>

      {/*== ТАБЛИЦА ЗАПИСЕЙ КЛИЕНТА ==*/}
      <h2>Записи клиента</h2>
      {sortedClientAppointments.length > 0
        ? <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th scope="col">ID записи</th>
                <th scope="col">Дата</th>
                <th scope="col">Время</th>
                <th scope="col">Услуга</th>
                <th scope="col">Стоимость</th>
                <th scope="col">Не пришел(ла)</th>
              </tr>
            </thead>
            <tbody>
              {sortedClientAppointments.map(appointment => (
                <tr key={appointment.id}>
                  <th scope="row">{appointment.id}</th>
                  <td>{formatDate(getAppointmentDateTime(appointment.date, appointment.time))}</td>
                  <td>{formatTime(getAppointmentDateTime(appointment.date, appointment.time))}</td>
                  <td>{SERVICES_LABELS[appointment.service]}</td>
                  <td>{formatMoney(appointment.price)}</td>
                  <td>{getAppointmentDateTime(appointment.date, appointment.time) < now ? appointment.didntCome ? '■' : '□' : 'Запись не завершена'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        : <p>Записей пока нет</p>
      }

      {/*== СТАТИСТИКА КЛИЕНТА ==*/}
      <h2>Статистика</h2>
      {/*TODO: На будущее: здесь сделать процентами, а то сейчас, если у человека 100 записей на укладку, то будет 100 этих прямоугольников, это многовато*/}
      {serviceStats.map((service) => (
        <p key={service.value}>{service.label}: {"".padStart(service.count, "█")} {service.count}</p>
      ))}

      {/*== ЗАМЕТКИ КЛИЕНТА ==*/}
      <h2>Заметки</h2>
      {isEditingNotes
        ? <textarea
          value={draftNotes}
          onChange={handleEditNotes}
        />
        : <p>{client.notes || 'Заметок пока нет. Добавьте первую!'}</p>
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

      {/*TODO: реализовать кнопки действий с клиентом (удалить, редактировать, позвонить, написать и так далее)*/}

    </>
  )
}
