export const PERIODS = [
  {value: 'all-time', label: "Все время"},
  {value: 'this-year', label: "Текущий год"},
  {value: 'this-month', label: "Текущий месяц"},
  {value: 'this-week', label: "Текущая неделя"},
]

export const PERIODS_LABELS = Object.fromEntries(
  PERIODS.map(period => [period.value, period.label])
)