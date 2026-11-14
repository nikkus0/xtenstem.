/* XtenSTEM — main.js */

// ── Nav scroll ───────────────────────────────────────────
const nav = document.querySelector('.nav');
if (nav) {
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 60);
  });
}

// ── Mobile hamburger ─────────────────────────────────────
const toggle  = document.getElementById('navToggle');
const mobileMenu = document.getElementById('mobileMenu');
const mobileClose = document.getElementById('mobileClose');

if (toggle && mobileMenu) {
  toggle.addEventListener('click', () => mobileMenu.classList.add('open'));
}
if (mobileClose && mobileMenu) {
  mobileClose.addEventListener('click', () => mobileMenu.classList.remove('open'));
}
// Close on link click
if (mobileMenu) {
  mobileMenu.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => mobileMenu.classList.remove('open'));
  });
}

// ── Fade-up animations (IntersectionObserver) ────────────
const fadeEls = document.querySelectorAll('.fade-up');
if ('IntersectionObserver' in window && fadeEls.length) {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  fadeEls.forEach(el => obs.observe(el));
} else {
  // Fallback: show everything
  fadeEls.forEach(el => el.classList.add('visible'));
}

// ── Evidence bars ────────────────────────────────────────
const bars = document.querySelectorAll('.ebar-fill');
if (bars.length) {
  const barObs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const target = e.target.dataset.width || '0';
        e.target.style.width = target + '%';
        barObs.unobserve(e.target);
      }
    });
  }, { threshold: 0.3 });
  bars.forEach(b => barObs.observe(b));
}

// ── Smooth scroll (offset for fixed nav) ─────────────────
document.querySelectorAll('a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    const id = link.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.scrollY - 80;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// ── FAQ toggle (module pages) ─────────────────────────────
function togFaq(el) {
  const item = el.closest('.faq-item');
  item.classList.toggle('open');
}
window.togFaq = togFaq;

// ── Module 4: Vocational quiz ─────────────────────────────
(function() {
  const quiz = document.getElementById('careerQuiz');
  if (!quiz) return;

  const questions = quiz.querySelectorAll('.m4-question');
  const btnNext   = document.getElementById('quizNext');
  const btnBack   = document.getElementById('quizBack');
  const btnReset  = document.getElementById('quizReset');
  const result    = document.getElementById('quizResult');
  const progBar   = document.getElementById('quizProgressBar');
  const progText  = document.getElementById('quizProgressText');
  let current = 0;

  const labels = {
    environment: { name: 'Ambiente, agricultura y territorio', careers: 'Agronomía, Ingeniería Ambiental, Biología, Ciencias Forestales', desc: 'Tu interés apunta hacia los sistemas naturales, el territorio y los problemas del campo. Las ciencias ambientales y agrícolas son un espacio donde el conocimiento indígena del territorio tiene un valor real.' },
    health:      { name: 'Salud y ciencias de la vida', careers: 'Medicina, Nutrición, Enfermería, Química Biológica, Microbiología', desc: 'Te interesa el bienestar de las personas. La salud intercultural y la investigación son campos con gran necesidad en las comunidades rurales e indígenas.' },
    technology:  { name: 'Computación y tecnología', careers: 'Ingeniería en Sistemas, Ciencia de Datos, Desarrollo de Software, Ciberseguridad', desc: 'Tu curiosidad va hacia lo digital. Crear herramientas en idiomas mayas, sistemas para cooperativas o plataformas educativas son proyectos reales que necesitan personas como tú.' },
    engineering: { name: 'Ingeniería y diseño', careers: 'Ingeniería Civil, Arquitectura, Mecatrónica, Energías Renovables', desc: 'Te atrae construir y diseñar soluciones concretas. La ingeniería trabaja directamente sobre los problemas de infraestructura, agua, energía y movilidad en Guatemala.' },
    data:        { name: 'Matemática, datos e investigación', careers: 'Matemática, Estadística, Física, Ciencia de Datos, Economía cuantitativa', desc: 'Disfrutas los patrones, los números y el razonamiento. Esta área sostiene a todas las demás: sin análisis de datos no hay decisiones bien fundamentadas.' }
  };

  function showQuestion(i) {
    questions.forEach((q, idx) => q.hidden = idx !== i);
    progText.textContent = `Pregunta ${i+1} de ${questions.length}`;
    progBar.style.width  = ((i+1)/questions.length*100) + '%';
    btnBack.disabled  = i === 0;
    btnNext.textContent = i === questions.length - 1 ? 'Ver resultado →' : 'Siguiente →';
  }

  btnNext.addEventListener('click', () => {
    if (current < questions.length - 1) {
      current++; showQuestion(current);
    } else {
      showResult();
    }
  });
  btnBack.addEventListener('click', () => {
    if (current > 0) { current--; showQuestion(current); }
  });
  btnReset && btnReset.addEventListener('click', () => {
    quiz.querySelectorAll('input[type=checkbox]').forEach(cb => cb.checked = false);
    result.hidden = true; btnReset.hidden = true; btnNext.hidden = false;
    current = 0; showQuestion(0);
  });

  function showResult() {
    const counts = {};
    quiz.querySelectorAll('input[type=checkbox]:checked').forEach(cb => {
      counts[cb.value] = (counts[cb.value] || 0) + 1;
    });
    const top = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0,2).map(e=>e[0]);
    if (!top.length) {
      result.innerHTML = '<h4>Todavía explorando</h4><p>No marcaste ninguna opción, pero eso también está bien. Puedes volver cuando tengas más preguntas.</p>';
    } else {
      result.innerHTML = top.map(k => {
        const l = labels[k];
        return `<h4>Área: ${l.name}</h4><p><b>Carreras a explorar:</b> ${l.careers}.</p><p>${l.desc}</p>`;
      }).join('<hr style="margin:1rem 0; border:none; border-top:1px solid var(--border);">');
    }
    result.hidden = false;
    btnNext.hidden = true;
    btnReset.hidden = false;
    questions.forEach(q => q.hidden = true);
    progText.textContent = 'Resultado listo';
    progBar.style.width = '100%';
  }

  showQuestion(0);
})();

// ── Module 4: Cost calculator ─────────────────────────────
(function() {
  const fields = ['costTuition','costTravel','costFood','costOther'];
  const monthly = document.getElementById('costMonthly');
  const yearly  = document.getElementById('costYear');
  if (!monthly) return;
  function recalc() {
    const total = fields.reduce((s,id) => {
      const v = parseFloat(document.getElementById(id)?.value) || 0;
      return s + v;
    }, 0);
    monthly.textContent = 'Q' + total.toLocaleString('es-GT', {maximumFractionDigits:0});
    yearly.textContent  = 'Q' + (total*10).toLocaleString('es-GT', {maximumFractionDigits:0});
  }
  fields.forEach(id => {
    const el = document.getElementById(id);
    if (el) el.addEventListener('input', recalc);
  });
})();

// ── Module 4: Print plan ──────────────────────────────────
(function() {
  const btn = document.getElementById('printPlan');
  const clr = document.getElementById('clearPlan');
  if (btn) btn.addEventListener('click', () => window.print());
  if (clr) clr.addEventListener('click', () => {
    ['planName','planCareer','planUniversity','planProblem','planStep','planSupport']
      .forEach(id => { const el = document.getElementById(id); if(el) el.value=''; });
    const sel = document.getElementById('planArea');
    if (sel) sel.selectedIndex = 0;
  });
})();

// ── Module 3: Accordion + Tabs ────────────────────────────
(function () {
  // Accordion
  document.querySelectorAll('.m3-acc-header').forEach(btn => {
    btn.addEventListener('click', () => {
      const body = btn.nextElementSibling;
      const isOpen = btn.classList.contains('open');
      // close all
      document.querySelectorAll('.m3-acc-header.open').forEach(b => {
        b.classList.remove('open');
        b.nextElementSibling.classList.remove('open');
      });
      if (!isOpen) {
        btn.classList.add('open');
        body.classList.add('open');
      }
    });
  });

  // Tabs inside each accordion body
  document.querySelectorAll('.m3-acc-body').forEach(body => {
    body.querySelectorAll('.m3-tab').forEach(tab => {
      tab.addEventListener('click', () => {
        const panel = tab.dataset.tab;
        body.querySelectorAll('.m3-tab').forEach(t => t.classList.remove('active'));
        body.querySelectorAll('.m3-tab-panel').forEach(p => p.classList.remove('active'));
        tab.classList.add('active');
        body.querySelector(`.m3-tab-panel[data-panel="${panel}"]`).classList.add('active');
      });
    });
  });
})();
