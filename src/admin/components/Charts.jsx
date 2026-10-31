import { formatDate, label } from '../format.js';

// Small charts drawn with plain SVG/HTML (no chart library).
const SERIES = [
  { key: 'orders', name: 'Orders', color: '#2563eb' },
  { key: 'enquiries', name: 'Enquiries', color: '#0d9488' },
  { key: 'tickets', name: 'Support tickets', color: '#d97706' },
];

function niceMax(value) {
  if (value <= 4) return 4;
  const step = Math.pow(10, Math.floor(Math.log10(value)));
  return Math.ceil(value / step) * step;
}

// Stacked columns: one column per day, split into orders / enquiries / tickets.
export function DailyChart({ days }) {
  const width = 640, height = 230, left = 34, bottom = 28, top = 10;
  const innerW = width - left - 8, innerH = height - top - bottom;
  const max = niceMax(Math.max(0, ...days.map((day) => day.orders + day.enquiries + day.tickets)));
  const slot = innerW / Math.max(days.length, 1);
  const barW = Math.max(2, slot * 0.7);
  const every = Math.ceil(days.length / 8); // label about 8 dates

  return (
    <>
      <ul className="adm-chart-legend">
        {SERIES.map((series) => (
          <li key={series.key}><span className="adm-dot" style={{ background: series.color }} />{series.name}</li>
        ))}
      </ul>
      <svg className="adm-chart-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label="Orders, enquiries and support tickets created per day. The same numbers are in the table below the chart.">
        {[0, 0.5, 1].map((fraction) => {
          const y = top + innerH - fraction * innerH;
          return (
            <g key={fraction}>
              <line x1={left} x2={width - 8} y1={y} y2={y} stroke="#e2e8f0" />
              <text x={left - 6} y={y + 4} textAnchor="end">{Math.round(max * fraction)}</text>
            </g>
          );
        })}
        {days.map((day, index) => {
          const x = left + index * slot + (slot - barW) / 2;
          let y = top + innerH;
          return (
            <g key={day.date}>
              <title>{`${formatDate(day.date)}: ${day.orders} orders, ${day.enquiries} enquiries, ${day.tickets} tickets`}</title>
              {SERIES.map((series) => {
                const h = (day[series.key] / max) * innerH;
                y -= h;
                return h > 0 ? <rect key={series.key} x={x} y={y} width={barW} height={h} fill={series.color} /> : null;
              })}
              {index % every === 0 && <text x={x + barW / 2} y={height - 8} textAnchor="middle">{formatDate(day.date).slice(0, 6)}</text>}
            </g>
          );
        })}
      </svg>
      <details className="adm-details">
        <summary>Show the numbers as a table</summary>
        <div className="adm-table-wrap" role="region" aria-label="Daily numbers" tabIndex={0}>
          <table className="adm-table adm-table-compact">
            <thead><tr><th scope="col">Date</th><th scope="col">Orders</th><th scope="col">Enquiries</th><th scope="col">Tickets</th></tr></thead>
            <tbody>
              {days.map((day) => (
                <tr key={day.date}><th scope="row">{formatDate(day.date)}</th><td>{day.orders}</td><td>{day.enquiries}</td><td>{day.tickets}</td></tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </>
  );
}

// Horizontal bars: items = [{ name, count }]
export function BarList({ items, color }) {
  const max = Math.max(1, ...items.map((item) => item.count));
  return (
    <ul className="adm-bars">
      {items.map((item) => (
        <li className="adm-bar-row" key={item.name}>
          <span>{label(item.name)}</span>
          <span className="adm-bar-track" aria-hidden="true"><span className="adm-bar-fill" style={{ width: `${(item.count / max) * 100}%`, ...(color ? { background: color } : {}) }} /></span>
          <span className="adm-bar-value">{item.count}</span>
        </li>
      ))}
    </ul>
  );
}
