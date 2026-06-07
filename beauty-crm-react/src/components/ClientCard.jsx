import {formatStoredPhone} from "../utils/phone.js";

export function ClientCard({name, tel, telegram, onDelete, onEdit}) {

  const telegramLink = `https://t.me/${telegram}`;
  const telLink = `tel:${tel}`;

  return (
    <div>
      <p>Имя: {name}</p>
      <p>Телефон: <a href={telLink}>{formatStoredPhone(tel)}</a></p>
      <p>Telegram: <a href={telegramLink}>@{telegram}</a></p>
      <button
        type={"button"}
        onClick={onDelete}
      >Удалить
      </button>
      <button
        type={"button"}
        onClick={onEdit}
      >Редактировать
      </button>
    </div>
  )
}