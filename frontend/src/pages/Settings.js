import { User, Bell, Shield, Globe, Moon, ChevronRight, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/button';

export default function Settings() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/auth');
  };

  return (
    <div className="max-w-md mx-auto min-h-screen bg-background p-6 pb-24">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight mb-1" data-testid="settings-title">Settings</h1>
        <p className="text-sm text-muted-foreground font-medium">Manage your preferences</p>
      </div>

      {/* User Info */}
      <div className="premium-card p-6 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-600 to-purple-500 flex items-center justify-center text-2xl font-bold">
            {user?.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="font-semibold text-lg">{user?.name}</div>
            <div className="text-sm text-muted-foreground">{user?.email}</div>
          </div>
        </div>
      </div>

      {/* Settings Sections */}
      <div className="space-y-3 animate-fade-in mb-8">
        <button className="w-full premium-card p-5 flex items-center justify-between hover:border-purple-500/30 transition-all" data-testid="profile-settings">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <User className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Profile</div>
              <div className="text-sm text-muted-foreground">Manage your account</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>

        <button className="w-full premium-card p-5 flex items-center justify-between hover:border-purple-500/30 transition-all" data-testid="notification-settings">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-left">
              <div className="font-semibold">Notifications</div>
              <div className="text-sm text-muted-foreground">Reminders & alerts</div>
            </div>
          </div>
          <ChevronRight className="w-5 h-5 text-muted-foreground" />
        </button>
      </div>

      {/* Logout Button */}
      <Button
        onClick={handleLogout}
        className="w-full h-12 rounded-xl bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/20 font-semibold"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>

      {/* App Info */}
      <div className="mt-12 text-center text-sm text-muted-foreground animate-fade-in">
        <div className="mb-2">SmartSaveAI v1.0.0</div>
        <div>Financial Intelligence Platform</div>
      </div>
    </div>
  );
}