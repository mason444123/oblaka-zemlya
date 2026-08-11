const galleryCards = document.querySelectorAll('.menu-gallery__card');
if ('IntersectionObserver' in window && galleryCards.length) {
  const revealCards = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
      } else {
        entry.target.classList.remove('is-visible');
      }
    });
  }, { threshold: 0.28 });
  galleryCards.forEach((card) => revealCards.observe(card));
}

const portal = document.querySelector('.portal');
const portalCards = [...document.querySelectorAll('.brand-card')];

if (portal && portalCards.length) {
  const stop = (card) => {
    const video = card.querySelector('.brand-card__video');
    if (!video) return;
    video.pause();
    video.currentTime = 0;
  };

  const activate = (activeCard) => {
    portalCards.forEach((card) => {
      const isActive = card === activeCard;
      card.classList.toggle('is-active', isActive);
      if (!isActive) stop(card);
    });
    portal.classList.add('has-active-card');
    const video = activeCard.querySelector('.brand-card__video');
    if (video) {
      video.currentTime = 0;
      video.play().catch(() => {});
    }
  };

  const deactivate = () => {
    portalCards.forEach((card) => {
      card.classList.remove('is-active');
      stop(card);
    });
    portal.classList.remove('has-active-card');
  };

  portalCards.forEach((card) => {
    card.addEventListener('pointerenter', () => activate(card));
    card.addEventListener('focusin', () => activate(card));
  });
  portal.addEventListener('pointerleave', deactivate);
  portal.addEventListener('focusout', (event) => {
    if (!portal.contains(event.relatedTarget)) deactivate();
  });
}

// Do not expose iOS's native paused-video play control over the hero poster.
// The video becomes visible only after Safari has actually allowed autoplay.
document.querySelectorAll('.venue-hero__image--video .hero-video').forEach((video) => {
  video.addEventListener('playing', () => video.classList.add('is-playing'));
  video.addEventListener('pause', () => video.classList.remove('is-playing'));
});

if (document.body.classList.contains('venue-page--oblaka') && !sessionStorage.getItem('oblaka-age-confirmed')) {
  const gate = document.createElement('section');
  gate.className = 'age-gate';
  gate.setAttribute('role', 'dialog');
  gate.setAttribute('aria-modal', 'true');
  gate.setAttribute('aria-labelledby', 'age-gate-title');
  gate.innerHTML = `<div class="age-gate__dialog"><p class="age-gate__label">ВОЗРАСТНОЕ ОГРАНИЧЕНИЕ</p><h2 id="age-gate-title">Вам уже есть 18?</h2><p>Для входа в «Облака» подтвердите свой возраст.</p><div class="age-gate__actions"><button type="button" data-age-answer="yes">Да, мне 18</button><button type="button" data-age-answer="no">Нет</button></div></div>`;
  document.body.append(gate);
  gate.querySelector('[data-age-answer="yes"]').focus();
  gate.addEventListener('click', (event) => {
    const answer = event.target.closest('[data-age-answer]')?.dataset.ageAnswer;
    if (answer === 'yes') { sessionStorage.setItem('oblaka-age-confirmed', 'true'); gate.remove(); }
    if (answer === 'no') { window.location.href = 'zemlya.html'; }
  });
}
