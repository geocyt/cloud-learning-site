/* ============================================
   THEME TOGGLE
   ============================================ */

const html      = document.documentElement;
const themeBtn  = document.getElementById('theme-btn');
const themeIcon = document.getElementById('theme-icon');

const ICONS = { dark: '☀', light: '☽' };

function getTheme() {
  return html.getAttribute('data-theme') || 'dark';
}

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  themeIcon.textContent = ICONS[theme];
  localStorage.setItem('theme', theme);
}

function toggleTheme() {
  setTheme(getTheme() === 'dark' ? 'light' : 'dark');
}

// Load saved theme on page load
(function init() {
  const saved = localStorage.getItem('theme');
  if (saved) setTheme(saved);
  else setTheme('dark');
})();

themeBtn.addEventListener('click', toggleTheme);


/* ============================================
   SMOOTH SCROLL FOR NAV LINKS
   ============================================ */

document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', (e) => {
    const target = document.querySelector(link.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


/* ============================================
   ACTIVE NAV HIGHLIGHT ON SCROLL
   ============================================ */

const sections  = document.querySelectorAll('section[id]');
const navLinks  = document.querySelectorAll('.nav-link');

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navLinks.forEach(link => {
        link.style.color = '';
        if (link.getAttribute('href') === `#${entry.target.id}`) {
          link.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => observer.observe(section));


/* ============================================
   FUTURE: ADD FEATURES HERE
   ============================================

   Ideas to add as you progress through the roadmap:

   - fetch('/api/status') to show live pipeline status
   - animate roadmap items on scroll
   - dark/light system preference detection
   - challenge breakdown pages via fetch + markdown render
   - contact form submission via API (Week 8)

   ============================================ */
