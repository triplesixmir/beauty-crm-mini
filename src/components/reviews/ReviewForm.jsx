// noinspection D

import {formatAppointmentDateTime} from "../../utils/formatters.js";

// Иконки
import {Star as StarIcon} from "lucide-react";
import {useState} from "react";

function getInitialFormData(onEditing) {
  if (onEditing) {
    return {
      appointmentId: onEditing.appointmentId,
      rating: onEditing.rating,
      text: onEditing.text,
    }
  } else {
    return {
      appointmentId: 'choose-appointmentId',
      rating: 0,
      text: '',
    }
  }
}

export function ReviewForm({
                             appointments,
                             clients,
                             onEditing,
                             onAddReview,
                             onUpdateReview,
                             onCancel,
                             onSuccess,
                             showToast,
                             now,
                           }) {

  const [formData, setFormData] = useState(getInitialFormData(onEditing));
  const [errors, setErrors] = useState({});
  const [hoveredRating, setHoveredRating] = useState(null);
  const displayedRating = hoveredRating ?? formData.rating;

  const period = {
    start: new Date(new Date(new Date(now).setDate(new Date(now).getDate() - 7)).setHours(0, 0, 0, 0)),
    end: new Date(now),
  }
  const filteredAppointments = [...appointments].filter(appointment => new Date(`${appointment.date}T${appointment.time}`) <= period.end
    && new Date(`${appointment.date}T${appointment.time}`) >= period.start
    && appointment.didntCome === false
  );


  function handleSubmitClick(event) {
    event.preventDefault();

    const newErrors = {};

    if (formData.rating === 0) {
      newErrors.rating = "Установите рейтинг от 1 до 5";
    }

    if (!formData.appointmentId || formData.appointmentId === 'choose-appointmentId') {
      newErrors.appointmentId = "Выберите источник отзыва (запись)"
    }

    if (!formData.text || formData.text === '') {
      newErrors.text = "Введите текст отзыва"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else if (Object.keys(newErrors).length === 0) {
      handleSaveReview();
    }

  }

  function handleSaveReview() {
    const appointment = appointments.find(appointment => Number(formData.appointmentId) === appointment.id);

    if (onEditing) {
      onUpdateReview({
        ...formData,
        id: Number(onEditing.id),
        appointmentId: Number(onEditing.appointmentId),
        employeeId: Number(onEditing.employeeId),
        clientId: Number(onEditing.clientId),
      })

      showToast("success", "Отзыв успешно обновлен", 3000)
    } else {
      onAddReview({
        ...formData,
        appointmentId: Number(formData.appointmentId),
        employeeId: Number(appointment.employeeId),
        clientId: Number(appointment.clientId),
      })

      showToast("success", "Отзыв успешно добавлен", 3000)
    }

    setFormData(() => getInitialFormData(onEditing));
    setErrors({});
    onSuccess?.();
  }

  function handleCancelClick() {
    setErrors({});
    setFormData(() => getInitialFormData(onEditing));
    onCancel?.();
  }

  function handleChange(event) {
    const {name, value} = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  return (
    <form
      className="inputs-container inputs-container--review"
      onSubmit={handleSubmitClick}
    >

      {/*== ОТКУДА ПРИШЕЛ ОТЗЫВ ==*/}
      <select
        name="appointmentId"
        value={formData.appointmentId}
        onChange={handleChange}
      >
        <option value="choose-appointmentId">Выберите источник отзыва</option>
        {filteredAppointments.map(appointment => {

          const client = clients.find(client => client.id === appointment.clientId);

          return (
            <option
              value={appointment.id}
              key={appointment.id}
            >
              {`${client?.firstname} ${client?.surname} | ${formatAppointmentDateTime(appointment.date, appointment.time)}`}
            </option>
          )
        })}
      </select>
      {errors.appointmentId && <p className="error">{errors.appointmentId}</p>}

      {/*== ВЫБОР РЕЙТИНГА ==*/}
      <div
        className="review-form__rating-container"
        onMouseLeave={() => setHoveredRating(null)}
      >

        {[1, 2, 3, 4, 5].map(rating => {

          return (
            <button
              key={rating}
              type="button"
              className={`review-form__rating-icon ${rating <= displayedRating ? 'review-form__rating-icon--active' : ''}`}
              onMouseEnter={() => setHoveredRating(rating)}
              onClick={() => setFormData({...formData, rating})}
            >
              <StarIcon />
            </button>
          )
        })}

      </div>
      {errors.rating && <p className="error">{errors.rating}</p>}

      {/*== ТЕКСТ ОТЗЫВА ==*/}
      <input
        type="text"
        name="text"
        placeholder="Введите текст отзыва"
        value={formData.text}
        onChange={handleChange}
      />
      {errors.text && <p className="error">{errors.text}</p>}

      {/*== КНОПКИ ==*/}
      <button type="submit">
        {onEditing ? 'Сохранить' : 'Добавить'}
      </button>
      <button
        type="button"
        onClick={handleCancelClick}
      >Отменить
      </button>

    </form>
  )
}