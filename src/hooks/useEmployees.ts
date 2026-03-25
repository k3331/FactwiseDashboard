import { useCallback, useState } from "react";
import initialData from "../data/employees";
import type { Employee } from "../types/employee";

export function useEmployees() {
  const [employees, setEmployees] = useState<Employee[]>(initialData);

  const nextId = useCallback(
    () =>
      employees.length > 0
        ? Math.max(...employees.map((e) => e.id)) + 1
        : 1,
    [employees]
  );

  const addEmployee = useCallback(
    (data: Omit<Employee, "id">) => {
      setEmployees((prev) => [...prev, { id: nextId(), ...data }]);
    },
    [nextId]
  );

  const updateEmployee = useCallback(
    (id: number, data: Omit<Employee, "id">) => {
      setEmployees((prev) =>
        prev.map((e) => (e.id === id ? { ...e, ...data } : e))
      );
    },
    []
  );

  const deleteEmployee = useCallback((id: number) => {
    setEmployees((prev) => prev.filter((e) => e.id !== id));
  }, []);

  return { employees, addEmployee, updateEmployee, deleteEmployee };
}
