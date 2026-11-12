import { useState } from 'react';
import { api, errorMessage } from '../../api/client';
import type { Bejelentes, Paginated } from '../../types';
import { useAsync } from '../../lib/useAsync';
import { fmtDateTime, isNew, parseLines } from '../../lib/format';
import Modal from '../../components/Modal';
import Pager from '../../components/Pager';
import { ErrorBox, Loading } from '../../components/Status';
import { AlertIcon } from '../../components/Icons';

function view(b: Bejelentes) {
  const animal = parseLines(b.allat_leiras);
  const reporter = parseLines(b.leiras);
  return {
    title: `${animal['Faj'] || 'Állat'} – ${b.megtalalas_helye}`,
    phone: reporter['Telefon'] || b.felhasznalo?.telefonszam || '–',
    name: reporter['Bejelentő neve'] || b.felhasznalo?.felhasznalonev || '–',
    kor: animal['Feltételezett kor'] || '–',
    allapot: animal['Állapot'] || b.allat_leiras || '–',
  };
}

export default function FoundAnimals() {
  const [page, setPage] = useState(1);
  const { data, loading, error, reload } = useAsync(
    () => api<Paginated<Bejelentes>>('/admin/bejelentesek', { query: { page } }), [page]);
  const [open, setOpen] = useState<Bejelentes | null>(null);
  const [err, setErr] = useState('');

  const remove = async (b: Bejelentes) => {
    if (!window.confirm('Biztosan törlöd a bejelentést?')) return;
    try {
      await api(`/admin/bejelentesek/${b.id}`, { method: 'DELETE' });
      setOpen(null);
      reload();
    } catch (e) {
      setErr(errorMessage(e));
    }
  };

  return (
    <>
      <span className="eyebrow">MENTŐ MANCS RENDSZER</span>
      <h1 className="admin-title">Talált állatok</h1>
      {loading && !data && <Loading />}
      {(error || err) && <ErrorBox message={(error || err) as string} />}

      {data && (
        <section className="card panel">
          <h2>Lakossági bejelentések</h2>
          {data.data.length === 0 && <p className="muted">Nincs bejelentés.</p>}
          {data.data.map((b) => {
            const v = view(b);
            return (
              <div key={b.id} className="list-row">
                <span className="round red"><AlertIcon size={18} /></span>
                <div className="grow">
                  <strong>{v.title}</strong>
                  <small>Bejelentő: {v.phone}</small>
                </div>
                <span className="badge badge-green">{isNew(b.bejelentes_idopontja) ? 'Új' : 'Egyeztetés alatt'}</span>
                <button className="btn btn-outline btn-sm" onClick={() => setOpen(b)}>Részletek</button>
              </div>
            );
          })}
        </section>
      )}
      {data && <Pager page={data.current_page} last={data.last_page} onChange={setPage} />}

      {open && (() => {
        const v = view(open);
        return (
          <Modal title="Bejelentés részletei" onClose={() => setOpen(null)}>
            <dl className="details">
              <div><dt>Beérkezett</dt><dd>{fmtDateTime(open.bejelentes_idopontja)}</dd></div>
              <div><dt>Helyszín</dt><dd>{open.megtalalas_helye}</dd></div>
              <div><dt>Állat</dt><dd>{v.title.split(' – ')[0]}, feltételezett kor: {v.kor}</dd></div>
              <div><dt>Állapot, leírás</dt><dd>{v.allapot}</dd></div>
              <div><dt>Bejelentő</dt><dd>{v.name}</dd></div>
              <div><dt>Telefonszám</dt><dd><a href={`tel:${v.phone}`}>{v.phone}</a></dd></div>
              {open.felhasznalo?.email && <div><dt>E-mail</dt><dd>{open.felhasznalo.email}</dd></div>}
            </dl>
            <div className="modal-actions">
              <button className="btn btn-outline" onClick={() => remove(open)}>Bejelentés törlése</button>
              <button className="btn btn-primary" onClick={() => setOpen(null)}>Bezár</button>
            </div>
          </Modal>
        );
      })()}
    </>
  );
}
