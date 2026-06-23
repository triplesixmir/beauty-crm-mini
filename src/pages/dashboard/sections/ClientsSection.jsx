import {ClientCard} from "../../../components/clients/ClientCard.jsx";
import {formatMoney} from "../../../utils/formatters.js";
import {useState} from "react";

export function ClientsSection({
                                 appointments,
                                 clientsState,
                                 openSidebarTab,
                                 openClientEditModal,
                                 openClientAddModal,
                                 openAlert,
                                 closeAlert,
                                 showToast,
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
    const clientEndedAppointmentsThisYear = clientAppointmentsThisYear.filter((appointment) => new Date(`${appointment.date}T${appointment.time}`) < now);
    const clientTotalSpentThisYear = formatMoney(clientEndedAppointmentsThisYear.reduce((total, appointment) => total + Number(appointment.price), 0));

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

  function openClientDetailsSidebar(client) {
    openSidebarTab({
      type: "client",
      id: client.id,
      title: `${client.firstname} ${client.surname}`,
      key: `client:${client.id}`,
    });
  }

  function handleDeleteClick(client) {
    openAlert({
      title: `Удаление клиента ${client.firstname} ${client.surname}`,
      description: "Вы уверены, что хотите удалить клиента?",
      secondDescription: "Это действие необратимо и все данные о клиенте будут удалены.",
      submitButtonText: "Да, удалить",
      cancelButtonText: "Нет, не удалять",
      onSubmit: () => {
        clientsState.handleDeleteClient(client.id);
        closeAlert();
        showToast("info", "Клиент успешно удален", 3000);
      },
      onClose: closeAlert,
    })
  }

  // Реализация поиска по клиентам
  const [searchTerm, setSearchTerm] = useState('');
  const searchedClients = clientsState.clients.filter(client => String(`${client.firstname} ${client.surname}`).toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <section className="section section--clients">

      <div className="section__header">
        <div>
          <p className="section__eyebrow">Клиентская база</p>
          <h2>Клиенты</h2>
        </div>

        <button
          className="section__add-btn"
          onClick={openClientAddModal}
        >Добавить клиента
        </button>
      </div>

      <label className="section__search">
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
          searchedClients.length === 0
            ?
            <div className="clients-section__empty">
              <h2>Нет подходящих клиентов</h2>
              <p>Попробуйте изменить настройки фильтра</p>
            </div>
            :
            searchedClients.map(client => (

              <ClientCard
                onEdit={() => openClientEditModal(client)}
                key={client.id}
                {...client}
                stats={getClientStats(client)}
                currentYear={currentYear}
                handleDeleteClick={() => handleDeleteClick(client)}
                onOpenDetails={() => openClientDetailsSidebar(client)}
              />
            ))
        }

      </div>

    </section>
  )
}
