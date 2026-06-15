// noinspection D

import {useState} from "react";
import {SERVICES} from "../../constants/services.js";
import {formatDate, formatTime} from "../../utils/formatters.js";

function getInitialFormData(onEditing) {
  if (onEditing) {
    return {
      date: onEditing.date,
      time: onEditing.time,
      price: onEditing.price,
      service: onEditing.service,
      clientId: onEditing.clientId ? String(onEditing.clientId) : 'choose-client',
      didntCome: Boolean(onEditing.didntCome),
    }
  }

  return {
    date: '',
    time: '',
    price: '',
    service: 'choose-service',
    clientId: 'choose-client',
    didntCome: false,
  }
}

export function AppointmentForm({
                                  onAddAppointment,
                                  clientsArray,
                                  onEditing,
                                  onUpdateAppointment,
                                  onCancel,
                                  onSuccess,
                                  showToast,
                                }) {

  const [formData, setFormData] = useState(() => getInitialFormData(onEditing))
  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();

    const currentNow = new Date();
    const nowDate = `${currentNow.getFullYear()}-${String(currentNow.getMonth() + 1).padStart(2, '0')}-${String(currentNow.getDate()).padStart(2, '0')}`;
    const nowTime = `${String(currentNow.getHours()).padStart(2, '0')}:${String(currentNow.getMinutes()).padStart(2, '0')}`
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Укажите дату';
    } else if (formData.date < nowDate) {
      newErrors.date = `Нельзя создать запись на дату раньше, чем ${formatDate(currentNow)}`
    }

    if (!formData.time) {
      newErrors.time = 'Укажите время';
    } else if (formData.date === nowDate && formData.time < nowTime) {
      newErrors.time = `Нельзя создать запись на время раньше, чем ${formatTime(currentNow)}`
    }

    if (!formData.price) {
      newErrors.price = 'Укажите стоимость';
    } else if (Number(formData.price) <= 0) {
      newErrors.price = 'Стоимость должна быть положительной';
    }

    if (!formData.service || formData.service === 'choose-service') {
      newErrors.service = 'Выберите услугу';
    }

    if (formData.clientId === 'choose-client') {
      newErrors.client = 'Выберите клиента';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onEditing) {
      const updatedAppointment = {
        ...formData,
        id: onEditing.id,
        notes: onEditing.notes,
        clientId: Number(formData.clientId)
      };
      onUpdateAppointment(updatedAppointment);
      showToast("success", "Запись успешно обновлена", 3000)
    } else {
      const appointmentData = {
        ...formData,
        clientId: Number(formData.clientId)
      };
      onAddAppointment(appointmentData);
      showToast("success", "Запись успешно создана", 3000)
    }

    setFormData(() => getInitialFormData(onEditing));
    setErrors({});
    onSuccess?.();
  }

  function handleCancel() {
    setErrors({});
    setFormData(() => getInitialFormData(onEditing));
    onCancel?.();
  }

  function handleChange(event) {
    const {name, value, type, checked} = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  return (
    <form
      className="inputs-container"
      onSubmit={handleSubmit}
    >
      <select
        name="clientId"
        id=""
        value={formData.clientId}
        onChange={handleChange}
      >
        <option
          value="choose-client"
          key="choose-client"
        >Выберите клиента
        </option>
        {clientsArray.map(client => (
          <option
            value={client.id}
            key={client.id}
          >
            {`${client.firstname} ${client.surname}`}
          </option>
        ))}
      </select>
      {errors.client && <p className="error">{errors.client}</p>}

      <select
        name="service"
        id=""
        value={formData.service}
        onChange={handleChange}
      >
        <option
          value="choose-service"
          className="service-option"
        >Выберите услугу
        </option>
        {SERVICES.map((service) => (
          <option
            value={service.value}
            key={service.value}
          >{service.label}</option>
        ))}
      </select>
      {errors.service && <p className="error">{errors.service}</p>}

      <input
        type="date"
        name="date"
        id=""
        value={formData.date}
        onChange={handleChange}
      />
      {errors.date && <p className="error">{errors.date}</p>}

      <input
        type="time"
        name="time"
        id=""
        value={formData.time}
        onChange={handleChange}
      />
      {errors.time && <p className="error">{errors.time}</p>}

      <input
        type="number"
        name="price"
        id=""
        placeholder="Цена услуги"
        value={formData.price}
        onChange={handleChange}
      />
      {errors.price && <p className="error">{errors.price}</p>}

      <label>
        Клиент не пришел(ла)?
        <input
          type="checkbox"
          name="didntCome"
          id=""
          checked={formData.didntCome}
          onChange={handleChange}
        />
      </label>

      <button type="submit">
        {onEditing ? 'Сохранить' : 'Добавить'}
      </button>
      <button
        type="button"
        onClick={handleCancel}
      >
        Отменить
      </button>
    </form>
  )
}