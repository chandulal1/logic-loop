/* ===========================
   LearnWithMe — script.js
=========================== */

// ── Navbar scroll effect ──────────────────────────────────
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
  document.getElementById('scrollTop').classList.toggle('show', window.scrollY > 400);
});

// ── Mobile hamburger ──────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('open');
  hamburger.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => {
    navLinks.classList.remove('open');
    hamburger.classList.remove('active');
  });
});

// ── Scroll to top ─────────────────────────────────────────
document.getElementById('scrollTop').addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// ── Animated stat counters ────────────────────────────────
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 1800;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('en-IN');
  }, 16);
}

const countersObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      animateCounter(e.target);
      countersObserver.unobserve(e.target);
    }
  });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-num[data-target]').forEach(el => {
  countersObserver.observe(el);
});

// ── Reveal on scroll ─────────────────────────────────────
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, i * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

// ── Countdown timer ───────────────────────────────────────
function getCountdownTarget() {
  const now = new Date();
  const target = new Date(now.getFullYear(), now.getMonth() + 1, 15, 9, 0, 0);
  if (target <= now) {
    target.setMonth(target.getMonth() + 1);
  }
  return target;
}

function updateCountdown() {
  const now = new Date().getTime();
  const end = getCountdownTarget().getTime();
  const diff = end - now;

  if (diff <= 0) {
    ['cd-days','cd-hours','cd-minutes','cd-seconds'].forEach(id => {
      document.getElementById(id).textContent = '00';
    });
    return;
  }

  const days    = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours   = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((diff % (1000 * 60)) / 1000);

  document.getElementById('cd-days').textContent    = String(days).padStart(2,'0');
  document.getElementById('cd-hours').textContent   = String(hours).padStart(2,'0');
  document.getElementById('cd-minutes').textContent = String(minutes).padStart(2,'0');
  document.getElementById('cd-seconds').textContent = String(seconds).padStart(2,'0');
}
updateCountdown();
setInterval(updateCountdown, 1000);

// ── Reviews carousel ──────────────────────────────────────
(function() {
  const track = document.getElementById('reviewTrack');
  const prevBtn = document.getElementById('reviewPrev');
  const nextBtn = document.getElementById('reviewNext');
  if (!track) return;

  let current = 0;
  const cards = track.querySelectorAll('.review-card');
  const cardW = 320 + 24; // width + gap
  const visible = Math.max(1, Math.floor(window.innerWidth / cardW));
  const maxIndex = Math.max(0, cards.length - visible);

  function slideTo(idx) {
    current = Math.max(0, Math.min(idx, maxIndex));
    track.style.transform = `translateX(-${current * cardW}px)`;
  }

  prevBtn.addEventListener('click', () => slideTo(current - 1));
  nextBtn.addEventListener('click', () => slideTo(current + 1));

  // Auto-slide every 4 seconds
  let autoSlide = setInterval(() => {
    slideTo(current >= maxIndex ? 0 : current + 1);
  }, 4000);

  [prevBtn, nextBtn].forEach(btn => {
    btn.addEventListener('click', () => {
      clearInterval(autoSlide);
      autoSlide = setInterval(() => {
        slideTo(current >= maxIndex ? 0 : current + 1);
      }, 4000);
    });
  });

  // Recalculate on resize
  window.addEventListener('resize', () => {
    slideTo(0);
  });
})();

// ── FAQ accordion ─────────────────────────────────────────
document.querySelectorAll('.faq-q').forEach(btn => {
  btn.addEventListener('click', function() {
    const item = this.closest('.faq-item');
    const answer = item.querySelector('.faq-a');
    const isOpen = item.classList.contains('open');

    // Close all
    document.querySelectorAll('.faq-item.open').forEach(openItem => {
      openItem.classList.remove('open');
      openItem.querySelector('.faq-a').style.maxHeight = '0';
      openItem.querySelector('.faq-q').setAttribute('aria-expanded', 'false');
    });

    // Open clicked (if it was closed)
    if (!isOpen) {
      item.classList.add('open');
      answer.style.maxHeight = answer.scrollHeight + 'px';
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ── Contact form ──────────────────────────────────────────
function handleSubmit(e) {
  e.preventDefault();
  const btn = e.target.querySelector('button[type="submit"]');
  const success = document.getElementById('formSuccess');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  setTimeout(() => {
    success.style.display = 'block';
    btn.textContent = 'Message Sent ✓';
    btn.style.background = 'linear-gradient(135deg,#10b981,#059669)';
    e.target.reset();

    setTimeout(() => {
      success.style.display = 'none';
      btn.textContent = 'Send Message';
      btn.disabled = false;
      btn.style.background = '';
    }, 5000);
  }, 1200);
}

// ── Smooth anchor scroll with offset ─────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const href = this.getAttribute('href');
    if (href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;
    e.preventDefault();
    const offset = 80;
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

// ── Active nav link highlight ─────────────────────────────
const sections = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav__links a[href^="#"]');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(a => a.style.color = '');
      const active = document.querySelector(`.nav__links a[href="#${entry.target.id}"]`);
      if (active) active.style.color = 'var(--accent)';
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => sectionObserver.observe(s));
