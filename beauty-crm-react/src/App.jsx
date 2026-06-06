import {ClientsSection} from "./sections/ClientsSection.jsx";
import {AppointmentsSection} from "./sections/AppointmentsSection.jsx";
import {useClients} from "./hooks/useClients.js";
import {useAppointments} from "./hooks/useAppointments.js";

function App() {

  const clientsState = useClients();
  const appointmentsState = useAppointments();

  return (

    <>

      <ClientsSection
        {...clientsState}
      />

      <AppointmentsSection
        {...appointmentsState}
        clients={clientsState.clients}
      />

    </>
  )
}

export default App

