import {DashboardCard} from "../components/dashboard/DashboardCard.jsx";
import nearestAppointmentIcon
  from "../assets/dashboard/icons/nearest-appointment.svg";
import totalAppointmentsIcon
  from "../assets/dashboard/icons/total-appointments.svg";
import totalClientsIcon from "../assets/dashboard/icons/total-clients.svg";
import totalMoneyIcon from "../assets/dashboard/icons/total-money.svg";
import {formatAppointmentDateTime, formatMoney} from "../utils/formatters.js";

export function DashboardSection({
                                   clients,
                                   appointments,
                                   now,
                                 }) {

  const nearestAppointment = appointments
    .filter((appointment) => {
      const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);

      return appointmentDate >= now;
    })
    .sort((a, b) => {
      const firstDate = new Date(`${a.date}T${a.time}`);
      const secondDate = new Date(`${b.date}T${b.time}`);

      return firstDate - secondDate;
    })[0];

  const endedAppointments = appointments.filter((appointment) => {

    const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
    return appointmentDate < now;

  })

  const totalClients = clients.length;
  const totalAppointments = appointments.length;
  const totalMoney = endedAppointments.reduce((sum, appointment) => {
    return sum + Number(appointment.price);
  }, 0)

  return (
    <>

      <DashboardCard
        icon={nearestAppointmentIcon}
        heading="Ближайшая запись"
        value={nearestAppointment
          ? formatAppointmentDateTime(nearestAppointment.date, nearestAppointment.time)
          : 'Нет подходящей записи'}
      />

      <DashboardCard
        icon={totalAppointmentsIcon}
        heading="Всего записей"
        value={totalAppointments}
      />

      <DashboardCard
        icon={totalClientsIcon}
        heading="Всего клиентов"
        value={totalClients}
      />

      <DashboardCard
        icon={totalMoneyIcon}
        heading="Общая прибыль"
        value={formatMoney(totalMoney)}
      />

    </>
  )
}