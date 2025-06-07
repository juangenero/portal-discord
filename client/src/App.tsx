import LoginPage from '@/pages/LoginPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import PerfilPage from './pages/PerfilPage';
import SonidoPage from './pages/SonidoPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard">
        <Route index element={<Navigate to="sonidos" replace />} />
        <Route path="sonidos" element={<SonidoPage />} />
        <Route path="perfil" element={<PerfilPage />} />
        <Route path="*" element={<Navigate to="sonidos" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
