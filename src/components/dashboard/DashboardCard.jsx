export function DashboardCard({
                                heading,
                                value,
                                children
                              }) {
  return (
    <div className="dashboard-card">

      <div className="dashboard-card__icon">
        {children}
      </div>

      <div className="dashboard-card__content">
        <h2>{heading}</h2>
        <p>{value}</p>
      </div>

    </div>
  )
}