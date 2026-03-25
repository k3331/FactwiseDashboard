import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import type { Department, Employee } from "../types/employee";

const DEPARTMENTS: Department[] = [
  "Engineering",
  "Marketing",
  "Sales",
  "HR",
  "Finance",
];

type EmployeeFormData = Omit<Employee, "id">;

const DEFAULTS: EmployeeFormData = {
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

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<EmployeeFormData>({ defaultValues: DEFAULTS });

  const skills = watch("skills");
  const [skillInput, setSkillInput] = useState("");

  useEffect(() => {
    if (open) {
      if (employee) {
        const { id: _id, ...rest } = employee;
        reset(rest);
      } else {
        reset(DEFAULTS);
      }
      setSkillInput("");
    }
  }, [open, employee, reset]);

  useEffect(() => {
    if (!open) return;
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onCancel();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [open, onCancel]);

  function onSubmit(data: EmployeeFormData) {
    onSave({ ...data, manager: data.manager || null });
  }

  function handleAddSkill() {
    const trimmed = skillInput.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setValue("skills", [...skills, trimmed]);
      setSkillInput("");
    }
  }

  function handleRemoveSkill(skill: string) {
    setValue(
      "skills",
      skills.filter((s) => s !== skill)
    );
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
        onSubmit={handleSubmit(onSubmit)}
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
            <div>
              <label className={labelCls}>First Name *</label>
              <input
                className={inputCls}
                placeholder="John"
                {...register("firstName", { required: "Required" })}
              />
              {errors.firstName && <p className={errorCls}>{errors.firstName.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Last Name *</label>
              <input
                className={inputCls}
                placeholder="Smith"
                {...register("lastName", { required: "Required" })}
              />
              {errors.lastName && <p className={errorCls}>{errors.lastName.message}</p>}
            </div>

            <div className="sm:col-span-2">
              <label className={labelCls}>Email *</label>
              <input
                type="email"
                className={inputCls}
                placeholder="john.smith@company.com"
                {...register("email", {
                  required: "Required",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Invalid email",
                  },
                })}
              />
              {errors.email && <p className={errorCls}>{errors.email.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Department *</label>
              <select className={inputCls} {...register("department")}>
                {DEPARTMENTS.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className={labelCls}>Position *</label>
              <input
                className={inputCls}
                placeholder="Senior Developer"
                {...register("position", { required: "Required" })}
              />
              {errors.position && <p className={errorCls}>{errors.position.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Salary ($) *</label>
              <input
                type="number"
                className={inputCls}
                placeholder="95000"
                {...register("salary", {
                  valueAsNumber: true,
                  required: "Required",
                  min: { value: 1, message: "Must be positive" },
                })}
              />
              {errors.salary && <p className={errorCls}>{errors.salary.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Age *</label>
              <input
                type="number"
                className={inputCls}
                {...register("age", {
                  valueAsNumber: true,
                  required: "Required",
                  min: { value: 18, message: "Min 18" },
                  max: { value: 100, message: "Max 100" },
                })}
              />
              {errors.age && <p className={errorCls}>{errors.age.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Location *</label>
              <input
                className={inputCls}
                placeholder="New York"
                {...register("location", { required: "Required" })}
              />
              {errors.location && <p className={errorCls}>{errors.location.message}</p>}
            </div>

            <div>
              <label className={labelCls}>Hire Date</label>
              <input
                type="date"
                className={inputCls}
                {...register("hireDate")}
              />
            </div>

            <div>
              <label className={labelCls}>Performance Rating (0-5)</label>
              <input
                type="number"
                step="0.1"
                className={inputCls}
                {...register("performanceRating", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Min 0" },
                  max: { value: 5, message: "Max 5" },
                })}
              />
              {errors.performanceRating && (
                <p className={errorCls}>{errors.performanceRating.message}</p>
              )}
            </div>

            <div>
              <label className={labelCls}>Projects Completed</label>
              <input
                type="number"
                className={inputCls}
                {...register("projectsCompleted", {
                  valueAsNumber: true,
                  min: { value: 0, message: "Min 0" },
                })}
              />
            </div>

            <div>
              <label className={labelCls}>Manager</label>
              <input
                className={inputCls}
                placeholder="None"
                {...register("manager")}
              />
            </div>

            <div className="flex items-center gap-2 self-end pb-1">
              <input
                id="isActive"
                type="checkbox"
                className="h-4 w-4 rounded border-slate-300 text-indigo-500 accent-indigo-500"
                {...register("isActive")}
              />
              <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
                Active
              </label>
            </div>

            {/* Skills -- managed outside RHF since it's a dynamic array with custom UI */}
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
              {skills.length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {skills.map((skill) => (
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
