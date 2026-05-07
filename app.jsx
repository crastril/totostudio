// app.jsx — Galerie filtrable + formulaire RDV + Tweaks panel

const { useState, useMemo, useEffect } = React;

/* ------------------------------------------------------------------ */
/* GALLERY                                                             */
/* ------------------------------------------------------------------ */

const WORKS = [
  { id:'w1', title:'Pivoine en lavis',     style:'sumi',     size:'wide', tag:'Avant-bras · 2026' },
  { id:'w2', title:'Vague à l\'aube',      style:'ukiyo',    size:'tall', tag:'Dos · 2026' },
  { id:'w3', title:'Cerisier nocturne',    style:'aquarelle',size:'mid',  tag:'Cuisse · 2025' },
  { id:'w4', title:'Sceau du voyageur',    style:'calli',    size:'mid',  tag:'Poignet · 2026' },
  { id:'w5', title:'Carpes & courant',     style:'ukiyo',    size:'tall', tag:'Manchette · 2026' },
  { id:'w6', title:'Encre qui s\'égare',   style:'aquarelle',size:'wide', tag:'Omoplate · 2025' },
  { id:'w7', title:'Bambou, vent du sud',  style:'sumi',     size:'tall', tag:'Mollet · 2026' },
  { id:'w8', title:'Trois caractères',     style:'calli',    size:'mid',  tag:'Nuque · 2025' },
  { id:'w9', title:'Grue suspendue',       style:'sumi',     size:'mid',  tag:'Épaule · 2026' },
];

const FILTERS = [
  { k:'all',       l:'Tout' },
  { k:'sumi',      l:'Sumi-e' },
  { k:'ukiyo',     l:'Ukiyo-e' },
  { k:'aquarelle', l:'Aquarelle' },
  { k:'calli',     l:'Calligraphie' },
];

function FilterBar({ value, onChange }){
  return (
    <div className="filter-pills">
      {FILTERS.map(f => (
        <button
          key={f.k}
          className={'pill' + (value === f.k ? ' active' : '')}
          onClick={() => onChange(f.k)}
        >{f.l}</button>
      ))}
    </div>
  );
}

function Gallery({ filter }){
  const items = useMemo(() => WORKS.map((w, i) => {
    const visible = filter === 'all' || w.style === filter;
    return { ...w, visible, _i: i };
  }), [filter]);

  return (
    <div className="gallery">
      {items.map(w => (
        <article
          key={w.id}
          className={`work w-${w.size} ${w.visible ? '' : 'hidden'}`}
          style={{ transitionDelay: w.visible ? `${(w._i % 4) * 60}ms` : '0ms' }}
        >
          <div className="frame">
            <image-slot
              id={`work-${w.id}`}
              placeholder={w.title}
              shape="rect"
            ></image-slot>
            <span className="tag">{w.tag}</span>
          </div>
          <div className="info">
            <span className="t">{w.title}</span>
            <span className="meta">Toto</span>
          </div>
        </article>
      ))}
    </div>
  );
}

function GalleryRoot(){
  const [filter, setFilter] = useState('all');
  return (
    <>
      {ReactDOM.createPortal(
        <FilterBar value={filter} onChange={setFilter} />,
        document.getElementById('filterBar')
      )}
      <Gallery filter={filter} />
    </>
  );
}

ReactDOM.createRoot(document.getElementById('gallery')).render(<GalleryRoot />);

/* ------------------------------------------------------------------ */
/* BOOKING FORM                                                        */
/* ------------------------------------------------------------------ */

const STYLES = [
  { k:'sumi',      t:'Sumi-e',       s:'Encre, lavis libre' },
  { k:'ukiyo',     t:'Ukiyo-e',      s:'Estampe, couleur' },
  { k:'aquarelle', t:'Aquarelle',    s:'Lavis, taches' },
  { k:'calli',     t:'Calligraphie', s:'Caractères, mots' },
];
const SIZES = [
  { k:'xs', t:'Petit',   s:'< 5 cm' },
  { k:'s',  t:'Moyen',   s:'5 — 12 cm' },
  { k:'m',  t:'Grand',   s:'12 — 25 cm' },
  { k:'l',  t:'Pièce',   s:'> 25 cm' },
];

function BookingForm(){
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    style:'', size:'', name:'', email:'', desc:''
  });
  const set = (k,v) => setData(d => ({ ...d, [k]: v }));

  const steps = [
    { lab:'Première étape · 01 / 03', title:'Quelle encre ?',
      can: !!data.style },
    { lab:'Deuxième étape · 02 / 03', title:'Quelle ampleur ?',
      can: !!data.size },
    { lab:'Troisième étape · 03 / 03', title:'Vous, et l\'idée.',
      can: !!data.name && !!data.email && !!data.desc },
  ];
  const total = steps.length;
  const isLast = step === total - 1;
  const done = step >= total;

  return (
    <div className="form-card">
      {!done && (
        <>
          <div className="form-progress">
            {steps.map((_, i) => (
              <span key={i} className={i <= step ? 'done' : ''}></span>
            ))}
          </div>

          <div className="form-step" key={step}>
            <div className="step-lab">{steps[step].lab}</div>
            <h3>{steps[step].title}</h3>

            {step === 0 && (
              <div className="form-options">
                {STYLES.map(o => (
                  <button key={o.k}
                    className={data.style === o.k ? 'sel' : ''}
                    onClick={() => set('style', o.k)}>
                    <span className="b">{o.t}</span>
                    <span className="s">{o.s}</span>
                  </button>
                ))}
              </div>
            )}
            {step === 1 && (
              <div className="form-options">
                {SIZES.map(o => (
                  <button key={o.k}
                    className={data.size === o.k ? 'sel' : ''}
                    onClick={() => set('size', o.k)}>
                    <span className="b">{o.t}</span>
                    <span className="s">{o.s}</span>
                  </button>
                ))}
              </div>
            )}
            {step === 2 && (
              <div>
                <input
                  className="form-input" placeholder="Votre nom"
                  value={data.name} onChange={e => set('name', e.target.value)} />
                <input
                  className="form-input" placeholder="Votre email" type="email"
                  value={data.email} onChange={e => set('email', e.target.value)} />
                <textarea
                  className="form-input"
                  placeholder="Décrivez votre projet — quelques mots, une image, un souvenir."
                  value={data.desc} onChange={e => set('desc', e.target.value)} />
              </div>
            )}
          </div>

          <div className="form-actions">
            <button
              className="btn-ghost"
              disabled={step === 0}
              onClick={() => setStep(s => Math.max(0, s - 1))}
            >← Retour</button>
            <button
              className="btn-ink"
              disabled={!steps[step].can}
              onClick={() => {
                if(isLast) setStep(total);
                else setStep(s => s + 1);
              }}
            >{isLast ? 'Envoyer' : 'Suivant →'}</button>
          </div>
        </>
      )}
      {done && (
        <div className="form-success">
          <div className="seal-big">朋</div>
          <h3>Demande reçue.</h3>
          <p>L'artiste vous lira dans les prochains jours.<br/>
             Réponse sous deux à trois semaines, à <em style={{fontFamily:'Cormorant Garamond, serif'}}>{data.email}</em>.</p>
        </div>
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('bookingForm')).render(<BookingForm />);

/* ------------------------------------------------------------------ */
/* TWEAKS PANEL — accent color                                         */
/* ------------------------------------------------------------------ */

const TWEAK_DEFAULTS = window.TWEAK_DEFAULTS;

const ACCENT_OPTIONS = [
  { hex:'#c0432a', name:'Vermillon' },
  { hex:'#2b3a7a', name:'Indigo'    },
  { hex:'#7a8a5e', name:'Céladon'   },
  { hex:'#c98a2b', name:'Safran'    },
  { hex:'#1a1a1a', name:'Encre seule' },
];

// hex -> oklch-ish via CSS color: use the hex directly (CSS handles it)
function applyAccent(hex){
  const root = document.documentElement;
  root.style.setProperty('--accent', hex);
  // soft variant
  root.style.setProperty('--accent-soft', hex + '20');
}

function TweaksApp(){
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);

  useEffect(() => { applyAccent(t.accent); }, [t.accent]);

  return (
    <TweaksPanel>
      <TweakSection label="Couleur d'accent" />
      <TweakColor
        label="Encre signature"
        value={t.accent}
        options={ACCENT_OPTIONS.map(o => o.hex)}
        onChange={(v) => setTweak('accent', v)}
      />
      <div style={{
        fontFamily:'Cormorant Garamond, serif',
        fontStyle:'italic',
        fontSize:'13px',
        color:'rgba(41,38,27,.55)',
        marginTop:'4px',
        lineHeight:1.4
      }}>
        {ACCENT_OPTIONS.find(o => o.hex === t.accent)?.name || 'Personnalisée'}
      </div>
    </TweaksPanel>
  );
}

// Mount tweaks panel at end of body
const tweaksRoot = document.createElement('div');
document.body.appendChild(tweaksRoot);
ReactDOM.createRoot(tweaksRoot).render(<TweaksApp />);
