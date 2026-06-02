import {ClientCard} from "./components/ClientCard.jsx";
import {ClientForm} from "./components/ClientForm.jsx";
import {useClients} from "./hooks/useClients.js";
import {useAppointments} from "./hooks/useAppointments.js";
import {AppointmentCard} from "./components/AppointmentCard.jsx";
import {AppointmentForm} from "./components/AppointmentForm.jsx";

function App() {

  const {
    clients,
    editingClient,
    filteredClients,
    handleAddClient,
    handleDeleteClient,
    handleEditClient,
    handleUpdateClient,
    handleCancelEditClient,
    setSearchTerm,
  } = useClients();
  const {
    editingAppointment,
    appointments,
    handleDeleteAppointment,
    handleAddAppointment,
    handleEditAppointment,
    handleCancelEditAppointment,
    handleUpdateAppointment
  } = useAppointments();

  return (

    <>
      <label>
        Поиск по клиентам
        <input
          type="text"
          name="search-field"
          id=""
          placeholder={'Поиск...'}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </label>
      <ClientForm
        onAddClient={handleAddClient}
        onEditing={editingClient}
        onUpdateClient={handleUpdateClient}
        onCancelEdit={handleCancelEditClient}
      />
      <div>

        {
          filteredClients.length === 0
            ? <p>Клиентов нет</p>
            : filteredClients.map(client => (
              <ClientCard
                onDelete={() => handleDeleteClient(client.id)}
                onEdit={() => handleEditClient(client)}
                key={client.id}
                {...client}
              />
            ))
        }

      </div>

      <AppointmentForm
        onAddAppointment={handleAddAppointment}
        onEditing={editingAppointment}
        clientsArray={clients}
        onUpdateAppointment={handleUpdateAppointment}
        onCancelEdit={handleCancelEditAppointment}
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

export default App

