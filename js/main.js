/* ═══════════════════════════════════════════════════
   NISHAD ABOOBAKER — PORTFOLIO JS
   ═══════════════════════════════════════════════════ */

'use strict';

// ── 1. DARK MODE ──────────────────────────────────────
const html = document.documentElement;
const darkToggle = document.getElementById('dark-toggle');

// Restore saved preference
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
updateDarkLabel(savedTheme);

darkToggle?.addEventListener('click', () => {
  const current = html.getAttribute('data-theme');
  const next = current === 'dark' ? 'light' : 'dark';
  html.setAttribute('data-theme', next);
  localStorage.setItem('theme', next);
  updateDarkLabel(next);
});

function updateDarkLabel(theme) {
  if (!darkToggle) return;
  darkToggle.innerHTML = theme === 'dark'
    ? '<span class="moon-icon">☀</span> LIGHT'
    : '<span class="moon-icon">☽</span> DARK';
}

// ── 2. SCROLL REVEAL ──────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');

      // Trigger skill bars if inside arsenal
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach(fill => {
        const target = fill.getAttribute('data-width');
        if (target) fill.style.width = target + '%';
      });

      revealObserver.unobserve(entry.target);
    }
  });
  // FIX: was { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  // On mobile, tall elements never reached 12% visibility + -40px margin,
  // leaving them stuck at opacity:0 and creating large empty gaps.
}, { threshold: 0, rootMargin: '0px 0px 0px 0px' });

// Also observe arsenal cards specifically for skill bars
const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const fills = entry.target.querySelectorAll('.skill-fill');
      fills.forEach((fill, i) => {
        const target = fill.getAttribute('data-width');
        if (target) {
          setTimeout(() => { fill.style.width = target + '%'; }, i * 120);
        }
      });
      skillObserver.unobserve(entry.target);
    }
  });
  // FIX: was threshold: 0.2 — too high on mobile, bars never animated
}, { threshold: 0 });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
document.querySelectorAll('.arsenal-card').forEach(el => skillObserver.observe(el));

// ── 3. ACTIVE NAV LINK ON SCROLL ─────────────────────
const sections = document.querySelectorAll('section[id], header[id]');
const navItems = document.querySelectorAll('.bottom-nav .nav-item');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navItems.forEach(item => {
        item.classList.remove('active');
        if (item.getAttribute('data-section') === entry.target.id) {
          item.classList.add('active');
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(section => sectionObserver.observe(section));

// ── 4. SMOOTH SCROLL FOR NAV LINKS ───────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      // Offset for bottom nav height (100px on mobile, 56px on desktop)
      const isMobile = window.innerWidth <= 768;
      const offset = isMobile ? 100 : 56;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── 5. CONTACT FORM FEEDBACK ─────────────────────────
const form = document.querySelector('.contact-form');
const sendBtn = document.getElementById('send-btn');

form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  sendBtn.textContent = 'SENDING...';
  sendBtn.disabled = true;

  try {
    const res = await fetch(form.action, {
      method: 'POST',
      body: new FormData(form),
      headers: { 'Accept': 'application/json' }
    });

    if (res.ok) {
      sendBtn.innerHTML = 'SENT ✓';
      sendBtn.style.background = '#22C55E';
      form.reset();
      setTimeout(() => {
        sendBtn.innerHTML = 'SEND MESSAGE <span class="arrow">↗</span>';
        sendBtn.style.background = '';
        sendBtn.disabled = false;
      }, 3500);
    } else {
      throw new Error('Network response was not ok');
    }
  } catch {
    sendBtn.innerHTML = 'FAILED — TRY AGAIN';
    sendBtn.style.background = '#FF006B';
    sendBtn.disabled = false;
    setTimeout(() => {
      sendBtn.innerHTML = 'SEND MESSAGE <span class="arrow">↗</span>';
      sendBtn.style.background = '';
    }, 3000);
  }
});

// ── 6. PROJECT CARD CLICK (open link) ────────────────
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('click', (e) => {
    if (e.target.closest('.project-arrow')) return; // let link handle it
    const link = card.querySelector('.project-arrow');
    if (link) window.open(link.href, '_blank');
  });
});

// ── 7. HERO NAME LETTER ANIMATION ────────────────────
window.addEventListener('DOMContentLoaded', () => {
  // Trigger CSS reveals on load for hero
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal').forEach(el => {
      el.classList.add('visible');
    });
  }, 100);

  // Stagger hero-bottom
  setTimeout(() => {
    document.querySelectorAll('.hero .reveal-delay-1').forEach(el => {
      el.classList.add('visible');
    });
  }, 350);
});