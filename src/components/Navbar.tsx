import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import Logo from './Logo';
import { AlertIcon, MenuIcon } from './Icons';

interface NavItem {
  to: string;
  label: string;
  end?: boolean;
}

export default function Navbar() {
  const { user, isAdmin, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const links: NavItem[] = [
    { to: '/', label: 'Főoldal', end: true },
    { to: '/orokbefogadas', label: 'Örökbefogadás' },
    { to: '/talalt-allat', label: 'Talált állat' },
  ];
  if (isAdmin) links.push({ to: '/admin', label: 'Admin' });

  return (
    <header className="navbar">
      <div className="container navbar-inner">
        <Logo />
        <button className="nav-burger" onClick={() => setOpen(!open)} aria-label="Menü">
          <MenuIcon />
        </button>
        <nav className={`nav-links ${open ? 'open' : ''}`}>
          {links.map((l) => (
            <NavLink key={l.to} to={l.to} end={l.end} onClick={() => setOpen(false)}
                     className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className={`nav-actions ${open ? 'open' : ''}`}>
          {user ? (
            <>
              <span className="nav-user">{user.felhasznalonev}</span>
              <button className="btn btn-outline btn-sm"
                      onClick={async () => { await logout(); setOpen(false); navigate('/'); }}>
                Kijelentkezés
              </button>
            </>
          ) : (
            <Link className="btn btn-outline btn-sm" to="/bejelentkezes" onClick={() => setOpen(false)}>
              Bejelentkezés
            </Link>
          )}
          <Link className="btn btn-red btn-sm" to="/talalt-allat" onClick={() => setOpen(false)}>
            <AlertIcon size={16} /> SOS Mentés
          </Link>
        </div>
      </div>
    </header>
  );
}
