import React from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Download, Loader2, Trash2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';

const statusColors = {
  new: 'text-xs',
  contacted: 'text-xs',
  quoted: 'text-xs',
  closed: 'text-xs',
};

const statusBgColors = {
  new: { background: 'rgba(107,114,128,0.2)', color: '#9ca3af', border: 'rgba(107,114,128,0.3)' },
  contacted: { background: 'rgba(59,130,246,0.2)', color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  quoted: { background: 'rgba(245,158,11,0.2)', color: '#fbbf24', border: 'rgba(245,158,11,0.3)' },
  closed: { background: 'rgba(16,185,129,0.2)', color: '#34d399', border: 'rgba(16,185,129,0.3)' },
};

export default function LeadsDashboard() {
  const { t, lang } = useLanguage();
  const queryClient = useQueryClient();

  const { data: leads, isLoading } = useQuery({
    queryKey: ['leads'],
    queryFn: () => base44.entities.Lead.list('-created_date', 100),
    initialData: [],
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, ...data }) => base44.entities.Lead.update(id, data),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  const deleteMutation = useMutation({
    mutationFn: (id) => base44.entities.Lead.delete(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['leads'] }),
  });

  const handleDelete = (lead) => {
    if (confirm(`¿Borrar lead de ${lead.full_name}?`)) {
      deleteMutation.mutate(lead.id);
    }
  };

  function fmtUSD(n) {
    if (!n) return '—';
    return '$' + Math.round(n).toLocaleString('en-US') + ' USD';
  }

  const exportCSV = () => {
    const headers = ['Date', 'Name', 'Company', 'Email', 'Phone', 'Style', 'm²', 'Investment USD', 'Status'];
    const rows = leads.map(l => [
      l.created_date ? format(new Date(l.created_date), 'yyyy-MM-dd') : '',
      l.full_name, l.company, l.email, l.phone, l.style_chosen,
      l.total_sqm, l.estimated_investment_usd, l.status,
    ]);
    const csv = [headers.join(','), ...rows.map(r => r.map(v => `"${v || ''}"`).join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `theseus-leads-${format(new Date(), 'yyyy-MM-dd')}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  if (isLoading) return <div className="flex justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-primary" /></div>;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-sm font-body" style={{ color: 'rgba(240,237,232,0.6)' }}>{leads.length} leads</p>
        <Button onClick={exportCSV} className="font-body text-sm gap-2" style={{ background: 'rgba(255,255,255,0.08)', color: '#f0ede8', border: '0.5px solid rgba(255,255,255,0.15)', fontWeight: 600 }}>
          <Download className="w-4 h-4" /> {t('admin.export')}
        </Button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm font-body">
          <thead>
            <tr style={{ borderBottom: '0.5px solid rgba(255,255,255,0.1)', background: '#1a1a1a' }}>
              <th className="text-left py-3 px-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>{lang === 'es' ? 'Fecha' : 'Date'}</th>
              <th className="text-left py-3 px-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>{lang === 'es' ? 'Nombre' : 'Name'}</th>
              <th className="text-left py-3 px-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>{lang === 'es' ? 'Empresa' : 'Company'}</th>
              <th className="text-left py-3 px-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>Email</th>
              <th className="text-left py-3 px-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>WhatsApp</th>
              <th className="text-left py-3 px-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>{lang === 'es' ? 'Estilo' : 'Style'}</th>
              <th className="text-left py-3 px-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>m²</th>
              <th className="text-left py-3 px-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>{lang === 'es' ? 'Inversión' : 'Investment'}</th>
              <th className="text-left py-3 px-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>{lang === 'es' ? 'Anticipo' : 'Down Pmt'}</th>
              <th className="text-left py-3 px-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>{lang === 'es' ? 'Mensualidad' : 'Monthly'}</th>
              <th className="text-left py-3 px-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>{lang === 'es' ? 'Financ.' : 'Financ.'}</th>
               <th className="text-left py-3 px-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}>{t('admin.status')}</th>
               <th className="text-left py-3 px-3 font-medium" style={{ color: '#f0ede8', fontWeight: 700 }}></th>
              </tr>
          </thead>
          <tbody>
            {leads.map((lead, idx) => (
              <tr key={lead.id} style={{ background: idx % 2 === 0 ? '#0f0f0f' : '#111111', borderBottom: '0.5px solid rgba(255,255,255,0.06)', transition: 'background 0.2s' }} onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'} onMouseLeave={e => e.currentTarget.style.background = idx % 2 === 0 ? '#0f0f0f' : '#111111'}>
                <td className="py-3 px-3" style={{ color: 'rgba(240,237,232,0.6)' }}>
                  {lead.created_date ? format(new Date(lead.created_date), 'dd/MM/yy') : ''}
                </td>
                <td className="py-3 px-3 font-medium" style={{ color: '#f0ede8', fontWeight: 600 }}>{lead.full_name}</td>
                <td className="py-3 px-3" style={{ color: 'rgba(240,237,232,0.6)' }}>{lead.company}</td>
                <td className="py-3 px-3" style={{ color: 'rgba(240,237,232,0.6)' }}>{lead.email}</td>
                <td className="py-3 px-3" style={{ color: 'rgba(240,237,232,0.6)' }}>{lead.phone}</td>
                <td className="py-3 px-3 capitalize" style={{ color: '#f0ede8', fontWeight: 600 }}>{lead.style_chosen}</td>
                <td className="py-3 px-3" style={{ color: '#f0ede8', fontWeight: 600 }}>{lead.total_sqm}</td>
                <td className="py-3 px-3 font-semibold" style={{ color: '#fbbf24' }}>
                  ${lead.estimated_investment_usd?.toLocaleString()}
                </td>
                <td className="py-3 px-3 text-xs" style={{ color: '#f0ede8', fontWeight: 600 }}>
                  {fmtUSD(lead.estimated_investment_usd * 0.30)}
                </td>
                <td className="py-3 px-3 text-xs" style={{ color: '#f0ede8', fontWeight: 600 }}>
                  {fmtUSD((lead.estimated_investment_usd * 0.70) / 12)}
                </td>
                <td className="py-3 px-3">
                  <Switch
                    checked={!!lead.financing_requested}
                    onCheckedChange={v => updateMutation.mutate({ id: lead.id, financing_requested: v })}
                  />
                </td>
                <td className="py-3 px-3">
                  <Select
                    value={lead.status || 'new'}
                    onValueChange={v => updateMutation.mutate({ id: lead.id, status: v })}
                  >
                    <SelectTrigger className="h-7 w-28 text-xs border-0 bg-transparent p-0">
                      <Badge variant="outline" className={statusColors[lead.status || 'new']} style={{ ...statusBgColors[lead.status || 'new'], border: `0.5px solid ${statusBgColors[lead.status || 'new'].border}` }}>
                        {lead.status || 'new'}
                      </Badge>
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="contacted">Contacted</SelectItem>
                      <SelectItem value="quoted">Quoted</SelectItem>
                      <SelectItem value="closed">Closed</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="py-3 px-3 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDelete(lead)}
                    disabled={deleteMutation.isPending}
                    style={{ color: '#ff6b6b' }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </td>
                </tr>
            ))}
          </tbody>
        </table>
        {leads.length === 0 && (
          <div className="text-center py-12 font-body" style={{ color: 'rgba(240,237,232,0.5)' }}>
            {lang === 'es' ? 'No hay leads aún' : 'No leads yet'}
          </div>
        )}
      </div>
    </div>
  );
}