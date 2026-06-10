import {formatAppointmentDateTime, formatMoney} from "../utils/formatters.js";
import {SERVICES_LABELS} from "../constants/services.js";

export function AppointmentCard({
                                  clientName,
                                  date,
                                  time,
                                  price,
                                  service,
                                  id,
                                  onEdit,
                                  handleDeleteClick,
                                }) {

  return (
    <div className="card">
      <p>ID записи: {id}</p>
      <p>Клиент: {clientName}</p>
      <p>Услуга: {SERVICES_LABELS[service] || service}</p>
      <p>Дата и время: {formatAppointmentDateTime(date, time)}</p>
      <p>Стоимость: {formatMoney(price)}</p>

      <div className="card__actions">
        <button
          type={"button"}
          onClick={handleDeleteClick}
        >Удалить
        </button>
        <button
          type={"button"}
          onClick={onEdit}
        >Редактировать
        </button>
      </div>
    </div>
  )
}