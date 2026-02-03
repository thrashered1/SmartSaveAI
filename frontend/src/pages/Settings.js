import { User, Bell, Shield, Globe, Moon, ChevronRight } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-md mx-auto min-h-screen bg-background p-6 pb-24">
      {/* Header */}
      <div className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-bold tracking-tight mb-2" data-testid="settings-title">Settings</h1>
        <p className="text-sm text-muted-foreground">Manage your preferences</p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-6 animate-fade-in">
        {/* Profile */}
        <div className="bg-card border border-border/50 rounded-3xl p-1">
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 rounded-3xl transition-colors" data-testid="profile-settings">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Profile</div>
                <div className="text-sm text-muted-foreground">Manage your account</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Notifications */}
        <div className="bg-card border border-border/50 rounded-3xl p-1">
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 rounded-3xl transition-colors" data-testid="notification-settings">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Bell className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Notifications</div>
                <div className="text-sm text-muted-foreground">Reminders & alerts</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Privacy & Security */}
        <div className="bg-card border border-border/50 rounded-3xl p-1">
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 rounded-3xl transition-colors" data-testid="privacy-settings">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Privacy & Security</div>
                <div className="text-sm text-muted-foreground">Data & permissions</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Language & Region */}
        <div className="bg-card border border-border/50 rounded-3xl p-1">
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 rounded-3xl transition-colors" data-testid="language-settings">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Globe className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Language & Region</div>
                <div className="text-sm text-muted-foreground">Currency: EUR (€)</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Theme */}
        <div className="bg-card border border-border/50 rounded-3xl p-1">
          <button className="w-full flex items-center justify-between p-4 hover:bg-secondary/50 rounded-3xl transition-colors" data-testid="theme-settings">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <Moon className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <div className="font-semibold">Appearance</div>
                <div className="text-sm text-muted-foreground">Dark Mode (Default)</div>
              </div>
            </div>
            <ChevronRight className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>
      </div>

      {/* App Info */}
      <div className="mt-12 text-center text-sm text-muted-foreground animate-fade-in">
        <div className="mb-2">SmartSaveAI v1.0.0</div>
        <div>Your Savage Financial Coach</div>
      </div>
    </div>
  );
}