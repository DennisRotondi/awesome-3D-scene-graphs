import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { papers } from './papers';

// Deeper rose from YEAR_COLORS: the only palette step with >= 3:1 contrast on white.
const BAR_COLOR = '#A27E6F';
const INK = '#3b4248';

export default function GrowthChart() {
  const yearCount = useMemo(() => {
    const counts: Record<string, number> = {};
    papers.forEach((paper) => {
      const year = (paper.DATE || '').slice(0, 4);
      if (!year) return;
      counts[year] = (counts[year] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([year, count]) => ({ year, count }));
  }, []);

  if (!yearCount.length) return null;

  return (
    <ResponsiveContainer width="100%" height={220}>
      <BarChart data={yearCount} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(59,66,72,0.15)" />
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={{ stroke: 'rgba(59,66,72,0.25)' }}
          tick={{ fill: INK, fontSize: 12 }}
        />
        <YAxis
          allowDecimals={false}
          tickLine={false}
          axisLine={false}
          tick={{ fill: INK, fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: 'rgba(156, 175, 170, 0.15)' }}
          contentStyle={{ fontFamily: "'Ubuntu Sans', sans-serif", color: INK }}
          itemStyle={{ color: INK }}
        />
        <Bar
          dataKey="count"
          name="Papers"
          fill={BAR_COLOR}
          radius={[4, 4, 0, 0]}
          maxBarSize={38}
          animationDuration={1200}
        />
      </BarChart>
    </ResponsiveContainer>
  );
}
