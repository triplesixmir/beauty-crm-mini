import {ClientsSection} from "./sections/ClientsSection.jsx";
import {AppointmentsSection} from "./sections/AppointmentsSection.jsx";
import {useClients} from "./hooks/useClients.js";
import {useAppointments} from "./hooks/useAppointments.js";
import {DashboardSection} from "./sections/DashboardSection.jsx";
import {Modal} from "./components/modals/Modal.jsx";
import {ClientForm} from "./components/clientscomps/ClientForm.jsx";
import {useModals} from "./hooks/useModals.js";
import {
  AppointmentForm
} from "./components/appointmentscomps/AppointmentForm.jsx";
import {useAlerts} from "./hooks/useAlerts.js";
import {Alert} from "./components/modals/Alert.jsx";
import {useToasts} from "./hooks/useToasts.js";
import {ToastContainer} from "./components/toasts/ToastContainer.jsx";
import {useSidebars} from "./hooks/useSidebars.js";
import {Sidebar} from "./components/sidebars/Sidebar.jsx";
import {ClientDetails} from "./components/clientscomps/ClientDetails.jsx";

function App() {

  const clientsState = useClients();
  const appointmentsState = useAppointments();
  const modalsState = useModals();
  const alertsState = useAlerts();
  const toastsState = useToasts();
  const sidebarsState = useSidebars();
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

  const activeSidebarTab = sidebarsState.sidebarTabs.find(tab => tab.key === sidebarsState.activeSidebarTabKey);

  let activeClient;

  if (activeSidebarTab?.type === 'client') {
    activeClient = clientsState.clients.find(client => client.id === activeSidebarTab.id);
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
        {...appointmentsState}
        openAppointmentEditModal={openAppointmentEditModal}
        openAppointmentAddModal={openAppointmentAddModal}
        clients={clientsState.clients}
        openAlert={alertsState.openAlert}
        closeAlert={alertsState.closeAlert}
        showToast={toastsState.showToast}
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
            showToast={toastsState.showToast}
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
              showToast={toastsState.showToast}
              now={now}
            />

          </Modal>)}

      {alertsState.alertConfig &&
        <Alert
          {...alertsState.alertConfig}
        />
      }

      {toastsState.toasts.length > 0 &&
        <ToastContainer
          toastsArray={toastsState.toasts}
          removeToast={toastsState.removeToast}
        />
      }

      {sidebarsState.sidebarTabs.length > 0 &&
        <Sidebar
          closeSidebarTab={sidebarsState.closeSidebarTab}
          closeSidebarCompletely={sidebarsState.closeSidebarCompletely}
          openSidebarTab={sidebarsState.openSidebarTab}
          activeTab={sidebarsState.activeSidebarTabKey}
          setActiveSidebarTab={sidebarsState.setActiveSidebarTab}
          sidebarTabs={sidebarsState.sidebarTabs}
        >
          <ClientDetails
            key={activeSidebarTab?.key ?? 'no-client'}
            client={activeClient}
            appointments={appointmentsState.appointments}
            onUpdateProfilePic={clientsState.handleUpdateClientProfilePic}
            handleUpdateClient={clientsState.handleUpdateClient}
          />
        </Sidebar>
      }

    </>
  )
}

export default App
