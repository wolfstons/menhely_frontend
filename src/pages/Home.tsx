import { Link } from 'react-router-dom';
import { api } from '../api/client';
import type { Allat } from '../types';
import { useAsync } from '../lib/useAsync';
import AnimalCard from '../components/AnimalCard';
import { ErrorBox, Loading } from '../components/Status';
import { AlertIcon, ArrowIcon, CheckIcon, HelpIcon, PawIcon } from '../components/Icons';

export default function Home() {
  const { data, loading, error } = useAsync(() => api<Allat[]>('/allatok/kiemelt'), []);
  const animals = (data ?? []).slice(0, 4);

  return (
    <>
      <section className="hero">
        <div className="container">
          <span className="tag">MINDEN ÉLET SZÁMÍT</span>
          <h1>Adj esélyt egy új,<br />boldog életre!</h1>
          <p>Alapítványunk elkötelezetten harcol a bajba jutott, bántalmazott és gazdátlan állatok megmentéséért.</p>
          <Link className="btn btn-primary btn-lg" to="/orokbefogadas">
            Ismerd meg védenceinket <ArrowIcon size={18} />
          </Link>
        </div>
      </section>

      <div className="container">
        <div className="quick-cards">
          <Link to="/orokbefogadas" className="quick-card">
            <span className="quick-icon green"><PawIcon size={22} /></span>
            <span><strong>Örökbefogadás</strong><small>Válassz egy hűséges barátot</small></span>
          </Link>
          <Link to="/talalt-allat" className="quick-card">
            <span className="quick-icon red"><AlertIcon size={22} /></span>
            <span><strong>Talált állat bejelentése</strong><small>Segíts hazajutni egy elveszettnek</small></span>
          </Link>
        </div>

        <div className="home-grid">
          <div>
            <div className="section-head">
              <div>
                <span className="eyebrow">VÁRJÁK A SZERETŐ GAZDÁT</span>
                <h2>Gazdira váró kedvenceink</h2>
              </div>
              <Link to="/orokbefogadas" className="link-arrow">Összes állat megtekintése <ArrowIcon size={16} /></Link>
            </div>

            {loading && <Loading />}
            {error && <ErrorBox message={error} />}
            {!loading && !error && animals.length === 0 && <div className="state-msg">Jelenleg nincs örökbefogadható állat.</div>}
            <div className="grid-2">
              {animals.map((a) => <AnimalCard key={a.id} animal={a} />)}
            </div>

            <div className="howto">
              <h3><HelpIcon size={22} /> Hogyan zajlik az örökbefogadás?</h3>
              <p>Nálunk az örökbefogadás felelősségteljes, többlépcsős folyamat. Ismerd meg a választott állatot, töltsd ki a kérdőívet, majd egyeztetünk veled telefonon.</p>
              <ul>
                <li><CheckIcon size={14} /> Szerződéssel</li>
                <li><CheckIcon size={14} /> Oltva és chippelve</li>
                <li><CheckIcon size={14} /> Ivartalanítási kötelezettséggel</li>
              </ul>
            </div>
          </div>

          <aside>
            <div className="card side-card">
              <span className="eyebrow">SEGÍTS NEKÜNK</span>
              <h3>Találtál állatot?</h3>
              <p>Ha elveszett vagy magára hagyott állatot láttál, töltsd ki a gyors bejelentőt.</p>
              <Link to="/talalt-allat" className="btn btn-red btn-block">Mentés bejelentése most</Link>
            </div>
            <div className="card side-card">
              <h3>Mérföldköveink eddig</h3>
              <div className="stat-row"><span>Megmentett életek</span><strong>1.420+</strong></div>
              <div className="stat-row"><span>Szerető otthonra talált</span><strong>1.180+</strong></div>
            </div>
          </aside>
        </div>
      </div>
    </>
  );
}
