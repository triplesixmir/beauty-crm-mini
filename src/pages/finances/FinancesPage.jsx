// noinspection D

import {useState} from "react";
import {
  formatAppointmentDateTime, formatAppointmentYearDateTime,
  formatMoney
} from "../../utils/formatters.js";
import {
  Maximize2 as Maximize2Icon,
  Pencil as PencilIcon,
  Trash as TrashIcon,
  BanknoteX as BanknoteXIcon,
  ReceiptText as ReceiptTextIcon,
  Wallet as WalletIcon,
  TrendingUpDown as TrendingUpDownIcon,
} from "lucide-react";
import {SERVICES_LABELS} from "../../constants/services.js";
import {FinanceCard} from "../../components/finances/FinanceCard.jsx";
import {TopClientCard} from "../../components/finances/TopClientCard.jsx";
import {getPeriodRange, isAppointmentInPeriod} from "../../utils/periods.js";

export function FinancesPage({
                               appointmentsState,
                               clientsState,
                               now,
                             }) {

  const paidAppointments = appointmentsState.appointments.filter(appointment => appointment.price && !appointment.didntCome && new Date(`${appointment.date}T${appointment.time}`) < now);
  const notPaidAppointments = [...appointmentsState.appointments].filter(appointment => appointment.price && appointment.didntCome && new Date(`${appointment.date}T${appointment.time}`) < now);
  const futureAppointments = appointmentsState.appointments.filter(appointment => appointment.price && new Date(`${appointment.date}T${appointment.time}`) > now);

  // Фильтры
  const [currentPeriod, setCurrentPeriod] = useState('all-time');

  const periodRange = getPeriodRange(currentPeriod, now)

  const filteredAppointments = [...paidAppointments].filter(appointment => isAppointmentInPeriod(appointment, periodRange) === true);
  const filteredFutureAppointments = [...futureAppointments].filter(appointment => isAppointmentInPeriod(appointment, periodRange) === true);
  const filteredNotPaidAppointments = [...notPaidAppointments].filter(appointment => isAppointmentInPeriod(appointment, periodRange) === true);

  // Данные для карточек
  const totalRevenue = filteredAppointments.reduce((sum, appointment) => sum + Number(appointment.price), 0);
  const estimatedRevenue = filteredFutureAppointments.reduce((sum, appointment) => sum + Number(appointment.price), 0);
  const averagePrice = totalRevenue > 0 && filteredAppointments.length > 0 ? Math.round(totalRevenue / filteredAppointments.length) : 0;

  const totalLostRevenue = filteredNotPaidAppointments.reduce((sum, appointment) => sum + Number(appointment.price), 0);

  // Топ клиентов
  const topClients = clientsState.clients.map((client) => {
    const totalSpent = filteredAppointments.filter(appointment => appointment.clientId === client.id).reduce((sum, appointment) => sum + Number(appointment.price), 0);

    return {
      id: client.id,
      name: `${client.firstname} ${client.surname}`,
      totalSpent: totalSpent,
    }
  }).sort((a, b) => b.totalSpent - a.totalSpent).slice(0, 5).filter(client => client.totalSpent > 0);

  // TODO: добавить сюда сортировку

  return (
    <main className="app-shell finances-page">

      <section className="finances-page__metrics">
        <FinanceCard
          heading="Полученная выручка"
          value={formatMoney(totalRevenue)}
        >
          <WalletIcon />
        </FinanceCard>

        <FinanceCard
          heading="Прогнозируемая выручка"
          value={formatMoney(estimatedRevenue)}
        >
          <TrendingUpDownIcon />
        </FinanceCard>

        <FinanceCard
          heading="Средний чек"
          value={formatMoney(averagePrice)}
        >
          <ReceiptTextIcon />
        </FinanceCard>

        <FinanceCard
          heading="Потерянная выручка"
          value={formatMoney(totalLostRevenue)}
        >
          <BanknoteXIcon />
        </FinanceCard>
      </section>

      <section className="finances-page__insights">
        <div className="finances-page__top-clients">
          <h2>Топ клиентов</h2>
          {topClients.map(client => (
            <TopClientCard
              key={client.id}
              name={client.name}
              totalSpent={client.totalSpent}
              period={currentPeriod}
            >
              <div>
                {topClients.indexOf(client) + 1}
              </div>
            </TopClientCard>
          ))}
        </div>

        <div className="finances-page__services-stats">
          <h2>Выручка по услугам</h2>
          {Object.entries(SERVICES_LABELS).map(([value, label]) => {
            const totalSpent = filteredAppointments.filter(appointment => appointment.service === value).reduce((sum, appointment) => sum + Number(appointment.price), 0);
            const totalCount = filteredAppointments.filter(appointment => appointment.service === value).length;

            return (
              <div key={value}>
                <p>{label}</p>
                <p>{formatMoney(totalSpent)}</p>
                <p>{totalCount}</p>
              </div>
            )
          })}
        </div>
      </section>

      <section className="finances-page__operations">
        <div className="finances-page__operations-header">
          <div>
            <p className="section__eyebrow">Журнал</p>
            <h2>Финансовые операции</h2>
          </div>
          <select
            className="finances-page__period-select"
            name="choose-period"
            value={currentPeriod}
            onChange={(event) => setCurrentPeriod(event.target.value)}
          >
            <option value="all-time">За все время</option>
            <option value="this-year">За этот год</option>
            <option value="this-month">За этот месяц</option>
            <option value="this-week">За эту неделю</option>
          </select>
        </div>
      {filteredAppointments.length > 0
        ? <div className="finances-page__table-wrapper">
          <table className="finances-page__table">
          <thead>
            <tr>
              <th scope="col">Дата</th>
              <th scope="col">Сумма</th>
              <th scope="col">Услуга</th>
              <th scope="col">Клиент</th>
              <th scope="col">Действия</th>
            </tr>
          </thead>
          <tbody>
            {filteredAppointments.map(appointment => {
              const client = clientsState.clients.find(client => client.id === appointment.clientId);

              return (
                <tr key={appointment.id}>
                  <td>{new Date(`${appointment.date}T${appointment.time}`).getFullYear() === now.getFullYear() ? formatAppointmentDateTime(appointment.date, appointment.time) : formatAppointmentYearDateTime(appointment.date, appointment.time)}</td>
                  <td>{formatMoney(appointment.price)}</td>
                  <td>{SERVICES_LABELS[appointment.service]}</td>
                  <td>{client ? `${client.firstname} ${client.surname}` : ''}</td>
                  <td className="finances-page__actions">
                    <button className="finances-page__action-button"><PencilIcon /></button>
                    <button className="finances-page__action-button"><TrashIcon /></button>
                    <button className="finances-page__action-button"><Maximize2Icon /></button>
                  </td>
                </tr>
              )
            })
            }
          </tbody>
          </table>
        </div>
        : <div className="finances-page__empty">
          <h2>Нет подходящих операций</h2>
          <p>Попробуйте изменить настройки фильтра</p>
        </div>
      }
      </section>

    </main>
  )
}
