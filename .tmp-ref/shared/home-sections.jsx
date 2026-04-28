// Homepage sections for D-Dragon
const { useState: uS, useEffect: uE, useRef: uR } = React;

function useInView() {
  const ref = uR(null);
  const [seen, setSeen] = uS(false);
  uE(() => {
    if (!ref.current) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setSeen(true); obs.disconnect(); } }, { threshold: 0.1 });
    obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, seen];
}

function Reveal({ children, delay = 0, as: Tag = 'div', ...rest }) {
  const [ref, seen] = useInView();
  return <Tag ref={ref} {...rest} className={(rest.className||'') + ' fade-up ' + (seen?'in':'')} style={{...rest.style, transitionDelay: `${delay}ms`}}>{children}</Tag>;
}

// HERO — big editorial type, floating fruit, stats strip
function Hero() {
  const { t, lang, setQuoteOpen } = useApp();
  return (
    <section style={{background:'var(--cream)', paddingBottom: 100}}>
      <div className="wrap" style={{paddingTop: 40}}>
        <div style={{display:'grid', gridTemplateColumns:'1.3fr 1fr', gap:60, alignItems:'center', minHeight:'78vh', position:'relative'}}>
          <div>
            <div className="eyebrow" style={{marginBottom:32, display:'flex', alignItems:'center', gap:12}}>
              <span style={{width:24, height:1, background:'currentColor'}}/>
              {t('hero_eyebrow')}
            </div>
            <h1 className="display">
              {t('hero_title_1')} <em className="italic" style={{color:'var(--magenta)'}}>{t('hero_title_2')}</em><br/>
              {t('hero_title_3')}<br/>
              {t('hero_title_4')}
            </h1>
            <p style={{fontSize:17, lineHeight:1.55, color:'var(--ink-soft)', maxWidth:480, marginTop:32}}>{t('hero_sub')}</p>
            <div style={{display:'flex', gap:16, marginTop:36}}>
              <a href="products.html" className="btn btn-primary">{t('hero_cta_1')} <Icon name="arrow" size={16}/></a>
              <button className="btn btn-outline" onClick={()=>setQuoteOpen(true)}>{t('hero_cta_2')}</button>
            </div>
          </div>
          <div style={{position:'relative', height:'70vh', display:'flex', alignItems:'center', justifyContent:'center'}}>
            {/* Layered fruit composition */}
            <div style={{position:'absolute', top:'5%', right:'15%', width:280, height:280, animation:'float 8s ease-in-out infinite'}}>
              <Fruit variant="red" size={280}/>
            </div>
            <div style={{position:'absolute', bottom:'10%', left:'5%', width:180, height:180, animation:'float 10s ease-in-out infinite 2s'}}>
              <Fruit variant="white" size={180}/>
            </div>
            <div style={{position:'absolute', top:'50%', right:'55%', width:120, height:120, animation:'float 7s ease-in-out infinite 1s'}}>
              <Fruit variant="yellow" size={120}/>
            </div>
            {/* Circular text */}
            <svg viewBox="0 0 200 200" style={{position:'absolute', bottom:'-5%', right:'-5%', width:180, height:180, animation:'spin 30s linear infinite'}}>
              <defs><path id="circ" d="M 100,100 m -70,0 a 70,70 0 1,1 140,0 a 70,70 0 1,1 -140,0"/></defs>
              <text fontSize="11" fontFamily="JetBrains Mono, monospace" letterSpacing="3" fill="var(--ink-soft)">
                <textPath href="#circ">PREMIUM PITAYA • SINCE 2011 • PREMIUM PITAYA • SINCE 2011 • </textPath>
              </text>
            </svg>
          </div>
        </div>

        {/* Stats strip */}
        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:0, marginTop:40, paddingTop:40, borderTop:'1px solid var(--line)'}}>
          {[
            { n: '12,400', l: t('hero_stat_1') },
            { n: '28', l: t('hero_stat_2') },
            { n: '120+', l: t('hero_stat_3') },
            { n: '15', l: t('hero_stat_4') },
          ].map((s, i) => (
            <div key={i} style={{borderRight: i < 3 ? '1px solid var(--line)' : 'none', paddingRight:24}}>
              <div className="serif" style={{fontSize:56, lineHeight:1, letterSpacing:'-0.03em'}}>{s.n}</div>
              <div style={{fontSize:12, color:'var(--mute)', marginTop:8, textTransform:'uppercase', letterSpacing:'0.1em', fontFamily:'JetBrains Mono, monospace'}}>{s.l}</div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0); } 50% { transform: translateY(-20px) rotate(3deg); } }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </section>
  );
}

// FEATURED — horizontal scroll
function Featured() {
  const { t, lang, addToCart, setQuoteOpen, setQuotePrefill } = useApp();
  const featured = window.DD_DATA.products.filter(p => p.featured);
  return (
    <section style={{background:'var(--ink)', color:'var(--cream-light)', padding:'120px 0'}}>
      <div className="wrap">
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-end', marginBottom:60}}>
          <div>
            <div className="eyebrow" style={{color:'var(--pink-deep)', marginBottom:20}}>{t('featured_eyebrow')}</div>
            <h2 className="h2" style={{whiteSpace:'pre-line'}}>
              {t('featured_title').split('\n').map((line, i) => (
                <div key={i}>{i === 1 ? <em className="italic" style={{color:'var(--pink)'}}>{line}</em> : line}</div>
              ))}
            </h2>
          </div>
          <div style={{maxWidth:380, fontSize:15, lineHeight:1.6, opacity:0.7}}>{t('featured_sub')}</div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(4, 1fr)', gap:24}}>
          {featured.map(p => (
            <Reveal key={p.id} delay={featured.indexOf(p)*80} style={{color:'var(--ink)'}}>
              <ProductCard product={p}
                onAdd={addToCart}
                onQuote={(id)=>{setQuotePrefill(id); setQuoteOpen(true);}}
              />
            </Reveal>
          ))}
        </div>

        <div style={{textAlign:'center', marginTop:60}}>
          <a href="products.html" className="btn btn-cream">{t('view_all')} <Icon name="arrow" size={16}/></a>
        </div>
      </div>
    </section>
  );
}

// CERTIFICATIONS
function Certifications() {
  const { t, lang } = useApp();
  const certs = window.DD_DATA.certs;
  return (
    <section style={{background:'var(--cream)', padding:'120px 0'}}>
      <div className="wrap">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1.4fr', gap:80, marginBottom:60}}>
          <div>
            <div className="eyebrow" style={{marginBottom:20}}>{t('cert_eyebrow')}</div>
            <h2 className="h2" style={{whiteSpace:'pre-line'}}>
              {t('cert_title').split('\n').map((line, i) => (
                <div key={i}>{i === 1 ? <em className="italic" style={{color:'var(--magenta)'}}>{line}</em> : line}</div>
              ))}
            </h2>
          </div>
          <div style={{fontSize:17, lineHeight:1.6, color:'var(--ink-soft)', alignSelf:'end', maxWidth:520}}>
            {t('cert_sub')}
          </div>
        </div>

        <div style={{display:'grid', gridTemplateColumns:'repeat(6, 1fr)', gap:0, border:'1px solid var(--line)', borderRadius:20, overflow:'hidden', background:'var(--cream-light)'}}>
          {certs.map((c, i) => (
            <Reveal key={c.id} delay={i*60} style={{padding:32, borderRight: i < 5 ? '1px solid var(--line)' : 'none', display:'flex', flexDirection:'column', gap:16, minHeight:220, position:'relative'}}>
              <div style={{fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:'0.15em', color:'var(--mute)'}}>SINCE {c.since}</div>
              <div style={{flex:1, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <div style={{width:70, height:70, borderRadius:'50%', border:'2px solid var(--ink)', display:'flex', alignItems:'center', justifyContent:'center', fontFamily:'Cormorant Garamond, serif', fontSize:18, letterSpacing:'-0.01em', background:'var(--cream)'}}>
                  {c.short}
                </div>
              </div>
              <div>
                <div className="serif" style={{fontSize:20, lineHeight:1.1}}>{c.name}</div>
                <div style={{fontSize:12, color:'var(--mute)', marginTop:4}}>{c[`desc_${lang}`]}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

// FARM MAP
function FarmMap() {
  const { t, lang } = useApp();
  const [hovered, setHovered] = uS(null);
  const farms = window.DD_DATA.farms;
  return (
    <section style={{background:'var(--cream-light)', padding:'120px 0', position:'relative', overflow:'hidden'}}>
      <div className="wrap">
        <div style={{display:'grid', gridTemplateColumns:'1fr 1.3fr', gap:80, alignItems:'center'}}>
          <div>
            <div className="eyebrow" style={{marginBottom:20}}>{t('map_eyebrow')}</div>
            <h2 className="h2" style={{whiteSpace:'pre-line', marginBottom:24}}>
              {t('map_title').split('\n').map((line, i) => (
                <div key={i}>{i === 1 ? <em className="italic" style={{color:'var(--leaf)'}}>{line}</em> : line}</div>
              ))}
            </h2>
            <div style={{fontSize:15, lineHeight:1.6, color:'var(--ink-soft)', marginBottom:32, maxWidth:440}}>{t('map_sub')}</div>
            <div style={{display:'flex', flexDirection:'column', gap:4}}>
              {farms.map(f => (
                <div key={f.id} onMouseEnter={()=>setHovered(f.id)} onMouseLeave={()=>setHovered(null)}
                  style={{padding:'16px 0', borderTop:'1px solid var(--line)', display:'grid', gridTemplateColumns:'auto 1fr auto', gap:20, alignItems:'center', cursor:'pointer', transition:'color 0.2s', color: hovered === f.id ? 'var(--magenta)' : 'inherit'}}>
                  <div style={{fontFamily:'JetBrains Mono, monospace', fontSize:11, letterSpacing:'0.12em', color:'var(--mute)', width:32}}>0{farms.indexOf(f)+1}</div>
                  <div>
                    <div className="serif" style={{fontSize:22, lineHeight:1}}>{t(`farm_${f.id}_name`)}</div>
                    <div style={{fontSize:13, color:'var(--mute)', marginTop:4}}>{t(`farm_${f.id}_desc`)}</div>
                  </div>
                  <div className="serif" style={{fontSize:24, color: hovered === f.id ? 'var(--magenta)' : 'var(--ink)'}}>{f.size}ha</div>
                </div>
              ))}
            </div>
          </div>
          <div style={{position:'relative', aspectRatio:'5/7', maxHeight:'75vh', borderRadius:24, overflow:'hidden', background: 'linear-gradient(160deg, #EFEADE 0%, #DDD4BE 100%)'}}>
            {/* Stylized Vietnam silhouette */}
            <svg viewBox="0 0 100 140" preserveAspectRatio="xMidYMid meet" style={{position:'absolute', inset:0, width:'100%', height:'100%'}}>
              <defs>
                <pattern id="topo" width="8" height="8" patternUnits="userSpaceOnUse">
                  <circle cx="1" cy="1" r="0.5" fill="rgba(26,26,26,0.08)"/>
                </pattern>
              </defs>
              <path d="M 45,5 Q 38,15 35,25 Q 32,35 38,42 Q 40,50 36,58 Q 40,65 42,75 Q 48,82 52,90 Q 58,95 62,105 Q 68,115 72,125 Q 65,132 55,128 Q 45,125 40,115 Q 32,108 28,95 Q 25,85 28,72 Q 30,60 28,48 Q 30,35 35,22 Q 40,10 45,5 Z"
                fill="var(--cream)" stroke="var(--ink)" strokeWidth="0.3"/>
              <path d="M 45,5 Q 38,15 35,25 Q 32,35 38,42 Q 40,50 36,58 Q 40,65 42,75 Q 48,82 52,90 Q 58,95 62,105 Q 68,115 72,125 Q 65,132 55,128 Q 45,125 40,115 Q 32,108 28,95 Q 25,85 28,72 Q 30,60 28,48 Q 30,35 35,22 Q 40,10 45,5 Z"
                fill="url(#topo)" opacity="0.6"/>
              {/* HCM city star */}
              <g>
                <circle cx="52" cy="88" r="1.2" fill="var(--ink)"/>
                <text x="55" y="90" fontSize="2.8" fontFamily="JetBrains Mono, monospace" fill="var(--ink)">HO CHI MINH</text>
              </g>
              {/* Farm pins */}
              {farms.map(f => {
                const active = hovered === f.id;
                return (
                  <g key={f.id}>
                    <circle cx={f.x} cy={f.y} r={active ? 5 : 3.5}
                      fill="var(--magenta)" opacity={active ? 0.2 : 0.15}
                      style={{transition:'all 0.3s'}}/>
                    <circle cx={f.x} cy={f.y} r={active ? 2 : 1.4}
                      fill="var(--magenta)"
                      style={{transition:'all 0.3s', cursor:'pointer'}}
                      onMouseEnter={()=>setHovered(f.id)} onMouseLeave={()=>setHovered(null)}/>
                    {active && (
                      <g>
                        <rect x={f.x + 4} y={f.y - 5} width="30" height="8" rx="1" fill="var(--ink)"/>
                        <text x={f.x + 6} y={f.y + 0.5} fontSize="2.5" fontFamily="JetBrains Mono, monospace" fill="var(--cream)" letterSpacing="0.1">
                          {t(`farm_${f.id}_name`).toUpperCase().slice(0, 20)}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
            <div style={{position:'absolute', bottom:20, left:20, fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:'0.15em', color:'var(--mute)'}}>
              VIETNAM • 10°N 106°E
            </div>
            <div style={{position:'absolute', top:20, right:20, fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:'0.15em', color:'var(--mute)', textAlign:'right'}}>
              N<br/>↑
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// CTA BAND
function CtaBand() {
  const { t, setQuoteOpen } = useApp();
  return (
    <section style={{background:'var(--pink-soft)', padding:'80px 0', color:'var(--ink)'}}>
      <div className="wrap" style={{display:'grid', gridTemplateColumns:'1.4fr 1fr auto', gap:40, alignItems:'center'}}>
        <h3 className="h2" style={{fontSize:'clamp(32px, 3.5vw, 52px)'}}>
          <em className="italic">{t('cta_band_title')}</em>
        </h3>
        <div style={{fontSize:15, lineHeight:1.55, color:'var(--ink-soft)'}}>{t('cta_band_sub')}</div>
        <button className="btn btn-primary" onClick={()=>setQuoteOpen(true)}>
          {t('hero_cta_2')} <Icon name="arrow" size={16}/>
        </button>
      </div>
    </section>
  );
}

Object.assign(window, { Hero, Featured, Certifications, FarmMap, CtaBand, Reveal, useInView });
