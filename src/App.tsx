import React from 'react';
import { useParams } from 'react-router-dom';
import { ToastProvider } from './components/ui/Toast';
import HomePage from './pages/HomePage';
import GmailPage from './pages/GmailPage';
import WhatsPage from './pages/WhatsPage';
import RedesPage from './pages/RedesPage';
import DominioPage from './pages/DominioPage';
import FormularioPage from './pages/FormularioPage';
import AsistentePage from './pages/AsistentePage';

const PAGES: Record<string, React.ComponentType> = {
  gmail:      GmailPage,
  whatsapp:   WhatsPage,
  redes:      RedesPage,
  dominio:    DominioPage,
  formulario: FormularioPage,
  asistente:  AsistentePage,
};

export default function App() {
  const { page = 'home' } = useParams<{ page?: string }>();
  const Page = PAGES[page] ?? HomePage;
  return (
    <ToastProvider>
      <div className="fade-in" key={page}><Page /></div>
    </ToastProvider>
  );
}
