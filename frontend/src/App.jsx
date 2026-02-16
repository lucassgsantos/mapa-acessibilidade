import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import NovoLocal from './pages/NovoLocal';
import DetalhesLocal from './pages/DetalhesLocal';
import Estatisticas from './pages/Estatisticas';

function RotaPrivada({ children }) {
  const { autenticado, carregando } = useAuth();
  if (carregando) return <div className="flex items-center justify-center min-h-screen">Carregando...</div>;
  return autenticado ? children : <Navigate to="/login" />;
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="min-h-screen bg-gray-50">
          <a href="#conteudo-principal" className="skip-link">
            Pular para o conteúdo principal
          </a>
          <Navbar />
          <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/local/:id" element={<DetalhesLocal />} />
            <Route path="/estatisticas" element={<Estatisticas />} />
            <Route path="/novo-local" element={
              <RotaPrivada>
                <NovoLocal />
              </RotaPrivada>
            } />
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
