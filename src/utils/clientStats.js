export function getClientStats(client, appointmentsArray, now) {
  const clientTotalSpent = appointmentsArray.filter(appointment => appointment.clientId === client.id).reduce((acc, appointment) => acc + Number(appointment.price), 0);
  const clientAppointments = appointmentsArray.filter(appointment => appointment.clientId === client.id);
  const clientFutureAppointments = clientAppointments.filter((appointment) => new Date(`${appointment.date}T${appointment.time}`) > now);
  const clientNearestAppointment = [...clientFutureAppointments].sort((a, b) => `${a.date} ${a.time}`.localeCompare(`${b.date} ${b.time}`))[0];

  const clientAppointmentsThisYear = clientAppointments.filter((appointment) => {
    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    const currentYear = new Date().getFullYear();
    return appointmentDate.getFullYear() === currentYear;
  })
  const clientEndedAppointmentsThisYearCount = clientAppointmentsThisYear.filter((appointment) => new Date(`${appointment.date}T${appointment.time}`) < now).length;
  const clientEndedAppointmentsThisYear = clientAppointmentsThisYear.filter((appointment) => new Date(`${appointment.date}T${appointment.time}`) < now);
  const clientTotalSpentThisYear = clientEndedAppointmentsThisYear.reduce((acc, appointment) => acc + Number(appointment.price), 0);

  return {
    totalSpent: clientTotalSpent,
    totalSpentThisYear: clientTotalSpentThisYear,
    appointments: clientAppointments,
    nearestAppointment: clientNearestAppointment,
    appointmentsThisYear: clientAppointmentsThisYear,
    endedAppointmentsThisYearCount: clientEndedAppointmentsThisYearCount,
    endedAppointmentsThisYear: clientEndedAppointmentsThisYear,
  }
}
