import {useState} from "react";

export function useAlerts() {

  const [alertConfig, setAlertConfig] = useState(null);

  function openAlert(config) {
    setAlertConfig(config);
  }

  function closeAlert() {
    setAlertConfig(null);
  }

  return {alertConfig, openAlert, closeAlert,};

}