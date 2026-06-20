import {formatMoney} from "../../utils/formatters.js";
import {PERIODS_LABELS} from "../../constants/periods.js";

export function TopClientCard({
                                name,
                                totalSpent,
                                period,
                                children
                              }) {
  return (
    <div className="top-client-card">

      {children}

      <h3>{name}</h3>
      <p>{PERIODS_LABELS[period]}: {formatMoney(totalSpent)}</p>

    </div>
  )
}