export function AppointmentCard({ clientName, date, time, price, service, id, onDelete }) {

  return (
    <div>
      <p>ID записи: {id}</p>
      <p>Клиент: {clientName}</p>
      <p>Услуга: {service}</p>
      <p>Дата: {date}</p>
      <p>Время: {time}</p>
      <p>Цена: {price}</p>

      <button type={"button"} onClick={onDelete}>Удалить</button>
    </div>
  )
}