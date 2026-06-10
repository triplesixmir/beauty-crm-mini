import {formatStoredPhone} from "../utils/phone.js";
import {
  formatAppointmentsCount,
  formatTimeUntilAppointment
} from "../utils/formatters.js";

export function ClientCard({
                             firstname,
                             surname,
                             tel,
                             telegram,
                             onDelete,
                             onEdit,
                             stats,
                             currentYear,
                           }) {

  const telegramLink = `https://t.me/${telegram}`;
  const telLink = `tel:${tel}`;

  return (
    <div className="card">
      <p>Имя: {`${firstname} ${surname}`}</p>
      <p>Телефон: <a href={telLink}>{formatStoredPhone(tel)}</a></p>
      <p>Telegram: <a href={telegramLink}>@{telegram}</a></p>
      <p>Всего посещений за {currentYear}: {formatAppointmentsCount(stats.appointmentsThisYearCount)}</p>
      <p>Всего потрачено за {currentYear}: {stats.totalSpentThisYear}</p>
      {stats.timeToAppointmentMs &&
        <p>До ближайшего посещения: {formatTimeUntilAppointment(stats.timeToAppointmentMs)}</p>}
      <div className="card__actions">
        <button
          type={"button"}
          onClick={onDelete}
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