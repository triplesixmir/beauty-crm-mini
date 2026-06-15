import {formatStoredPhone} from "../../utils/phone.js";
import {
  formatAppointmentsCount,
  formatTimeUntilAppointment
} from "../../utils/formatters.js";

export function ClientCard({
                             firstname,
                             surname,
                             tel,
                             telegram,
                             email,
                             onEdit,
                             stats,
                             currentYear,
                             handleDeleteClick,
                             onOpenDetails,
                           }) {

  const telegramLink = `https://t.me/${telegram}`;
  const telLink = `tel:${tel}`;
  const emailLink = `https://mail.google.com/mail/?view=cm&fs=1&to=${email}`;

  return (
    <div className="card">
      <p>{`${firstname} ${surname}`}</p>
      <p>Телефон: <a href={telLink}>{formatStoredPhone(tel)}</a></p>
      <p>Telegram: <a href={telegramLink}>@{telegram}</a></p>
      <p>Email: <a href={emailLink}>{email}</a></p>
      <p>Посещений за {currentYear}: {formatAppointmentsCount(stats.appointmentsThisYearCount)}</p>
      <p>Потрачено за {currentYear}: {stats.totalSpentThisYear}</p>
      {stats.timeToAppointmentMs &&
        <p>До ближайшего посещения: {formatTimeUntilAppointment(stats.timeToAppointmentMs)}</p>}
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
        <button
          type={"button"}
          onClick={onOpenDetails}
        >Подробнее
        </button>
      </div>
    </div>
  )
}