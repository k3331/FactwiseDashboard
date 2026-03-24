import { useEffect, useState } from "react";
import type { Department, Employee } from "../types/employee";

const DEPARTMENTS: Department[] = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
];

type EmployeeFormData = Omit<Employee, "id">;

const EMPTY_FORM: EmployeeFormData = {
  firstName: "",
  lastName: "",
  email: "",
  department: "Engineering",
  position: "",
  salary: 0,
  hireDate: new Date().toISOString().slice(0, 10),
  age: 25,
  location: "",
  performanceRating: 4.0,
  projectsCompleted: 0,
  isActive: true,
  skills: [],
  manager: null,
};

interface EmployeeFormModalProps {
  open: boolean;
  employee: Employee | null;
  onSave: (data: EmployeeFormData) => void;
  onCancel: () => void;
}

export default function EmployeeFormModal({
  open,
  employee,
  onSave,
  onCancel,
}: EmployeeFormModalProps) {
  const isEdit = employee !== null;
  const [form, setForm] = useState<EmployeeFormData>(EMPTY_FORM);
  const [skillInput, setSkillInput] = useState("");
  const [errors, setErrors] = useState<Partial<Record<keyof EmployeeFormData, string>>>({});

  useEffect(() => {
    if (open) {
      if (employee) {
        const { id: _id, ...rest } = employee;
        setForm(rest);
      } else {
        setForm(EMPTY_FORM);
      }
      setSkillInput("");
      setErrors({});
    }
  }, [open, employee]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  function validate(): boolean {
    const newErrors: typeof errors = {};
    if (!form.firstName.trim()) newErrors.firstName = "Required";
    if (!form.lastName.trim()) newErrors.lastName = "Required";
    if (!form.email.trim()) newErrors.email = "Required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      newErrors.email = "Invalid email";
    if (!form.position.trim()) newErrors.position = "Required";
    if (!form.location.trim()) newErrors.location = "Required";
    if (form.salary <= 0) newErrors.salary = "Must be positive";
    if (form.age < 18 || form.age > 100) newErrors.age = "18-100";
    if (form.performanceRating < 0 || form.performanceRating > 5)
      newErrors.performanceRating = "0-5";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (validate()) onSave(form);
  }

  function handleAddSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm((f) => ({ ...f, skills: [...f.skills, trimmed] }));
      setSkillInput("");
    }
  }

  function handleRemoveSkill(skill: string) {
    setForm((f) => ({ ...f, skills: f.skills.filter((s) => s !== skill) }));
  }

  function handleSkillKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddSkill();
    }
  }

  if (!open) return null;

  const inputCls =
    "w-full rounded-lg border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 placeholder:text-slate-400";
  const labelCls = "mb-1 block text-xs font-semibold text-slate-600";
  const errorCls = "mt-0.5 text-xs text-red-500";

  return (
    <div className="fixed inset-0 z-50 flex animate-overlay-in items-start justify-center overflow-y-auto bg-black/40 p-4 pt-[5vh]">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl animate-slide-in-up rounded-xl bg-white shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <h2 className="text-lg font-bold text-slate-900">
            {isEdit ? "Edit Employee" : "Add Employee"}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600"
          >
            <svg width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="max-h-[70vh] overflow-y-auto px-6 py-5">
          <div className="grid grid-cols-1 gap-x-4 gap-y-4 sm:grid-cols-2">
            {/* First Name */}
            <div>
              <label className={labelCls}>First Name *</label>
              <input
                className={inputCls}
                value={form.firstName}
                onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                placeholder="John"
              />
              {errors.firstName && <p className={errorCls}>{errors.firstName}</p>}
            </div>

            {/* Last Name */}
            <div>
              <label className={labelCls}>Last Name *</label>
              <input
                className={inputCls}
                value={form.lastName}
                onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                placeholder="Smith"
              />
              {errors.lastName && <p className={errorCls}>{errors.lastName}</p>}
            </div>

            {/* Email */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Email *</label>
              <input
                type="email"
                className={inputCls}
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                placeholder="john.smith@company.com"
              />
              {errors.email && <p className={errorCls}>{errors.email}</p>}
            </div>

            {/* Department */}
            <div>
              <label className={labelCls}>Department *</label>
              <select
                className={inputCls}
                value={form.department}
                onChange={(e) =>
                  setForm((f) => ({ ...f, department: e.target.value as Department }))
                }
              >
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            {/* Position */}
            <div>
              <label className={labelCls}>Position *</label>
              <input
                className={inputCls}
                value={form.position}
                onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))}
                placeholder="Senior Developer"
              />
              {errors.position && <p className={errorCls}>{errors.position}</p>}
            </div>

            {/* Salary */}
            <div>
              <label className={labelCls}>Salary ($) *</label>
              <input
                type="number"
                className={inputCls}
                value={form.salary || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, salary: Number(e.target.value) }))
                }
                placeholder="95000"
                min={0}
              />
              {errors.salary && <p className={errorCls}>{errors.salary}</p>}
            </div>

            {/* Age */}
            <div>
              <label className={labelCls}>Age *</label>
              <input
                type="number"
                className={inputCls}
                value={form.age || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, age: Number(e.target.value) }))
                }
                min={18}
                max={100}
              />
              {errors.age && <p className={errorCls}>{errors.age}</p>}
            </div>

            {/* Location */}
            <div>
              <label className={labelCls}>Location *</label>
              <input
                className={inputCls}
                value={form.location}
                onChange={(e) => setForm((f) => ({ ...f, location: e.target.value }))}
                placeholder="New York"
              />
              {errors.location && <p className={errorCls}>{errors.location}</p>}
            </div>

            {/* Hire Date */}
            <div>
              <label className={labelCls}>Hire Date</label>
              <input
                type="date"
                className={inputCls}
                value={form.hireDate}
                onChange={(e) => setForm((f) => ({ ...f, hireDate: e.target.value }))}
              />
            </div>

            {/* Performance Rating */}
            <div>
              <label className={labelCls}>Performance Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                className={inputCls}
                value={form.performanceRating}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    performanceRating: Number(e.target.value),
                  }))
                }
                min={0}
                max={5}
              />
              {errors.performanceRating && (
                <p className={errorCls}>{errors.performanceRating}</p>
              )}
            </div>

            {/* Projects Completed */}
            <div>
              <label className={labelCls}>Projects Completed</label>
              <input
                type="number"
                className={inputCls}
                value={form.projectsCompleted}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    projectsCompleted: Number(e.target.value),
                  }))
                }
                min={0}
              />
            </div>

            {/* Manager */}
            <div>
              <label className={labelCls}>Manager</label>
              <input
                className={inputCls}
                value={form.manager ?? ""}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    manager: e.target.value || null,
                  }))
                }
                placeholder="None"
              />
            </div>

            {/* Active */}
            <div className="flex items-center gap-2 self-end pb-1">
              <input
                id="isActive"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-500 accent-indigo-500"
                checked={form.isActive}
                onChange={(e) =>
                  setForm((f) => ({ ...f, isActive: e.target.checked }))
                }
              />
              <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
                Active
              </label>
            </div>

            {/* Skills */}
            <div className="sm:col-span-2">
              <label className={labelCls}>Skills</label>
              <div className="flex gap-2">
                <input
                  className={inputCls}
                  value={skillInput}
                  onChange={(e) => setSkillInput(e.target.value)}
                  onKeyDown={handleSkillKeyDown}
                  placeholder="Type a skill and press Enter"
                />
                <button
                  type="button"
                  onClick={handleAddSkill}
                  className="shrink-0 cursor-pointer rounded-lg bg-slate-200 px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-300"
                >
                  Add
                </button>
              </div>
              {form.skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {form.skills.map((skill) => (
                    <span
                      key={skill}
                      className="inline-flex items-center gap-1 rounded-md bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-700"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => handleRemoveSkill(skill)}
                        className="cursor-pointer text-slate-400 hover:text-red-500"
                      >
                        <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <line x1="18" y1="6" x2="6" y2="18" />
                          <line x1="6" y1="6" x2="18" y2="18" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-slate-100 px-6 py-4">
          <button
            type="button"
            onClick={onCancel}
            className="cursor-pointer rounded-lg border border-slate-200 bg-white px-5 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-indigo-500 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            {isEdit ? "Save Changes" : "Add Employee"}
          </button>
        </div>
      </form>
    </div>
  );
}

export type { EmployeeFormData };
