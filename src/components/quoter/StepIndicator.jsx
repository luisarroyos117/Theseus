import React from 'react';
import { useLanguage } from '@/lib/i18n';
import { motion } from 'framer-motion';

// When hasDesign=true, step 1 (Style) is already determined — we show steps 2–6 as 1–5
const ALL_LABELS = {
  es: ['Estilo', 'Espacio', 'Calidad', 'Elementos', 'Inversión', 'Cotización'],
  en: ['Style', 'Space', 'Quality', 'Elements', 'Investment', 'Quote'],
};

// Without design: steps 1–6 with labels: Style, Quality, Space, Elements, Investment, Quote
// (matching original mapping: 1=Style, 2=Tier, 3=Space, 4=Elements, 5=Investment, 6=Quote)
// But now steps are reordered: 1=Style, 2=Space, 3=Tier, 4=Elements, 5=Investment, 6=Quote
const STEP_LABELS = {
  es: ['Estilo', 'Espacio', 'Calidad', 'Elementos', 'Inversión', 'Cotización'],
  en: ['Style', 'Space', 'Quality', 'Elements', 'Investment', 'Quote'],
};

// When a design is pre-selected, step 1 is skipped — show only steps 2–6 (5 visible steps)
const DESIGN_STEP_LABELS = {
  es: ['Espacio', 'Calidad', 'Elementos', 'Inversión', 'Cotización'],
  en: ['Space', 'Quality', 'Elements', 'Investment', 'Quote'],
};

export default function StepIndicator({ currentStep, totalSteps = 6, hasDesign = false }) {
  const { lang } = useLanguage();

  if (hasDesign) {
    // Show 5 steps (2–6 of the real flow, displayed as 1–5)
    const labels = DESIGN_STEP_LABELS[lang] || DESIGN_STEP_LABELS.en;
    const visibleSteps = 5;
    // currentStep in real flow: 2=visible 1, 3=visible 2, etc.
    const visibleCurrent = currentStep - 1; // offset by 1

    return (
      <div className="w-full mb-6">
        <div className="flex items-center justify-between max-w-2xl mx-auto">
          {Array.from({ length: visibleSteps }, (_, i) => i + 1).map((num, i) => (
            <React.Fragment key={num}>
              <div className="flex flex-col items-center gap-2">
                <motion.div
                  initial={false}
                  animate={{
                    scale: visibleCurrent === num ? 1.15 : 1,
                    backgroundColor: visibleCurrent >= num ? 'hsl(38, 50%, 55%)' : 'hsl(220, 12%, 16%)',
                  }}
                  className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold font-body transition-colors"
                  style={{ color: visibleCurrent >= num ? 'hsl(220, 15%, 8%)' : 'hsl(220, 10%, 50%)' }}
                >
                  {num}
                </motion.div>
                <span className={`text-xs font-body hidden sm:block ${visibleCurrent >= num ? 'text-primary' : 'text-muted-foreground'}`}>
                  {labels[i]}
                </span>
              </div>
              {i < visibleSteps - 1 && (
                <div className="flex-1 h-px mx-1 sm:mx-2" style={{
                  background: visibleCurrent > num ? 'hsl(38, 50%, 55%)' : 'hsl(220, 12%, 18%)'
                }} />
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    );
  }

  // Default: show all 6 steps
  const labels = STEP_LABELS[lang] || STEP_LABELS.en;
  const steps = Array.from({ length: totalSteps }, (_, i) => i + 1);

  return (
    <div className="w-full mb-10">
      <div className="flex items-center justify-between max-w-3xl mx-auto">
        {steps.map((num, i) => (
          <React.Fragment key={num}>
            <div className="flex flex-col items-center gap-2">
              <motion.div
                initial={false}
                animate={{
                  scale: currentStep === num ? 1.15 : 1,
                  backgroundColor: currentStep >= num ? 'hsl(38, 50%, 55%)' : 'hsl(220, 12%, 16%)',
                }}
                className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold font-body transition-colors"
                style={{ color: currentStep >= num ? 'hsl(220, 15%, 8%)' : 'hsl(220, 10%, 50%)' }}
              >
                {num}
              </motion.div>
              <span className={`text-xs font-body hidden sm:block ${currentStep >= num ? 'text-primary' : 'text-muted-foreground'}`}>
                {labels[i]}
              </span>
            </div>
            {i < steps.length - 1 && (
              <div className="flex-1 h-px mx-1 sm:mx-2" style={{
                background: currentStep > num ? 'hsl(38, 50%, 55%)' : 'hsl(220, 12%, 18%)'
              }} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}