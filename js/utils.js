export function setTextForSelector(parent, selector, text) {
  const element = parent.querySelector(selector);
  element.textContent = text;
}

export function formatDate(dateString) { return new Intl.DateTimeFormat("ru-RU", {
  dateStyle: 'full',}).format(new Date(dateString)); }

export function formatMoney(price) { return new Intl.NumberFormat("ru-RU", { style: "currency", currency: "RUB", maximumFractionDigits: 0 }).format(price) }

export const today = new Date().toISOString().split('T')[0];

export const services = {
  'service-manicure': 'Маникюр',
  'service-pedicure': 'Педикюр',
  'service-haircut': 'Стрижка',
  'service-depilation': 'Депиляция',
  'service-laying': 'Укладка'
};