import LoginPage from '@/pages/LoginPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './modules/auth/ProtectedRoute';
import DiscordCbPage from './pages/DiscordCbPage';
import PerfilPage from './pages/PerfilPage';
import SonidoPage from './pages/SonidoPage';
import TestPage from './pages/TestPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/auth/callback" element={<DiscordCbPage />} />

      {/* Dashboard */}
      <Route path="/dashboard" element={<ProtectedRoute />}>
        <Route index element={<Navigate to="sonidos" replace />} />
        <Route path="sonidos" element={<SonidoPage />} />
        <Route path="test" element={<TestPage />} />
        <Route path="perfil" element={<PerfilPage />} />
        <Route path="*" element={<Navigate to="sonidos" replace />} />
      </Route>

      {/* Default Path */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
