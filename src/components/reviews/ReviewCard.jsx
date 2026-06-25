import {
  Star as StarIcon,
  Trash as TrashIcon,
  Pencil as PencilIcon
} from "lucide-react"
import {formatAppointmentDateTime} from "../../utils/formatters.js";
import {SERVICES_LABELS} from "../../constants/services.js";

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
                             reviewEmployee,
                           }) {

  function handleDeleteClick() {
    alertsState.openAlert({
      title: `Удаление отзыва от ${author ? author.firstname : "Неизвестного"} ${author ? author.surname : "клиента"} | запись ${appointment ? formatAppointmentDateTime(appointment.date, appointment.time) : "не найдена"}`,
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
      <h3>{`${author ? author.firstname : "Неизвестный"} ${author ? author.surname : "клиент"}`}</h3>
      <p>{`запись от ${appointment ? formatAppointmentDateTime(appointment?.date, appointment?.time) : "—"} | мастер: ${reviewEmployee ? reviewEmployee.firstname : "Неизвестный"} ${reviewEmployee ? reviewEmployee.surname : "мастер"} | ${appointment ? SERVICES_LABELS[appointment?.service] : "Услуга не найдена"}`}</p>
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
