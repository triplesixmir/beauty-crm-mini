import {useState} from "react";


export function useAlerts() {

  const [alertConfig, setAlertConfig] = useState(null);

  function openAlert(config) {
    setAlertConfig(prev => ({...prev, isOpen: true, ...config}));
  }

  function closeAlert() {
    setAlertConfig(null);
  }

  return {alertConfig, openAlert, closeAlert,};

}