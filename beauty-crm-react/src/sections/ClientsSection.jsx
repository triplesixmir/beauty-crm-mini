import {ClientCard} from "../components/ClientCard.jsx";
import {formatMoney} from "../utils/formatters.js";

export function ClientsSection({
                                 filteredClients,
                                 appointments,
                                 handleDeleteClient,
                                 setSearchTerm,
                                 openClientEditModal,
                                 openClientAddModal,
                                 openAlert,
                                 closeAlert,
                                 now,
                               }) {

  const currentYear = now.getFullYear();

  function getClientStats(client) {
    const clientAppointments = appointments.filter((appointment) => {
      return appointment.clientId === client.id;
    })

    const clientAppointmentsThisYear = clientAppointments.filter((appointment) => {
      const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
      return appointmentDate.getFullYear() === currentYear;
    })

    const clientFutureAppointments = clientAppointments.filter((appointment) => {
      const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
      return appointmentDate > now;
    })

    const clientFutureAppointmentsInThirtyDays = clientFutureAppointments.filter((appointment) => {
      const appointmentDate = new Date(`${appointment.date}T${appointment.time}`);
      return appointmentDate - now <= 30 * 24 * 60 * 60 * 1000;
    })

    const clientAppointmentsCount = clientAppointments.length;
    const clientEndedAppointmentsThisYearCount = clientAppointmentsThisYear.filter((appointment) => new Date(`${appointment.date}T${appointment.time}`) < now).length;
    const clientTotalSpentThisYear = formatMoney(clientAppointmentsThisYear.reduce((total, appointment) => total + Number(appointment.price), 0));

    const clientNearestAppointment = clientFutureAppointmentsInThirtyDays.sort((a, b) => {
      const firstDate = new Date(`${a.date}T${a.time}`);
      const secondDate = new Date(`${b.date}T${b.time}`);

      return firstDate - secondDate;
    })[0];

    const clientTimeToAppointmentMs = clientNearestAppointment
      ? Math.floor(new Date(`${clientNearestAppointment.date}T${clientNearestAppointment.time}`).getTime() - now.getTime())
      : null;

    return {
      appointmentsCount: clientAppointmentsCount,
      appointmentsThisYearCount: clientEndedAppointmentsThisYearCount,
      totalSpentThisYear: clientTotalSpentThisYear,
      nearestAppointment: clientNearestAppointment,
      timeToAppointmentMs: clientTimeToAppointmentMs,
      futureAppointments: clientFutureAppointmentsInThirtyDays,
    }
  }

  function handleDeleteClick(client) {
    openAlert({
      title: `Удаление клиента ${client.firstname} ${client.surname}`,
      description: "Вы уверены, что хотите удалить клиента?",
      secondDescription: "Это действие необратимо и все данные о клиенте будут удалены.",
      submitButtonText: "Да, удалить",
      cancelButtonText: "Нет, не удалять",
      onSubmit: () => {
        handleDeleteClient(client.id);
        closeAlert();
      },
      onClose: closeAlert,
    })
  }

  return (
    <>

      <button
        className="section__add-btn"
        onClick={openClientAddModal}
      >Добавить клиента
      </button>

      <label className="section__search">
        Поиск по клиентам
        <input
          type="text"
          name="search-field"
          id=""
          placeholder={'Поиск...'}
          onChange={(event) => setSearchTerm(event.target.value)}
        />
      </label>

      <div className="cards-grid">

        {
          filteredClients.length === 0
            ? <p>Клиентов нет</p>
            : filteredClients.map(client => (

              <ClientCard
                onEdit={() => openClientEditModal(client)}
                key={client.id}
                {...client}
                stats={getClientStats(client)}
                currentYear={currentYear}
                handleDeleteClick={() => handleDeleteClick(client)}
              />
            ))
        }

      </div>

    </>
  )
}