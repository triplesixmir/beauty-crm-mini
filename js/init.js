import {initClients} from "./clients.js";
import {initAppointments} from "./appointments.js";
import {renderDashboardStats} from "./dashboard.js";

export function initApp() {
  console.log('App is ready!');
  initClients();
  initAppointments();
  renderDashboardStats();
}