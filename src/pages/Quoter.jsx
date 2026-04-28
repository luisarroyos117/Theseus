import React, { useState, useMemo, useEffect } from 'react';
import { base44, base44Public } from '@/api/base44Client';
import { useQuery } from '@tanstack/react-query';
import { useLanguage } from '@/lib/i18n';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { getDesignStyles } from '@/lib/styleHelpers';

import { sendLeadEmails } from '@/functions/sendLeadEmails';
import Header from '@/components/shared/Header';
import GallerySection from '@/components/quoter/GallerySection';
import ConfigureSpace from '@/components/quoter/ConfigureSpace';
import QuoteResult from '@/components/quoter/QuoteResult';
import LeadCapture from '@/components/quoter/LeadCapture';
import DesignEntryChoice from '@/components/quoter/DesignEntryChoice';
import TierSelector from '@/components/quoter/TierSelector';
import SelectedDesignBadge from '@/components/quoter/SelectedDesignBadge';
import AuthModal from '@/components/client/AuthModal';
import ClientDashboard from '@/components/client/ClientDashboard';

// Compute breakdown from DesignPricing record, GeneralPricing (custom), or custom design
export function computeBreakdown(config, designPricing, selectedDesign, generalPricing) {
  if (!designPricing && !selectedDesign?.isCustom) return null;
  
  const {
    sqm = 0, directors = 0, managers = 0, operatives = 0,
    selectedAmenities = [], amenityCounts = {},
  } = config;

  // Auto-calculate m² from team if not entered
  const teamSqm = directors * 20 + managers * 12 + operatives * 7;
  const effectiveSqm = sqm > 0 ? sqm : (teamSqm || 100);

  // CUSTOM DESIGN PATH
  if (selectedDesign?.isCustom && generalPricing) {
    const has = (key) => (selectedAmenities || []).includes(key);
    const cnt = (key) => amenityCounts?.[key] || 1;
    
    const pricePerSqm = generalPricing.base_price_per_sqm || 0;
    const baseAmount = pricePerSqm * effectiveSqm;

    const items = [
      { key: 'base', label_es: `Base ${pricePerSqm.toLocaleString('en-US')}/m² × ${effectiveSqm}m²`, label_en: `Base $${pricePerSqm.toLocaleString('en-US')}/m² × ${effectiveSqm}m²`, amount: baseAmount, pricePerSqm, effectiveSqm },
      { key: 'directors', label_es: `${directors} Director${directors !== 1 ? 'es' : ''}`, label_en: `${directors} Director${directors !== 1 ? 's' : ''}`, amount: directors * (generalPricing.price_per_director || 0) },
      { key: 'managers', label_es: `${managers} Gerente${managers !== 1 ? 's' : ''}`, label_en: `${managers} Manager${managers !== 1 ? 's' : ''}`, amount: managers * (generalPricing.price_per_manager || 0) },
      { key: 'operatives', label_es: `${operatives} Operativo${operatives !== 1 ? 's' : ''}`, label_en: `${operatives} Operative${operatives !== 1 ? 's' : ''}`, amount: operatives * (generalPricing.price_per_operative || 0) },
      { key: 'bathrooms', label_es: `${cnt('bathrooms')} Baño${cnt('bathrooms') !== 1 ? 's' : ''}`, label_en: `${cnt('bathrooms')} Bathroom${cnt('bathrooms') !== 1 ? 's' : ''}`, amount: has('bathrooms') ? cnt('bathrooms') * (generalPricing.price_per_bathroom || 0) : 0 },
      { key: 'meeting', label_es: `${cnt('meeting')} Sala${cnt('meeting') !== 1 ? 's' : ''} de juntas`, label_en: `${cnt('meeting')} Meeting room${cnt('meeting') !== 1 ? 's' : ''}`, amount: has('meeting') ? cnt('meeting') * (generalPricing.price_per_meeting_room || 0) : 0 },
      { key: 'reception', label_es: 'Recepción', label_en: 'Reception', amount: has('reception') ? (generalPricing.price_reception || 0) : 0 },
      { key: 'kitchen', label_es: 'Cocineta', label_en: 'Kitchen', amount: has('kitchen') ? (generalPricing.price_kitchen || 0) : 0 },
      { key: 'dining', label_es: 'Comedor', label_en: 'Dining room', amount: has('dining') ? (generalPricing.price_dining || 0) : 0 },
      { key: 'server', label_es: 'Server / Site', label_en: 'Server room', amount: has('server') ? (generalPricing.price_server_room || 0) : 0 },
      { key: 'lounge', label_es: 'Lounge', label_en: 'Lounge', amount: has('lounge') ? (generalPricing.price_lounge || 0) : 0 },
      { key: 'ac', label_es: 'Aire Acondicionado', label_en: 'AC System', amount: has('ac') ? (generalPricing.price_ac || 0) : 0 },
      { key: 'it_screens', label_es: 'TI / Pantallas', label_en: 'IT / Screens', amount: has('it_screens') ? (generalPricing.price_it_screens || 0) : 0 },
      { key: 'fire', label_es: 'Contra Incendios', label_en: 'Fire protection', amount: has('fire') ? (generalPricing.price_fire_protection || 0) : 0 },
    ];

    const total = items.reduce((sum, i) => sum + (i.amount || 0), 0);
    return { items, total, effectiveSqm, pricePerSqm };
  }

  // REGULAR DESIGN PATH (DesignPricing)
  const has = (key) => (selectedAmenities || []).includes(key);
  const cnt = (key) => amenityCounts?.[key] || 1;

  const pricePerSqm = designPricing.base_price_usd || 0;
  const baseAmount = pricePerSqm * effectiveSqm;

  const items = [
    { key: 'base',       label_es: `Base ${pricePerSqm.toLocaleString('en-US')}/m² × ${effectiveSqm}m²`, label_en: `Base $${pricePerSqm.toLocaleString('en-US')}/m² × ${effectiveSqm}m²`, amount: baseAmount, pricePerSqm, effectiveSqm },
    { key: 'directors',  label_es: `${directors} Director${directors !== 1 ? 'es' : ''}`,  label_en: `${directors} Director${directors !== 1 ? 's' : ''}`,   amount: directors * (designPricing.price_per_director || 0) },
    { key: 'managers',   label_es: `${managers} Gerente${managers !== 1 ? 's' : ''}`,       label_en: `${managers} Manager${managers !== 1 ? 's' : ''}`,      amount: managers * (designPricing.price_per_manager || 0) },
    { key: 'operatives', label_es: `${operatives} Operativo${operatives !== 1 ? 's' : ''}`, label_en: `${operatives} Operative${operatives !== 1 ? 's' : ''}`,amount: operatives * (designPricing.price_per_operative || 0) },
    { key: 'bathrooms',  label_es: `${cnt('bathrooms')} Baño${cnt('bathrooms') !== 1 ? 's' : ''}`,      label_en: `${cnt('bathrooms')} Bathroom${cnt('bathrooms') !== 1 ? 's' : ''}`, amount: has('bathrooms') ? cnt('bathrooms') * (designPricing.price_per_bathroom || 0) : 0 },
    { key: 'meeting',    label_es: `${cnt('meeting')} Sala${cnt('meeting') !== 1 ? 's' : ''} de juntas`, label_en: `${cnt('meeting')} Meeting room${cnt('meeting') !== 1 ? 's' : ''}`,   amount: has('meeting') ? cnt('meeting') * (designPricing.price_per_meeting_room || 0) : 0 },
    { key: 'reception',  label_es: 'Recepción',          label_en: 'Reception',       amount: has('reception')  ? (designPricing.price_reception || 0) : 0 },
    { key: 'kitchen',    label_es: 'Cocineta',            label_en: 'Kitchen',         amount: has('kitchen')    ? (designPricing.price_kitchen || 0) : 0 },
    { key: 'dining',     label_es: 'Comedor',             label_en: 'Dining room',     amount: has('dining')     ? (designPricing.price_dining || 0) : 0 },
    { key: 'server',     label_es: 'Server / Site',       label_en: 'Server room',     amount: has('server')     ? (designPricing.price_server_room || 0) : 0 },
    { key: 'lounge',     label_es: 'Lounge',              label_en: 'Lounge',          amount: has('lounge')     ? (designPricing.price_lounge || 0) : 0 },
    { key: 'ac',         label_es: 'Aire Acondicionado',  label_en: 'AC System',       amount: has('ac')         ? (designPricing.price_ac || 0) : 0 },
    { key: 'it_screens', label_es: 'TI / Pantallas',      label_en: 'IT / Screens',    amount: has('it_screens') ? (designPricing.price_it_screens || 0) : 0 },
    { key: 'fire',       label_es: 'Contra Incendios',    label_en: 'Fire protection', amount: has('fire')       ? (designPricing.price_fire_protection || 0) : 0 },
  ];

  const total = items.reduce((sum, i) => sum + (i.amount || 0), 0);
  return { items, total, effectiveSqm, pricePerSqm };
}

// ── TICKER ──────────────────────────────────────────────────
const TICKER_ITEMS = ['Diseño ejecutivo', 'Obra civil', 'Mobiliario', 'Paneles acústicos', 'Wallcovering', 'AC · IT · Incendio', '30% anticipo', '12 meses sin intereses', 'Llave en mano'];

function Ticker() {
  const items = [...TICKER_ITEMS, ...TICKER_ITEMS];
  return (
    <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', borderBottom: '0.5px solid rgba(0,0,0,0.08)', overflow: 'hidden', padding: '11px 0', background: '#f8f7f4' }}>
      <style>{`@keyframes ticker{from{transform:translateX(0)}to{transform:translateX(-50%)}}`}</style>
      <div style={{ display: 'flex', gap: 48, whiteSpace: 'nowrap', animation: 'ticker 28s linear infinite' }}>
        {items.map((item, i) => (
          <span key={i} style={{ display: 'inline-flex', alignItems: 'center', gap: 10, fontSize: 11, letterSpacing: '0.12em', color: 'rgba(10,10,10,0.4)', textTransform: 'uppercase', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
            <span style={{ width: 4, height: 4, background: '#6b6b6b', display: 'inline-block', flexShrink: 0 }} />
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

// ── GEOMETRIC ACCENT ─────────────────────────────────────────
function GeometricAccent({ size = 120 }) {
  return (
    <div style={{ width: size, height: size, border: '0.5px solid rgba(100,100,100,0.25)', position: 'relative', flexShrink: 0, background: '#eeece8' }}>
      <div style={{ position: 'absolute', inset: '20%', border: '0.5px solid rgba(100,100,100,0.25)' }} />
      <div style={{ position: 'absolute', top: -3, left: -3, width: 6, height: 6, background: '#6b6b6b' }} />
    </div>
  );
}

// ── HERO SECTION ─────────────────────────────────────────────
function HeroSection({ heroImage, heroProjectName, heroProjectMeta, onStartQuote, lang, isLoading }) {
  return (
    <section style={{ paddingTop: 60 }}>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', minHeight: 'auto' }}>
        {/* Left */}
        <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(32px, 5vw, 64px)', gap: 32 }}>
          <style>{`
            @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
            .hero-el-1{animation:fadeUp 0.7s ease 0.1s both}
            .hero-el-2{animation:fadeUp 0.7s ease 0.25s both}
            .hero-el-3{animation:fadeUp 0.7s ease 0.4s both}
            .hero-el-4{animation:fadeUp 0.7s ease 0.55s both}
            .hero-el-5{animation:fadeUp 0.7s ease 0.7s both}
          `}</style>

          <div className="hero-el-1" style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ width: 36, height: 0.5, background: '#6b6b6b' }} />
            <span style={{ fontSize: 10, letterSpacing: '0.28em', color: '#6b6b6b', textTransform: 'uppercase', fontFamily: "'Helvetica Neue', Arial, sans-serif" }}>
              {lang === 'es' ? 'Interiorismo corporativo · CDMX' : 'Corporate interiors · Mexico City'}
            </span>
          </div>

          <h1 className="hero-el-2" style={{ fontSize: 'clamp(36px, 5vw, 56px)', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.05, color: '#0a0a0a', fontFamily: "'Helvetica Neue', Arial, sans-serif", margin: 0 }}>
            {lang === 'es' ? <>Tu oficina,<br /><span style={{ color: '#6b6b6b' }}>llave en mano.</span></> : <>Your office,<br /><span style={{ color: '#6b6b6b' }}>turnkey.</span></>}
          </h1>

          <p className="hero-el-3" style={{ fontSize: 14, color: 'rgba(10,10,10,0.45)', lineHeight: 1.7, maxWidth: 360, margin: 0 }}>
            {lang === 'es'
              ? 'Diseño, construcción, mobiliario y acabados. Un solo interlocutor, un precio fijo, un resultado.'
              : 'Design, construction, furniture and finishes. One contact, fixed price, one result.'}
          </p>

          <div className="hero-el-4" style={{ display: 'flex', gap: 12 }}>
            <button onClick={onStartQuote} style={{
              background: '#6b6b6b', color: '#ffffff', border: 'none', padding: '14px 28px',
              fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial, sans-serif", transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => e.target.style.opacity = '0.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              {lang === 'es' ? 'COTIZAR AHORA →' : 'GET QUOTE →'}
            </button>
            <button onClick={() => document.getElementById('lookbook')?.scrollIntoView({ behavior: 'smooth' })} style={{
              background: 'transparent', color: '#0a0a0a', border: '0.5px solid rgba(10,10,10,0.5)', padding: '14px 28px',
              fontSize: 12, fontWeight: 600, letterSpacing: '0.1em', textTransform: 'uppercase',
              cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial, sans-serif", transition: 'all 0.2s',
            }}
              onMouseEnter={e => { e.target.style.borderColor = '#6b6b6b'; e.target.style.color = '#6b6b6b'; }}
              onMouseLeave={e => { e.target.style.borderColor = 'rgba(10,10,10,0.5)'; e.target.style.color = '#0a0a0a'; }}
            >
              {lang === 'es' ? 'VER PROYECTOS' : 'VIEW PROJECTS'}
            </button>
          </div>

          {/* Stats */}
          <div className="hero-el-5" style={{ display: 'flex', gap: 40, paddingTop: 24, borderTop: '0.5px solid rgba(0,0,0,0.08)' }}>
            {[
              { num: '5+', label: lang === 'es' ? 'Proyectos' : 'Projects' },
              { num: '3', label: lang === 'es' ? 'Niveles' : 'Tiers' },
              { num: '24h', label: lang === 'es' ? 'Respuesta' : 'Response' },
            ].map(s => (
              <div key={s.num}>
                <div style={{ fontSize: 28, fontWeight: 800, color: '#0a0a0a', letterSpacing: '-0.03em', lineHeight: 1 }}>{s.num}</div>
                <div style={{ fontSize: 10, color: 'rgba(10,10,10,0.35)', textTransform: 'uppercase', letterSpacing: '0.12em', marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Right — image */}
         <div style={{ background: '#eeece8', position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '300px' }}>
          {isLoading ? (
            <div style={{ width: '100%', height: '100%', background: '#e8e6e0' }} />
          ) : heroImage ? (
            <img src={heroImage} alt="Office" loading="lazy" crossOrigin="anonymous" style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
              onError={(e) => { e.target.style.display='none'; e.target.parentElement.style.background='#e8e6e0'; }} />
          ) : (
            <GeometricAccent size={160} />
          )}
          <div style={{ position: 'absolute', bottom: 28, left: 28, right: 28 }}>
            <div style={{ display: 'inline-block', background: 'rgba(248,247,244,0.95)', padding: '14px 20px', backdropFilter: 'blur(8px)' }}>
              <div style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.02em', color: '#0a0a0a', lineHeight: 1.1 }}>
                {heroProjectName}
              </div>
              <div style={{ fontSize: 11, color: '#6b6b6b', marginTop: 4, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                {heroProjectMeta}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── HOW IT WORKS ─────────────────────────────────────────────
function HowItWorksSection({ lang }) {
  const steps = lang === 'es'
    ? [
        { num: '01', title: 'Elige tu estilo', desc: 'Navega nuestro lookbook y selecciona el diseño que mejor refleje tu marca.' },
        { num: '02', title: 'Configura tu espacio', desc: 'Ingresa tu área en m², equipo y amenidades. Obtenemos una cotización al instante.' },
        { num: '03', title: 'Cotización formal', desc: 'Nuestro equipo te envía una propuesta ejecutiva detallada en 24 horas.' },
        { num: '04', title: 'Inicio de obra', desc: 'Firmamos contrato y arrancamos. Tú solo recibes las llaves de tu nueva oficina.' },
      ]
    : [
        { num: '01', title: 'Choose your style', desc: 'Browse our lookbook and select the design that best reflects your brand.' },
        { num: '02', title: 'Configure your space', desc: 'Enter your m², team size and amenities. Get an instant quote.' },
        { num: '03', title: 'Formal quote', desc: 'Our team sends you a detailed executive proposal within 24 hours.' },
        { num: '04', title: 'Project start', desc: 'Sign contract and we begin. You just receive the keys to your new office.' },
      ];

  return (
    <section id="process" style={{ padding: '96px 0' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ marginBottom: 40 }}>
          <div style={{ fontSize: 10, letterSpacing: '0.25em', color: '#6b6b6b', textTransform: 'uppercase', marginBottom: 10 }}>
            {lang === 'es' ? 'Proceso' : 'Process'}
          </div>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.03em', color: '#f0ede8' }}>
            {lang === 'es' ? 'Cómo funciona' : 'How it works'}
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 1, background: 'rgba(0,0,0,0.08)' }}>
          {steps.map(step => (
            <div key={step.num} style={{ background: '#f8f7f4', padding: '36px 28px', borderLeft: '1px solid rgba(0,0,0,0.08)' }}>
              <div style={{ fontSize: 11, fontWeight: 800, color: '#6b6b6b', letterSpacing: '0.1em', marginBottom: 16 }}>{step.num}</div>
              <div style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em', color: '#0a0a0a', marginBottom: 10 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: 'rgba(10,10,10,0.45)', lineHeight: 1.6 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── FINANCING SECTION ─────────────────────────────────────────
function FinancingSection({ lang, onStartQuote }) {
  return (
    <section id="financing" style={{ padding: '0 0 96px' }}>
      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(0,0,0,0.08)' }}>
          {/* Left */}
          <div style={{ background: '#f0ede8', padding: '56px 48px', display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
            <div style={{ fontSize: 10, letterSpacing: '0.25em', color: '#6b6b6b', textTransform: 'uppercase' }}>
              {lang === 'es' ? 'Financiamiento' : 'Financing'}
            </div>
            <h2 style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: '#0a0a0a', lineHeight: 1.1, margin: 0 }}>
              {lang === 'es' ? 'Haz realidad tu oficina hoy' : 'Make your office a reality today'}
            </h2>
            <p style={{ fontSize: 14, color: 'rgba(10,10,10,0.45)', lineHeight: 1.7, margin: 0 }}>
              {lang === 'es'
                ? '30% de anticipo y 12 mensualidades sin intereses. Sin complicaciones, sin sorpresas.'
                : '30% down and 12 monthly payments interest-free. No complications, no surprises.'}
            </p>
            <button onClick={onStartQuote} style={{
              background: '#6b6b6b', color: '#ffffff', border: 'none', padding: '14px 28px', alignSelf: 'flex-start',
              fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
              cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial, sans-serif", transition: 'opacity 0.2s',
            }}
              onMouseEnter={e => e.target.style.opacity = '0.85'}
              onMouseLeave={e => e.target.style.opacity = '1'}
            >
              {lang === 'es' ? 'COTIZAR AHORA →' : 'GET QUOTE →'}
            </button>
          </div>
          {/* Right — stats */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 1, background: 'rgba(0,0,0,0.08)' }}>
            {[
              { num: '30%', label: lang === 'es' ? 'Anticipo inicial' : 'Initial down payment', sub: lang === 'es' ? 'Para arrancar la obra' : 'To start construction' },
              { num: '12', label: lang === 'es' ? 'Mensualidades' : 'Monthly payments', sub: '0% interés' },
              { num: '$0', label: lang === 'es' ? 'Intereses' : 'Interest', sub: lang === 'es' ? 'Completamente libre' : 'Completely free' },
              { num: '24h', label: lang === 'es' ? 'Tiempo de respuesta' : 'Response time', sub: lang === 'es' ? 'Propuesta formal' : 'Formal proposal' },
            ].map(stat => (
              <div key={stat.num} style={{ background: '#e8e6e0', padding: '32px 28px' }}>
                <div style={{ fontSize: 32, fontWeight: 800, color: '#6b6b6b', letterSpacing: '-0.03em', lineHeight: 1, marginBottom: 8 }}>{stat.num}</div>
                <div style={{ fontSize: 12, color: '#0a0a0a', fontWeight: 600, marginBottom: 4 }}>{stat.label}</div>
                <div style={{ fontSize: 11, color: 'rgba(10,10,10,0.35)' }}>{stat.sub}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── CONFIGURATOR SHELL ─────────────────────────────────────────
function ConfiguratorShell({ children, lang, step, selectedDesign, onChangeDesign, onBack, onNext, leadSaved, QUOTER_STEPS, subStep }) {
  const stepLabels = {
    es: ['Diseño', 'Espacio & Equipo', 'Cotización', 'Contacto'],
    en: ['Design', 'Space & Team', 'Quote', 'Contact'],
  };
  return (
    <div style={{ minHeight: '100vh', background: '#f8f7f4', paddingTop: 60 }}>
      {/* Configurator header strip */}
      <div style={{ borderBottom: '0.5px solid rgba(0,0,0,0.08)', padding: '20px 48px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(10,10,10,0.4)', textTransform: 'uppercase' }}>
          {lang === 'es' ? 'Configurador' : 'Configurator'}
        </div>
        {/* Step indicators */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
          {[1, 2, 3, 4].map((num, i) => (
            <React.Fragment key={num}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{
                  width: 28, height: 28, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: step >= num ? '#6b6b6b' : 'rgba(0,0,0,0.06)',
                  color: step >= num ? '#0a0a0a' : 'rgba(10,10,10,0.5)',
                  fontSize: 11, fontWeight: 700,
                }}>
                  {num}
                </div>
                <span style={{ fontSize: 10, letterSpacing: '0.1em', textTransform: 'uppercase', color: step >= num ? '#6b6b6b' : 'rgba(10,10,10,0.5)' }}>
                  {(stepLabels[lang] || stepLabels.en)[i]}
                </span>
              </div>
              {i < 3 && <div style={{ width: 32, height: '0.5px', background: step > num ? '#6b6b6b' : 'rgba(0,0,0,0.1)', margin: '0 12px' }} />}
            </React.Fragment>
          ))}
        </div>
        <button onClick={onChangeDesign} style={{ fontSize: 10, color: 'rgba(10,10,10,0.55)', letterSpacing: '0.1em', textTransform: 'uppercase', background: 'none', border: 'none', cursor: 'pointer' }}>
          ← {lang === 'es' ? 'GALERÍA' : 'GALLERY'}
        </button>
      </div>

      <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 32px 80px' }}>
        {selectedDesign && (
          <div style={{ marginBottom: 32, padding: '14px 20px', background: 'rgba(100,100,100,0.06)', border: '0.5px solid rgba(100,100,100,0.2)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <span style={{ fontSize: 10, color: '#6b6b6b', letterSpacing: '0.15em', textTransform: 'uppercase', marginRight: 12 }}>
                {lang === 'es' ? 'Diseño seleccionado' : 'Selected design'}
              </span>
              <span style={{ fontSize: 14, fontWeight: 700, color: '#0a0a0a' }}>
                {lang === 'es' ? selectedDesign.name_es : selectedDesign.name_en}
              </span>
            </div>
            <button onClick={onChangeDesign} style={{ fontSize: 10, color: 'rgba(10,10,10,0.35)', background: 'none', border: 'none', cursor: 'pointer', letterSpacing: '0.1em' }}>✕ CAMBIAR</button>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.2 }}>
            {children}
          </motion.div>
        </AnimatePresence>

        {!leadSaved && (
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 48, paddingTop: 24, borderTop: '0.5px solid rgba(0,0,0,0.07)' }}>
            <button onClick={onBack} style={{
              background: 'none', border: '0.5px solid rgba(0,0,0,0.12)', color: 'rgba(10,10,10,0.5)',
              padding: '11px 22px', fontSize: 11, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer',
              fontFamily: "'Helvetica Neue', Arial, sans-serif", display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <ChevronLeft size={14} />
              {step === 1 ? (lang === 'es' ? 'INICIO' : 'HOME') : (lang === 'es' ? 'ATRÁS' : 'BACK')}
            </button>
            {step === 1 && selectedDesign && (
              <button
                onClick={() => onNext()}
                style={{
                  background: '#6b6b6b',
                  color: '#0a0a0a',
                  border: 'none',
                  padding: '13px 32px',
                  fontSize: 12,
                  fontWeight: 700,
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  transition: 'opacity 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                {lang === 'es' ? 'VER COTIZACIÓN →' : 'SEE QUOTE →'}
                <ChevronRight size={14} />
              </button>
            )}
            {step === 2 && (
               <button onClick={onNext} style={{
                 background: '#6b6b6b', color: '#0a0a0a', border: 'none', padding: '13px 32px',
                 fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
                 cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial, sans-serif", display: 'flex', alignItems: 'center', gap: 8,
                 transition: 'opacity 0.2s',
               }}
                 onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                 onMouseLeave={e => e.currentTarget.style.opacity = '1'}
               >
                 {lang === 'es' ? 'VER COTIZACIÓN →' : 'SEE QUOTE →'}
                 <ChevronRight size={14} />
               </button>
             )}
          </div>
        )}
      </div>
    </div>
  );
}

// ── MAIN PAGE ─────────────────────────────────────────────────
const QUOTER_STEPS = 4;

export default function Quoter() {
  const { lang } = useLanguage();
  const [phase, setPhase] = useState('landing');
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState('entry'); // 'entry', 'gallery', 'tiers'
  const [selectedDesign, setSelectedDesign] = useState(null);
  const [spaceConfig, setSpaceConfig] = useState({
    spaceMode: 'have_space', sqm: 0, corridor: '',
    directors: 0, managers: 0, operatives: 0,
    selectedAmenities: [], amenityCounts: {},
  });
  const [leadSaved, setLeadSaved] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [modalDesign, setModalDesign] = useState(null);

  // Auth state
  const [currentUser, setCurrentUser] = useState(null);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [projectSaved, setProjectSaved] = useState(false);

  useEffect(() => {
    base44.auth.me().then(setCurrentUser).catch(() => setCurrentUser(null));
  }, []);

  const { data: designs = [], isLoading: isDesignsLoading } = useQuery({
    queryKey: ['officeDesigns'],
    queryFn: () => base44Public.entities.OfficeDesign.list('display_order'),
  });
  const { data: allDesignPricings = [] } = useQuery({
    queryKey: ['designPricings'],
    queryFn: () => base44.entities.DesignPricing.list(),
  });
  const { data: siteConfigRecords = [], isLoading: isSiteConfigLoading } = useQuery({
    queryKey: ['siteConfig'],
    queryFn: () => base44Public.entities.SiteConfig.list().catch(() => []),
  });
  const { data: allGeneralPricings = [] } = useQuery({
    queryKey: ['generalPricings'],
    queryFn: () => base44Public.entities.GeneralPricing.list('tier_key'),
  });

  const designPricing = useMemo(
    () => allDesignPricings.find(p => p.design_id === selectedDesign?.id) || null,
    [allDesignPricings, selectedDesign]
  );

  const generalPricing = useMemo(
    () => selectedDesign?.isCustom && selectedDesign?.tier ? allGeneralPricings.find(p => p.tier_key === selectedDesign.tier) : null,
    [allGeneralPricings, selectedDesign]
  );

  const breakdown = useMemo(() => computeBreakdown(spaceConfig, designPricing, selectedDesign, generalPricing), [spaceConfig, designPricing, selectedDesign, generalPricing]);

  // Fetch hero config from SiteConfig, with fallback to first design
  const heroImageConfig = siteConfigRecords.find(r => r.key === 'hero_image_url')?.value;
  const heroProjectNameConfig = siteConfigRecords.find(r => r.key === 'hero_project_name')?.value;
  const heroProjectMetaConfig = siteConfigRecords.find(r => r.key === 'hero_project_meta')?.value;
  
  const heroImage = heroImageConfig || designs.find(d => d.active !== false && d.photos?.length > 0)?.photos?.[0] || null;
  const defaultDesign = designs.find(d => d.active !== false && d.photos?.length > 0);
  const heroProjectName = heroProjectNameConfig || (defaultDesign ? (lang === 'es' ? (defaultDesign.name_es || defaultDesign.name_en) : (defaultDesign.name_en || defaultDesign.name_es)) : 'Premium Interiors');
  const heroProjectMeta = heroProjectMetaConfig || 'THESEUS · CDMX';

  const handleQuoteDesignFromModal = (design) => {
    setSelectedDesign(design);
    setModalDesign(null);
    setPhase('configurator');
    setStep(2);
    setSubStep('selected');
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const handleGallerySelect = (design) => {
    setSelectedDesign(design);
    setSubStep('gallery');
    setStep(1);
    setTimeout(() => document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const startConfigurator = (design) => {
    setSelectedDesign(design);
    setPhase('configurator');
    setStep(2);
    setSubStep('selected');
    setModalDesign(null);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const handleEntryChooseProject = () => {
    setSubStep('gallery');
    setStep(1);
  };

  const handleEntryChooseCustom = () => {
    setSubStep('tiers');
    setStep(1);
  };

  const handleSelectCustomTier = (customDesign) => {
    setSelectedDesign(customDesign);
    setSubStep('selected');
    setStep(2);
    setTimeout(() => document.getElementById('configurator')?.scrollIntoView({ behavior: 'smooth' }), 100);
  };

  const handleStartQuote = () => {
    setPhase('configurator');
    setStep(1);
    setSubStep('entry');
    setSelectedDesign(null);
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50);
  };

  const handleClearDesign = () => {
    setSelectedDesign(null);
    setPhase('landing');
    setStep(1);
    setSubStep('entry');
    setLeadSaved(false);
  };

  const handleLeadSubmit = async (contactInfo) => {
    setIsSubmitting(true);
    const leadData = {
      ...contactInfo,
      style_chosen: getDesignStyles(selectedDesign)?.[0] || null,
      total_sqm: breakdown?.effectiveSqm || 0,
      estimated_investment_usd: breakdown?.total || 0,
      space_mode: spaceConfig.spaceMode,
      preferred_zone: spaceConfig.corridor,
      team_directors: spaceConfig.directors,
      team_managers: spaceConfig.managers,
      team_operatives: spaceConfig.operatives,
      amenities: spaceConfig.selectedAmenities,
      quote_breakdown: { ...breakdown, selectedDesignId: selectedDesign?.id, selectedDesignName: selectedDesign?.name_es || selectedDesign?.name_en },
      status: 'new',
    };
    await base44.entities.Lead.create(leadData);
    sendLeadEmails({ lang, contactInfo, selectedDesign, breakdown, spaceConfig }).catch(() => {});

    // If user is logged in, also save as ClientProject
    if (currentUser) {
      try {
        await base44.entities.ClientProject.create({
          user_id: currentUser.id,
          client_name: contactInfo.full_name,
          client_company: contactInfo.company,
          design_id: selectedDesign?.id,
          design_name: selectedDesign?.name_es || selectedDesign?.name_en,
          style: selectedDesign?.style_key,
          total_investment_usd: breakdown?.total || 0,
          total_m2: breakdown?.effectiveSqm || 0,
          status: 'cotizacion',
          progress_pct: 0,
          quote_breakdown: leadData.quote_breakdown,
          team_config: { directors: spaceConfig.directors, managers: spaceConfig.managers, operatives: spaceConfig.operatives },
          amenities: spaceConfig.selectedAmenities,
          zone: spaceConfig.corridor,
        });
        setProjectSaved(true);
      } catch {}
    }

    setIsSubmitting(false);
    setLeadSaved(true);
  };

  const next = () => { if (step < QUOTER_STEPS) setStep(s => s + 1); };
  const back = () => {
    if (step === 1) { handleClearDesign(); return; }
    if (step === 2 && subStep !== 'gallery' && subStep !== 'tiers') { setStep(1); setSubStep('entry'); return; }
    setStep(s => s - 1);
  };

  const handleMyAccount = () => {
    if (currentUser) {
      setPhase('portal');
    } else {
      setShowAuthModal(true);
    }
  };

  const handleAuthSuccess = (user) => {
    setCurrentUser(user);
    setShowAuthModal(false);
    setPhase('portal');
  };

  const handleLogout = () => {
    base44.auth.logout();
    setCurrentUser(null);
    setPhase('landing');
  };

  const handleRequote = (lead) => {
    // Pre-fill configurator from a saved lead
    setSpaceConfig({
      spaceMode: lead.space_mode || 'have_space',
      sqm: lead.total_sqm || 0,
      corridor: lead.preferred_zone || '',
      directors: lead.team_directors || 0,
      managers: lead.team_managers || 0,
      operatives: lead.team_operatives || 0,
      selectedAmenities: lead.amenities || [],
      amenityCounts: {},
    });
    const designId = lead.quote_breakdown?.selectedDesignId;
    const found = designs.find(d => d.id === designId);
    if (found) setSelectedDesign(found);
    setLeadSaved(false);
    setProjectSaved(false);
    setStep(1);
    setSubStep('entry');
    setPhase('configurator');
    };

  // PORTAL PHASE
  if (phase === 'portal' && currentUser) {
    return (
      <>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />}
        <ClientDashboard
          user={currentUser}
          onLogout={handleLogout}
          onStartQuote={() => { setPhase('configurator'); setStep(1); setLeadSaved(false); setProjectSaved(false); }}
          onRequote={handleRequote}
        />
      </>
    );
  }

  // CONFIGURATOR PHASE
  if (phase === 'configurator') {
    return (
      <>
        {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />}
        <Header onLogoClick={handleClearDesign} user={currentUser} onMyAccount={handleMyAccount} onLogout={handleLogout} />
        <ConfiguratorShell lang={lang} step={step} selectedDesign={selectedDesign} onChangeDesign={() => { setStep(1); setSubStep('entry'); }} onBack={back} onNext={next} leadSaved={leadSaved} QUOTER_STEPS={QUOTER_STEPS}>
          {step === 1 && subStep === 'entry' && <DesignEntryChoice onChooseProject={handleEntryChooseProject} onChooseCustom={handleEntryChooseCustom} />}
          {step === 1 && subStep === 'gallery' && <GallerySection designs={designs} onSelect={handleGallerySelect} selectedDesignId={selectedDesign?.id} view="configurator" setModalDesign={setModalDesign} modalDesign={modalDesign} onModalQuoteClick={handleQuoteDesignFromModal} />}
          {step === 1 && subStep === 'tiers' && <TierSelector onSelectTier={handleSelectCustomTier} />}
          {step === 2 && <ConfigureSpace config={spaceConfig} onChange={setSpaceConfig} breakdown={breakdown} designPricing={designPricing} />}
          {step === 3 && <QuoteResult breakdown={breakdown} selectedDesign={selectedDesign} spaceConfig={spaceConfig} onNext={next} />}
          {step === 4 && (
            <>
              <LeadCapture onSubmit={handleLeadSubmit} isSubmitting={isSubmitting} isSuccess={leadSaved} breakdown={breakdown} selectedDesign={selectedDesign} spaceConfig={spaceConfig} />
              {leadSaved && !currentUser && (
                <div style={{ marginTop: 24, padding: '20px 24px', background: 'rgba(100,100,100,0.05)', border: '0.5px solid rgba(100,100,100,0.25)' }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: '#6b6b6b', marginBottom: 6, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                    ¿Quieres guardar esta cotización?
                  </div>
                  <div style={{ fontSize: 12, color: 'rgba(240,237,232,0.5)', marginBottom: 14 }}>
                    Crea tu cuenta sin costo para seguir el avance de tu proyecto.
                  </div>
                  <button onClick={() => setShowAuthModal(true)} style={{
                    background: '#6b6b6b', color: '#0a0a0a', border: 'none', padding: '10px 20px',
                    fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                    cursor: 'pointer', fontFamily: "'Helvetica Neue', Arial, sans-serif",
                  }}>
                    CREAR CUENTA SIN COSTO →
                  </button>
                </div>
              )}
              {leadSaved && currentUser && projectSaved && (
                <div style={{ marginTop: 20, padding: '14px 18px', background: 'rgba(34,197,94,0.07)', border: '0.5px solid rgba(34,197,94,0.25)', display: 'flex', alignItems: 'center', gap: 10 }}>
                  <span style={{ color: '#4ade80', fontSize: 14 }}>✓</span>
                  <span style={{ fontSize: 12, color: '#4ade80' }}>Guardado en tu cuenta · <button onClick={() => setPhase('portal')} style={{ background: 'none', border: 'none', color: '#4ade80', cursor: 'pointer', textDecoration: 'underline', fontSize: 12, padding: 0 }}>Ver mis proyectos</button></span>
                </div>
              )}
            </>
          )}
        </ConfiguratorShell>
      </>
    );
  }

  // LANDING PHASE
  return (
    <div style={{ background: '#f8f7f4', minHeight: '100vh', fontFamily: "'Helvetica Neue', Arial, sans-serif", color: '#0a0a0a' }}>
      {showAuthModal && <AuthModal onClose={() => setShowAuthModal(false)} onSuccess={handleAuthSuccess} />}
      <Header onLogoClick={handleClearDesign} onStartQuote={handleStartQuote} user={currentUser} onMyAccount={handleMyAccount} onLogout={handleLogout} />

      <HeroSection heroImage={heroImage} heroProjectName={heroProjectName} heroProjectMeta={heroProjectMeta} onStartQuote={handleStartQuote} lang={lang} isLoading={isDesignsLoading || isSiteConfigLoading} />

      <Ticker />

      <GallerySection
        designs={designs}
        onSelect={handleGallerySelect}
        view="home"
        setModalDesign={setModalDesign}
        modalDesign={modalDesign}
        onModalQuoteClick={handleQuoteDesignFromModal}
      />

      <HowItWorksSection lang={lang} />

      <FinancingSection lang={lang} onStartQuote={handleStartQuote} />

      {/* Footer */}
      <div style={{ borderTop: '0.5px solid rgba(0,0,0,0.08)', padding: '24px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 800, letterSpacing: '0.18em', color: 'rgba(10,10,10,0.55)', textTransform: 'uppercase' }}>THESEUS</span>
        <span style={{ fontSize: 10, color: 'rgba(10,10,10,0.5)' }}>© {new Date().getFullYear()} Todos los derechos reservados</span>
      </div>
    </div>
  );
}