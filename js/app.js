import {dom} from "./dom.js";
import {today} from "./utils.js";
import {initApp} from "./init.js";

Inputmask("+7 999 999-99-99").mask("#client-tel");

dom.dateInput.max = today;
dom.dateInput.value = today;

initApp();