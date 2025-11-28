import React from 'react';
import { 
  LayoutDashboard, 
  Car, 
  Wallet, 
  Users, 
  Settings, 
  Share2, 
  Menu, 
  Bell, 
  Search,
  Zap,
  LogOut
} from 'lucide-react';
import { CompanySettings } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  companySettings: CompanySettings;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab, companySettings }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'vehicles', label: 'Veículos', icon: Car },
    { id: 'expenses', label: 'Gastos', icon: Wallet },
    { id: 'drivers', label: 'Motoristas', icon: Users },
    { id: 'settings', label: 'Configurações', icon: Settings },
  ];

  const handleShare = async () => {
    const shareData = {
      title: 'Gestão de Frotas',
      text: 'Confira o Gestão de Frotas! Sistema profissional para controlar veículos, gastos e manutenção.',
      url: window.location.href,
    };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareData.url);
        alert('Link copiado para a área de transferência!');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 text-slate-800 overflow-hidden font-sans">
      {/* Sidebar (Desktop) */}
      <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white shadow-xl z-20">
        <div className="p-6 flex items-center space-x-3 border-b border-slate-800">
          {companySettings.logoUrl ? (
            <img src={companySettings.logoUrl} alt="Logo" className="w-10 h-10 rounded object-cover bg-white" />
          ) : (
            <div className="w-10 h-10 rounded bg-blue-600 flex items-center justify-center font-bold text-lg">
              {companySettings.name.substring(0, 2).toUpperCase()}
            </div>
          )}
          <div className="flex flex-col">
            <span className="font-bold text-lg tracking-tight">{companySettings.name}</span>
            <span className="text-xs text-slate-400">Gestão de Frotas Enterprise</span>
          </div>
        </div>

        <nav className="flex-1 py-6 space-y-1 px-3">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
          
          <div className="pt-6 mt-6 border-t border-slate-800">
             <button
              onClick={handleShare}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
            >
              <Share2 size={20} />
              <span className="font-medium">Compartilhar App</span>
            </button>
          </div>
        </nav>

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <span className="text-xs font-bold">AD</span>
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium">Admin User</p>
              <p className="text-xs text-slate-500">admin@gestaodefrotas.com</p>
            </div>
            <LogOut size={16} className="text-slate-500 cursor-pointer hover:text-white" />
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white shadow-sm flex items-center justify-between px-4 md:px-8 z-10">
          <div className="flex items-center md:hidden">
            <Menu className="text-slate-600" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} />
            <span className="ml-3 font-bold text-slate-800">{companySettings.name}</span>
          </div>

          <div className="hidden md:flex items-center bg-slate-100 rounded-full px-4 py-2 w-96">
            <Search size={18} className="text-slate-400" />
            <input 
              type="text" 
              placeholder="Buscar veículos, motoristas ou despesas..." 
              className="bg-transparent border-none outline-none ml-2 w-full text-sm text-slate-900 placeholder-slate-400"
            />
          </div>

          <div className="flex items-center space-x-4">
            <button className="relative p-2 text-slate-500 hover:bg-slate-100 rounded-full transition-colors">
              <Bell size={20} />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="hidden md:block text-right">
              <p className="text-xs text-slate-500">Última sinc: Hoje, 14:30</p>
            </div>
          </div>
        </header>

        {/* Scrollable Content Area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 pb-24 md:pb-8 relative bg-slate-50">
           {children}
           
           {/* Footer */}
           <footer className="mt-12 py-6 border-t border-slate-200 text-center">
              <p className="text-slate-400 text-sm font-medium">
                Desenvolvido por Vanderlei Barros
              </p>
              <p className="text-slate-400 text-xs mt-1">
                Tecnologia • Gestão • Automação
              </p>
           </footer>
        </main>
        
        {/* Mobile Bottom Navigation */}
        <div className="md:hidden bg-white border-t border-slate-200 px-6 py-3 flex justify-between items-center fixed bottom-0 w-full z-30 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)]">
           {navItems.slice(0, 4).map(item => (
             <button 
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex flex-col items-center space-y-1 ${activeTab === item.id ? 'text-blue-600' : 'text-slate-400'}`}
             >
               <item.icon size={24} />
               <span className="text-[10px] font-medium">{item.label}</span>
             </button>
           ))}
            <button 
                onClick={handleShare}
                className={`flex flex-col items-center space-y-1 text-slate-400`}
             >
               <Share2 size={24} />
               <span className="text-[10px] font-medium">Share</span>
             </button>
        </div>
      </div>
    </div>
  );
};

export default Layout;