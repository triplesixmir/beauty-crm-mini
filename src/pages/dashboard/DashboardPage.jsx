import {DashboardSection} from "./sections/DashboardSection.jsx";
import {ClientsSection} from "./sections/ClientsSection.jsx";
import {AppointmentsSection} from "./sections/AppointmentsSection.jsx";

export function DashboardPage({
                                clientsState,
                                appointmentsState,
                                sidebarsState,
                                toastsState,
                                alertsState,
                                openClientEditModal,
                                openClientAddModal,
                                openAppointmentEditModal,
                                openAppointmentAddModal,
                                now,
                              }) {
  return (
    <main className="app-shell">

      <DashboardSection
        clientsArray={clientsState.clients}
        appointmentsArray={appointmentsState.appointments}
        now={now}
      />

      <ClientsSection
        clientsState={clientsState}
        openSidebarTab={sidebarsState.openSidebarTab}
        appointments={appointmentsState.appointments}
        openClientEditModal={openClientEditModal}
        openClientAddModal={openClientAddModal}
        openAlert={alertsState.openAlert}
        closeAlert={alertsState.closeAlert}
        showToast={toastsState.showToast}
        now={now}
      />

      <AppointmentsSection
        appointmentsArray={appointmentsState.appointments}
        handleDeleteAppointment={appointmentsState.handleDeleteAppointment}
        openSidebarTab={sidebarsState.openSidebarTab}
        openAppointmentEditModal={openAppointmentEditModal}
        openAppointmentAddModal={openAppointmentAddModal}
        clientsArray={clientsState.clients}
        openAlert={alertsState.openAlert}
        closeAlert={alertsState.closeAlert}
        showToast={toastsState.showToast}
      />

    </main>
  )
}
