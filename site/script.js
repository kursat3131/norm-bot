const copyButton = document.querySelector('#copyCommand');
copyButton?.addEventListener('click', async () => {
  await navigator.clipboard?.writeText('!yardım');
  copyButton.textContent = '✓';
  setTimeout(() => { copyButton.textContent = '⧉'; }, 1400);
});

const revealItems = document.querySelectorAll('.feature, .terminal, .section-intro, .cta');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.animate([{ opacity: 0, transform: 'translateY(26px)' }, { opacity: 1, transform: 'translateY(0)' }], { duration: 780, delay: Math.min(entry.target.getBoundingClientRect().top / 4, 180), easing: 'cubic-bezier(.2,.8,.2,1)', fill: 'forwards' });
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
revealItems.forEach((item) => observer.observe(item));
