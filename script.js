/* =============================================
   NAJAM HAIDER — PORTFOLIO JAVASCRIPT
   Handles: Cursor, Typing, Scroll Reveal,
            Skill Bars, Navbar, Mobile Menu
   ============================================= */

'use strict';

/* ============================================================
   1. CUSTOM CURSOR
   ============================================================ */
const cursor      = document.getElementById('cursor');
const cursorTrail = document.getElementById('cursorTrail');

let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = e.clientX;
  mouseY = e.clientY;

  cursor.style.left = mouseX + 'px';
  cursor.style.top  = mouseY + 'px';
});

// Smooth trailing cursor
function animateTrail() {
  trailX += (mouseX - trailX) * 0.12;
  trailY += (mouseY - trailY) * 0.12;

  cursorTrail.style.left = trailX + 'px';
  cursorTrail.style.top  = trailY + 'px';

  requestAnimationFrame(animateTrail);
}
animateTrail();

// Cursor scale on hover over interactive elements
const interactiveEls = document.querySelectorAll('a, button, .project-card, .contact-card, .skill-category');
interactiveEls.forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform      = 'translate(-50%, -50%) scale(2.5)';
    cursorTrail.style.transform = 'translate(-50%, -50%) scale(1.5)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform      = 'translate(-50%, -50%) scale(1)';
    cursorTrail.style.transform = 'translate(-50%, -50%) scale(1)';
  });
});


/* ============================================================
   2. NAVBAR — SCROLL EFFECT & MOBILE MENU
   ============================================================ */
const navbar    = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('navLinks');

// Scroll-based navbar style
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
}, { passive: true });

// Hamburger toggle
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navLinks.classList.toggle('open');
  document.body.style.overflow = navLinks.classList.contains('open') ? 'hidden' : '';
});

// Close mobile menu on nav link click
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Active nav link on scroll
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const navObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      navAnchors.forEach(link => {
        link.style.color = '';
        link.style.setProperty('--line-w', '0');
      });
      const activeLink = document.querySelector(`.nav-link[href="#${entry.target.id}"]`);
      if (activeLink) {
        activeLink.style.color = 'var(--accent)';
      }
    }
  });
}, { threshold: 0.4 });

sections.forEach(s => navObserver.observe(s));


/* ============================================================
   3. TYPING EFFECT (Hero Role)
   ============================================================ */
const roleTexts  = [
  'Artificial Intelligence',
  'Machine Learning',
  'Deep Learning',
  'Problem Solving',
  'Version Control'
];

let roleIndex    = 0;
let charIndex    = 0;
let isDeleting   = false;
const roleEl     = document.getElementById('roleText');

function typeRole() {
  const current = roleTexts[roleIndex];
  const speed   = isDeleting ? 50 : 100;

  if (!isDeleting) {
    roleEl.textContent = current.substring(0, charIndex + 1);
    charIndex++;
    if (charIndex === current.length) {
      isDeleting = true;
      setTimeout(typeRole, 1800);
      return;
    }
  } else {
    roleEl.textContent = current.substring(0, charIndex - 1);
    charIndex--;
    if (charIndex === 0) {
      isDeleting = false;
      roleIndex  = (roleIndex + 1) % roleTexts.length;
    }
  }

  setTimeout(typeRole, speed);
}

// Start typing after a short delay
setTimeout(typeRole, 1200);


/* ============================================================
   4. SCROLL REVEAL ANIMATION
   ============================================================ */
const revealEls = document.querySelectorAll(
  '.reveal-up, .reveal-left, .reveal-right'
);

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target); // fire once
    }
  });
}, {
  threshold: 0.12,
  rootMargin: '0px 0px -40px 0px'
});

revealEls.forEach(el => revealObserver.observe(el));

// Trigger hero reveals immediately
document.querySelectorAll('.hero .reveal-up, .hero .reveal-right').forEach(el => {
  setTimeout(() => el.classList.add('visible'), 100);
});


/* ============================================================
   5. ANIMATED SKILL BARS
   ============================================================ */
const barFills    = document.querySelectorAll('.bar-fill');
let barsAnimated  = false;

const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting && !barsAnimated) {
      barsAnimated = true;
      barFills.forEach((bar, i) => {
        const targetWidth = bar.getAttribute('data-width') + '%';
        // Staggered start
        setTimeout(() => {
          bar.style.width = targetWidth;
        }, i * 150);
      });
      barObserver.disconnect();
    }
  });
}, { threshold: 0.3 });

const skillBarsSection = document.querySelector('.skill-bars');
if (skillBarsSection) barObserver.observe(skillBarsSection);


/* ============================================================
   6. FLOATING PARTICLES (Canvas Background)
   ============================================================ */
function createParticleCanvas() {
  const canvas = document.createElement('canvas');
  canvas.id    = 'particles';
  canvas.style.cssText = `
    position: fixed;
    inset: 0;
    pointer-events: none;
    z-index: 0;
    opacity: 0.4;
  `;
  document.body.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let particles = [];

  const resize = () => {
    canvas.width  = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  resize();
  window.addEventListener('resize', resize, { passive: true });

  class Particle {
    constructor() {
      this.reset();
    }
    reset() {
      this.x    = Math.random() * canvas.width;
      this.y    = Math.random() * canvas.height;
      this.size = Math.random() * 1.5 + 0.3;
      this.vx   = (Math.random() - 0.5) * 0.3;
      this.vy   = (Math.random() - 0.5) * 0.3;
      this.alpha = Math.random() * 0.6 + 0.1;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      if (this.x < 0 || this.x > canvas.width ||
          this.y < 0 || this.y > canvas.height) {
        this.reset();
      }
    }
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0, 229, 255, ${this.alpha})`;
      ctx.fill();
    }
  }

  // Create particles (fewer on mobile)
  const count = window.innerWidth < 768 ? 40 : 90;
  for (let i = 0; i < count; i++) {
    particles.push(new Particle());
  }

  function drawConnections() {
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx   = particles[i].x - particles[j].x;
        const dy   = particles[i].y - particles[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 100) {
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(0, 229, 255, ${0.08 * (1 - dist / 100)})`;
          ctx.lineWidth   = 0.5;
          ctx.stroke();
        }
      }
    }
  }

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    drawConnections();
    requestAnimationFrame(animate);
  }
  animate();
}

// Only run particles on desktop / capable devices
if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  createParticleCanvas();
}


/* ============================================================
   7. PROJECT CARD — TILT EFFECT (Desktop Only)
   ============================================================ */
if (window.innerWidth > 768) {
  document.querySelectorAll('.project-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const cx     = rect.left + rect.width  / 2;
      const cy     = rect.top  + rect.height / 2;
      const dx     = (e.clientX - cx) / (rect.width  / 2);
      const dy     = (e.clientY - cy) / (rect.height / 2);
      const rotX   = dy * -6;
      const rotY   = dx *  6;

      card.style.transform = `
        perspective(600px)
        rotateX(${rotX}deg)
        rotateY(${rotY}deg)
        translateY(-6px)
        scale(1.01)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}


/* ============================================================
   8. SMOOTH SECTION COUNTER (Numbers Count Up)
   ============================================================ */
function countUp(el, target, duration = 1200) {
  const start = performance.now();
  const isNum = !isNaN(parseFloat(target));
  if (!isNum) return;

  const startVal = 0;
  const endVal   = parseFloat(target);

  function step(now) {
    const elapsed  = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // easeOutExpo
    const ease     = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
    const current  = Math.round(startVal + (endVal - startVal) * ease);
    el.textContent = current + (target.includes('%') ? '%' : '');
    if (progress < 1) requestAnimationFrame(step);
  }
  requestAnimationFrame(step);
}


/* ============================================================
   9. GLITCH EFFECT ON HERO NAME (on hover)
   ============================================================ */
const heroLines = document.querySelectorAll('.hero-name .line1, .hero-name .line2');

heroLines.forEach(line => {
  line.addEventListener('mouseenter', () => {
    line.style.textShadow = `
      2px 0 var(--accent), -2px 0 var(--accent2)
    `;
    line.style.animation = 'glitch 0.3s steps(2) 1';
    setTimeout(() => {
      line.style.textShadow = '';
      line.style.animation  = '';
    }, 300);
  });
});

// Inject glitch keyframe dynamically
const glitchStyle = document.createElement('style');
glitchStyle.textContent = `
  @keyframes glitch {
    0%   { clip-path: inset(0 0 90% 0); transform: skewX(-4deg); }
    20%  { clip-path: inset(40% 0 40% 0); transform: skewX(3deg); }
    40%  { clip-path: inset(70% 0 10% 0); transform: skewX(-2deg); }
    60%  { clip-path: inset(10% 0 80% 0); transform: skewX(4deg); }
    80%  { clip-path: inset(50% 0 30% 0); transform: skewX(-1deg); }
    100% { clip-path: inset(0 0 0 0);     transform: skewX(0); }
  }
`;
document.head.appendChild(glitchStyle);


/* ============================================================
   10. CONTACT CARD — COPY TO CLIPBOARD
   ============================================================ */
document.querySelectorAll('.contact-card').forEach(card => {
  card.addEventListener('click', (e) => {
    const val = card.querySelector('.cc-val')?.textContent.trim();
    if (!val || val.includes('github')) return;

    e.preventDefault();
    navigator.clipboard.writeText(val).then(() => {
      // Visual feedback
      const original = card.querySelector('.cc-label').textContent;
      card.querySelector('.cc-label').textContent = '✓ Copied!';
      card.style.borderColor = 'var(--accent3)';
      card.style.boxShadow   = '0 0 20px rgba(16,185,129,0.3)';

      setTimeout(() => {
        card.querySelector('.cc-label').textContent = original;
        card.style.borderColor = '';
        card.style.boxShadow   = '';
      }, 1800);
    }).catch(() => {
      // Fallback for browsers without clipboard API
      window.open(card.href, '_blank');
    });
  });
});


/* ============================================================
   11. PAGE LOAD — FADE IN
   ============================================================ */
window.addEventListener('load', () => {
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });
});


/* ============================================================
   12. KEYBOARD NAVIGATION HELPER
   ============================================================ */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    hamburger.classList.remove('active');
    navLinks.classList.remove('open');
    document.body.style.overflow = '';
  }
});

/* ============================================================
   Console Easter Egg for Developers 🥚
   ============================================================ */
console.log(
  '%c👋 Hey there, curious developer!',
  'color: #00e5ff; font-size: 18px; font-weight: bold;'
);
console.log(
  '%cThis portfolio was built by Najam Haider\n' +
  'AI/ML Student @ MRIIRS Faridabad\n' +
  '📧  najamhaider@email.com\n' +
  '📞  +91 85956 59298',
  'color: #a78bfa; font-size: 13px; line-height: 1.8;'
);
console.log(
  '%c→ Built with pure HTML, CSS & JavaScript — no frameworks!',
  'color: #10b981; font-size: 12px;'
);
