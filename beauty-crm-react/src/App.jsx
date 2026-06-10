import {ClientsSection} from "./sections/ClientsSection.jsx";
import {AppointmentsSection} from "./sections/AppointmentsSection.jsx";
import {useClients} from "./hooks/useClients.js";
import {useAppointments} from "./hooks/useAppointments.js";
import {DashboardSection} from "./sections/DashboardSection.jsx";
import {Modal} from "./components/modals/Modal.jsx";
import {ClientForm} from "./components/ClientForm.jsx";
import {useModals} from "./hooks/useModals.js";
import {AppointmentForm} from "./components/AppointmentForm.jsx";
import {useAlerts} from "./hooks/useAlerts.js";
import {Alert} from "./components/modals/Alert.jsx";

function App() {

  const clientsState = useClients();
  const appointmentsState = useAppointments();
  const modalsState = useModals();
  const alertsState = useAlerts();
  const now = new Date();

  function closeClientModal() {
    modalsState.closeClientModal();
    clientsState.handleResetEditingClient();
  }

  function openClientEditModal(client) {
    clientsState.handleEditClient(client);
    modalsState.openClientModal();
  }

  function openClientAddModal() {
    clientsState.handleResetEditingClient();
    modalsState.openClientModal();
  }

  function closeAppointmentModal() {
    modalsState.closeAppointmentModal();
    appointmentsState.handleResetEditingAppointment();
  }

  function openAppointmentEditModal(appointment) {
    appointmentsState.handleEditAppointment(appointment);
    modalsState.openAppointmentModal();
  }

  function openAppointmentAddModal() {
    appointmentsState.handleResetEditingAppointment();
    modalsState.openAppointmentModal();
  }

  return (

    <>

      <DashboardSection
        {...clientsState}
        {...appointmentsState}
        now={now}
      />

      <ClientsSection
        {...clientsState}
        appointments={appointmentsState.appointments}
        openClientEditModal={openClientEditModal}
        openClientAddModal={openClientAddModal}
        openAlert={alertsState.openAlert}
        closeAlert={alertsState.closeAlert}
        now={now}
      />

      <AppointmentsSection
        {...appointmentsState}
        openAppointmentEditModal={openAppointmentEditModal}
        openAppointmentAddModal={openAppointmentAddModal}
        clients={clientsState.clients}
        openAlert={alertsState.openAlert}
        closeAlert={alertsState.closeAlert}
      />

      {modalsState.isClientModalOpen &&
        (<Modal
          title={clientsState.editingClient ? 'Редактировать клиента' : 'Добавить клиента'}
          onClose={closeClientModal}
        >
          <ClientForm
            key={clientsState.editingClient?.id ?? 'new-client'}
            onAddClient={clientsState.handleAddClient}
            onEditing={clientsState.editingClient}
            onUpdateClient={clientsState.handleUpdateClient}
            onCancel={closeClientModal}
            onSuccess={closeClientModal}
          />
        </Modal>)}

      {modalsState.isAppointmentModalOpen &&
        (
          <Modal
            title={appointmentsState.editingAppointment ? 'Редактировать запись' : 'Добавить запись'}
            onClose={closeAppointmentModal}
          >

            <AppointmentForm
              key={appointmentsState.editingAppointment?.id ?? 'new-appointment'}
              onAddAppointment={appointmentsState.handleAddAppointment}
              onEditing={appointmentsState.editingAppointment}
              clientsArray={clientsState.clients}
              onUpdateAppointment={appointmentsState.handleUpdateAppointment}
              onCancel={closeAppointmentModal}
              onSuccess={closeAppointmentModal}
              now={now}
            />

          </Modal>)}

      {alertsState.alertConfig &&
        <Alert
          {...alertsState.alertConfig}
        />
      }

    </>
  )
}

export default App

