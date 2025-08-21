export interface Task {
    id: number;
    text: string;
    done: boolean;
  }
  
  export interface ApiResponse<T = any> {
    status: "success" | "error";
    message: string;
    data?: T;
  }