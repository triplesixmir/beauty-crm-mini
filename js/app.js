import {renderDashboardStats} from "./dashboard.js";
import {renderClientOptions} from "./clients.js";
import {dom} from "./dom.js";
import {today} from "./utils.js";
import {renderNearestAppointments} from "./appointments.js";
import {initApp} from "./init.js";

Inputmask("+7 999 999-99-99").mask("#client-tel");

dom.dateInput.max = today;
dom.dateInput.value = today;

initApp();
renderClientOptions();
renderNearestAppointments();
renderDashboardStats();