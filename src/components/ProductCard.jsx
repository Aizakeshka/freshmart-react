import { useRef, useState, useEffect } from 'react'
import { store } from '../hooks/useStore'
import { flyToCart } from '../hooks/useFlyAnimation'
import { BADGE_COLORS } from '../data/products'
import styles from './ProductCard.module.css'

export default function ProductCard({ product: p, animateIn = false, delay = 0 }) {
  const [qty, setQty] = useState(store.getCart()[p.id] || 0)
  const [isFav, setIsFav] = useState(store.getFavs().includes(p.id))
  const [removing, setRemoving] = useState(false)
  const emojiRef = useRef(null)

  useEffect(() => store.subscribe(() => {
    setQty(store.getCart()[p.id] || 0)
    setIsFav(store.getFavs().includes(p.id))
  }), [p.id])

  const handleAdd = () => {
    store.addToCart(p.id)
    flyToCart(emojiRef.current, p.emoji)
  }

  const handleQty = (delta) => {
    const next = qty + delta
    if (next < 0) return
    if (next === 0) {
      setRemoving(true)
      setTimeout(() => {
        store.setQty(p.id, 0)
        setRemoving(false)
      }, 280)
    } else {
      store.setQty(p.id, next)
    }
  }

  const handleFav = () => store.toggleFav(p.id)

  const stars = Math.round(p.rating)
  const badge = p.badge ? BADGE_COLORS[p.badge] : null

  return (
    <div
      className={`${styles.card} ${animateIn ? styles.animIn : ''} ${removing ? styles.removing : ''}`}
      style={animateIn ? { animationDelay: `${delay}ms` } : {}}
    >
      {p.badge && (
        <span
          className={styles.badge}
          style={{ background: badge?.bg, color: badge?.text, border: `1px solid ${badge?.border}` }}
        >
          {p.badge}
        </span>
      )}

      <button
        className={`${styles.favBtn} ${isFav ? styles.favActive : ''}`}
        onClick={handleFav}
        title={isFav ? 'Убрать из избранного' : 'В избранное'}
      >
        {isFav ? '❤️' : '🤍'}
      </button>

      <div className={styles.emojiWrap} ref={emojiRef}>
        <div className={styles.emoji}>{p.emoji}</div>
        <div className={styles.emojiGlow} />
      </div>

      <div className={styles.body}>
        <div className={styles.meta}>
          <span className={styles.weight}>{p.weight}</span>
          <div className={styles.stars}>
            {'★'.repeat(stars)}{'☆'.repeat(5 - stars)}
            <span className={styles.ratingNum}>{p.rating}</span>
            <span className={styles.reviews}>({p.reviews})</span>
          </div>
        </div>

        <h3 className={styles.name}>{p.name}</h3>

        {p.tags && (
          <div className={styles.tags}>
            {p.tags.slice(0, 2).map(t => (
              <span key={t} className={styles.tag}>{t}</span>
            ))}
          </div>
        )}

        <div className={styles.footer}>
          <span className={styles.price}>{p.price} ₽</span>

          {qty === 0 ? (
            <button className={styles.addBtn} onClick={handleAdd}>
              <span>+</span> В корзину
            </button>
          ) : (
            <div className={styles.qtyCtrl}>
              <button onClick={() => handleQty(-1)}>−</button>
              <span>{qty}</span>
              <button onClick={() => handleQty(1)}>+</button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
