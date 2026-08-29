import React, { useState } from 'react';
import { useMetricsFilterStore } from '../stores/useMetricsFilterStore';
import { useMetrics } from '../api/useMetrics';
import { exportToCSV, exportToJSON } from '../utils/exportMetrics';
import type { MetricStatus } from '../types/metric.schema';
import { Search, X, Download, FileSpreadsheet, FileJson } from 'lucide-react';

const statusOptions: Array<{ label: string; value: MetricStatus | 'all' }> = [
  { label: 'Todos', value: 'all' },
  { label: 'Healthy', value: 'healthy' },
  { label: 'Warning', value: 'warning' },
  { label: 'Critical', value: 'critical' },
];

export const MetricsFilters: React.FC = () => {
  const { searchQuery, selectedStatus, setSearchQuery, setSelectedStatus, resetFilters } =
    useMetricsFilterStore();
  const { data: metrics } = useMetrics();
  const [showExportMenu, setShowExportMenu] = useState(false);

  const hasActiveFilters = searchQuery !== '' || selectedStatus !== 'all';

  const handleExport = (type: 'csv' | 'json') => {
    if (!metrics || metrics.length === 0) return;
    if (type === 'csv') exportToCSV(metrics);
    else exportToJSON(metrics);
    setShowExportMenu(false);
  };

  return (
    <div className="flex flex-col lg:flex-row gap-3 items-center justify-between bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
      {/* Input de búsqueda */}
      <div className="relative w-full lg:w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Buscar métrica por nombre..."
          className="w-full pl-9 pr-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition"
        />
      </div>

      {/* Filtros de estado + Botón exportar */}
      <div className="flex flex-wrap items-center gap-2 w-full lg:w-auto justify-between lg:justify-end">
        <div className="flex bg-gray-100 p-1 rounded-lg">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setSelectedStatus(opt.value)}
              className={`px-3 py-1 text-xs font-medium rounded-md transition cursor-pointer ${
                selectedStatus === opt.value
                  ? 'bg-white text-gray-900 shadow-sm'
                  : 'text-gray-500 hover:text-gray-900'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-medium px-2 py-1 transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> Limpiar
          </button>
        )}

        {/* Dropdown de Exportación */}
        <div className="relative">
          <button
            onClick={() => setShowExportMenu(!showExportMenu)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-700 text-xs font-medium rounded-lg transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5 text-gray-500" />
            Exportar
          </button>

          {showExportMenu && (
            <div className="absolute right-0 mt-2 w-36 bg-white rounded-lg shadow-xl border border-gray-100 py-1 z-30 animate-fade-in">
              <button
                onClick={() => handleExport('csv')}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                Descargar CSV
              </button>
              <button
                onClick={() => handleExport('json')}
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-gray-700 hover:bg-gray-50 transition"
              >
                <FileJson className="w-4 h-4 text-indigo-600" />
                Descargar JSON
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};