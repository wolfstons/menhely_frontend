import { Route, Routes } from 'react-router-dom';
import { AdminGuard, AuthLayout, PublicLayout } from './components/Layouts';
import Home from './pages/Home';
import Adoption from './pages/Adoption';
import AnimalDetail from './pages/AnimalDetail';
import FoundAnimal from './pages/FoundAnimal';
import Login from './pages/Login';
import Register from './pages/Register';
import NotFound from './pages/NotFound';
import AdminLayout from './pages/admin/AdminLayout';
import Dashboard from './pages/admin/Dashboard';
import Animals from './pages/admin/Animals';
import FoundAnimals from './pages/admin/FoundAnimals';
import Adoptions from './pages/admin/Adoptions';

export default function App() {
  return (
    <Routes>
      <Route element={<PublicLayout />}>
        <Route index element={<Home />} />
        <Route path="orokbefogadas" element={<Adoption />} />
        <Route path="orokbefogadas/:id" element={<AnimalDetail />} />
        <Route path="talalt-allat" element={<FoundAnimal />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      <Route element={<AuthLayout />}>
        <Route path="bejelentkezes" element={<Login />} />
        <Route path="regisztracio" element={<Register />} />
      </Route>

      <Route path="admin" element={<AdminGuard><AdminLayout /></AdminGuard>}>
        <Route index element={<Dashboard />} />
        <Route path="allatok" element={<Animals />} />
        <Route path="talalt-allatok" element={<FoundAnimals />} />
        <Route path="orokbefogadasok" element={<Adoptions />} />
      </Route>
    </Routes>
  );
}
