const pluralRules = new Intl.PluralRules('ru-RU');

const dayForms = {
  one: 'день',
  few: 'дня',
  many: 'дней',
  other: 'дня',
}

const hourForms = {
  one: 'час',
  few: 'часа',
  many: 'часов',
  other: 'часов',
}

const minuteForms = {
  one: 'минуту',
  few: 'минуты',
  many: 'минут',
  other: 'минут',
}

const toVisitForms = {
  one: 'посещение',
  few: 'посещения',
  many: 'посещений',
  other: 'посещения'
}

export function formatMoney(value) {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'RUB',
    maximumFractionDigits: 0
  }).format(value)
}

export function formatAppointmentDateTime(date, time) {
  const dateTime = new Date(`${date}T${time}`);

  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateTime);
}

export function formatDateTime(dateTime) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    hour: '2-digit',
    minute: '2-digit',
  }).format(dateTime);
}

export function formatDate(date) {
  return new Intl.DateTimeFormat('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export function formatTime(time) {
  return new Intl.DateTimeFormat('ru-RU', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(time);
}

export function formatTimeUntilAppointment(diffMs) {
  const minuteMs = 60 * 1000;
  const hourMs = 60 * minuteMs;
  const dayMs = 24 * hourMs;

  if (diffMs < hourMs) {
    return `${Math.ceil(diffMs / minuteMs)} ${minuteForms[pluralRules.select(Math.ceil(diffMs / minuteMs))]}`;
  } else if (diffMs < dayMs) {
    return `${Math.ceil(diffMs / hourMs)} ${hourForms[pluralRules.select(Math.ceil(diffMs / hourMs))]}`;
  } else {
    return `${Math.ceil(diffMs / dayMs)} ${dayForms[pluralRules.select(Math.ceil(diffMs / dayMs))]}`;
  }
}

export function formatAppointmentsCount(count) {
  return `${count} ${toVisitForms[pluralRules.select(count)]}`;
}