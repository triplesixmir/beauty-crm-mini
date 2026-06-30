export function sortAppointments(appointmentsArray, sort) {
  let sortedAppointments = [...appointmentsArray];

  if (sort === 'default') {
    sortedAppointments = [...appointmentsArray].reverse();
  } else if (sort === 'date-up') {
    sortedAppointments = [...appointmentsArray].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`));
  } else if (sort === 'date-down') {
    sortedAppointments = [...appointmentsArray].sort((a, b) => new Date(`${b.date}T${b.time}`) - new Date(`${a.date}T${a.time}`));
  } else if (sort === 'sum-up') {
    sortedAppointments = [...appointmentsArray].sort((a, b) => Number(a.price) - Number(b.price));
  } else if (sort === 'sum-down') {
    sortedAppointments = [...appointmentsArray].sort((a, b) => Number(b.price) - Number(a.price));
  }

  return sortedAppointments;
}