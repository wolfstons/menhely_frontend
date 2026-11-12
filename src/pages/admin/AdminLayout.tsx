import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { api } from '../../api/client';
import { useAuth } from '../../auth/AuthContext';
import type { Allat, Bejelentes, Orokbefogadas, Paginated } from '../../types';
import Logo from '../../components/Logo';
import { AlertIcon, GridIcon, HeartIcon, LogoutIcon, PawIcon } from '../../components/Icons';

interface Counts {
  allatok: number;
  bejelentesek: number;
  kerelmek: number;
}

export default function AdminLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const [counts, setCounts] = useState<Counts | null>(null);

  // a számlálók minden oldalváltáskor frissülnek
  useEffect(() => {
    Promise.all([
      api<Paginated<Allat>>('/admin/allatok'),
      api<Paginated<Bejelentes>>('/admin/bejelentesek'),
      api<Paginated<Orokbefogadas>>('/admin/orokbefogadasok', { query: { fuggo: 1 } }),
    ])
      .then(([a, b, k]) => setCounts({ allatok: a.total, bejelentesek: b.total, kerelmek: k.total }))
      .catch(() => setCounts(null));
  }, [pathname]);

  const items = [
    { to: '/admin', label: 'Vezérlőpult', icon: <GridIcon size={18} />, end: true },
    { to: '/admin/allatok', label: 'Állatok kezelése', icon: <PawIcon size={18} />, count: counts?.allatok },
    { to: '/admin/talalt-allatok', label: 'Talált állatok', icon: <AlertIcon size={18} />, count: counts?.bejelentesek },
    { to: '/admin/orokbefogadasok', label: 'Örökbefogadások', icon: <HeartIcon size={18} />, count: counts?.kerelmek },
  ];

  return (
    <div className="admin">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <Logo to="/admin" />
          <small>Adminisztráció</small>
        </div>
        <nav>
          {items.map((i) => (
            <NavLink key={i.to} to={i.to} end={i.end} className={({ isActive }) => `side-link ${isActive ? 'active' : ''}`}>
              {i.icon}
              <span>{i.label}</span>
              {i.count !== undefined && <em className="count-badge">{i.count}</em>}
            </NavLink>
          ))}
          <Link to="/" className="side-link"><span>← Vissza az oldalra</span></Link>
        </nav>
        <div className="sidebar-user">
          <span className="avatar">{user?.felhasznalonev.slice(0, 2).toUpperCase()}</span>
          <div>
            <strong>{user?.felhasznalonev}</strong>
            <small>Adminisztrátor</small>
          </div>
          <button className="icon-btn light" title="Kijelentkezés" onClick={async () => { await logout(); navigate('/'); }}>
            <LogoutIcon size={18} />
          </button>
        </div>
      </aside>
      <main className="admin-main"><Outlet /></main>
    </div>
  );
}
