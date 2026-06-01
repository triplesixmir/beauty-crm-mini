export function ClientCard({name, tel, telegram, onDelete, onEdit}) {
  return (
    <div>
      <p>Имя: {name}</p>
      <p>Телефон: {tel}</p>
      <p>Telegram: {telegram}</p>
      <button type={"button"} onClick={onDelete}>Удалить</button>
      <button type={"button"} onClick={onEdit}>Редактировать</button>
    </div>
  )
}