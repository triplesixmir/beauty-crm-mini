export function EmployeesPageStatsCard({
                                         children,
                                         heading,
                                         value
                                       }) {
  return (
    <div className="employee-stat-card">
      <div className="employee-stat-card__icon">{children}</div>
      <div className="employee-stat-card__content">
        <h2>{heading}</h2>
        <p>{value}</p>
      </div>
    </div>
  )
}
