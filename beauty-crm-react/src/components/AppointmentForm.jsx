// noinspection D

import {useEffect, useState} from "react";

export function AppointmentForm({
                                  onAddAppointment,
                                  clientsArray,
                                  onEditing,
                                  onUpdateAppointment
                                }) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [service, setService] = useState('choose-service');
  const [clientId, setClientId] = useState('choose-client');
  const [errors, setErrors] = useState({});

  const today = new Date().toDateString();

  useEffect(() => {
    if (onEditing) {
      setDate(onEditing.date);
      setTime(onEditing.time);
      setPrice(onEditing.price);
      setService(onEditing.service);
      setClientId(onEditing.clientId || 'choose-client');
    }
  }, [onEditing])

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!date) {
      newErrors.date = 'Укажите дату';
    } else if (date < today) {
      newErrors.date = `Дата не может быть раньше, чем ${today}`
    }

    if (!time) {
      newErrors.time = 'Укажите время';
    }

    if (!price) {
      newErrors.price = 'Укажите стоимость';
    } else if (Number(price) <= 0) {
      newErrors.price = 'Стоимость должна быть положительной';
    }

    if (!service || service === 'choose-service') {
      newErrors.service = 'Выберите услугу';
    }

    if (!clientId) {
      newErrors.client = 'Выберите клиента';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onEditing) {
      const updatedAppointment = {
        id: onEditing.id,
        date,
        time,
        price,
        service,
        clientId: Number(clientId)
      };
      onUpdateAppointment(updatedAppointment);
    } else {
      const appointmentData = {
        date,
        time,
        price,
        service,
        clientId: Number(clientId)
      };
      onAddAppointment(appointmentData);
    }

    setDate('');
    setTime('');
    setPrice('');
    setService('choose-service');
    setClientId('choose-client');
  }

  return (
    <form
      className="inputs-container"
      onSubmit={handleSubmit}
    >
      <select
        name="client-select"
        id=""
        value={clientId}
        onChange={(event) => setClientId(Number(event.target.value))}
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
        name="service-select"
        id=""
        value={service}
        onChange={(event) => setService(event.target.value)}
      >
        <option
          value="choose-service"
          className="service-option"
        >Выберите услугу
        </option>
        <option
          value="manicure"
          className="service-option"
        >Маникюр
        </option>
        <option
          value="pedicure"
          className="service-option"
        >Педикюр
        </option>
        <option
          value="laying"
          className="service-option"
        >Укладка
        </option>
        <option
          value="haircut"
          className="service-option"
        >Стрижка
        </option>
        <option
          value="depilation"
          className="service-option"
        >Депиляция
        </option>
      </select>
      {errors.service && <p className="error">{errors.service}</p>}

      <input
        type="date"
        name="date"
        id=""
        value={date}
        onChange={(event) => setDate(event.target.value)}
      />
      {errors.date && <p className="error">{errors.date}</p>}

      <input
        type="time"
        name="time"
        id=""
        value={time}
        onChange={(event) => setTime(event.target.value)}
      />
      {errors.time && <p className="error">{errors.time}</p>}

      <input
        type="number"
        name="price"
        id=""
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      />
      {errors.price && <p className="error">{errors.price}</p>}

      <button type="submit">Добавить</button>
    </form>
  )
}