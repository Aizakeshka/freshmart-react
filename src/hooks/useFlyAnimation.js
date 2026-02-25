export function flyToCart(sourceEl, emoji) {
  const cartBtn = document.getElementById('cart-fab')
  if (!sourceEl || !cartBtn) return

  const from = sourceEl.getBoundingClientRect()
  const to = cartBtn.getBoundingClientRect()

  const el = document.createElement('div')
  el.style.cssText = `
    position: fixed;
    left: ${from.left + from.width / 2 - 20}px;
    top: ${from.top + from.height / 2 - 20}px;
    width: 40px; height: 40px;
    font-size: 28px; line-height: 40px; text-align: center;
    pointer-events: none; z-index: 9999;
    border-radius: 50%;
    background: rgba(255,255,255,0.9);
    box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  `
  el.textContent = emoji
  document.body.appendChild(el)

  const dx = to.left + to.width / 2 - (from.left + from.width / 2)
  const dy = to.top + to.height / 2 - (from.top + from.height / 2)

  el.animate([
    { transform: 'translate(0,0) scale(1)', opacity: 1 },
    { transform: `translate(${dx * 0.4}px, ${dy * 0.1 - 80}px) scale(1.2)`, opacity: 1, offset: 0.3 },
    { transform: `translate(${dx}px, ${dy}px) scale(0.3)`, opacity: 0.7 }
  ], {
    duration: 700,
    easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
  }).onfinish = () => {
    el.remove()
    cartBtn.classList.add('bump')
    setTimeout(() => cartBtn.classList.remove('bump'), 400)
  }
}
