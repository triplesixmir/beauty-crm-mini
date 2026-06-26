// noinspection D

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
import {
  EmployeesPage,
} from "./pages/employees/EmployeesPage.jsx";
import {StatisticsPage} from "./pages/statistics/StatisticsPage.jsx";
import {SettingsPage} from "./pages/settings/SettingsPage.jsx";
import {SideNavbar} from "./components/layout/SideNavbar.jsx";
import {useEmployees} from "./hooks/useEmployees.js";
import {EmployeeForm} from "./components/employees/EmployeeForm.jsx";
import {useReviews} from "./hooks/useReviews.js";
import {ReviewForm} from "./components/reviews/ReviewForm.jsx";
import {EmployeeDetails} from "./components/employees/EmployeeDetails.jsx";

function App() {

  // Стейты
  const clientsState = useClients();
  const appointmentsState = useAppointments();
  const modalsState = useModals();
  const alertsState = useAlerts();
  const toastsState = useToasts();
  const sidebarsState = useSidebars();
  const employeesState = useEmployees();
  const reviewsState = useReviews();

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

  function openEmployeeEditModal(employee) {
    employeesState.handleEditEmployee(employee);
    modalsState.openEmployeeModal();
  }

  function openEmployeeAddModal() {
    employeesState.handleResetEditingEmployee();
    modalsState.openEmployeeModal();
  }

  function closeEmployeeModal() {
    modalsState.closeEmployeeModal();
    employeesState.handleResetEditingEmployee();
  }

  function openReviewAddModal() {
    reviewsState.resetEditingReview();
    modalsState.openReviewModal();
  }

  function openReviewEditModal(review) {
    reviewsState.chooseEditingReview(review);
    modalsState.openReviewModal();
  }

  function closeReviewModal() {
    modalsState.closeReviewModal();
    reviewsState.resetEditingReview();
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
  let activeEmployee;
  if (activeSidebarTab?.type === 'employee') {
    activeEmployee = employeesState.employees.find(employee => employee.id === activeSidebarTab.id);
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
            appointmentsArray={appointmentsState.appointments}
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
            employeesState={employeesState}
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
          element={<EmployeesPage
            employeesState={employeesState}
            clientsState={clientsState}
            reviewsState={reviewsState}
            alertsState={alertsState}
            toastsState={toastsState}
            openSidebarTab={sidebarsState.openSidebarTab}
            openEmployeeAddModal={openEmployeeAddModal}
            openEmployeeEditModal={openEmployeeEditModal}
            openReviewEditModal={openReviewEditModal}
            openReviewAddModal={openReviewAddModal}
            appointmentsArray={appointmentsState.appointments}
            now={now}
          />}
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

        {/*== МОДАЛКИ ==*/}
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
                employeesArray={employeesState.employees}
                onUpdateAppointment={appointmentsState.handleUpdateAppointment}
                onCancel={closeAppointmentModal}
                onSuccess={closeAppointmentModal}
                showToast={toastsState.showToast}
                now={now}
                alertsState={alertsState}
              />

            </Modal>)}

        {modalsState.isEmployeeModalOpen &&
          (
            <Modal
              title={employeesState.editingEmployee ? 'Редактировать сотрудника' : 'Добавить сотрудника'}
              onClose={closeEmployeeModal}
            >

              <EmployeeForm
                key={employeesState.editingEmployee?.id ?? 'new-employee'}
                onAddEmployee={employeesState.handleAddEmployee}
                onUpdateEmployee={employeesState.handleUpdateEmployee}
                onEditing={employeesState.editingEmployee}
                clientsArray={clientsState.clients}
                appointmentsArray={appointmentsState.appointments}
                onCancel={closeEmployeeModal}
                onSuccess={closeEmployeeModal}
                showToast={toastsState.showToast}
                now={now}
                alertsState={alertsState}
              />

            </Modal>)}

        {modalsState.isReviewModalOpen &&
          (
            <Modal
              title={reviewsState.editingReview ? 'Редактировать отзыв' : 'Добавить отзыв'}
              onClose={closeReviewModal}
            >

              <ReviewForm
                key={reviewsState.editingReview?.id ?? 'new-review'}
                onAddReview={reviewsState.addReview}
                onUpdateReview={reviewsState.updateReview}
                onEditing={reviewsState.editingReview}
                clientsArray={clientsState.clients}
                appointmentsArray={appointmentsState.appointments}
                onCancel={closeReviewModal}
                onSuccess={closeReviewModal}
                showToast={toastsState.showToast}
                now={now}
                alertsState={alertsState}
                reviews={reviewsState.reviews}
              />

            </Modal>)}

        {/*== АЛЕРТЫ ==*/}
        {alertsState.alertConfig &&
          <Alert
            {...alertsState.alertConfig}
          />
        }

        {/*== ТОСТЫ ==*/}
        {toastsState.toasts.length > 0 &&
          <ToastContainer
            toastsArray={toastsState.toasts}
            removeToast={toastsState.removeToast}
          />
        }

        {/*== САЙДБАРЫ ==*/}
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
                appointmentsArray={appointmentsState.appointments}
                handleUpdateClient={clientsState.handleUpdateClient}
              />
            )}

            {activeSidebarTab?.type === 'appointment' && (
              <AppointmentDetails
                key={activeSidebarTab?.key ?? 'no-appointment'}
                appointment={activeAppointment}
                clientsArray={clientsState.clients}
                employeesArray={employeesState.employees}
                handleUpdateAppointment={appointmentsState.handleUpdateAppointment}
              />
            )}

            {activeSidebarTab?.type === 'employee' && (
              <EmployeeDetails
                key={activeSidebarTab?.key ?? 'no-employee'}
                activeEmployee={activeEmployee}
                reviewsArray={reviewsState.reviews}
                appointmentsArray={appointmentsState.appointments}
                openSidebarTab={sidebarsState.openSidebarTab}
                handleUpdateEmployee={employeesState.handleUpdateEmployee}
                now={now}
              />
            )}

          </Sidebar>
        }

      </main>
    </>
  )
}

export default App
