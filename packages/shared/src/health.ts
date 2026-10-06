/** Ответ GET /api/health. */
export interface HealthStatus {
  status: 'ok' | 'error';
  database: 'up' | 'down';
  timestamp: string;
}
