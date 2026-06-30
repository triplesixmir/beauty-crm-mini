export const EMPLOYEES_SORTS = [
  {value: 'default', label: "По умолчанию"},
  {value: 'a-z', label: "А – Я"},
  {value: 'z-a', label: "Я – А"},
  {value: 'rating-up', label: "По рейтингу ↑"},
  {value: 'rating-down', label: "По рейтингу ↓"},
  {value: 'revenue-up', label: "По выручке ↑"},
  {value: 'revenue-down', label: "По выручке ↓"},
  {value: 'appointments-count-up', label: "По количеству записей ↑"},
  {value: 'appointments-count-down', label: "По количеству записей ↓"},
  {value: 'next-appointment-up', label: "По ближайшей записи ↑"},
  {value: 'next-appointment-down', label: "По ближайшей записи ↓"},
]

export const EMPLOYEES_SORTS_LABELS = Object.fromEntries(
  EMPLOYEES_SORTS.map(sort => [sort.value, sort.label])
)

export const APPOINTMENTS_SORTS = [
  {value: 'default', label: "По умолчанию"},
  {value: 'date-up', label: "По дате ↑"},
  {value: 'date-down', label: "По дате ↓"},
  // TODO: добавить в записи рейтинг (если был добавлен отзыв, соответственно)
  // {value: 'rating-up', label: "По рейтингу ↑"},
  // {value: 'rating-down', label: "По рейтингу ↓"},
  {value: 'sum-up', label: "По сумме ↑"},
  {value: 'sum-down', label: "По сумме ↓"},
]

export const APPOINTMENTS_SORTS_LABELS = Object.fromEntries(
  APPOINTMENTS_SORTS.map(sort => [sort.value, sort.label])
)