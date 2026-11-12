import { useEffect, useState, type FormEvent } from 'react';
import { api, errorMessage } from '../../api/client';
import type { Allapot, Allat, Oltas } from '../../types';
import { useAsync } from '../../lib/useAsync';
import Modal from '../../components/Modal';

function Vaccines({ animalId }: { animalId: number }) {
  const { data: oltasok } = useAsync(() => api<Oltas[]>('/admin/oltasok'), []);
  const { data: animal, reload } = useAsync(() => api<Allat>(`/admin/allatok/${animalId}`), [animalId]);
  const [oltasId, setOltasId] = useState('');
  const [datum, setDatum] = useState(new Date().toISOString().slice(0, 10));
  const [err, setErr] = useState('');

  const add = async () => {
    if (!oltasId) return;
    setErr('');
    try {
      await api(`/admin/allatok/${animalId}/oltasok`, { method: 'POST', body: { oltas_id: Number(oltasId), datum } });
      setOltasId('');
      reload();
    } catch (e) {
      setErr(errorMessage(e));
    }
  };

  return (
    <div className="vaccine-box">
      <label className="label">Oltások</label>
      <ul className="vaccine-list">
        {(animal?.oltasok ?? []).map((o) => <li key={o.pivot?.id ?? o.id}>{o.neve} <small>– {o.pivot?.datum.slice(0, 10)}</small></li>)}
        {animal && !animal.oltasok?.length && <li className="muted">Még nincs rögzített oltás.</li>}
      </ul>
      <div className="vaccine-add">
        <select className="input" value={oltasId} onChange={(e) => setOltasId(e.target.value)}>
          <option value="">Oltás kiválasztása</option>
          {oltasok?.map((o) => <option key={o.id} value={o.id}>{o.neve}</option>)}
        </select>
        <input className="input" type="date" value={datum} onChange={(e) => setDatum(e.target.value)} />
        <button type="button" className="btn btn-outline btn-sm" onClick={add}>Rögzít</button>
      </div>
      {err && <div className="alert alert-error">{err}</div>}
    </div>
  );
}

interface Props {
  animal: Allat | null;
  onClose: () => void;
  onSaved: () => void;
}

export default function AnimalForm({ animal, onClose, onSaved }: Props) {
  const { data: allapotok } = useAsync(() => api<Allapot[]>('/admin/allapotok'), []);
  const [f, setF] = useState({
    faj: animal?.faj ?? 'kutya',
    fajta: animal?.fajta ?? '',
    neve: animal?.neve ?? '',
    neme: animal?.neme ?? '',
    szuletesi_ido: animal?.szuletesi_ido?.slice(0, 10) ?? '',
    allapot_id: animal ? String(animal.allapot_id) : '',
    chip: animal?.chip ?? false,
    leirasa: animal?.leirasa ?? '',
  });
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  // új állatnál alapértelmezett státusz: örökbefogadható
  useEffect(() => {
    if (allapotok && !f.allapot_id) {
      const def = allapotok.find((s) => s.statusz === 'örökbefogadható') ?? allapotok[0];
      if (def) setF((p) => ({ ...p, allapot_id: String(def.id) }));
    }
  }, [allapotok]); // eslint-disable-line react-hooks/exhaustive-deps

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    const fd = new FormData();
    fd.append('faj', f.faj);
    fd.append('fajta', f.fajta);
    fd.append('neve', f.neve);
    fd.append('neme', f.neme);
    fd.append('szuletesi_ido', f.szuletesi_ido);
    fd.append('allapot_id', f.allapot_id);
    fd.append('chip', f.chip ? '1' : '0');
    fd.append('leirasa', f.leirasa);
    if (file) fd.append('kep', file);
    try {
      if (animal) {
        fd.append('_method', 'PUT'); // a PHP multipart PUT-ot nem dolgoz fel
        await api(`/admin/allatok/${animal.id}`, { method: 'POST', form: fd });
      } else {
        await api('/admin/allatok', { method: 'POST', form: fd });
      }
      onSaved();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal title={animal ? `${animal.neve} szerkesztése` : 'Új állat rögzítése'} onClose={onClose}>
      <form onSubmit={submit}>
        <div className="form-row">
          <div className="field"><label>Név</label><input className="input" required value={f.neve} onChange={set('neve')} /></div>
          <div className="field">
            <label>Faj</label>
            <select className="input" value={f.faj} onChange={set('faj')}>
              <option value="kutya">Kutya</option><option value="macska">Macska</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="field"><label>Fajta</label><input className="input" required value={f.fajta} onChange={set('fajta')} /></div>
          <div className="field">
            <label>Nem</label>
            <select className="input" value={f.neme} onChange={set('neme')}>
              <option value="">Nincs megadva</option><option>Kan</option><option>Nőstény</option>
            </select>
          </div>
        </div>
        <div className="form-row">
          <div className="field"><label>Születési idő</label><input className="input" type="date" max={new Date().toISOString().slice(0, 10)} value={f.szuletesi_ido} onChange={set('szuletesi_ido')} /></div>
          <div className="field">
            <label>Státusz</label>
            <select className="input" required value={f.allapot_id} onChange={set('allapot_id')}>
              {allapotok?.map((s) => <option key={s.id} value={s.id}>{s.statusz}</option>)}
            </select>
          </div>
        </div>
        <label className="check"><input type="checkbox" checked={f.chip} onChange={(e) => setF({ ...f, chip: e.target.checked })} /> Chippel ellátva</label>
        <div className="field"><label>Leírás</label><textarea className="input" rows={3} value={f.leirasa} onChange={set('leirasa')} /></div>
        <div className="field">
          <label>Fotó {animal?.kep_url && '(új feltöltése lecseréli a jelenlegit)'}</label>
          <input className="input" type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        </div>
        {animal && <Vaccines animalId={animal.id} />}
        {error && <div className="alert alert-error">{error}</div>}
        <div className="modal-actions">
          <button type="button" className="btn btn-outline" onClick={onClose}>Mégse</button>
          <button className="btn btn-primary" disabled={busy}>{busy ? 'Mentés…' : 'Mentés'}</button>
        </div>
      </form>
    </Modal>
  );
}
