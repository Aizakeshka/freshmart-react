import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { CATEGORIES, PRODUCTS } from '../data/products'
import ProductCard from '../components/ProductCard'
import styles from './Home.module.css'

export default function Home({ onCategorySelect }) {
  const navigate = useNavigate()
  const heroRef = useRef(null)

  const popular = [...PRODUCTS].sort((a, b) => b.popularity - a.popularity).slice(0, 8)
  const recommended = [...PRODUCTS].sort(() => Math.random() - 0.5).slice(0, 4)

  const goToCatalog = (catId) => {
    onCategorySelect(catId)
    navigate('/catalog')
  }

  return (
    <div className={`${styles.home} page-enter`}>
      {/* HERO */}
      <section className={styles.hero} ref={heroRef}>
        <div className={styles.heroBg}>
          <div className={styles.heroBlob1} />
          <div className={styles.heroBlob2} />
          <div className={styles.heroPattern} />
        </div>
        <div className={`${styles.heroContent} container`}>
          <div className={styles.heroText}>
            <span className={styles.heroTag}>🌿 Доставка за 60 минут</span>
            <h1 className={styles.heroTitle}>
              Свежие продукты<br />
              <em>прямо к двери</em>
            </h1>
            <p className={styles.heroDesc}>
              Более 120 товаров — фрукты, овощи, молочное, выпечка.<br />
              Только свежее, только лучшее.
            </p>
            <div className={styles.heroActions}>
              <button className={styles.heroBtn} onClick={() => navigate('/catalog')}>
                Перейти в каталог →
              </button>
              <div className={styles.heroStats}>
                <span><strong>120+</strong> товаров</span>
                <span><strong>4.8★</strong> рейтинг</span>
                <span><strong>60 мин</strong> доставка</span>
              </div>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.heroOrbit}>
              {['🍎','🥑','🍋','🥦','🍓','🥕','🍇','🥛'].map((e, i) => (
                <div key={i} className={styles.orbitItem} style={{ '--i': i, '--total': 8 }}>{e}</div>
              ))}
            </div>
            <div className={styles.orbitCenter}>🛒</div>
          </div>
        </div>
      </section>

      {/* PROMO BANNER */}
      <div className="container">
        <div className={styles.promoRow}>
          <div className={styles.promoCard} style={{ '--c': '#1a5c3a' }}>
            <span className={styles.promoEmoji}>🌱</span>
            <div>
              <strong>Органик-раздел</strong>
              <p>Без ГМО, только натуральное</p>
            </div>
            <button onClick={() => goToCatalog('organic')}>Смотреть →</button>
          </div>
          <div className={styles.promoCard} style={{ '--c': '#c1121f' }}>
            <span className={styles.promoEmoji}>🍓</span>
            <div>
              <strong>Сезонные ягоды</strong>
              <p>Клубника, черника, малина</p>
            </div>
            <button onClick={() => goToCatalog('berries')}>Смотреть →</button>
          </div>
          <div className={styles.promoCard} style={{ '--c': '#d4a017' }}>
            <span className={styles.promoEmoji}>🥐</span>
            <div>
              <strong>Свежая выпечка</strong>
              <p>Круассаны, хлеб на закваске</p>
            </div>
            <button onClick={() => goToCatalog('bakery')}>Смотреть →</button>
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>Категории</h2>
          <button className={styles.seeAll} onClick={() => navigate('/catalog')}>Все товары →</button>
        </div>
        <div className={styles.catGrid}>
          {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
            <button
              key={cat.id}
              className={styles.catCard}
              style={{ '--cat-color': cat.color }}
              onClick={() => goToCatalog(cat.id)}
            >
              <span className={styles.catEmoji}>{cat.emoji}</span>
              <span className={styles.catLabel}>{cat.label}</span>
              <span className={styles.catCount}>
                {PRODUCTS.filter(p => p.category === cat.id).length} товаров
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* POPULAR */}
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>🔥 Популярное</h2>
          <button className={styles.seeAll} onClick={() => navigate('/catalog')}>Смотреть всё →</button>
        </div>
        <div className={styles.productsGrid}>
          {popular.map((p, i) => (
            <ProductCard key={p.id} product={p} animateIn delay={i * 50} />
          ))}
        </div>
      </div>

      {/* RECOMMENDED */}
      <div className="container">
        <div className={styles.sectionHeader}>
          <h2 className={styles.sectionTitle}>✨ Рекомендуем попробовать</h2>
        </div>
        <div className={styles.productsGrid}>
          {recommended.map((p, i) => (
            <ProductCard key={p.id} product={p} animateIn delay={i * 60} />
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className={styles.footer}>
        <div className={`${styles.footerInner} container`}>
          <div className={styles.footerLogo}>🌿 FreshMart</div>
          <p>Свежие продукты с доставкой на дом. Только качественное.</p>
          <p className={styles.footerCopy}>© 2025 FreshMart. Все права защищены.</p>
        </div>
      </footer>
    </div>
  )
}
