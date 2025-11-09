/**
 * Tool usage statistics component
 */

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { SessionStats } from '@claude-viz/shared';

interface ToolStatsProps {
  stats: SessionStats & { estimatedCost: number };
}

export function ToolStats({ stats }: ToolStatsProps) {
  const toolData = Object.entries(stats.toolUsageCount).map(([name, count]) => ({
    name,
    count,
  })).sort((a, b) => b.count - a.count);

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Summary cards */}
        <StatCard
          label="Total Messages"
          value={stats.totalMessages}
          icon="💬"
        />
        <StatCard
          label="Tool Uses"
          value={stats.totalToolUses}
          icon="🛠️"
        />
        <StatCard
          label="Total Tokens"
          value={stats.totalTokensInput + stats.totalTokensOutput}
          icon="🎯"
          subtext={`${stats.totalTokensInput} in / ${stats.totalTokensOutput} out`}
        />
        <StatCard
          label="Estimated Cost"
          value={`$${stats.estimatedCost.toFixed(4)}`}
          icon="💰"
        />
      </div>

      {/* Tool usage chart */}
      {toolData.length > 0 && (
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Tool Usage</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={toolData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="count" fill="#0ea5e9" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}

interface StatCardProps {
  label: string;
  value: string | number;
  icon: string;
  subtext?: string;
}

function StatCard({ label, value, icon, subtext }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex items-center justify-between mb-2">
        <div className="text-2xl">{icon}</div>
        <div className="text-3xl font-bold text-gray-900">{value}</div>
      </div>
      <div className="text-sm text-gray-600">{label}</div>
      {subtext && (
        <div className="text-xs text-gray-500 mt-1">{subtext}</div>
      )}
    </div>
  );
}
