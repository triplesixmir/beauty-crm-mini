import {useState} from "react";

export function AppointmentForm({onAddAppointment, clientsArray}) {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [price, setPrice] = useState('');
  const [service, setService] = useState('manicure');
  const [clientId, setClientId] = useState(clientsArray[0]?.id || '');


  function handleSubmit(event) {
    event.preventDefault();

    const appointmentData = {date, time, price, service, clientId: Number(clientId)};
    onAddAppointment(appointmentData);

    setDate('');
    setTime('');
    setPrice('');
    setService('manicure');
    setClientId(clientsArray[0]?.id || '');
  }

  return (
    <form
      className="inputs-container"
      onSubmit={handleSubmit}
    >
      <select
        name="client-select"
        id=""
        onChange={(event) => setClientId(Number(event.target.value))}
      >
        {clientsArray.map(client => (
          <option
            value={client.id}
            key={client.id}
          >
            {client.name}
          </option>
        ))}
      </select>

      <select
        name="service-select"
        id=""
        onChange={(event) => setService(event.target.value)}
      >
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

      <input
        type="date"
        name="date"
        id=""
        value={date}
        onChange={(event) => setDate(event.target.value)}
      />

      <input
        type="time"
        name="time"
        id=""
        value={time}
        onChange={(event) => setTime(event.target.value)}
      />

      <input
        type="number"
        name="price"
        id=""
        value={price}
        onChange={(event) => setPrice(event.target.value)}
      />

      <button type="submit">Добавить</button>
    </form>
  )
}