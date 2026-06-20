export const SERVICES = [
  {value: 'haircut', label: 'Стрижка'},
  {value: 'manicure', label: 'Маникюр'},
  {value: 'pedicure', label: 'Педикюр'},
  {value: 'laying', label: 'Укладка'},
  {value: 'depilation', label: 'Депиляция'},
  {value: 'massage', label: 'Массаж'},
  {value: 'facial', label: 'Уход за лицом'},
  {value: 'hair_coloring', label: 'Окрашивание'},
  {value: 'beard_trimming', label: 'Стрижка бороды'},
  {value: 'beard_modeling', label: 'Моделирование бороды'},
];

export const SERVICES_LABELS = Object.fromEntries(
  SERVICES.map((service) => [service.value, service.label])
)