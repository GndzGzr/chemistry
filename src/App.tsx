import { useState, useEffect } from 'react';
import Step1EnergyBands from './components/Step1EnergyBands';
import Step2SiliconLattice from './components/Step2SiliconLattice';
import Step3Doping from './components/Step3Doping';
import Step4ChargeCarriers from './components/Step4ChargeCarriers';
import Step5PNJunction from './components/Step5PNJunction';
import Step6LED from './components/Step6LED';

const STEPS = [
  { id: 1, title: 'Enerji Bantları', subtitle: 'İletken, Yalıtkan, Yarı İletken' },
  { id: 2, title: 'Kristal Örgü', subtitle: 'Silisyum Kafes Yapısı' },
  { id: 3, title: 'Doping', subtitle: 'Safsızlık Ekleme' },
  { id: 4, title: 'Yük Taşıyıcılar', subtitle: 'N-Tipi ve P-Tipi' },
  { id: 5, title: 'P-N Eklemi', subtitle: 'İleri ve Ters Besleme' },
  { id: 6, title: 'LED', subtitle: 'Modern Uygulama' },
];

const STEP_COMPONENTS = [
  Step1EnergyBands,
  Step2SiliconLattice,
  Step3Doping,
  Step4ChargeCarriers,
  Step5PNJunction,
  Step6LED,
];

export default function App() {
  const [currentStep, setCurrentStep] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const StepComponent = STEP_COMPONENTS[currentStep];

  useEffect(() => {
    const check = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (mobile) setIsSidebarOpen(false);
    };
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const handleStepClick = (i: number) => {
    setCurrentStep(i);
    if (isMobile) setIsSidebarOpen(false);
  };

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-surface)', fontFamily: 'var(--font-sans)' }}>
      {/* Mobile overlay */}
      {isMobile && isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          style={{
            position: 'fixed', inset: 0, zIndex: 40,
            background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)',
          }}
        />
      )}

      {/* Sidebar */}
      <aside style={{
        position: 'fixed', top: 0, left: 0, height: '100%', zIndex: 50,
        width: '20rem', display: 'flex', flexDirection: 'column',
        background: 'var(--color-surface)', borderRight: '1px solid var(--color-border)',
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        transition: 'transform 0.3s ease',
      }}>
        {/* Logo + close */}
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '1.5rem', borderBottom: '1px solid var(--color-border)',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <div style={{
              width: '2.75rem', height: '2.75rem', borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #00D4FF, #FF3B5C)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              boxShadow: '0 0 24px rgba(0,212,255,0.3)',
            }}>
              <svg width="22" height="22" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="3" stroke="white" strokeWidth="1.5" fill="none" />
                <circle cx="8" cy="3" r="1.2" fill="white" />
                <circle cx="12.3" cy="10.5" r="1.2" fill="white" />
                <circle cx="3.7" cy="10.5" r="1.2" fill="white" />
              </svg>
            </div>
            <div>
              <div style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-text)' }}>Kumun Zekası</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--color-text-tertiary)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Yarı İletken Lab</div>
            </div>
          </div>
          <button onClick={() => setIsSidebarOpen(false)} style={{
            width: '2.25rem', height: '2.25rem', borderRadius: '0.5rem',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            background: 'transparent', border: 'none', color: 'var(--color-text-tertiary)',
            cursor: 'pointer', transition: 'color 0.2s',
          }}>
            <svg width="20" height="20" viewBox="0 0 18 18" fill="none">
              <path d="M5 5L13 13M13 5L5 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {/* Topics */}
        <nav style={{ flex: 1, padding: '1.5rem 0', overflowY: 'auto' }}>
          <p style={{
            padding: '0 1.5rem', marginBottom: '1rem', fontSize: '0.65rem',
            fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase',
            color: 'var(--color-text-tertiary)',
          }}>Konu Başlıkları</p>
          <ul style={{ listStyle: 'none', padding: '0 0.75rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            {STEPS.map((step, i) => {
              const isActive = i === currentStep;
              const isCompleted = i < currentStep;
              return (
                <li key={step.id}>
                  <button
                    onClick={() => handleStepClick(i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', gap: '0.875rem',
                      padding: '0.875rem 1rem', borderRadius: '0.75rem', border: 'none',
                      textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                      background: isActive ? 'rgba(0,212,255,0.08)' : 'transparent',
                      color: isActive ? '#00D4FF' : 'var(--color-text-secondary)',
                    }}
                  >
                    <span style={{
                      width: '2rem', height: '2rem', borderRadius: '0.5rem',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.8rem', fontWeight: 700, flexShrink: 0,
                      background: isActive ? '#00D4FF' : isCompleted ? 'rgba(34,197,94,0.2)' : 'var(--color-surface-3)',
                      color: isActive ? '#000' : isCompleted ? '#34D399' : 'var(--color-text-tertiary)',
                      boxShadow: isActive ? '0 0 14px rgba(0,212,255,0.4)' : 'none',
                    }}>
                      {isCompleted ? '✓' : step.id}
                    </span>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ fontSize: '0.875rem', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{step.title}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--color-text-tertiary)', marginTop: '2px' }}>{step.subtitle}</div>
                    </div>
                    {isActive && <div style={{ marginLeft: 'auto', width: '3px', height: '1.25rem', borderRadius: '999px', background: '#00D4FF', boxShadow: '0 0 8px rgba(0,212,255,0.4)', flexShrink: 0 }} />}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Main content wrapper */}
      <div style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        marginLeft: !isMobile && isSidebarOpen ? '20rem' : '0',
        transition: 'margin-left 0.3s ease',
      }}>
        {/* Top bar */}
        <header style={{
          position: 'sticky', top: 0, zIndex: 20,
          borderBottom: '1px solid var(--color-border)',
          background: 'rgba(5,5,7,0.8)', backdropFilter: 'blur(16px)',
          padding: '1.25rem 2rem', display: 'flex', alignItems: 'center', gap: '1.25rem',
        }}>
          {(isMobile || !isSidebarOpen) && (
            <button onClick={() => setIsSidebarOpen(true)} style={{
              width: '2.5rem', height: '2.5rem', borderRadius: '0.5rem',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'transparent', border: 'none', color: 'var(--color-text-tertiary)',
              cursor: 'pointer',
            }}>
              <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
                <path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </button>
          )}

          <span style={{
            fontSize: '0.8rem', fontFamily: 'monospace', letterSpacing: '0.1em',
            color: '#00D4FF', background: 'rgba(0,212,255,0.08)',
            padding: '0.375rem 0.75rem', borderRadius: '0.5rem',
          }}>ADIM {STEPS[currentStep].id}/6</span>

          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, color: 'var(--color-text)', letterSpacing: '-0.02em' }}>
            {STEPS[currentStep].title}
          </h2>

          <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            {STEPS.map((_, i) => (
              <button key={i} onClick={() => setCurrentStep(i)} style={{
                height: '0.5rem', borderRadius: '999px', border: 'none', cursor: 'pointer',
                transition: 'all 0.5s',
                width: i === currentStep ? '2.5rem' : i < currentStep ? '1rem' : '0.5rem',
                background: i === currentStep ? '#00D4FF' : i < currentStep ? 'rgba(34,197,94,0.5)' : 'var(--color-border)',
                boxShadow: i === currentStep ? '0 0 12px rgba(0,212,255,0.4)' : 'none',
              }} />
            ))}
          </div>
        </header>

        {/* Page content */}
        <main style={{ flex: 1, padding: '2.5rem 2rem', display: 'flex', justifyContent: 'center' }}>
          <div style={{ width: '100%', maxWidth: '90rem' }}>
            <StepComponent />
          </div>
        </main>

        {/* Navigation */}
        <div style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--color-border)' }}>
          <div style={{ maxWidth: '90rem', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={() => setCurrentStep(Math.max(0, currentStep - 1))}
              disabled={currentStep === 0}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.25rem', borderRadius: '0.75rem',
                fontSize: '0.95rem', fontWeight: 500, border: 'none', cursor: 'pointer',
                background: 'transparent', color: 'var(--color-text-secondary)',
                opacity: currentStep === 0 ? 0.2 : 1,
              }}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M10 4L6 8L10 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              Önceki Adım
            </button>
            <button
              onClick={() => setCurrentStep(Math.min(STEPS.length - 1, currentStep + 1))}
              disabled={currentStep === STEPS.length - 1}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1.5rem', borderRadius: '0.75rem',
                fontSize: '0.95rem', fontWeight: 600, cursor: 'pointer',
                background: 'rgba(0,212,255,0.08)', color: '#00D4FF',
                border: '1px solid rgba(0,212,255,0.15)',
                opacity: currentStep === STEPS.length - 1 ? 0.2 : 1,
              }}
            >
              Sonraki Adım
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        </div>

        {/* Footer */}
        <footer style={{ padding: '1.25rem 2rem', borderTop: '1px solid var(--color-border-subtle)', textAlign: 'center' }}>
          <p style={{ fontSize: '0.7rem', color: 'rgba(99,99,110,0.5)', letterSpacing: '0.05em' }}>
            tasarım ve kod: gündüz güzar
          </p>
        </footer>
      </div>
    </div>
  );
}
