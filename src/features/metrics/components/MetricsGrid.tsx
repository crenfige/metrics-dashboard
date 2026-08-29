import React, { useMemo, useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useMetrics, METRICS_QUERY_KEY } from '../api/useMetrics';
import { useMetricsFilterStore } from '../stores/useMetricsFilterStore';
import { useToastStore } from '@/features/notifications/stores/useToastStore';
import { MetricCard } from './MetricCard';
import { MetricsFilters } from './MetricsFilters';
import { Skeleton } from '@/components/ui/Skeleton';
import { RefreshCcw, AlertOctagon } from 'lucide-react';

export const MetricsGrid: React.FC = () => {
  const queryClient = useQueryClient();
  const { data: metrics, isLoading, isError, error, isFetching } = useMetrics();
  const { searchQuery, selectedStatus } = useMetricsFilterStore();
  const { addToast } = useToastStore();
  const notifiedCriticalIds = useRef<Set<string>>(new Set());

  // Detectar métricas críticas en cada ciclo de polling
  useEffect(() => {
    if (!metrics) return;
    metrics.forEach((m) => {
      if (m.status === 'critical' && !notifiedCriticalIds.current.has(m.id)) {
        notifiedCriticalIds.current.add(m.id);
        addToast({
          title: `Alerta Crítica: ${m.name}`,
          description: `Valor actual alcanzó ${m.value} ${m.unit}. Se requiere atención.`,
          type: 'critical',
        });
      }
    });
  }, [metrics, addToast]);

  const handleRetry = () => {
    void queryClient.resetQueries({ queryKey: METRICS_QUERY_KEY });
  };

  const filteredMetrics = useMemo(() => {
    if (!metrics) return [];
    return metrics.filter((m) => {
      const matchesQuery = m.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || m.status === selectedStatus;
      return matchesQuery && matchesStatus;
    });
  }, [metrics, searchQuery, selectedStatus]);

  if (isLoading || (isFetching && !metrics)) {
    return (
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" data-testid="metrics-loading">
        {[1, 2, 3, 4, 5, 6].map((idx) => (
          <div key={idx} className="p-5 bg-white rounded-lg border border-gray-100 shadow-sm space-y-3">
            <Skeleton className="h-4 w-1/3" />
            <Skeleton className="h-8 w-2/3" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        ))}
      </section>
    );
  }

  if (isError) {
    return (
      <div className="p-8 bg-rose-50 border border-rose-200 rounded-xl text-center space-y-4" data-testid="metrics-error">
        <AlertOctagon className="w-12 h-12 text-rose-500 mx-auto" />
        <div>
          <h3 className="text-base font-semibold text-rose-900">Error al cargar las métricas</h3>
          <p className="text-sm text-rose-600 mt-1">{error instanceof Error ? error.message : 'Error desconocido'}</p>
        </div>
        <button
          onClick={handleRetry}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-rose-600 hover:bg-rose-700 active:scale-95 text-white text-sm font-medium rounded-lg shadow-sm transition cursor-pointer"
        >
          <RefreshCcw className={`w-4 h-4 ${isFetching ? 'animate-spin' : ''}`} />
          {isFetching ? 'Reintentando...' : 'Reintentar conexión'}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <MetricsFilters />

      <div className="flex justify-between items-center text-xs text-gray-500">
        <span>Mostrando {filteredMetrics.length} de {metrics?.length ?? 0} métricas</span>
        {isFetching && (
          <span className="flex items-center gap-1.5 text-indigo-600 font-medium">
            <RefreshCcw className="w-3.5 h-3.5 animate-spin" /> Actualizando en vivo...
          </span>
        )}
      </div>

      {filteredMetrics.length === 0 ? (
        <div className="p-8 bg-white border border-gray-100 rounded-lg text-center text-gray-500 shadow-sm">
          No se encontraron métricas con los filtros seleccionados.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredMetrics.map((metric) => (
            <MetricCard key={metric.id} metric={metric} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MetricsGrid;