export function getPeriodRange(period, now) {
  if (period === 'this-month') {
    return {
      start: new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0),
      end: new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999),
    }
  } else if (period === 'this-week') {
    const daysFromMonday = (now.getDay() + 6) % 7;

    const currentMoment = new Date(now);
    const monday = new Date(currentMoment.setDate(currentMoment.getDate() - daysFromMonday));
    const end = new Date(monday);
    const sunday = new Date(end.setDate(end.getDate() + 6));

    return {
      start: new Date(monday.setHours(0, 0, 0, 0)),
      end: new Date(sunday.setHours(23, 59, 59, 999)),
    }
  } else if (period === 'this-year') {
    return {
      start: new Date(now.getFullYear(), 0, 1, 0, 0, 0, 0),
      end: new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999),
    }
  } else if (period === 'all-time') {
    return {
      start: null,
      end: null,
    }
  }
}

export function isAppointmentInPeriod(appointment, period) {
  if (period.start && period.end) {
    return new Date(`${appointment.date}T${appointment.time}:00`) >= period.start && new Date(`${appointment.date}T${appointment.time}:00`) <= period.end;
  } else return period.start === null && period.end === null;
}
