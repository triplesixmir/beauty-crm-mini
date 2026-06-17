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
    <div className="card card--client">
      <div className="card__header">
        <div>
          <p className="card__eyebrow">Клиент</p>
          <h3>{`${firstname} ${surname}`}</h3>
        </div>
      </div>

      <div className="card__details">
        <p><span>Телефон</span> {tel ? <a href={telLink}>{formatStoredPhone(tel)}</a> : 'Телефон не указан'}</p>
        <p><span>Telegram</span> {telegram ? <a href={telegramLink}>@{telegram}</a> : 'Telegram не указан'}</p>
        <p><span>Email</span> {email ? <a href={emailLink}>{email}</a> : 'Email не указан'}</p>
        <p><span>Посещений за {currentYear}</span> {formatAppointmentsCount(stats.appointmentsThisYearCount)}</p>
        <p><span>Потрачено за {currentYear}</span> {stats.totalSpentThisYear}</p>
        {stats.timeToAppointmentMs &&
          <p><span>До ближайшего посещения</span> {formatTimeUntilAppointment(stats.timeToAppointmentMs)}</p>}
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
      </div>
    </div>
  )
}
