import {
  Star as StarIcon,
  Trash as TrashIcon,
  Pencil as PencilIcon
} from "lucide-react"
import {formatAppointmentDateTime} from "../../utils/formatters.js";

export function ReviewCard({
                             reviewId,
                             author,
                             rating,
                             text,
                             appointment,
                             openReviewEditModal,
                             alertsState,
                             toastsState,
                             reviewsState,
                           }) {

  function handleDeleteClick() {
    alertsState.openAlert({
      title: `Удаление отзыва от ${author.firstname} ${author.surname} | запись ${formatAppointmentDateTime(appointment.date, appointment.time)}`,
      description: "Вы уверены, что хотите удалить отзыв?",
      secondDescription: "Это действие необратимо и все данные об отзыве будут удалены.",
      submitButtonText: "Да, удалить",
      cancelButtonText: "Нет, не удалять",
      onSubmit: () => {
        reviewsState.removeReview(reviewId);
        alertsState.closeAlert();
        toastsState.showToast("info", "Отзыв успешно удален", 3000)
      },
      onClose: alertsState.closeAlert,
    })
  }

  return (
    <article className="review-card">
      <h3>{`${author.firstname} ${author.surname}`}</h3>
      <p>{`запись от ${formatAppointmentDateTime(appointment?.date, appointment?.time)}`}</p>
      <div className="review-card__rating">{Array(rating).fill(null).map((_, index) =>
        <StarIcon key={index + 1} />)}</div>
      <p>{text}</p>

      <div className="review-card__actions">
        <button
          type="button"
          aria-label="Редактировать отзыв"
          onClick={openReviewEditModal}
        ><PencilIcon /></button>
        <button
          type="button"
          aria-label="Удалить отзыв"
          onClick={handleDeleteClick}
        ><TrashIcon /></button>
      </div>
    </article>
  )
}
