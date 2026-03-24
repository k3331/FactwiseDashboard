import { useMemo } from "react";
import type { Department, Employee } from "../types/employee";

const DEPARTMENT_COLORS: Record<Department, string> = {
  Engineering: "#6366f1",
  Marketing: "#ec4899",
  Sales: "#f59e0b",
  HR: "#10b981",
  Finance: "#3b82f6",
};

interface DepartmentPieChartProps {
  data: Employee[];
}

interface Slice {
  department: Department;
  count: number;
  percentage: number;
  color: string;
  startAngle: number;
  endAngle: number;
}

function polarToCartesian(cx: number, cy: number, r: number, angle: number) {
  const rad = ((angle - 90) * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

function describeArc(
  cx: number,
  cy: number,
  r: number,
  startAngle: number,
  endAngle: number
): string {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${cx} ${cy} L ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y} Z`;
}

export default function DepartmentPieChart({ data }: DepartmentPieChartProps) {
  const slices = useMemo<Slice[]>(() => {
    const counts: Partial<Record<Department, number>> = {};
    data.forEach((e) => {
      counts[e.department] = (counts[e.department] ?? 0) + 1;
    });

    const total = data.length;
    let currentAngle = 0;

    return (Object.entries(counts) as [Department, number][]).map(
      ([dept, count]) => {
        const percentage = (count / total) * 100;
        const sweep = (count / total) * 360;
        const slice: Slice = {
          department: dept,
          count,
          percentage,
          color: DEPARTMENT_COLORS[dept],
          startAngle: currentAngle,
          endAngle: currentAngle + sweep,
        };
        currentAngle += sweep;
        return slice;
      }
    );
  }, [data]);

  const cx = 90;
  const cy = 90;
  const outerR = 80;
  const innerR = 48;

  return (
    <div className="animate-fade-in-up rounded-xl border border-slate-200 bg-white p-5 shadow-sm" style={{ animationDelay: "200ms" }}>
      <h3 className="mb-4 text-sm font-semibold text-slate-700">
        Department Distribution
      </h3>

      <div className="flex flex-col items-center gap-5 sm:flex-row">
        {/* SVG Donut */}
        <div className="shrink-0 animate-spin-in" style={{ animationDelay: "400ms" }}>
          <svg width="180" height="180" viewBox="0 0 180 180">
            {slices.map((s) => {
              if (s.endAngle - s.startAngle >= 359.99) {
                return (
                  <circle
                    key={s.department}
                    cx={cx}
                    cy={cy}
                    r={outerR}
                    fill={s.color}
                  />
                );
              }
              return (
                <path
                  key={s.department}
                  d={describeArc(cx, cy, outerR, s.startAngle, s.endAngle)}
                  fill={s.color}
                  className="transition-opacity hover:opacity-80"
                />
              );
            })}
            {/* Inner circle for donut hole */}
            <circle cx={cx} cy={cy} r={innerR} fill="white" />
            <text
              x={cx}
              y={cy - 6}
              textAnchor="middle"
              className="fill-slate-900 text-2xl font-bold"
              style={{ fontSize: "24px", fontWeight: 700 }}
            >
              {data.length}
            </text>
            <text
              x={cx}
              y={cy + 14}
              textAnchor="middle"
              className="fill-slate-400"
              style={{ fontSize: "11px" }}
            >
              Total
            </text>
          </svg>
        </div>

        {/* Legend */}
        <div className="flex flex-1 flex-col gap-2.5">
          {slices.map((s, i) => (
            <div
              key={s.department}
              className="flex animate-fade-in-up items-center justify-between gap-3"
              style={{ animationDelay: `${500 + i * 80}ms` }}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ background: s.color }}
                />
                <span className="text-sm font-medium text-slate-700">
                  {s.department}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold tabular-nums text-slate-900">
                  {s.count}
                </span>
                <span className="w-10 text-right text-xs tabular-nums text-slate-400">
                  {s.percentage.toFixed(0)}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
