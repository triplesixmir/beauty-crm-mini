import {AppointmentCard} from "../components/appointmentscomps/AppointmentCard.jsx";
import {
  formatAppointmentDateTime,
} from "../utils/formatters.js";

export function AppointmentsSection({
                                      clients,
                                      appointments,
                                      handleDeleteAppointment,
                                      openAppointmentAddModal,
                                      openAppointmentEditModal,
                                      openAlert,
                                      closeAlert,
                                      showToast,
                                    }) {

  function handleDeleteClick(appointment) {
    openAlert({
      title: `Удаление записи ${formatAppointmentDateTime(appointment.date, appointment.time)}`,
      description: "Вы уверены, что хотите удалить запись?",
      secondDescription: "Это действие необратимо и все данные о записи будут удалены.",
      submitButtonText: "Да, удалить",
      cancelButtonText: "Нет, не удалять",
      onSubmit: () => {
        handleDeleteAppointment(appointment.id);
        closeAlert();
        showToast("info", "Запись успешно удалена", 3000)
      },
      onClose: closeAlert,
    })
  }

  return (
    <>

      <button
        className="section__add-btn"
        onClick={openAppointmentAddModal}
      >Добавить запись
      </button>

      <div className="cards-grid">

        {
          appointments.length === 0
            ? <p>Записей нет</p>
            : appointments.map(appointment => {
              const client = clients.find(client => client.id === appointment.clientId)
              const clientName = client ? `${client.firstname} ${client.surname}` : 'Клиента не существует'

              return (
                <AppointmentCard
                  handleDeleteClick={() => handleDeleteClick(appointment)}
                  onEdit={() => openAppointmentEditModal(appointment)}
                  key={appointment.id}
                  clientName={clientName}
                  {...appointment}
                />
              )
            })
        }

      </div>

    </>
  )
}