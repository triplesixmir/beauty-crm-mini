import {ClientsSection} from "./sections/ClientsSection.jsx";
import {AppointmentsSection} from "./sections/AppointmentsSection.jsx";
import {useClients} from "./hooks/useClients.js";
import {useAppointments} from "./hooks/useAppointments.js";
import {DashboardSection} from "./sections/DashboardSection.jsx";
import {Modal} from "./components/modals/Modal.jsx";
import {ClientForm} from "./components/ClientForm.jsx";
import {useModals} from "./hooks/useModals.js";

function App() {

  const clientsState = useClients();
  const appointmentsState = useAppointments();
  const modalsState = useModals();
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

  return (

    <>

      <DashboardSection
        {...clientsState}
        {...appointmentsState}
        now={now}
      />

      <ClientsSection
        {...clientsState}
        openClientEditModal={openClientEditModal}
        openClientAddModal={openClientAddModal}
      />

      <AppointmentsSection
        {...appointmentsState}
        clients={clientsState.clients}
        now={now}
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

    </>
  )
}

export default App

