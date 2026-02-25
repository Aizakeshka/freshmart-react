/* ═══════════════════════════════════════════════════════════════════
   FreshMart — полное React-приложение (96 товаров, без бэкенда)
   Стек: React 18 (CDN) + Babel standalone
   ═══════════════════════════════════════════════════════════════════ */

const { useState, useEffect, useRef, useCallback, useMemo } = React;

/* ── localStorage helpers ─────────────────────────────────────────── */
const ls = {
  get: (k, def) => { try { return JSON.parse(localStorage.getItem(k)) ?? def; } catch{ return def; } },
  set: (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch{} },
};

/* ══════════════════════════════════════════════════════════════════
   STYLES (injected as <style> tag)
   ══════════════════════════════════════════════════════════════════ */
const CSS = `
/* ── LAYOUT ──────────────────────────────── */
.app { display:flex; flex-direction:column; min-height:100vh; }

/* ── HEADER ──────────────────────────────── */
.header {
  position:sticky; top:0; z-index:200;
  background:rgba(255,255,255,.93);
  backdrop-filter:blur(14px);
  border-bottom:1px solid var(--border);
}
.header-inner {
  max-width:1280px; margin:0 auto; padding:0 24px;
  height:68px; display:flex; align-items:center; gap:20px;
}
.logo { font-family:var(--font-d); font-size:1.7rem; font-weight:900; color:var(--forest); letter-spacing:-.03em; cursor:pointer; flex-shrink:0; }
.logo em { color:var(--accent); font-style:normal; }
.nav { display:flex; gap:4px; flex:1; }
.nav-btn {
  padding:8px 16px; border-radius:99px; font-weight:600; font-size:.9rem;
  color:var(--muted); transition:all .2s;
}
.nav-btn:hover { color:var(--green); background:var(--pale); }
.nav-btn.active { color:var(--green); background:var(--pale); }
.header-right { display:flex; align-items:center; gap:12px; margin-left:auto; }
.search-wrap { position:relative; }
.search-input {
  padding:9px 16px 9px 38px; border-radius:99px;
  border:1.5px solid var(--border); background:var(--bg);
  font-size:.88rem; width:220px; transition:all .25s; outline:none; color:var(--text);
}
.search-input:focus { border-color:var(--mid); width:280px; box-shadow:0 0 0 3px rgba(82,183,136,.15); }
.search-ico { position:absolute; left:12px; top:50%; transform:translateY(-50%); font-size:.95rem; pointer-events:none; }
.search-clear { position:absolute; right:12px; top:50%; transform:translateY(-50%); font-size:.8rem; color:var(--muted); cursor:pointer; }
.cart-btn {
  position:relative; background:var(--green); color:#fff;
  width:46px; height:46px; border-radius:50%; font-size:1.2rem;
  display:flex; align-items:center; justify-content:center;
  transition:all .2s; box-shadow:0 4px 14px rgba(45,106,79,.25);
}
.cart-btn:hover { background:var(--mid); transform:scale(1.05); }
.cart-btn.bump { animation:bump .35s ease; }
.cart-badge {
  position:absolute; top:-4px; right:-4px;
  background:var(--accent); color:#fff;
  font-size:.65rem; font-weight:800; min-width:18px; height:18px;
  border-radius:99px; display:flex; align-items:center; justify-content:center;
  padding:0 4px; animation:badgePop .3s ease;
}
.fav-header-btn {
  position:relative; width:42px; height:42px; border-radius:50%;
  border:1.5px solid var(--border); font-size:1.15rem;
  display:flex; align-items:center; justify-content:center; transition:all .2s;
}
.fav-header-btn:hover { border-color:var(--red); background:#fff0f0; }
.fav-header-badge {
  position:absolute; top:-4px; right:-4px;
  background:var(--red); color:#fff;
  font-size:.65rem; font-weight:800; min-width:18px; height:18px;
  border-radius:99px; display:flex; align-items:center; justify-content:center; padding:0 4px;
}

/* ── MAIN ────────────────────────────────── */
.main { flex:1; }

/* ── HOME / BANNER ───────────────────────── */
.banner {
  background:linear-gradient(135deg, var(--forest) 0%, #1e5c42 55%, var(--mid) 100%);
  min-height:500px; display:flex; align-items:center; overflow:hidden; position:relative;
}
.banner::before {
  content:''; position:absolute; inset:0;
  background:url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='30' cy='30' r='1.5' fill='white' fill-opacity='.07'/%3E%3C/svg%3E");
}
.banner-inner { max-width:1280px; margin:0 auto; padding:60px 48px; display:flex; align-items:center; gap:40px; width:100%; position:relative; }
.banner-text { flex:1; color:#fff; }
.banner-tag { display:inline-flex; align-items:center; gap:6px; background:rgba(255,255,255,.15); padding:6px 16px; border-radius:99px; font-size:.82rem; font-weight:600; margin-bottom:20px; letter-spacing:.04em; animation:bannerIn .6s ease; }
.banner-h1 { font-family:var(--font-d); font-size:3.4rem; line-height:1.1; margin-bottom:16px; animation:bannerIn .7s ease; }
.banner-h1 em { color:var(--accent2); font-style:normal; }
.banner-sub { font-size:1.05rem; opacity:.82; margin-bottom:36px; max-width:480px; animation:bannerIn .8s ease; }
.banner-actions { display:flex; gap:12px; flex-wrap:wrap; animation:bannerIn .9s ease; }
.btn-hero { padding:14px 32px; border-radius:99px; font-weight:700; font-size:1rem; transition:all .2s; }
.btn-hero-primary { background:var(--accent); color:#fff; box-shadow:0 6px 20px rgba(231,111,0,.35); }
.btn-hero-primary:hover { background:#ff8c00; transform:translateY(-2px); box-shadow:0 10px 28px rgba(231,111,0,.4); }
.btn-hero-outline { border:2px solid rgba(255,255,255,.5); color:#fff; }
.btn-hero-outline:hover { background:rgba(255,255,255,.12); border-color:#fff; }
.banner-visual { flex:0 0 340px; display:flex; align-items:center; justify-content:center; position:relative; }
.orbit-ring { width:300px; height:300px; position:relative; animation:orbitSpin 25s linear infinite; }
.orbit-item {
  position:absolute; font-size:2.5rem;
  animation:counterSpin 25s linear infinite;
  --a: calc(var(--i) * 51.43deg);
  left: calc(50% + 130px * cos(var(--a)) - 28px);
  top:  calc(50% + 130px * sin(var(--a)) - 28px);
  filter:drop-shadow(0 4px 8px rgba(0,0,0,.2));
}
.orbit-center { position:absolute; font-size:3.8rem; filter:drop-shadow(0 8px 16px rgba(0,0,0,.3)); animation:float 4s ease-in-out infinite; }
/* Fallback for browsers without trig functions */
.orbit-item:nth-child(1) { left:192px; top:118px; }
.orbit-item:nth-child(2) { left:148px; top:20px; }
.orbit-item:nth-child(3) { left:52px; top:48px; }
.orbit-item:nth-child(4) { left:8px; top:148px; }
.orbit-item:nth-child(5) { left:52px; top:234px; }
.orbit-item:nth-child(6) { left:148px; top:262px; }
.orbit-item:nth-child(7) { left:236px; top:220px; }

/* ── STATS BAR ───────────────────────────── */
.stats-bar { background:var(--surface); border-bottom:1px solid var(--border); }
.stats-inner { max-width:1280px; margin:0 auto; padding:0 48px; display:flex; align-items:center; gap:0; }
.stat-item { padding:18px 32px; text-align:center; flex:1; border-right:1px solid var(--border); }
.stat-item:last-child { border-right:none; }
.stat-num { font-family:var(--font-d); font-size:1.8rem; font-weight:900; color:var(--green); }
.stat-label { font-size:.78rem; color:var(--muted); font-weight:500; text-transform:uppercase; letter-spacing:.06em; margin-top:2px; }

/* ── CONTAINER ───────────────────────────── */
.container { max-width:1280px; margin:0 auto; padding:0 24px; }

/* ── SECTION TITLE ───────────────────────── */
.section-header { display:flex; align-items:baseline; justify-content:space-between; margin:48px 0 24px; }
.section-title { font-family:var(--font-d); font-size:2rem; color:var(--forest); }
.section-link { font-size:.88rem; font-weight:600; color:var(--green); cursor:pointer; }
.section-link:hover { color:var(--mid); }

/* ── CATEGORIES GRID ─────────────────────── */
.cats-grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(130px,1fr)); gap:14px; margin-bottom:8px; }
.cat-card {
  background:var(--surface); border-radius:var(--r); border:1.5px solid var(--border);
  padding:22px 14px; display:flex; flex-direction:column; align-items:center; gap:10px;
  font-weight:600; font-size:.88rem; color:var(--green);
  transition:all .2s; box-shadow:var(--shadow); cursor:pointer;
  text-align:center;
}
.cat-card:hover { transform:translateY(-4px); border-color:var(--mid); box-shadow:var(--shadow-lg); }
.cat-card.active { background:var(--green); color:#fff; border-color:var(--green); }
.cat-emoji { font-size:2rem; }

/* ── CATALOG LAYOUT ──────────────────────── */
.catalog-wrap { padding:32px 0 64px; }
.catalog-layout { display:grid; grid-template-columns:260px 1fr; gap:32px; }
.filters-sidebar {
  background:var(--surface); border-radius:var(--r); border:1.5px solid var(--border);
  padding:24px; height:fit-content; position:sticky; top:84px; box-shadow:var(--shadow);
}
.filters-title { font-family:var(--font-d); font-size:1.15rem; color:var(--forest); margin-bottom:20px; }
.filter-group { margin-bottom:24px; }
.filter-label { display:block; font-size:.78rem; font-weight:700; color:var(--muted); text-transform:uppercase; letter-spacing:.06em; margin-bottom:10px; }
.filter-cats { display:flex; flex-wrap:wrap; gap:6px; }
.filter-cat-btn { padding:6px 12px; border-radius:99px; font-size:.8rem; font-weight:600; border:1.5px solid var(--border); color:var(--muted); transition:all .15s; cursor:pointer; }
.filter-cat-btn:hover { border-color:var(--mid); color:var(--green); }
.filter-cat-btn.active { background:var(--green); color:#fff; border-color:var(--green); }
.price-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:8px; }
.price-val { font-weight:700; color:var(--green); font-size:.9rem; }
.range-input { width:100%; accent-color:var(--green); cursor:pointer; }
.sort-select {
  width:100%; padding:9px 12px; border-radius:10px;
  border:1.5px solid var(--border); background:var(--bg);
  outline:none; font-size:.88rem; color:var(--text); cursor:pointer;
}
.sort-select:focus { border-color:var(--mid); }
.filter-toggle-row { display:flex; flex-direction:column; gap:8px; }
.toggle-label { display:flex; align-items:center; gap:8px; cursor:pointer; font-size:.88rem; font-weight:500; }
.toggle-label input { accent-color:var(--green); width:15px; height:15px; }
.btn-reset { width:100%; padding:10px; border-radius:10px; border:1.5px solid var(--border); color:var(--muted); font-size:.85rem; font-weight:600; transition:all .2s; }
.btn-reset:hover { border-color:var(--red); color:var(--red); background:#fff5f5; }

/* ── CATALOG MAIN ────────────────────────── */
.catalog-topbar { display:flex; align-items:center; justify-content:space-between; margin-bottom:20px; }
.catalog-count { color:var(--muted); font-size:.88rem; }
.view-toggle { display:flex; gap:4px; }
.view-btn { width:34px; height:34px; border-radius:8px; border:1.5px solid var(--border); font-size:.9rem; display:flex; align-items:center; justify-content:center; color:var(--muted); transition:all .2s; }
.view-btn.active { background:var(--green); color:#fff; border-color:var(--green); }
.view-btn:hover:not(.active) { border-color:var(--mid); color:var(--green); }

/* ── PRODUCTS GRID ───────────────────────── */
.products-grid { display:grid; grid-template-columns:repeat(auto-fill,minmax(200px,1fr)); gap:20px; }
.products-grid.list-view { grid-template-columns:1fr; }

/* ── PRODUCT CARD ────────────────────────── */
.product-card {
  background:var(--surface); border-radius:var(--r);
  border:1.5px solid var(--border); padding:20px;
  display:flex; flex-direction:column; gap:4px;
  position:relative; transition:transform .22s, box-shadow .22s;
  box-shadow:var(--shadow); overflow:hidden; cursor:default;
  animation:fadeIn .35s ease both;
}
.product-card:hover { transform:translateY(-5px); box-shadow:var(--shadow-lg); border-color:var(--light); }
.product-card.list-card { flex-direction:row; align-items:center; gap:20px; padding:16px 20px; }
.product-card.list-card .product-emoji { font-size:2.8rem; margin:0; }
.product-card.list-card .card-body { flex:1; }
.product-card.list-card .card-actions { margin-top:0; flex-shrink:0; text-align:right; min-width:130px; }
.badge-chip {
  position:absolute; top:12px; left:12px;
  padding:3px 10px; border-radius:99px; font-size:.68rem; font-weight:800; text-transform:uppercase; letter-spacing:.06em;
}
.badge-hit  { background:#fff3cd; color:#856404; }
.badge-prem { background:linear-gradient(135deg,#f5c518,#e8a000); color:#fff; }
.badge-disc { background:#ffe0e0; color:#c0392b; }
.badge-seas { background:#d4edda; color:#155724; }
.fav-btn-card {
  position:absolute; top:10px; right:10px; font-size:1.1rem;
  transition:transform .2s; z-index:1; width:30px; height:30px;
  display:flex; align-items:center; justify-content:center; border-radius:50%;
}
.fav-btn-card:hover { transform:scale(1.25); background:rgba(0,0,0,.04); }
.fav-btn-card.faved { animation:heartPop .3s ease; }
.product-emoji { font-size:3.5rem; text-align:center; margin:10px 0; line-height:1; }
.product-cat-label { font-size:.68rem; text-transform:uppercase; letter-spacing:.07em; color:var(--muted); font-weight:600; }
.product-name { font-weight:700; font-size:1rem; line-height:1.3; margin:4px 0; color:var(--forest); }
.product-desc { font-size:.78rem; color:var(--muted); line-height:1.45; margin:4px 0; }
.product-rating { display:flex; align-items:center; gap:5px; margin:4px 0; }
.stars { color:var(--accent2); font-size:.85rem; letter-spacing:-1px; }
.rating-val { font-size:.78rem; font-weight:600; color:var(--muted); }
.rating-votes { font-size:.72rem; color:var(--muted); opacity:.7; }
.price-row-card { display:flex; align-items:baseline; gap:8px; margin-top:8px; }
.price-main { font-size:1.25rem; font-weight:800; color:var(--forest); font-family:var(--font-d); }
.price-old { font-size:.85rem; color:var(--muted); text-decoration:line-through; }
.price-unit { font-size:.75rem; color:var(--muted); font-weight:400; }
.card-actions { margin-top:12px; }
.btn-add {
  width:100%; padding:10px; border-radius:12px;
  background:var(--green); color:#fff; font-weight:700; font-size:.88rem;
  transition:all .2s;
}
.btn-add:hover { background:var(--mid); }
.qty-ctrl { display:flex; align-items:center; border:1.5px solid var(--green); border-radius:12px; overflow:hidden; }
.qty-btn { width:38px; height:38px; font-size:1.2rem; font-weight:700; color:var(--green); transition:background .15s; }
.qty-btn:hover { background:var(--pale); }
.qty-num { flex:1; text-align:center; font-weight:800; font-size:1rem; color:var(--green); }

/* ── RECOMMENDATIONS ─────────────────────── */
.reco-banner {
  background:linear-gradient(120deg, var(--pale) 0%, #fff 60%);
  border:1.5px solid var(--border); border-radius:var(--r);
  padding:24px 28px; margin-bottom:32px;
  display:flex; align-items:center; gap:16px;
}
.reco-icon { font-size:2rem; }
.reco-text h4 { font-family:var(--font-d); font-size:1.05rem; color:var(--forest); margin-bottom:4px; }
.reco-text p { font-size:.82rem; color:var(--muted); }
.reco-refresh { margin-left:auto; font-size:1.1rem; width:36px; height:36px; border-radius:50%; border:1.5px solid var(--border); display:flex; align-items:center; justify-content:center; color:var(--green); transition:all .3s; }
.reco-refresh:hover { background:var(--pale); transform:rotate(180deg); }

/* ── EMPTY ───────────────────────────────── */
.empty-state { text-align:center; padding:100px 24px; }
.empty-icon { font-size:4.5rem; margin-bottom:16px; }
.empty-state h3 { font-family:var(--font-d); font-size:1.6rem; color:var(--forest); margin-bottom:8px; }
.empty-state p { color:var(--muted); margin-bottom:24px; }

/* ── CART SIDEBAR ────────────────────────── */
.cart-overlay {
  position:fixed; inset:0; z-index:400; background:rgba(0,0,0,.45);
  opacity:0; pointer-events:none; transition:opacity .3s; backdrop-filter:blur(3px);
}
.cart-overlay.open { opacity:1; pointer-events:all; }
.cart-sidebar {
  position:fixed; top:0; right:0; bottom:0; z-index:401;
  width:420px; background:var(--surface);
  transform:translateX(100%); transition:transform .35s cubic-bezier(.4,0,.2,1);
  display:flex; flex-direction:column; box-shadow:-8px 0 40px rgba(0,0,0,.15);
}
.cart-sidebar.open { transform:translateX(0); }
.cart-head {
  padding:24px; display:flex; align-items:center; justify-content:space-between;
  border-bottom:1px solid var(--border); flex-shrink:0;
}
.cart-title { font-family:var(--font-d); font-size:1.5rem; color:var(--forest); }
.cart-close { width:36px; height:36px; border-radius:50%; border:1.5px solid var(--border); font-size:1rem; display:flex; align-items:center; justify-content:center; color:var(--muted); transition:all .2s; }
.cart-close:hover { border-color:var(--red); color:var(--red); background:#fff0f0; }
.cart-body { flex:1; overflow-y:auto; padding:16px; }
.cart-empty-state { display:flex; flex-direction:column; align-items:center; padding:60px 24px; text-align:center; }
.cart-empty-ico { font-size:4rem; margin-bottom:16px; opacity:.5; }
.cart-empty-state p { color:var(--muted); font-size:.95rem; }
.cart-item { display:flex; align-items:center; gap:12px; padding:14px; border-radius:14px; margin-bottom:10px; background:var(--bg); border:1px solid var(--border); }
.ci-emo { font-size:2rem; flex-shrink:0; }
.ci-info { flex:1; min-width:0; }
.ci-name { font-weight:700; font-size:.9rem; color:var(--forest); margin-bottom:2px; }
.ci-price { font-size:.78rem; color:var(--muted); }
.ci-controls { display:flex; align-items:center; border:1.5px solid var(--border); border-radius:8px; overflow:hidden; }
.ci-btn { width:28px; height:28px; font-size:1rem; font-weight:700; color:var(--green); transition:background .15s; }
.ci-btn:hover { background:var(--pale); }
.ci-qty { font-weight:800; font-size:.9rem; min-width:22px; text-align:center; color:var(--text); }
.ci-total { font-weight:800; font-size:.95rem; color:var(--green); flex-shrink:0; font-family:var(--font-d); }
.cart-remove { width:24px; height:24px; border-radius:50%; color:var(--muted); font-size:.75rem; display:flex; align-items:center; justify-content:center; transition:all .2s; }
.cart-remove:hover { background:#ffe0e0; color:var(--red); }
.cart-foot { padding:20px 24px; border-top:1px solid var(--border); flex-shrink:0; }
.cart-total-row { display:flex; justify-content:space-between; align-items:center; margin-bottom:16px; }
.cart-total-label { font-size:1rem; font-weight:600; color:var(--muted); }
.cart-total-sum { font-family:var(--font-d); font-size:1.8rem; font-weight:900; color:var(--forest); }
.btn-checkout { width:100%; padding:14px; border-radius:14px; background:linear-gradient(135deg,var(--green),var(--mid)); color:#fff; font-weight:800; font-size:1rem; margin-bottom:8px; transition:all .2s; box-shadow:0 6px 20px rgba(45,106,79,.3); }
.btn-checkout:hover { box-shadow:0 10px 28px rgba(45,106,79,.4); transform:translateY(-1px); }
.btn-clear-cart { width:100%; padding:10px; border-radius:14px; border:1.5px solid var(--border); color:var(--muted); font-size:.85rem; font-weight:600; transition:all .2s; }
.btn-clear-cart:hover { border-color:var(--red); color:var(--red); background:#fff5f5; }

/* ── CHECKOUT SUCCESS MODAL ──────────────── */
.modal-overlay { position:fixed; inset:0; z-index:500; background:rgba(0,0,0,.5); display:flex; align-items:center; justify-content:center; padding:24px; }
.modal-box { background:#fff; border-radius:24px; padding:48px 40px; text-align:center; max-width:440px; width:100%; box-shadow:0 24px 80px rgba(0,0,0,.2); animation:fadeIn .3s ease; }
.modal-icon { font-size:4rem; margin-bottom:16px; }
.modal-box h2 { font-family:var(--font-d); font-size:2rem; color:var(--forest); margin-bottom:8px; }
.modal-box p { color:var(--muted); margin-bottom:24px; line-height:1.6; }
.btn-modal { padding:12px 32px; border-radius:99px; background:var(--green); color:#fff; font-weight:700; font-size:1rem; transition:all .2s; }
.btn-modal:hover { background:var(--mid); }

/* ── FAVORITES PAGE ──────────────────────── */
.page-wrap { padding:40px 0 64px; }
.page-hero { background:linear-gradient(135deg,var(--pale),#fff); border-radius:var(--r); padding:36px 40px; margin-bottom:36px; border:1.5px solid var(--border); }
.page-hero h1 { font-family:var(--font-d); font-size:2.4rem; color:var(--forest); margin-bottom:8px; }
.page-hero p { color:var(--muted); font-size:1rem; }

/* ── FLY CONTAINER ───────────────────────── */
#fly-container { position:fixed; inset:0; pointer-events:none; z-index:9999; overflow:hidden; }
.fly-dot { position:fixed; font-size:1.8rem; pointer-events:none; will-change:transform; }

/* ── TOAST ───────────────────────────────── */
.toast-wrap { position:fixed; bottom:28px; left:50%; transform:translateX(-50%); z-index:600; display:flex; flex-direction:column; gap:8px; align-items:center; pointer-events:none; }
.toast { background:var(--forest); color:#fff; padding:10px 20px; border-radius:99px; font-size:.85rem; font-weight:600; animation:fadeIn .3s ease; box-shadow:0 6px 20px rgba(0,0,0,.2); white-space:nowrap; }

/* ── NO RESULTS ──────────────────────────── */
.no-results { grid-column:1/-1; text-align:center; padding:80px 24px; }
.no-results .emoji { font-size:3.5rem; margin-bottom:12px; }
.no-results p { color:var(--muted); font-size:1rem; }

/* ── FOOTER ──────────────────────────────── */
.footer { background:var(--forest); color:rgba(255,255,255,.7); text-align:center; padding:28px 24px; font-size:.82rem; }
.footer strong { color:#fff; font-family:var(--font-d); font-size:1rem; }

/* ── SCROLLABLE WITH NO SCROLLBAR (mobile) ─ */
.no-scrollbar { -ms-overflow-style:none; scrollbar-width:none; }
.no-scrollbar::-webkit-scrollbar { display:none; }

/* ── RESPONSIVE ──────────────────────────── */
@media(max-width:1024px){
  .catalog-layout { grid-template-columns:220px 1fr; }
  .banner-inner { padding:48px 32px; }
  .banner-h1 { font-size:2.8rem; }
}
@media(max-width:860px){
  .catalog-layout { grid-template-columns:1fr; }
  .filters-sidebar { position:static; }
  .filter-cats { flex-direction:row; }
  .banner-visual { display:none; }
  .banner-inner { padding:40px 24px; }
  .stats-inner { padding:0 24px; }
  .stat-item { padding:14px 16px; }
  .stat-num { font-size:1.4rem; }
}
@media(max-width:640px){
  .header-inner { gap:12px; }
  .nav { gap:2px; }
  .nav-btn { padding:8px 10px; font-size:.82rem; }
  .search-input { width:130px; }
  .search-input:focus { width:160px; }
  .logo { font-size:1.4rem; }
  .cart-sidebar { width:100%; }
  .banner-h1 { font-size:2rem; }
  .section-title { font-size:1.6rem; }
  .products-grid { grid-template-columns:repeat(auto-fill,minmax(155px,1fr)); gap:14px; }
  .stats-inner { flex-wrap:wrap; }
  .stat-item { width:50%; border-right:none; border-bottom:1px solid var(--border); }
  .modal-box { padding:32px 24px; }
}
`;

/* ══════════════════════════════════════════════════════════════════
   UTILITY COMPONENTS
   ══════════════════════════════════════════════════════════════════ */
function Stars({ rating }) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return React.createElement('span', { className: 'stars' },
    '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0))
  );
}

function BadgeChip({ badge }) {
  if (!badge) return null;
  const cls = badge === 'Хит' ? 'badge-hit' : badge === 'Premium' ? 'badge-prem' : badge === 'Сезон' ? 'badge-seas' : 'badge-disc';
  return React.createElement('span', { className: `badge-chip ${cls}` }, badge);
}

/* ══════════════════════════════════════════════════════════════════
   PRODUCT CARD
   ══════════════════════════════════════════════════════════════════ */
function ProductCard({ product, listView, cart, onAdd, onQty, favorites, onFav, cardRef }) {
  const qty = cart[product.id] || 0;
  const isFav = favorites.includes(product.id);
  const cat = CATEGORIES.find(c => c.id === product.cat);

  return React.createElement('div', {
    className: `product-card${listView ? ' list-card' : ''}`,
    ref: cardRef,
    'data-id': product.id,
  },
    React.createElement(BadgeChip, { badge: product.badge }),
    React.createElement('button', {
      className: `fav-btn-card${isFav ? ' faved' : ''}`,
      onClick: () => onFav(product.id),
      title: isFav ? 'Убрать из избранного' : 'В избранное',
    }, isFav ? '❤️' : '🤍'),

    React.createElement('div', { className: 'product-emoji', id: `emo-${product.id}` }, product.emoji),

    React.createElement('div', { className: 'card-body' },
      React.createElement('span', { className: 'product-cat-label' }, cat?.label || ''),
      React.createElement('h3', { className: 'product-name' }, product.name),
      listView && React.createElement('p', { className: 'product-desc' }, product.desc),
      React.createElement('div', { className: 'product-rating' },
        React.createElement(Stars, { rating: product.rating }),
        React.createElement('span', { className: 'rating-val' }, product.rating),
        React.createElement('span', { className: 'rating-votes' }, `(${product.votes.toLocaleString()})`),
      ),
      React.createElement('div', { className: 'price-row-card' },
        React.createElement('span', { className: 'price-main' }, `${product.price} ₽`),
        product.oldPrice && React.createElement('span', { className: 'price-old' }, `${product.oldPrice} ₽`),
        React.createElement('span', { className: 'price-unit' }, `/ ${product.unit}`),
      ),
    ),

    React.createElement('div', { className: 'card-actions' },
      qty === 0
        ? React.createElement('button', { className: 'btn-add', onClick: (e) => onAdd(product, e) }, '🛒 В корзину')
        : React.createElement('div', { className: 'qty-ctrl' },
          React.createElement('button', { className: 'qty-btn', onClick: () => onQty(product.id, -1) }, '−'),
          React.createElement('span', { className: 'qty-num' }, qty),
          React.createElement('button', { className: 'qty-btn', onClick: () => onQty(product.id, 1) }, '+'),
        )
    ),
  );
}

/* ══════════════════════════════════════════════════════════════════
   CART SIDEBAR
   ══════════════════════════════════════════════════════════════════ */
function CartSidebar({ open, cart, onClose, onQty, onClear, onCheckout }) {
  const items = Object.entries(cart).map(([id, qty]) => {
    const p = PRODUCTS.find(p => p.id === +id);
    return p ? { ...p, qty } : null;
  }).filter(Boolean);

  const total = items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalQty = items.reduce((s, i) => s + i.qty, 0);

  return React.createElement(React.Fragment, null,
    React.createElement('div', { className: `cart-overlay${open ? ' open' : ''}`, onClick: onClose }),
    React.createElement('aside', { className: `cart-sidebar${open ? ' open' : ''}` },
      React.createElement('div', { className: 'cart-head' },
        React.createElement('h2', { className: 'cart-title' }, `Корзина ${totalQty > 0 ? `(${totalQty})` : ''}`),
        React.createElement('button', { className: 'cart-close', onClick: onClose }, '✕'),
      ),
      React.createElement('div', { className: 'cart-body' },
        items.length === 0
          ? React.createElement('div', { className: 'cart-empty-state' },
            React.createElement('div', { className: 'cart-empty-ico' }, '🛒'),
            React.createElement('p', null, 'Корзина пуста — добавьте что-нибудь вкусное!'),
          )
          : items.map(item =>
            React.createElement('div', { key: item.id, className: 'cart-item' },
              React.createElement('span', { className: 'ci-emo' }, item.emoji),
              React.createElement('div', { className: 'ci-info' },
                React.createElement('div', { className: 'ci-name' }, item.name),
                React.createElement('div', { className: 'ci-price' }, `${item.price} ₽ / ${item.unit}`),
              ),
              React.createElement('div', { className: 'ci-controls' },
                React.createElement('button', { className: 'ci-btn', onClick: () => onQty(item.id, -1) }, '−'),
                React.createElement('span', { className: 'ci-qty' }, item.qty),
                React.createElement('button', { className: 'ci-btn', onClick: () => onQty(item.id, 1) }, '+'),
              ),
              React.createElement('span', { className: 'ci-total' }, `${(item.price * item.qty).toLocaleString()} ₽`),
              React.createElement('button', { className: 'cart-remove', onClick: () => onQty(item.id, -item.qty), title: 'Удалить' }, '✕'),
            )
          ),
      ),
      items.length > 0 && React.createElement('div', { className: 'cart-foot' },
        React.createElement('div', { className: 'cart-total-row' },
          React.createElement('span', { className: 'cart-total-label' }, 'Итого:'),
          React.createElement('span', { className: 'cart-total-sum' }, `${total.toLocaleString()} ₽`),
        ),
        React.createElement('button', { className: 'btn-checkout', onClick: onCheckout }, '✓ Оформить заказ'),
        React.createElement('button', { className: 'btn-clear-cart', onClick: onClear }, 'Очистить корзину'),
      ),
    ),
  );
}

/* ══════════════════════════════════════════════════════════════════
   FILTERS SIDEBAR
   ══════════════════════════════════════════════════════════════════ */
function FiltersSidebar({ activeCat, setActiveCat, maxPrice, setMaxPrice, sort, setSort, onlyDiscount, setOnlyDiscount, onlyPremium, setOnlyPremium, onReset }) {
  return React.createElement('aside', { className: 'filters-sidebar' },
    React.createElement('div', { className: 'filters-title' }, '🎛 Фильтры'),

    React.createElement('div', { className: 'filter-group' },
      React.createElement('span', { className: 'filter-label' }, 'Категория'),
      React.createElement('div', { className: 'filter-cats' },
        CATEGORIES.map(c =>
          React.createElement('button', {
            key: c.id,
            className: `filter-cat-btn${activeCat === c.id ? ' active' : ''}`,
            onClick: () => setActiveCat(c.id),
          }, c.emoji + ' ' + (c.id === 'all' ? 'Все' : c.label))
        )
      ),
    ),

    React.createElement('div', { className: 'filter-group' },
      React.createElement('div', { className: 'price-row' },
        React.createElement('span', { className: 'filter-label', style:{marginBottom:0} }, 'Цена до'),
        React.createElement('span', { className: 'price-val' }, `${maxPrice} ₽`),
      ),
      React.createElement('input', {
        type: 'range', min: 30, max: 700, value: maxPrice,
        className: 'range-input',
        onChange: e => setMaxPrice(+e.target.value),
      }),
    ),

    React.createElement('div', { className: 'filter-group' },
      React.createElement('span', { className: 'filter-label' }, 'Сортировка'),
      React.createElement('select', { className: 'sort-select', value: sort, onChange: e => setSort(e.target.value) },
        React.createElement('option', { value:'default' }, 'По умолчанию'),
        React.createElement('option', { value:'popular' }, 'По популярности'),
        React.createElement('option', { value:'rating' }, 'По рейтингу'),
        React.createElement('option', { value:'price-asc' }, 'Цена ↑'),
        React.createElement('option', { value:'price-desc' }, 'Цена ↓'),
        React.createElement('option', { value:'name' }, 'По названию А-Я'),
      ),
    ),

    React.createElement('div', { className: 'filter-group' },
      React.createElement('span', { className: 'filter-label' }, 'Дополнительно'),
      React.createElement('div', { className: 'filter-toggle-row' },
        React.createElement('label', { className: 'toggle-label' },
          React.createElement('input', { type:'checkbox', checked:onlyDiscount, onChange: e => setOnlyDiscount(e.target.checked) }),
          '🏷 Только со скидкой',
        ),
        React.createElement('label', { className: 'toggle-label' },
          React.createElement('input', { type:'checkbox', checked:onlyPremium, onChange: e => setOnlyPremium(e.target.checked) }),
          '⭐ Только Premium',
        ),
      ),
    ),

    React.createElement('button', { className: 'btn-reset', onClick: onReset }, '↺ Сбросить фильтры'),
  );
}

/* ══════════════════════════════════════════════════════════════════
   HOME PAGE
   ══════════════════════════════════════════════════════════════════ */
function HomePage({ cart, onAdd, onQty, favorites, onFav, onGoToCatalog }) {
  const orbitEmojis = ['🍎','🥑','🍋','🥕','🍇','🥦','🍓','🍌'];
  const popular = useMemo(() =>
    [...PRODUCTS].sort((a,b) => b.pop - a.pop).slice(0, 8)
  , []);

  return React.createElement('div', null,
    // BANNER
    React.createElement('section', { className: 'banner' },
      React.createElement('div', { className: 'banner-inner' },
        React.createElement('div', { className: 'banner-text' },
          React.createElement('div', { className: 'banner-tag' }, '🌿 Свежее. Каждый день.'),
          React.createElement('h1', { className: 'banner-h1' },
            'Продукты с грядки — ', React.createElement('em', null, 'к вашему столу')
          ),
          React.createElement('p', { className: 'banner-sub' }, '96 позиций свежих фруктов, овощей, молочного и выпечки. Доставка за 60 минут.'),
          React.createElement('div', { className: 'banner-actions' },
            React.createElement('button', { className: 'btn-hero btn-hero-primary', onClick: () => onGoToCatalog('all') }, '🛍 В каталог'),
            React.createElement('button', { className: 'btn-hero btn-hero-outline', onClick: () => onGoToCatalog('fruits') }, '🍎 Фрукты'),
          ),
        ),
        React.createElement('div', { className: 'banner-visual' },
          React.createElement('div', { className: 'orbit-ring' },
            orbitEmojis.map((e, i) =>
              React.createElement('span', { key: i, className: 'orbit-item', style: {'--i': i} }, e)
            ),
          ),
          React.createElement('div', { className: 'orbit-center' }, '🛒'),
        ),
      ),
    ),

    // STATS BAR
    React.createElement('div', { className: 'stats-bar' },
      React.createElement('div', { className: 'stats-inner' },
        [
          { num: '96', label: 'Товаров' },
          { num: '9', label: 'Категорий' },
          { num: '60 мин', label: 'Доставка' },
          { num: '4.7★', label: 'Средний рейтинг' },
        ].map(s => React.createElement('div', { key: s.label, className: 'stat-item' },
          React.createElement('div', { className: 'stat-num' }, s.num),
          React.createElement('div', { className: 'stat-label' }, s.label),
        )),
      ),
    ),

    React.createElement('div', { className: 'container' },
      // CATEGORIES
      React.createElement('div', { className: 'section-header' },
        React.createElement('h2', { className: 'section-title' }, 'Категории'),
        React.createElement('span', { className: 'section-link', onClick: () => onGoToCatalog('all') }, 'Все товары →'),
      ),
      React.createElement('div', { className: 'cats-grid' },
        CATEGORIES.filter(c => c.id !== 'all').map(cat =>
          React.createElement('button', {
            key: cat.id, className: 'cat-card',
            onClick: () => onGoToCatalog(cat.id),
          },
            React.createElement('span', { className: 'cat-emoji' }, cat.emoji),
            React.createElement('span', null, cat.label),
          )
        ),
      ),

      // POPULAR
      React.createElement('div', { className: 'section-header' },
        React.createElement('h2', { className: 'section-title' }, '🔥 Популярные'),
        React.createElement('span', { className: 'section-link', onClick: () => onGoToCatalog('all') }, 'Смотреть все →'),
      ),
      React.createElement('div', { className: 'products-grid' },
        popular.map(p =>
          React.createElement(ProductCard, {
            key: p.id, product: p, listView: false,
            cart, onAdd, onQty, favorites, onFav,
          })
        ),
      ),

      // NEW (high-rated with badge)
      React.createElement('div', { className: 'section-header', style:{marginTop:32} },
        React.createElement('h2', { className: 'section-title' }, '⭐ Premium выбор'),
      ),
      React.createElement('div', { className: 'products-grid' },
        PRODUCTS.filter(p => p.badge === 'Premium').slice(0, 8).map(p =>
          React.createElement(ProductCard, {
            key: p.id, product: p, listView: false,
            cart, onAdd, onQty, favorites, onFav,
          })
        ),
      ),
    ),
  );
}

/* ══════════════════════════════════════════════════════════════════
   CATALOG PAGE
   ══════════════════════════════════════════════════════════════════ */
function CatalogPage({ initialCat, cart, onAdd, onQty, favorites, onFav }) {
  const [activeCat, setActiveCat] = useState(initialCat || 'all');
  const [maxPrice, setMaxPrice] = useState(700);
  const [sort, setSort] = useState('popular');
  const [listView, setListView] = useState(false);
  const [search, setSearch] = useState('');
  const [onlyDiscount, setOnlyDiscount] = useState(false);
  const [onlyPremium, setOnlyPremium] = useState(false);
  const [recoSeed, setRecoSeed] = useState(0);

  useEffect(() => { if (initialCat) setActiveCat(initialCat); }, [initialCat]);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (activeCat !== 'all') list = list.filter(p => p.cat === activeCat);
    list = list.filter(p => p.price <= maxPrice);
    if (search) list = list.filter(p => p.name.toLowerCase().includes(search.toLowerCase()));
    if (onlyDiscount) list = list.filter(p => p.oldPrice);
    if (onlyPremium) list = list.filter(p => p.badge === 'Premium');

    if (sort === 'popular') list.sort((a,b) => b.pop - a.pop);
    else if (sort === 'rating') list.sort((a,b) => b.rating - a.rating);
    else if (sort === 'price-asc') list.sort((a,b) => a.price - b.price);
    else if (sort === 'price-desc') list.sort((a,b) => b.price - a.price);
    else if (sort === 'name') list.sort((a,b) => a.name.localeCompare(b.name, 'ru'));
    return list;
  }, [activeCat, maxPrice, sort, search, onlyDiscount, onlyPremium]);

  const recommendations = useMemo(() => {
    const shuffled = [...PRODUCTS].sort(() => Math.sin(recoSeed + PRODUCTS.indexOf(PRODUCTS[0])) - 0.5);
    return shuffled.slice(0, 5);
  }, [recoSeed]);

  const resetFilters = () => {
    setActiveCat('all'); setMaxPrice(700); setSort('popular');
    setSearch(''); setOnlyDiscount(false); setOnlyPremium(false);
  };

  return React.createElement('div', { className: 'catalog-wrap' },
    React.createElement('div', { className: 'container' },

      // RECOMMENDATIONS
      React.createElement('div', { className: 'reco-banner' },
        React.createElement('span', { className: 'reco-icon' }, '✨'),
        React.createElement('div', { className: 'reco-text' },
          React.createElement('h4', null, 'Рекомендуем попробовать'),
          React.createElement('p', null, recommendations.slice(0,3).map(p => p.emoji + ' ' + p.name).join(' • ')),
        ),
        React.createElement('button', { className: 'reco-refresh', onClick: () => setRecoSeed(s => s + 1), title: 'Обновить рекомендации' }, '↻'),
      ),

      React.createElement('div', { className: 'catalog-layout' },
        // SIDEBAR
        React.createElement(FiltersSidebar, {
          activeCat, setActiveCat, maxPrice, setMaxPrice,
          sort, setSort, onlyDiscount, setOnlyDiscount, onlyPremium, setOnlyPremium,
          onReset: resetFilters,
        }),

        // MAIN
        React.createElement('div', null,
          React.createElement('div', { className: 'catalog-topbar' },
            React.createElement('div', { style: { flex:1 } },
              React.createElement('div', { style: { position:'relative' } },
                React.createElement('input', {
                  type: 'text', className: 'search-input', value: search, placeholder: '🔍 Поиск в каталоге…',
                  onChange: e => setSearch(e.target.value),
                  style: { width:'100%', maxWidth:360 },
                }),
                search && React.createElement('span', { className: 'search-clear', onClick: () => setSearch(''), style:{right:16} }, '✕'),
              ),
              React.createElement('div', { className: 'catalog-count', style:{marginTop:6} }, `${filtered.length} из ${PRODUCTS.length} товаров`),
            ),
            React.createElement('div', { className: 'view-toggle' },
              React.createElement('button', {
                className: `view-btn${!listView ? ' active' : ''}`,
                onClick: () => setListView(false), title: 'Сетка',
              }, '▦'),
              React.createElement('button', {
                className: `view-btn${listView ? ' active' : ''}`,
                onClick: () => setListView(true), title: 'Список',
              }, '☰'),
            ),
          ),

          filtered.length === 0
            ? React.createElement('div', { className: 'no-results' },
              React.createElement('div', { className: 'emoji' }, '😕'),
              React.createElement('p', null, 'По вашему запросу ничего не найдено. Попробуйте изменить фильтры.'),
            )
            : React.createElement('div', { className: `products-grid${listView ? ' list-view' : ''}` },
              filtered.map(p =>
                React.createElement(ProductCard, {
                  key: p.id, product: p, listView,
                  cart, onAdd, onQty, favorites, onFav,
                })
              ),
            ),
        ),
      ),
    ),
  );
}

/* ══════════════════════════════════════════════════════════════════
   FAVORITES PAGE
   ══════════════════════════════════════════════════════════════════ */
function FavoritesPage({ favorites, cart, onAdd, onQty, onFav, onGoToCatalog }) {
  const favProducts = PRODUCTS.filter(p => favorites.includes(p.id));

  return React.createElement('div', { className: 'page-wrap' },
    React.createElement('div', { className: 'container' },
      React.createElement('div', { className: 'page-hero' },
        React.createElement('h1', null, '❤️ Избранное'),
        React.createElement('p', null, favProducts.length
          ? `${favProducts.length} ${favProducts.length === 1 ? 'товар' : favProducts.length < 5 ? 'товара' : 'товаров'} в вашем списке`
          : 'Сохраняйте любимые товары сердечком — они появятся здесь'),
      ),

      favProducts.length === 0
        ? React.createElement('div', { className: 'empty-state' },
          React.createElement('div', { className: 'empty-icon' }, '🤍'),
          React.createElement('h3', null, 'Список пуст'),
          React.createElement('p', null, 'Нажмите ❤️ на любом товаре, чтобы добавить его в избранное'),
          React.createElement('button', { className: 'btn-hero btn-hero-primary', onClick: () => onGoToCatalog('all') }, 'Перейти в каталог'),
        )
        : React.createElement('div', { className: 'products-grid' },
          favProducts.map(p =>
            React.createElement(ProductCard, {
              key: p.id, product: p, listView: false,
              cart, onAdd, onQty, favorites, onFav,
            })
          ),
        ),
    ),
  );
}

/* ══════════════════════════════════════════════════════════════════
   CHECKOUT MODAL
   ══════════════════════════════════════════════════════════════════ */
function CheckoutModal({ onClose }) {
  return React.createElement('div', { className: 'modal-overlay', onClick: onClose },
    React.createElement('div', { className: 'modal-box', onClick: e => e.stopPropagation() },
      React.createElement('div', { className: 'modal-icon' }, '🎉'),
      React.createElement('h2', null, 'Заказ оформлен!'),
      React.createElement('p', null, 'Ваш заказ принят и уже готовится к доставке. Курьер прибудет в течение 60 минут.'),
      React.createElement('button', { className: 'btn-modal', onClick: onClose }, 'Отлично!'),
    ),
  );
}

/* ══════════════════════════════════════════════════════════════════
   FLY ANIMATION
   ══════════════════════════════════════════════════════════════════ */
function flyToCart(product, event) {
  const cartBtn = document.getElementById('cart-btn');
  if (!cartBtn) return;

  const cartRect = cartBtn.getBoundingClientRect();
  const emoEl = document.getElementById(`emo-${product.id}`);
  const fromRect = emoEl
    ? emoEl.getBoundingClientRect()
    : { left: event.clientX, top: event.clientY, width: 0, height: 0 };

  const startX = fromRect.left + fromRect.width / 2;
  const startY = fromRect.top + fromRect.height / 2;
  const endX = cartRect.left + cartRect.width / 2;
  const endY = cartRect.top + cartRect.height / 2;

  const el = document.createElement('div');
  el.className = 'fly-dot';
  el.textContent = product.emoji;
  el.style.left = startX + 'px';
  el.style.top = startY + 'px';
  el.style.setProperty('--dx', (endX - startX) + 'px');
  el.style.setProperty('--dy', (endY - startY) + 'px');
  el.style.animation = 'flyArc .65s cubic-bezier(.4,0,.2,1) forwards';

  document.getElementById('fly-container').appendChild(el);
  setTimeout(() => el.remove(), 700);
}

/* ══════════════════════════════════════════════════════════════════
   ROOT APP
   ══════════════════════════════════════════════════════════════════ */
function App() {
  const [page, setPage] = useState('home');
  const [catalogCat, setCatalogCat] = useState('all');
  const [cart, setCart] = useState(() => ls.get('fm_cart', {}));
  const [favorites, setFavorites] = useState(() => ls.get('fm_favs', []));
  const [cartOpen, setCartOpen] = useState(false);
  const [searchQ, setSearchQ] = useState('');
  const [checkoutDone, setCheckoutDone] = useState(false);
  const [toasts, setToasts] = useState([]);
  const [cartBump, setCartBump] = useState(false);

  // Persist
  useEffect(() => { ls.set('fm_cart', cart); }, [cart]);
  useEffect(() => { ls.set('fm_favs', favorites); }, [favorites]);

  const totalQty = useMemo(() => Object.values(cart).reduce((a,b) => a+b, 0), [cart]);

  const showToast = useCallback((msg) => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 2500);
  }, []);

  const addToCart = useCallback((product, event) => {
    setCart(c => ({ ...c, [product.id]: (c[product.id] || 0) + 1 }));
    flyToCart(product, event);
    setCartBump(true);
    setTimeout(() => setCartBump(false), 400);
    showToast(`${product.emoji} ${product.name} добавлен в корзину`);
  }, [showToast]);

  const changeQty = useCallback((id, delta) => {
    setCart(c => {
      const next = { ...c, [id]: (c[id] || 0) + delta };
      if (next[id] <= 0) delete next[id];
      return next;
    });
  }, []);

  const clearCart = useCallback(() => {
    setCart({});
    showToast('Корзина очищена');
  }, [showToast]);

  const toggleFav = useCallback((id) => {
    setFavorites(f => {
      const next = f.includes(id) ? f.filter(x => x !== id) : [...f, id];
      const p = PRODUCTS.find(p => p.id === id);
      if (p) showToast(f.includes(id) ? `${p.emoji} Убрано из избранного` : `${p.emoji} Добавлено в избранное`);
      return next;
    });
  }, [showToast]);

  const checkout = useCallback(() => {
    setCart({});
    setCartOpen(false);
    setCheckoutDone(true);
  }, []);

  const goToCatalog = useCallback((cat) => {
    setCatalogCat(cat);
    setPage('catalog');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const navigate = useCallback((p) => {
    setPage(p);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Inject CSS once
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return React.createElement('div', { className: 'app' },

    // FLY CONTAINER
    React.createElement('div', { id: 'fly-container' }),

    // TOASTS
    React.createElement('div', { className: 'toast-wrap' },
      toasts.map(t => React.createElement('div', { key: t.id, className: 'toast' }, t.msg)),
    ),

    // CART
    React.createElement(CartSidebar, {
      open: cartOpen, cart, favorites,
      onClose: () => setCartOpen(false),
      onQty: changeQty, onClear: clearCart, onCheckout: checkout,
    }),

    // CHECKOUT MODAL
    checkoutDone && React.createElement(CheckoutModal, { onClose: () => setCheckoutDone(false) }),

    // HEADER
    React.createElement('header', { className: 'header' },
      React.createElement('div', { className: 'header-inner' },
        React.createElement('span', { className: 'logo', onClick: () => navigate('home') },
          'Fresh', React.createElement('em', null, 'Mart'),
        ),
        React.createElement('nav', { className: 'nav' },
          ['home','catalog','favorites'].map(p =>
            React.createElement('button', {
              key: p,
              className: `nav-btn${page === p ? ' active' : ''}`,
              onClick: () => navigate(p),
            }, p === 'home' ? '🏠 Главная' : p === 'catalog' ? '🛍 Каталог' : `❤️ Избранное`)
          ),
        ),
        React.createElement('div', { className: 'header-right' },
          React.createElement('div', { className: 'search-wrap' },
            React.createElement('span', { className: 'search-ico' }, '🔍'),
            React.createElement('input', {
              type: 'text', className: 'search-input',
              placeholder: 'Поиск товаров…', value: searchQ,
              onChange: e => setSearchQ(e.target.value),
              onFocus: () => { if (page !== 'catalog') { navigate('catalog'); } },
            }),
            searchQ && React.createElement('span', { className: 'search-clear', onClick: () => setSearchQ('') }, '✕'),
          ),
          React.createElement('button', {
            className: `fav-header-btn`,
            onClick: () => navigate('favorites'),
            title: 'Избранное',
          },
            '🤍',
            favorites.length > 0 && React.createElement('span', { className: 'fav-header-badge' }, favorites.length),
          ),
          React.createElement('button', {
            id: 'cart-btn',
            className: `cart-btn${cartBump ? ' bump' : ''}`,
            onClick: () => setCartOpen(o => !o),
            title: 'Корзина',
          },
            '🛒',
            totalQty > 0 && React.createElement('span', { className: 'cart-badge', key: totalQty }, totalQty),
          ),
        ),
      ),
    ),

    // MAIN CONTENT
    React.createElement('main', { className: 'main' },
      page === 'home' && React.createElement(HomePage, {
        cart, onAdd: addToCart, onQty: changeQty, favorites, onFav: toggleFav, onGoToCatalog: goToCatalog,
      }),
      page === 'catalog' && React.createElement(CatalogPage, {
        initialCat: catalogCat, cart, onAdd: addToCart, onQty: changeQty, favorites, onFav: toggleFav,
      }),
      page === 'favorites' && React.createElement(FavoritesPage, {
        favorites, cart, onAdd: addToCart, onQty: changeQty, onFav: toggleFav, onGoToCatalog: goToCatalog,
      }),
    ),

    // FOOTER
    React.createElement('footer', { className: 'footer' },
      React.createElement('strong', null, 'FreshMart'),
      React.createElement('span', null, ' — все данные хранятся локально в вашем браузере. Бэкенд не нужен. '),
      React.createElement('span', null, '🌿 Сделано с любовью к свежим продуктам.'),
    ),
  );
}

/* ── MOUNT ──────────────────────────────────────────────────────────── */
ReactDOM.createRoot(document.getElementById('root')).render(
  React.createElement(App)
);
