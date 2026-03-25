import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { AgGridReact } from "ag-grid-react";
import {
  AllCommunityModule,
  ModuleRegistry,
  themeQuartz,
} from "ag-grid-community";
import type {
  ColDef,
  GridReadyEvent,
  ICellRendererParams,
  ValueFormatterParams,
  ValueGetterParams,
} from "ag-grid-community";
import type { Employee } from "../types/employee";

ModuleRegistry.registerModules([AllCommunityModule]);

const customTheme = themeQuartz.withParams({
  accentColor: "#6366f1",
  borderRadius: 8,
  browserColorScheme: "light",
  headerBackgroundColor: "#f8fafc",
  headerTextColor: "#334155",
  rowHoverColor: "#f1f5f9",
  selectedRowBackgroundColor: "#eef2ff",
  fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
  fontSize: 14,
  headerFontSize: 13,
  headerFontWeight: 600,
});

function StatusCellRenderer({ value }: ICellRendererParams<Employee, boolean>) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ${
        value
          ? "bg-emerald-50 text-emerald-600"
          : "bg-red-50 text-red-600"
      }`}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {value ? "Active" : "Inactive"}
    </span>
  );
}

function RatingCellRenderer({
  value,
}: ICellRendererParams<Employee, number>) {
  if (value == null) return null;
  const percentage = (value / 5) * 100;
  const colorClass =
    value >= 4.5
      ? "bg-emerald-500"
      : value >= 4.0
        ? "bg-indigo-500"
        : value >= 3.5
          ? "bg-amber-500"
          : "bg-red-500";
  const textClass =
    value >= 4.5
      ? "text-emerald-600"
      : value >= 4.0
        ? "text-indigo-600"
        : value >= 3.5
          ? "text-amber-600"
          : "text-red-600";

  return (
    <div className="flex w-full items-center gap-2.5">
      <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-slate-100">
        <div
          className={`h-full rounded-full transition-all duration-500 ${colorClass}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span
        className={`min-w-[28px] text-right text-[0.82rem] font-bold tabular-nums ${textClass}`}
      >
        {value.toFixed(1)}
      </span>
    </div>
  );
}

function SkillsCellRenderer({
  value,
}: ICellRendererParams<Employee, string[]>) {
  if (!value) return null;
  return (
    <div className="flex flex-wrap gap-1 py-1.5">
      {value.map((skill) => (
        <span
          key={skill}
          className="inline-block whitespace-nowrap rounded bg-slate-100 px-2 py-0.5 text-[0.7rem] font-medium text-slate-600"
        >
          {skill}
        </span>
      ))}
    </div>
  );
}

function SalaryCellRenderer({
  value,
}: ICellRendererParams<Employee, number>) {
  if (value == null) return null;
  return (
    <span className="font-semibold tabular-nums text-emerald-700">
      ${value.toLocaleString()}
    </span>
  );
}

function NameCellRenderer({ data }: ICellRendererParams<Employee>) {
  if (!data) return null;
  const initials = `${data.firstName[0]}${data.lastName[0]}`;
  return (
    <div className="flex items-center gap-3 py-1.5">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-violet-500 text-xs font-bold tracking-wide text-white">
        {initials}
      </div>
      <div className="flex flex-col leading-tight">
        <span className="text-sm font-semibold text-slate-900">
          {data.firstName} {data.lastName}
        </span>
        <span className="text-[0.72rem] text-slate-400">{data.email}</span>
      </div>
    </div>
  );
}

function RowActionMenu({
  data,
  onEdit,
  onDelete,
}: {
  data: Employee;
  onEdit: (e: Employee) => void;
  onDelete: (e: Employee) => void;
}) {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (!open) return;
    const close = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node) &&
        btnRef.current &&
        !btnRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [open]);

  function handleToggle() {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({
        top: rect.top - 4,
        left: rect.left + rect.width / 2,
      });
    }
    setOpen((v) => !v);
  }

  return (
    <>
      <div className="flex items-center justify-center">
        <button
          ref={btnRef}
          onClick={handleToggle}
          className="cursor-pointer rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
        >
          <svg width="18" height="18" fill="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="5" r="1.5" />
            <circle cx="12" cy="12" r="1.5" />
            <circle cx="12" cy="19" r="1.5" />
          </svg>
        </button>
      </div>

      {open &&
        createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-[9999] w-36 -translate-x-1/4 -translate-y-full animate-scale-in rounded-lg border border-slate-200 bg-white py-1 shadow-lg"
            style={{ top: pos.top, left: pos.left }}
          >
            <button
              onClick={() => {
                setOpen(false);
                onEdit(data);
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm text-slate-700 transition hover:bg-slate-50"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
              </svg>
              Edit
            </button>
            <button
              onClick={() => {
                setOpen(false);
                onDelete(data);
              }}
              className="flex w-full cursor-pointer items-center gap-2.5 px-3 py-2 text-left text-sm text-red-600 transition hover:bg-red-50"
            >
              <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                <line x1="10" y1="11" x2="10" y2="17" />
                <line x1="14" y1="11" x2="14" y2="17" />
              </svg>
              Delete
            </button>
          </div>,
          document.body
        )}
    </>
  );
}

interface EmployeeGridProps {
  data: Employee[];
  onAdd: () => void;
  onEdit: (employee: Employee) => void;
  onDelete: (employee: Employee) => void;
}

export default function EmployeeGrid({
  data,
  onAdd,
  onEdit,
  onDelete,
}: EmployeeGridProps) {
  const gridRef = useRef<AgGridReact<Employee>>(null);
  const [quickFilter, setQuickFilter] = useState("");

  const ActionsCellRenderer = useCallback(
    ({ data }: ICellRendererParams<Employee>) => {
      if (!data) return null;
      return <RowActionMenu data={data} onEdit={onEdit} onDelete={onDelete} />;
    },
    [onEdit, onDelete]
  );

  const columnDefs = useMemo<ColDef<Employee>[]>(
    () => [
      {
        headerName: "",
        field: "id",
        cellRenderer: ActionsCellRenderer,
        width: 60,
        maxWidth: 60,
        pinned: "left",
        sortable: false,
        filter: false,
        resizable: false,
        suppressHeaderMenuButton: true,
        cellStyle: { overflow: "visible" },
      },
      {
        headerName: "Employee",
        field: "firstName",
        cellRenderer: NameCellRenderer,
        minWidth: 280,
        filter: "agTextColumnFilter",
        valueGetter: (params: ValueGetterParams<Employee>) =>
          `${params.data?.firstName} ${params.data?.lastName} ${params.data?.email}`,
        autoHeight: true,
      },
      {
        headerName: "Department",
        field: "department",
        width: 140,
        filter: "agTextColumnFilter",
        cellClass: "font-medium",
      },
      {
        headerName: "Position",
        field: "position",
        minWidth: 180,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Location",
        field: "location",
        width: 130,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Salary",
        field: "salary",
        width: 130,
        filter: "agNumberColumnFilter",
        cellRenderer: SalaryCellRenderer,
        sort: "desc",
      },
      {
        headerName: "Rating",
        field: "performanceRating",
        width: 170,
        filter: "agNumberColumnFilter",
        cellRenderer: RatingCellRenderer,
      },
      {
        headerName: "Projects",
        field: "projectsCompleted",
        width: 110,
        filter: "agNumberColumnFilter",
      },
      {
        headerName: "Hire Date",
        field: "hireDate",
        width: 130,
        filter: "agDateColumnFilter",
        valueFormatter: (params: ValueFormatterParams<Employee, string>) =>
          new Date(params.value ?? "").toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
          }),
      },
      {
        headerName: "Status",
        field: "isActive",
        width: 120,
        cellRenderer: StatusCellRenderer,
        filter: "agTextColumnFilter",
      },
      {
        headerName: "Skills",
        field: "skills",
        minWidth: 260,
        cellRenderer: SkillsCellRenderer,
        valueFormatter: (params: ValueFormatterParams<Employee, string[]>) =>
          params.value?.join(", ") ?? "",
        autoHeight: true,
        sortable: false,
        filter: false,
      },
      {
        headerName: "Manager",
        field: "manager",
        width: 160,
        filter: "agTextColumnFilter",
        valueFormatter: (
          params: ValueFormatterParams<Employee, string | null>
        ) => params.value || "\u2014",
      },
    ],
    [ActionsCellRenderer]
  );

  const defaultColDef = useMemo<ColDef<Employee>>(
    () => ({
      sortable: true,
      filter: true,
      resizable: true,
    }),
    []
  );

  const onGridReady = useCallback((params: GridReadyEvent<Employee>) => {
    params.api.sizeColumnsToFit();
  }, []);

  const onExportCsv = useCallback(() => {
    gridRef.current?.api.exportDataAsCsv({
      fileName: "employees_export.csv",
    });
  }, []);

  const onResetFilters = useCallback(() => {
    gridRef.current?.api.setFilterModel(null);
    setQuickFilter("");
  }, []);

  return (
    <div className="animate-fade-in-up overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm" style={{ animationDelay: "300ms" }}>
      {/* Toolbar */}
      <div className="flex flex-col items-stretch gap-4 border-b border-slate-100 px-5 py-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-sm flex-1">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
            width="18"
            height="18"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="text"
            className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pr-3.5 pl-10 text-sm text-slate-900 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/15 placeholder:text-slate-400"
            placeholder="Search across all columns..."
            value={quickFilter}
            onChange={(e) => setQuickFilter(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            onClick={onResetFilters}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <polyline points="1 4 1 10 7 10" />
              <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
            </svg>
            Reset
          </button>
          <button
            onClick={onExportCsv}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:bg-slate-100 hover:text-slate-900"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            Export
          </button>
          <button
            onClick={onAdd}
            className="inline-flex cursor-pointer items-center gap-1.5 rounded-lg bg-indigo-500 px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-600"
          >
            <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Add Employee
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="w-full">
        <AgGridReact<Employee>
          ref={gridRef}
          rowData={data}
          columnDefs={columnDefs}
          defaultColDef={defaultColDef}
          theme={customTheme}
          quickFilterText={quickFilter}
          pagination
          paginationPageSize={10}
          paginationPageSizeSelector={[10, 20]}
          animateRows
          rowSelection={{ mode: "multiRow", enableClickSelection: false }}
          onGridReady={onGridReady}
          domLayout="autoHeight"
          getRowId={(params) => String(params.data.id)}
          rowBuffer={10}
          suppressColumnVirtualisation={false}
        />
      </div>
    </div>
  );
}
