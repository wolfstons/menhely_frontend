import { useState, type FormEvent } from 'react';
import { api, errorMessage } from '../api/client';
import { useAuth } from '../auth/AuthContext';
import { ArrowIcon, PhoneIcon, PinIcon } from '../components/Icons';

export default function FoundAnimal() {
  const { user } = useAuth();
  const [f, setF] = useState({
    faj: '', kor: '', helyszin: '', leiras: '',
    nev: user?.felhasznalonev ?? '', telefon: user?.telefonszam ?? '',
  });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [done, setDone] = useState(false);

  const set = (k: keyof typeof f) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setF({ ...f, [k]: e.target.value });

  const submit = async (e: FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError('');
    try {
      // az adatbázis bejelentes táblája szöveges mezőkre épül, ezért "Kulcs: érték" sorokban mentjük
      await api('/talalt-allat', {
        method: 'POST',
        body: {
          allat_leiras: `Faj: ${f.faj}\nFeltételezett kor: ${f.kor}\nÁllapot: ${f.leiras}`,
          megtalalas_helye: f.helyszin,
          leiras: `Bejelentő neve: ${f.nev}\nTelefon: ${f.telefon}`,
        },
      });
      setDone(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container page">
      <div className="found-grid">
        <section className="found-side">
          <span className="tag">GYORS ÉS AZONNALI SEGÍTSÉG</span>
          <h1>Talált állat<br />bejelentése</h1>
          <p>Add meg a legfontosabb adatokat, hogy mentőcsapatunk gyorsan és biztonságosan tudjon intézkedni.</p>
          <div className="found-urgent">
            <PhoneIcon size={22} />
            <div>
              <strong>Sürgős, életveszélyes eset?</strong>
              <span>Hívd a +36 30 123 4567 ügyeleti számot.</span>
            </div>
          </div>
        </section>

        <section className="card found-form">
          {done ? (
            <div className="success-box">
              <h2>Köszönjük a bejelentést!</h2>
              <p>Amint megkapjuk, felvesszük veled a kapcsolatot a megadott telefonszámon, és egyeztetjük a részleteket.</p>
              <button className="btn btn-outline" onClick={() => { setDone(false); setF({ ...f, helyszin: '', leiras: '', faj: '', kor: '' }); }}>
                Újabb bejelentés
              </button>
            </div>
          ) : (
            <form onSubmit={submit}>
              <h2>Bejelentés adatai</h2>
              <div className="form-row">
                <div className="field">
                  <label>Állat faja</label>
                  <select className="input" required value={f.faj} onChange={set('faj')}>
                    <option value="">Válassz</option>
                    <option>Kutya</option><option>Macska</option><option>Egyéb</option>
                  </select>
                </div>
                <div className="field">
                  <label>Feltételezett kor</label>
                  <select className="input" required value={f.kor} onChange={set('kor')}>
                    <option value="">Válassz</option>
                    <option>Kölyök</option><option>Fiatal</option><option>Felnőtt</option><option>Idős</option><option>Nem tudom</option>
                  </select>
                </div>
              </div>
              <div className="field">
                <label><PinIcon size={14} /> Megtalálás pontos helyszíne</label>
                <input className="input" required placeholder="Település, utca vagy egyértelmű helyszín"
                       value={f.helyszin} onChange={set('helyszin')} />
              </div>
              <div className="field">
                <label>Állat állapota és leírása</label>
                <textarea className="input" rows={4} required placeholder="Sérültnek tűnik? Van nyakörve? Megközelíthető?"
                          value={f.leiras} onChange={set('leiras')} />
              </div>
              <div className="form-row">
                <div className="field">
                  <label>Neved</label>
                  <input className="input" required placeholder="Teljes név" value={f.nev} onChange={set('nev')} />
                </div>
                <div className="field">
                  <label>Telefonszámod</label>
                  <input className="input" required type="tel" placeholder="+36 30 123 4567" value={f.telefon} onChange={set('telefon')} />
                </div>
              </div>
              {error && <div className="alert alert-error">{error}</div>}
              <button className="btn btn-red btn-block btn-lg" disabled={busy}>
                {busy ? 'Küldés…' : <>Bejelentés elküldése <ArrowIcon size={18} /></>}
              </button>
            </form>
          )}
        </section>
      </div>
    </div>
  );
}
