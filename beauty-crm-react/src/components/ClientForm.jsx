import {useState} from "react";
import {
  formatPhoneInput,
  getLocalPhoneDigits,
  toStoredPhone
} from "../utils/phone.js";

function getInitialFormData(onEditing) {
  if (onEditing) {
    return {
      name: onEditing.name,
      tel: getLocalPhoneDigits(onEditing.tel),
      telegram: onEditing.telegram,
    }
  }

  return {
    name: '',
    tel: '',
    telegram: '',
  }
}

export function ClientForm({
                             onAddClient,
                             onEditing,
                             onUpdateClient,
                             onSuccess,
                             onCancel,
                           }) {

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState(() => getInitialFormData(onEditing))

  function handleSubmit(event) {
    event.preventDefault();

    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Имя не может быть пустым';
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
    } else {
      onAddClient({
        ...formData,
        tel: toStoredPhone(formData.tel),
      });
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
        name="name"
        placeholder="Имя клиента"
        value={formData.name}
        onChange={handleChange}
      />
      {errors.name && <p className="error">{errors.name}</p>}

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