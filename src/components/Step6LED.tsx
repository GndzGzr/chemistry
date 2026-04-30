import { useState, useEffect, useRef } from 'react';

interface FlowParticle { id: number; x: number; y: number; type: 'electron' | 'hole'; }

export default function Step6LED() {
  const [on, setOn] = useState(false);
  const [glow, setGlow] = useState(0);
  const [pts, setPts] = useState<FlowParticle[]>([]);
  const aRef = useRef(0), pRef = useRef<FlowParticle[]>([]);

  useEffect(() => {
    const init: FlowParticle[] = [];
    for (let i = 0; i < 8; i++) init.push({ id: i, x: 260 + Math.random() * 60, y: 135 + Math.random() * 40, type: 'electron' });
    for (let i = 0; i < 8; i++) init.push({ id: i + 8, x: 350 + Math.random() * 60, y: 135 + Math.random() * 40, type: 'hole' });
    setPts(init); pRef.current = init;
  }, []);

  useEffect(() => {
    if (on) { let v = 0; const iv = setInterval(() => { v = Math.min(1, v + 0.05); setGlow(v); if (v >= 1) clearInterval(iv); }, 30); return () => clearInterval(iv); }
    else setGlow(0);
  }, [on]);

  useEffect(() => {
    if (!on) { cancelAnimationFrame(aRef.current); return; }
    const tick = () => {
      pRef.current = pRef.current.map((p) => {
        let nx = p.x;
        if (p.type === 'electron') { nx += 0.7; if (nx > 410) nx = 260; } else { nx -= 0.7; if (nx < 260) nx = 410; }
        return { ...p, x: nx, y: p.y + (Math.random() - 0.5) * 0.25 };
      });
      setPts([...pRef.current]);
      aRef.current = requestAnimationFrame(tick);
    };
    aRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(aRef.current);
  }, [on]);

  const wireClr = on ? '#FBBF24' : 'var(--color-border)';

  return (
    <div className="split-layout">
      <div>
        <p className="section-label section-label--cyan">Deney Rehberi</p>
        <ol className="guide-list">
          <li><span className="num">1.</span><span>Devre şemasını inceleyin: <strong style={{ color: 'var(--color-text)' }}>pil, anahtar, LED</strong> seri bağlıdır.</span></li>
          <li><span className="num">2.</span><span><strong style={{ color: '#FBBF24' }}>Anahtarı Kapat</strong> butonuna tıklayarak devreyi tamamlayın.</span></li>
          <li><span className="num">3.</span><span>LED içinde <strong style={{ color: '#00D4FF' }}>elektronların</strong> ve <strong style={{ color: '#FF3B5C' }}>deşiklerin</strong> hareketini izleyin.</span></li>
          <li><span className="num">4.</span><span>Birleşme noktasında <strong style={{ color: '#FBBF24' }}>ışık efektini</strong> gözlemleyin.</span></li>
        </ol>

        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => setOn(!on)} className={`action-btn ${on ? 'action-btn--active-yellow' : ''}`}>
            {on ? '💡 LED Yanıyor — Anahtarı Aç' : '🔌 Anahtarı Kapat'}
          </button>
        </div>

        {on && (
          <div style={{ marginTop: '1rem' }}>
            <p style={{ fontSize: '0.9rem', color: '#FBBF24', fontStyle: 'italic' }}>e⁻ + h⁺ → foton (ışık)</p>
            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.25rem' }}>Yeniden birleşme ışık üretiyor!</p>
          </div>
        )}

        <div className="section-divider" />

        <p className="section-label section-label--yellow">Ne Oluyor?</p>
        <p className="theory-text">LED, özel bir P-N eklemi diyotudur. İleri beslemede elektronlar ve deşikler <strong style={{ color: 'var(--color-text-secondary)' }}>eklem bölgesinde</strong> buluşur.</p>
        <p className="theory-text">Elektron alt enerji seviyesine düşer, fazla enerji <strong style={{ color: '#FBBF24' }}>foton</strong> olarak salınır — <strong style={{ color: 'var(--color-text-secondary)' }}>radyatif yeniden birleşme</strong>.</p>
        <p className="theory-text">Fotonun rengi bant aralığına bağlıdır: <strong style={{ color: '#f87171' }}>Kırmızı ≈ 1.8 eV</strong>, <strong style={{ color: '#34D399' }}>Yeşil ≈ 2.2 eV</strong>, <strong style={{ color: '#60a5fa' }}>Mavi ≈ 3.0 eV</strong>.</p>
      </div>

      <div className="svg-canvas">
        <svg viewBox="0 0 640 400">
          {/* LED glow */}
          {on && (<g>
            <circle cx="335" cy="90" r={25 + glow * 55} fill="#FBBF24" opacity={glow * 0.1} />
            <circle cx="335" cy="90" r={15 + glow * 35} fill="#FBBF24" opacity={glow * 0.16} />
            <circle cx="335" cy="90" r={8 + glow * 18} fill="#FBBF24" opacity={glow * 0.28} />
          </g>)}

          {/* Battery */}
          <line x1="80" y1="280" x2="80" y2="310" stroke="var(--color-text)" strokeWidth="2.5" />
          <line x1="58" y1="310" x2="102" y2="310" stroke="var(--color-text)" strokeWidth="3.5" />
          <line x1="66" y1="324" x2="94" y2="324" stroke="var(--color-text)" strokeWidth="2" />
          <text x="80" y="350" textAnchor="middle" fontSize="13" fill="var(--color-text-secondary)" fontFamily="Inter">Pil (V)</text>

          {/* Wires */}
          <line x1="80" y1="280" x2="80" y2="155" stroke={wireClr} strokeWidth="2" className="svg-transition" />
          <line x1="80" y1="155" x2="160" y2="155" stroke={wireClr} strokeWidth="2" className="svg-transition" />

          {/* Switch */}
          <g style={{ cursor: 'pointer' }} onClick={() => setOn(!on)}>
            <circle cx="160" cy="155" r="5" fill="var(--color-text)" />
            <circle cx="240" cy="155" r="5" fill="var(--color-text)" />
            <line x1="165" y1="155" x2="236" y2={on ? 155 : 130} stroke="var(--color-text)" strokeWidth="2.5" className="svg-transition" />
            <text x="200" y={on ? 143 : 120} textAnchor="middle" fontSize="13" fontWeight="600" fill="var(--color-text-tertiary)" fontFamily="Inter">Anahtar</text>
          </g>

          <line x1="240" y1="155" x2="280" y2="155" stroke={wireClr} strokeWidth="2" className="svg-transition" />

          {/* LED Diode */}
          <rect x="280" y="128" width="55" height="54" rx="6" fill="#00D4FF10" stroke="#00D4FF" strokeWidth="2" />
          <text x="307" y="153" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#00D4FF" fontFamily="Inter">N</text>
          <rect x="335" y="128" width="55" height="54" rx="6" fill="#FF3B5C10" stroke="#FF3B5C" strokeWidth="2" />
          <text x="362" y="153" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#FF3B5C" fontFamily="Inter">P</text>
          <line x1="335" y1="128" x2="335" y2="182" stroke="#FBBF24" strokeWidth="1" strokeDasharray="4,3" opacity="0.3" />

          {on && pts.map((p) => (<g key={p.id}>
            {p.type === 'electron'
              ? <circle cx={p.x} cy={p.y} r="4" fill="#00D4FF" style={{ filter: 'drop-shadow(0 0 3px rgba(0,212,255,0.5))' }} />
              : <circle cx={p.x} cy={p.y} r="4" fill="none" stroke="#FF3B5C" strokeWidth="1.3" strokeDasharray="2,1.5" />}
          </g>))}

          <text x="335" y="203" textAnchor="middle" fontSize="14" fontWeight="bold" fill="var(--color-text-secondary)" fontFamily="Inter">LED Diyot</text>

          {/* Light rays */}
          {on && (<g opacity={glow}>
            {[0, 30, 60, 90, 120, 150].map((a, i) => {
              const rad = (a * Math.PI) / 180;
              return <line key={i} x1={335 + Math.cos(rad) * 34} y1={115 - Math.sin(rad) * 17} x2={335 + Math.cos(rad) * 56} y2={115 - Math.sin(rad) * 39} stroke="#FBBF24" strokeWidth="2" strokeLinecap="round" opacity={0.25 + i * 0.1} />;
            })}
          </g>)}

          {/* Return wires */}
          <line x1="390" y1="155" x2="560" y2="155" stroke={wireClr} strokeWidth="2" className="svg-transition" />
          <line x1="560" y1="155" x2="560" y2="324" stroke={wireClr} strokeWidth="2" className="svg-transition" />
          <line x1="560" y1="324" x2="80" y2="324" stroke={wireClr} strokeWidth="2" className="svg-transition" />

          {/* Current arrows */}
          {on && (<g opacity="0.35">
            <polygon points="130,152 137,155 130,158" fill="#FBBF24" />
            <polygon points="460,152 467,155 460,158" fill="#FBBF24" />
            <polygon points="563,235 560,242 557,235" fill="#FBBF24" />
            <polygon points="320,327 313,324 320,321" fill="#FBBF24" />
          </g>)}

          {on && <text x="335" y="222" textAnchor="middle" fontSize="11" fontWeight="600" fontFamily="Inter" fill="#FBBF24" opacity={glow}>e⁻ + h⁺ → foton</text>}
        </svg>
      </div>
    </div>
  );
}
