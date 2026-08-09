(() => {
  if (!window.matchMedia('(pointer: coarse)').matches) return;

  let startX = 0;
  let startY = 0;
  let tracking = false;
  let horizontal = false;

  const fallbackBack = () => document.querySelector('a.back-link, a.hookah-picker__back, a.domes-picker__back, a.dome-detail__back')?.href;
  const reset = () => {
    tracking = false;
    horizontal = false;
    document.documentElement.classList.remove('is-swipe-back');
  };

  document.addEventListener('touchstart', event => {
    if (event.touches.length !== 1 || event.target.closest('input, textarea, select, [data-no-swipe-back]')) return;
    const touch = event.touches[0];
    if (touch.clientX > 28) return;
    startX = touch.clientX;
    startY = touch.clientY;
    tracking = true;
    horizontal = false;
  }, { passive: true });

  document.addEventListener('touchmove', event => {
    if (!tracking || event.touches.length !== 1) return;
    const touch = event.touches[0];
    const deltaX = touch.clientX - startX;
    const deltaY = touch.clientY - startY;
    if (!horizontal && (Math.abs(deltaX) > 12 || Math.abs(deltaY) > 12)) {
      horizontal = deltaX > 0 && Math.abs(deltaX) > Math.abs(deltaY) * 1.35;
      if (!horizontal) tracking = false;
    }
    if (horizontal) {
      event.preventDefault();
      document.documentElement.classList.toggle('is-swipe-back', deltaX > 22);
    }
  }, { passive: false });

  document.addEventListener('touchend', event => {
    if (!tracking || !horizontal) return reset();
    const touch = event.changedTouches[0];
    const passed = touch.clientX - startX > 84 && Math.abs(touch.clientY - startY) < 70;
    reset();
    if (!passed) return;
    const fallback = fallbackBack();
    if (fallback) window.location.assign(fallback);
    else if (window.history.length > 1) window.history.back();
  }, { passive: true });

  document.addEventListener('touchcancel', reset, { passive: true });
})();
