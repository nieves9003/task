import { Person } from "./person";

export interface Task {
  id: number;
  name: string;
  deadline: string;
  completed: boolean;
  persons: Person[];
}
