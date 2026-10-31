// A table with loading, error and empty states built in.
// columns: [{ header, render(row), className? }]
export default function DataTable({ caption, columns, rows, loading, error, onRetry, emptyMessage = 'Nothing to show yet.' }) {
  const hasRows = rows.length > 0;

  if (error && !hasRows) {
    return (
      <div className="adm-state adm-state-error" role="alert">
        <p><strong>Could not load the data.</strong></p>
        <p>{error}</p>
        <button type="button" className="adm-btn adm-btn-secondary adm-btn-sm" onClick={onRetry}>Try again</button>
      </div>
    );
  }

  if (loading && !hasRows) {
    return (
      <div className="adm-state" aria-busy="true" role="status">
        <div className="adm-skeleton" /><div className="adm-skeleton" /><div className="adm-skeleton" />
        <span className="adm-sr-only">Loading...</span>
      </div>
    );
  }

  if (!hasRows) {
    return <div className="adm-state"><p>{emptyMessage}</p></div>;
  }

  return (
    <div className={'adm-table-wrap' + (loading ? ' is-loading' : '')} role="region" aria-label={caption} tabIndex={0} aria-busy={loading}>
      {error && <p className="adm-alert adm-alert-error" role="alert">{error}</p>}
      <table className="adm-table">
        <caption className="adm-sr-only">{caption}</caption>
        <thead>
          <tr>
            {columns.map((column) => (
              <th key={column.header} scope="col" className={column.className}>{column.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row._id}>
              {columns.map((column) => (
                <td key={column.header} className={column.className} data-label={column.header}>{column.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
