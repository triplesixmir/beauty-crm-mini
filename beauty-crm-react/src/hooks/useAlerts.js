import {useState} from "react";


export function useAlerts() {

  const [isAlertOpen, setIsAlertOpen] = useState(false);

  function openAlert() {
    setIsAlertOpen(true);
  }

  function closeAlert() {
    setIsAlertOpen(false);
  }

  return {isAlertOpen, openAlert, closeAlert,};

}