import { useState, useEffect, useRef } from 'react';

type BiasMode = 'none' | 'forward' | 'reverse';
interface Carrier { id: number; x: number; y: number; type: 'electron' | 'hole'; }

export default function Step5PNJunction() {
  const [bias, setBias] = useState<BiasMode>('none');
  const [dw, setDw] = useState(100);
  const [carriers, setCarriers] = useState<Carrier[]>([]);
  const aRef = useRef(0), cRef = useRef<Carrier[]>([]);

  useEffect(() => {
    const init: Carrier[] = [];
    for (let i = 0; i < 12; i++) init.push({ id: i, x: 40 + Math.random() * 200, y: 20 + Math.random() * 110, type: 'electron' });
    for (let i = 0; i < 12; i++) init.push({ id: i + 12, x: 460 + Math.random() * 200, y: 20 + Math.random() * 110, type: 'hole' });
    setCarriers(init); cRef.current = init;
  }, []);

  useEffect(() => { setDw(bias === 'forward' ? 25 : bias === 'reverse' ? 180 : 100); }, [bias]);

  useEffect(() => {
    if (bias !== 'forward') { cancelAnimationFrame(aRef.current); return; }
    const tick = () => {
      cRef.current = cRef.current.map((c) => {
        let nx = c.x;
        if (c.type === 'electron') { nx += 0.9 + Math.random() * 0.4; if (nx > 680) nx = 40; }
        else { nx -= 0.9 + Math.random() * 0.4; if (nx < 20) nx = 660; }
        return { ...c, x: nx, y: c.y + (Math.random() - 0.5) * 0.6 };
      });
      setCarriers([...cRef.current]);
      aRef.current = requestAnimationFrame(tick);
    };
    aRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(aRef.current);
  }, [bias]);

  const cx = 350, dl = cx - dw / 2;

  return (
    <div className="split-layout">
      <div>
        <p className="section-label section-label--cyan">Deney Rehberi</p>
        <ol className="guide-list">
          <li><span className="num">1.</span><span><strong style={{ color: '#34D399' }}>İleri Besleme</strong> butonuna tıklayın.</span></li>
          <li><span className="num">2.</span><span>Fakirleşme bölgesinin <strong style={{ color: 'var(--color-text)' }}>daraldığını</strong> gözlemleyin.</span></li>
          <li><span className="num">3.</span><span><strong style={{ color: '#FF3B5C' }}>Ters Besleme</strong>'ye geçin — bölge genişliyor.</span></li>
          <li><span className="num">4.</span><span>Akımın durduğunu gözlemleyin — tek yönlü vana.</span></li>
        </ol>

        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          <button onClick={() => setBias('forward')} className={`action-btn ${bias === 'forward' ? 'action-btn--active-green' : ''}`}>→ İleri Besleme (Forward Bias)</button>
          <button onClick={() => setBias('reverse')} className={`action-btn ${bias === 'reverse' ? 'action-btn--active-red' : ''}`}>← Ters Besleme (Reverse Bias)</button>
          {bias !== 'none' && <button onClick={() => setBias('none')} style={{ background: 'none', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontSize: '0.85rem' }}>↺ Sıfırla</button>}
        </div>

        {bias !== 'none' && <p style={{ marginTop: '1rem', fontSize: '0.9rem', fontStyle: 'italic', color: bias === 'forward' ? '#34D399' : '#FF3B5C' }}>
          {bias === 'forward' ? '→ Akım geçiyor — taşıyıcılar eklemi aşıyor' : '✕ Akım durdu — bariyer genişledi'}
        </p>}

        <div className="section-divider" />

        <p className="section-label section-label--yellow">Ne Oluyor?</p>
        <p className="theory-text">N-tipi ve P-tipi birleştirilince <strong style={{ color: '#FBBF24' }}>fakirleşme bölgesi</strong> oluşur.</p>
        <p className="theory-text"><strong style={{ color: '#34D399' }}>İleri besleme:</strong> Bölge daralır, akım geçer.</p>
        <p className="theory-text"><strong style={{ color: '#FF3B5C' }}>Ters besleme:</strong> Bölge genişler, akım durur.</p>
      </div>

      <div className="svg-canvas">
        <svg viewBox="0 0 700 190">
          <rect x="10" y="15" width="330" height="145" rx="8" fill="#00D4FF08" stroke="#00D4FF" strokeWidth="1.2" />
          <text x="120" y="10" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#00D4FF" fontFamily="Inter">N-Tipi</text>
          <rect x="360" y="15" width="330" height="145" rx="8" fill="#FF3B5C08" stroke="#FF3B5C" strokeWidth="1.2" />
          <text x="580" y="10" textAnchor="middle" fontSize="14" fontWeight="bold" fill="#FF3B5C" fontFamily="Inter">P-Tipi</text>
          <rect x={dl} y="15" width={dw} height="145" rx="4" fill="#FBBF2408" stroke="#FBBF24" strokeWidth="1" strokeDasharray="5,4" className="svg-transition" />
          <text x={cx} y="180" textAnchor="middle" fontSize="12" fontWeight="600" fill="#FBBF24" fontFamily="Inter">Fakirleşme Bölgesi</text>
          <line x1={cx} y1="15" x2={cx} y2="160" stroke="var(--color-text-tertiary)" strokeWidth="0.8" strokeDasharray="3,3" opacity="0.15" />
          {carriers.map((c) => (<g key={c.id}>
            {c.type === 'electron'
              ? <circle cx={c.x} cy={c.y} r="5" fill="#00D4FF" style={{ filter: 'drop-shadow(0 0 3px rgba(0,212,255,0.5))' }} />
              : <circle cx={c.x} cy={c.y} r="5" fill="none" stroke="#FF3B5C" strokeWidth="1.5" strokeDasharray="3,2" />}
          </g>))}
        </svg>
      </div>
    </div>
  );
}
