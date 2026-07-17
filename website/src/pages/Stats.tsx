import React, { useMemo, useState } from 'react';
import { Container, Button, ButtonGroup } from 'react-bootstrap';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

import { papers } from '../components/papers';
import GrowthChart from '../components/GrowthChart';
import StatsPlot from '../components/StatsPlot';
import StatTiles from '../components/StatTiles';
import KeywordTrends from '../components/KeywordTrends';
import PaperGraph from '../components/PaperGraph';
import { formatDate } from '../components/Constants';

// Single-series charts use the deeper rose: the only palette step with >= 3:1
// contrast on white (same choice as GrowthChart).
const BAR_COLOR = '#A27E6F';
const INK = '#3b4248';

function SectionTitle({ children }: { children: React.ReactNode }) {
  return <h2 className="growth-title mt-5 mb-3">{children}</h2>;
}

export default function Stats() {
  const { cumulative, yearTicks } = useMemo(() => {
    // papers[] is already sorted oldest-first, so index+1 is the running total
    const cumulative = papers.map((p, i) => ({
      x: new Date(p.DATE).getTime(),
      count: i + 1,
    }));

    // One tick per year (Jan 1), else the time axis emits a tick per data point
    const yearTicks: number[] = [];
    if (cumulative.length) {
      const firstYear = new Date(cumulative[0].x).getFullYear();
      const lastYear = new Date(cumulative[cumulative.length - 1].x).getFullYear();
      for (let y = firstYear; y <= lastYear; y++) {
        yearTicks.push(new Date(y, 0, 1).getTime());
      }
    }

    return { cumulative, yearTicks };
  }, []);

  const [statsMode, setStatsMode] = useState<'year' | 'venue' | 'keyword'>('keyword');

  return (
    <Container className="mt-3 text-font-base">
      <h1 className="stats-page-title text-center mb-4">Statistics</h1>

      <StatTiles />

      {/* Papers per year */}
      <SectionTitle>Papers per year</SectionTitle>
      <GrowthChart />

      {/* Cumulative growth */}
      <SectionTitle>Cumulative growth</SectionTitle>
      <ResponsiveContainer width="100%" height={260}>
        <AreaChart data={cumulative} margin={{ top: 8, right: 8, left: -24, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(59,66,72,0.15)" />
          <XAxis
            dataKey="x"
            type="number"
            scale="time"
            domain={['dataMin', 'dataMax']}
            ticks={yearTicks}
            tickFormatter={(v) => String(new Date(v).getFullYear())}
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
            labelFormatter={(v) => formatDate(new Date(v as number).toISOString())}
            contentStyle={{ fontFamily: "'Ubuntu Sans', sans-serif", color: INK }}
            itemStyle={{ color: INK }}
          />
          <Area
            dataKey="count"
            name="Papers"
            type="stepAfter"
            stroke={BAR_COLOR}
            strokeWidth={2}
            fill={BAR_COLOR}
            fillOpacity={0.18}
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>

      {/* Breakdown by keyword / venue / year */}
      <div className="d-flex flex-wrap align-items-center justify-content-between gap-2 mt-5 mb-3">
        <h2 className="growth-title m-0">Breakdown</h2>
        <ButtonGroup size="sm">
          <Button
            variant={statsMode === 'keyword' ? 'outline-secondary' : 'outline-primary'}
            onClick={() => setStatsMode('keyword')}
          >
            Keyword
          </Button>
          <Button
            variant={statsMode === 'venue' ? 'outline-secondary' : 'outline-primary'}
            onClick={() => setStatsMode('venue')}
          >
            Venue
          </Button>
          <Button
            variant={statsMode === 'year' ? 'outline-secondary' : 'outline-primary'}
            onClick={() => setStatsMode('year')}
          >
            Year
          </Button>
        </ButtonGroup>
      </div>
      <StatsPlot suggestions={papers} mode={statsMode} />

      {/* Keyword share over time */}
      <SectionTitle>Keyword trends</SectionTitle>
      <KeywordTrends />

      {/* Connected papers */}
      <SectionTitle>Connected papers</SectionTitle>
      <PaperGraph />
      <div className="mb-5" />
    </Container>
  );
}
