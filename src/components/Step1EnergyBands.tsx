import { useState, useEffect } from 'react';

interface ElectronState { id: number; y: number; jumped: boolean; }

function BandDiagram({ label, color, energy, type }: {
  label: string; color: string; energy: number;
  type: 'conductor' | 'semiconductor' | 'insulator';
}) {
  const [electrons, setElectrons] = useState<ElectronState[]>([]);

  useEffect(() => {
    const arr: ElectronState[] = [];
    for (let i = 0; i < 5; i++) {
      const thr = type === 'conductor' ? 10 : type === 'semiconductor' ? 50 : 95;
      const jumped = energy >= thr + i * (type === 'conductor' ? 2 : type === 'semiconductor' ? 8 : 2);
      arr.push({ id: i, y: jumped ? 45 + Math.random() * 30 : 155 + Math.random() * 30, jumped });
    }
    setElectrons(arr);
  }, [energy, type]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', flex: 1 }}>
      <span style={{ fontSize: '0.95rem', fontWeight: 700, color }}>{label}</span>
      <svg viewBox="0 0 200 250" style={{ width: '100%' }}>
        <rect x="10" y="25" width="180" height="55" rx="6" fill={`${color}12`} stroke={color} strokeWidth="1.2" />
        <text x="100" y="18" textAnchor="middle" fontSize="10" fill="var(--color-text-tertiary)" fontFamily="Inter">İletkenlik Bandı</text>
        <line x1="195" y1="80" x2="195" y2="130" stroke="var(--color-text-tertiary)" strokeWidth="0.5" strokeDasharray="3,3" />
        <rect x="10" y="130" width="180" height="55" rx="6" fill={`${color}12`} stroke={color} strokeWidth="1.2" />
        <text x="100" y="202" textAnchor="middle" fontSize="10" fill="var(--color-text-tertiary)" fontFamily="Inter">Valans Bandı</text>
        {electrons.map((e) => (
          <circle key={e.id} cx={30 + e.id * 34} cy={e.y} r="8" fill={e.jumped ? '#00D4FF' : '#444'}
            className="svg-transition" style={{ filter: e.jumped ? 'drop-shadow(0 0 8px rgba(0,212,255,0.6))' : 'none' }} />
        ))}
        <line x1="5" y1="235" x2="5" y2={235 - energy * 2} stroke="#FBBF24" strokeWidth="2.5" strokeLinecap="round" className="svg-transition" />
        <polygon points={`1,${235 - energy * 2} 9,${235 - energy * 2} 5,${228 - energy * 2}`} fill="#FBBF24" className="svg-transition" />
      </svg>
    </div>
  );
}

export default function Step1EnergyBands() {
  const [energy, setEnergy] = useState(5);

  const getStatus = () => {
    if (energy < 20) return 'Düşük enerji — elektronlar yerinde.';
    if (energy < 50) return 'İletken aktif. Yarı iletken hâlâ bekliyor.';
    if (energy < 80) return 'Yarı iletkende atlamalar başlıyor!';
    return 'Yüksek enerji — yarı iletken tamamen iletiyor.';
  };

  return (
    <div className="split-layout">
      {/* Left Column */}
      <div>
        <p className="section-label section-label--cyan">Deney Rehberi</p>
        <ol className="guide-list">
          <li><span className="num">1.</span><span><strong style={{ color: 'var(--color-text)' }}>Sıcaklık kaydırıcısını</strong> sağa çekerek enerji seviyesini artırın.</span></li>
          <li><span className="num">2.</span><span>Üç diyagramı karşılaştırın: <strong style={{ color: '#34D399' }}>İletken</strong>, <strong style={{ color: '#00D4FF' }}>Yarı İletken</strong>, <strong style={{ color: '#FF3B5C' }}>Yalıtkan</strong>.</span></li>
          <li><span className="num">3.</span><span>Elektronların bant aralığını aşma çabasını gözlemleyin.</span></li>
          <li><span className="num">4.</span><span>Enerjiyi maksimuma çıkarın — yalıtkan neden iletmiyor?</span></li>
        </ol>

        {/* Slider */}
        <div style={{ marginTop: '2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
            <span style={{ fontSize: '0.95rem', color: 'var(--color-text-secondary)' }}>Sıcaklık / Enerji</span>
            <span style={{ fontFamily: 'monospace', fontSize: '1.5rem', color: '#FBBF24' }}>{energy}%</span>
          </div>
          <input type="range" min="0" max="100" value={energy}
            onChange={(e) => setEnergy(Number(e.target.value))}
            style={{ width: '100%', accentColor: '#FBBF24', height: '6px', cursor: 'pointer' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.5rem' }}>
            <span>0 K</span><span>Oda Sıcaklığı</span><span>Yüksek</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '1rem' }}>
            <div style={{ width: '0.5rem', height: '0.5rem', borderRadius: '50%', background: energy > 50 ? '#00D4FF' : 'var(--color-text-tertiary)', boxShadow: energy > 50 ? '0 0 8px rgba(0,212,255,0.4)' : 'none' }} />
            <span style={{ fontSize: '0.85rem', color: 'var(--color-text-tertiary)', fontStyle: 'italic' }}>{getStatus()}</span>
          </div>

          <div style={{ display: 'flex', gap: '1.25rem', marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--color-border-subtle)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '0.7rem', height: '0.7rem', borderRadius: '50%', background: '#34D399' }} /><span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>İletken (Cu)</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '0.7rem', height: '0.7rem', borderRadius: '50%', background: '#00D4FF' }} /><span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>Yarı İletken (Si)</span></div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '0.7rem', height: '0.7rem', borderRadius: '50%', background: '#FF3B5C' }} /><span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>Yalıtkan (SiO₂)</span></div>
          </div>
        </div>

        <div className="section-divider" />

        <p className="section-label section-label--yellow">Ne Oluyor?</p>
        <p className="theory-text">Katılardaki elektronlar iki enerji bandında bulunur: altta <strong style={{ color: 'var(--color-text-secondary)' }}>valans bandı</strong>, üstte <strong style={{ color: 'var(--color-text-secondary)' }}>iletkenlik bandı</strong>.</p>
        <p className="theory-text">İkisi arasındaki boşluk — <strong style={{ color: '#FBBF24' }}>bant aralığı</strong> — malzemenin iletkenliğini belirler.</p>
        <p className="theory-text"><strong style={{ color: '#34D399' }}>İletkenler</strong> her zaman iletir. <strong style={{ color: '#00D4FF' }}>Yarı iletkenler</strong> yeterli enerjiyle iletir. <strong style={{ color: '#FF3B5C' }}>Yalıtkanlar</strong> neredeyse hiç iletmez.</p>
      </div>

      {/* Right Column */}
      <div className="svg-canvas">
        <div style={{ display: 'flex', gap: '1.5rem', justifyContent: 'center', width: '100%' }}>
          <BandDiagram label="İletken (Cu)" color="#34D399" energy={energy} type="conductor" />
          <BandDiagram label="Yarı İletken (Si)" color="#00D4FF" energy={energy} type="semiconductor" />
          <BandDiagram label="Yalıtkan (SiO₂)" color="#FF3B5C" energy={energy} type="insulator" />
        </div>
      </div>
    </div>
  );
}
