// Generates the dotted-land dataset for the hero globe.
// Run with: npm run gen:globe
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { feature } from 'topojson-client';
import { geoContains } from 'd3-geo';

const require = createRequire(import.meta.url);
const topo = require('world-atlas/land-110m.json');
const land = feature(topo, topo.objects.land);

const STEP = 1.2; // degrees between dots
const out = [];
for (let lat = -58; lat <= 84; lat += STEP) {
  const n = Math.max(1, Math.round((360 / STEP) * Math.cos((lat * Math.PI) / 180)));
  for (let i = 0; i < n; i++) {
    const lon = -180 + (360 * (i + 0.5)) / n;
    if (geoContains(land, [lon, lat])) out.push(+lat.toFixed(2), +lon.toFixed(2));
  }
}
fs.mkdirSync(new URL('../src/data/', import.meta.url), { recursive: true });
fs.writeFileSync(new URL('../src/data/land-dots.json', import.meta.url), JSON.stringify(out));
console.log(`land dots: ${out.length / 2}`);
