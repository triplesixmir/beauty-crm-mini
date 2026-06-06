export function DashboardCard({icon, heading, value}) {
  return (
    <div className="dashboard-card">

      <div className="dashboard-card__icon">

        <img
          src={icon}
          alt={heading}
        />

      </div>

      <div className="dashboard-card__content">
        <h2>{heading}</h2>
        <p>{value}</p>
      </div>

    </div>
  )
}