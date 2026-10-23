/* ============================================================
   js/hero-scene.js — Three.js hero & teaser scenes (ES module)
   Runs only on index.html. Falls back to a static image when
   WebGL is unavailable, on low-power devices, or reduced motion.
   ============================================================ */
import * as THREE from 'three';

const U = window.VUtils;
const CFG = {
    dprCap: 2,
    fireflies: 120,
    leaves: 22,
    camBase: new THREE.Vector3(0, 4.6, 16.5),
    lookAt: new THREE.Vector3(0, 5.2, 0)
};
const PAL = {
    bark: 0x4B3321, leafA: 0x3E8E41, leafB: 0x1F4D2B, leafC: 0x8BC17A,
    berry: 0x8E2C63, berry2: 0x5A1A3F,
    skyStops: ['#2B0A1F', '#5A1A3F', '#8E2C63', '#D4A24C'] // top -> horizon sunset
};

/* --- tiny seeded PRNG so the tree looks identical on reloads --- */
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }

/* --- canvas texture helpers --- */
function glowTexture(hex) {
    const c = document.createElement('canvas'); c.width = c.height = 64;
    const x = c.getContext('2d'), g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, hex); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
}
function leafTexture() {
    const c = document.createElement('canvas'); c.width = 48; c.height = 64;
    const x = c.getContext('2d');
    x.fillStyle = 'rgba(255,255,255,.95)';
    x.beginPath(); x.moveTo(24, 4);
    x.quadraticCurveTo(46, 28, 24, 60); x.quadraticCurveTo(2, 28, 24, 4);
    x.fill();
    x.strokeStyle = 'rgba(120,90,50,.6)'; x.lineWidth = 2;
    x.beginPath(); x.moveTo(24, 6); x.lineTo(24, 58); x.stroke();
    return new THREE.CanvasTexture(c);
}
function skyTexture(stops) {
    const c = document.createElement('canvas'); c.width = 8; c.height = 256;
    const x = c.getContext('2d'), g = x.createLinearGradient(0, 0, 0, 256);
    stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s));
    x.fillStyle = g; x.fillRect(0, 0, 8, 256);
    const t = new THREE.CanvasTexture(c); t.colorSpace = THREE.SRGBColorSpace; return t;
}

/* --- procedural mulberry tree --- */
function buildTree(seed) {
    const rnd = mulberry32(seed);
    const barkMat = new THREE.MeshStandardMaterial({ color: PAL.bark, roughness: .95, flatShading: true });
    const leafMats = [PAL.leafA, PAL.leafB, PAL.leafC].map(cl => new THREE.MeshStandardMaterial({ color: cl, roughness: .9, flatShading: true }));
    const berryMat = new THREE.MeshStandardMaterial({ color: PAL.berry, roughness: .5 });
    const berry2Mat = new THREE.MeshStandardMaterial({ color: PAL.berry2, roughness: .5 });
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(.34, .62, 5.2, 8, 3), barkMat);
    trunk.position.y = 2.4; group.add(trunk);
    (function branch(parent, y, len, radius, depth) {
        if (depth === 0) {
            const l = new THREE.Mesh(new THREE.IcosahedronGeometry(.85 + rnd() * .7, 0), leafMats[Math.floor(rnd() * 3)]);
            l.position.set(0, y + len * .9, 0); l.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6);
            parent.add(l);
            for (let i = 0; i < 3; i++) { // ripe berries tucked in the canopy
                const b = new THREE.Mesh(new THREE.SphereGeometry(.09, 6, 5), rnd() > .5 ? berryMat : berry2Mat);
                const a = rnd() * Math.PI * 2, rr = .5 + rnd() * .6;
                b.position.set(l.position.x + Math.cos(a) * rr, l.position.y + (rnd() - .5) * .8, Math.sin(a) * rr);
                parent.add(b);
            }
            return;
        }
        const n = 2 + (rnd() < .45 ? 1 : 0);
        for (let i = 0; i < n; i++) {
            const pivot = new THREE.Group();
            pivot.position.y = y + len * (.45 + rnd() * .4);
            pivot.rotation.set((rnd() * .5 + .22) * (rnd() < .5 ? -1 : 1), rnd() * Math.PI * 2, (rnd() * .5 + .22) * (rnd() < .5 ? -1 : 1));
            const seg = new THREE.Mesh(new THREE.CylinderGeometry(Math.max(radius * .55, .04), radius, len, 7, 1), barkMat);
            seg.geometry.translate(0, len / 2, 0); pivot.add(seg);
            parent.add(pivot);
            branch(pivot, 0, len * (.6 + rnd() * .16), radius * .6, depth - 1);
        }
    })(group, 4.6, 2.1, .42, 3);
    return group;
}

/* --- capability checks --- */
function webglOK() {
    try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); }
    catch (e) { return false; }
}
const lowPower = (navigator.hardwareConcurrency || 8) <= 2 || (navigator.deviceMemory && navigator.deviceMemory <= 2);
const reduced = U.reduced();

/* ================= HERO SCENE ================= */
function initHero() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    if (!webglOK() || lowPower || reduced) { showFallback(); return; }
    window.__heroBooted = true;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false }); }
    catch (e) { showFallback(); return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, CFG.dprCap));
    renderer.setSize(innerWidth, innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x5A1A3F, 20, 78);
    const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, .1, 200);
    camera.position.copy(CFG.camBase).add(new THREE.Vector3(0, 0, 10)); // intro start, pulled back
    camera.lookAt(CFG.lookAt);

    // sunset sky dome
    const sky = new THREE.Mesh(new THREE.SphereGeometry(110, 24, 16),
        new THREE.MeshBasicMaterial({ map: skyTexture(PAL.skyStops), side: THREE.BackSide, fog: false }));
    scene.add(sky);
    // hill
    const hill = new THREE.Mesh(new THREE.SphereGeometry(60, 32, 16),
        new THREE.MeshStandardMaterial({ color: 0x1F4D2B, roughness: 1, flatShading: true }));
    hill.scale.set(1, .22, 1); hill.position.y = -13.3; scene.add(hill);
    // tree + fireflies + drifting leaves
    const tree = buildTree(7); tree.position.y = -.3; scene.add(tree);
    const ffTex = glowTexture('rgba(212,162,76,.9)');
    const ffGeo = new THREE.BufferGeometry();
    const ffPos = new Float32Array(CFG.fireflies * 3), ffBase = [];
    for (let i = 0; i < CFG.fireflies; i++) {
        ffBase.push({ x: (Math.random() - .5) * 26, y: Math.random() * 12 + .5, z: (Math.random() - .5) * 20, ph: Math.random() * 6.28, sp: .4 + Math.random() * .8 });
    }
    ffGeo.setAttribute('position', new THREE.BufferAttribute(ffPos, 3));
    const fireflies = new THREE.Points(ffGeo, new THREE.PointsMaterial({ size: .22, map: ffTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, opacity: .85 }));
    scene.add(fireflies);
    const leafTex = leafTexture();
    const leafMat = new THREE.MeshBasicMaterial({ map: leafTex, transparent: true, side: THREE.DoubleSide, opacity: .8, color: 0x8BC17A });
    const leafMat2 = leafMat.clone(); leafMat2.color.set(0xC26A97);
    const leaves = [];
    for (let i = 0; i < CFG.leaves; i++) {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(.26, .34), i % 3 ? leafMat : leafMat2);
        m.position.set((Math.random() - .5) * 22, Math.random() * 12, (Math.random() - .5) * 16);
        m.userData = { vy: .35 + Math.random() * .5, ph: Math.random() * 6.28, vr: (Math.random() - .5) * .02 };
        scene.add(m); leaves.push(m);
    }
    // lights: warm sunset key + berry ambient
    scene.add(new THREE.AmbientLight(0x8E2C63, .75));
    const sun = new THREE.DirectionalLight(0xffd9a0, 2.2); sun.position.set(12, 9, 7); scene.add(sun);
    const rim = new THREE.DirectionalLight(0xC26A97, .8); rim.position.set(-10, 6, -8); scene.add(rim);

    // mouse parallax
    const px = { t: 0, c: 0 }, py = { t: 0, c: 0 };
    addEventListener('pointermove', e => { px.t = (e.clientX / innerWidth - .5) * 1.4; py.t = (e.clientY / innerHeight - .5) * .7; }, { passive: true });

    // intro after preloader (or timeout fallback)
    let introDone = false;
    const intro = () => {
        if (introDone) return; introDone = true;
        if (window.gsap) gsap.to(camera.position, { z: CFG.camBase.z, duration: 2.4, ease: 'power3.out' }); else camera.position.copy(CFG.camBase);
    };
    addEventListener('village:ready', intro); setTimeout(intro, 3200);

    // pause when offscreen / tab hidden
    let running = true, raf = null;
    new IntersectionObserver(es => { running = es[0].isIntersecting; }, { threshold: .02 }).observe(canvas);
    document.addEventListener('visibilitychange', () => { running = !document.hidden; });
    function start() { if (raf) return; (function loop(t) { raf = requestAnimationFrame(loop); if (!running) return; render(t); })(0); }

    function render(t) {
        t /= 1000;
        px.c += (px.t - px.c) * .05; py.c += (py.t - py.c) * .05;
        camera.position.x = CFG.camBase.x + px.c; camera.position.y = CFG.camBase.y - py.c;
        camera.lookAt(CFG.lookAt);
        const pos = ffGeo.attributes.position;
        for (let i = 0; i < CFG.fireflies; i++) {
            const b = ffBase[i];
            pos.setXYZ(i, b.x + Math.sin(t * b.sp + b.ph) * .6, b.y + Math.sin(t * b.sp * .7 + b.ph) * .9, b.z + Math.cos(t * b.sp + b.ph) * .5);
        }
        pos.needsUpdate = true;
        leaves.forEach(l => {
            l.position.y -= l.userData.vy * .016 * 60 * .016 * 10;
            l.position.x += Math.sin(t + l.userData.ph) * .008;
            l.rotation.z += l.userData.vr;
            if (l.position.y < -1.5) { l.position.y = 12 + Math.random() * 3; l.position.x = (Math.random() - .5) * 22; }
        });
        tree.rotation.y = Math.sin(t * .1) * .04; // gentle breeze
        renderer.render(scene, camera);
    }
    start();

    const onResize = U.debounce(() => {
        camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight);
    }, 150);
    addEventListener('resize', onResize);

    // full disposal
    addEventListener('pagehide', () => {
        running = false; cancelAnimationFrame(raf);
        scene.traverse(o => { if (o.geometry) o.geometry.dispose(); if (o.material) { (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { m.map && m.map.dispose(); m.dispose(); }); } });
        renderer.dispose();
    }, { once: true });

    function showFallback() {
        canvas.style.display = 'none';
        const f = document.getElementById('hero-fallback');
        if (f) f.classList.remove('hidden');
    }
}

/* ================= TEASER SCENE (night, section H) ================= */
function initTeaser() {
    const canvas = document.getElementById('teaser-canvas');
    if (!canvas) return;
    if (!webglOK() || lowPower || reduced) { canvas.style.opacity = '.35'; return; }
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ canvas, antialias: true }); } catch (e) { return; }
    renderer.setPixelRatio(Math.min(devicePixelRatio, CFG.dprCap));
    const w = canvas.clientWidth || innerWidth, h = canvas.parentElement ? canvas.parentElement.offsetHeight : 500;
    renderer.setSize(w, h);
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x14081f, .03);
    const camera = new THREE.PerspectiveCamera(42, w / h, .1, 200);
    const tree = buildTree(21);
    tree.traverse(o => { if (o.material && o.material.isMeshStandardMaterial) o.material.emissive = new THREE.Color(0x1a0f2e); });
    scene.add(tree);
    const sky = new THREE.Mesh(new THREE.SphereGeometry(90, 20, 14),
        new THREE.MeshBasicMaterial({ map: skyTexture(['#0d0616', '#1c0b2e', '#2B0A1F', '#3d1440']), side: THREE.BackSide, fog: false }));
    scene.add(sky);
    const ground = new THREE.Mesh(new THREE.CircleGeometry(24, 48),
        new THREE.MeshBasicMaterial({ color: 0x120a1c }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -.5; scene.add(ground);
    const glow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTexture('rgba(142,44,99,.5)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
    glow.scale.set(10, 10, 1); glow.position.y = 4; scene.add(glow);
    // fireflies (denser — magical night)
    const n = 300, geo = new THREE.BufferGeometry(), arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) { arr[i * 3] = (Math.random() - .5) * 30; arr[i * 3 + 1] = Math.random() * 14; arr[i * 3 + 2] = (Math.random() - .5) * 24; }
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    scene.add(new THREE.Points(geo, new THREE.PointsMaterial({ size: .16, map: glowTexture('rgba(212,162,76,.95)'), transparent: true, depthWrite: false, blending: THREE.AdditiveBlending })));
    scene.add(new THREE.AmbientLight(0x5a2a66, 1.4));
    const p1 = new THREE.PointLight(0x8E2C63, 160, 0, 1.9); p1.position.set(0, 10, 4); scene.add(p1);
    const p2 = new THREE.PointLight(0xD4A24C, 60, 0, 2); p2.position.set(6, 3, 6); scene.add(p2);

    let running = true, raf = null, angle = 0;
    new IntersectionObserver(es => { running = es[0].isIntersecting; }, { threshold: .05 }).observe(canvas);
    document.addEventListener('visibilitychange', () => { running = running && !document.hidden; });
    (function loop(t) {
        raf = requestAnimationFrame(loop);
        if (!running) return;
        t /= 1000; angle += .0012;
        camera.position.set(Math.sin(angle) * 17, 8 + Math.sin(t * .3) * .6, Math.cos(angle) * 17);
        camera.lookAt(0, 4.5, 0);
        glow.material.opacity = .35 + Math.sin(t * 1.4) * .15;
        renderer.render(scene, camera);
    })(0);
    addEventListener('resize', U.debounce(() => {
        const W = canvas.clientWidth || innerWidth, H = canvas.parentElement ? canvas.parentElement.offsetHeight : 500;
        camera.aspect = W / H; camera.updateProjectionMatrix(); renderer.setSize(W, H);
    }, 200));
    addEventListener('pagehide', () => { cancelAnimationFrame(raf); renderer.dispose(); }, { once: true });
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', () => { initHero(); initTeaser(); });
else { initHero(); initTeaser(); }