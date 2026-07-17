import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { papers } from './papers';
import type { Paper } from './papers';

const BAR_COLOR = '#A27E6F';
const INK = '#3b4248';
const TOP_INSTITUTES = 10;

export default function InstituteChart({ suggestions }: { suggestions?: Paper[] }) {
  const items = suggestions ?? papers;

  const institutes = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach((p) => {
      const inst = (p.FIRSTINSTITUTE || '').trim();
      if (!inst) return;
      counts[inst] = (counts[inst] || 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_INSTITUTES)
      .map(([institute, count]) => ({ institute, count }));
  }, [items]);

  if (!institutes.length) return null;

  return (
    <ResponsiveContainer width="100%" height={institutes.length * 34 + 40}>
      <BarChart
        data={institutes}
        layout="vertical"
        margin={{ top: 8, right: 24, left: 16, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="rgba(59,66,72,0.15)" />
        <XAxis
          type="number"
          allowDecimals={false}
          tickLine={false}
          axisLine={{ stroke: 'rgba(59,66,72,0.25)' }}
          tick={{ fill: INK, fontSize: 12 }}
        />
        <YAxis
          type="category"
          dataKey="institute"
          width={110}
          tickLine={false}
          axisLine={false}
          tick={{ fill: INK, fontSize: 12 }}
        />
        <Tooltip
          cursor={{ fill: 'rgba(156, 175, 170, 0.15)' }}
          contentStyle={{ fontFamily: "'Ubuntu Sans', sans-serif", color: INK }}
          itemStyle={{ color: INK }}
        />
        <Bar dataKey="count" name="Papers" fill={BAR_COLOR} radius={[0, 4, 4, 0]} maxBarSize={22} />
      </BarChart>
    </ResponsiveContainer>
  );
}
