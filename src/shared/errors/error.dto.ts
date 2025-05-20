export interface ClientErrorResponse {
  error: boolean;
  status: number;
  message: string;
  details?: string | null;
  id: string;
}
