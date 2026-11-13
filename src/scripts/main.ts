import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import Lenis from 'lenis';
import type { GlobeSite, GlobeState } from './globe';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip);

const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const finePointer = matchMedia('(hover: hover) and (pointer: fine)').matches;
const $ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => root.querySelector<T>(sel);
const $$ = <T extends Element = HTMLElement>(sel: string, root: ParentNode = document) => Array.from(root.querySelectorAll<T>(sel));

let lenis: Lenis | null = null;

/* ----------------------------------------------------------- smooth scroll */

function initScroll() {
  if (reduce) return;
  lenis = new Lenis({ anchors: { offset: -96 }, lerp: 0.11 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis!.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);
}

/* ------------------------------------------------------------------ header */

function initHeader() {
  const header = $('[data-header]');
  if (!header) return;
  const toggle = $<HTMLButtonElement>('[data-menu-toggle]');
  const menu = $('[data-menu]');
  let menuOpen = false;
  let lastY = window.scrollY;

  const update = () => {
    const y = window.scrollY;
    header.classList.toggle('is-solid', y > 40 || menuOpen);
    const goingDown = y > lastY + 4;
    const goingUp = y < lastY - 4;
    if (menuOpen || y < 320 || goingUp) header.classList.remove('is-hidden');
    else if (goingDown) header.classList.add('is-hidden');
    if (goingDown || goingUp) lastY = y;
  };
  window.addEventListener('scroll', update, { passive: true });
  update();

  const progress = $('[data-progress]');
  if (progress) {
    gsap.to(progress, { scaleX: 1, ease: 'none', scrollTrigger: { start: 0, end: 'max', scrub: 0.3 } });
  }

  if (toggle && menu) {
    $$('a', menu).forEach((a, i) => a.style.setProperty('--i', String(i)));
    const setOpen = (open: boolean) => {
      menuOpen = open;
      toggle.setAttribute('aria-expanded', String(open));
      if (open) menu.hidden = false;
      // next frame so the clip-path transition runs from the closed state
      requestAnimationFrame(() => menu.classList.toggle('is-open', open));
      if (!open) setTimeout(() => { if (!menuOpen) menu.hidden = true; }, 600);
      document.documentElement.style.overflow = open ? 'hidden' : '';
      open ? lenis?.stop() : lenis?.start();
      update();
    };
    toggle.addEventListener('click', () => setOpen(!menuOpen));
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) { setOpen(false); toggle.focus(); } });
    matchMedia('(min-width: 961px)').addEventListener('change', (e) => { if (e.matches && menuOpen) setOpen(false); });
  }
}

/* ------------------------------------------------------------------ cursor */

function initCursor() {
  const cursor = $('[data-cursor]');
  if (!cursor || !finePointer || reduce) return;
  const xTo = gsap.quickTo(cursor, 'x', { duration: 0.26, ease: 'power3' });
  const yTo = gsap.quickTo(cursor, 'y', { duration: 0.26, ease: 'power3' });
  let shown = false;
  window.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    if (!shown) { gsap.set(cursor, { x: e.clientX, y: e.clientY }); gsap.to(cursor, { opacity: 1, duration: 0.3 }); shown = true; }
    xTo(e.clientX); yTo(e.clientY);
  }, { passive: true });
  document.addEventListener('pointerover', (e) => {
    const t = e.target as Element;
    cursor.classList.toggle('is-lock', !!t.closest?.('a, button, summary, label, select'));
    const typing = !!t.closest?.('input, textarea');
    gsap.to(cursor, { opacity: typing ? 0 : 1, duration: 0.2, overwrite: 'auto' });
  });
  window.addEventListener('pointerdown', () => cursor.classList.add('is-down'));
  window.addEventListener('pointerup', () => cursor.classList.remove('is-down'));
  document.documentElement.addEventListener('pointerleave', () => { gsap.to(cursor, { opacity: 0, duration: 0.2 }); shown = false; });
}

function initMagnetic() {
  if (!finePointer || reduce) return;
  $$('.btn').forEach((btn) => {
    const xTo = gsap.quickTo(btn, 'x', { duration: 0.5, ease: 'power3' });
    const yTo = gsap.quickTo(btn, 'y', { duration: 0.5, ease: 'power3' });
    btn.addEventListener('pointermove', (e) => {
      const r = btn.getBoundingClientRect();
      xTo((e.clientX - (r.left + r.width / 2)) * 0.18);
      yTo((e.clientY - (r.top + r.height / 2)) * 0.28);
    });
    btn.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
  });
}

/* ----------------------------------------------------------------- reveals */

function ruleTimeline(rule: HTMLElement) {
  const a = $('.rule__line--a', rule);
  const b = $('.rule__line--b', rule);
  const mark = $('.rule__mark', rule);
  const ticks = $('.reticle__ticks', rule);
  return gsap.timeline()
    .from(a, { scaleX: 0, duration: 0.9, ease: 'power3.inOut' })
    .from(mark, { scale: 0, rotation: -180, duration: 0.8, ease: 'back.out(1.8)', transformOrigin: '50% 50%' }, '-=0.25')
    .from(ticks, { scale: 1.6, opacity: 0, duration: 0.6, ease: 'back.out(2)', transformOrigin: '50% 50%' }, '<')
    .from(b, { scaleX: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5');
}

function splitLines(el: HTMLElement, vars: gsap.TweenVars) {
  gsap.set(el, { visibility: 'visible' });
  SplitText.create(el, {
    type: 'lines',
    mask: 'lines',
    autoSplit: true,
    onSplit: (self) => gsap.from(self.lines, { yPercent: 108, duration: 1.1, ease: 'expo.out', stagger: 0.09, ...vars }),
  });
}

function initIntro() {
  const claimed = new Set<HTMLElement>();

  // home hero, or the hero of an inner page
  const title = $('[data-hero-title]') ?? $('[data-intro-title]');
  const fades = $$('[data-hero-fade], [data-intro-fade]');
  const media = $('[data-intro-media]');
  const heroRule = title?.closest('section')?.querySelector<HTMLElement>('[data-rule]');
  if (heroRule) claimed.add(heroRule);

  if (reduce) {
    gsap.set([title, ...fades, media], { visibility: 'visible' });
  } else {
    if (title) splitLines(title, { delay: 0.15 });
    if (fades.length) gsap.fromTo(fades, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: 0.55 });
    if (media) {
      gsap.set(media, { visibility: 'visible' });
      gsap.fromTo(media, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.out', delay: 0.35 });
      gsap.from($('img', media), { scale: 1.25, duration: 1.8, ease: 'expo.out', delay: 0.35 });
    }
    if (heroRule) ruleTimeline(heroRule).delay(0.7);
  }
  return claimed;
}

function initReveals(claimedRules: Set<HTMLElement>) {
  if (reduce) return;

  $$('[data-split]').forEach((el) => {
    splitLines(el, { scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  $$('[data-reveal]').forEach((el) => {
    gsap.from(el, { autoAlpha: 0, y: 26, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 88%', once: true } });
  });

  $$('[data-reveal-group]').forEach((group) => {
    gsap.from(group.children, {
      autoAlpha: 0, y: 30, duration: 0.9, ease: 'power3.out', stagger: 0.09,
      scrollTrigger: { trigger: group, start: 'top 85%', once: true },
    });
  });

  // image wipes with a slow drift inside the frame
  $$('[data-clip]').forEach((frame) => {
    const image = $('img', frame);
    gsap.fromTo(frame, { clipPath: 'inset(0% 0% 100% 0%)' }, {
      clipPath: 'inset(0% 0% 0% 0%)', duration: 1.3, ease: 'expo.out',
      scrollTrigger: { trigger: frame, start: 'top 85%', once: true },
    });
    if (image) {
      gsap.fromTo(image, { yPercent: -7, scale: 1.16 }, {
        yPercent: 7, scale: 1.16, ease: 'none',
        scrollTrigger: { trigger: frame, start: 'top bottom', end: 'bottom top', scrub: true },
      });
    }
  });

  $$('[data-rule]').forEach((rule) => {
    if (claimedRules.has(rule)) return;
    const tl = ruleTimeline(rule).pause();
    ScrollTrigger.create({ trigger: rule, start: 'top 92%', once: true, onEnter: () => tl.play() });
  });

  $$('.timeline').forEach((el) => {
    gsap.from(el.children, { autoAlpha: 0, y: 30, duration: 0.9, stagger: 0.2, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 82%', once: true } });
  });
}

/** Items that "lock" into place one after another as they scroll into view. */
function initLockIns() {
  const items = $$('[data-lock], .checklist li');
  if (!items.length) return;
  if (reduce) { items.forEach((el) => el.classList.add('is-in')); return; }
  ScrollTrigger.batch(items, {
    start: 'top 90%',
    once: true,
    onEnter: (els) => els.forEach((el, i) => setTimeout(() => el.classList.add('is-in'), i * 90)),
  });
}

/* ------------------------------------------------------------- scrub text */

function initScrubText() {
  if (reduce) return;
  $$('[data-scrub-text]').forEach((el) => {
    SplitText.create(el, {
      type: 'words',
      autoSplit: true,
      onSplit: (self) => gsap.fromTo(self.words, { opacity: 0.14 }, {
        opacity: 1, ease: 'none', stagger: 0.08,
        scrollTrigger: { trigger: el, start: 'top 82%', end: 'bottom 48%', scrub: 0.4 },
      }),
    });
  });
}

/* -------------------------------------------------------------- practices */

function initPractices() {
  const list = $('[data-practices]');
  const preview = $('[data-practices-preview]');
  if (!list || !preview || !finePointer || reduce) return;
  const images = $$('img', preview);
  const xTo = gsap.quickTo(preview, 'x', { duration: 0.5, ease: 'power3' });
  const yTo = gsap.quickTo(preview, 'y', { duration: 0.5, ease: 'power3' });
  const rTo = gsap.quickTo(preview, 'rotation', { duration: 0.6, ease: 'power3' });
  let lastX = 0;

  list.addEventListener('pointermove', (e) => {
    xTo(e.clientX); yTo(e.clientY);
    rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.6));
    lastX = e.clientX;
  });
  $$('[data-practice]', list).forEach((row) => {
    row.addEventListener('pointerenter', (e) => {
      const i = Number(row.dataset.practice);
      images.forEach((im, k) => im.classList.toggle('is-on', k === i));
      if (!preview.classList.contains('is-on')) gsap.set(preview, { x: e.clientX, y: e.clientY });
      preview.classList.add('is-on');
    });
  });
  list.addEventListener('pointerleave', () => { preview.classList.remove('is-on'); rTo(0); });
  window.addEventListener('scroll', () => preview.classList.remove('is-on'), { passive: true });
}

/* --------------------------------------------------------- horizontal run */

function initRange() {
  const section = $('[data-hscroll]');
  if (!section) return;
  const pin = $('.range__pin', section)!;
  const track = $('[data-hscroll-track]', section)!;
  const line = $('[data-hscroll-line]', section);
  const mark = $('[data-hscroll-mark]', section);

  const mm = gsap.matchMedia();
  mm.add('(min-width: 961px) and (min-height: 620px) and (prefers-reduced-motion: no-preference)', () => {
    section.classList.remove('is-native');
    const dist = () => Math.max(0, track.scrollWidth - window.innerWidth);
    gsap.to(track, {
      x: () => -dist(),
      ease: 'none',
      scrollTrigger: {
        trigger: pin,
        start: 'top top',
        end: () => `+=${dist()}`,
        pin: true,
        scrub: 0.7,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          if (line) gsap.set(line, { scaleX: self.progress });
          if (mark) gsap.set(mark, { x: self.progress * ((mark.parentElement?.clientWidth ?? 0) - 28), rotation: self.progress * 360 });
        },
      },
    });
    return () => { section.classList.add('is-native'); gsap.set(track, { clearProps: 'transform' }); };
  });
}

/* -------------------------------------------------------------------- cta */

function initCta() {
  $$('[data-cta]').forEach((cta) => {
    const mark = $('.cta__mark', cta);
    if (!mark || reduce) return;
    gsap.fromTo(mark, { rotation: -70 }, {
      rotation: 20, ease: 'none', transformOrigin: '50% 50%',
      scrollTrigger: { trigger: cta, start: 'top bottom', end: 'bottom top', scrub: 0.6 },
    });
    if (finePointer) {
      const xTo = gsap.quickTo(mark, 'x', { duration: 0.9, ease: 'power3' });
      const yTo = gsap.quickTo(mark, 'y', { duration: 0.9, ease: 'power3' });
      cta.addEventListener('pointermove', (e) => {
        const r = cta.getBoundingClientRect();
        xTo((e.clientX - r.left - r.width / 2) * 0.06);
        yTo((e.clientY - r.top - r.height / 2) * 0.1);
      });
      cta.addEventListener('pointerleave', () => { xTo(0); yTo(0); });
    }
  });
}

/* ------------------------------------------------------------- scroll spy */

function initSpy() {
  $$('[data-spy]').forEach((root) => {
    const links = $$<HTMLAnchorElement>('[data-spy-link]', root);
    const targets = $$('[data-spy-target]', root);
    if (!links.length) return;
    const setActive = (id: string) => links.forEach((a) => a.classList.toggle('is-active', a.hash === `#${id}`));
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => { if (entry.isIntersecting) setActive(entry.target.id); });
    }, { rootMargin: '-35% 0px -55% 0px' });
    targets.forEach((t) => io.observe(t));
    setActive(targets[0].id);
  });
}

/* -------------------------------------------------------------- accordion */

function initFaq() {
  $$('.faq').forEach((faq) => {
    const buttons = $$<HTMLButtonElement>('.faq__q', faq);
    buttons.forEach((btn, i) => {
      btn.setAttribute('aria-expanded', i === 0 ? 'true' : 'false');
      btn.addEventListener('click', () => {
        const open = btn.getAttribute('aria-expanded') === 'true';
        btn.setAttribute('aria-expanded', String(!open));
        setTimeout(() => ScrollTrigger.refresh(), 550);
      });
    });
  });
}

/* --------------------------------------------------------- product filter */

function initFilter() {
  const bar = $('[data-filter-bar]');
  const grid = $('[data-filter-grid]');
  if (!bar || !grid) return;
  const buttons = $$<HTMLButtonElement>('button', bar);
  const items = $$('[data-group]', grid);
  const status = $('[data-filter-status]');

  const apply = (group: string) => {
    const state = reduce ? null : Flip.getState(items);
    let shown = 0;
    items.forEach((el) => { el.hidden = !(group === 'all' || el.dataset.group === group); if (!el.hidden) shown++; });
    buttons.forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.filter === group)));
    if (status) status.textContent = `Showing ${shown} product${shown === 1 ? '' : 's'}`;
    if (state) {
      Flip.from(state, {
        duration: 0.65, ease: 'power3.inOut', absolute: true,
        onEnter: (els) => gsap.fromTo(els, { opacity: 0, scale: 0.94 }, { opacity: 1, scale: 1, duration: 0.5, delay: 0.1 }),
        onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.94, duration: 0.3 }),
        onComplete: () => ScrollTrigger.refresh(),
      });
    }
  };
  buttons.forEach((b) => b.addEventListener('click', () => apply(b.dataset.filter!)));
}

/* ----------------------------------------------------------- contact form */

function initForm() {
  const form = $<HTMLFormElement>('[data-enquiry]');
  if (!form) return;
  const status = $('[data-form-status]', form);
  const to = form.dataset.to!;

  const rules: Record<string, (v: string) => string> = {
    name: (v) => (v ? '' : 'Enter your name so we know who to reply to.'),
    email: (v) => (!v ? 'Enter an email address we can reply to.' : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) ? '' : 'That email address looks incomplete. Check for a missing @ or domain.'),
    message: (v) => (v.length >= 10 ? '' : 'Tell us a little about what you need, in a sentence or two.'),
  };
  const check = (name: string) => {
    const input = form.elements.namedItem(name) as HTMLInputElement;
    const field = input.closest('.field')!;
    const msg = rules[name](input.value.trim());
    field.classList.toggle('has-error', !!msg);
    $('.field__error', field)!.textContent = msg;
    input.setAttribute('aria-invalid', String(!!msg));
    return !msg;
  };
  Object.keys(rules).forEach((name) => {
    const input = form.elements.namedItem(name) as HTMLInputElement;
    input.addEventListener('blur', () => { if (input.value) check(name); });
    input.addEventListener('input', () => { if (input.closest('.field')!.classList.contains('has-error')) check(name); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const bad = Object.keys(rules).filter((name) => !check(name));
    if (bad.length) { (form.elements.namedItem(bad[0]) as HTMLElement).focus(); return; }
    const data = new FormData(form);
    const get = (k: string) => String(data.get(k) ?? '').trim();
    const lines = [
      `Name: ${get('name')}`,
      get('organisation') ? `Organisation: ${get('organisation')}` : '',
      `Email: ${get('email')}`,
      get('phone') ? `Phone: ${get('phone')}` : '',
      `Interested in: ${get('interest')}`,
    ].filter(Boolean);
    const subject = `Website enquiry: ${get('interest')}`;
    const body = `${lines.join('\n')}\n\n${get('message')}`;
    window.location.href = `mailto:${to}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    if (status) {
      status.hidden = false;
      status.textContent = `Your email app should now be open with the enquiry ready to send. If nothing opened, email ${to} directly.`;
      status.focus();
    }
  });
}

/* ------------------------------------------------------------------ globe */

function initHeroGlobe() {
  const root = $('[data-globe]');
  if (!root) return;
  const sites: GlobeSite[] = JSON.parse(root.dataset.sites!);
  const hud = $('.hud', root)!;
  const status = $('[data-hud-status]', root)!;
  const name = $('[data-hud-name]', root)!;
  const role = $('[data-hud-role]', root)!;
  const coordsEl = $('[data-hud-coords]', root)!;
  const picks = $$<HTMLButtonElement>('[data-site-pick]');
  const fmt = (lat: number, lon: number) =>
    `${Math.abs(lat).toFixed(2)}° ${lat < 0 ? 'S' : 'N'}, ${Math.abs(lon).toFixed(2)}° ${lon < 0 ? 'W' : 'E'}`;

  const setPicked = (index: number | null) => picks.forEach((b, i) => {
    b.setAttribute('aria-pressed', String(i === index));
    if (i !== index) b.style.setProperty('--p', '0');
  });

  const onState = (s: GlobeState) => {
    if (s.type === 'locked') {
      const site = sites[s.index];
      hud.classList.add('is-locked');
      hud.classList.remove('is-seeking');
      status.textContent = 'Locked on';
      name.textContent = site.name;
      role.textContent = site.role;
      coordsEl.textContent = fmt(site.lat, site.lon);
      setPicked(s.index);
      if (!reduce) gsap.fromTo([name, role, coordsEl], { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out', overwrite: true });
    } else {
      hud.classList.add('is-seeking');
      hud.classList.remove('is-locked');
      status.textContent = s.target === null ? 'Free look' : 'Seeking';
      name.textContent = s.target === null ? 'Release near a site to lock on' : sites[s.target].name;
      role.textContent = '';
      coordsEl.textContent = fmt(s.lat, s.lon);
      setPicked(s.target);
    }
  };

  import('./globe')
    .then(({ initGlobe }) => {
      const globe = initGlobe(root, {
        sites,
        reducedMotion: reduce,
        dwell: 6,
        onState,
        onProgress: (i, p) => picks[i]?.style.setProperty('--p', String(p)),
      });
      picks.forEach((b, i) => b.addEventListener('click', () => globe.aim(i)));
    })
    .catch(() => {
      // No WebGL: the reticle and readout still stand on their own.
      root.classList.add('is-static');
      hud.classList.add('is-locked');
    });
}

/* ------------------------------------------------------------------- boot */

function boot() {
  initScroll();
  initHeader();
  initCursor();
  initMagnetic();
  const claimed = initIntro();
  initReveals(claimed);
  initLockIns();
  initScrubText();
  initPractices();
  initRange();
  initCta();
  initSpy();
  initFaq();
  initFilter();
  initForm();
  initHeroGlobe();
  ScrollTrigger.refresh();
}

// Split text needs final font metrics, so wait for the webfont (but never for long).
Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(boot);
