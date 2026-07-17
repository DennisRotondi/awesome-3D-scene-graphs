import React, { useMemo } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { papers } from './papers';
import type { Paper } from './papers';

const INK = '#3b4248';
const TOP_KEYWORDS = 6;
// Years with fewer papers than this are dropped: percentage shares over a
// handful of papers are all noise. Relaxed for small filtered sets, where a
// hard floor of 5 would drop every year and blank the chart.
const MIN_PAPERS_PER_YEAR = 5;

// The most hue-distinct steps of YEAR_COLORS, assigned in fixed order.
const TREND_COLORS = ['#A27E6F', '#8CA6A6', '#CDB4DB', '#BFA780', '#B7C4A1', '#D6A99D'];

type YearRow = { year: string } & Record<string, number | string>;

export default function KeywordTrends({ suggestions }: { suggestions?: Paper[] }) {
  const items = suggestions ?? papers;

  const { rows, topKeywords } = useMemo(() => {
    const keywordTotal: Record<string, number> = {};
    const perYear: Record<string, { total: number; counts: Record<string, number> }> = {};

    items.forEach((p) => {
      const year = (p.DATE || '').slice(0, 4);
      if (!year) return;
      if (!perYear[year]) perYear[year] = { total: 0, counts: {} };
      perYear[year].total += 1;

      (p.KEYWORD || '')
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean)
        .forEach((k) => {
          keywordTotal[k] = (keywordTotal[k] || 0) + 1;
          perYear[year].counts[k] = (perYear[year].counts[k] || 0) + 1;
        });
    });

    const topKeywords = Object.entries(keywordTotal)
      .sort((a, b) => b[1] - a[1])
      .slice(0, TOP_KEYWORDS)
      .map(([k]) => k);

    const minPerYear = Math.min(MIN_PAPERS_PER_YEAR, Math.max(1, Math.round(items.length / 20)));
    const rows: YearRow[] = Object.entries(perYear)
      .filter(([, { total }]) => total >= minPerYear)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([year, { total, counts }]) => {
        const row: YearRow = { year };
        topKeywords.forEach((k) => {
          row[k] = Math.round((100 * (counts[k] || 0)) / total);
        });
        return row;
      });

    return { rows, topKeywords };
  }, [items]);

  if (!rows.length) {
    return (
      <div className="text-font-small py-5 text-center" style={{ color: '#6b7280' }}>
        Not enough papers match the current filters to show keyword trends.
      </div>
    );
  }

  // Direct label on the last point only, so each line is identifiable
  // without the legend (the palette alone is not CVD-safe). With few years —
  // typical for filtered sets — the endpoints coincide and the labels smear
  // over each other, so fall back to legend + tooltip only.
  const showEndLabels = rows.length >= 4;
  const endLabel =
    (keyword: string) =>
    ({ x, y, index }: { x?: number; y?: number; index?: number }) => {
      if (!showEndLabels || index !== rows.length - 1 || x == null || y == null) return null;
      return (
        <text x={x + 8} y={y + 4} fill={INK} fontSize={12}>
          {keyword}
        </text>
      );
    };

  return (
    <ResponsiveContainer width="100%" height={320}>
      <LineChart data={rows} margin={{ top: 8, right: 110, left: -16, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(59,66,72,0.15)" />
        <XAxis
          dataKey="year"
          tickLine={false}
          axisLine={{ stroke: 'rgba(59,66,72,0.25)' }}
          tick={{ fill: INK, fontSize: 12 }}
        />
        <YAxis unit="%" tickLine={false} axisLine={false} tick={{ fill: INK, fontSize: 12 }} />
        <Tooltip
          formatter={(value: number) => `${value}%`}
          contentStyle={{ fontFamily: "'Ubuntu Sans', sans-serif", color: INK }}
          itemStyle={{ color: INK }}
        />
        <Legend
          wrapperStyle={{ fontSize: 13 }}
          formatter={(value) => <span style={{ color: INK }}>{value}</span>}
        />
        {topKeywords.map((keyword, idx) => (
          <Line
            key={keyword}
            dataKey={keyword}
            stroke={TREND_COLORS[idx % TREND_COLORS.length]}
            strokeWidth={2}
            dot={{ r: 3, strokeWidth: 0, fill: TREND_COLORS[idx % TREND_COLORS.length] }}
            activeDot={{ r: 5 }}
            label={endLabel(keyword)}
            isAnimationActive={false}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}
