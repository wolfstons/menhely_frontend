import { Link } from 'react-router-dom';
import type { Allat } from '../types';
import { ageText, cap } from '../lib/format';
import { PawIcon } from './Icons';

export function AnimalImage({ animal, className = '' }: { animal: Pick<Allat, 'kep_url' | 'neve'>; className?: string }) {
  return animal.kep_url ? (
    <img className={className} src={animal.kep_url} alt={animal.neve} loading="lazy" />
  ) : (
    <div className={`img-placeholder ${className}`}><PawIcon size={40} /></div>
  );
}

export default function AnimalCard({ animal }: { animal: Allat }) {
  return (
    <article className="animal-card">
      <div className="animal-card-img">
        <AnimalImage animal={animal} />
        <span className="chip-white">{cap(animal.allapot?.statusz ?? 'örökbefogadható')}</span>
      </div>
      <div className="animal-card-body">
        <div className="animal-card-head">
          <h3>{animal.neve}</h3>
          <span className="badge badge-green">{[animal.neme, ageText(animal.szuletesi_ido)].filter(Boolean).join(' · ')}</span>
        </div>
        <p className="animal-meta">{cap(animal.faj)} · {animal.fajta}</p>
        <p className="animal-desc">{animal.leirasa}</p>
        <Link className="btn btn-primary btn-block" to={`/orokbefogadas/${animal.id}`}>Megismerem</Link>
      </div>
    </article>
  );
}
