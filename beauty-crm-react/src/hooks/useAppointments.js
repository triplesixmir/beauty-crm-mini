import {useEffect, useState} from "react";

export function useAppointments() {
  const [appointments, setAppointments] = useState(() => {
    const stored = localStorage.getItem('appointments');
    return stored ? JSON.parse(stored) : [];
  });

  const [editingAppointment, setEditingAppointment] = useState(null);

  useEffect(() => {
    localStorage.setItem('appointments', JSON.stringify(appointments));
  }, [appointments]);

  function handleAddAppointment(appointmentData) {
    setAppointments([...appointments, {id: Date.now(), ...appointmentData}]);
  }

  function handleDeleteAppointment(id) {
    const filteredAppointments = appointments.filter(appointment => appointment.id !== id);
    setAppointments(filteredAppointments);
  }

  function handleEditAppointment(appointment) {
    setEditingAppointment(appointment);
  }

  function handleUpdateAppointment(updatedAppointment) {

    setAppointments(appointments.map(appointment => appointment.id === updatedAppointment.id ? updatedAppointment : appointment));
    setEditingAppointment(null)
  }

  return { appointments, handleAddAppointment, handleDeleteAppointment, handleEditAppointment, handleUpdateAppointment, editingAppointment };

}