import {DashboardCard} from "../../../components/dashboard/DashboardCard.jsx";

import {Timer as TimerIcon} from "lucide-react";
import {CalendarDays as CalendarDaysIcon} from "lucide-react";
import {UsersRound as UsersRoundIcon} from "lucide-react";
import {Wallet as WalletIcon} from "lucide-react";

import {formatAppointmentDateTime, formatMoney} from "../../../utils/formatters.js";

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
    <section
      className="dashboard-section"
      aria-label="Сводка"
    >

      <DashboardCard
        heading="Ближайшая запись"
        value={nearestAppointment
          ? formatAppointmentDateTime(nearestAppointment.date, nearestAppointment.time)
          : 'Нет подходящей записи'}
      >
        <TimerIcon />
      </DashboardCard>

      <DashboardCard
        heading="Всего записей"
        value={totalAppointments}
      >
        <CalendarDaysIcon />
      </DashboardCard>

      <DashboardCard
        heading="Всего клиентов"
        value={totalClients}
      >
        <UsersRoundIcon />
      </DashboardCard>

      <DashboardCard
        heading="Общая прибыль"
        value={formatMoney(totalMoney)}
      >
        <WalletIcon />
      </DashboardCard>

    </section>
  )
}
