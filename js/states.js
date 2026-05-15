import {loadFromStorage} from "./storage.js";

const clients = loadFromStorage('clients', []);
const appointments = loadFromStorage('appointments', []);
const currentClientsView = clients;

export const states = {
  clients,
  currentClientsView,
  visibleClientsCount: 5,
  editingClientId: null,
  appointments,
  visibleAppointmentsCount: 8,
}

