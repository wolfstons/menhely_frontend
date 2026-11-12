import { Link } from 'react-router-dom';
import { api } from '../../api/client';
import type { Allat, Paginated, Vezerlopult } from '../../types';
import { useAsync } from '../../lib/useAsync';
import { fmtTime, timeAgo } from '../../lib/format';
import { ErrorBox, Loading } from '../../components/Status';
import { AlertIcon, CalendarIcon, HeartIcon, PawIcon } from '../../components/Icons';

export default function Dashboard() {
  const { data, loading, error } = useAsync(async () => {
    const [v, adoptable, bej] = await Promise.all([
      api<Vezerlopult>('/admin/vezerlopult'),
      api<Paginated<Allat>>('/allatok'),
      api<Paginated<unknown>>('/admin/bejelentesek'),
    ]);
    return { v, adoptable: adoptable.total, bejelentesek: bej.total };
  }, []);

  if (loading) return <Loading />;
  if (error || !data) return <ErrorBox message={error ?? 'Hiba'} />;
  const { v } = data;

  const stats = [
    { label: 'Örökbefogadható', value: data.adoptable, icon: <PawIcon size={22} />, cls: 'orange' },
    { label: 'Új bejelentés', value: data.bejelentesek, icon: <AlertIcon size={22} />, cls: 'red' },
    { label: 'Függő kérelem', value: v.fuggo_kerelmek.length, icon: <HeartIcon size={22} />, cls: 'green' },
    { label: 'Mai időpont', value: v.mai_idopontok.length, icon: <CalendarIcon size={22} />, cls: 'blue' },
  ];

  return (
    <>
      <span className="eyebrow">MENTŐ MANCS RENDSZER</span>
      <h1 className="admin-title">Vezérlőpult</h1>

      <div className="stat-grid">
        {stats.map((s) => (
          <div key={s.label} className="card stat-card">
            <span className={`quick-icon ${s.cls}`}>{s.icon}</span>
            <div><small>{s.label}</small><strong>{s.value}</strong></div>
          </div>
        ))}
      </div>

      <div className="dash-grid">
        <section className="card panel">
          <h2>Legfrissebb kérelmek</h2>
          {v.fuggo_kerelmek.length === 0 && <p className="muted">Nincs függő kérelem.</p>}
          {v.fuggo_kerelmek.slice(0, 5).map((k) => (
            <div key={k.id} className="list-row">
              <span className="initial">{k.allat?.neve?.charAt(0)}</span>
              <div className="grow">
                <strong>{k.allat?.neve} – {k.felhasznalo?.felhasznalonev}</strong>
                <small>{timeAgo(k.orokbefogadas_idopontja)}</small>
              </div>
              <Link to="/admin/orokbefogadasok" className="link-sm">Megnyitás</Link>
            </div>
          ))}
        </section>

        <section className="card panel">
          <h2>Mai teendők</h2>
          {v.mai_idopontok.length === 0 && <p className="muted">Mára nincs időpont.</p>}
          {v.mai_idopontok.map((m) => (
            <div key={m.id} className="list-row">
              <span className="todo-icon"><CalendarIcon size={18} /></span>
              <div className="grow">
                <strong>{fmtTime(m.orokbefogadas_idopontja)} – {m.allat?.neve} ismerkedés</strong>
                <small>{m.felhasznalo?.felhasznalonev}{m.felhasznalo?.telefonszam ? ` · ${m.felhasznalo.telefonszam}` : ''}</small>
              </div>
            </div>
          ))}
        </section>
      </div>
    </>
  );
}
