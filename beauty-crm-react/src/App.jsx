import {ClientsSection} from "./sections/ClientsSection.jsx";
import {AppointmentsSection} from "./sections/AppointmentsSection.jsx";
import {useClients} from "./hooks/useClients.js";
import {useAppointments} from "./hooks/useAppointments.js";
import {DashboardSection} from "./sections/DashboardSection.jsx";

function App() {

  const clientsState = useClients();
  const appointmentsState = useAppointments();
  const today = new Date().toISOString().slice(0, 10);

  return (

    <>

      <DashboardSection
        {...clientsState}
        {...appointmentsState}
        today={today}
      />

      <ClientsSection
        {...clientsState}
      />

      <AppointmentsSection
        {...appointmentsState}
        clients={clientsState.clients}
        today={today}
      />

    </>
  )
}

export default App

