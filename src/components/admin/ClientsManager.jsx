import React, { useState } from 'react';
import { base44 } from '@/api/base44Client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { ChevronLeft } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'cotizacion', label: 'Cotización' },
  { value: 'en_diseno',  label: 'En Diseño' },
  { value: 'en_obra',    label: 'En Obra' },
  { value: 'entregado',  label: 'Entregado' },
];

const STATUS_COLORS = {
  cotizacion: 'rgba(240,237,232,0.4)',
  en_diseno:  '#c29b5a',
  en_obra:    '#60a5fa',
  entregado:  '#4ade80',
};

function ProjectEditor({ project, onSave, onClose }) {
  const [status, setStatus] = useState(project.status || 'cotizacion');
  const [progress, setProgress] = useState(project.progress_pct || 0);
  const [notes, setNotes] = useState(project.status_notes || '');
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (data) => base44.entities.ClientProject.update(project.id, data),
    onSuccess: () => { qc.invalidateQueries(['allClientProjects']); onSave(); },
  });

  return (
    <div style={{ background: '#111', border: '0.5px solid rgba(255,255,255,0.1)', padding: '24px 28px', marginBottom: 12 }}>
      <div style={{ fontSize: 14, fontWeight: 700, color: '#f0ede8', marginBottom: 20 }}>
        {project.design_name || 'Proyecto'} · {project.client_name || '—'}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <div>
          <label style={{ fontSize: 10, letterSpacing: '0.15em', color: 'rgba(240,237,232,0.35)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Status</label>
          <select value={status} onChange={e => setStatus(e.target.value)}
            style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.15)', padding: '10px 12px', color: STATUS_COLORS[status] || '#f0ede8', fontSize: 13 }}>
            {STATUS_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label style={{ fontSize: 10, letterSpacing: '0.15em', color: 'rgba(240,237,232,0.35)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>
            Avance: {progress}%
          </label>
          <input type="range" min={0} max={100} value={progress} onChange={e => setProgress(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#c29b5a' }} />
        </div>
      </div>
      <div style={{ marginBottom: 16 }}>
        <label style={{ fontSize: 10, letterSpacing: '0.15em', color: 'rgba(240,237,232,0.35)', textTransform: 'uppercase', display: 'block', marginBottom: 8 }}>Notas para el cliente</label>
        <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={3}
          placeholder="Mensaje visible al cliente sobre el estado de su proyecto..."
          style={{ width: '100%', background: 'rgba(255,255,255,0.05)', border: '0.5px solid rgba(255,255,255,0.15)', padding: '10px 12px', color: '#f0ede8', fontSize: 13, resize: 'vertical', boxSizing: 'border-box' }} />
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button onClick={() => mutation.mutate({ status, progress_pct: progress, status_notes: notes })}
          disabled={mutation.isPending}
          style={{ background: '#c29b5a', color: '#0a0a0a', border: 'none', padding: '10px 20px', fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
          {mutation.isPending ? 'Guardando...' : 'GUARDAR →'}
        </button>
        <button onClick={onClose}
          style={{ background: 'transparent', border: '0.5px solid rgba(255,255,255,0.15)', color: 'rgba(240,237,232,0.5)', padding: '10px 20px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
          CANCELAR
        </button>
      </div>
    </div>
  );
}

function ClientDetail({ user, allProjects, allLeads, onBack }) {
  const [editingProject, setEditingProject] = useState(null);

  const projects = allProjects.filter(p => p.user_id === user.id);
  const leads    = allLeads.filter(l => l.email === user.email);

  return (
    <div>
      <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: 'none', color: '#c29b5a', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', marginBottom: 28 }}>
        <ChevronLeft size={14} /> TODOS LOS CLIENTES
      </button>

      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 24, fontWeight: 800, color: '#f0ede8', letterSpacing: '-0.02em' }}>{user.full_name}</div>
        <div style={{ fontSize: 12, color: 'rgba(240,237,232,0.4)', marginTop: 4 }}>{user.email} {user.company ? `· ${user.company}` : ''}</div>
      </div>

      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: 16 }}>
          Proyectos ({projects.length})
        </div>
        {projects.length === 0 ? (
          <div style={{ fontSize: 13, color: 'rgba(240,237,232,0.3)', padding: '24px 0' }}>Sin proyectos.</div>
        ) : projects.map(p => (
          <div key={p.id}>
            {editingProject === p.id ? (
              <ProjectEditor project={p} onSave={() => setEditingProject(null)} onClose={() => setEditingProject(null)} />
            ) : (
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#f0ede8' }}>{p.design_name}</div>
                  <div style={{ fontSize: 11, color: STATUS_COLORS[p.status] || 'rgba(240,237,232,0.4)', marginTop: 3, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                    {STATUS_OPTIONS.find(s => s.value === p.status)?.label} · {p.progress_pct || 0}% · ${(p.total_investment_usd || 0).toLocaleString('en-US')} USD
                  </div>
                </div>
                <button onClick={() => setEditingProject(p.id)}
                  style={{ background: 'transparent', border: '0.5px solid rgba(194,155,90,0.35)', color: '#c29b5a', padding: '7px 14px', fontSize: 10, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer' }}>
                  EDITAR
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

      <div>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(240,237,232,0.4)', textTransform: 'uppercase', marginBottom: 16 }}>
          Cotizaciones ({leads.length})
        </div>
        {leads.length === 0 ? (
          <div style={{ fontSize: 13, color: 'rgba(240,237,232,0.3)', padding: '24px 0' }}>Sin cotizaciones.</div>
        ) : leads.map(l => (
          <div key={l.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '14px 0', borderBottom: '0.5px solid rgba(255,255,255,0.06)' }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f0ede8' }}>{l.quote_breakdown?.selectedDesignName || '—'}</div>
              <div style={{ fontSize: 11, color: 'rgba(240,237,232,0.4)', marginTop: 3 }}>{l.total_sqm || '?'} m² · {new Date(l.created_date).toLocaleDateString('es-MX')}</div>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#c29b5a' }}>${(l.estimated_investment_usd || 0).toLocaleString('en-US')}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function ClientsManager() {
  const [selectedUser, setSelectedUser] = useState(null);

  const { data: users = [] } = useQuery({
    queryKey: ['allUsers'],
    queryFn: () => base44.entities.User.list(),
  });

  const { data: allProjects = [] } = useQuery({
    queryKey: ['allClientProjects'],
    queryFn: () => base44.entities.ClientProject.list(),
  });

  const { data: allLeads = [] } = useQuery({
    queryKey: ['allLeads'],
    queryFn: () => base44.entities.Lead.list(),
  });

  const clients = users.filter(u => u.role === 'user');

  if (selectedUser) {
    return <ClientDetail user={selectedUser} allProjects={allProjects} allLeads={allLeads} onBack={() => setSelectedUser(null)} />;
  }

  return (
    <div>
      <div style={{ marginBottom: 28 }}>
        <h2 className="text-2xl font-bold text-foreground mb-1">Clientes</h2>
        <p className="text-sm text-muted-foreground">{clients.length} clientes registrados</p>
      </div>

      <div className="border border-border rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {['Nombre', 'Empresa', 'Email', 'Proyectos', 'Cotizaciones', 'Registro'].map(h => (
                <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {clients.length === 0 ? (
              <tr><td colSpan={6} className="text-center py-12 text-muted-foreground text-sm">Sin clientes registrados.</td></tr>
            ) : clients.map(u => {
              const projCount = allProjects.filter(p => p.user_id === u.id).length;
              const leadCount = allLeads.filter(l => l.email === u.email).length;
              return (
                <tr key={u.id} className="border-b border-border hover:bg-muted/20 cursor-pointer transition-colors" onClick={() => setSelectedUser(u)}>
                  <td className="px-4 py-3 font-medium text-foreground text-sm">{u.full_name || '—'}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{u.company || '—'}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">{u.email}</td>
                  <td className="px-4 py-3 text-sm text-foreground font-semibold">{projCount}</td>
                  <td className="px-4 py-3 text-sm text-foreground font-semibold">{leadCount}</td>
                  <td className="px-4 py-3 text-sm text-muted-foreground">
                    {u.created_date ? new Date(u.created_date).toLocaleDateString('es-MX') : '—'}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}