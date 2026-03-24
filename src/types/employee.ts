export interface Employee {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  department: Department;
  position: string;
  salary: number;
  hireDate: string;
  age: number;
  location: string;
  performanceRating: number;
  projectsCompleted: number;
  isActive: boolean;
  skills: string[];
  manager: string | null;
}

export type Department =
  | "Engineering"
  | "Marketing"
  | "Sales"
  | "HR"
  | "Finance";
