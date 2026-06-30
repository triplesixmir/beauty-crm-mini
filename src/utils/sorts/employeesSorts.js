export function sortEmployees(employeesRowsArray, sort) {
  let sortedEmployeesRows = [...employeesRowsArray];

  if (sort === 'default') {
    sortedEmployeesRows = [...employeesRowsArray];
  } else if (sort === 'a-z') {
    sortedEmployeesRows = [...employeesRowsArray].sort((a, b) => `${a.employee.firstname} ${a.employee.surname}`.localeCompare(`${b.employee.firstname} ${b.employee.surname}`));
  } else if (sort === 'z-a') {
    sortedEmployeesRows = [...employeesRowsArray].sort((a, b) => `${b.employee.firstname} ${b.employee.surname}`.localeCompare(`${a.employee.firstname} ${a.employee.surname}`));
  } else if (sort === 'rating-up') {
    sortedEmployeesRows = [...employeesRowsArray].sort((a, b) => a.stats.rating - b.stats.rating);
  } else if (sort === 'rating-down') {
    sortedEmployeesRows = [...employeesRowsArray].sort((a, b) => b.stats.rating - a.stats.rating);
  } else if (sort === 'revenue-up') {
    sortedEmployeesRows = [...employeesRowsArray].sort((a, b) => a.stats.revenue - b.stats.revenue);
  } else if (sort === 'revenue-down') {
    sortedEmployeesRows = [...employeesRowsArray].sort((a, b) => b.stats.revenue - a.stats.revenue);
  } else if (sort === 'appointments-count-up') {
    sortedEmployeesRows = [...employeesRowsArray].sort((a, b) => a.stats.appointmentsCount - b.stats.appointmentsCount);
  } else if (sort === 'appointments-count-down') {
    sortedEmployeesRows = [...employeesRowsArray].sort((a, b) => b.stats.appointmentsCount - a.stats.appointmentsCount);
  } else if (sort === 'next-appointment-up') {
    const employeesWithoutNextAppointment = employeesRowsArray.filter(employee => employee.stats.nextAppointmentDateTime === null);
    const employeesWithNextAppointment = employeesRowsArray.filter(employee => employee.stats.nextAppointmentDateTime !== null);

    sortedEmployeesRows = [...employeesWithNextAppointment].sort((a, b) => a.stats.nextAppointmentDateTime - b.stats.nextAppointmentDateTime);
    sortedEmployeesRows.push(...employeesWithoutNextAppointment);
  } else if (sort === 'next-appointment-down') {
    const employeesWithoutNextAppointment = employeesRowsArray.filter(employee => employee.stats.nextAppointmentDateTime === null);
    const employeesWithNextAppointment = employeesRowsArray.filter(employee => employee.stats.nextAppointmentDateTime !== null);

    sortedEmployeesRows = [...employeesWithNextAppointment].sort((a, b) => b.stats.nextAppointmentDateTime - a.stats.nextAppointmentDateTime);
    sortedEmployeesRows.push(...employeesWithoutNextAppointment);
  }

  return sortedEmployeesRows;
}