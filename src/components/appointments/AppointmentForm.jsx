// noinspection D

import {useState} from "react";
import {SERVICES} from "../../constants/services.js";
import {
  formatDate,
  formatTime
} from "../../utils/formatters.js";

function getInitialFormData(onEditing) {
  if (onEditing) {
    return {
      date: onEditing.date,
      time: onEditing.time,
      price: onEditing.price,
      service: onEditing.service,
      clientId: onEditing.clientId ? String(onEditing.clientId) : 'choose-client',
      employeeId: onEditing.employeeId,
      didntCome: Boolean(onEditing.didntCome),
    }
  }

  return {
    date: '',
    time: '',
    price: '',
    service: 'choose-service',
    clientId: 'choose-client',
    employeeId: 'choose-activeEmployee',
    didntCome: false,
  }
}

export function AppointmentForm({
                                  onAddAppointment,
                                  clientsArray,
                                  onEditing,
                                  onUpdateAppointment,
                                  onCancel,
                                  onSuccess,
                                  showToast,
                                  alertsState,
                                  employeesArray,
                                }) {

  const [formData, setFormData] = useState(() => getInitialFormData(onEditing))
  const [errors, setErrors] = useState({});

  function handleSubmitClick(event) {
    event.preventDefault();

    const currentNow = new Date();
    const nowDate = `${currentNow.getFullYear()}-${String(currentNow.getMonth() + 1).padStart(2, '0')}-${String(currentNow.getDate()).padStart(2, '0')}`;
    const nowTime = `${String(currentNow.getHours()).padStart(2, '0')}:${String(currentNow.getMinutes()).padStart(2, '0')}`
    const newErrors = {};

    if (!formData.date) {
      newErrors.date = 'Укажите дату';
    } else if (formData.date < nowDate && Object.keys(newErrors).length > 0) {
      newErrors.date = `Нельзя создать запись на дату раньше, чем ${formatDate(currentNow)}`
    }

    if (!formData.time) {
      newErrors.time = 'Укажите время';
    } else if (formData.date === nowDate && formData.time < nowTime && Object.keys(newErrors).length > 0) {
      newErrors.time = `Нельзя создать запись на время раньше, чем ${formatTime(currentNow)}`
    }

    if (!formData.price) {
      newErrors.price = 'Укажите стоимость';
    } else if (Number(formData.price) <= 0) {
      newErrors.price = 'Стоимость должна быть положительной';
    }

    if (!formData.service || formData.service === 'choose-service') {
      newErrors.service = 'Выберите услугу';
    }

    if (!formData.employeeId || formData.employeeId === 'choose-activeEmployee') {
      newErrors.employeeId = 'Выберите сотрудника';
    }

    if (formData.clientId === 'choose-client') {
      newErrors.client = 'Выберите клиента';
    }

    if (formData.date === nowDate && formData.time < nowTime && Object.keys(newErrors).length === 0) {
      alertsState.openAlert({
        title: `Добавление записи на прошедшее время`,
        description: "Вы уверены, что хотите добавить запись на прошедшее время?",
        secondDescription: 'Если это вынужденная мера, нажмите "Да, добавить".',
        submitButtonText: "Да, добавить",
        cancelButtonText: "Нет, не добавлять",
        onSubmit: () => {
          alertsState.closeAlert();
          handleSaveAppointment();
        },
        onClose: () => {
          alertsState.closeAlert();

          setErrors(prev => ({
            ...prev,
            date: `Нельзя создать запись на время раньше, чем ${formatTime(currentNow)}`
          }))

        }
      })
      return;
    }

    if (formData.date < nowDate && Object.keys(newErrors).length === 0) {
      alertsState.openAlert({
        title: `Добавление записи задним числом`,
        description: "Вы уверены, что хотите добавить запись на прошедшую дату?",
        secondDescription: 'Если это вынужденная мера, нажмите "Да, добавить".',
        submitButtonText: "Да, добавить",
        cancelButtonText: "Нет, не добавлять",
        onSubmit: () => {
          alertsState.closeAlert();
          handleSaveAppointment();
        },
        onClose: () => {
          alertsState.closeAlert();

          setErrors(prev => ({
            ...prev,
            date: `Нельзя создать запись на дату раньше, чем ${formatDate(currentNow)}`
          }))

        }
      })
      return;
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else if (Object.keys(newErrors).length === 0) {
      handleSaveAppointment();
    }

  }

  function handleSaveAppointment() {
    if (onEditing) {
      const updatedAppointment = {
        ...formData,
        id: onEditing.id,
        notes: onEditing.notes,
        clientId: Number(formData.clientId),
        employeeId: Number(formData.employeeId),
      };
      onUpdateAppointment(updatedAppointment);
      showToast("success", "Запись успешно обновлена", 3000)
    } else {
      const appointmentData = {
        ...formData,
        clientId: Number(formData.clientId),
        employeeId: Number(formData.employeeId),
      };
      onAddAppointment(appointmentData);
      showToast("success", "Запись успешно создана", 3000)
    }

    setFormData(() => getInitialFormData(onEditing));
    setErrors({});
    onSuccess?.();
  }

  function handleCancel() {
    setErrors({});
    setFormData(() => getInitialFormData(onEditing));
    onCancel?.();
  }

  function handleChange(event) {
    const {name, value, type, checked} = event.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  }

  return (
    <form
      className="inputs-container inputs-container--appointment"
      onSubmit={handleSubmitClick}
    >

      {/*== ВЫБОР КЛИЕНТА ==*/}
      <select
        name="clientId"
        id=""
        value={formData.clientId}
        onChange={handleChange}
      >
        <option
          value="choose-client"
          key="choose-client"
        >Выберите клиента
        </option>
        {clientsArray.map(client => (
          <option
            value={client.id}
            key={client.id}
          >
            {`${client.firstname} ${client.surname}`}
          </option>
        ))}
      </select>
      {errors.client && <p className="error">{errors.client}</p>}

      {/*== ВЫБОР УСЛУГИ ==*/}
      <select
        name="service"
        id=""
        value={formData.service}
        onChange={handleChange}
      >
        <option
          value="choose-service"
          className="service-option"
        >Выберите услугу
        </option>
        {SERVICES.map((service) => (
          <option
            value={service.value}
            key={service.value}
          >{service.label}</option>
        ))}
      </select>
      {errors.service && <p className="error">{errors.service}</p>}

      {/*== ВЫБОР ДАТЫ ==*/}
      <input
        type="date"
        name="date"
        id=""
        value={formData.date}
        onChange={handleChange}
      />
      {errors.date && <p className="error">{errors.date}</p>}

      {/*== ВЫБОР ВРЕМЕНИ ==*/}
      <input
        type="time"
        name="time"
        id=""
        value={formData.time}
        onChange={handleChange}
      />
      {errors.time && <p className="error">{errors.time}</p>}

      {/*== ВЫБОР МАСТЕРА ==*/}
      <select
        name="employeeId"
        id=""
        value={formData.employeeId}
        onChange={handleChange}
      >
        <option
          value="choose-activeEmployee"
          className="activeEmployee-option"
        >Выберите мастера
        </option>
        {employeesArray.map(activeEmployee => {
          const appointmentDayOfWeek = new Date(`${formData.date}T${formData.time}`).getDay();

          const canAssign = formData.date &&
            formData.time &&
            formData.service !== 'choose-service' &&
            activeEmployee.status === 'active' &&
            activeEmployee.workDays.includes(appointmentDayOfWeek) &&
            activeEmployee.specialization.includes(formData.service);

          return (
          <option
            value={activeEmployee.id}
            key={activeEmployee.id}
            disabled={!canAssign}
          >{activeEmployee.firstname} {activeEmployee.surname}</option>
          )
        })}
      </select>
      {errors.employeeId && <p className="error">{errors.employeeId}</p>}

      {/*== УСТАНОВКА СТОИМОСТИ ==*/}
      <input
        type="number"
        name="price"
        id=""
        placeholder="Цена услуги"
        value={formData.price}
        onChange={handleChange}
      />
      {errors.price && <p className="error">{errors.price}</p>}

      {/*== ПРИШЕЛ/НЕ ПРИШЕЛ ==*/}
      {new Date(`${formData.date}T${formData.time}`) <= new Date() &&
        <label className="checkbox-field">
          Клиент не пришел(ла)?
          <input
            type="checkbox"
            name="didntCome"
            id=""
            checked={formData.didntCome}
            onChange={handleChange}
          />
        </label>}

      <button type="submit">
        {onEditing ? 'Сохранить' : 'Добавить'}
      </button>
      <button
        type="button"
        onClick={handleCancel}
      >
        Отменить
      </button>
    </form>
  )
}
