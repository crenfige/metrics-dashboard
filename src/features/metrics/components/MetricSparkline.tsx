import React from 'react';
import { ResponsiveContainer, LineChart, Line, YAxis } from 'recharts';
import type { MetricHistoryPoint, MetricStatus } from '../types/metric.schema';

interface MetricSparklineProps {
  data: MetricHistoryPoint[];
  status: MetricStatus;
}

const strokeColors: Record<MetricStatus, string> = {
  healthy: '#10b981',
  warning: '#f59e0b',
  critical: '#f43f5e',
};

export const MetricSparkline: React.FC<MetricSparklineProps> = ({ data, status }) => {
  return (
    <div className="h-12 w-full mt-2">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <YAxis domain={['dataMin - 5', 'dataMax + 5']} hide />
          <Line
            type="monotone"
            dataKey="value"
            stroke={strokeColors[status]}
            strokeWidth={2}
            dot={false}
            isAnimationActive={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};