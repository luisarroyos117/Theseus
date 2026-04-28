import React, { useState } from 'react';
import { useAuth } from '@/lib/AuthContext';
import AdminGuard from '@/components/admin/AdminGuard';
import AdminLayout from '@/components/admin/AdminLayout';
import LeadsDashboard from '@/components/admin/LeadsDashboard';
import OfficeDesignsManager from '@/components/admin/OfficeDesignsManager';
import StylesManager from '@/components/admin/StylesManager';
import DesignPricingManager from '@/components/admin/DesignPricingManager';
import GeneralPricingManager from '@/components/admin/GeneralPricingManager';
import ClientsManager from '@/components/admin/ClientsManager';
import SiteConfigManager from '@/components/admin/SiteConfigManager';

const ADMIN_DARK_THEME = `
  .admin-root, .admin-root * { 
    background-color: #0a0a0a !important; 
    color: #f0ede8 !important;
    border-color: rgba(255,255,255,0.15) !important;
  }
  .admin-root input, 
  .admin-root textarea, 
  .admin-root select,
  .admin-root [class*="input"],
  .admin-root [class*="textarea"] {
    background-color: #1a1a1a !important;
    color: #f0ede8 !important;
    border: 0.5px solid rgba(255,255,255,0.2) !important;
    font-weight: 600 !important;
  }
  .admin-root button,
  .admin-root [role="button"] {
    background-color: #222222 !important;
    color: #f0ede8 !important;
    font-weight: 700 !important;
    border-color: rgba(255,255,255,0.15) !important;
  }
  .admin-root table { 
    background-color: #0a0a0a !important;
    border-color: rgba(255,255,255,0.1) !important;
  }
  .admin-root th { 
    background-color: #1a1a1a !important;
    color: #f0ede8 !important;
    font-weight: 700 !important;
    border-color: rgba(255,255,255,0.1) !important;
  }
  .admin-root td {
    background-color: #0f0f0f !important;
    color: #f0ede8 !important;
    border-color: rgba(255,255,255,0.06) !important;
    font-weight: 600 !important;
  }
  .admin-root label {
    color: #f0ede8 !important;
    font-weight: 700 !important;
  }
  .admin-root [class*="badge"],
  .admin-root [class*="chip"] {
    background-color: rgba(255,255,255,0.1) !important;
    color: #f0ede8 !important;
    border-color: rgba(255,255,255,0.2) !important;
  }
  .admin-root [class*="dialog"],
  .admin-root [class*="modal"] {
    background-color: #1a1a1a !important;
    color: #f0ede8 !important;
    border-color: rgba(255,255,255,0.15) !important;
  }
  .admin-root [class*="muted"] {
    color: rgba(240,237,232,0.6) !important;
  }
`;

export default function Admin() {
  const [activeTab, setActiveTab] = useState('leads');
  const { user, isLoadingAuth } = useAuth();

  // Only admin can access
  if (isLoadingAuth) return null;
  if (!user || user.role !== 'admin') {
    window.location.href = '/';
    return null;
  }

  return (
    <>
      <style>{ADMIN_DARK_THEME}</style>
      <AdminGuard>
        <div className="admin-root" style={{ backgroundColor: '#0a0a0a', color: '#f0ede8', minHeight: '100vh' }}>
          <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
          {activeTab === 'leads'    && <LeadsDashboard />}
          {activeTab === 'designs'  && <OfficeDesignsManager />}
          {activeTab === 'pricing'  && <DesignPricingManager />}
          {activeTab === 'generalPricing'  && <GeneralPricingManager />}
          {activeTab === 'styles'   && <StylesManager />}
          {activeTab === 'clients'  && <ClientsManager />}
          {activeTab === 'siteConfig' && <SiteConfigManager />}
        </AdminLayout>
        </div>
      </AdminGuard>
    </>
  );
}