// ──────────────────────────────────────────────────────────
// Tact — landing page interactions
// ──────────────────────────────────────────────────────────

(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // Sticky header shadow
  const header = $('#site-header');
  const onScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  };
  document.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Mobile nav toggle
  const toggle = $('.nav-toggle');
  const mobileNav = $('#mobile-nav');
  if (toggle && mobileNav) {
    const close = () => {
      toggle.setAttribute('aria-expanded', 'false');
      mobileNav.hidden = true;
    };
    const open = () => {
      toggle.setAttribute('aria-expanded', 'true');
      mobileNav.hidden = false;
    };
    toggle.addEventListener('click', () => {
      const expanded = toggle.getAttribute('aria-expanded') === 'true';
      expanded ? close() : open();
    });
    $$('a', mobileNav).forEach(a => a.addEventListener('click', close));
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') close();
    });
  }

  // Reveal-on-scroll
  const targets = $$('.reveal');
  if ('IntersectionObserver' in window && targets.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });

    targets.forEach((el, i) => {
      el.style.transitionDelay = `${Math.min(i, 6) * 60}ms`;
      io.observe(el);
    });
  } else {
    targets.forEach(el => el.classList.add('is-visible'));
  }

  // Footer year
  const yearEl = $('#year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Contact form → WhatsApp deep link
  const form = $('#contato-form');
  if (form) {
    const WHATSAPP_NUMBER = '5549988199726'; // TODO: substituir pelo número real

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const nome = (data.get('nome') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const telefone = (data.get('telefone') || '').toString().trim();
      const negocio = (data.get('negocio') || '').toString().trim();
      const pacote = (data.get('pacote') || '').toString().trim();
      const mensagem = (data.get('mensagem') || '').toString().trim();

      if (!nome || !email) {
        if (!nome) form.querySelector('#nome')?.focus();
        else form.querySelector('#email')?.focus();
        return;
      }

      const lines = [
        'Olá! Vim pelo site da Tact.',
        '',
        `Nome: ${nome}`,
        `E-mail: ${email}`,
      ];
      if (telefone) lines.push(`WhatsApp: ${telefone}`);
      if (negocio) lines.push(`Negócio: ${negocio}`);
      if (pacote) lines.push(`Pacote: ${pacote}`);
      if (mensagem) {
        lines.push('', 'Sobre o projeto:', mensagem);
      }

      const text = encodeURIComponent(lines.join('\n'));
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${text}`;
      window.open(url, '_blank', 'noopener');
    });
  }
})();
