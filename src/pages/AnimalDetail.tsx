import { useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { api, errorMessage } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import type { Allat } from '../types';
import { useAsync } from '../lib/useAsync';
import { ageText, cap } from '../lib/format';
import { AnimalImage } from '../components/AnimalCard';
import { ErrorBox, Loading } from '../components/Status';

export default function AnimalDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: a, loading, error } = useAsync(() => api<Allat>(`/allatok/${id}`), [id]);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  const adopt = async () => {
    if (!user) {
      navigate('/bejelentkezes', { state: { from: location.pathname } });
      return;
    }
    setBusy(true);
    setMsg(null);
    try {
      const r = await api<{ message: string }>(`/allatok/${id}/orokbefogadas`, { method: 'POST' });
      setMsg({ ok: true, text: r.message });
    } catch (e) {
      setMsg({ ok: false, text: errorMessage(e) });
    } finally {
      setBusy(false);
    }
  };

  if (loading) return <Loading />;
  if (error || !a) return <div className="container page"><ErrorBox message={error ?? 'Az állat nem található.'} /><Link to="/orokbefogadas" className="link-arrow">← Vissza a listához</Link></div>;

  return (
    <div className="container page">
      <Link to="/orokbefogadas" className="link-arrow">← Vissza a listához</Link>
      <div className="detail">
        <AnimalImage animal={a} className="detail-img" />
        <div className="card detail-info">
          <span className="eyebrow">{cap(a.faj)} · {a.fajta}</span>
          <h1 className="page-title">{a.neve}</h1>
          <dl className="facts">
            <div><dt>Nem</dt><dd>{a.neme ?? '–'}</dd></div>
            <div><dt>Kor</dt><dd>{ageText(a.szuletesi_ido)}</dd></div>
            <div><dt>Chip</dt><dd>{a.chip ? 'Van' : 'Nincs'}</dd></div>
          </dl>
          {a.leirasa && <p className="detail-desc">{a.leirasa}</p>}
          {a.oltasok && a.oltasok.length > 0 && (
            <>
              <h3>Oltások</h3>
              <ul className="vaccine-list">
                {a.oltasok.map((o) => (
                  <li key={o.pivot?.id ?? o.id}>{o.neve}{o.pivot && <small> – {o.pivot.datum.slice(0, 10)}</small>}</li>
                ))}
              </ul>
            </>
          )}
          {msg && <div className={`alert ${msg.ok ? 'alert-ok' : 'alert-error'}`}>{msg.text}</div>}
          {!msg?.ok && (
            <button className="btn btn-primary btn-lg" onClick={adopt} disabled={busy}>
              {busy ? 'Küldés…' : 'Örökbefogad'}
            </button>
          )}
          {!user && <p className="hint">Az örökbefogadási kérelemhez be kell jelentkezned.</p>}
        </div>
      </div>
    </div>
  );
}
