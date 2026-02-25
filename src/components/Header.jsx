import { useState, useEffect, useRef } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { store } from '../hooks/useStore'
import styles from './Header.module.css'

export default function Header({ onSearch }) {
  const [cartCount, setCartCount] = useState(store.cartTotal())
  const [favCount, setFavCount] = useState(store.getFavs().length)
  const [cartOpen, setCartOpen] = useState(false)
  const [mobileMenu, setMobileMenu] = useState(false)
  const [searchVal, setSearchVal] = useState('')
  const [scrolled, setScrolled] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => store.subscribe(() => {
    setCartCount(store.cartTotal())
    setFavCount(store.getFavs().length)
  }), [])

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  const handleSearch = (e) => {
    const v = e.target.value
    setSearchVal(v)
    onSearch(v)
    if (v && location.pathname !== '/catalog') navigate('/catalog')
  }

  const isActive = (path) => location.pathname === path

  return (
    <>
      <header className={`${styles.header} ${scrolled ? styles.scrolled : ''}`}>
        <div className={`${styles.inner} container`}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>🌿</span>
            Fresh<span className={styles.logoAccent}>Mart</span>
          </Link>

          <nav className={styles.nav}>
            <Link to="/" className={`${styles.navLink} ${isActive('/') ? styles.active : ''}`}>Главная</Link>
            <Link to="/catalog" className={`${styles.navLink} ${isActive('/catalog') ? styles.active : ''}`}>Каталог</Link>
            <Link to="/favorites" className={`${styles.navLink} ${isActive('/favorites') ? styles.active : ''}`}>
              Избранное
              {favCount > 0 && <span className={styles.badge}>{favCount}</span>}
            </Link>
          </nav>

          <div className={styles.searchWrap}>
            <span className={styles.searchIcon}>🔍</span>
            <input
              className={styles.searchInput}
              type="text"
              value={searchVal}
              onChange={handleSearch}
              placeholder="Найти товар…"
            />
            {searchVal && (
              <button className={styles.searchClear} onClick={() => { setSearchVal(''); onSearch('') }}>✕</button>
            )}
          </div>

          <button
            id="cart-fab"
            className={styles.cartBtn}
            onClick={() => setCartOpen(true)}
          >
            <span className={styles.cartIcon}>🛒</span>
            {cartCount > 0 && <span className={styles.cartCount}>{cartCount}</span>}
          </button>

          <button className={styles.hamburger} onClick={() => setMobileMenu(!mobileMenu)}>
            <span /><span /><span />
          </button>
        </div>

        {mobileMenu && (
          <div className={styles.mobileNav}>
            <Link to="/" onClick={() => setMobileMenu(false)}>Главная</Link>
            <Link to="/catalog" onClick={() => setMobileMenu(false)}>Каталог</Link>
            <Link to="/favorites" onClick={() => setMobileMenu(false)}>Избранное {favCount > 0 && `(${favCount})`}</Link>
            <div className={styles.mobileSearch}>
              <span>🔍</span>
              <input
                type="text"
                value={searchVal}
                onChange={handleSearch}
                placeholder="Поиск…"
              />
            </div>
          </div>
        )}
      </header>

      {cartOpen && <CartSidebar onClose={() => setCartOpen(false)} />}

      {/* Floating cart button for mobile/scroll */}
      <button
        id="cart-fab"
        className={styles.fab}
        onClick={() => setCartOpen(true)}
      >
        <span>🛒</span>
        {cartCount > 0 && <span className={styles.fabCount}>{cartCount}</span>}
      </button>
    </>
  )
}

// ── CartSidebar ─────────────────────────────────────────────────────────
import { PRODUCTS } from '../data/products'

function CartSidebar({ onClose }) {
  const [, setTick] = useState(0)
  const cart = store.getCart()

  useEffect(() => store.subscribe(() => setTick(t => t + 1)), [])

  const items = Object.entries(store.getCart()).map(([id, qty]) => ({
    product: PRODUCTS.find(p => p.id === +id),
    qty
  })).filter(i => i.product)

  const total = store.cartPrice(PRODUCTS)

  return (
    <>
      <div className={styles.overlay} onClick={onClose} />
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h2 className={styles.sidebarTitle}>🛒 Корзина</h2>
          <button className={styles.closeBtn} onClick={onClose}>✕</button>
        </div>

        <div className={styles.sidebarItems}>
          {items.length === 0 ? (
            <div className={styles.emptyCart}>
              <span>🛒</span>
              <p>Корзина пуста</p>
              <small>Добавьте товары из каталога</small>
            </div>
          ) : items.map(({ product: p, qty }) => (
            <div key={p.id} className={styles.cartItem}>
              <div className={styles.ciEmoji}>{p.emoji}</div>
              <div className={styles.ciInfo}>
                <span className={styles.ciName}>{p.name}</span>
                <span className={styles.ciUnit}>{p.weight}</span>
                <span className={styles.ciPrice}>{p.price} ₽ × {qty} = <strong>{p.price * qty} ₽</strong></span>
              </div>
              <div className={styles.ciQty}>
                <button onClick={() => store.setQty(p.id, qty - 1)}>−</button>
                <span>{qty}</span>
                <button onClick={() => store.setQty(p.id, qty + 1)}>+</button>
              </div>
              <button className={styles.ciRemove} onClick={() => store.setQty(p.id, 0)}>🗑</button>
            </div>
          ))}
        </div>

        {items.length > 0 && (
          <div className={styles.sidebarFooter}>
            <div className={styles.cartSummary}>
              <span>Товаров: <strong>{items.reduce((a, i) => a + i.qty, 0)} шт</strong></span>
              <span>Итого: <strong className={styles.totalPrice}>{total} ₽</strong></span>
            </div>
            <button className={styles.checkoutBtn}>Оформить заказ →</button>
            <button className={styles.clearBtn} onClick={() => store.clearCart()}>Очистить корзину</button>
          </div>
        )}
      </aside>
    </>
  )
}
