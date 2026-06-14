// Color palette for timeline scatter plot
export const YEAR_COLORS = [
  '#D6A99D', // warm clay
  '#CDB4DB', // soft lilac
  '#D6DAC8', // sage
  '#A27E6F', // deeper rose
  '#BFA780', // muted ochre
  '#B7C4A1', // olive sage
  '#8CA6A6', // muted teal
  '#CCAFA5', // dusty mauve
  '#C4CFD0', // cool gray-blue
  '#A4B8B5', // aqua-gray
];

// Time constants
export const ONE_DAY_MS = 1000 * 60 * 60 * 24;
export const FIVE_YEARS_DAYS = 365 * 5;
export const THREE_YEARS_DAYS = 365 * 3;

// Zoom behaviour
export const ZOOM_WHEEL_FACTOR = 0.15;

// Chart aspect ratio (golden ratio) — used by ResponsiveContainer in StatsPlot and Timeline
export const CHART_ASPECT_RATIO = 1.618;

// Duration for clipboard toast notifications (ms)
export const TOAST_DURATION_MS = 1500;

// Consistent date display: "19 November 2025"
export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
