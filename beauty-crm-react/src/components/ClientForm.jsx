import {useEffect, useState} from "react";

export function ClientForm({
                             onAddClient,
                             onEditing,
                             onUpdateClient,
                             onCancelEdit
                           }) {
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [telegram, setTelegram] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (onEditing) {
      setName(onEditing.name);
      setTel(onEditing.tel);
      setTelegram(onEditing.telegram);
    }
  }, [onEditing])

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!name.trim()) {
      newErrors.name = 'Имя не может быть пустым';
    }

    if (!tel.trim()) {
      newErrors.tel = 'Телефон не может быть пустым';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onEditing) {
      const updatedClient = {id: onEditing.id, name, tel, telegram};
      onUpdateClient(updatedClient);
    } else {
      const clientData = {name, tel, telegram};
      onAddClient(clientData);
    }

    setErrors({});
    setName('');
    setTel('');
    setTelegram('');
  }

  function handleEditCancel() {
    setErrors({});
    setName('');
    setTel('');
    setTelegram('');
    onCancelEdit();
  }

  return (
    <>
      <h2>{onEditing ? 'Редактирование клиента' : 'Добавление клиента'}</h2>
      <form
        className="inputs-container"
        onSubmit={handleSubmit}
      >
        <input
          type="text"
          name="name"
          id=""
          placeholder="Имя клиента"
          value={name}
          onChange={(event) => setName(event.target.value)}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          type="text"
          name="tel"
          id=""
          placeholder="Телефон"
          value={tel}
          onChange={(event) => setTel(event.target.value)}
        />
        {errors.tel && <p className="error">{errors.tel}</p>}

        <input
          type="text"
          name="telegram"
          id=""
          placeholder="Telegram"
          value={telegram}
          onChange={(event) => setTelegram(event.target.value)}
        />

        <button type="submit">
          {onEditing ? 'Сохранить' : 'Добавить'}
        </button>
        {onEditing && (
          <button
            type="button"
            onClick={handleEditCancel}
          >Отменить
          </button>
        )
        }

      </form>
    </>
  )
}