import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Users, LayoutGrid, Palette, DollarSign,
  LogOut, Menu, X, ChevronRight, UserCircle, Settings
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'leads',   icon: Users,       label_es: 'Leads',              label_en: 'Leads' },
  { id: 'designs', icon: LayoutGrid,  label_es: 'Proyectos',          label_en: 'Office Designs' },
  { id: 'pricing', icon: DollarSign,  label_es: 'Precios por Proyecto', label_en: 'Project Pricing' },
  { id: 'generalPricing', icon: DollarSign, label_es: 'Precios Generales', label_en: 'General Pricing' },
  { id: 'styles',  icon: Palette,     label_es: 'Estilos',            label_en: 'Styles' },
  { id: 'clients', icon: UserCircle,  label_es: 'Clientes',           label_en: 'Clients' },
  { id: 'siteConfig', icon: Settings, label_es: 'Configuración del Sitio', label_en: 'Site Configuration' },
];

export default function AdminLayout({ activeTab, onTabChange, children }) {
  const { user, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const lang = 'es';

  return (
    <div className="min-h-screen bg-background flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full z-50 w-64 bg-card border-r border-border flex flex-col
        transform transition-transform duration-200
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:relative lg:translate-x-0 lg:flex
      `}>
        {/* Logo */}
        <div className="h-16 flex items-center px-5 border-b border-border flex-shrink-0">
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-heading font-bold text-xs">T</span>
            </div>
            <span className="font-heading font-semibold text-foreground tracking-wide">THESEUS</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="ml-auto lg:hidden text-muted-foreground hover:text-foreground">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="px-3 py-2 flex-shrink-0">
          <p className="text-xs uppercase tracking-widest text-muted-foreground px-2 py-2 font-body">
            Backoffice
          </p>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const label = lang === 'es' ? item.label_es : item.label_en;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onTabChange(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-body transition-colors text-left
                  ${isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                  }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1">{label}</span>
                {isActive && <ChevronRight className="w-3.5 h-3.5" />}
              </button>
            );
          })}
        </nav>

        {/* User + logout */}
        <div className="p-3 border-t border-border flex-shrink-0">
          <div className="flex items-center gap-3 px-2 py-2 mb-1">
            <div className="w-7 h-7 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
              <span className="text-primary text-xs font-semibold">
                {user?.full_name?.[0]?.toUpperCase() || 'A'}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground truncate">{user?.full_name || 'Admin'}</p>
              <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
            </div>
          </div>
          <button
            onClick={() => logout()}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors font-body"
          >
            <LogOut className="w-4 h-4" />
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top bar (mobile) */}
        <div className="h-14 border-b border-border flex items-center px-4 gap-3 lg:hidden flex-shrink-0">
          <button onClick={() => setSidebarOpen(true)} className="text-muted-foreground hover:text-foreground">
            <Menu className="w-5 h-5" />
          </button>
          <span className="font-heading font-semibold text-foreground text-sm">
            {NAV_ITEMS.find(n => n.id === activeTab)?.[lang === 'es' ? 'label_es' : 'label_en']}
          </span>
        </div>

        {/* Page content */}
        <main className="flex-1 p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}