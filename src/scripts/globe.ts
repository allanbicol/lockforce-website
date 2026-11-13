// Hero globe. The reticle stays fixed at the centre of the view and the globe
// turns beneath it until a Lockforce site sits under the crosshair.
import {
  BufferGeometry, Color, Float32BufferAttribute, Group, Line, LineBasicMaterial, Mesh, MeshBasicMaterial,
  PerspectiveCamera, Points, RingGeometry, Scene, ShaderMaterial, SphereGeometry, Vector3, WebGLRenderer, DoubleSide,
} from 'three';
import landDots from '../data/land-dots.json';

export type GlobeSite = { name: string; role: string; lat: number; lon: number };
export type GlobeState =
  | { type: 'seeking'; lat: number; lon: number; target: number | null }
  | { type: 'locked'; index: number };

type Options = {
  sites: GlobeSite[];
  reducedMotion: boolean;
  dwell: number; // seconds to hold a lock before moving on
  onState: (state: GlobeState) => void;
  onProgress: (index: number, progress: number) => void;
};

const RAD = Math.PI / 180;
const FOV = 30;
const FILL = 0.84; // share of the canvas half-height the globe fills

function toVec(lat: number, lon: number, r = 1) {
  const phi = lat * RAD;
  const lam = lon * RAD;
  return new Vector3(r * Math.cos(phi) * Math.sin(lam), r * Math.sin(phi), r * Math.cos(phi) * Math.cos(lam));
}

function angularDistance(aLat: number, aLon: number, bLat: number, bLon: number) {
  const a = toVec(aLat, aLon);
  const b = toVec(bLat, bLon);
  return Math.acos(Math.min(1, Math.max(-1, a.dot(b)))) / RAD;
}

export function initGlobe(root: HTMLElement, opts: Options) {
  const canvas = root.querySelector('canvas')!;
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'high-performance' });
  renderer.setClearColor(0x000000, 0);

  const scene = new Scene();
  const camera = new PerspectiveCamera(FOV, 1, 0.1, 20);
  // distance at which a unit sphere fills FILL of the half-height
  const tanHalf = Math.tan((FOV / 2) * RAD);
  camera.position.z = 1 / Math.sin(Math.atan(FILL * tanHalf));

  const globe = new Group();
  globe.rotation.order = 'XYZ';
  scene.add(globe);

  // Solid body: hides the far side and gives the limb a soft rim of light.
  const body = new Mesh(
    new SphereGeometry(0.994, 64, 48),
    new ShaderMaterial({
      uniforms: { uCore: { value: new Color('#101010') }, uRim: { value: new Color('#787878') } },
      vertexShader: /* glsl */ `
        varying float vFacing;
        void main() {
          vec4 mv = modelViewMatrix * vec4(position, 1.0);
          vFacing = dot(normalize(normalMatrix * normal), normalize(-mv.xyz));
          gl_Position = projectionMatrix * mv;
        }`,
      fragmentShader: /* glsl */ `
        uniform vec3 uCore; uniform vec3 uRim; varying float vFacing;
        void main() {
          float rim = pow(1.0 - clamp(vFacing, 0.0, 1.0), 2.4);
          gl_FragColor = vec4(mix(uCore, uRim, rim), 1.0);
        }`,
    }),
  );
  scene.add(body);

  // Land, as dots.
  const positions = new Float32Array((landDots.length / 2) * 3);
  for (let i = 0, j = 0; i < landDots.length; i += 2, j += 3) {
    const v = toVec(landDots[i], landDots[i + 1]);
    positions[j] = v.x; positions[j + 1] = v.y; positions[j + 2] = v.z;
  }
  const dotGeo = new BufferGeometry();
  dotGeo.setAttribute('position', new Float32BufferAttribute(positions, 3));
  const dotMat = new ShaderMaterial({
    transparent: true,
    depthWrite: false,
    uniforms: { uSize: { value: 1 }, uColor: { value: new Color('#c9c9c6') } },
    vertexShader: /* glsl */ `
      uniform float uSize; varying float vFacing;
      void main() {
        vec4 mv = modelViewMatrix * vec4(position, 1.0);
        vFacing = dot(normalize(normalMatrix * position), normalize(-mv.xyz));
        gl_Position = projectionMatrix * mv;
        gl_PointSize = uSize;
      }`,
    fragmentShader: /* glsl */ `
      uniform vec3 uColor; varying float vFacing;
      void main() {
        if (vFacing < 0.0) discard;
        float d = length(gl_PointCoord - 0.5);
        float a = smoothstep(0.5, 0.36, d) * smoothstep(0.0, 0.45, vFacing);
        gl_FragColor = vec4(uColor, a * 0.9);
      }`,
  });
  globe.add(new Points(dotGeo, dotMat));

  // Faint graticule every 30 degrees, so the turn of the globe reads even over open ocean.
  const gridMat = new LineBasicMaterial({ color: 0xffffff, transparent: true, opacity: 0.075 });
  const gridLine = (pts: Vector3[]) => globe.add(new Line(new BufferGeometry().setFromPoints(pts), gridMat));
  for (let lat = -60; lat <= 60; lat += 30) gridLine(Array.from({ length: 121 }, (_, i) => toVec(lat, i * 3 - 180, 1.001)));
  for (let lon = -180; lon < 180; lon += 30) gridLine(Array.from({ length: 61 }, (_, i) => toVec(i * 3 - 90, lon, 1.001)));

  // Site markers and their pulses.
  const red = new Color('#ff1a1a');
  const pulses: { mesh: Mesh; phase: number }[] = [];
  opts.sites.forEach((site, i) => {
    const p = toVec(site.lat, site.lon, 1.004);
    const dot = new Mesh(new SphereGeometry(0.013, 16, 12), new MeshBasicMaterial({ color: red }));
    dot.position.copy(p);
    globe.add(dot);
    for (let k = 0; k < 2; k++) {
      const ring = new Mesh(
        new RingGeometry(0.02, 0.0225, 48),
        new MeshBasicMaterial({ color: red, transparent: true, side: DoubleSide, depthWrite: false }),
      );
      ring.position.copy(p);
      ring.lookAt(p.clone().multiplyScalar(2));
      globe.add(ring);
      pulses.push({ mesh: ring, phase: i * 0.37 + k * 0.5 });
    }
  });

  // Great-circle links from the Queensland office to the other sites.
  const arcs: Line[] = [];
  const home = toVec(opts.sites[0].lat, opts.sites[0].lon);
  opts.sites.slice(1).forEach((site) => {
    const end = toVec(site.lat, site.lon);
    const pts: Vector3[] = [];
    const N = 72;
    for (let i = 0; i <= N; i++) {
      const t = i / N;
      const v = home.clone().lerp(end, t).normalize();
      pts.push(v.multiplyScalar(1.004 + Math.sin(t * Math.PI) * 0.09));
    }
    const line = new Line(
      new BufferGeometry().setFromPoints(pts),
      new LineBasicMaterial({ color: red, transparent: true, opacity: 0.7 }),
    );
    line.geometry.setDrawRange(0, 0);
    globe.add(line);
    arcs.push(line);
  });

  /* ------------------------------------------------------------- state */

  const rot = { x: opts.sites[0].lat * RAD - 0.5, y: -opts.sites[0].lon * RAD - 1.1 };
  const target = { x: opts.sites[0].lat * RAD, y: -opts.sites[0].lon * RAD };
  let active: number | null = 0; // site we are heading to or locked on
  let locked = false;
  let dragging = false;
  let dwellT = 0;
  let idleT = 0;
  let arcT = 0;
  let visible = true;
  let raf = 0;
  let last = performance.now();
  let lastEmit = 0;

  if (opts.reducedMotion) { rot.x = target.x; rot.y = target.y; }

  const centre = () => {
    let lon = (-rot.y / RAD) % 360;
    if (lon > 180) lon -= 360;
    if (lon < -180) lon += 360;
    return { lat: rot.x / RAD, lon };
  };

  function aim(index: number) {
    const s = opts.sites[index];
    active = index;
    locked = false;
    dwellT = 0;
    target.x = s.lat * RAD;
    // take the short way round
    let y = -s.lon * RAD;
    while (y - rot.y > Math.PI) y -= Math.PI * 2;
    while (y - rot.y < -Math.PI) y += Math.PI * 2;
    target.y = y;
    if (opts.reducedMotion) { rot.x = target.x; rot.y = target.y; }
    const c = centre();
    opts.onState({ type: 'seeking', lat: c.lat, lon: c.lon, target: index });
  }

  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;

    if (!dragging && active !== null) {
      const k = 1 - Math.exp(-dt * 3.2);
      rot.x += (target.x - rot.x) * k;
      rot.y += (target.y - rot.y) * k;
      const off = Math.hypot(target.x - rot.x, (target.y - rot.y) * Math.cos(rot.x)) / RAD;
      if (!locked && off < 0.7) {
        locked = true;
        dwellT = 0;
        opts.onState({ type: 'locked', index: active });
      } else if (!locked && now - lastEmit > 60) {
        lastEmit = now;
        const c = centre();
        opts.onState({ type: 'seeking', lat: c.lat, lon: c.lon, target: active });
      }
      if (locked && !opts.reducedMotion) {
        dwellT += dt;
        opts.onProgress(active, Math.min(1, dwellT / opts.dwell));
        if (dwellT >= opts.dwell) aim((active + 1) % opts.sites.length);
      }
    } else if (!dragging && active === null && !opts.reducedMotion) {
      idleT += dt;
      if (idleT > 4) aim(0);
    }

    globe.rotation.x = rot.x;
    globe.rotation.y = rot.y;

    arcT = Math.min(1, arcT + dt / 2.4);
    arcs.forEach((line, i) => {
      const t = Math.max(0, Math.min(1, arcT * 1.4 - i * 0.4));
      line.geometry.setDrawRange(0, Math.floor(t * 73));
    });

    const time = now / 1000;
    for (const p of pulses) {
      const t = (time * 0.5 + p.phase) % 1;
      p.mesh.scale.setScalar(1 + t * 2.6);
      (p.mesh.material as MeshBasicMaterial).opacity = (1 - t) * 0.85;
    }

    renderer.render(scene, camera);
  }

  /* -------------------------------------------------------------- drag */

  let px = 0;
  let py = 0;
  let moved = false;
  root.addEventListener('pointerdown', (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    px = e.clientX; py = e.clientY; moved = false;
    dragging = true;
    root.setPointerCapture(e.pointerId);
    root.classList.add('is-dragging');
  });
  root.addEventListener('pointermove', (e) => {
    if (!dragging) return;
    const dx = e.clientX - px;
    const dy = e.clientY - py;
    px = e.clientX; py = e.clientY;
    if (!moved && Math.abs(dx) + Math.abs(dy) < 2) return;
    moved = true;
    const k = (2.2 / root.clientWidth) * (e.pointerType === 'touch' ? 1.3 : 1);
    rot.y += dx * k;
    // on touch, vertical movement belongs to page scroll
    if (e.pointerType !== 'touch') rot.x = Math.max(-1.2, Math.min(1.2, rot.x + dy * k));
    locked = false;
    active = null;
    const c = centre();
    opts.onState({ type: 'seeking', lat: c.lat, lon: c.lon, target: null });
  });
  const release = () => {
    if (!dragging) return;
    dragging = false;
    root.classList.remove('is-dragging');
    if (!moved) { if (active === null) aim(0); return; }
    // snap to the nearest site if the crosshair was left close to one
    const c = centre();
    let best = -1;
    let bestD = 28;
    opts.sites.forEach((s, i) => {
      const d = angularDistance(c.lat, c.lon, s.lat, s.lon);
      if (d < bestD) { bestD = d; best = i; }
    });
    if (best >= 0) aim(best);
    else { active = null; idleT = 0; }
  };
  root.addEventListener('pointerup', release);
  root.addEventListener('pointercancel', release);

  /* ------------------------------------------------------------ sizing */

  const resize = () => {
    const size = root.clientWidth;
    if (!size) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(size, size, false);
    dotMat.uniforms.uSize.value = Math.max(2, size * 0.0058) * dpr;
  };
  new ResizeObserver(resize).observe(root);
  resize();

  const start = () => { if (!raf && visible && !document.hidden) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  const stop = () => { cancelAnimationFrame(raf); raf = 0; };
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; visible ? start() : stop(); }).observe(root);
  document.addEventListener('visibilitychange', () => (document.hidden ? stop() : start()));

  aim(0);
  start();
  root.classList.add('is-ready');

  return { aim };
}
