import { Select, SOURCE_OPTIONS } from './Form.jsx';

// Search box + dropdown filters shown above every list.
// query comes from useListQuery(). selects: [{ key, label, options, allLabel? }]
export default function ListFilters({ query, selects = [], placeholder = 'Search...' }) {
  return (
    <div className="adm-filters" role="search">
      <label className="adm-filter adm-filter-grow">
        <span>Search</span>
        <input className="adm-input" type="search" value={query.q} onChange={(event) => query.setSearch(event.target.value)} placeholder={placeholder} />
      </label>
      {selects.map((select) => (
        <label className="adm-filter" key={select.key}>
          <span>{select.label}</span>
          <Select value={query.filters[select.key]} onChange={(value) => query.setFilter(select.key, value)} options={select.options} allLabel={select.allLabel || 'All'} />
        </label>
      ))}
      <label className="adm-filter">
        <span>Show</span>
        <Select value={query.filters.source} onChange={(value) => query.setFilter('source', value)} options={SOURCE_OPTIONS} allLabel="All records" />
      </label>
      {query.isFiltered && (
        <button type="button" className="adm-btn adm-btn-ghost adm-btn-sm" onClick={query.clear}>Clear filters</button>
      )}
    </div>
  );
}
