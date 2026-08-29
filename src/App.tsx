import React from 'react';
import { MetricsGrid } from './features/metrics/components/MetricsGrid';
import { MetricDetailModal } from './features/metrics/components/MetricDetailModal';
import { ChaosPanel } from './features/chaos/components/ChaosPanel';
import { ToastContainer } from './features/notifications/components/ToastContainer';
import { Activity } from 'lucide-react';

export const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans p-6 sm:p-10">
      <div className="max-w-6xl mx-auto space-y-8">
        <header className="flex items-center gap-3 border-b border-gray-200 pb-5">
          <div className="p-2.5 bg-indigo-600 text-white rounded-lg shadow-sm">
            <Activity className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">
              System Performance Monitor
            </h1>
            <p className="text-xs sm:text-sm text-gray-500">
              Métricas operacionales y telemetría en tiempo real
            </p>
          </div>
        </header>

        <main>
          <MetricsGrid />
        </main>
      </div>

      <MetricDetailModal />
      <ChaosPanel />
      <ToastContainer />
    </div>
  );
};

export default App;