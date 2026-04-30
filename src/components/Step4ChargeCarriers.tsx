import { useState, useEffect, useRef } from 'react';

interface Particle { id: number; x: number; y: number; }

function SemiBlock({ type, isActive }: { type: 'n' | 'p'; isActive: boolean }) {
  const [pts, setPts] = useState<Particle[]>([]);
  const aRef = useRef(0), pRef = useRef<Particle[]>([]);

  useEffect(() => {
    const init = Array.from({ length: 10 }, (_, i) => ({ id: i, x: 25 + Math.random() * 250, y: 20 + Math.random() * 120 }));
    setPts(init); pRef.current = init;
  }, []);

  useEffect(() => {
    if (!isActive) { cancelAnimationFrame(aRef.current); return; }
    const spd = type === 'n' ? 1.1 : -1.1;
    const tick = () => {
      pRef.current = pRef.current.map((p) => {
        let nx = p.x + spd + (Math.random() - 0.5) * 0.7;
        if (nx > 280) nx = 20; if (nx < 20) nx = 280;
        return { ...p, x: nx, y: p.y + (Math.random() - 0.5) * 0.4 };
      });
      setPts([...pRef.current]);
      aRef.current = requestAnimationFrame(tick);
    };
    aRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(aRef.current);
  }, [isActive, type]);

  const clr = type === 'n' ? '#00D4FF' : '#FF3B5C';
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', width: '100%' }}>
      <span style={{ fontSize: '0.95rem', fontWeight: 700, color: clr }}>{type === 'n' ? 'N-Tipi Yarı İletken' : 'P-Tipi Yarı İletken'}</span>
      <svg viewBox="0 0 300 160" style={{ width: '100%' }}>
        <rect x="8" y="8" width="284" height="140" rx="8" fill={`${clr}08`} stroke={clr} strokeWidth="1.2" />
        {Array.from({ length: 5 }).map((_, i) => (<g key={i}><circle cx={30 + i * 55} cy={80} r="10" fill="none" stroke="var(--color-border)" strokeWidth="1" /><text x={30 + i * 55} y={84} textAnchor="middle" fontSize="9" fill="var(--color-text-tertiary)" fontFamily="Inter">{type === 'n' ? '+' : '−'}</text></g>))}
        {pts.map((p) => (<g key={p.id}>
          {type === 'n' ? <circle cx={p.x} cy={p.y} r="5.5" fill={clr} style={{ filter: `drop-shadow(0 0 4px ${clr})` }} />
            : <circle cx={p.x} cy={p.y} r="5.5" fill="none" stroke={clr} strokeWidth="1.5" strokeDasharray="3,2" />}
        </g>))}
        {isActive && (<g>
          <defs><marker id={`ar-${type}`} markerWidth="7" markerHeight="7" refX="5" refY="3.5" orient="auto"><path d={`M0,0 L7,3.5 L0,7`} fill={clr} /></marker></defs>
          <line x1={type === 'n' ? 25 : 275} y1="14" x2={type === 'n' ? 275 : 25} y2="14" stroke={clr} strokeWidth="1.5" markerEnd={`url(#ar-${type})`} opacity="0.4" />
        </g>)}
      </svg>
      <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>{type === 'n' ? 'Çoğunluk: Elektronlar' : 'Çoğunluk: Deşikler'}</span>
    </div>
  );
}

export default function Step4ChargeCarriers() {
  const [active, setActive] = useState(false);

  return (
    <div className="split-layout">
      <div>
        <p className="section-label section-label--cyan">Deney Rehberi</p>
        <ol className="guide-list">
          <li><span className="num">1.</span><span><strong style={{ color: '#FBBF24' }}>Elektrik Alanı Uygula</strong> butonuna tıklayın.</span></li>
          <li><span className="num">2.</span><span>N-Tipi'de <strong style={{ color: '#00D4FF' }}>mavi elektronların</strong> sağa hareket ettiğini gözlemleyin.</span></li>
          <li><span className="num">3.</span><span>P-Tipi'de <strong style={{ color: '#FF3B5C' }}>kırmızı deşiklerin</strong> sola hareket ettiğini gözlemleyin.</span></li>
          <li><span className="num">4.</span><span>Sabit iyonların <strong style={{ color: 'var(--color-text)' }}>hareket etmediğine</strong> dikkat edin.</span></li>
        </ol>

        <div style={{ marginTop: '2rem' }}>
          <button onClick={() => setActive(!active)} className={`action-btn ${active ? 'action-btn--active-yellow' : ''}`}>
            {active ? '⚡ Elektrik Alanı Aktif' : '⚡ Elektrik Alanı Uygula'}
          </button>
          {active && <p style={{ marginTop: '1rem', fontSize: '0.9rem', color: '#FBBF24', fontStyle: 'italic' }}>Taşıyıcılar hareket ediyor — akım oluşuyor!</p>}
        </div>

        <div className="section-divider" />

        <p className="section-label section-label--yellow">Ne Oluyor?</p>
        <p className="theory-text">Doping sonrası iki tür <strong style={{ color: 'var(--color-text-secondary)' }}>yük taşıyıcı</strong> oluşur: elektronlar ve deşikler.</p>
        <p className="theory-text"><strong style={{ color: '#00D4FF' }}>N-Tipi</strong>'de fazla elektronlar alanın tersi yönünde, <strong style={{ color: '#FF3B5C' }}>P-Tipi</strong>'de deşikler alan yönünde hareket eder.</p>
        <p className="theory-text">Doping atomları <strong style={{ color: 'var(--color-text-secondary)' }}>sabit iyon</strong> hâline gelir — sadece serbest taşıyıcılar akım oluşturur.</p>
      </div>

      <div className="svg-canvas" style={{ flexDirection: 'column', gap: '2rem' }}>
        <SemiBlock type="n" isActive={active} />
        <SemiBlock type="p" isActive={active} />
      </div>
    </div>
  );
}
