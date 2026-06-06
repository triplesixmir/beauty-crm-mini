import {AppointmentForm} from "../components/AppointmentForm.jsx";
import {AppointmentCard} from "../components/AppointmentCard.jsx";

export function AppointmentsSection({
                                      today,
                                      clients,
                                      editingAppointment,
                                      appointments,
                                      handleDeleteAppointment,
                                      handleAddAppointment,
                                      handleEditAppointment,
                                      handleCancelEditAppointment,
                                      handleUpdateAppointment,
                                    }) {

  return (
    <>

      <AppointmentForm
        key={editingAppointment?.id ?? 'new-appointment'}
        onAddAppointment={handleAddAppointment}
        onEditing={editingAppointment}
        clientsArray={clients}
        onUpdateAppointment={handleUpdateAppointment}
        onCancelEdit={handleCancelEditAppointment}
        today={today}
      />

      <div>

        {
          appointments.length === 0
            ? <p>Записей нет</p>
            : appointments.map(appointment => {
              const client = clients.find(client => client.id === appointment.clientId)
              const clientName = client ? client.name : 'Клиент удалён'

              return (
                <AppointmentCard
                  onDelete={() => handleDeleteAppointment(appointment.id)}
                  onEdit={() => handleEditAppointment(appointment)}
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