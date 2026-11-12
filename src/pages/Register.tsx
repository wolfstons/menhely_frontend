import { useState, type FormEvent } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { errorMessage } from '../api/client';
import { useAuth, type RegisterData } from '../auth/AuthContext';
import Logo from '../components/Logo';

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  const [f, setF] = useState({
    felhasznalonev: '', email: '', telefonszam: '', jelszo: '', jelszo2: '',
    anyja_neve: '', szuletesi_ido: '', szig_szam: '',
    iranyitoszam: '', varos: '', utca: '', hazszam: '',
  });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement>) => setF({ ...f, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    if (f.jelszo !== f.jelszo2) {
      setError('A két jelszó nem egyezik.');
      return;
    }
    const data: RegisterData = {
      felhasznalonev: f.felhasznalonev,
      email: f.email,
      telefonszam: f.telefonszam,
      jelszo: f.jelszo,
      jelszo_confirmation: f.jelszo2,
    };
    if (f.anyja_neve) data.anyja_neve = f.anyja_neve;
    if (f.szuletesi_ido) data.szuletesi_ido = f.szuletesi_ido;
    if (f.szig_szam) data.szig_szam = f.szig_szam;
    if (f.iranyitoszam || f.varos || f.utca || f.hazszam) {
      data.lakcim = {
        iranyitoszam: f.iranyitoszam || undefined,
        varos: f.varos || undefined,
        utca: f.utca || undefined,
        hazszam: f.hazszam ? Number(f.hazszam) : undefined,
      };
    }
    setBusy(true);
    setError('');
    try {
      await register(data);
      navigate(from ?? '/', { replace: true });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="auth-bg">
      <form className="auth-card wide" onSubmit={submit}>
        <div className="auth-logo"><Logo /></div>
        <span className="eyebrow">CSATLAKOZZ HOZZÁNK</span>
        <h1>Regisztráció</h1>
        <p className="lead">A fiókoddal örökbefogadási kérelmet adhatsz be.</p>

        <div className="form-row">
          <div className="field"><label>Felhasználónév</label><input className="input" required value={f.felhasznalonev} onChange={set('felhasznalonev')} /></div>
          <div className="field"><label>E-mail-cím</label><input className="input" type="email" required placeholder="pelda@email.hu" value={f.email} onChange={set('email')} /></div>
        </div>
        <div className="field"><label>Telefonszám (a telefonos egyeztetéshez)</label><input className="input" type="tel" required placeholder="+36 30 123 4567" value={f.telefonszam} onChange={set('telefonszam')} /></div>
        <div className="form-row">
          <div className="field"><label>Jelszó</label><input className="input" type="password" required minLength={8} placeholder="Legalább 8 karakter" value={f.jelszo} onChange={set('jelszo')} /></div>
          <div className="field"><label>Jelszó megerősítése</label><input className="input" type="password" required minLength={8} value={f.jelszo2} onChange={set('jelszo2')} /></div>
        </div>

        <details className="optional">
          <summary>További adatok az örökbefogadási szerződéshez (opcionális)</summary>
          <div className="form-row">
            <div className="field"><label>Anyja neve</label><input className="input" value={f.anyja_neve} onChange={set('anyja_neve')} /></div>
            <div className="field"><label>Születési idő</label><input className="input" type="date" value={f.szuletesi_ido} onChange={set('szuletesi_ido')} /></div>
          </div>
          <div className="field"><label>Személyi igazolvány száma</label><input className="input" value={f.szig_szam} onChange={set('szig_szam')} /></div>
          <div className="form-row">
            <div className="field"><label>Irányítószám</label><input className="input" maxLength={4} inputMode="numeric" value={f.iranyitoszam} onChange={set('iranyitoszam')} /></div>
            <div className="field"><label>Város</label><input className="input" value={f.varos} onChange={set('varos')} /></div>
          </div>
          <div className="form-row">
            <div className="field"><label>Utca</label><input className="input" value={f.utca} onChange={set('utca')} /></div>
            <div className="field"><label>Házszám</label><input className="input" type="number" min={1} value={f.hazszam} onChange={set('hazszam')} /></div>
          </div>
        </details>

        {error && <div className="alert alert-error">{error}</div>}
        <button className="btn btn-primary btn-block btn-lg" disabled={busy}>{busy ? 'Regisztráció…' : 'Regisztráció'}</button>
        <p className="auth-switch"><Link to="/bejelentkezes" state={{ from }}>Már van fiókod? Bejelentkezés</Link></p>
      </form>
    </div>
  );
}
