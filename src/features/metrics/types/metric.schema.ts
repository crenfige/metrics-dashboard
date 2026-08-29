import { z } from 'zod';

export const MetricHistoryPointSchema = z.object({
  timestamp: z.string(),
  value: z.number(),
});

export const MetricStatusSchema = z.enum(['healthy', 'warning', 'critical']);

export const MetricSchema = z.object({
  id: z.string(),
  name: z.string(),
  value: z.number(),
  unit: z.string(),
  status: MetricStatusSchema,
  timestamp: z.string(),
  history: z.array(MetricHistoryPointSchema),
});

export const MetricsListResponseSchema = z.array(MetricSchema);

export type MetricStatus = z.infer<typeof MetricStatusSchema>;
export type Metric = z.infer<typeof MetricSchema>;
export type MetricHistoryPoint = z.infer<typeof MetricHistoryPointSchema>;