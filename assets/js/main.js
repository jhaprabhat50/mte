/* ==========================================================================
   MECH TECH ENGINEERING — site behaviour
   ========================================================================== */

/* ---------- footer year ---------- */
document.getElementById('year').textContent = new Date().getFullYear();

/* ---------- mobile nav ---------- */
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
}));

/* ---------- service tabs ---------- */
const tabs = document.querySelectorAll('.svc-tab');
const panes = document.querySelectorAll('.svc-pane');
tabs.forEach(tab => {
  tab.addEventListener('click', () => {
    tabs.forEach(t => t.classList.remove('active'));
    panes.forEach(p => p.classList.remove('active'));
    tab.classList.add('active');
    document.getElementById(tab.dataset.target).classList.add('active');
  });
});

/* ---------- founder photo placeholder swap ---------- */
/* Replace src below with the founder's photo file (e.g. assets/img/founder.jpg)
   and the placeholder text will automatically be hidden once it loads. */
const founderImg = document.getElementById('founderImg');
const founderPhoto = document.getElementById('founderPhoto');
if (founderImg.getAttribute('src')) {
  founderImg.addEventListener('load', () => {
    founderImg.style.display = 'block';
    founderPhoto.style.color = 'transparent';
  });
}

/* ---------- marquee: duplicate track for seamless loop ---------- */
const track = document.getElementById('marqueeTrack');
track.innerHTML += track.innerHTML;

/* ==========================================================================
   HERO RIG — interactive Three.js gantry-crane structure
   Drag to rotate, click to trigger a weld-spark burst.
   Respects prefers-reduced-motion (idle spin + particle bursts disabled).
   ========================================================================== */
import * as THREE from 'https://cdn.jsdelivr.net/npm/three@0.160.0/build/three.module.js';

const canvas = document.getElementById('rig');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const scene = new THREE.Scene();
const stage = canvas.parentElement;

const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 100);
camera.position.set(0, 2.1, 11);

const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

function resize() {
  const w = stage.clientWidth, h = stage.clientHeight;
  renderer.setSize(w, h, false);
  camera.aspect = w / h;
  camera.updateProjectionMatrix();
}
window.addEventListener('resize', resize);

/* --- colours pulled from the brand: steel greys + gold + weld orange --- */
const GOLD = 0xe0ac2a;
const STEEL = 0x6a6d72;
const STEEL_DARK = 0x35373b;
const WELD = 0xff5a1f;

const rig = new THREE.Group();
scene.add(rig);

/* helper: an I-beam-like box with gold edge lines, matching the gantry photos */
function beam(length, w = 0.18, d = 0.18, color = STEEL) {
  const group = new THREE.Group();
  const geo = new THREE.BoxGeometry(length, w, d);
  const mat = new THREE.MeshStandardMaterial({ color, roughness: 0.55, metalness: 0.6 });
  const mesh = new THREE.Mesh(geo, mat);
  group.add(mesh);
  const edges = new THREE.EdgesGeometry(geo);
  const line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: GOLD, transparent: true, opacity: 0.65 }));
  group.add(line);
  return group;
}

/* Build a simple gantry-crane portal: two A-frame legs + a long crossbeam,
   echoing the workshop gantry cranes shown in MTE's brochure. */
function buildPortal(xOffset, height, span) {
  const portal = new THREE.Group();

  const legL = beam(height, 0.16, 0.16, STEEL_DARK);
  legL.rotation.z = Math.PI / 2;
  legL.position.set(xOffset - span / 2, height / 2, 0);
  portal.add(legL);

  const legR = beam(height, 0.16, 0.16, STEEL_DARK);
  legR.rotation.z = Math.PI / 2;
  legR.position.set(xOffset + span / 2, height / 2, 0);
  portal.add(legR);

  const brace = beam(span * 0.6, 0.1, 0.1, STEEL);
  brace.rotation.z = Math.PI / 5;
  brace.position.set(xOffset - span * 0.18, height * 0.62, 0);
  portal.add(brace);

  const brace2 = beam(span * 0.6, 0.1, 0.1, STEEL);
  brace2.rotation.z = -Math.PI / 5;
  brace2.position.set(xOffset + span * 0.18, height * 0.62, 0);
  portal.add(brace2);

  return portal;
}

const SPAN = 3.2, HEIGHT = 3.6, DEPTH = 3.4;
const portalA = buildPortal(0, HEIGHT, SPAN);
portalA.position.z = DEPTH / 2;
rig.add(portalA);

const portalB = buildPortal(0, HEIGHT, SPAN);
portalB.position.z = -DEPTH / 2;
rig.add(portalB);

/* long gold crossbeam (the crane rail) spanning both portals */
const rail = beam(DEPTH + 0.6, 0.16, 0.16, STEEL);
rail.rotation.y = Math.PI / 2;
rail.position.set(0, HEIGHT, 0);
rig.add(rail);

/* connecting top chords between the two frames */
[-SPAN / 2, SPAN / 2].forEach((x) => {
  const chord = beam(DEPTH, 0.1, 0.1, STEEL_DARK);
  chord.rotation.y = Math.PI / 2;
  chord.position.set(x, HEIGHT, 0);
  rig.add(chord);
});

/* a small "trolley" block riding the rail, standing in for the crane hoist */
const trolleyGeo = new THREE.BoxGeometry(0.5, 0.32, 0.5);
const trolleyMat = new THREE.MeshStandardMaterial({ color: 0x222225, metalness: 0.7, roughness: 0.4 });
const trolley = new THREE.Mesh(trolleyGeo, trolleyMat);
trolley.position.set(0.4, HEIGHT - 0.28, 0);
rig.add(trolley);
const trolleyEdges = new THREE.LineSegments(new THREE.EdgesGeometry(trolleyGeo), new THREE.LineBasicMaterial({ color: WELD }));
trolleyEdges.position.copy(trolley.position);
rig.add(trolleyEdges);

/* floor grid, subtle, like a workshop slab */
const grid = new THREE.GridHelper(10, 20, 0x3a3d42, 0x24262a);
grid.position.y = -0.02;
rig.add(grid);

rig.position.y = -1.1;

/* --- lighting: cool key light + a warm "weld" point light that flickers --- */
scene.add(new THREE.AmbientLight(0x6b6f76, 0.9));
const key = new THREE.DirectionalLight(0xffffff, 0.9);
key.position.set(4, 6, 5);
scene.add(key);

const weldLight = new THREE.PointLight(WELD, 3.2, 6, 2);
weldLight.position.set(0.4, HEIGHT - 1.5, 0.3);
rig.add(weldLight);

/* --- weld spark particle burst, spawned on click --- */
const sparkGeo = new THREE.BufferGeometry();
const SPARK_COUNT = 160;
const sparkPositions = new Float32Array(SPARK_COUNT * 3);
const sparkVelocities = [];
for (let i = 0; i < SPARK_COUNT; i++) {
  sparkPositions.set([0, 0, 0], i * 3);
  sparkVelocities.push(new THREE.Vector3());
}
sparkGeo.setAttribute('position', new THREE.BufferAttribute(sparkPositions, 3));
const sparkMat = new THREE.PointsMaterial({ color: WELD, size: 0.05, transparent: true, opacity: 0 });
const sparks = new THREE.Points(sparkGeo, sparkMat);
rig.add(sparks);
let sparkLife = 0;

function triggerSparks(originLocal) {
  if (reduceMotion) return;
  sparkLife = 1;
  sparkMat.opacity = 1;
  const posAttr = sparkGeo.getAttribute('position');
  for (let i = 0; i < SPARK_COUNT; i++) {
    posAttr.setXYZ(i, originLocal.x, originLocal.y, originLocal.z);
    sparkVelocities[i].set(
      (Math.random() - 0.5) * 4,
      Math.random() * 4,
      (Math.random() - 0.5) * 4
    );
  }
  posAttr.needsUpdate = true;
  weldLight.position.copy(originLocal);
  weldFlash = 1;
}
let weldFlash = 0;

/* ---------- pointer drag rotation ---------- */
let dragging = false, lastX = 0, lastY = 0;
let rotY = 0.5, rotX = -0.05, velY = 0.0016;

function pointerDown(x, y) { dragging = true; lastX = x; lastY = y; }
function pointerMove(x, y) {
  if (!dragging) return;
  const dx = x - lastX, dy = y - lastY;
  rotY += dx * 0.006;
  rotX += dy * 0.004;
  rotX = Math.max(-0.5, Math.min(0.5, rotX));
  lastX = x; lastY = y;
}
function pointerUp() { dragging = false; }

canvas.addEventListener('mousedown', (e) => pointerDown(e.clientX, e.clientY));
window.addEventListener('mousemove', (e) => pointerMove(e.clientX, e.clientY));
window.addEventListener('mouseup', pointerUp);

canvas.addEventListener('touchstart', (e) => {
  const t = e.touches[0]; pointerDown(t.clientX, t.clientY);
}, { passive: true });
canvas.addEventListener('touchmove', (e) => {
  const t = e.touches[0]; pointerMove(t.clientX, t.clientY);
}, { passive: true });
canvas.addEventListener('touchend', pointerUp);

/* click / tap without drag => weld spark at a joint near the pointer */
let downPos = null;
canvas.addEventListener('mousedown', (e) => { downPos = [e.clientX, e.clientY]; });
canvas.addEventListener('mouseup', (e) => {
  if (!downPos) return;
  const dist = Math.hypot(e.clientX - downPos[0], e.clientY - downPos[1]);
  if (dist < 4) {
    const jointX = (Math.random() - 0.5) * SPAN;
    triggerSparks(new THREE.Vector3(jointX, HEIGHT - 0.2, (Math.random() - 0.5) * DEPTH));
  }
});

/* ---------- animation loop ---------- */
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();

  if (!dragging && !reduceMotion) rotY += velY;
  rig.rotation.y += (rotY - rig.rotation.y) * 0.08;
  rig.rotation.x += (rotX - rig.rotation.x) * 0.08;

  /* weld light gentle flicker */
  const t = clock.getElapsedTime();
  weldLight.intensity = 2.4 + Math.sin(t * 18) * 0.4 + Math.random() * 0.3 + weldFlash * 4;
  weldFlash = Math.max(0, weldFlash - dt * 3);

  /* update sparks */
  if (sparkLife > 0) {
    sparkLife -= dt * 0.9;
    sparkMat.opacity = Math.max(0, sparkLife);
    const posAttr = sparkGeo.getAttribute('position');
    for (let i = 0; i < SPARK_COUNT; i++) {
      const v = sparkVelocities[i];
      v.y -= dt * 6; // gravity
      posAttr.setXYZ(i,
        posAttr.getX(i) + v.x * dt,
        posAttr.getY(i) + v.y * dt,
        posAttr.getZ(i) + v.z * dt
      );
    }
    posAttr.needsUpdate = true;
  }

  renderer.render(scene, camera);
}

resize();
animate();

/* re-check size on load in case fonts/layout shift the stage box */
window.addEventListener('load', resize);
