document.querySelectorAll('[data-destination]').forEach((link) => {
  link.addEventListener('click', (event) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    event.preventDefault();
    const transition = document.querySelector('.route-transition');
    transition.classList.add('is-active');
    window.setTimeout(() => { window.location.href = link.dataset.destination; }, 360);
  });
});
