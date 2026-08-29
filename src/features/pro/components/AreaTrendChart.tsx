import { useId, useMemo, useState } from 'react';

import styles from './AreaTrendChart.module.css';

export interface TrendPoint {
  period: string;
  value: number;
}

interface AreaTrendChartProps {
  title: string;
  points: TrendPoint[];
  color: string;
  formatValue: (value: number) => string;
  formatPeriod: (period: string) => string;
  totalLabel?: string;
}

const WIDTH = 600;
const HEIGHT = 180;
const PADDING_TOP = 12;
const PADDING_BOTTOM = 24;
const PADDING_LEFT = 4;
const PADDING_RIGHT = 4;

export function AreaTrendChart({ title, points, color, formatValue, formatPeriod, totalLabel }: AreaTrendChartProps) {
  const gradientId = useId();
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const plotWidth = WIDTH - PADDING_LEFT - PADDING_RIGHT;
  const plotHeight = HEIGHT - PADDING_TOP - PADDING_BOTTOM;

  const maxValue = useMemo(() => Math.max(1, ...points.map((p) => p.value)), [points]);
  const total = useMemo(() => points.reduce((sum, p) => sum + p.value, 0), [points]);

  const coords = useMemo(
    () =>
      points.map((p, i) => {
        const x = points.length > 1 ? PADDING_LEFT + (i / (points.length - 1)) * plotWidth : PADDING_LEFT + plotWidth / 2;
        const y = PADDING_TOP + plotHeight - (p.value / maxValue) * plotHeight;
        return { x, y, ...p };
      }),
    [points, maxValue, plotWidth, plotHeight],
  );

  if (points.length === 0 || total === 0) {
    return (
      <div className={styles.card}>
        <div className={styles.header}>
          <h3 className={styles.title}>{title}</h3>
        </div>
        <div className={styles.emptyState}>—</div>
      </div>
    );
  }

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${PADDING_TOP + plotHeight} L ${coords[0].x} ${PADDING_TOP + plotHeight} Z`;

  // N'affiche que quelques labels d'axe (premier, milieu, dernier) pour éviter la surcharge.
  const labelIndices = new Set(
    points.length <= 3 ? points.map((_, i) => i) : [0, Math.floor((points.length - 1) / 2), points.length - 1],
  );

  const hovered = hoverIndex !== null ? coords[hoverIndex] : null;

  function handlePointerMove(e: React.PointerEvent<SVGRectElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const relativeX = ((e.clientX - rect.left) / rect.width) * WIDTH;
    let nearest = 0;
    let nearestDist = Infinity;
    coords.forEach((c, i) => {
      const dist = Math.abs(c.x - relativeX);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    setHoverIndex(nearest);
  }

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <h3 className={styles.title}>{title}</h3>
        {totalLabel && <span className={styles.totalValue}>{totalLabel}</span>}
      </div>
      <div className={styles.svgWrap}>
        <svg viewBox={`0 0 ${WIDTH} ${HEIGHT}`} className={styles.svg} role="img" aria-label={title}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
          </defs>

          <line
            x1={PADDING_LEFT}
            y1={PADDING_TOP + plotHeight}
            x2={WIDTH - PADDING_RIGHT}
            y2={PADDING_TOP + plotHeight}
            className={styles.gridline}
          />

          <path d={areaPath} fill={`url(#${gradientId})`} className={styles.area} />
          <path d={linePath} stroke={color} className={styles.line} />

          {coords.map((c, i) =>
            labelIndices.has(i) ? (
              <text key={c.period} x={c.x} y={HEIGHT - 6} textAnchor="middle" className={styles.axisLabel}>
                {formatPeriod(c.period)}
              </text>
            ) : null,
          )}

          <circle
            cx={coords[coords.length - 1].x}
            cy={coords[coords.length - 1].y}
            r={5}
            fill={color}
            stroke="var(--color-bg)"
            className={styles.endDot}
          />

          {hovered && (
            <>
              <line
                x1={hovered.x}
                y1={PADDING_TOP}
                x2={hovered.x}
                y2={PADDING_TOP + plotHeight}
                className={styles.crosshair}
              />
              <circle cx={hovered.x} cy={hovered.y} r={5} fill={color} stroke="var(--color-bg)" className={styles.hoverDot} />
            </>
          )}

          <rect
            x={PADDING_LEFT}
            y={0}
            width={plotWidth}
            height={HEIGHT}
            className={styles.hitLayer}
            onPointerMove={handlePointerMove}
            onPointerLeave={() => setHoverIndex(null)}
          />
        </svg>

        {hovered && (
          <div
            className={styles.tooltip}
            style={{ left: `${(hovered.x / WIDTH) * 100}%`, top: `${(hovered.y / HEIGHT) * 100}%` }}
          >
            <span className={styles.tooltipValue}>{formatValue(hovered.value)}</span>
            <span className={styles.tooltipLabel}>{formatPeriod(hovered.period)}</span>
          </div>
        )}
      </div>
    </div>
  );
}
