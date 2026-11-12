import { useState } from 'react';
import { api, errorMessage } from '../../api/client';
import type { Orokbefogadas, Paginated } from '../../types';
import { useAsync } from '../../lib/useAsync';
import { fmtDateTime } from '../../lib/format';
import Modal from '../../components/Modal';
import Pager from '../../components/Pager';
import { ErrorBox, Loading } from '../../components/Status';
import { HeartIcon } from '../../components/Icons';

export default function Adoptions() {
  const [page, setPage] = useState(1);
  const [onlyPending, setOnlyPending] = useState(true);
  const { data, loading, error, reload } = useAsync(
    () => api<Paginated<Orokbefogadas>>('/admin/orokbefogadasok', { query: { page, fuggo: onlyPending ? 1 : undefined } }),
    [page, onlyPending]);
  const [open, setOpen] = useState<Orokbefogadas | null>(null);
  const [szerzodes, setSzerzodes] = useState('');
  const [err, setErr] = useState('');
  const [busy, setBusy] = useState(false);

  const openModal = (k: Orokbefogadas) => { setOpen(k); setSzerzodes(''); setErr(''); };

  const accept = async () => {
    if (!open) return;
    setBusy(true);
    setErr('');
    try {
      await api(`/admin/orokbefogadasok/${open.id}/elfogad`, { method: 'POST', body: { szerzodes_szam: szerzodes } });
      setOpen(null);
      reload();
    } catch (e) {
      setErr(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const reject = async () => {
    if (!open || !window.confirm('Biztosan elutasítod a kérelmet? A kérelem törlődik.')) return;
    setBusy(true);
    try {
      await api(`/admin/orokbefogadasok/${open.id}`, { method: 'DELETE' });
      setOpen(null);
      reload();
    } catch (e) {
      setErr(errorMessage(e));
    } finally {
      setBusy(false);
    }
  };

  const u = open?.felhasznalo;
  const lakcim = u?.lakcim;

  return (
    <>
      <span className="eyebrow">MENTŐ MANCS RENDSZER</span>
      <h1 className="admin-title">Örökbefogadási kérelmek</h1>
      {loading && !data && <Loading />}
      {error && <ErrorBox message={error} />}

      {data && (
        <section className="card panel">
          <div className="panel-head">
            <h2>Beérkezett kérelmek</h2>
            <label className="check">
              <input type="checkbox" checked={onlyPending} onChange={(e) => { setOnlyPending(e.target.checked); setPage(1); }} /> Csak függők
            </label>
          </div>
          {data.data.length === 0 && <p className="muted">Nincs megjeleníthető kérelem.</p>}
          {data.data.map((k) => {
            const pending = !k.dolgozo_id;
            return (
              <div key={k.id} className="list-row">
                <span className="round red"><HeartIcon size={18} /></span>
                <div className="grow">
                  <strong>{k.felhasznalo?.felhasznalonev} – {k.allat?.neve}</strong>
                  <small>{pending ? 'Telefonos egyeztetésre vár' : `Szerződésszám: ${k.szerzodes_szam}`}</small>
                </div>
                <span className={`badge ${pending ? 'badge-green' : 'badge-gray'}`}>{pending ? 'Függőben' : 'Elfogadva'}</span>
                {pending
                  ? <button className="btn btn-primary btn-sm" onClick={() => openModal(k)}>Elbírálás</button>
                  : <span className="btn-placeholder" />}
              </div>
            );
          })}
        </section>
      )}
      {data && <Pager page={data.current_page} last={data.last_page} onChange={setPage} />}

      {open && (
        <Modal title="Kérelem elbírálása" onClose={() => setOpen(null)}>
          <dl className="details">
            <div><dt>Állat</dt><dd>{open.allat?.neve}</dd></div>
            <div><dt>Beadva</dt><dd>{fmtDateTime(open.orokbefogadas_idopontja)}</dd></div>
            <div><dt>Kérelmező</dt><dd>{u?.felhasznalonev}</dd></div>
            <div><dt>Telefonszám</dt><dd>{u?.telefonszam ? <a href={`tel:${u.telefonszam}`}>{u.telefonszam}</a> : '–'}</dd></div>
            <div><dt>E-mail</dt><dd>{u?.email ?? '–'}</dd></div>
            <div><dt>Lakcím</dt><dd>{lakcim ? `${lakcim.iranyitoszam ?? ''} ${lakcim.varos ?? ''}, ${lakcim.utca ?? ''} ${lakcim.hazszam ?? ''}` : 'Nincs megadva'}</dd></div>
          </dl>
          <div className="field">
            <label>Szerződésszám (elfogadáshoz)</label>
            <input className="input" placeholder="pl. SZ-2026-001" value={szerzodes} onChange={(e) => setSzerzodes(e.target.value)} />
          </div>
          {err && <div className="alert alert-error">{err}</div>}
          <div className="modal-actions">
            <button className="btn btn-outline" onClick={reject} disabled={busy}>Elutasítás</button>
            <button className="btn btn-primary" onClick={accept} disabled={busy || !szerzodes.trim()}>Elfogadás</button>
          </div>
        </Modal>
      )}
    </>
  );
}
