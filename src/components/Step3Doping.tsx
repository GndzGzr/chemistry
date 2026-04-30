import { useState, type ReactElement } from 'react';

type DopantType = 'none' | 'phosphorus' | 'boron';
const GRID = 3, SP = 130, OFF = 80;
function gp(r: number, c: number) { return { x: OFF + c * SP, y: OFF + r * SP }; }

export default function Step3Doping() {
  const [dopant, setDopant] = useState<DopantType>('none');
  const [show, setShow] = useState(false);

  const dope = (t: DopantType) => { setShow(false); setDopant(t); setTimeout(() => setShow(true), 100); };
  const sz = OFF * 2 + (GRID - 1) * SP;

  return (
    <div className="split-layout">
      <div>
        <p className="section-label section-label--cyan">Deney Rehberi</p>
        <ol className="guide-list">
          <li><span className="num">1.</span><span>Aşağıdaki <strong style={{ color: '#00D4FF' }}>Fosfor</strong> veya <strong style={{ color: '#FF3B5C' }}>Bor</strong> butonunu seçin.</span></li>
          <li><span className="num">2.</span><span>Atom kristal örgünün <strong style={{ color: 'var(--color-text)' }}>ortasına</strong> yerleşecek.</span></li>
          <li><span className="num">3.</span><span>Fosfor → <strong style={{ color: '#00D4FF' }}>serbest elektron</strong> gözlemleyin.</span></li>
          <li><span className="num">4.</span><span>Bor → <strong style={{ color: '#FF3B5C' }}>deşik</strong> oluşumunu gözlemleyin.</span></li>
        </ol>

        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button onClick={() => dope('phosphorus')} className={`action-btn ${dopant === 'phosphorus' ? 'action-btn--active-cyan' : ''}`}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, width: '2.5rem' }}>P</span>
            <div><div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Fosfor</div><div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>5A Grubu → N-Tipi</div></div>
          </button>
          <button onClick={() => dope('boron')} className={`action-btn ${dopant === 'boron' ? 'action-btn--active-red' : ''}`}>
            <span style={{ fontSize: '1.75rem', fontWeight: 700, width: '2.5rem' }}>B</span>
            <div><div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Bor</div><div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>3A Grubu → P-Tipi</div></div>
          </button>
          {dopant !== 'none' && <button onClick={() => { setDopant('none'); setShow(false); }} style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontSize: '0.85rem' }}>↺ Sıfırla</button>}
        </div>

        <div className="section-divider" />

        <p className="section-label section-label--yellow">Ne Oluyor?</p>
        <p className="theory-text">Saf silisyumun iletkenliği çok düşüktür. <strong style={{ color: 'var(--color-text-secondary)' }}>Doping</strong> ile yabancı atom eklenerek iletkenlik kontrollü artırılır.</p>
        <p className="theory-text"><strong style={{ color: '#00D4FF' }}>Fosfor (5A):</strong> 5 valans elektronu → 1 fazla → <strong style={{ color: 'var(--color-text-secondary)' }}>N-Tipi</strong>.</p>
        <p className="theory-text"><strong style={{ color: '#FF3B5C' }}>Bor (3A):</strong> 3 valans elektronu → 1 eksik bağ → <strong style={{ color: 'var(--color-text-secondary)' }}>P-Tipi</strong>.</p>
      </div>

      <div className="svg-canvas">
        <svg viewBox={`0 0 ${sz} ${sz}`}>
          {Array.from({ length: GRID }).map((_, r) => Array.from({ length: GRID }).map((_, c) => {
            const p = gp(r, c); const els: ReactElement[] = [];
            if (c < GRID - 1) { const q = gp(r, c + 1); els.push(<line key={`h${r}${c}`} x1={p.x + 30} y1={p.y} x2={q.x - 30} y2={q.y} stroke="var(--color-border)" strokeWidth="1.5" />); }
            if (r < GRID - 1) { const q = gp(r + 1, c); els.push(<line key={`v${r}${c}`} x1={p.x} y1={p.y + 30} x2={q.x} y2={q.y - 30} stroke="var(--color-border)" strokeWidth="1.5" />); }
            return els;
          }))}
          {Array.from({ length: GRID }).map((_, r) => Array.from({ length: GRID }).map((_, c) => {
            const p = gp(r, c), ctr = r === 1 && c === 1, d = ctr && dopant !== 'none';
            const lbl = d ? (dopant === 'phosphorus' ? 'P' : 'B') : 'Si';
            const clr = d ? (dopant === 'phosphorus' ? '#00D4FF' : '#FF3B5C') : 'var(--color-border)';
            return (<g key={`a${r}${c}`}>
              <circle cx={p.x} cy={p.y} r="30" fill={d ? `${clr}18` : 'var(--color-surface-3)'} stroke={clr} strokeWidth={d ? '2.5' : '1.5'} className="svg-transition" style={{ filter: d ? `drop-shadow(0 0 12px ${clr})` : 'none' }} />
              <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" fontSize="16" fontWeight="bold" fill={d ? clr : 'var(--color-text-secondary)'} fontFamily="Inter">{lbl}</text>
              {d && dopant === 'phosphorus' && show && (<g>
                <circle cx={p.x + 40} cy={p.y - 36} r="10" fill="#00D4FF" className="animate-pulse-glow" style={{ filter: 'drop-shadow(0 0 12px rgba(0,212,255,0.6))' }} />
                <text x={p.x + 40} y={p.y - 35} textAnchor="middle" dominantBaseline="middle" fontSize="8" fontWeight="bold" fill="white" fontFamily="Inter">e⁻</text>
                <text x={p.x + 40} y={p.y - 54} textAnchor="middle" fontSize="10" fontWeight="600" fill="#00D4FF" fontFamily="Inter">Serbest e⁻</text>
              </g>)}
              {d && dopant === 'boron' && show && (<g>
                <circle cx={p.x - 40} cy={p.y - 36} r="12" fill="none" stroke="#FF3B5C" strokeWidth="2.5" strokeDasharray="5,4" className="animate-dash-rotate" style={{ filter: 'drop-shadow(0 0 12px rgba(255,59,92,0.5))' }} />
                <text x={p.x - 40} y={p.y - 35} textAnchor="middle" dominantBaseline="middle" fontSize="8" fontWeight="bold" fill="#FF3B5C" fontFamily="Inter">h⁺</text>
                <text x={p.x - 40} y={p.y - 54} textAnchor="middle" fontSize="10" fontWeight="600" fill="#FF3B5C" fontFamily="Inter">Deşik</text>
              </g>)}
            </g>);
          }))}
        </svg>
      </div>
    </div>
  );
}
