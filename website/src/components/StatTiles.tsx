import React, { useMemo } from 'react';
import { Row, Col } from 'react-bootstrap';
import { papers } from './papers';
import type { Paper } from './papers';

function StatTile({ value, label }: { value: string; label: string }) {
  return (
    <div className="stat-tile">
      <div className="stat-tile-value">{value}</div>
      <div className="stat-tile-label">{label}</div>
    </div>
  );
}

export default function StatTiles({ suggestions }: { suggestions?: Paper[] }) {
  const items = suggestions ?? papers;

  const tiles = useMemo(() => {
    const total = items.length;
    const withCode = items.filter((p) => p.CODE).length;
    const venueSet = new Set(items.map((p) => (p.VENUE || '').slice(0, -2)).filter(Boolean));
    const oneYearAgo = Date.now() - 365 * 24 * 60 * 60 * 1000;
    const lastYear = items.filter((p) => new Date(p.DATE).getTime() >= oneYearAgo).length;
    return {
      total,
      withCode,
      codePct: total ? Math.round((100 * withCode) / total) : 0,
      venues: venueSet.size,
      lastYear,
    };
  }, [items]);

  return (
    <Row className="g-3 justify-content-center">
      <Col xs={6} md={3}>
        <StatTile value={String(tiles.total)} label="Papers" />
      </Col>
      <Col xs={6} md={3}>
        <StatTile value={`${tiles.codePct}%`} label={`With code (${tiles.withCode})`} />
      </Col>
      <Col xs={6} md={3}>
        <StatTile value={String(tiles.venues)} label="Venues" />
      </Col>
      <Col xs={6} md={3}>
        <StatTile value={String(tiles.lastYear)} label="Last 12 months" />
      </Col>
    </Row>
  );
}
