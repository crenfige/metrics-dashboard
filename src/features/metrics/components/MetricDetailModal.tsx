import React, { useEffect, useMemo } from 'react';
import { useMetricDetailStore } from '../stores/useMetricDetailStore';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';
import { X, TrendingUp, TrendingDown, Gauge, Clock } from 'lucide-react';
import type { MetricStatus } from '../types/metric.schema';

const statusColorConfig: Record<MetricStatus, { stroke: string; fill: string; badge: string; text: string }> = {
  healthy: {
    stroke: '#10b981',
    fill: '#10b981',
    badge: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    text: 'text-emerald-600',
  },
  warning: {
    stroke: '#f59e0b',
    fill: '#f59e0b',
    badge: 'bg-amber-50 text-amber-700 border-amber-200',
    text: 'text-amber-600',
  },
  critical: {
    stroke: '#f43f5e',
    fill: '#f43f5e',
    badge: 'bg-rose-50 text-rose-700 border-rose-200',
    text: 'text-rose-600',
  },
};

export const MetricDetailModal: React.FC = () => {
  const { selectedMetric, closeModal } = useMetricDetailStore();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal();
    };
    if (selectedMetric) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedMetric, closeModal]);

  const stats = useMemo(() => {
    if (!selectedMetric || selectedMetric.history.length === 0) {
      return { min: 0, max: 0, avg: 0 };
    }
    const values = selectedMetric.history.map((h) => h.value);
    const min = Math.min(...values);
    const max = Math.max(...values);
    const avg = values.reduce((acc, curr) => acc + curr, 0) / values.length;
    return { min, max, avg: Number(avg.toFixed(1)) };
  }, [selectedMetric]);

  if (!selectedMetric) return null;

  const colors = statusColorConfig[selectedMetric.status];

  const formattedChartData = selectedMetric.history.map((point) => ({
    time: new Date(point.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
    value: point.value,
  }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/50 backdrop-blur-xs animate-fade-in">
      {/* Backdrop click to close */}
      <div className="absolute inset-0" onClick={closeModal} />

      <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-100 w-full max-w-2xl overflow-hidden z-10 transition-all">
        {/* Header */}
        <header className="flex items-center justify-between p-6 border-b border-gray-100 bg-gray-50/50">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">Telemetría Detallada</span>
            <div className="flex items-center gap-3 mt-1">
              <h2 className="text-xl font-bold text-gray-900">{selectedMetric.name}</h2>
              <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase border ${colors.badge}`}>
                {selectedMetric.status}
              </span>
            </div>
          </div>
          <button
            onClick={closeModal}
            className="p-2 text-gray-400 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Métricas Agregadas / KPI Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <TrendingDown className="w-3.5 h-3.5 text-emerald-500" />
                <span>Mínimo</span>
              </div>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {stats.min.toLocaleString()} <span className="text-xs font-normal text-gray-500">{selectedMetric.unit}</span>
              </p>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <Gauge className="w-3.5 h-3.5 text-indigo-500" />
                <span>Promedio</span>
              </div>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {stats.avg.toLocaleString()} <span className="text-xs font-normal text-gray-500">{selectedMetric.unit}</span>
              </p>
            </div>

            <div className="bg-gray-50 p-3.5 rounded-xl border border-gray-100">
              <div className="flex items-center gap-1.5 text-xs text-gray-500 font-medium">
                <TrendingUp className="w-3.5 h-3.5 text-rose-500" />
                <span>Máximo</span>
              </div>
              <p className="text-lg font-bold text-gray-900 mt-1">
                {stats.max.toLocaleString()} <span className="text-xs font-normal text-gray-500">{selectedMetric.unit}</span>
              </p>
            </div>
          </div>

          {/* Gráfico de Área Ampliado */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-3">Historial de Rendimiento</h3>
            <div className="h-56 w-full bg-gray-50/50 p-3 rounded-xl border border-gray-100">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={formattedChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id={`gradient-${selectedMetric.id}`} x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={colors.fill} stopOpacity={0.3} />
                      <stop offset="95%" stopColor={colors.fill} stopOpacity={0.0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                  <XAxis dataKey="time" tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                  <YAxis domain={['auto', 'auto']} tick={{ fontSize: 11, fill: '#6b7280' }} tickLine={false} axisLine={false} />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#ffffff', borderRadius: '8px', border: '1px solid #e5e7eb', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                    formatter={(value: number | string | undefined) => [`${value ?? 0} ${selectedMetric.unit}`, 'Valor']}
                    labelStyle={{ color: '#6b7280', fontSize: '11px', fontWeight: 600 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="value"
                    stroke={colors.stroke}
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill={`url(#gradient-${selectedMetric.id})`}
                    isAnimationActive={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="flex items-center justify-between px-6 py-4 bg-gray-50 border-t border-gray-100 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-gray-400" />
            <span>Última muestra: {new Date(selectedMetric.timestamp).toLocaleTimeString()}</span>
          </div>
          <button
            onClick={closeModal}
            className="px-4 py-2 bg-gray-900 hover:bg-gray-800 text-white font-medium rounded-lg transition"
          >
            Cerrar
          </button>
        </footer>
      </div>
    </div>
  );
};