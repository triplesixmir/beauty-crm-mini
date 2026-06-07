import {ClientsSection} from "./sections/ClientsSection.jsx";
import {AppointmentsSection} from "./sections/AppointmentsSection.jsx";
import {useClients} from "./hooks/useClients.js";
import {useAppointments} from "./hooks/useAppointments.js";
import {DashboardSection} from "./sections/DashboardSection.jsx";

function App() {

  const clientsState = useClients();
  const appointmentsState = useAppointments();
  const now = new Date();

  return (

    <>

      <DashboardSection
        {...clientsState}
        {...appointmentsState}
        now={now}
      />

      <ClientsSection
        {...clientsState}
      />

      <AppointmentsSection
        {...appointmentsState}
        clients={clientsState.clients}
        now={now}
      />

    </>
  )
}

export default App

