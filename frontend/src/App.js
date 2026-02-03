import { useState } from 'react';
import '@/App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import Onboarding from './pages/Onboarding';
import Insights from './pages/Insights';
import Settings from './pages/Settings';
import BottomNav from './components/BottomNav';
import { Toaster } from 'sonner';

function AppContent() {
  const location = useLocation();
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  
  const hideNavPaths = ['/onboarding'];
  const shouldShowNav = !hideNavPaths.includes(location.pathname);

  return (
    <>
      <Routes>
        <Route path="/" element={<Dashboard onShowExpenseModal={setShowExpenseModal} />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/insights" element={<Insights />} />
        <Route path="/settings" element={<Settings />} />
      </Routes>
      {shouldShowNav && <BottomNav onAddExpense={() => setShowExpenseModal(true)} />}
      <Toaster position="top-center" theme="dark" />
    </>
  );
}

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </div>
  );
}

export default App;