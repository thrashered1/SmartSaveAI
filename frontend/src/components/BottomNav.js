import { Home, TrendingUp, Plus, Target } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

export default function BottomNav({ onAddExpense }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigation = (path) => {
    if (path) navigate(path);
  };

  const tabs = [
    { icon: Home, label: 'Home', path: '/', testId: 'nav-home' },
    { icon: TrendingUp, label: 'Insights', path: '/insights', testId: 'nav-insights' },
    { icon: Plus, label: 'Add', isAction: true, testId: 'nav-add' },
    { icon: Target, label: 'Goals', path: '/goals', testId: 'nav-goals' },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 px-6 z-50">
      <div className="max-w-md mx-auto glass-morphism rounded-2xl h-18 flex items-center justify-around px-4 shadow-2xl shadow-black/40">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = location.pathname === tab.path;
          
          return (
            <button
              key={tab.label}
              onClick={() => {
                if (tab.isAction) {
                  // Trigger add expense on Dashboard
                  window.dispatchEvent(new CustomEvent('openExpenseModal'));
                } else {
                  handleNavigation(tab.path);
                }
              }}
              className={`flex flex-col items-center justify-center gap-1.5 px-6 py-3 rounded-xl transition-all ${
                isActive ? 'text-purple-400' : 'text-gray-400 hover:text-white'
              } ${tab.isAction ? 'bg-gradient-to-r from-purple-600 to-purple-500 text-white scale-105 shadow-lg shadow-purple-500/30' : ''}`}
              data-testid={tab.testId}
            >
              <Icon className={`w-5 h-5 ${tab.label === 'Add' ? 'w-5 h-5' : ''}`} />
              <span className="text-[9px] font-semibold uppercase tracking-wider">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}