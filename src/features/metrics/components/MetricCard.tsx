import React from 'react';
import type { Metric, MetricStatus } from '../types/metric.schema';
import { MetricSparkline } from './MetricSparkline';
import { useMetricDetailStore } from '../stores/useMetricDetailStore';
import { Activity, AlertTriangle, CheckCircle, XCircle, ChevronRight } from 'lucide-react';

interface MetricCardProps {
  metric: Metric;
}

const statusConfig: Record<MetricStatus, { border: string; text: string; bg: string; icon: React.ReactNode }> = {
  healthy: {
    border: 'border-l-emerald-500',
    text: 'text-emerald-700',
    bg: 'bg-emerald-50',
    icon: <CheckCircle className="w-4 h-4 text-emerald-600" />,
  },
  warning: {
    border: 'border-l-amber-500',
    text: 'text-amber-700',
    bg: 'bg-amber-50',
    icon: <AlertTriangle className="w-4 h-4 text-amber-600" />,
  },
  critical: {
    border: 'border-l-rose-500',
    text: 'text-rose-700',
    bg: 'bg-rose-50',
    icon: <XCircle className="w-4 h-4 text-rose-600" />,
  },
};

export const MetricCard: React.FC<MetricCardProps> = ({ metric }) => {
  const currentStatus = statusConfig[metric.status];
  const { setSelectedMetric } = useMetricDetailStore();

  return (
    <article
      data-testid="metric-card"
      onClick={() => setSelectedMetric(metric)}
      className={`group p-5 bg-white rounded-lg shadow-sm border border-gray-100 border-l-4 transition-all hover:shadow-md hover:border-gray-200 cursor-pointer ${currentStatus.border}`}
    >
      <header className="flex justify-between items-start">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Métrica</span>
          <h3 className="text-sm font-medium text-gray-700 mt-0.5 group-hover:text-indigo-600 transition-colors">
            {metric.name}
          </h3>
        </div>
        <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${currentStatus.bg} ${currentStatus.text}`}>
          {currentStatus.icon}
          <span className="capitalize">{metric.status}</span>
        </div>
      </header>

      <div className="mt-4 flex items-baseline justify-between">
        <p className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {metric.value.toLocaleString()} <span className="text-sm font-normal text-gray-500">{metric.unit}</span>
        </p>
        <Activity className="w-5 h-5 text-gray-300 group-hover:text-indigo-500 transition-colors" />
      </div>

      <MetricSparkline data={metric.history} status={metric.status} />

      <footer className="mt-4 pt-3 border-t border-gray-50 text-[11px] text-gray-400 flex items-center justify-between">
        <span>Actualizado: {new Date(metric.timestamp).toLocaleTimeString()}</span>
        <span className="flex items-center text-indigo-600 font-medium opacity-0 group-hover:opacity-100 transition-opacity">
          Ver detalle <ChevronRight className="w-3 h-3 ml-0.5" />
        </span>
      </footer>
    </article>
  );
};

export default MetricCard;