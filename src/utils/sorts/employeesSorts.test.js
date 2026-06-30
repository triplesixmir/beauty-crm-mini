import {describe, it, expect} from "vitest";
import {sortEmployees} from "./employeesSorts.js";

describe('sortEmployees', () => {

  it('не мутирует массив при сортировке', () => {
    const employees = [
      {
      employee: {id: 1},
      stats: {nextAppointmentDateTime: new Date('2024-06-14T18:15:00')},
    },
      {
        employee: {id: 2},
        stats: {nextAppointmentDateTime: new Date('2024-06-19T16:30:00')},
      },
      {
        employee: {id: 3},
        stats: {nextAppointmentDateTime: new Date('2024-06-15T11:45:00')},
      },
    ]

    const employeesCopy = structuredClone(employees);
    sortEmployees(employees, 'next-appointment-up');

    expect(employees).toEqual(employeesCopy);
  });

  it.each([
    {sort: 'next-appointment-up', expectedIds: [1, 3, 2, 4]},
    {sort: 'next-appointment-down', expectedIds: [2, 3, 1, 4]}
  ])(
    "сортирует сотрудников по дате ближайшей записи при $sort",
    ({sort, expectedIds}) => {
      const employees = [
        {
          employee: {id: 1},
          stats: {nextAppointmentDateTime: new Date('2024-06-14T18:15:00')},
        },
        {
          employee: {id: 2},
          stats: {nextAppointmentDateTime: new Date('2024-06-19T16:30:00')},
        },
        {
          employee: {id: 3},
          stats: {nextAppointmentDateTime: new Date('2024-06-15T11:45:00')},
        },
        {
          employee: {id: 4},
          stats: {nextAppointmentDateTime: null},
        },
      ]

      const result = sortEmployees(employees, sort);

      expect(result.map(employee => employee.employee.id)).toEqual(expectedIds);
    }
  )
});