import {useEffect, useState} from "react";

export function ClientForm({ onAddClient, onEditing, onUpdateClient }) {
  const [name, setName] = useState('');
  const [tel, setTel] = useState('');
  const [telegram, setTelegram] = useState('');

  useEffect(() => {
    if (onEditing) {
      setName(onEditing.name);
      setTel(onEditing.tel);
      setTelegram(onEditing.telegram);
    }
  }, [onEditing])

  function handleSubmit(event) {
    event.preventDefault();

    if (onEditing) {
      const updatedClient = {id: onEditing.id, name, tel, telegram};
      onUpdateClient(updatedClient);
    } else {
      const clientData = {name, tel, telegram};
      onAddClient(clientData);
    }

    setName('');
    setTel('');
    setTelegram('');
  }

  return (
    <form className="inputs-container" onSubmit={handleSubmit}>
      <input
        type="text"
        name="name"
        id=""
        value={name}
        onChange={(event) => setName(event.target.value)}
      />

      <input
        type="text"
        name="tel"
        id=""
        value={tel}
        onChange={(event) => setTel(event.target.value)}
      />

      <input
        type="text"
        name="telegram"
        id=""
        value={telegram}
        onChange={(event) => setTelegram(event.target.value)}
      />

      <button type="submit">Добавить</button>
    </form>
  )
}