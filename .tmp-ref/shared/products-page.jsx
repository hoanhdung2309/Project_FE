// Products page
function ProductsPage() {
  const { t, lang, addToCart, setQuoteOpen, setQuotePrefill } = useApp();
  const [category, setCategory] = React.useState('all');
  const [size, setSize] = React.useState([]);
  const [cert, setCert] = React.useState([]);
  const [priceMax, setPriceMax] = React.useState(200000);
  const [sort, setSort] = React.useState('featured');

  const all = window.DD_DATA.products;
  const cats = [
    { id: 'all', vi: 'Tất cả', en: 'All', count: all.length },
    { id: 'white', vi: 'Ruột trắng', en: 'White', count: all.filter(p=>p.category==='white').length },
    { id: 'red', vi: 'Ruột đỏ', en: 'Red', count: all.filter(p=>p.category==='red').length },
    { id: 'yellow', vi: 'Ruột vàng', en: 'Yellow', count: all.filter(p=>p.category==='yellow').length },
    { id: 'organic', vi: 'Hữu cơ', en: 'Organic', count: all.filter(p=>p.category==='organic').length },
    { id: 'processed', vi: 'Chế biến', en: 'Processed', count: all.filter(p=>p.category==='processed').length },
  ];
  const sizes = ['S','M','L','XL'];
  const certsList = ['VietGAP','GlobalGAP','USDA Organic','EU Organic','HACCP','ISO 22000'];

  let filtered = all.filter(p => category === 'all' || p.category === category);
  if (size.length) filtered = filtered.filter(p => size.includes(p.size));
  if (cert.length) filtered = filtered.filter(p => cert.some(c => p.certs.includes(c)));
  filtered = filtered.filter(p => p.price <= priceMax);
  if (sort === 'price_asc') filtered = [...filtered].sort((a,b)=>a.price-b.price);
  if (sort === 'price_desc') filtered = [...filtered].sort((a,b)=>b.price-a.price);
  if (sort === 'new') filtered = [...filtered].reverse();

  const toggle = (arr, setArr, v) => setArr(arr.includes(v) ? arr.filter(x=>x!==v) : [...arr, v]);

  return (
    <>
      <Nav active="products"/>
      {/* Header */}
      <section style={{background:'var(--cream-light)', padding:'80px 0 60px', borderBottom:'1px solid var(--line)'}}>
        <div className="wrap">
          <div className="eyebrow" style={{marginBottom:16}}>D-Dragon Catalog • 2026</div>
          <h1 className="h2" style={{maxWidth:900}}>{t('prod_title')}<em className="italic" style={{color:'var(--magenta)'}}>.</em></h1>
          <div style={{fontSize:16, color:'var(--ink-soft)', marginTop:16, maxWidth:560}}>{t('prod_sub')}</div>
        </div>
      </section>

      {/* Category tabs */}
      <div style={{background:'var(--cream)', borderBottom:'1px solid var(--line)', position:'sticky', top:73, zIndex:20}}>
        <div className="wrap" style={{display:'flex', gap:0, overflowX:'auto'}}>
          {cats.map(c => (
            <button key={c.id} onClick={()=>setCategory(c.id)}
              style={{padding:'20px 0', marginRight:32, fontSize:14, fontWeight:500, color: category===c.id ? 'var(--ink)' : 'var(--mute)', borderBottom: category===c.id ? '2px solid var(--magenta)' : '2px solid transparent', transition:'all 0.2s', whiteSpace:'nowrap'}}>
              {c[lang]} <span style={{color:'var(--mute)', marginLeft:4, fontSize:12}}>{c.count}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main grid */}
      <section style={{padding:'40px 0 120px'}}>
        <div className="wrap" style={{display:'grid', gridTemplateColumns:'260px 1fr', gap:48}}>
          {/* Filters */}
          <aside>
            <div style={{position:'sticky', top:160}}>
              <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
                <div className="eyebrow">Filters</div>
                <button onClick={()=>{setSize([]);setCert([]);setPriceMax(200000);}} style={{fontSize:12, color:'var(--magenta)'}}>{t('filter_reset')}</button>
              </div>

              <div style={{marginBottom:32}}>
                <div style={{fontSize:13, fontWeight:500, marginBottom:14}}>{t('filter_size')}</div>
                <div style={{display:'flex', flexDirection:'column', gap:10}}>
                  {sizes.map(s => (
                    <label key={s} style={{display:'flex', alignItems:'center', gap:10, fontSize:13, cursor:'pointer'}}>
                      <input type="checkbox" checked={size.includes(s)} onChange={()=>toggle(size, setSize, s)} style={{accentColor:'var(--magenta)'}}/>
                      {t(`size_${s.toLowerCase()}`)}
                    </label>
                  ))}
                </div>
              </div>

              <div style={{marginBottom:32}}>
                <div style={{fontSize:13, fontWeight:500, marginBottom:14}}>{t('filter_price')}</div>
                <input type="range" min={20000} max={200000} step={5000} value={priceMax} onChange={e=>setPriceMax(+e.target.value)} style={{width:'100%', accentColor:'var(--magenta)'}}/>
                <div style={{display:'flex', justifyContent:'space-between', fontSize:11, color:'var(--mute)', fontFamily:'JetBrains Mono, monospace', marginTop:6}}>
                  <span>20k</span><span style={{color:'var(--ink)'}}>≤ {(priceMax/1000).toFixed(0)}k</span>
                </div>
              </div>

              <div>
                <div style={{fontSize:13, fontWeight:500, marginBottom:14}}>{t('filter_cert')}</div>
                <div style={{display:'flex', flexDirection:'column', gap:10}}>
                  {certsList.map(c => (
                    <label key={c} style={{display:'flex', alignItems:'center', gap:10, fontSize:13, cursor:'pointer'}}>
                      <input type="checkbox" checked={cert.includes(c)} onChange={()=>toggle(cert, setCert, c)} style={{accentColor:'var(--magenta)'}}/>
                      {c}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          <div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:24}}>
              <div style={{fontSize:13, color:'var(--mute)'}}>{filtered.length} {lang==='vi'?'sản phẩm':'products'}</div>
              <div style={{display:'flex', alignItems:'center', gap:10}}>
                <span style={{fontSize:12, color:'var(--mute)', fontFamily:'JetBrains Mono, monospace', letterSpacing:'0.1em', textTransform:'uppercase'}}>{t('filter_sort')}</span>
                <select value={sort} onChange={e=>setSort(e.target.value)} style={{border:'1px solid var(--line)', padding:'8px 14px', borderRadius:100, fontSize:13, background:'var(--cream-light)', cursor:'pointer'}}>
                  <option value="featured">{t('sort_featured')}</option>
                  <option value="price_asc">{t('sort_price_asc')}</option>
                  <option value="price_desc">{t('sort_price_desc')}</option>
                  <option value="new">{t('sort_new')}</option>
                </select>
              </div>
            </div>

            {filtered.length === 0 ? (
              <div style={{padding:'80px 0', textAlign:'center', color:'var(--mute)'}}>
                <div className="serif" style={{fontSize:32, marginBottom:8, color:'var(--ink)'}}>{lang==='vi'?'Không tìm thấy sản phẩm':'No products found'}</div>
                <div style={{fontSize:14}}>{lang==='vi'?'Thử điều chỉnh bộ lọc':'Try adjusting your filters'}</div>
              </div>
            ) : (
              <div style={{display:'grid', gridTemplateColumns:'repeat(3, 1fr)', gap:24}}>
                {filtered.map(p => (
                  <ProductCard key={p.id} product={p}
                    onAdd={addToCart}
                    onQuote={(id)=>{setQuotePrefill(id); setQuoteOpen(true);}}/>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <Footer/>
      <CartDrawer/>
      <QuoteModal/>
      <Toast/>
      <TweaksPanel/>
    </>
  );
}
Object.assign(window, { ProductsPage });
