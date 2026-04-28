// About page
function AboutPage() {
  const { t, lang } = useApp();
  const timeline = window.DD_DATA.timeline;
  return (
    <>
      <Nav active="about"/>

      {/* Hero */}
      <section style={{background:'var(--cream)', padding:'100px 0 80px'}}>
        <div className="wrap">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:80, alignItems:'center'}}>
            <div>
              <div className="eyebrow" style={{marginBottom:24}}>{t('about_eyebrow')}</div>
              <h1 className="display" style={{fontSize:'clamp(48px, 6vw, 88px)', whiteSpace:'pre-line'}}>
                {t('about_title').split('\n').map((l,i) => <div key={i}>{i===1 ? <em className="italic" style={{color:'var(--magenta)'}}>{l}</em> : l}</div>)}
              </h1>
              <p style={{fontSize:17, lineHeight:1.65, color:'var(--ink-soft)', marginTop:32, maxWidth:520}}>{t('about_body')}</p>
            </div>
            <div style={{position:'relative', aspectRatio:'4/5', borderRadius:24, overflow:'hidden', background:'linear-gradient(160deg, #F4C2D755 0%, #C4477A22 100%)', display:'flex', alignItems:'center', justifyContent:'center'}}>
              <div style={{position:'absolute', inset:0, display:'flex', alignItems:'center', justifyContent:'center'}}>
                <Fruit variant="red" size={340}/>
              </div>
              <div style={{position:'absolute', bottom:24, left:24, right:24, padding:20, background:'rgba(245,241,232,0.9)', backdropFilter:'blur(8px)', borderRadius:16}}>
                <div style={{fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:'0.15em', color:'var(--mute)'}}>BINH THUAN, VIETNAM</div>
                <div className="serif" style={{fontSize:22, marginTop:4}}>{lang==='vi'?'Nông trại gốc':'Our origin farm'} • 2011</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section style={{background:'var(--ink)', color:'var(--cream-light)', padding:'120px 0'}}>
        <div className="wrap">
          <div className="eyebrow" style={{color:'var(--pink-deep)', marginBottom:24}}>{t('about_values_title')}</div>
          <h2 className="h2" style={{maxWidth:800, marginBottom:80}}>
            {lang==='vi' ? <>Ba nguyên tắc định hình <em className="italic" style={{color:'var(--pink)'}}>mọi quyết định</em> của chúng tôi.</> : <>Three principles that shape <em className="italic" style={{color:'var(--pink)'}}>every decision</em> we make.</>}
          </h2>
          <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:32}}>
            {[1,2,3].map(n => (
              <div key={n} style={{padding:40, borderTop:'1px solid rgba(255,255,255,0.2)', minHeight:300, display:'flex', flexDirection:'column'}}>
                <div style={{fontFamily:'Cormorant Garamond, serif', fontSize:88, lineHeight:1, color:'var(--pink-deep)', marginBottom:16}}>0{n}</div>
                <div className="serif" style={{fontSize:30, lineHeight:1.1, marginBottom:16}}>{t(`about_value_${n}_title`)}</div>
                <div style={{fontSize:15, lineHeight:1.6, opacity:0.75, marginTop:'auto'}}>{t(`about_value_${n}_desc`)}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section style={{background:'var(--cream-light)', padding:'120px 0'}}>
        <div className="wrap">
          <div className="eyebrow" style={{marginBottom:20}}>Timeline</div>
          <h2 className="h2" style={{marginBottom:60}}>{t('timeline_title')}<em className="italic" style={{color:'var(--magenta)'}}>.</em></h2>
          <div style={{position:'relative'}}>
            <div style={{position:'absolute', left:100, top:0, bottom:0, width:1, background:'var(--line)'}}/>
            {timeline.map((e, i) => (
              <div key={i} style={{display:'grid', gridTemplateColumns:'100px 60px 1fr', gap:0, padding:'28px 0', borderBottom: i < timeline.length-1 ? '1px solid var(--line)' : 'none', alignItems:'flex-start'}}>
                <div className="serif" style={{fontSize:36, lineHeight:1, color:'var(--magenta)'}}>{e.year}</div>
                <div style={{position:'relative', height:40}}>
                  <div style={{position:'absolute', left:-4, top:10, width:13, height:13, borderRadius:'50%', background:'var(--cream-light)', border:'2px solid var(--magenta)'}}/>
                </div>
                <div style={{fontSize:18, lineHeight:1.5, maxWidth:620, paddingTop:6}}>{e[lang]}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Farm showcase */}
      <section style={{background:'var(--cream)', padding:'120px 0'}}>
        <div className="wrap">
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:40}}>
            <div className="ph-image" style={{aspectRatio:'4/3', borderRadius:16, minHeight:320}}>FARM PHOTO — AERIAL VIEW</div>
            <div className="ph-image" style={{aspectRatio:'4/3', borderRadius:16, minHeight:320}}>PACKING FACILITY — INTERIOR</div>
            <div className="ph-image" style={{aspectRatio:'4/3', borderRadius:16, minHeight:320}}>HARVEST — HAND-PICKED</div>
            <div className="ph-image" style={{aspectRatio:'4/3', borderRadius:16, minHeight:320}}>EXPORT CONTAINER — BINH THUAN PORT</div>
          </div>
          <div style={{fontSize:12, color:'var(--mute)', fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.12em', textTransform:'uppercase', textAlign:'center', marginTop:32}}>
            {lang==='vi'?'Ảnh tư liệu — D-Dragon Group 2024':'Editorial photography — D-Dragon Group 2024'}
          </div>
        </div>
      </section>

      <CtaBand/>
      <Footer/>
      <CartDrawer/>
      <QuoteModal/>
      <Toast/>
      <TweaksPanel/>
    </>
  );
}
Object.assign(window, { AboutPage });
