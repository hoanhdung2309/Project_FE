// Shared React components for D-Dragon
const { useState, useEffect, useRef, useContext, createContext, useMemo } = React;

// ========== Global state context ==========
const AppCtx = createContext();

function AppProvider({ children }) {
  const [lang, setLang] = useState(() => localStorage.getItem('dd-lang') || 'vi');
  const [cart, setCart] = useState(() => JSON.parse(localStorage.getItem('dd-cart') || '[]'));
  const [cartOpen, setCartOpen] = useState(false);
  const [quoteOpen, setQuoteOpen] = useState(false);
  const [quotePrefill, setQuotePrefill] = useState(null);
  const [toast, setToast] = useState(null);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [darkNav, setDarkNav] = useState(true);
  const [accent, setAccent] = useState('pink'); // pink | magenta | leaf | gold

  useEffect(() => { localStorage.setItem('dd-lang', lang); }, [lang]);
  useEffect(() => { localStorage.setItem('dd-cart', JSON.stringify(cart)); }, [cart]);

  useEffect(() => {
    const accents = {
      pink: { main: '#E88BAE', deep: '#C4477A' },
      magenta: { main: '#C4477A', deep: '#8B2F57' },
      leaf: { main: '#4A6B48', deep: '#2D4A2B' },
      gold: { main: '#C9A961', deep: '#8B7438' },
    };
    const a = accents[accent];
    document.documentElement.style.setProperty('--pink-deep', a.main);
    document.documentElement.style.setProperty('--magenta', a.deep);
  }, [accent]);

  const t = (key) => (window.DD_I18N[lang] && window.DD_I18N[lang][key]) || key;
  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(null), 2500); };

  const addToCart = (product, qty) => {
    setCart(prev => {
      const existing = prev.find(it => it.id === product.id);
      if (existing) return prev.map(it => it.id === product.id ? {...it, qty: it.qty + qty} : it);
      return [...prev, { id: product.id, qty, product }];
    });
    showToast(lang === 'vi' ? `Đã thêm ${qty} ${window.DD_I18N[lang].kg}` : `Added ${qty} ${window.DD_I18N[lang].kg}`);
  };
  const updateQty = (id, qty) => setCart(prev => prev.map(it => it.id === id ? {...it, qty: Math.max(1, qty)} : it));
  const removeFromCart = (id) => setCart(prev => prev.filter(it => it.id !== id));

  // Tweaks wiring
  useEffect(() => {
    const handler = (e) => {
      if (e.data?.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data?.type === '__deactivate_edit_mode') setTweaksOpen(false);
    };
    window.addEventListener('message', handler);
    window.parent.postMessage({type: '__edit_mode_available'}, '*');
    return () => window.removeEventListener('message', handler);
  }, []);

  const value = {
    lang, setLang, t,
    cart, addToCart, updateQty, removeFromCart,
    cartOpen, setCartOpen,
    quoteOpen, setQuoteOpen, quotePrefill, setQuotePrefill,
    toast, showToast,
    tweaksOpen, setTweaksOpen,
    darkNav, setDarkNav,
    accent, setAccent,
  };
  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

const useApp = () => useContext(AppCtx);

// ========== Fruit illustration ==========
function Fruit({ variant = 'red', size = 180, style = {} }) {
  const cls = `fruit fruit-${variant}`;
  return <div className={cls} style={{ width: size, height: size, ...style }} />;
}

// ========== Logo Mark (watercolor pitaya) ==========
function PitayaMark({ size = 32, withRing = false }) {
  const id = `pm-${Math.random().toString(36).slice(2,8)}`;
  return (
    <svg width={size} height={size} viewBox="0 0 240 240" style={{flexShrink:0}}>
      <defs>
        <radialGradient id={`${id}-body`} cx="0.4" cy="0.35" r="0.85">
          <stop offset="0" stopColor="#FF8FB8"/>
          <stop offset="0.35" stopColor="#FF7AA8"/>
          <stop offset="0.7" stopColor="#E63973"/>
          <stop offset="1" stopColor="#B91C4F"/>
        </radialGradient>
        <linearGradient id={`${id}-leaf`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#D9E86B"/>
          <stop offset="0.6" stopColor="#B8D14A"/>
          <stop offset="1" stopColor="#8FB341"/>
        </linearGradient>
        <filter id={`${id}-rough`} x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves="2" seed="3"/>
          <feDisplacementMap in="SourceGraphic" scale="2.5"/>
        </filter>
      </defs>
      {withRing && (
        <>
          <circle cx="120" cy="120" r="116" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.3"/>
          <circle cx="120" cy="120" r="110" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.3"/>
        </>
      )}
      {/* Back leaves */}
      <g filter={`url(#${id}-rough)`}>
        <path d="M 60 130 Q 32 110 22 80 Q 38 92 56 110 Q 50 92 56 76 Q 68 96 70 122 Z" fill="#8FB341" opacity="0.85"/>
        <path d="M 184 124 Q 212 102 222 70 Q 208 88 192 110 Q 200 90 196 72 Q 184 96 180 122 Z" fill="#8FB341" opacity="0.85"/>
      </g>
      {/* Body */}
      <g filter={`url(#${id}-rough)`}>
        <path
          d="M 120 50 C 90 50 60 78 60 130 C 60 178 90 210 120 210 C 150 210 180 178 180 130 C 180 78 150 50 120 50 Z"
          fill={`url(#${id}-body)`}
        />
        <path
          d="M 80 130 C 78 165 95 200 120 205 C 100 195 90 165 92 135 C 94 110 105 90 122 80 C 105 75 84 100 80 130 Z"
          fill="#B91C4F" opacity="0.4"
        />
        <ellipse cx="105" cy="90" rx="22" ry="32" fill="#FFF" opacity="0.18" transform="rotate(-15 105 90)"/>
      </g>
      {/* Scale lines */}
      <g stroke="#FF7AA8" strokeWidth="1.4" fill="none" opacity="0.85" filter={`url(#${id}-rough)`}>
        <path d="M 90 110 L 120 102 L 150 110"/>
        <path d="M 75 140 L 100 130 L 130 138 L 158 132 L 175 142"/>
        <path d="M 78 170 L 105 162 L 135 170 L 162 162"/>
        <path d="M 90 195 L 118 188 L 148 195"/>
        <path d="M 100 130 L 100 162"/>
        <path d="M 130 138 L 130 170"/>
      </g>
      {/* Crown leaves */}
      <g filter={`url(#${id}-rough)`}>
        <path d="M 120 70 C 116 50 108 28 100 8 C 108 22 118 36 122 50 C 124 32 130 18 138 6 C 134 28 130 50 128 70 Z" fill={`url(#${id}-leaf)`}/>
        <path d="M 88 90 C 78 70 60 50 44 38 C 56 60 70 78 80 96 C 64 80 48 70 30 64 C 50 82 70 96 86 110 Z" fill={`url(#${id}-leaf)`} opacity="0.95"/>
        <path d="M 100 80 C 92 60 78 42 62 30 C 76 54 88 72 96 92 Z" fill="#B8D14A"/>
        <path d="M 152 90 C 162 70 180 50 196 38 C 184 60 170 78 160 96 C 176 80 192 70 210 64 C 190 82 170 96 154 110 Z" fill={`url(#${id}-leaf)`} opacity="0.95"/>
        <path d="M 140 80 C 148 60 162 42 178 30 C 164 54 152 72 144 92 Z" fill="#B8D14A"/>
        <path d="M 132 75 C 140 55 152 36 168 22 C 158 46 146 64 138 84 Z" fill="#D9E86B"/>
      </g>
      {/* Side leaves */}
      <g filter={`url(#${id}-rough)`}>
        <path d="M 60 165 Q 40 168 28 180 Q 48 178 64 172 Z" fill="#B8D14A"/>
        <path d="M 180 165 Q 200 168 212 180 Q 192 178 176 172 Z" fill="#B8D14A"/>
        <path d="M 80 200 Q 70 215 60 222 Q 80 218 92 208 Z" fill="#8FB341"/>
        <path d="M 160 200 Q 170 215 180 222 Q 160 218 148 208 Z" fill="#8FB341"/>
      </g>
    </svg>
  );
}

// ========== Logo ==========
function Logo({ onDark = true }) {
  return (
    <a href="index.html" className="nav-logo" style={{ color: onDark ? 'var(--cream-light)' : 'var(--ink)' }}>
      <PitayaMark size={36}/>
      <span>D-Dragon</span>
    </a>
  );
}

// ========== Icons (minimal line set) ==========
const Icon = ({ name, size = 18 }) => {
  const paths = {
    cart: <><path d="M3 4h2.5l1.5 12h12l1.5-8H6.5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/><circle cx="9" cy="20" r="1.4" stroke="currentColor" strokeWidth="1.4" fill="none"/><circle cx="18" cy="20" r="1.4" stroke="currentColor" strokeWidth="1.4" fill="none"/></>,
    search: <><circle cx="11" cy="11" r="6" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M20 20l-4.3-4.3" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/></>,
    user: <><circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M4 21c0-4 4-7 8-7s8 3 8 7" stroke="currentColor" strokeWidth="1.4" fill="none"/></>,
    arrow: <path d="M5 12h14m-5-5l5 5-5 5" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    arrowUp: <path d="M7 17L17 7m0 0H9m8 0v8" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round"/>,
    close: <path d="M6 6l12 12M6 18L18 6" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>,
    check: <path d="M5 12l4 4L19 7" stroke="currentColor" strokeWidth="1.6" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    plus: <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>,
    minus: <path d="M5 12h14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>,
    filter: <path d="M4 6h16M7 12h10M10 18h4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"/>,
    pin: <><path d="M12 22c-4-5-7-8-7-12a7 7 0 0114 0c0 4-3 7-7 12z" stroke="currentColor" strokeWidth="1.4" fill="none"/><circle cx="12" cy="10" r="2.5" stroke="currentColor" strokeWidth="1.4" fill="none"/></>,
    phone: <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A15 15 0 013 6a2 2 0 012-2z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M3 7l9 7 9-7" stroke="currentColor" strokeWidth="1.4" fill="none"/></>,
    chat: <path d="M4 5h16v10H10l-4 4v-4H4V5z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/>,
    leaf: <path d="M5 19c0-8 6-14 14-14 0 8-6 14-14 14zM5 19l6-6" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinecap="round" strokeLinejoin="round"/>,
    package: <><path d="M12 3l9 5v8l-9 5-9-5V8l9-5z" stroke="currentColor" strokeWidth="1.4" fill="none" strokeLinejoin="round"/><path d="M3 8l9 5 9-5M12 13v10" stroke="currentColor" strokeWidth="1.4" fill="none"/></>,
    globe: <><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.4" fill="none"/><path d="M3 12h18M12 3c3 3 3 15 0 18M12 3c-3 3-3 15 0 18" stroke="currentColor" strokeWidth="1.4" fill="none"/></>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{display:'block'}}>
      {paths[name] || null}
    </svg>
  );
};

// ========== Nav ==========
function Nav({ active }) {
  const { t, lang, setLang, cart, setCartOpen, darkNav } = useApp();
  const cartCount = cart.reduce((s, it) => s + it.qty, 0);
  return (
    <nav className="nav" style={ !darkNav ? { background: 'var(--cream-light)', color: 'var(--ink)', borderBottom: '1px solid var(--line)' } : {}}>
      <div className="nav-inner">
        <Logo onDark={darkNav} />
        <div className="nav-links">
          <a href="index.html" className={active === 'home' ? 'active' : ''}>{t('nav_home')}</a>
          <a href="products.html" className={active === 'products' ? 'active' : ''}>{t('nav_product')}</a>
          <a href="about.html" className={active === 'about' ? 'active' : ''}>{t('nav_about')}</a>
          <a href="contact.html" className={active === 'contact' ? 'active' : ''}>{t('nav_contact')}</a>
        </div>
        <div className="nav-actions">
          <div className="nav-lang">
            <button className={lang === 'vi' ? 'active' : ''} onClick={() => setLang('vi')}>VI</button>
            <span style={{opacity:0.3}}>/</span>
            <button className={lang === 'en' ? 'active' : ''} onClick={() => setLang('en')}>EN</button>
          </div>
          <button className="nav-icon-btn" onClick={() => setCartOpen(true)}>
            <Icon name="cart" size={16} />
            <span>{t('nav_cart')}</span>
            {cartCount > 0 && <span className="badge">{cartCount}</span>}
          </button>
        </div>
      </div>
    </nav>
  );
}

// ========== Footer ==========
function Footer() {
  const { t, lang } = useApp();
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <div style={{display:'flex', alignItems:'center', gap:12, marginBottom:20}}>
              <PitayaMark size={40}/>
              <span style={{fontFamily:'Cormorant Garamond, serif', fontSize:28}}>D-Dragon</span>
            </div>
            <div className="footer-tagline">{t('footer_tagline')}</div>
            <div style={{fontSize:12, opacity:0.5, marginTop:16}}>{t('footer_rights')}</div>
          </div>
          <div>
            <h5>{t('footer_shop')}</h5>
            <ul>
              <li><a href="products.html">{lang==='vi'?'Thanh long tươi':'Fresh pitaya'}</a></li>
              <li><a href="products.html">{lang==='vi'?'Sản phẩm hữu cơ':'Organic line'}</a></li>
              <li><a href="products.html">{lang==='vi'?'Chế biến':'Processed'}</a></li>
              <li><a href="products.html">{t('nav_quote')}</a></li>
            </ul>
          </div>
          <div>
            <h5>{t('footer_company')}</h5>
            <ul>
              <li><a href="about.html">{t('nav_about')}</a></li>
              <li><a href="about.html">{lang==='vi'?'Nông trại':'Our farms'}</a></li>
              <li><a href="about.html">{lang==='vi'?'Chứng nhận':'Certifications'}</a></li>
              <li><a href="contact.html">{lang==='vi'?'Tuyển dụng':'Careers'}</a></li>
            </ul>
          </div>
          <div>
            <h5>{t('footer_support')}</h5>
            <ul>
              <li><a href="contact.html">{t('nav_contact')}</a></li>
              <li><a href="#" onClick={e=>{e.preventDefault();}}>{t('nav_track')}</a></li>
              <li><a href="#" onClick={e=>e.preventDefault()}>FAQ</a></li>
              <li><a href="#" onClick={e=>e.preventDefault()}>{lang==='vi'?'Chính sách':'Policies'}</a></li>
            </ul>
          </div>
          <div>
            <h5>{t('footer_follow')}</h5>
            <div style={{fontSize:13, opacity:0.7, marginBottom:16}}>{t('footer_newsletter')}</div>
            <form className="footer-newsletter" onSubmit={e=>e.preventDefault()}>
              <input placeholder={t('footer_email_ph')} />
              <button type="submit">{t('footer_subscribe')} →</button>
            </form>
            <div className="footer-social">
              <a href="#" onClick={e=>e.preventDefault()} aria-label="Instagram">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="0.9" fill="currentColor" stroke="none"/></svg>
              </a>
              <a href="#" onClick={e=>e.preventDefault()} aria-label="LinkedIn">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5a2.5 2.5 0 1 1 0 5 2.5 2.5 0 0 1 0-5zM3 9h4v12H3zM10 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C21.4 8.65 22 11.1 22 14.3V21h-4v-5.95c0-1.42-.03-3.25-1.98-3.25-1.98 0-2.28 1.55-2.28 3.15V21h-4z"/></svg>
              </a>
              <a href="#" onClick={e=>e.preventDefault()} aria-label="Facebook">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M22 12a10 10 0 1 0-11.56 9.88v-6.99H7.9V12h2.54V9.8c0-2.5 1.49-3.89 3.78-3.89 1.09 0 2.24.2 2.24.2v2.46h-1.26c-1.24 0-1.63.77-1.63 1.56V12h2.78l-.44 2.89h-2.34v6.99A10 10 0 0 0 22 12z"/></svg>
              </a>
              <a href="#" onClick={e=>e.preventDefault()} aria-label="WhatsApp">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M17.47 14.38c-.3-.15-1.74-.86-2.01-.96-.27-.1-.46-.15-.66.15-.2.3-.76.96-.93 1.16-.17.2-.34.22-.64.07-.3-.15-1.25-.46-2.39-1.47-.88-.79-1.48-1.76-1.65-2.06-.17-.3-.02-.46.13-.61.13-.13.3-.34.45-.51.15-.17.2-.3.3-.5.1-.2.05-.37-.02-.52-.07-.15-.66-1.6-.91-2.18-.24-.57-.48-.49-.66-.5-.17-.01-.37-.01-.56-.01-.2 0-.51.07-.78.37-.27.3-1.02 1-1.02 2.43 0 1.43 1.04 2.81 1.19 3.01.15.2 2.05 3.13 4.97 4.39.69.3 1.24.48 1.66.61.7.22 1.34.19 1.84.12.56-.08 1.74-.71 1.98-1.4.24-.69.24-1.28.17-1.4-.07-.13-.27-.2-.56-.35zM12.04 2.5C6.84 2.5 2.6 6.74 2.6 11.94c0 1.66.43 3.27 1.26 4.69L2.5 21.5l5.04-1.32a9.4 9.4 0 0 0 4.5 1.15h.01c5.2 0 9.43-4.24 9.43-9.43 0-2.52-.98-4.89-2.76-6.67a9.36 9.36 0 0 0-6.68-2.73zm0 17.21h-.01a7.78 7.78 0 0 1-3.97-1.09l-.28-.17-2.99.78.8-2.92-.18-.3a7.79 7.79 0 0 1-1.19-4.13c0-4.31 3.51-7.81 7.83-7.81 2.09 0 4.05.81 5.53 2.29a7.76 7.76 0 0 1 2.29 5.53c0 4.31-3.51 7.82-7.83 7.82z"/></svg>
              </a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <div>Ho Chi Minh City • Binh Thuan • Long An</div>
          <div>hello@d-dragon.vn • +84 28 7300 9988</div>
        </div>
      </div>
    </footer>
  );
}

// ========== Cart Drawer ==========
function CartDrawer() {
  const { t, lang, cart, cartOpen, setCartOpen, updateQty, removeFromCart } = useApp();
  const subtotal = cart.reduce((s, it) => s + it.qty * it.product.price, 0);
  return (
    <>
      <div className={'drawer-backdrop ' + (cartOpen ? 'open':'')} onClick={()=>setCartOpen(false)} />
      <aside className={'drawer ' + (cartOpen ? 'open':'')}>
        <div className="drawer-head">
          <div>
            <div className="eyebrow">{t('nav_cart')}</div>
            <div className="serif" style={{fontSize:28, marginTop:4}}>{t('cart_title')}</div>
          </div>
          <button onClick={()=>setCartOpen(false)}><Icon name="close" /></button>
        </div>
        <div className="drawer-body">
          {cart.length === 0 ? (
            <div style={{padding:'60px 0', textAlign:'center'}}>
              <div className="serif" style={{fontSize:26, marginBottom:8}}>{t('cart_empty')}</div>
              <div style={{color:'var(--mute)', fontSize:14}}>{t('cart_empty_sub')}</div>
            </div>
          ) : cart.map(it => (
            <div className="cart-item" key={it.id}>
              <div className="cart-item-img">
                <Fruit variant={it.product.category === 'white' ? 'white' : it.product.category === 'red' ? 'red' : it.product.category === 'yellow' ? 'yellow' : it.product.category === 'organic' ? 'organic' : 'processed'} size={50} />
              </div>
              <div className="cart-item-body">
                <div className="cart-item-name">{it.product[`name_${lang}`]}</div>
                <div className="cart-item-meta">{window.DD_FMT_VND(it.product.price)} {t('per_kg')}</div>
                <div className="cart-item-foot">
                  <div className="qty">
                    <button onClick={()=>updateQty(it.id, it.qty - 10)}><Icon name="minus" size={12}/></button>
                    <span>{it.qty} {t('kg')}</span>
                    <button onClick={()=>updateQty(it.id, it.qty + 10)}><Icon name="plus" size={12}/></button>
                  </div>
                  <div style={{display:'flex', alignItems:'center', gap:12}}>
                    <div style={{fontSize:14, fontWeight:500}}>{window.DD_FMT_VND(it.qty * it.product.price)}</div>
                    <button onClick={()=>removeFromCart(it.id)} style={{color:'var(--mute)'}}><Icon name="close" size={14}/></button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
        {cart.length > 0 && (
          <div className="drawer-foot">
            <div style={{display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--mute)', marginBottom:6}}>
              <span>{t('cart_subtotal')}</span>
              <span>{window.DD_FMT_VND(subtotal)}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', fontSize:13, color:'var(--mute)', marginBottom:12}}>
              <span>{t('cart_shipping')}</span>
              <span>{t('cart_shipping_calc')}</span>
            </div>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', paddingTop:12, borderTop:'1px solid var(--line)', marginBottom:16}}>
              <span style={{fontSize:14}}>{t('cart_total')}</span>
              <span className="serif" style={{fontSize:24}}>{window.DD_FMT_VND(subtotal)}</span>
            </div>
            <button className="btn btn-primary" style={{width:'100%', justifyContent:'center'}}>
              {t('cart_checkout')} <Icon name="arrow" size={16} />
            </button>
          </div>
        )}
      </aside>
    </>
  );
}

// ========== Quote Modal ==========
function QuoteModal() {
  const { t, lang, quoteOpen, setQuoteOpen, quotePrefill, showToast } = useApp();
  const [sent, setSent] = useState(false);
  useEffect(() => { if (!quoteOpen) setTimeout(()=>setSent(false), 300); }, [quoteOpen]);
  return (
    <div className={'modal-backdrop ' + (quoteOpen ? 'open':'')} onClick={e=>{if(e.target.classList.contains('modal-backdrop')) setQuoteOpen(false);}}>
      <div className="modal" style={{padding: 40}}>
        {sent ? (
          <div style={{textAlign:'center', padding:'40px 0'}}>
            <div style={{width:64, height:64, borderRadius:'50%', background:'var(--pink-soft)', display:'flex', alignItems:'center', justifyContent:'center', margin:'0 auto 24px', color:'var(--magenta)'}}>
              <Icon name="check" size={32}/>
            </div>
            <div className="serif" style={{fontSize:36, marginBottom:8}}>{t('quote_sent_title')}</div>
            <div style={{color:'var(--mute)', marginBottom:24}}>{t('quote_sent_sub')}</div>
            <button className="btn btn-cream" onClick={()=>setQuoteOpen(false)}>{t('cart_continue')}</button>
          </div>
        ) : (
          <>
            <div style={{display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:24}}>
              <div>
                <div className="eyebrow">{t('nav_quote')}</div>
                <div className="serif" style={{fontSize:36, marginTop:6, lineHeight:1}}>{t('quote_title')}</div>
                <div style={{color:'var(--mute)', marginTop:8, fontSize:14, maxWidth:420}}>{t('quote_sub')}</div>
              </div>
              <button onClick={()=>setQuoteOpen(false)}><Icon name="close"/></button>
            </div>
            <form onSubmit={e=>{e.preventDefault(); setSent(true);}} style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:20}}>
              <div className="field" style={{gridColumn:'span 2'}}>
                <label>{t('quote_product')}</label>
                <select defaultValue={quotePrefill || ''}>
                  <option value="">—</option>
                  {window.DD_DATA.products.map(p => <option key={p.id} value={p.id}>{p[`name_${lang}`]}</option>)}
                </select>
              </div>
              <div className="field">
                <label>{t('quote_volume')}</label>
                <input type="text" placeholder="e.g. 20" required />
              </div>
              <div className="field">
                <label>{t('quote_destination')}</label>
                <input type="text" placeholder={lang==='vi'?'VD: Rotterdam, Hà Lan':'e.g. Rotterdam, NL'} />
              </div>
              <div className="field">
                <label>{t('quote_company')}</label>
                <input type="text" required />
              </div>
              <div className="field">
                <label>{t('quote_phone')}</label>
                <input type="tel" required />
              </div>
              <div className="field" style={{gridColumn:'span 2'}}>
                <label>{t('quote_email')}</label>
                <input type="email" required />
              </div>
              <div className="field" style={{gridColumn:'span 2'}}>
                <label>{t('quote_note')}</label>
                <textarea rows={3}/>
              </div>
              <button type="submit" className="btn btn-primary" style={{gridColumn:'span 2', justifyContent:'center', marginTop:8}}>
                {t('quote_submit')} <Icon name="arrow" size={16}/>
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

// ========== Toast ==========
function Toast() {
  const { toast } = useApp();
  if (!toast) return null;
  return <div className="toast"><Icon name="check" size={14}/> {toast}</div>;
}

// ========== Tweaks Panel ==========
function TweaksPanel() {
  const { tweaksOpen, darkNav, setDarkNav, accent, setAccent, lang, setLang } = useApp();
  const accents = [
    { id: 'pink', color: '#E88BAE' },
    { id: 'magenta', color: '#C4477A' },
    { id: 'leaf', color: '#4A6B48' },
    { id: 'gold', color: '#C9A961' },
  ];
  return (
    <div className={'tweaks-panel ' + (tweaksOpen ? 'open':'')}>
      <h4>Tweaks</h4>
      <div className="row">
        <span>Language</span>
        <div className="toggle">
          <button className={lang==='vi'?'active':''} onClick={()=>setLang('vi')}>VI</button>
          <button className={lang==='en'?'active':''} onClick={()=>setLang('en')}>EN</button>
        </div>
      </div>
      <div className="row">
        <span>Header</span>
        <div className="toggle">
          <button className={darkNav?'active':''} onClick={()=>setDarkNav(true)}>Dark</button>
          <button className={!darkNav?'active':''} onClick={()=>setDarkNav(false)}>Cream</button>
        </div>
      </div>
      <div className="row">
        <span>Accent</span>
        <div className="swatches">
          {accents.map(a => (
            <div key={a.id} className={'swatch ' + (accent===a.id?'active':'')}
              style={{background: a.color}} onClick={()=>setAccent(a.id)} />
          ))}
        </div>
      </div>
    </div>
  );
}

// ========== Product card ==========
function ProductCard({ product, onAdd, onQuote }) {
  const { lang, t } = useApp();
  const [qty, setQty] = useState(product.minOrder);
  const [hover, setHover] = useState(false);
  const variant = product.category === 'white' ? 'white' : product.category === 'red' ? 'red' : product.category === 'yellow' ? 'yellow' : product.category === 'organic' ? 'organic' : 'processed';
  return (
    <div onMouseEnter={()=>setHover(true)} onMouseLeave={()=>setHover(false)}
      style={{background:'var(--cream-light)', border:'1px solid var(--line)', borderRadius:20, overflow:'hidden', transition:'all 0.3s', transform: hover ? 'translateY(-4px)' : 'none', boxShadow: hover ? '0 20px 40px -20px rgba(0,0,0,0.15)' : 'none'}}>
      <div style={{position:'relative', aspectRatio:'1/1', background: `linear-gradient(160deg, #FAF7EF 0%, ${product.color}55 100%)`, display:'flex', alignItems:'center', justifyContent:'center', overflow:'hidden'}}>
        <Fruit variant={variant} size={hover ? 230 : 200} style={{transition:'all 0.4s cubic-bezier(.2,.8,.2,1)'}}/>
        <div style={{position:'absolute', top:16, left:16, display:'flex', flexDirection:'column', gap:6, alignItems:'flex-start'}}>
          {product.stock === 'low' && <span className="tag tag-stock-low">{t('low_stock')}</span>}
          {product.certs.slice(0, 2).map(c => <span className="tag" key={c}>{c}</span>)}
        </div>
        <div style={{position:'absolute', top:16, right:16}}>
          <span className="tag" style={{background:'var(--ink)', color:'var(--cream-light)', borderColor:'var(--ink)'}}>{product[`cat_${lang}`]}</span>
        </div>
      </div>
      <div style={{padding:24, display:'flex', flexDirection:'column', gap:10}}>
        <div className="serif" style={{fontSize:24, lineHeight:1.1}}>{product[`name_${lang}`]}</div>
        <div style={{fontSize:13, color:'var(--mute)', lineHeight:1.5, minHeight:40}}>{product[`desc_${lang}`].slice(0, 90)}…</div>
        <div style={{display:'flex', justifyContent:'space-between', alignItems:'baseline', paddingTop:12, borderTop:'1px solid var(--line)'}}>
          <div>
            <span className="serif" style={{fontSize:28}}>{window.DD_FMT_VND(product.price)}</span>
            <span style={{fontSize:12, color:'var(--mute)', marginLeft:4}}>{t('per_kg')}</span>
          </div>
          <div style={{fontFamily:'JetBrains Mono, monospace', fontSize:10, letterSpacing:'0.1em', color:'var(--mute)', textTransform:'uppercase'}}>
            {t('min_order')} {product.minOrder}{t('kg')}
          </div>
        </div>
        <div style={{display:'flex', gap:8, marginTop:8}}>
          <div className="qty" style={{flex:'0 0 auto'}}>
            <button onClick={()=>setQty(Math.max(product.minOrder, qty-10))}><Icon name="minus" size={12}/></button>
            <span>{qty} {t('kg')}</span>
            <button onClick={()=>setQty(qty+10)}><Icon name="plus" size={12}/></button>
          </div>
          <button className="btn btn-primary btn-sm" style={{flex:1, justifyContent:'center'}} onClick={()=>onAdd(product, qty)}>
            {t('add_to_cart')}
          </button>
        </div>
        <button className="btn btn-ghost btn-sm" style={{padding:'6px 0', fontSize:12, justifyContent:'flex-start'}} onClick={()=>onQuote(product.id)}>
          {t('request_quote')} →
        </button>
      </div>
    </div>
  );
}

// Export all to window
Object.assign(window, {
  AppProvider, AppCtx, useApp,
  Fruit, Logo, Icon,
  Nav, Footer, CartDrawer, QuoteModal, Toast, TweaksPanel,
  ProductCard,
});
