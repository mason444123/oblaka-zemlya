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

const portalVideos = document.querySelectorAll('.brand-card__video');
portalVideos.forEach((video) => {
  const card = video.closest('.brand-card');
  const start = () => {
    video.loop = true;
    video.play().catch(() => {});
  };
  const stop = () => {
    video.pause();
    video.currentTime = 0;
  };
  card.addEventListener('mouseenter', start);
  card.addEventListener('mouseleave', stop);
  card.addEventListener('focusin', start);
  card.addEventListener('focusout', stop);
  video.addEventListener('playing', () => video.classList.add('is-playing'));
  video.addEventListener('pause', () => video.classList.remove('is-playing'));
});

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
