import { useState, useCallback } from 'react'

const loadLS = (key, def) => {
  try { return JSON.parse(localStorage.getItem(key)) ?? def }
  catch { return def }
}
const saveLS = (key, val) => {
  try { localStorage.setItem(key, JSON.stringify(val)) } catch {}
}

// Singleton state outside React to share across components
let _cart = loadLS('fm_cart', {})
let _favs = loadLS('fm_favs', [])
let _listeners = []

const notify = () => _listeners.forEach(fn => fn())

export const store = {
  getCart: () => _cart,
  getFavs: () => _favs,
  addToCart(id) {
    _cart = { ..._cart, [id]: (_cart[id] || 0) + 1 }
    saveLS('fm_cart', _cart)
    notify()
  },
  setQty(id, qty) {
    if (qty <= 0) {
      const { [id]: _, ...rest } = _cart
      _cart = rest
    } else {
      _cart = { ..._cart, [id]: qty }
    }
    saveLS('fm_cart', _cart)
    notify()
  },
  clearCart() {
    _cart = {}
    saveLS('fm_cart', _cart)
    notify()
  },
  toggleFav(id) {
    _favs = _favs.includes(id) ? _favs.filter(f => f !== id) : [..._favs, id]
    saveLS('fm_favs', _favs)
    notify()
  },
  subscribe(fn) {
    _listeners.push(fn)
    return () => { _listeners = _listeners.filter(l => l !== fn) }
  },
  cartTotal() {
    return Object.values(_cart).reduce((a, b) => a + b, 0)
  },
  cartPrice(products) {
    return Object.entries(_cart).reduce((sum, [id, qty]) => {
      const p = products.find(p => p.id === +id)
      return sum + (p ? p.price * qty : 0)
    }, 0)
  }
}

export function useStore() {
  const [, setTick] = useState(0)
  useState(() => {
    return store.subscribe(() => setTick(t => t + 1))
  })
  return store
}
