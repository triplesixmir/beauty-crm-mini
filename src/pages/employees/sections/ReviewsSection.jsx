import {ReviewCard} from "../../../components/reviews/ReviewCard.jsx";

export function ReviewsSection({
                                 reviewsState,
                                 alertsState,
                                 toastsState,
                                 appointments,
                                 clients,
                                 employees,
                                 openReviewAddModal,
                                 openReviewEditModal,
                               }) {
  return (
    <section className="employees-page__reviews">
      <div className="employees-page__reviews-header">
        <div className="employees-page__section-heading">
          <p className="section__eyebrow">Обратная связь</p>
          <h2>Отзывы клиентов</h2>
        </div>
        <button
          className="section__add-btn"
          onClick={openReviewAddModal}
        >Добавить отзыв
        </button>
      </div>

      <div className="employees-page__reviews-list">

        {reviewsState.reviews.length > 0 ? reviewsState.reviews.map(review => {

            const reviewAppointment = appointments.find(appointment => appointment.id === Number(review.appointmentId));
            const reviewAuthor = reviewAppointment ? clients.find(client => client.id === Number(reviewAppointment.clientId)) : null;
            const reviewEmployee = reviewAppointment ? employees.find(employee => employee.id === Number(reviewAppointment.employeeId)) : null;

            return (
              <ReviewCard
                key={review.id}
                reviewId={review.id}
                author={reviewAuthor}
                rating={review.rating}
                text={review.text}
                appointment={reviewAppointment}
                employee={reviewEmployee}
                openReviewEditModal={() => openReviewEditModal(review)}
                alertsState={alertsState}
                toastsState={toastsState}
                reviewsState={reviewsState}
                reviewEmployee={reviewEmployee}
              />
            )
          }) :
          <div className="reviews-section__empty">
            <h2>Нет подходящих отзывов</h2>
            <p>Попробуйте изменить настройки фильтра</p>
          </div>
        }

      </div>

    </section>
  )
}
