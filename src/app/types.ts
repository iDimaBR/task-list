export interface Task {
  id: number;
  text: string;
  done: boolean;
}
  
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export interface ApiResponse<T = any> {
  status: "success" | "error";
  message: string;
  data?: T;
}