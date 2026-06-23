// noinspection D

import {useState} from "react";
import {formatPhoneInput, getLocalPhoneDigits} from "../../utils/phone.js";
import {SERVICES} from "../../constants/services.js";

function getInitialFormData(onEditing) {
  if (onEditing) {
    return {
      firstname: onEditing.firstname,
      surname: onEditing.surname,
      tel: onEditing.tel,
      telegram: onEditing.telegram,
      specialization: onEditing.specialization,
      workDays: onEditing.workDays,
      salary: onEditing.salary,
      notes: onEditing.notes,
      status: onEditing.status,
    }
  }

  return {
    firstname: '',
    surname: '',
    tel: '',
    telegram: '',
    specialization: [],
    workDays: [],
    salary: '',
    notes: '',
    status: 'active',
  }
}

export function EmployeeForm({
                               onEditing,
                               onAddEmployee,
                               onUpdateEmployee,
                               onCancel,
                               onSuccess,
                             }) {


  const [formData, setFormData] = useState(getInitialFormData(onEditing));
  const [errors, setErrors] = useState({});

  const weekDays = [
    {value: '1', label: 'Понедельник'},
    {value: '2', label: 'Вторник'},
    {value: '3', label: 'Среда'},
    {value: '4', label: 'Четверг'},
    {value: '5', label: 'Пятница'},
    {value: '6', label: 'Суббота'},
    {value: '0', label: 'Воскресенье'},
  ]

  function handleSubmitClick(event) {
    event.preventDefault();

    const newErrors = {};

    if (formData.specialization.length === 0) {
      newErrors.specialization = 'Пожалуйста, выберите минимум одну специализацию';
    }

    if (!formData.firstname.trim()) {
      newErrors.firstname = 'Пожалуйста, введите имя';
    }

    if (!formData.surname.trim()) {
      newErrors.surname = 'Пожалуйста, введите фамилию';
    }

    if (!formData.tel.trim()) {
      newErrors.tel = 'Пожалуйста, введите номер телефона';
    }

    if (!formData.telegram.trim()) {
      newErrors.telegram = 'Пожалуйста, введите Telegram сотрудника';
    }

    if (!formData.salary.trim()) {
      newErrors.salary = 'Пожалуйста, введите зарплату';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      handleSaveEmployee();
    }
  }

  function handleSaveEmployee() {

    if (onEditing) {
      const updatedEmployee = {
        ...formData,
        id: onEditing.id,
      }

      onUpdateEmployee(updatedEmployee);
    } else {
      onAddEmployee(formData);
    }

    setErrors({});
    setFormData(getInitialFormData(onEditing));
    onSuccess?.();
  }

  function handleCancel() {
    setErrors({});
    setFormData(getInitialFormData(onEditing));
    onCancel?.()
  }

  function handleChange(event) {
    const {name, value, type, checked} = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  function handlePhoneChange(event) {
    setFormData({
      ...formData,
      tel: getLocalPhoneDigits(event.target.value),
    });
  }

  function handleChangeSpecializationCheckbox(event) {
    event.target.checked ? setFormData({
      ...formData,
      specialization: [...formData.specialization, event.target.value],
    }) : setFormData({
      ...formData,
      specialization: formData.specialization.filter(specialization => specialization !== event.target.value),
    })
  }

  function handleChangeWorkDaysCheckbox(event) {
    event.target.checked ? setFormData({
      ...formData,
      workDays: [...formData.workDays, Number(event.target.value)],
    }) : setFormData({
      ...formData,
      workDays: formData.workDays.filter(workDay => workDay !== Number(event.target.value)),
    })
  }

  return (
    <form
      className="inputs-container inputs-container--employee"
      onSubmit={handleSubmitClick}
    >

      {/*== ИМЯ ==*/}
      <input
        type="text"
        name="firstname"
        placeholder="Имя сотрудника"
        value={formData.firstname}
        onChange={handleChange}
      />
      {errors.firstname && <p className="error">{errors.firstname}</p>}

      {/*== ФАМИЛИЯ ==*/}
      <input
        type="text"
        name="surname"
        placeholder="Фамилия сотрудника"
        value={formData.surname}
        onChange={handleChange}
      />
      {errors.surname && <p className="error">{errors.surname}</p>}

      {/*== ТЕЛЕФОН ==*/}
      <input
        type="text"
        name="tel"
        placeholder="Телефон"
        value={formatPhoneInput(formData.tel)}
        onChange={handlePhoneChange}
      />
      {errors.tel && <p className="error">{errors.tel}</p>}

      {/*== TELEGRAM ==*/}
      <input
        type="text"
        name="telegram"
        placeholder="Telegram"
        value={formData.telegram}
        onChange={handleChange}
      />
      {errors.telegram && <p className="error">{errors.telegram}</p>}

      {/*== НАЗНАЧЕНИЕ ЗАРПЛАТЫ ==*/}
      <input
        type="number"
        name="salary"
        placeholder="Зарплата"
        value={formData.salary}
        onChange={handleChange}
      />
      {errors.salary && <p className="error">{errors.salary}</p>}

      {/*== ВЫБОР СПЕЦИАЛИЗАЦИИ ==*/}
      <div className="employee-form__specialization-checkboxes">

        {SERVICES.map((service) => {
          return (
            <label key={service.value}>
              {service.label}
              <input
                type="checkbox"
                value={service.value}
                name="specialization"
                checked={formData.specialization.includes(service.value)}
                onChange={handleChangeSpecializationCheckbox}
              />
            </label>
          )
        })}

      </div>
      {errors.specialization &&
        <p className="error">{errors.specialization}</p>}

      {/*== РАБОЧИЕ ДНИ ==*/}

      <div className="employee-form__workdays-checkboxes">
        {weekDays.map((day) => {
          return (
            <label key={day.value}>{day.label}
              <input
                type="checkbox"
                value={Number(day.value)}
                checked={formData.workDays.includes(Number(day.value))}
                onChange={handleChangeWorkDaysCheckbox}
              />
            </label>
          )
        })}
      </div>

      {/*== СТАТУС ==*/}
      <select
        name="status"
        id=""
        value={formData.status}
        onChange={handleChange}
      >
        <option value="active">Активен</option>
        <option value="vacation">В отпуске</option>
        <option value="inactive">Не активен</option>
      </select>

      {/*== ЗАМЕТКИ ==*/}
      <input
        type="text"
        name="notes"
        placeholder="Заметки по сотруднику"
        value={formData.notes}
        onChange={handleChange}
      />

      <div className="employee-form__actions">
        <button type="submit">
          {onEditing ? 'Сохранить' : 'Добавить'}
        </button>
        <button
          type="button"
          onClick={handleCancel}
        >Отменить
        </button>
      </div>

    </form>
  )
}
