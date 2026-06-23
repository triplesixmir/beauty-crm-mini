import {useEffect, useState} from "react";

export function useEmployees() {
  const [employees, setEmployees] = useState(() => {
    const stored = localStorage.getItem('employees');
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  const [editingEmployee, setEditingEmployee] = useState(null);

  function handleResetEditingEmployee() {
    setEditingEmployee(null);
  }

  function handleAddEmployee(employeeData) {
    setEmployees(prevEmployees => [...prevEmployees, {id: Date.now(), ...employeeData}]);
  }

  function handleDeleteEmployee(id) {
    setEmployees(prevEmployees => prevEmployees.filter(employee => employee.id !== id));
  }

  function handleEditEmployee(employee) {
    setEditingEmployee(employee);
  }

  function handleUpdateEmployee(updatedEmployee) {
    setEmployees(prevEmployees => prevEmployees.map(employee => employee.id === updatedEmployee.id ? updatedEmployee : employee));
  }

  return {
    employees,
    setEmployees,
    editingEmployee,
    setEditingEmployee,
    handleAddEmployee,
    handleDeleteEmployee,
    handleEditEmployee,
    handleUpdateEmployee,
    handleResetEditingEmployee,
  }
}