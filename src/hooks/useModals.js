import {useState} from "react";

export function useModals() {

  const [isClientModalOpen, setIsClientModalOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);

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

  function openEmployeeModal() {
    setIsEmployeeModalOpen(true);
  }

  function closeEmployeeModal() {
    setIsEmployeeModalOpen(false);
  }

  function openReviewModal() {
    setIsReviewModalOpen(true);
  }

  function closeReviewModal() {
    setIsReviewModalOpen(false);
  }

  return {
    isClientModalOpen,
    isAppointmentModalOpen,
    isEmployeeModalOpen,
    isReviewModalOpen,
    openClientModal,
    closeClientModal,
    openAppointmentModal,
    closeAppointmentModal,
    openEmployeeModal,
    closeEmployeeModal,
    openReviewModal,
    closeReviewModal,
  }
}