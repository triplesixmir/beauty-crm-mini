import {SERVICES, SERVICES_LABELS} from "../../constants/services.js";
import {formatDate, formatMoney, formatTime} from "../../utils/formatters.js";

export function ClientDetails({
                                client,
                                appointments,
                              }) {

  // Это должно быть на самом верху
  if (!client) return null;

  const clientAppointments = appointments.filter(appointment => appointment.clientId === client.id);

  const sortedClientAppointments = clientAppointments.sort((a, b) => {
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

  return (
    <>

      <img
        src={null}
        alt=""
      />

      <h2 className="client-details__name">{`${client.firstname} ${client.surname}`}</h2>
      <p>Telegram: @{client.telegram}</p>
      <p>Телефон: +{client.tel}</p>
      <p>Почта: {client.email}</p>

      <h2>Записи клиента</h2>
      {sortedClientAppointments.length > 0
        ? <table>
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
              <td>{appointment.id}</td>
              <td>{formatDate(getAppointmentDateTime(appointment.date, appointment.time))}</td>
              <td>{formatTime(getAppointmentDateTime(appointment.date, appointment.time))}</td>
              <td>{SERVICES_LABELS[appointment.service]}</td>
              <td>{formatMoney(appointment.price)}</td>
              <td>{appointment.didntCome ? '■' : '□'}</td>
            </tr>
          ))}
        </tbody>
      </table>
        : <p>Записей пока нет</p>
      }

      <h2>Статистика</h2>
      {/*TODO: На будущее: здесь сделать процентами, а то сейчас, если у человека 100 записей на укладку, то будет 100 этих прямоугольников, это многовато*/}
      {serviceStats.map((service) => (
        <p key={service.value}>{service.label}: {"".padStart(service.count, "█")} {service.count}</p>
      ))}

      {/*TODO: Сделать редактирование через editingClientDetailsField или типа того*/}
      <h2>Заметки</h2>
      <p>{client.notes}</p>

    </>
  )
}