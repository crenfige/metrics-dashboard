import { useQuery } from '@tanstack/react-query';
import { apiClient, ApiError } from '@/lib/apiClient';
import { MetricsListResponseSchema, type Metric } from '../types/metric.schema';

export const METRICS_QUERY_KEY = ['metrics'] as const;

async function fetchMetrics(): Promise<Metric[]> {
  const rawData = await apiClient<unknown>('/api/v1/metrics');
  
  // Validación estricta en runtime
  const parseResult = MetricsListResponseSchema.safeParse(rawData);
  
  if (!parseResult.success) {
    console.error('Error de validación en esquema de métricas:', parseResult.error.format());
    throw new ApiError(422, 'Formato de respuesta de métricas no válido', parseResult.error.issues);
  }

  return parseResult.data;
}

export function useMetrics() {
  return useQuery({
    queryKey: METRICS_QUERY_KEY,
    queryFn: fetchMetrics,
    refetchInterval: 5000, // Polling cada 5s para simular flujo en vivo
    refetchIntervalInBackground: false, // Pausa polling si la pestaña no está visible (ahorro de recursos)
  });
}