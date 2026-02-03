import { Home, TrendingUp, Plus, Settings } from 'lucide-react';
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
    { icon: Settings, label: 'Settings', path: '/settings', testId: 'nav-settings' },
  ];

  return (
    <div className="fixed bottom-6 left-0 right-0 px-6 z-50">
      <div className="max-w-md mx-auto bg-[#1A1A1A]/90 backdrop-blur-lg border border-white/5 rounded-full h-16 flex items-center justify-around px-2 shadow-2xl">
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
              className={`flex flex-col items-center justify-center gap-1 px-4 py-2 rounded-full transition-colors ${
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              } ${tab.isAction ? 'bg-primary text-white scale-110' : ''}`}
              data-testid={tab.testId}
            >
              <Icon className={`w-5 h-5 ${tab.label === 'Add' ? 'w-6 h-6' : ''}`} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}