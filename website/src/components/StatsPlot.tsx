import React, { useMemo } from 'react';
import { useWindowSize } from '@uidotdev/usehooks';
import {
  BarChart,
  Bar,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { YEAR_COLORS, CHART_ASPECT_RATIO } from './Constants';

const BAR_CHART_MARGIN = { top: 5, right: 0, left: -20, bottom: 42 };
const BAR_CHART_X_PADDING = { left: 0, right: 20 };
import type { Paper } from './papers';

type StatsPlotProps = {
  suggestions?: Paper[];
  mode?: 'year' | 'venue' | 'keyword';
};

export default function StatsPlot({ suggestions = [], mode = 'keyword' }: StatsPlotProps) {
  const {
    data: venues,
    years,
    yearCount,
    keywordCount,
  } = useMemo(() => {
    const yearCount = {};
    const keywordCount = {};
    const yearsSet = new Set();
    const venueMap = {};

    suggestions.forEach((item) => {
      const venue_year = item.VENUE || '';
      if (!venue_year) return;
      const keywords = (item.KEYWORD || '')
        .split(',')
        .map((k) => k.trim())
        .filter(Boolean);

      const venue = venue_year.slice(0, -2);
      const year = '20' + venue_year.slice(-2);
      const year_original = item.DATE.slice(0, 4);

      yearsSet.add(year);

      if (!venueMap[venue]) {
        venueMap[venue] = { venue };
      }
      venueMap[venue][year] = (venueMap[venue][year] || 0) + 1;

      // year totals
      yearCount[year_original] = (yearCount[year_original] || 0) + 1;

      // keyword totals
      keywords.forEach((keyword) => {
        keywordCount[keyword] = (keywordCount[keyword] || 0) + 1;
      });
    });

    // venues (stacked by year)
    const yearsArr = [...yearsSet].sort((a, b) => Number(a) - Number(b));
    const rows = Object.values(venueMap).sort((a, b) => a.venue.localeCompare(b.venue));

    // totals per year
    const yearCountRows = Object.entries(yearCount)
      .sort((a, b) => Number(a[0]) - Number(b[0]))
      .map(([year, count]) => ({ year, count }));

    // totals per keyword (optionally limit to top N)
    const keywordCountRows = Object.entries(keywordCount)
      .sort((a, b) => b[1] - a[1])
      .map(([keyword, count]) => ({ keyword, count }));

    return {
      data: rows,
      years: yearsArr,
      yearCount: yearCountRows,
      keywordCount: keywordCountRows,
    };
  }, [suggestions]);

  const size = useWindowSize();

  if (!suggestions.length) {
    return <div></div>;
  }

  if (mode === 'venue') {
    return (
      <ResponsiveContainer width="100%" aspect={CHART_ASPECT_RATIO}>
        <BarChart data={venues} margin={BAR_CHART_MARGIN}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="venue"
            {...(size.width >= 789 ? { interval: 0 } : {})}
            angle={-45}
            textAnchor="end"
            height={60}
            padding={BAR_CHART_X_PADDING}
          />
          <YAxis />
          <Tooltip />
          {years.map((year, idx) => (
            <Bar
              key={year}
              dataKey={year}
              stackId="a"
              fill={YEAR_COLORS[idx % YEAR_COLORS.length]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (mode === 'keyword') {
    return (
      <ResponsiveContainer width="100%" aspect={CHART_ASPECT_RATIO}>
        <BarChart data={keywordCount} margin={BAR_CHART_MARGIN}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="keyword"
            {...(size.width >= 789 ? { interval: 0 } : {})}
            angle={-45}
            textAnchor="end"
            height={80} // a bit more room for longer keywords
            padding={BAR_CHART_X_PADDING}
          />
          <YAxis />
          <Tooltip itemStyle={{ color: 'black' }} />
          <Bar dataKey="count" fill={YEAR_COLORS[8]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  if (mode === 'year') {
    return (
      <ResponsiveContainer width="100%" aspect={CHART_ASPECT_RATIO}>
        <BarChart data={yearCount} margin={BAR_CHART_MARGIN}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis
            dataKey="year"
            {...(size.width >= 789 ? { interval: 0 } : {})}
            angle={-45}
            textAnchor="end"
            height={60}
            padding={BAR_CHART_X_PADDING}
          />
          <YAxis />
          <Tooltip />

          <Bar dataKey="count">
            {yearCount.map((entry, index) => (
              <Cell key={entry.year} fill={YEAR_COLORS[index % YEAR_COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    );
  }

  // fallback
  return null;
}
