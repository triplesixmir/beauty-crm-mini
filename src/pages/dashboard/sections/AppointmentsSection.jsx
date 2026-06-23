import {
  AppointmentCard
} from "../../../components/appointments/AppointmentCard.jsx";
import {
  formatAppointmentDateTime,
} from "../../../utils/formatters.js";

export function AppointmentsSection({
                                      clients,
                                      appointments,
                                      handleDeleteAppointment,
                                      openAppointmentAddModal,
                                      openAppointmentEditModal,
                                      openSidebarTab,
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

  function openAppointmentDetailsSidebar(appointment) {
    openSidebarTab({
      type: 'appointment',
      id: appointment.id,
      title: `${formatAppointmentDateTime(appointment.date, appointment.time)}`,
      key: `appointment:${appointment.id}`,
    });
  }

  return (
    <section className="section section--appointments">

      <div className="section__header">
        <div>
          <p className="section__eyebrow">Расписание</p>
          <h2>Записи</h2>
        </div>

        <button
          className="section__add-btn"
          onClick={openAppointmentAddModal}
        >Добавить запись
        </button>
      </div>

      <div className="cards-grid">

        {
          appointments.length === 0
            ?
            <div className="appointments-section__empty">
              <h2>Нет подходящих записей</h2>
              <p>Попробуйте изменить настройки фильтра</p>
            </div>
            : appointments.map(appointment => {
              const client = clients.find(client => client.id === appointment.clientId)
              const clientName = client ? `${client.firstname} ${client.surname}` : 'Клиента не существует'

              return (
                <AppointmentCard
                  handleDeleteClick={() => handleDeleteClick(appointment)}
                  onEdit={() => openAppointmentEditModal(appointment)}
                  key={appointment.id}
                  onOpenDetails={() => openAppointmentDetailsSidebar(appointment)}
                  clientName={clientName}
                  {...appointment}
                />
              )
            })
        }

      </div>

    </section>
  )
}
