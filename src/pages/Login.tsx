import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { errorMessage } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import Logo from '../components/Logo';

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [azonosito, setAzonosito] = useState('');
  const [jelszo, setJelszo] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      const u = await login(azonosito, jelszo);
      navigate(from ?? (u.jogosultsag === 'admin' ? '/admin' : '/'), { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-bg">
      <form className="auth-card" onSubmit={submit}>
        <div className="auth-logo"><Logo /></div>
        <span className="eyebrow">ÜDV ÚJRA ITT</span>
        <h1>Bejelentkezés</h1>
        <p className="lead">Lépj be a fiókodba az örökbefogadási kérelemhez</p>
        <div className="field">
          <label>E-mail-cím vagy felhasználónév</label>
          <input className="input" required placeholder="pelda@email.hu" value={azonosito} onChange={(e) => setAzonosito(e.target.value)} />
        </div>
        <div className="field">
          <label>Jelszó</label>
          <input className="input" type="password" required minLength={8} placeholder="Legalább 8 karakter" value={jelszo} onChange={(e) => setJelszo(e.target.value)} />
        </div>
        {error && <div className="alert alert-error">{error}</div>}
        <button className="btn btn-primary btn-block btn-lg" disabled={busy}>{busy ? 'Belépés…' : 'Bejelentkezés'}</button>
        <p className="auth-switch"><Link to="/regisztracio" state={{ from }}>Még nincs fiókod? Regisztráció</Link></p>
      </form>
    </div>
  );
}
