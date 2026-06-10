import {AppointmentCard} from "../components/AppointmentCard.jsx";

export function AppointmentsSection({
                                      clients,
                                      appointments,
                                      handleDeleteAppointment,
                                      openAppointmentAddModal,
                                      openAppointmentEditModal,
                                    }) {

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
                  onDelete={() => handleDeleteAppointment(appointment.id)}
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