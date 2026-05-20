export function ClientCard({name, tel, telegram, onDelete, onEdit}) {
  return (
    <div>
      <p>{name}</p>
      <p>{tel}</p>
      <p>{telegram}</p>
      <button type={"button"} onClick={onDelete}>Удалить</button>
      <button type={"button"} onClick={onEdit}>Редактировать</button>
    </div>
  )
}