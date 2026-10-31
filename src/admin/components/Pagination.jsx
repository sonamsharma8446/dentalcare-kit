export default function Pagination({ pagination, onPage }) {
  if (!pagination || pagination.total === 0) return null;
  const { page, pages, total, limit } = pagination;
  const first = (page - 1) * limit + 1;
  const last = Math.min(page * limit, total);

  return (
    <nav className="adm-pagination" aria-label="Pagination">
      <p>Showing {first}-{last} of {total}</p>
      <div>
        <button type="button" className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => onPage(page - 1)} disabled={page <= 1}>
          Previous
        </button>
        <span aria-current="page">Page {page} of {pages}</span>
        <button type="button" className="adm-btn adm-btn-secondary adm-btn-sm" onClick={() => onPage(page + 1)} disabled={page >= pages}>
          Next
        </button>
      </div>
    </nav>
  );
}
