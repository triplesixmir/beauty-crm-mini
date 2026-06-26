import {SERVICES} from "../constants/services.js";

export function getEmployeeStats(
                                   employee,
                                   appointmentsArray,
                                   reviewsArray,
                                   now,
) {

  const employeeAppointments = appointmentsArray.filter(appointment => appointment.employeeId === employee.id);
  const employeeEndedPaidAppointments = [...employeeAppointments].filter(appointment => new Date(`${appointment.date}T${appointment.time}`) < now && appointment.didntCome === false);
  const employeeFutureAppointments = [...employeeAppointments].filter(appointment => new Date(`${appointment.date}T${appointment.time}`) > now);
  const employeeReviews = reviewsArray.filter(review => review.employeeId === employee.id);

  const revenue = [...employeeEndedPaidAppointments].reduce((revenue, appointment) => revenue + Number(appointment.price), 0);
  const rating = [...employeeReviews].reduce((rating, review) => rating + review.rating, 0) / employeeReviews.length;
  const nextAppointment = employeeFutureAppointments.length > 0 ? [...employeeFutureAppointments].sort((a, b) => new Date(`${a.date}T${a.time}`) - new Date(`${b.date}T${b.time}`))[0] : null;

  // TODO: доделать доступность. Большая бизнес-логика
  return {
    employeeId: employee.id,
    employeeAppointments: employeeAppointments,
    appointmentsCount: employeeAppointments.length,
    revenue: revenue,
    rating: Number.isNaN(rating) ? null : rating,
    schedule: employee.workDays,
    reviewsCount: employeeReviews.length,
    availability: "—",
    nextAppointment: nextAppointment || null,
  }
}

export function getEmployeeServiceStats(appointmentsArray) {
  return SERVICES.map(service => ({
    ...service,
    count: appointmentsArray.filter(appointment => appointment.service === service.value).length,
    percent: Math.round(appointmentsArray.filter(appointment => appointment.service === service.value).length / appointmentsArray.length * 100),
  }))
}
