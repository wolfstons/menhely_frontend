import { useState } from 'react';
import { api, errorMessage } from '../../api/client';
import type { Allat, Paginated } from '../../types';
import { useAsync } from '../../lib/useAsync';
import { ageText, cap } from '../../lib/format';
import { AnimalImage } from '../../components/AnimalCard';
import StatusBadge from '../../components/StatusBadge';
import Pager from '../../components/Pager';
import { ErrorBox, Loading } from '../../components/Status';
import { PencilIcon, TrashIcon } from '../../components/Icons';
import AnimalForm from './AnimalForm';

export default function Animals() {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useAsync(
    () => api<Paginated<Allat>>('/admin/allatok', { query: { page } }), [page]);
  const [editing, setEditing] = useState<Allat | null | undefined>(undefined); // undefined = zárva, null = új
  const [msg, setMsg] = useState('');

  const remove = async (a: Allat) => {
    if (!window.confirm(`Biztosan törlöd: ${a.neve}?`)) return;
    try {
      await api(`/admin/allatok/${a.id}`, { method: 'DELETE' });
      setMsg('');
      reload();
    } catch (e) {
      setMsg(errorMessage(e));
    }
  };

  return (
    <>
      <div className="admin-head">
        <div>
          <span className="eyebrow">MENTŐ MANCS RENDSZER</span>
          <h1 className="admin-title">Állatok kezelése</h1>
        </div>
        <button className="btn btn-primary" onClick={() => setEditing(null)}>+ Új állat rögzítése</button>
      </div>

      {msg && <div className="alert alert-error">{msg}</div>}
      {loading && !data && <Loading />}
      {error && <ErrorBox message={error} />}

      {data && (
        <div className="card table">
          <div className="table-head animals-cols">
            <span>ÁLLAT</span><span>ADATOK</span><span>STÁTUSZ</span><span>MŰVELETEK</span>
          </div>
          {data.data.map((a) => (
            <div key={a.id} className="table-row animals-cols">
              <div className="animal-cell">
                <AnimalImage animal={a} className="thumb" />
                <div><strong>{a.neve}</strong><small>{cap(a.faj)}</small></div>
              </div>
              <div><span>{[a.neme, ageText(a.szuletesi_ido)].filter(Boolean).join(', ')}</span><small>{a.fajta}</small></div>
              <div><StatusBadge status={a.allapot?.statusz} /></div>
              <div className="row-actions">
                <button className="icon-btn" title="Szerkesztés" onClick={() => setEditing(a)}><PencilIcon size={16} /></button>
                <button className="icon-btn" title="Törlés" onClick={() => remove(a)}><TrashIcon size={16} /></button>
              </div>
            </div>
          ))}
          {data.data.length === 0 && <div className="state-msg">Még nincs rögzített állat.</div>}
        </div>
      )}
      {data && <Pager page={data.current_page} last={data.last_page} onChange={setPage} />}

      {editing !== undefined && (
        <AnimalForm animal={editing} onClose={() => setEditing(undefined)}
                    onSaved={() => { setEditing(undefined); reload(); }} />
      )}
    </>
  );
}
