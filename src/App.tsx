import { useCallback, useState } from "react";
import SummaryCards from "./components/SummaryCards";
import DepartmentPieChart from "./components/DepartmentPieChart";
import EmployeeGrid from "./components/EmployeeGrid";
import EmployeeFormModal from "./components/EmployeeFormModal";
import type { EmployeeFormData } from "./components/EmployeeFormModal";
import ConfirmModal from "./components/ConfirmModal";
import initialEmployees from "./data/employees";
import type { Employee } from "./types/employee";

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);

  // Modal state
  const [formOpen, setFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Employee | null>(null);

  const nextId = () =>
    employees.length > 0
      ? Math.max(...employees.map((e) => e.id)) + 1
      : 1;

  // --- CRUD handlers ---
  const handleAdd = useCallback(() => {
    setEditingEmployee(null);
    setFormOpen(true);
  }, []);

  const handleEdit = useCallback((employee: Employee) => {
    setEditingEmployee(employee);
    setFormOpen(true);
  }, []);

  const handleDeleteRequest = useCallback((employee: Employee) => {
    setDeleteTarget(employee);
  }, []);

  const handleFormSave = useCallback(
    (data: EmployeeFormData) => {
      if (editingEmployee) {
        setEmployees((prev) =>
          prev.map((e) =>
            e.id === editingEmployee.id ? { ...e, ...data } : e
          )
        );
      } else {
        const newEmployee: Employee = { id: nextId(), ...data };
        setEmployees((prev) => [...prev, newEmployee]);
      }
      setFormOpen(false);
      setEditingEmployee(null);
    },
    [editingEmployee, employees]
  );

  const handleFormCancel = useCallback(() => {
    setFormOpen(false);
    setEditingEmployee(null);
  }, []);

  const handleDeleteConfirm = useCallback(() => {
    if (deleteTarget) {
      setEmployees((prev) => prev.filter((e) => e.id !== deleteTarget.id));
      setDeleteTarget(null);
    }
  }, [deleteTarget]);

  const handleDeleteCancel = useCallback(() => {
    setDeleteTarget(null);
  }, []);

  return (
    <div className="mx-auto max-w-[1440px] px-4 pb-12 sm:px-6">
      {/* Header */}
      <header className="flex animate-fade-in flex-col gap-3 border-b border-slate-200 py-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3.5">
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" className="shrink-0">
            <rect width="32" height="32" rx="8" fill="#6366f1" />
            <path
              d="M8 10h16M8 16h12M8 22h8"
              stroke="white"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
          </svg>
          <div>
            <h1 className="text-xl font-bold leading-tight text-slate-900">
              FactWise Dashboard
            </h1>
            <p className="text-sm text-slate-500">
              Employee management &amp; analytics
            </p>
          </div>
        </div>
        <span className="self-start rounded-full bg-indigo-50 px-3.5 py-1.5 text-xs font-semibold text-indigo-600 sm:self-auto">
          {employees.length} records
        </span>
      </header>

      {/* Content */}
      <main className="mt-2">
        <SummaryCards data={employees} />
        <div className="mb-6">
          <DepartmentPieChart data={employees} />
        </div>
        <EmployeeGrid
          data={employees}
          onAdd={handleAdd}
          onEdit={handleEdit}
          onDelete={handleDeleteRequest}
        />
      </main>

      {/* Add / Edit modal */}
      <EmployeeFormModal
        open={formOpen}
        employee={editingEmployee}
        onSave={handleFormSave}
        onCancel={handleFormCancel}
      />

      {/* Delete confirmation */}
      <ConfirmModal
        open={deleteTarget !== null}
        title="Delete Employee"
        message={
          deleteTarget
            ? `Are you sure you want to remove ${deleteTarget.firstName} ${deleteTarget.lastName}? This action cannot be undone.`
            : ""
        }
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        onCancel={handleDeleteCancel}
      />
    </div>
  );
}
