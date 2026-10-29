import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TrendingUp, 
  Search, 
  GitBranch, 
  BarChart3, 
  Settings 
} from 'lucide-react';

const Layout = ({ children }) => {
  const location = useLocation();

  const navItems = [
    { path: '/', label: 'Overview', icon: LayoutDashboard },
    { path: '/gift-nifty', label: 'GIFT Nifty', icon: TrendingUp },
    { path: '/scanner', label: 'Scanner', icon: Search },
    { path: '/correlation', label: 'Correlation', icon: GitBranch },
    { path: '/backtest', label: 'Backtest', icon: BarChart3 },
    { path: '/settings', label: 'Settings', icon: Settings },
  ];

  return (
    <div className="flex h-screen bg-trading-bg">
      {/* Sidebar */}
      <aside className="w-64 bg-trading-card border-r border-trading-border flex flex-col">
        <div className="p-4 border-b border-trading-border">
          <h1 className="text-lg font-semibold text-trading-text">
            GIFT Nifty → NSE
          </h1>
          <p className="text-xs text-trading-textMuted mt-1">
            Market Intelligence Terminal
          </p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;
            
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-trading-accent text-white'
                    : 'text-trading-textMuted hover:bg-trading-border hover:text-trading-text'
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
        
        <div className="p-4 border-t border-trading-border">
          <div className="text-xs text-trading-textMuted">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span>System Online</span>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;
