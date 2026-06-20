export function FinanceCard({
                              heading,
                              value,
                              children,
                            }) {
  return (
    <div className="finance-card">

      <div className="finance-card__icon">
        {children}
      </div>

      <div className="finance-card__content">
        <h2>{heading}</h2>
        <p>{value}</p>
      </div>

    </div>
  )
}