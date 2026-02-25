import { useState, useEffect, useMemo } from 'react'
import { CATEGORIES, PRODUCTS } from '../data/products'
import ProductCard from '../components/ProductCard'
import styles from './Catalog.module.css'

const SORT_OPTIONS = [
  { value: 'popular', label: '🔥 По популярности' },
  { value: 'rating', label: '⭐ По рейтингу' },
  { value: 'price-asc', label: '💰 Цена: дешевле' },
  { value: 'price-desc', label: '💎 Цена: дороже' },
  { value: 'name', label: '🔤 По названию' },
]

export default function Catalog({ selectedCategory, searchQuery }) {
  const [activeCategory, setActiveCategory] = useState(selectedCategory || 'all')
  const [priceMax, setPriceMax] = useState(1000)
  const [sort, setSort] = useState('popular')
  const [showFilters, setShowFilters] = useState(false)
  const [activeTags, setActiveTags] = useState([])

  useEffect(() => {
    if (selectedCategory) setActiveCategory(selectedCategory)
  }, [selectedCategory])

  const maxProductPrice = Math.max(...PRODUCTS.map(p => p.price))

  // Collect all unique tags
  const allTags = useMemo(() => {
    const t = new Set()
    PRODUCTS.forEach(p => p.tags?.forEach(tag => t.add(tag)))
    return [...t].slice(0, 20)
  }, [])

  const filtered = useMemo(() => {
    let list = [...PRODUCTS]

    if (activeCategory !== 'all') {
      list = list.filter(p => p.category === activeCategory)
    }
    list = list.filter(p => p.price <= priceMax)
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      list = list.filter(p =>
        p.name.toLowerCase().includes(q) ||
        p.tags?.some(t => t.toLowerCase().includes(q))
      )
    }
    if (activeTags.length > 0) {
      list = list.filter(p => activeTags.some(t => p.tags?.includes(t)))
    }

    switch (sort) {
      case 'price-asc': list.sort((a, b) => a.price - b.price); break
      case 'price-desc': list.sort((a, b) => b.price - a.price); break
      case 'rating': list.sort((a, b) => b.rating - a.rating); break
      case 'name': list.sort((a, b) => a.name.localeCompare(b.name, 'ru')); break
      default: list.sort((a, b) => b.popularity - a.popularity)
    }
    return list
  }, [activeCategory, priceMax, sort, searchQuery, activeTags])

  const toggleTag = (tag) => {
    setActiveTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag])
  }

  const resetFilters = () => {
    setActiveCategory('all')
    setPriceMax(maxProductPrice)
    setSort('popular')
    setActiveTags([])
  }

  const hasFilters = activeCategory !== 'all' || priceMax < maxProductPrice || activeTags.length > 0

  return (
    <div className={`${styles.catalog} page-enter`}>
      <div className="container">
        <div className={styles.topbar}>
          <div className={styles.topbarLeft}>
            <h1 className={styles.title}>Каталог</h1>
            <span className={styles.count}>{filtered.length} товаров</span>
          </div>
          <div className={styles.topbarRight}>
            <select
              className={styles.sortSelect}
              value={sort}
              onChange={e => setSort(e.target.value)}
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
            <button
              className={`${styles.filterToggle} ${showFilters ? styles.filterActive : ''}`}
              onClick={() => setShowFilters(!showFilters)}
            >
              🎛 Фильтры {hasFilters && <span className={styles.filterDot} />}
            </button>
          </div>
        </div>

        {/* CATEGORY PILLS */}
        <div className={styles.catPills}>
          {CATEGORIES.map(cat => (
            <button
              key={cat.id}
              className={`${styles.catPill} ${activeCategory === cat.id ? styles.catPillActive : ''}`}
              style={activeCategory === cat.id ? { '--pill-color': cat.color } : {}}
              onClick={() => setActiveCategory(cat.id)}
            >
              {cat.emoji} {cat.label}
              {cat.id !== 'all' && (
                <span className={styles.catPillCount}>
                  {PRODUCTS.filter(p => p.category === cat.id).length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className={styles.layout}>
          {/* FILTERS SIDEBAR */}
          {showFilters && (
            <aside className={styles.filters}>
              <div className={styles.filtersHeader}>
                <h3>Фильтры</h3>
                {hasFilters && (
                  <button className={styles.resetBtn} onClick={resetFilters}>Сбросить</button>
                )}
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>
                  Цена до: <strong>{priceMax} ₽</strong>
                </label>
                <input
                  type="range" min={10} max={maxProductPrice}
                  value={priceMax}
                  onChange={e => setPriceMax(+e.target.value)}
                  className={styles.slider}
                />
                <div className={styles.sliderRange}>
                  <span>10 ₽</span>
                  <span>{maxProductPrice} ₽</span>
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Теги</label>
                <div className={styles.tagFilters}>
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      className={`${styles.tagFilter} ${activeTags.includes(tag) ? styles.tagFilterActive : ''}`}
                      onClick={() => toggleTag(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div className={styles.filterGroup}>
                <label className={styles.filterLabel}>Сортировка</label>
                {SORT_OPTIONS.map(o => (
                  <button
                    key={o.value}
                    className={`${styles.sortOption} ${sort === o.value ? styles.sortActive : ''}`}
                    onClick={() => setSort(o.value)}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </aside>
          )}

          {/* PRODUCTS */}
          <div className={styles.main}>
            {filtered.length === 0 ? (
              <div className={styles.empty}>
                <span className={styles.emptyIcon}>🔍</span>
                <p>Ничего не найдено</p>
                <small>Попробуйте изменить фильтры</small>
                <button className={styles.resetBtn2} onClick={resetFilters}>Сбросить фильтры</button>
              </div>
            ) : (
              <div className={`${styles.grid} ${showFilters ? styles.gridNarrow : ''}`}>
                {filtered.map((p, i) => (
                  <ProductCard key={p.id} product={p} animateIn delay={Math.min(i * 30, 300)} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
