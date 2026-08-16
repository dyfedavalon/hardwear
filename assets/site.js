/* HARDWEAR — shared behaviour
   1. scroll reveal
   2. colourway picker
   3. reviews country filter
   4. trade enquiry form (client-side only) */

(function () {
  'use strict';

  /* ---------- 1. scroll reveal ---------- */
  function reveal() {
    var items = document.querySelectorAll('.rv');
    if (!items.length) return;

    if (!('IntersectionObserver' in window)) {
      Array.prototype.forEach.call(items, function (el) { el.classList.add('in'); });
      return;
    }
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.06 });

    Array.prototype.forEach.call(items, function (el, i) {
      el.style.transitionDelay = (Math.min(i % 4, 3) * 55) + 'ms';
      io.observe(el);
    });
  }

  /* ---------- 2. colourway picker ---------- */
  function picker() {
    var stage = document.getElementById('stage');
    var nameEl = document.getElementById('cwName');
    var noteEl = document.getElementById('cwNote');
    if (!stage || !nameEl || !noteEl) return;

    var swatches = document.querySelectorAll('.sw');
    var shots = stage.querySelectorAll('img');

    function select(btn) {
      var key = btn.getAttribute('data-cw');
      Array.prototype.forEach.call(swatches, function (s) {
        s.setAttribute('aria-pressed', String(s === btn));
      });
      Array.prototype.forEach.call(shots, function (img) {
        img.classList.toggle('on', img.getAttribute('data-cw') === key);
      });
      nameEl.textContent = btn.getAttribute('data-name');
      noteEl.textContent = btn.getAttribute('data-note');
    }

    Array.prototype.forEach.call(swatches, function (btn) {
      btn.addEventListener('click', function () { select(btn); });
      btn.addEventListener('keydown', function (e) {
        if (e.key !== 'ArrowRight' && e.key !== 'ArrowLeft') return;
        e.preventDefault();
        var list = Array.prototype.slice.call(swatches);
        var i = list.indexOf(btn);
        var next = list[(i + (e.key === 'ArrowRight' ? 1 : list.length - 1)) % list.length];
        next.focus();
        select(next);
      });
    });
  }

  /* ---------- 3. reviews country filter ---------- */
  function reviewFilter() {
    var buttons = document.querySelectorAll('.filt');
    var grid = document.getElementById('rgrid');
    var count = document.getElementById('rcount');
    if (!buttons.length || !grid) return;

    var cards = grid.querySelectorAll('[data-nation]');
    var total = cards.length;

    function apply(key) {
      var shown = 0;
      Array.prototype.forEach.call(cards, function (c) {
        var match = (key === 'all') || (c.getAttribute('data-nation') === key);
        c.hidden = !match;
        if (match) shown++;
      });
      Array.prototype.forEach.call(buttons, function (b) {
        b.setAttribute('aria-pressed', String(b.getAttribute('data-filter') === key));
      });
      if (count) {
        count.textContent = (key === 'all')
          ? 'Showing all ' + total + ' reviews'
          : 'Showing ' + shown + ' of ' + total + ' reviews';
      }
    }

    Array.prototype.forEach.call(buttons, function (b) {
      b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); });
    });
    apply('all');
  }

  /* ---------- 4. trade enquiry form ---------- */
  function tradeForm() {
    var form = document.getElementById('tradeForm');
    if (!form) return;
    var note = document.getElementById('formNote');

    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var name = (form.querySelector('#tf-name') || {}).value || 'there';
      if (note) {
        note.textContent = 'Thanks ' + name.split(' ')[0] +
          ' — this is a demo form, so nothing has been sent. Wire it to your order desk or a form service to go live.';
        note.style.color = 'var(--ember)';
      }
    });
  }

  function init() { reveal(); picker(); reviewFilter(); tradeForm(); }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
