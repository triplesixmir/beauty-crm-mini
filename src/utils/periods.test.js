import {describe, expect, it} from "vitest";
import {getPeriodRange, isAppointmentInPeriod} from "./periods.js";

describe("getPeriodRange", () => {
  it("возвращает границы месяца", () => {
    const now = new Date('2024-05-04T14:27:00.000');

    const period = getPeriodRange("this-month", now);

    expect(period).toEqual({
      start: new Date('2024-05-01T00:00:00.000'),
      end: new Date('2024-05-31T23:59:59.999')
    })
  })

  it("возвращает границы недели", () => {
    const now = new Date(2026, 5, 26, 12, 14, 0, 0)

    const period = getPeriodRange("this-week", now);

    expect(period).toEqual({
      start: new Date(2026, 5, 22, 0, 0, 0, 0),
      end: new Date(2026, 5, 28, 23, 59, 59, 999)
    })
  })

  it("возвращает границы года", () => {
    const now = new Date(2026, 5, 26, 12, 14, 0, 0)

    const period = getPeriodRange("this-year", now);

    expect(period).toEqual({
      start: new Date(2026, 0, 1, 0, 0, 0, 0),
      end: new Date(2026, 11, 31, 23, 59, 59, 999)
    })
  })

  it("возвращает пустые границы (для фильтрации 'за все время')", () => {
    const now = new Date(2026, 5, 26, 12, 14, 0, 0)

    const period = getPeriodRange("all-time", now);

    expect(period).toEqual({
      start: null,
      end: null
    })
  })
})

describe("isAppointmentInPeriod", () => {
  it("возвращает true, если запись находится внутри периода", () => {

    const period = {
      start: new Date(2026, 5, 1, 0, 0, 0, 0),
      end: new Date(2026, 5, 30, 23, 59, 59, 999)
    }
    const appointment = {
      date: '2026-06-15',
      time: '12:00'
    }

    const result = isAppointmentInPeriod(appointment, period);

    expect(result).toBe(true);

  })

  it("возвращает false, если запись раньше начала периода", () => {
    const appointment = {
      date: '2026-05-15',
      time: '12:00'
    }

    const period = {
      start: new Date(2026, 4, 16, 0, 0, 0, 0),
      end: new Date(2026, 4, 30, 23, 59, 59, 999)
    }

    const result = isAppointmentInPeriod(appointment, period);

    expect(result).toBe(false);

  })

  it("возвращает false, если запись позже конца периода", () => {
    const period = {
      start: new Date(2026, 7, 15, 12, 0, 0),
      end: new Date(2026, 7, 20, 12, 0, 0),
    }

    const appointment = {
      date: '2026-08-25',
      time: '12:00'
    }

    const result = isAppointmentInPeriod(appointment, period);

    expect(result).toBe(false);
  })

  it("возвращает true, если запись находится в самом начале периода периоде", () => {
    const period = {
      start: new Date(2026, 7, 15, 12, 0, 0),
      end: new Date(2026, 7, 20, 12, 0, 0),
    }

    const appointment = {
      date: '2026-08-15',
      time: '12:00'
    }

    const result = isAppointmentInPeriod(appointment, period);

    expect(result).toBe(true);
  })

  it("возвращает true, если запись находится в самом конце периода периоде", () => {
    const period = {
      start: new Date(2026, 7, 15, 12, 0, 0),
      end: new Date(2026, 7, 20, 12, 0, 0),
    }

    const appointment = {
      date: '2026-08-20',
      time: '12:00'
    }

    const result = isAppointmentInPeriod(appointment, period);

    expect(result).toBe(true);
  })

  it('возвращает true при любой записи, если период "all-time" и старт и конец - null', () => {
    const period = {
      start: null,
      end: null,
    }

    const appointment = {
      date: '2026-08-20',
      time: '12:00'
    }

    const result = isAppointmentInPeriod(appointment, period);

    expect(result).toBe(true);
  });
})