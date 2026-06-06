import {DashboardCard} from "../components/dashboard/DashboardCard.jsx";
import nearestAppointmentIcon
  from "../assets/dashboard/icons/nearest-appointment.svg";
import totalAppointmentsIcon
  from "../assets/dashboard/icons/total-appointments.svg";
import totalClientsIcon from "../assets/dashboard/icons/total-clients.svg";
import totalMoneyIcon from "../assets/dashboard/icons/total-money.svg";

export function DashboardSection({
                                   clients,
                                   appointments,
                                   today,
                                 }) {

  const nearestAppointment = appointments.filter((appointment) => appointment.date >= today)
    .sort((a, b) => {
      const firstDateTime = `${a.date}T${a.time}`;
      const secondDateTime = `${b.date}T${b.time}`;

      return firstDateTime.localeCompare(secondDateTime);
    })[0];
  const totalClients = clients.length;
  const totalAppointments = appointments.length;
  const totalMoney = appointments.reduce((sum, appointment) => {
    return sum + Number(appointment.price);
  }, 0)

  return (
    <>

      <DashboardCard
        icon={nearestAppointmentIcon}
        heading="Ближайшая запись"
        value={nearestAppointment
          ? `${nearestAppointment.date} ${nearestAppointment.time}`
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
        heading="Общая сумма"
        value={totalMoney}
      />

    </>
  )
}