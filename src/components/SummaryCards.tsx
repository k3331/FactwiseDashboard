import { useMemo } from "react";
import type { Department, Employee } from "../types/employee";

const DEPARTMENT_COLORS: Record<Department, string> = {
  Engineering: "#6366f1",
  Marketing: "#ec4899",
  Sales: "#f59e0b",
  HR: "#10b981",
  Finance: "#3b82f6",
};

interface SummaryCardsProps {
  data: Employee[];
}

export default function SummaryCards({ data }: SummaryCardsProps) {
  const stats = useMemo(() => {
    const totalEmployees = data.length;
    const activeEmployees = data.filter((e) => e.isActive).length;
    const avgSalary =
      data.reduce((sum, e) => sum + e.salary, 0) / totalEmployees;
    const avgRating =
      data.reduce((sum, e) => sum + e.performanceRating, 0) / totalEmployees;
    const totalProjects = data.reduce(
      (sum, e) => sum + e.projectsCompleted,
      0
    );

    const departments: Partial<Record<Department, number>> = {};
    data.forEach((e) => {
      departments[e.department] = (departments[e.department] ?? 0) + 1;
    });

    return {
      totalEmployees,
      activeEmployees,
      avgSalary,
      avgRating,
      totalProjects,
      departments,
    };
  }, [data]);

  const cards = [
    {
      label: "Total Employees",
      value: stats.totalEmployees,
      sub: `${stats.activeEmployees} active`,
      bg: "bg-indigo-500/10",
      text: "text-indigo-500",
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
          <circle cx="9" cy="7" r="4" />
          <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
          <path d="M16 3.13a4 4 0 0 1 0 7.75" />
        </svg>
      ),
    },
    {
      label: "Avg. Salary",
      value: `$${Math.round(stats.avgSalary).toLocaleString()}`,
      sub: "per year",
      bg: "bg-emerald-500/10",
      text: "text-emerald-500",
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <line x1="12" y1="1" x2="12" y2="23" />
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
        </svg>
      ),
    },
    {
      label: "Avg. Rating",
      value: stats.avgRating.toFixed(1),
      sub: "out of 5.0",
      bg: "bg-amber-500/10",
      text: "text-amber-500",
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ),
    },
    {
      label: "Projects Done",
      value: stats.totalProjects,
      sub: "across all teams",
      bg: "bg-blue-500/10",
      text: "text-blue-500",
      icon: (
        <svg width="24" height="24" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
          <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
          <line x1="8" y1="21" x2="16" y2="21" />
          <line x1="12" y1="17" x2="12" y2="21" />
        </svg>
      ),
    },
  ];

  return (
    <div className="mb-6">
      <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, i) => (
          <div
            key={card.label}
            className="flex animate-fade-in-up items-start gap-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"
            style={{ animationDelay: `${i * 100}ms` }}
          >
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg ${card.bg} ${card.text}`}
            >
              {card.icon}
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium tracking-wide text-slate-500 uppercase">
                {card.label}
              </span>
              <span className="text-2xl font-bold leading-tight text-slate-900">
                {card.value}
              </span>
              <span className="text-xs text-slate-400">{card.sub}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex animate-fade-in flex-wrap gap-2" style={{ animationDelay: "400ms" }}>
        {(
          Object.entries(stats.departments) as [Department, number][]
        ).map(([dept, count]) => (
          <span
            key={dept}
            className="inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold"
            style={{
              background: `${DEPARTMENT_COLORS[dept]}15`,
              color: DEPARTMENT_COLORS[dept],
              borderColor: `${DEPARTMENT_COLORS[dept]}40`,
            }}
          >
            {dept}
            <span
              className="inline-flex h-5 w-5 items-center justify-center rounded-full text-[0.65rem] font-bold text-white"
              style={{ background: DEPARTMENT_COLORS[dept] }}
            >
              {count}
            </span>
          </span>
        ))}
      </div>
    </div>
  );
}
