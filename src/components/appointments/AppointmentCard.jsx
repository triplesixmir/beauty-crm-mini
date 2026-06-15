import {
  formatAppointmentDateTime,
  formatMoney
} from "../../utils/formatters.js";
import {SERVICES_LABELS} from "../../constants/services.js";

export function AppointmentCard({
                                  clientName,
                                  date,
                                  time,
                                  price,
                                  service,
                                  didntCome,
                                  id,
                                  onEdit,
                                  handleDeleteClick,
                                  onOpenDetails,
                                }) {

  return (
    <div className="card card--appointment">
      <div className="card__header">
        <div>
          <p className="card__eyebrow">Запись #{id}</p>
          <h3>{clientName}</h3>
        </div>
      </div>

      <div className="card__details">
        <p><span>Услуга</span> {SERVICES_LABELS[service] || service}</p>
        <p><span>Дата и время</span> {formatAppointmentDateTime(date, time)}</p>
        <p><span>Стоимость</span> {formatMoney(price)}</p>
        <p><span>Клиент пришел?</span> {new Date(`${date}T${time}`) < new Date() ? didntCome ? 'Нет' : 'Да' : '—'}</p>
      </div>

      <div className="card__actions">
        <button
          type={"button"}
          onClick={handleDeleteClick}
        >Удалить
        </button>
        <button
          type={"button"}
          onClick={onEdit}
        >Изменить
        </button>
        <button
          type={"button"}
          onClick={onOpenDetails}
        >Подробнее
        </button>

        {/*TODO: сделать кнопочку, отмечающую, завершилась ли запись или нет*/}

      </div>
    </div>
  )
}
