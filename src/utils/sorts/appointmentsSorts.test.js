import {describe, it, expect} from "vitest";
import {sortAppointments} from "./appointmentsSorts.js";

describe('sortAppointments', () => {
  it('не мутирует массив при сортировке', () => {
    const appointments = [
      {id: 1, date: '2024-05-01', time: '10:00', price: 100},
      {id: 2, date: '2024-06-14', time: '18:00', price: 2000},
      {id: 3, date: '2024-06-11', time: '14:00', price: 300},
    ]

    const appointmentsCopy = structuredClone(appointments);

    sortAppointments(appointments, 'date-up');

    expect(appointments).toEqual(appointmentsCopy);
  });

  it('сортирует записи по дате от ранней к поздней при date-up', () => {
    const appointments = [
      {id: 1, date: '2024-05-01', time: '10:00', price: 100},
      {id: 2, date: '2024-06-14', time: '18:00', price: 2000},
      {id: 3, date: '2024-06-11', time: '14:00', price: 300},
    ]

    const sort = 'date-up';

    const sortedAppointments = sortAppointments(appointments, sort);

    expect(sortedAppointments.map((appointment) => appointment.id)).toEqual([1, 3, 2])
  });

  it('сортирует записи по дате и времени от раннего к позднему при date-up', () => {
    const appointments = [
      {id: 1, date: '2024-06-14', time: '21:00', price: 100},
      {id: 2, date: '2024-06-14', time: '18:00', price: 2000},
      {id: 3, date: '2024-06-14', time: '14:00', price: 300},
    ]

    const sort = 'date-up';

    const sortedAppointments = sortAppointments(appointments, sort);

    expect(sortedAppointments.map((appointment) => appointment.id)).toEqual([3, 2, 1])
  });

  it('сортирует записи по дате от поздней к ранней при date-down', () => {
    const appointments = [
      {id: 1, date: '2024-05-01', time: '10:00', price: 100},
      {id: 2, date: '2024-06-14', time: '18:00', price: 2000},
      {id: 3, date: '2024-06-11', time: '14:00', price: 300},
    ]

    const sort = 'date-down';

    const sortedAppointments = sortAppointments(appointments, sort);

    expect(sortedAppointments.map((appointment) => appointment.id)).toEqual([2, 3, 1])
  });

  it('сортирует записи по дате и времени от позднего к раннему при date-down', () => {
    const appointments = [
      {id: 1, date: '2024-06-14', time: '21:00', price: 100},
      {id: 2, date: '2024-06-14', time: '11:00', price: 2000},
      {id: 3, date: '2024-06-14', time: '14:00', price: 300},
    ]

    const sort = 'date-down';

    const result = sortAppointments(appointments, sort);

    expect(result.map((appointment) => appointment.id)).toEqual([1, 3, 2])
  });

  it.each([
    {sort: 'sum-up', expectedIds: [1, 3, 2]},
    {sort: 'sum-down', expectedIds: [2, 3, 1]},
  ])(
    "сортирует записи по сумме при $sort",
    ({sort, expectedIds}) => {
      const appointments = [
        {id: 1, date: '2024-06-14', time: '21:00', price: 100},
        {id: 2, date: '2024-06-14', time: '11:00', price: 2000},
        {id: 3, date: '2024-06-14', time: '14:00', price: 300},
      ]

      const result = sortAppointments(appointments, sort);

      expect(result.map((appointment) => appointment.id)).toEqual(expectedIds);
    }
  )
});