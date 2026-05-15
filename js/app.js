import {renderDashboardStats} from "./dashboard.js";
import {renderClientOptions, renderLatestClients} from "./clients.js";
import {states} from "./states.js";
import {dom} from "./dom.js";
import {today} from "./utils.js";
import {renderNearestAppointments} from "./appointments.js";

Inputmask("+7 999 999-99-99").mask("#client-tel");

dom.dateInput.max = today;
dom.dateInput.value = today;

renderLatestClients(states.currentClientsView);
renderClientOptions();
renderNearestAppointments();
renderDashboardStats();