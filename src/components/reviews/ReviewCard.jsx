import {
  Star as StarIcon,
  Trash as TrashIcon,
  Pencil as PencilIcon
} from "lucide-react"
import {formatAppointmentDateTime} from "../../utils/formatters.js";

export function ReviewCard({author, rating, text, appointment,}) {

  return (
    <article className="review-card">
      <h3>{`${author.firstname} ${author.surname}`}</h3>
      <p>{`запись от ${formatAppointmentDateTime(appointment?.date, appointment?.time)}`}</p>
      <div className="review-card__rating">{Array(rating).fill(null).map((_, index) =>
        <StarIcon key={index + 1} />)}</div>
      <p>{text}</p>

      <div className="review-card__actions">
        <button type="button" aria-label="Редактировать отзыв"><PencilIcon /></button>
        <button type="button" aria-label="Удалить отзыв"><TrashIcon /></button>
      </div>
    </article>
  )
}
