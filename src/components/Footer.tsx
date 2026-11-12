import { Link } from 'react-router-dom';
import Logo from './Logo';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p>A Mentő Mancs egy modern, szakdolgozati mintaprojekt keretében készült állatmentő felület.</p>
        </div>
        <div>
          <h4>HASZNOS LINKEK</h4>
          <Link to="/orokbefogadas">Örökbefogadás menete</Link>
          <Link to="/talalt-allat">Talált állat bejelentése</Link>
          <Link to="/admin">Adminisztráció</Link>
        </div>
        <div>
          <h4>ELÉRHETŐSÉG</h4>
          <span>Budapest, Magyarország</span>
          <span>info@mentomancs.hu</span>
          <span>+36 30 123 4567</span>
        </div>
      </div>
    </footer>
  );
}
