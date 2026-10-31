import { useEffect, useState } from 'react';
import { api } from './api.js';

// Loads data from the API and reloads when the path or params change.
// Returns { data, loading, error, reload }. Old data stays visible while new data loads.
export function useFetch(path, params) {
  const [version, setVersion] = useState(0);
  const [result, setResult] = useState({ key: '', data: null, error: '' });
  const paramsKey = JSON.stringify(params || {});
  const requestKey = `${path}|${paramsKey}|${version}`;

  useEffect(() => {
    const controller = new AbortController();
    api(path, { params: JSON.parse(paramsKey), signal: controller.signal })
      .then((data) => setResult({ key: requestKey, data, error: '' }))
      .catch((error) => {
        if (error.name === 'AbortError') return;
        setResult((previous) => ({ key: requestKey, data: previous.data, error: error.message }));
      });
    return () => controller.abort();
  }, [path, paramsKey, requestKey]);

  const finished = result.key === requestKey; // false while the newest request is still running
  return {
    data: result.data,
    loading: !finished,
    error: finished ? result.error : '',
    reload: () => setVersion((number) => number + 1),
  };
}

// Returns the value only after it stopped changing for a moment (used for search boxes).
export function useDebounced(value, delay = 350) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);
  return debounced;
}

// Keeps the search text, dropdown filters and page number of a list page.
// filterKeys: e.g. ['status'] ("source" is always added). Use `params` to call useFetch.
export function useListQuery(filterKeys = [], limit = 10) {
  const blank = Object.fromEntries([...filterKeys, 'source'].map((key) => [key, '']));
  const [q, setQ] = useState('');
  const [filters, setFilters] = useState(blank);
  const [page, setPage] = useState(1);
  const search = useDebounced(q);

  return {
    q,
    filters,
    page,
    setPage,
    params: { q: search, ...filters, page, limit },
    setSearch: (value) => { setQ(value); setPage(1); },
    setFilter: (key, value) => { setFilters((previous) => ({ ...previous, [key]: value })); setPage(1); },
    isFiltered: q !== '' || Object.values(filters).some((value) => value !== ''),
    clear: () => { setQ(''); setFilters(blank); setPage(1); },
  };
}
