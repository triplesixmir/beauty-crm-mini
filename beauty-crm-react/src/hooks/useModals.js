import {useState} from "react";

export function useModals() {

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  function openClientModal() {
    setIsClientModalOpen(true);
  }

  function closeClientModal() {
    setIsClientModalOpen(false);
  }

  function openAppointmentModal() {
    setIsAppointmentModalOpen(true);
  }

  function closeAppointmentModal() {
    setIsAppointmentModalOpen(false);
  }

  function handleEscapeKey(event) {
    if (event.key === 'Escape') {
      closeClientModal();
      closeAppointmentModal();
    }
  }

  return {
    isClientModalOpen,
    isAppointmentModalOpen,
    openClientModal,
    closeClientModal,
    openAppointmentModal,
    closeAppointmentModal,
    handleEscapeKey,
  }
}