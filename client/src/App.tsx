import LoginPage from "@/pages/login-page";
import { Navigate, Route, Routes } from "react-router-dom";
import ProfilePage from "./pages/profile-page";
import SonidoPage from "./pages/sonido-page";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/dashboard">
        <Route index element={<Navigate to="sonidos" replace />} />
        <Route path="sonidos" element={<SonidoPage />}  />
        <Route path="perfil" element={<ProfilePage />}  />
        <Route path="*" element={<Navigate to="sonidos" replace />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;