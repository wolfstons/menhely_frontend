import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="container page">
      <h1 className="page-title">Az oldal nem található</h1>
      <Link to="/" className="link-arrow">← Vissza a főoldalra</Link>
    </div>
  );
}
