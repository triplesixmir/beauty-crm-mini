import {loadFromStorage} from "./storage.js";

const clients = loadFromStorage('clients', []);
const appointments = loadFromStorage('appointments', []);
const currentClientsView = clients;

export const states = {
  clients,
  currentClientsView,
  visibleClientsCount: 5,
  editingClientId: null,
  editingAppointmentId: null,
  appointments,
  visibleAppointmentsCount: 8,
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
}

