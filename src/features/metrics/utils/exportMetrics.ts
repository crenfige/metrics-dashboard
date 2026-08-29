import type { Metric } from '../types/metric.schema';

export const exportToJSON = (metrics: Metric[]) => {
  const dataStr = JSON.stringify(metrics, null, 2);
  const blob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `metrics-snapshot-${Date.now()}.json`;
  link.click();
  URL.revokeObjectURL(url);
};

export const exportToCSV = (metrics: Metric[]) => {
  const headers = ['ID', 'Nombre', 'Valor', 'Unidad', 'Estado', 'Timestamp'];
  const rows = metrics.map((m) => [
    m.id,
    `"${m.name}"`,
    m.value,
    `"${m.unit}"`,
    m.status,
    `"${m.timestamp}"`,
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `metrics-snapshot-${Date.now()}.csv`;
  link.click();
  URL.revokeObjectURL(url);
};