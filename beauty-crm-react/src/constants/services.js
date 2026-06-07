export const SERVICES = [
  {value: 'haircut', label: 'Стрижка'},
  {value: 'manicure', label: 'Маникюр'},
  {value: 'pedicure', label: 'Педикюр'},
  {value: 'laying', label: 'Укладка'},
  {value: 'depilation', label: 'Депиляция'},
];

export const SERVICES_LABELS = Object.fromEntries(
  SERVICES.map((service) => [service.value, service.label])
)