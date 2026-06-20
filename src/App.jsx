import {Routes, Route} from "react-router"

import {useClients} from "./hooks/useClients.js";
import {useAppointments} from "./hooks/useAppointments.js";
import {Modal} from "./components/modals/Modal.jsx";
import {ClientForm} from "./components/clients/ClientForm.jsx";
import {useModals} from "./hooks/useModals.js";
import {
  AppointmentForm
} from "./components/appointments/AppointmentForm.jsx";
import {useAlerts} from "./hooks/useAlerts.js";
import {Alert} from "./components/modals/Alert.jsx";
import {useToasts} from "./hooks/useToasts.js";
import {ToastContainer} from "./components/toasts/ToastContainer.jsx";
import {useSidebars} from "./hooks/useSidebars.js";
import {Sidebar} from "./components/layout/Sidebar.jsx";
import {ClientDetails} from "./components/clients/ClientDetails.jsx";
import {
  AppointmentDetails
} from "./components/appointments/AppointmentDetails.jsx";
import {DashboardPage} from "./pages/dashboard/DashboardPage.jsx";
import {ClientsPage} from "./pages/clients/ClientsPage.jsx";
import {AppointmentsPage} from "./pages/appointments/AppointmentsPage.jsx";
import {FinancesPage} from "./pages/finances/FinancesPage.jsx";
import {EmployeesPage} from "./pages/employees/EmployeesPage.jsx";
import {StatisticsPage} from "./pages/statistics/StatisticsPage.jsx";
import {SettingsPage} from "./pages/settings/SettingsPage.jsx";
import {SideNavbar} from "./components/layout/SideNavbar.jsx";

function App() {

  // Стейты
  const clientsState = useClients();
  const appointmentsState = useAppointments();
  const modalsState = useModals();
  const alertsState = useAlerts();
  const toastsState = useToasts();
  const sidebarsState = useSidebars();

  const now = new Date();

  // Модалки и связанное с ними
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

  // Сайдбар и связанное с ним
  const activeSidebarTab = sidebarsState.sidebarTabs.find(tab => tab.key === sidebarsState.activeSidebarTabKey);
  let activeClient;
  if (activeSidebarTab?.type === 'client') {
    activeClient = clientsState.clients.find(client => client.id === activeSidebarTab.id);
  }
  let activeAppointment;
  if (activeSidebarTab?.type === 'appointment') {
    activeAppointment = appointmentsState.appointments.find(appointment => appointment.id === activeSidebarTab.id);
  }

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={<DashboardPage
            clientsState={clientsState}
            appointmentsState={appointmentsState}
            sidebarsState={sidebarsState}
            alertsState={alertsState}
            toastsState={toastsState}
            openClientEditModal={openClientEditModal}
            openClientAddModal={openClientAddModal}
            openAppointmentEditModal={openAppointmentEditModal}
            openAppointmentAddModal={openAppointmentAddModal}
            now={now}
          />}
        />
        <Route
          path="/dashboard"
          element={<DashboardPage
            clientsState={clientsState}
            appointmentsState={appointmentsState}
            sidebarsState={sidebarsState}
            alertsState={alertsState}
            toastsState={toastsState}
            openClientEditModal={openClientEditModal}
            openClientAddModal={openClientAddModal}
            openAppointmentEditModal={openAppointmentEditModal}
            openAppointmentAddModal={openAppointmentAddModal}
            now={now}
          />}
        />
        <Route
          path="/clients"
          element={<ClientsPage
            clientsState={clientsState}
            appointments={appointmentsState.appointments}
            openSidebarTab={sidebarsState.openSidebarTab}
            openClientEditModal={openClientEditModal}
            openClientAddModal={openClientAddModal}
            alertsState={alertsState}
            toastsState={toastsState}
            now={now}
          />}
        />
        <Route
          path="/appointments"
          element={<AppointmentsPage
            appointmentsState={appointmentsState}
            clientsState={clientsState}
            openSidebarTab={sidebarsState.openSidebarTab}
            openAppointmentEditModal={openAppointmentEditModal}
            openAppointmentAddModal={openAppointmentAddModal}
            alertsState={alertsState}
            toastsState={toastsState}
            now={now}
          />}
        />
        <Route
          path="/finances"
          element={<FinancesPage
          appointmentsState={appointmentsState}
          clientsState={clientsState}
          now={now}
          />}
        />
        <Route
          path="/employees"
          element={<EmployeesPage />}
        />
        <Route
          path="/statistics"
          element={<StatisticsPage />}
        />
        <Route
          path="/settings"
          element={<SettingsPage />}
        />
      </Routes>

      <SideNavbar />

      <main>

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
                alertsState={alertsState}
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
            activeTab={sidebarsState.activeSidebarTabKey}
            setActiveSidebarTab={sidebarsState.setActiveSidebarTab}
            sidebarTabs={sidebarsState.sidebarTabs}
          >
            {activeSidebarTab?.type === 'client' && (
              <ClientDetails
                key={activeSidebarTab?.key ?? 'no-client'}
                client={activeClient}
                appointments={appointmentsState.appointments}
                handleUpdateClient={clientsState.handleUpdateClient}
              />
            )}

            {activeSidebarTab?.type === 'appointment' && (
              <AppointmentDetails
                key={activeSidebarTab?.key ?? 'no-appointment'}
                appointment={activeAppointment}
                clientsArray={clientsState.clients}
                handleUpdateAppointment={appointmentsState.handleUpdateAppointment}
              />
            )}

          </Sidebar>
        }

      </main>
    </>
  )
}

export default App
