import { useEffect, useState } from 'react';
import { api } from '../api/client';
import type { Allat, Paginated } from '../types';
import { useAsync } from '../lib/useAsync';
import AnimalCard from '../components/AnimalCard';
import Pager from '../components/Pager';
import { ErrorBox, Loading } from '../components/Status';
import { SearchIcon } from '../components/Icons';

// Kor szűrő -> az API kor_min / kor_max (év) paraméterei
const KOR: Record<string, { label: string; min?: number; max?: number }> = {
  kolyok: { label: 'Kölyök (1 év alatt)', max: 0 },
  fiatal: { label: 'Fiatal (1–3 év)', min: 1, max: 2 },
  felnott: { label: 'Felnőtt (3–7 év)', min: 3, max: 6 },
  idos: { label: 'Idős (7 év felett)', min: 7 },
};

export default function Adoption() {
  const [kereses, setKereses] = useState('');
  const [debounced, setDebounced] = useState('');
  const [faj, setFaj] = useState('');
  const [neme, setNeme] = useState('');
  const [kor, setKor] = useState('');
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => { setDebounced(kereses); setPage(1); }, 300);
    return () => clearTimeout(t);
  }, [kereses]);

  const { data, loading, error } = useAsync(
    () => api<Paginated<Allat>>('/allatok', {
      query: { kereses: debounced, faj, neme, kor_min: KOR[kor]?.min, kor_max: KOR[kor]?.max, page },
    }),
    [debounced, faj, neme, kor, page],
  );

  const change = (setter: (v: string) => void) => (e: React.ChangeEvent<HTMLSelectElement>) => {
    setter(e.target.value);
    setPage(1);
  };

  return (
    <div className="container page">
      <span className="eyebrow">TALÁLD MEG AZ ÚJ TÁRSAD</span>
      <h1 className="page-title">Örökbefogadható állatok</h1>
      <p className="lead">Ismerd meg védenceinket, és szűrj a számodra fontos szempontok alapján.</p>

      <div className="card filter-bar">
        <div className="search-box">
          <SearchIcon size={18} />
          <input className="input" placeholder="Keresés név vagy fajta alapján" value={kereses}
                 onChange={(e) => setKereses(e.target.value)} />
        </div>
        <div className="field">
          <label>Faj</label>
          <select className="input" value={faj} onChange={change(setFaj)}>
            <option value="">Mind</option>
            <option value="kutya">Kutya</option>
            <option value="macska">Macska</option>
          </select>
        </div>
        <div className="field">
          <label>Nem</label>
          <select className="input" value={neme} onChange={change(setNeme)}>
            <option value="">Mind</option>
            <option value="Kan">Kan</option>
            <option value="Nőstény">Nőstény</option>
          </select>
        </div>
        <div className="field">
          <label>Kor</label>
          <select className="input" value={kor} onChange={change(setKor)}>
            <option value="">Mind</option>
            {Object.entries(KOR).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </div>

      {data && <p className="count"><strong>{data.total} állat</strong> vár jelenleg szerető gazdira</p>}
      {loading && !data && <Loading />}
      {error && <ErrorBox message={error} />}
      {data && data.data.length === 0 && <div className="state-msg">Nincs a szűrésnek megfelelő állat.</div>}

      <div className="grid-3">
        {data?.data.map((a) => <AnimalCard key={a.id} animal={a} />)}
      </div>
      {data && <Pager page={data.current_page} last={data.last_page} onChange={setPage} />}
    </div>
  );
}
