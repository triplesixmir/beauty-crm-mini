// noinspection D

import {useState} from "react";
import {SERVICES} from "../constants/services.js";

function getInitialFormData(onEditing) {
  if (onEditing) {
    return {
      date: onEditing.date,
      time: onEditing.time,
      price: onEditing.price,
      service: onEditing.service,
      clientId: onEditing.clientId ? String(onEditing.clientId) : 'choose-client',
    }
  }

  return {
    date: '',
    time: '',
    price: '',
    service: 'choose-service',
    clientId: 'choose-client',
  }
}

export function AppointmentForm({
                                  today,
                                  onAddAppointment,
                                  clientsArray,
                                  onEditing,
                                  onUpdateAppointment,
                                  onCancelEdit,
                                }) {

  const [formData, setFormData] = useState(() => getInitialFormData(onEditing))

  const [errors, setErrors] = useState({});

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Укажите дату';
    } else if (formData.date < today) {
      newErrors.date = `Дата не может быть раньше, чем ${today}`
    }

    if (!formData.time) {
      newErrors.time = 'Укажите время';
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
        clientId: Number(formData.clientId)
      };
      onUpdateAppointment(updatedAppointment);
    } else {
      const appointmentData = {
        ...formData,
        clientId: Number(formData.clientId)
      };
      onAddAppointment(appointmentData);
    }

    setFormData({
      date: '',
      time: '',
      price: '',
      service: 'choose-service',
      clientId: 'choose-client'
    });
    setErrors({});
  }

  function handleEditCancel() {
    setFormData({
      date: '',
      time: '',
      price: '',
      service: 'choose-service',
      clientId: 'choose-client'
    });
    setErrors({});
    onCancelEdit();
  }

  function handleChange(event) {
    const {name, value} = event.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  }

  return (
    <>
      <h2>{onEditing ? 'Редактирование записи' : 'Добавление записи'}</h2>

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
              {client.name}
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

        <button type="submit">
          {onEditing ? 'Сохранить' : 'Добавить'}
        </button>
        {onEditing && (
          <button
            type="button"
            onClick={handleEditCancel}
          >
            Отменить
          </button>
        )}
      </form>
    </>
  )
}