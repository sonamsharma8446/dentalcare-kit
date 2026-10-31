import { label } from '../format.js';

// Colour is never the only signal: the status is always written out as text too.
const tones = {
  // green = good / finished
  active: 'green', approved: 'green', completed: 'green', resolved: 'green', low: 'green',
  // blue = being worked on
  ongoing: 'blue', in_progress: 'blue', under_review: 'blue', medium: 'blue',
  // amber = waiting
  pending: 'amber', open: 'amber', query: 'blue',
  // red = problem
  rejected: 'red', high: 'red', complaint: 'red',
  // grey = inactive
  inactive: 'grey', closed: 'grey', cancelled: 'grey',
};

export default function StatusBadge({ value }) {
  return <span className={`adm-badge adm-badge-${tones[value] || 'grey'}`}>{label(value)}</span>;
}

export function DemoBadge({ show }) {
  if (!show) return null;
  return (
    <span className="adm-badge adm-badge-demo" title="Sample record created by the demo seed script">
      Demo
    </span>
  );
}
