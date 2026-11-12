import { Link } from 'react-router-dom';
import { HeartIcon } from './Icons';

export default function Logo({ to = '/' }: { to?: string }) {
  return (
    <Link to={to} className="logo">
      <span className="logo-mark"><HeartIcon size={20} /></span>
      <span className="logo-text">
        <strong>MENTŐ MANCS</strong>
        <small>ÁLLATMENTŐ ALAPÍTVÁNY</small>
      </span>
    </Link>
  );
}
