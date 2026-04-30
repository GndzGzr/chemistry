import { useState, useCallback } from 'react';

interface Bond { from: number; to: number; }

const GRID = 4, SPACING = 110, OFFSET = 60;

function getPos(i: number) {
  const r = Math.floor(i / GRID), c = i % GRID;
  return { x: OFFSET + c * SPACING + (r % 2 === 1 ? SPACING / 2 : 0), y: OFFSET + r * SPACING };
}

function adj(a: number, b: number) {
  const rA = Math.floor(a / GRID), cA = a % GRID, rB = Math.floor(b / GRID), cB = b % GRID;
  if (Math.abs(rA - rB) === 0 && Math.abs(cA - cB) === 1) return true;
  if (Math.abs(rA - rB) === 1) { const off = rA % 2 === 1 ? -1 : 0; return cB === cA + off || cB === cA + off + 1; }
  return false;
}

export default function Step2SiliconLattice() {
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [sel, setSel] = useState<number | null>(null);
  const atoms = Array.from({ length: GRID * GRID }, (_, i) => i);

  const bc = (i: number) => bonds.filter((b) => b.from === i || b.to === i).length;
  const exists = (a: number, b: number) => bonds.some((x) => (x.from === a && x.to === b) || (x.from === b && x.to === a));

  const click = useCallback((i: number) => {
    if (sel === null) { setSel(i); return; }
    if (sel === i) { setSel(null); return; }
    if (adj(sel, i) && !exists(sel, i) && bc(sel) < 4 && bc(i) < 4) setBonds((p) => [...p, { from: sel, to: i }]);
    setSel(null);
  }, [sel, bonds]);

  const W = OFFSET * 2 + (GRID - 1) * SPACING + SPACING / 2;
  const H = OFFSET * 2 + (GRID - 1) * SPACING;
  const max = GRID * GRID * 2;
  const pct = Math.round((bonds.length / max) * 100);

  return (
    <div className="split-layout">
      <div>
        <p className="section-label section-label--cyan">Deney Rehberi</p>
        <ol className="guide-list">
          <li><span className="num">1.</span><span>Bir <strong style={{ color: 'var(--color-text)' }}>Si atomuna</strong> tıklayarak seçin.</span></li>
          <li><span className="num">2.</span><span><strong style={{ color: 'var(--color-text)' }}>Komşu</strong> atoma tıklayarak kovalent bağ oluşturun.</span></li>
          <li><span className="num">3.</span><span>Her atomun en fazla <strong style={{ color: '#00D4FF' }}>4 bağ</strong> yapabildiğini doğrulayın.</span></li>
          <li><span className="num">4.</span><span>Tüm atomları bağlayarak kristal örgüyü tamamlayın.</span></li>
        </ol>

        <div style={{ marginTop: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1, height: '0.375rem', borderRadius: '999px', background: 'var(--color-border)', overflow: 'hidden' }}>
            <div style={{ height: '100%', borderRadius: '999px', background: '#00D4FF', width: `${pct}%`, transition: 'width 0.5s', boxShadow: '0 0 12px rgba(0,212,255,0.4)' }} />
          </div>
          <span style={{ fontSize: '0.85rem', fontFamily: 'monospace', color: '#00D4FF' }}>{bonds.length}/{max}</span>
        </div>
        <button onClick={() => { setBonds([]); setSel(null); }}
          style={{ marginTop: '0.5rem', background: 'none', border: 'none', color: 'var(--color-text-tertiary)', cursor: 'pointer', fontSize: '0.85rem' }}>
          ↺ Sıfırla
        </button>

        <div className="section-divider" />

        <p className="section-label section-label--yellow">Ne Oluyor?</p>
        <p className="theory-text">Silisyum <strong style={{ color: 'var(--color-text-secondary)' }}>4A grubunda</strong> yer alır ve 4 valans elektronu bulunur.</p>
        <p className="theory-text">Her Si atomu komşu 4 atomuyla elektron paylaşarak <strong style={{ color: '#00D4FF' }}>kovalent bağ</strong> kurar. Bu düzenli yapı <strong style={{ color: 'var(--color-text-secondary)' }}>kristal örgü</strong> olarak adlandırılır.</p>
      </div>

      <div className="svg-canvas">
        <svg viewBox={`0 0 ${W} ${H}`}>
          {bonds.map((b, i) => {
            const f = getPos(b.from), t = getPos(b.to);
            return (<g key={`b${i}`}>
              <line x1={f.x} y1={f.y} x2={t.x} y2={t.y} stroke="#00D4FF" strokeWidth="2" opacity="0.35" />
              <circle cx={(f.x + t.x) / 2 - 5} cy={(f.y + t.y) / 2 - 5} r="3" fill="#00D4FF" style={{ filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.5))' }} />
              <circle cx={(f.x + t.x) / 2 + 5} cy={(f.y + t.y) / 2 + 5} r="3" fill="#00D4FF" style={{ filter: 'drop-shadow(0 0 4px rgba(0,212,255,0.5))' }} />
            </g>);
          })}
          {atoms.map((idx) => {
            const p = getPos(idx), s = sel === idx, f = bc(idx) >= 4;
            return (<g key={idx} onClick={() => click(idx)} style={{ cursor: 'pointer' }}>
              {s && <circle cx={p.x} cy={p.y} r="38" fill="none" stroke="#00D4FF" strokeWidth="1.2" opacity="0.5" strokeDasharray="5,5" className="animate-dash-rotate" />}
              <circle cx={p.x} cy={p.y} r="30" fill={f ? 'var(--color-surface)' : 'var(--color-surface-3)'}
                stroke={f ? '#00D4FF' : 'var(--color-border)'} strokeWidth={f ? '2.5' : '1.5'}
                className="svg-transition" style={{ filter: f ? 'drop-shadow(0 0 10px rgba(0,212,255,0.4))' : 'none' }} />
              <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle"
                fontSize="15" fontWeight="bold" fill={f ? '#00D4FF' : 'var(--color-text-secondary)'} fontFamily="Inter" style={{ pointerEvents: 'none' }}>Si</text>
              <text x={p.x + 26} y={p.y - 24} textAnchor="middle" fontSize="9" fill="var(--color-text-tertiary)" fontFamily="Inter" style={{ pointerEvents: 'none' }}>{bc(idx)}/4</text>
            </g>);
          })}
        </svg>
      </div>
    </div>
  );
}
