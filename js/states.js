import {loadFromStorage} from "./storage.js";

const clients = loadFromStorage('clients', []);
const appointments = loadFromStorage('appointments', []);
const currentClientsView = clients;

export const states = {
  clients,
  currentClientsView,
  visibleClientsCount: 4,
  editingClientId: null,
  editingAppointmentId: null,
  appointments,
  visibleAppointmentsCount: 4,
  searchTerm: '',
  sortOrder: 'default-sort',
}

export const appointmentFilters = {
  searchTerm: '',
  clientId: 'all',
  dateFrom: '',
  dateTo: '',
  onlyFuture: true,
  sortOrder: 'default-sort',
  isPopupOpen: false,
}

