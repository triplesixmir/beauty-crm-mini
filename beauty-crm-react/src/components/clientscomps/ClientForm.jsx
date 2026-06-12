import {useState} from "react";
import {
  formatPhoneInput,
  getLocalPhoneDigits,
  toStoredPhone
} from "../../utils/phone.js";

function getInitialFormData(onEditing) {
  if (onEditing) {
    return {
      firstname: onEditing.firstname,
      surname: onEditing.surname,
      tel: getLocalPhoneDigits(onEditing.tel),
      telegram: onEditing.telegram,
      email: onEditing.email,
      notes: onEditing.notes,
    }
  }

  return {
    firstname: '',
    surname: '',
    tel: '',
    telegram: '',
    email: '',
    notes: '',
  }
}

export function ClientForm({
                             onAddClient,
                             onEditing,
                             onUpdateClient,
                             onSuccess,
                             onCancel,
                             showToast,
                           }) {

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(() => getInitialFormData(onEditing))

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!formData.firstname.trim()) {
      newErrors.firstname = 'Имя не может быть пустым';
    }

    if (!formData.surname.trim()) {
      newErrors.surname = 'Фамилия не может быть пустой';
    }

    if (!formData.tel.trim()) {
      newErrors.tel = 'Телефон не может быть пустым';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    if (onEditing) {
      onUpdateClient({
        id: onEditing.id,
        ...formData,
        tel: toStoredPhone(formData.tel),
      });
      showToast("success", "Клиент успешно обновлен", 3000);
    } else {
      onAddClient({
        ...formData,
        tel: toStoredPhone(formData.tel),
      });
      showToast("success", "Клиент успешно добавлен", 3000);
    }

    setErrors({});
    setFormData(() => getInitialFormData(onEditing))
    onSuccess?.();
  }

  function handleCancel() {
    setErrors({});
    setFormData(() => getInitialFormData(onEditing))
    onCancel?.();
  }

  function handleChange(event) {
    const {name, value} = event.target;

    setFormData({
      ...formData,
      [name]: value,
    });
  }

  function handlePhoneChange(event) {
    setFormData({
      ...formData,
      tel: getLocalPhoneDigits(event.target.value),
    });
  }

  return (
    <form
      className="inputs-container"
      onSubmit={handleSubmit}
    >

      <input
        type="text"
        name="firstname"
        placeholder="Имя клиента"
        value={formData.firstname}
        onChange={handleChange}
      />
      {errors.firstname && <p className="error">{errors.firstname}</p>}

      <input
        type="text"
        name="surname"
        placeholder="Фамилия клиента"
        value={formData.surname}
        onChange={handleChange}
      />
      {errors.surname && <p className="error">{errors.surname}</p>}

      <input
        type="text"
        name="tel"
        placeholder="Телефон"
        value={formatPhoneInput(formData.tel)}
        onChange={handlePhoneChange}
      />
      {errors.tel && <p className="error">{errors.tel}</p>}

      <input
        type="text"
        name="telegram"
        placeholder="Telegram"
        value={formData.telegram}
        onChange={handleChange}
      />

      <input
        type="email"
        name="email"
        placeholder="Email"
        value={formData.email}
        onChange={handleChange}
      />

      <input
        type="text"
        name="notes"
        placeholder="Заметки по клиенту"
        value={formData.notes}
        onChange={handleChange}
      />

      <button type="submit">
        {onEditing ? 'Сохранить' : 'Добавить'}
      </button>
      <button
        type="button"
        onClick={handleCancel}
      >Отменить
      </button>

    </form>
  )
}