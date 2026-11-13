import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SplitText } from 'gsap/SplitText';
import { Flip } from 'gsap/Flip';
import { ScrambleTextPlugin } from 'gsap/ScrambleTextPlugin';
import Lenis from 'lenis';
import type { GlobeSite, GlobeState } from './globe';

gsap.registerPlugin(ScrollTrigger, SplitText, Flip, ScrambleTextPlugin);

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
  const labelEl = $('[data-cursor-text]', cursor);
  document.addEventListener('pointerover', (e) => {
    const t = e.target as Element;
    const labelled = t.closest?.<HTMLElement>('[data-cursor-label]');
    if (labelled && labelEl) labelEl.textContent = labelled.dataset.cursorLabel ?? '';
    cursor.classList.toggle('has-label', !!labelled);
    cursor.classList.toggle('is-lock', !labelled && !!t.closest?.('a, button, summary, label, select'));
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

/** The once-per-visit lock-on intro. Returns how long the page intro should wait for it. */
function playLoader(): number {
  const loader = $('[data-loader]');
  const root = document.documentElement;
  if (!loader || reduce || root.classList.contains('no-loader')) { loader?.remove(); return 0; }
  try { sessionStorage.setItem('lf-seen', '1'); } catch { /* private mode */ }
  // The mark assembles in CSS from first paint; here we only hold long enough for
  // it to finish, then lift the curtain.
  // time left on the mark's own CSS animation (it started at first paint)
  let hold = 1.1;
  const anim = $('.loader__line', loader)?.getAnimations?.()[0];
  const end = anim?.effect?.getComputedTiming().endTime;
  if (anim && typeof end === 'number' && typeof anim.currentTime === 'number') hold = Math.max(0, (end - anim.currentTime) / 1000) + 0.1;
  setTimeout(() => {
    loader.classList.add('is-done');
    setTimeout(() => { root.classList.add('no-loader'); loader.remove(); }, 850);
  }, hold * 1000);
  return hold + 0.3;
}

function initIntro(wait = 0) {
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
    if (title) splitLines(title, { delay: wait + 0.15 });
    if (fades.length) gsap.fromTo(fades, { autoAlpha: 0, y: 22 }, { autoAlpha: 1, y: 0, duration: 1, ease: 'power3.out', stagger: 0.1, delay: wait + 0.55 });
    if (media) {
      // the photograph is wiped in behind a red scan line, then drifts as the page scrolls
      const image = $('img', media);
      const scan = $('.page-hero__scan', media);
      gsap.set(media, { visibility: 'visible' });
      gsap.fromTo(media, { clipPath: 'inset(0% 0% 100% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.4, ease: 'power3.inOut', delay: wait + 0.1 });
      if (scan) gsap.fromTo(scan, { top: '0%', opacity: 1 }, { top: '100%', opacity: 0, duration: 1.4, ease: 'power3.inOut', delay: wait + 0.1 });
      if (image) {
        gsap.from(image, { scale: 1.2, duration: 2.2, ease: 'expo.out', delay: wait + 0.1 });
        gsap.to(image, { yPercent: 9, ease: 'none', scrollTrigger: { trigger: media.parentElement, start: 'top top', end: 'bottom top', scrub: true } });
      }
    }
    if (heroRule) ruleTimeline(heroRule).delay(wait + 0.7);
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

function initHeroGlobe(wait = 0) {
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
      if (!reduce) {
        gsap.fromTo([role, coordsEl], { opacity: 0, x: -10 }, { opacity: 1, x: 0, duration: 0.45, stagger: 0.06, ease: 'power3.out', overwrite: true });
        // the site name resolves out of noise, like a readout settling
        gsap.to(name, { duration: 0.8, scrambleText: { text: site.name, chars: 'ABCDEFGHJKLMNPQRSTUVWXYZ0123456789', speed: 0.5 }, overwrite: true });
      }
    } else {
      hud.classList.add('is-seeking');
      hud.classList.remove('is-locked');
      status.textContent = s.target === null ? 'Free look' : 'Seeking';
      gsap.killTweensOf(name);
      name.textContent = s.target === null ? 'Release near a site to lock on' : sites[s.target].name;
      role.textContent = '';
      coordsEl.textContent = fmt(s.lat, s.lon);
      setPicked(s.target);
    }
  };

  // WebGL start-up is heavy, so it waits until the intro curtain has lifted
  const load = () => import('./globe')
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
  setTimeout(load, wait * 1000);
}

/* ---------------------------------------------------------- image framing */

/** Adds targeting brackets to photographs; they close in as each image arrives. */
function initFrames() {
  const frames = $$('.frame, .news-card__media, .product__media, .range-card__media, .split__media, .service__media');
  frames.forEach((el) => {
    const b = document.createElement('span');
    b.className = 'brackets';
    b.setAttribute('aria-hidden', 'true');
    b.innerHTML = '<i></i><i></i><i></i><i></i>';
    el.appendChild(b);
  });
  if (reduce) { frames.forEach((el) => el.classList.add('is-framed')); return; }
  ScrollTrigger.batch(frames, {
    start: 'top 82%',
    once: true,
    onEnter: (els) => els.forEach((el, i) => setTimeout(() => el.classList.add('is-framed'), 350 + i * 110)),
  });
}

/** Photographs lean a few degrees toward the pointer. */
function initTilt() {
  if (!finePointer || reduce) return;
  $$('.news-card__media, .product__media, .range-card__media, .collage .frame, .why__photo, .faq-aside .frame').forEach((el) => {
    gsap.set(el, { transformPerspective: 900 });
    const rx = gsap.quickTo(el, 'rotationX', { duration: 0.6, ease: 'power3' });
    const ry = gsap.quickTo(el, 'rotationY', { duration: 0.6, ease: 'power3' });
    const host = el.closest('a') ?? el;
    host.addEventListener('pointermove', (e) => {
      const r = el.getBoundingClientRect();
      ry(((e as PointerEvent).clientX - r.left - r.width / 2) / r.width * 9);
      rx(-((e as PointerEvent).clientY - r.top - r.height / 2) / r.height * 7);
    });
    host.addEventListener('pointerleave', () => { rx(0); ry(0); });
  });
}

/** Button labels roll over on hover. */
function initRollButtons() {
  $$('.btn > span:first-child').forEach((span) => {
    const text = span.textContent ?? '';
    span.classList.add('roll');
    span.textContent = '';
    const a = document.createElement('span');
    a.textContent = text;
    const b = a.cloneNode(true) as HTMLElement;
    b.setAttribute('aria-hidden', 'true');
    span.append(a, b);
  });
}

/* ------------------------------------------------------- home page extras */

function initCounters() {
  $$('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    if (reduce || !Number.isFinite(end)) return;
    const state = { v: 0 };
    el.textContent = '0';
    gsap.to(state, {
      v: end, duration: 1.6, ease: 'power3.out', snap: { v: 1 },
      onUpdate: () => { el.textContent = String(Math.round(state.v)); },
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
    });
  });
}

/** The capability ticker drifts on its own and surges with scroll speed and direction. */
function initMarquee() {
  $$('[data-marquee]').forEach((root) => {
    const track = $('.marquee__track', root);
    if (!track || reduce) return;
    const tween = gsap.to(track, { xPercent: -50, duration: 46, ease: 'none', repeat: -1 });
    let dir = 1;
    ScrollTrigger.create({
      trigger: root, start: 'top bottom', end: 'bottom top',
      onToggle: (self) => (self.isActive ? tween.play() : tween.pause()),
      onUpdate: (self) => {
        const v = self.getVelocity();
        if (Math.abs(v) > 20) dir = v > 0 ? 1 : -1;
        const boost = gsap.utils.clamp(0, 7, Math.abs(v) / 260);
        gsap.to(tween, { timeScale: dir * (1 + boost), duration: 0.25, overwrite: true });
        gsap.to(tween, { timeScale: dir, duration: 1.1, delay: 0.25, overwrite: false });
      },
    });
  });
}

/** Collage photographs travel at different speeds. */
function initCollage() {
  if (reduce) return;
  $$('[data-collage] [data-speed]').forEach((el) => {
    const speed = Number(el.dataset.speed);
    gsap.fromTo(el, { yPercent: -speed }, { yPercent: speed, ease: 'none', scrollTrigger: { trigger: el, start: 'top bottom', end: 'bottom top', scrub: 0.5 } });
  });
}

/** Sector panels: the one under the pointer (or focused, or tapped) opens. */
function initSectors() {
  $$('[data-sectors]').forEach((root) => {
    const panels = $$('.sector', root);
    const open = (panel: HTMLElement) => panels.forEach((p) => {
      const on = p === panel;
      p.classList.toggle('is-active', on);
      $('button', p)?.setAttribute('aria-expanded', String(on));
    });
    panels.forEach((panel) => {
      const btn = $('button', panel)!;
      if (finePointer) panel.addEventListener('pointerenter', () => open(panel));
      btn.addEventListener('focus', () => open(panel));
      btn.addEventListener('click', () => { open(panel); setTimeout(() => ScrollTrigger.refresh(), 800); });
    });
  });
}

/** Reticles whose red dot keeps an eye on the pointer. */
function initEyes() {
  if (!finePointer || reduce) return;
  const eyes = $$('[data-eye]').map((host) => ({ host, svg: $<SVGElement>('.reticle', host), dot: $<SVGElement>('.reticle__dot', host) }))
    .filter((e) => e.svg && e.dot);
  if (!eyes.length) return;
  window.addEventListener('pointermove', (e) => {
    for (const eye of eyes) {
      const r = eye.svg!.getBoundingClientRect();
      if (r.bottom < 0 || r.top > window.innerHeight) continue;
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      const d = Math.hypot(dx, dy) || 1;
      const reach = Math.min(1, d / 300) * 11; // viewBox units, stays inside the ring
      // undo any rotation on the mark so the dot still moves toward the pointer on screen
      const a = (-Number(gsap.getProperty(eye.svg!, 'rotation')) * Math.PI) / 180;
      const ux = (dx / d) * Math.cos(a) - (dy / d) * Math.sin(a);
      const uy = (dx / d) * Math.sin(a) + (dy / d) * Math.cos(a);
      eye.dot!.style.transform = `translate(${ux * reach}px, ${uy * reach}px)`;
    }
  }, { passive: true });
}

/* ------------------------------------------------------------------- boot */

function boot() {
  const wait = playLoader();
  initScroll();
  initHeader();
  initCursor();
  initRollButtons();
  initMagnetic();
  const claimed = initIntro(wait);
  initFrames();
  initTilt();
  initCounters();
  initMarquee();
  initCollage();
  initSectors();
  initEyes();
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
  initHeroGlobe(wait);
  ScrollTrigger.refresh();
}

// Split text needs final font metrics, so wait for the webfont (but never for long).
Promise.race([document.fonts.ready, new Promise((r) => setTimeout(r, 1200))]).then(boot);
