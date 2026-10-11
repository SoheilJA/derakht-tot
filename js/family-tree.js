/* ============================================================
   js/family-tree.js — immersive 3D family tree (ES module).
   Data-driven from getFamilyPeople(); supports unlimited
   generations & multiple roots (family selector).
   Layout: trunk at bottom center, generations grow upward &
   outward in a phyllotaxis-like radial fan. Click to fly+panel,
   search, legend, toolbar, deep-linking via ?person=<id>.
   ============================================================ */
import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { CSS2DRenderer, CSS2DObject } from 'three/addons/renderers/CSS2DRenderer.js';

const U = window.VUtils, gsap = window.gsap;
const CFG = {
    dprCap: 2,
    genHeight: 3.1,          // vertical step per generation (organic)
    genRadius: g => 6.0 * Math.pow(g, 0.92), // radial step per generation
    ringRadius: g => 2.2 + g * 4.9,          // flat-rings layout radius
    ringHeight: 1.35,
    nodeSize: .8,
    fireflies: 900,
    camHome: { pos: new THREE.Vector3(17, 11, 21), tgt: new THREE.Vector3(0, 6, 0) },
    colors: { male: 0xD4A24C, female: 0xC26A97, bark: 0x3A2818, glowGold: '#D4A24C', glowBerry: '#C26A97' },
    genColors: ['#D4A24C', '#8BC17A', '#3E8E41', '#C26A97', '#8E2C63', '#5A1A3F', '#2B0A1F']
};

const state = {
    people: [], byId: new Map(), childrenOf: new Map(), roots: [],
    nodes: [], nodeById: new Map(), visibleRoots: [],
    layout: 'organic', selected: null, hovered: null,
    wantAutoRotate: true, showLabels: true, showRings: false,
    running: true, disposed: false, highlight: [], highlightTweens: []
};

/* ---------- tiny helpers ---------- */
const qs = s => document.querySelector(s);
function glowTexture(hex) {
    const c = document.createElement('canvas'); c.width = c.height = 128;
    const x = c.getContext('2d'), g = x.createRadialGradient(64, 64, 4, 64, 64, 64);
    g.addColorStop(0, hex); g.addColorStop(.35, hex.replace(/[\d.]+\)$/, '.35)')); g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g; x.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
}
function groundTexture() { // dark disc with faint glowing rings — "trunk rings"
    const c = document.createElement('canvas'); c.width = c.height = 512;
    const x = c.getContext('2d');
    x.fillStyle = '#100718'; x.beginPath(); x.arc(256, 256, 256, 0, 7); x.fill();
    for (let r = 40; r < 250; r += 34) {
        x.strokeStyle = 'rgba(212,162,76,' + (0.16 * (r / 250)) + ')'; x.lineWidth = 1.6;
        x.beginPath(); x.arc(256, 256, r, 0, 7); x.stroke();
    }
    const g = x.createRadialGradient(256, 256, 0, 256, 256, 90);
    g.addColorStop(0, 'rgba(142,44,99,.5)'); g.addColorStop(1, 'rgba(142,44,99,0)');
    x.fillStyle = g; x.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(c);
}
function avatarTexture(p) { // initial-letter avatar when no photo
    const c = document.createElement('canvas'); c.width = c.height = 256;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 256, 256);
    g.addColorStop(0, p.gender === 'f' ? '#5A1A3F' : '#1F4D2B'); g.addColorStop(1, p.gender === 'f' ? '#8E2C63' : '#3E8E41');
    x.fillStyle = g; x.fillRect(0, 0, 256, 256);
    x.fillStyle = '#FBF6EC'; x.font = '900 128px Vazirmatn, sans-serif';
    x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(p.first_name.charAt(0), 128, 140);
    return new THREE.CanvasTexture(c);
}
function faYears(p) { return U.toFa(p.birth_year) + (p.death_year ? '–' + U.toFa(p.death_year) : '') + (p.death_year ? '' : ' — در قید حیات'); }

/* ---------- layout math ---------- */
function countLeaves(p, childrenOf) {
    const kids = childrenOf.get(p.id) || [];
    return kids.length ? kids.reduce((s, k) => s + countLeaves(k, childrenOf), 0) : 1;
}
/** Organic radial tree: each root owns an angular sector sized by its leaf count. */
function layoutOrganic(roots, childrenOf, byId) {
    const pos = new Map();
    const weights = roots.map(r => countLeaves(r, childrenOf));
    const total = weights.reduce((a, b) => a + b, 0);
    let a0 = Math.PI / 2; // start sector wherever; full circle is covered
    roots.forEach((root, i) => {
        const sector = (weights[i] / total) * Math.PI * 2;
        assign(root, a0, a0 + sector);
        a0 += sector;
    });
    function assign(p, s0, s1) {
        const kids = childrenOf.get(p.id) || [];
        let acc = s0;
        const kidLeaves = kids.map(k => countLeaves(k, childrenOf));
        const sum = kidLeaves.reduce((a, b) => a + b, 0) || 1;
        kids.forEach((k, i) => { const w = (kidLeaves[i] / sum) * (s1 - s0); assign(k, acc, acc + w); acc += w; });
        const mid = (s0 + s1) / 2, g = genOf(p, byId);
        const r = g === 0 ? 0 : CFG.genRadius(g);
        pos.set(p.id, new THREE.Vector3(Math.cos(mid) * r, g * CFG.genHeight, Math.sin(mid) * r));
    }
    return pos;
}
/** Flat radial rings: even spread per generation. */
function layoutRings(people) {
    const pos = new Map(), byGen = new Map();
    people.forEach(p => { const g = genOf(p, state.byId); if (!byGen.has(g)) byGen.set(g, []); byGen.get(g).push(p); });
    byGen.forEach((arr, g) => {
        arr.forEach((p, i) => {
            const a = (i / arr.length) * Math.PI * 2 + g * .4;
            pos.set(p.id, new THREE.Vector3(Math.cos(a) * CFG.ringRadius(g), g * CFG.ringHeight, Math.sin(a) * CFG.ringRadius(g)));
        });
    });
    return pos;
}
function genOf(p, byId) { let g = 0, c = p; while (c.parent_id != null) { c = byId.get(c.parent_id); g++; if (!c) break; } return g; }
function descendantsOf(id) {
    let n = 0; (state.childrenOf.get(id) || []).forEach(function walk(k) { n++; (state.childrenOf.get(k.id) || []).forEach(walk); });
    return n;
}

/* ---------- main boot ---------- */
async function init() {
    const stage = qs('#tree-stage');
    if (!stage) return;
    if (!webglOK()) { window.__showTreeFallback(); return; }
    window.__treeBooted = true;
    // wait for the display font (avatars use it) with a small timeout
    await Promise.race([document.fonts ? document.fonts.ready : Promise.resolve(), new Promise(r => setTimeout(r, 900))]);

    state.people = await VillageData.service.getFamilyPeople();
    state.byId = new Map(state.people.map(p => [p.id, p]));
    state.childrenOf = new Map(state.people.map(p => [p.id, state.people.filter(c => c.parent_id === p.id)]));
    state.roots = state.people.filter(p => p.parent_id === null);
    state.visibleRoots = state.roots.map(r => r.id);

    /* --- three.js core --- */
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(Math.min(devicePixelRatio, CFG.dprCap));
    renderer.setSize(innerWidth, innerHeight);
    stage.appendChild(renderer.domElement);
    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(innerWidth, innerHeight);
    labelRenderer.domElement.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
    stage.appendChild(labelRenderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x180b26, .014);
    const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, .1, 300);
    camera.position.copy(CFG.camHome.pos);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(CFG.camHome.tgt);
    controls.enableDamping = true; controls.dampingFactor = .06;
    controls.minDistance = 4; controls.maxDistance = 70;
    controls.maxPolarAngle = Math.PI * .62; controls.autoRotate = true; controls.autoRotateSpeed = .55;

    // night sky dome (deep mulberry/indigo gradient)
    const skyCanvas = document.createElement('canvas'); skyCanvas.width = 8; skyCanvas.height = 256;
    const sx = skyCanvas.getContext('2d'), sg = sx.createLinearGradient(0, 0, 0, 256);
    ['#0a0512', '#160a24', '#2B0A1F', '#3d1440'].forEach((s, i) => sg.addColorStop(i / 3, s));
    sx.fillStyle = sg; sx.fillRect(0, 0, 8, 256);
    const skyTex = new THREE.CanvasTexture(skyCanvas); skyTex.colorSpace = THREE.SRGBColorSpace;
    scene.add(new THREE.Mesh(new THREE.SphereGeometry(140, 24, 16), new THREE.MeshBasicMaterial({ map: skyTex, side: THREE.BackSide, fog: false })));

    // glowing ground disc
    const ground = new THREE.Mesh(new THREE.CircleGeometry(34, 64), new THREE.MeshBasicMaterial({ map: groundTexture() }));
    ground.rotation.x = -Math.PI / 2; ground.position.y = -1.5; scene.add(ground);

    // fireflies
    const ffGeo = new THREE.BufferGeometry(), ffArr = new Float32Array(CFG.fireflies * 3);
    for (let i = 0; i < CFG.fireflies; i++) {
        const a = Math.random() * Math.PI * 2, r = Math.random() * 30;
        ffArr[i * 3] = Math.cos(a) * r; ffArr[i * 3 + 1] = Math.random() * 22 - 1; ffArr[i * 3 + 2] = Math.sin(a) * r;
    }
    ffGeo.setAttribute('position', new THREE.BufferAttribute(ffArr, 3));
    const ffTex = glowTexture('rgba(212,162,76,.95)');
    scene.add(new THREE.Points(ffGeo, new THREE.PointsMaterial({ size: .17, map: ffTex, transparent: true, opacity: .8, depthWrite: false, blending: THREE.AdditiveBlending })));

    // lights
    scene.add(new THREE.AmbientLight(0x5a2a66, 1.5));
    const p1 = new THREE.PointLight(0x8E2C63, 260, 0, 1.9); p1.position.set(0, 16, 0); scene.add(p1);
    const p2 = new THREE.PointLight(0xD4A24C, 90, 0, 2); p2.position.set(8, 2, 8); scene.add(p2);

    // groups
    const treeGroup = new THREE.Group(); scene.add(treeGroup);
    const ringGroup = new THREE.Group(); ringGroup.visible = false; scene.add(ringGroup);
    const guideMats = [];

    /* ---------- tree building ---------- */
    function buildTree(rootIds, animateIntro) {
        disposeTree();
        const people = state.people.filter(p => {
            if (!rootIds.includes(p.parent_id === null ? p.id : rootIdsOf(p).pop())) return false; return true;
        });
        // visible people = every person whose root is in rootIds
        const visible = state.people.filter(p => rootIds.includes(rootIdOf(p)));
        state.visibleRoots = rootIds;
        const posMap = state.layout === 'organic' ? layoutOrganic(visible.filter(p => p.parent_id === null), state.childrenOf, state.byId) : layoutRings(visible);
        // branches first (root -> each child)
        const barkMat = new THREE.MeshStandardMaterial({ color: CFG.colors.bark, roughness: .95, transparent: true, opacity: 1 });
        treeGroup.userData.barkMat = barkMat;
        visible.forEach(p => {
            if (p.parent_id == null) return;
            const parent = state.byId.get(p.parent_id);
            const a = posMap.get(parent.id).clone(), b = posMap.get(p.id).clone();
            const g = genOf(p, state.byId);
            const mid = a.clone().lerp(b, .5);
            mid.y += .55; mid.x += (b.x - a.x) * .18; mid.z += (b.z - a.z) * .18; // organic sag & sway
            const curve = new THREE.CatmullRomCurve3([
                a.clone().add(new THREE.Vector3(0, .45, 0)), mid,
                b.clone().add(new THREE.Vector3(0, -.55, 0))
            ]);
            const radius = Math.max(.05, .3 * Math.pow(.7, g - 1));
            const geo = new THREE.TubeGeometry(curve, 14, radius, 6, false);
            const mesh = new THREE.Mesh(geo, barkMat);
            treeGroup.add(mesh);
            makeNode(p, posMap.get(p.id), curve, radius);
        });
        // stub from ground to root(s)
        visible.filter(p => p.parent_id === null).forEach(root => {
            const p0 = posMap.get(root.id);
            const curve = new THREE.CatmullRomCurve3([new THREE.Vector3(p0.x * .3, -1.5, p0.z * .3), p0.clone().add(new THREE.Vector3(0, -.4, 0))]);
            treeGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 6, .34, 6, false), barkMat));
            makeNode(root, p0, curve, .34);
        });
        buildGuides();
        if (animateIntro && !U.reduced()) introGrow(); else state.nodes.forEach(n => n.group.scale.setScalar(1));
    }
    function rootIdOf(p) { let c = p; while (c.parent_id != null) { c = state.byId.get(c.parent_id); if (!c) break; } return c ? c.id : null; }
    function rootIdsOf() { return []; } // (kept for the guard above readability)

    function makeNode(p, pos, curveToParent, branchRadius) {
        const g = genOf(p, state.byId);
        const group = new THREE.Group(); group.position.copy(pos);
        const face = new THREE.Group(); group.add(face); // billboarded toward camera each frame
        const dead = !!p.death_year;
        const ringColor = p.gender === 'f' ? CFG.colors.female : CFG.colors.male;
        const tex = avatarTexture(p);
        const photoMat = new THREE.MeshBasicMaterial({ map: tex, transparent: true });
        if (dead) photoMat.color.set(0x9d938e); // soft desaturated tone for the departed
        const photo = new THREE.Mesh(new THREE.CircleGeometry(CFG.nodeSize, 40), photoMat);
        photo.userData.personId = p.id;
        const ring = new THREE.Mesh(new THREE.TorusGeometry(CFG.nodeSize + .07, dead ? .035 : .06, 12, 56),
            new THREE.MeshBasicMaterial({ color: ringColor, transparent: true, opacity: dead ? .45 : .95 }));
        const glow = new THREE.Sprite(new THREE.SpriteMaterial({
            map: glowTexture(p.gender === 'f' ? 'rgba(194,106,151,.55)' : 'rgba(212,162,76,.55)'),
            transparent: true, opacity: dead ? .18 : .5, depthWrite: false, blending: THREE.AdditiveBlending
        }));
        glow.scale.setScalar(3);
        face.add(glow, photo, ring);
        if (dead) { // small memorial ribbon below the portrait
            const marker = new THREE.Mesh(new THREE.ConeGeometry(.12, .34, 8),
                new THREE.MeshBasicMaterial({ color: 0xD4A24C, transparent: true, opacity: .8 }));
            marker.rotation.x = Math.PI; marker.position.y = -(CFG.nodeSize + .3);
            face.add(marker);
        }
        // CSS2D label
        const labelEl = document.createElement('div');
        labelEl.className = 'tree-label' + (dead ? ' deceased' : '');
        labelEl.textContent = p.first_name + ' ' + p.last_name;
        const label = new CSS2DObject(labelEl);
        label.position.set(0, CFG.nodeSize + .85, 0);
        group.add(label);
        treeGroup.add(group);
        // async photo swap when a real image exists
        if (p.photo) {
            const loader = new THREE.TextureLoader(); loader.setCrossOrigin('anonymous');
            loader.load(p.photo, t => {
                if (state.disposed) { t.dispose(); return; }
                t.colorSpace = THREE.SRGBColorSpace;
                photoMat.map.dispose(); photoMat.map = t; photoMat.needsUpdate = true;
            }, undefined, () => { });
        }
        const node = { person: p, gen: g, group, face, photo, ring, glow, label, curveToParent, branchRadius, parent: p.parent_id != null ? state.nodeById.get(p.parent_id) : null };
        state.nodes.push(node); state.nodeById.set(p.id, node);
        return node;
    }

    function buildGuides() { // generation rings (toolbar toggle)
        while (ringGroup.children.length) { const c = ringGroup.children.pop(); c.geometry.dispose(); c.material.dispose(); }
        const gens = Math.max(...state.nodes.map(n => n.gen));
        for (let g = 1; g <= gens; g++) {
            const y = state.layout === 'organic' ? g * CFG.genHeight : g * CFG.ringHeight;
            const r = state.layout === 'organic' ? CFG.genRadius(g) : CFG.ringRadius(g);
            const m = new THREE.Mesh(new THREE.TorusGeometry(r, .022, 6, 96),
                new THREE.MeshBasicMaterial({ color: new THREE.Color(CFG.genColors[g % CFG.genColors.length]), transparent: true, opacity: .28 }));
            m.rotation.x = Math.PI / 2; m.position.y = y; ringGroup.add(m);
        }
        ringGroup.visible = state.showRings;
    }

    /* grow-in animation: branches draw from root outward, nodes pop */
    function introGrow() {
        const byGen = {};
        state.nodes.forEach(n => (byGen[n.gen] = byGen[n.gen] || []).push(n));
        const tl = gsap.timeline();
        Object.keys(byGen).map(Number).sort((a, b) => a - b).forEach(g => {
            byGen[g].forEach(n => {
                if (n.gen === 0) return;
                const total = n.photo.geometry.index === null ? 1e9 : n.photo.geometry.index.count; // not used (circle has no tube draw)
            });
        });
        // drawRange on branch tubes, staggered by generation
        treeGroup.children.forEach(mesh => {
            if (!mesh.geometry.index) return;
            const total = mesh.geometry.index.count;
            mesh.geometry.setDrawRange(0, 0);
            const personId = mesh === treeGroup.children[0] ? null : null;
        });
        // simpler robust approach: scale-in nodes by generation + branch opacity wipe
        treeGroup.userData.barkMat.opacity = 0;
        tl.to(treeGroup.userData.barkMat, { opacity: 1, duration: .9, ease: 'power1.out' }, 0);
        Object.keys(byGen).map(Number).sort((a, b) => a - b).forEach((g, gi) => {
            tl.fromTo(byGen[g].map(n => n.group), { scale: 0 }, { scale: 1, duration: .55, stagger: .04, ease: 'back.out(2.2)' }, .12 + gi * .34);
        });
    }

    function disposeTree() {
        state.highlightTweens.forEach(t => t.kill()); state.highlightTweens = [];
        state.highlight = [];
        state.nodes.forEach(n => { if (n.label && n.label.element) n.label.element.remove(); });
        state.nodes = []; state.nodeById.clear();
        treeGroup.traverse(o => { if (o.geometry) o.geometry.dispose(); });
        if (treeGroup.userData.barkMat) { treeGroup.userData.barkMat.dispose(); treeGroup.userData.barkMat = null; }
        while (treeGroup.children.length) treeGroup.remove(treeGroup.children[0]);
    }

    /* ---------- selection, fly-to, path highlight ---------- */
    const raycaster = new THREE.Raycaster(), pointer = new THREE.Vector2();
    function ndc(e) {
        pointer.x = (e.clientX / innerWidth) * 2 - 1; pointer.y = -(e.clientY / innerHeight) * 2 + 1;
    }
    function pick(e) {
        ndc(e); raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(state.nodes.map(n => n.photo), false)[0];
        return hit ? state.nodeById.get(hit.object.userData.personId) : null;
    }
    function flyTo(node) {
        const t = node.group.position.clone();
        const dir = camera.position.clone().sub(t).normalize();
        gsap.to(camera.position, { x: t.x + dir.x * 9, y: t.y + dir.y * 9 + 2, z: t.z + dir.z * 9, duration: 1.3, ease: 'power3.inOut' });
        gsap.to(controls.target, { x: t.x, y: t.y, z: t.z, duration: 1.3, ease: 'power3.inOut' });
    }
    function highlightPath(node) {
        clearHighlight(false);
        let n = node; const chain = [];
        while (n) { chain.push(n); n = n.parent; }
        state.highlight = chain;
        // glow tubes along the path
        chain.forEach(c => {
            if (!c.curveToParent || c.gen === 0) return;
            const geo = new THREE.TubeGeometry(c.curveToParent, 16, c.branchRadius * 1.35, 6, false);
            const mat = new THREE.MeshBasicMaterial({ color: 0xD4A24C, transparent: true, opacity: .5, blending: THREE.AdditiveBlending, depthWrite: false });
            const m = new THREE.Mesh(geo, mat); treeGroup.add(m); state.highlight.push(m);
            state.highlightTweens.push(gsap.to(mat, { opacity: .12, duration: .8, repeat: -1, yoyo: true, ease: 'sine.inOut' }));
        });
        // dim non-path nodes
        state.nodes.forEach(nd => {
            const on = chain.indexOf(nd) > -1;
            gsap.to([nd.photo.material, nd.ring.material], { opacity: on ? 1 : .14, duration: .5 });
            gsap.to(nd.glow.material, { opacity: on ? (nd.person.death_year ? .3 : .85) : .04, duration: .5 });
            nd.label.element.classList.toggle('dim', !on);
        });
    }
    function clearHighlight(restore) {
        state.highlightTweens.forEach(t => t.kill()); state.highlightTweens = [];
        state.highlight.forEach(m => { if (m.geometry) m.geometry.dispose(); if (m.material) m.material.dispose(); treeGroup.remove(m); });
        state.highlight = [];
        if (restore !== false) state.nodes.forEach(nd => {
            gsap.to([nd.photo.material, nd.ring.material], { opacity: nd.person.death_year ? .9 : 1, duration: .4 });
            gsap.to(nd.glow.material, { opacity: nd.person.death_year ? .18 : .5, duration: .4 });
            nd.label.element.classList.remove('dim');
        });
    }
    function select(node, fromPanel) {
        state.selected = node;
        flyTo(node); highlightPath(node); openPanel(node);
    }
    function resetView() {
        state.selected = null; clearHighlight(); closePanel();
        gsap.to(camera.position, { x: CFG.camHome.pos.x, y: CFG.camHome.pos.y, z: CFG.camHome.pos.z, duration: 1.4, ease: 'power3.inOut' });
        gsap.to(controls.target, { x: CFG.camHome.tgt.x, y: CFG.camHome.tgt.y, z: CFG.camHome.tgt.z, duration: 1.4, ease: 'power3.inOut' });
    }

    /* ---------- side panel ---------- */
    const panel = qs('#tree-panel');
    function openPanel(node) {
        const p = node.person, kids = state.childrenOf.get(p.id) || [];
        panel.innerHTML =
            '<div class="p-6 md:p-8">' +
            '<div class="flex items-start justify-between gap-4 mb-6">' +
            '<div class="arch w-24 h-32 shrink-0 overflow-hidden border-2 border-gold-500/70"><img src="' + (p.photo || avatarDataUrl(p)) + '" alt="' + U.escapeHtml(p.first_name + ' ' + p.last_name) + '" class="w-full h-full object-cover"></div>' +
            '<button id="panel-close" class="tree-tool" aria-label="بستن پنل"><svg width="15" height="15" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
            '<span class="text-xs px-2.5 py-0.5 rounded-full border ' + (p.gender === 'f' ? 'text-mulberry-300 border-mulberry-300/40' : 'text-gold-500 border-gold-500/40') + '">نسل ' + U.toFa(node.gen + 1) + '</span>' +
            '<h2 class="font-display text-3xl mt-3">' + p.first_name + ' ' + p.last_name + '</h2>' +
            '<p class="text-gold-500 text-sm mt-1">' + faYears(p) + '</p>' +
            (p.spouse_name ? '<p class="text-cream-100/70 text-sm mt-2">همسر: ' + p.spouse_name + '</p>' : '') +
            (p.short_bio ? '<p class="text-cream-100/75 text-sm leading-8 mt-4">' + p.short_bio + '</p>' : '') +
            '<div class="grid grid-cols-2 gap-3 my-6">' +
            '<div class="bg-black/25 rounded-2xl p-4 text-center"><b class="font-display text-2xl text-gold-500">' + U.toFa(kids.length) + '</b><span class="block text-xs text-cream-100/60 mt-1">فرزند</span></div>' +
            '<div class="bg-black/25 rounded-2xl p-4 text-center"><b class="font-display text-2xl text-mulberry-300">' + U.toFa(descendantsOf(p.id)) + '</b><span class="block text-xs text-cream-100/60 mt-1">فرزند و نوه</span></div></div>' +
            (kids.length ? '<h3 class="font-display text-xl mb-3">فرزندان</h3><div class="flex flex-wrap gap-2 mb-6">' +
                kids.map(k => '<button class="chip !text-cream-100 !border-mulberry-300/40 !bg-black/25 hover:!bg-mulberry-500" data-child="' + k.id + '">' + k.first_name + '</button>').join('') + '</div>' : '') +
            '<div class="space-y-3">' +
            (p.elder_slug ? '<a href="elder.html?slug=' + p.elder_slug + '" class="btn-primary w-full justify-center">مشاهده صفحه کامل</a>' : '') +
            '<button id="panel-reset" class="btn-ghost on-dark w-full justify-center">بازگشت به نمای کلی</button></div></div>';
        panel.setAttribute('aria-hidden', 'false');
        gsap.to(panel, { x: 0, duration: .6, ease: 'power3.out' });
        panel.querySelectorAll('[data-child]').forEach(b => b.addEventListener('click', () => select(state.nodeById.get(+b.dataset.child))));
        panel.querySelector('#panel-close').addEventListener('click', closePanel);
        panel.querySelector('#panel-reset').addEventListener('click', resetView);
        panel.querySelector('#panel-close').focus();
    }
    function closePanel() {
        panel.setAttribute('aria-hidden', 'true');
        gsap.to(panel, { x: '105%', duration: .45, ease: 'power3.in' });
    }
    function avatarDataUrl(p) {
        const c = document.createElement('canvas'); c.width = c.height = 96; const x = c.getContext('2d');
        x.fillStyle = p.gender === 'f' ? '#5A1A3F' : '#1F4D2B'; x.fillRect(0, 0, 96, 96);
        x.fillStyle = '#FBF6EC'; x.font = '900 48px Vazirmatn,sans-serif'; x.textAlign = 'center'; x.textBaseline = 'middle'; x.fillText(p.first_name.charAt(0), 48, 54);
        return c.toDataURL();
    }

    /* ---------- family selector ---------- */
    function buildFamilyChips() {
        const wrap = qs('#family-chips');
        if (state.roots.length < 2) { wrap.remove(); return; }
        const chips = [{ id: 0, label: 'همه خانواده‌ها' }].concat(state.roots.map(r => ({ id: r.id, label: 'خانواده ' + r.last_name })));
        wrap.innerHTML = chips.map((c, i) =>
            '<button class="tree-tool !w-auto !px-4 !text-sm !rounded-full ' + (i === 0 ? 'on' : '') + '" data-family="' + c.id + '">' + c.label + '</button>').join('');
        wrap.querySelectorAll('[data-family]').forEach(b => b.addEventListener('click', () => {
            wrap.querySelectorAll('[data-family]').forEach(x => x.classList.remove('on'));
            b.classList.add('on');
            const id = +b.dataset.family;
            const roots = id === 0 ? state.roots.map(r => r.id) : [id];
            resetView();
            buildTree(roots, true);
            buildLegend();
        }));
    }

    /* ---------- legend ---------- */
    function buildLegend() {
        const el = qs('#legend');
        const gens = Math.max(...state.nodes.map(n => n.gen));
        el.innerHTML = Array.from({ length: gens + 1 }, (_, g) =>
            '<button class="legend-item" data-gen="' + g + '"><span class="w-3 h-3 rounded-full shrink-0" style="background:' + CFG.genColors[g % CFG.genColors.length] + '"></span>نسل ' + U.toFa(g + 1) + '</button>').join('');
        el.querySelectorAll('[data-gen]').forEach(b => {
            const g = +b.dataset.gen;
            b.addEventListener('mouseenter', () => focusGen(g, true));
            b.addEventListener('mouseleave', () => focusGen(g, false));
            b.addEventListener('focus', () => focusGen(g, true));
            b.addEventListener('blur', () => focusGen(g, false));
        });
    }
    function focusGen(g, on) {
        state.nodes.forEach(nd => {
            const match = nd.gen === g;
            gsap.to([nd.photo.material, nd.ring.material], { opacity: (on && !match) ? .12 : (nd.person.death_year ? .9 : 1), duration: .35 });
            nd.label.element.classList.toggle('dim', on && !match);
        });
    }

    /* ---------- search ---------- */
    const search = qs('#tree-search'), results = qs('#search-results');
    search.addEventListener('input', U.debounce(() => {
        const q = search.value.trim().replace(/ي/g, 'ی').replace(/ك/g, 'ک');
        if (!q) { results.classList.add('hidden'); return; }
        const matches = state.people.filter(p => (p.first_name + ' ' + p.last_name).indexOf(q) > -1).slice(0, 8);
        results.innerHTML = matches.length ? matches.map(p =>
            '<button class="w-full text-right px-4 py-2.5 text-sm hover:bg-mulberry-500/40 transition-colors flex items-center gap-2" data-pid="' + p.id + '">' +
            '<span class="w-2 h-2 rounded-full ' + (p.gender === 'f' ? 'bg-mulberry-300' : 'bg-gold-500') + '"></span>' +
            p.first_name + ' ' + p.last_name + '<span class="text-xs text-cream-100/40 mr-auto">نسل ' + U.toFa(genOf(p, state.byId) + 1) + '</span></button>').join('')
            : '<p class="px-4 py-3 text-sm text-cream-100/50">کسی با این نام نیست.</p>';
        results.classList.remove('hidden');
        results.querySelectorAll('[data-pid]').forEach(b => b.addEventListener('click', () => {
            const node = state.nodeById.get(+b.dataset.pid);
            results.classList.add('hidden'); search.value = '';
            if (node) select(node);
        }));
    }, 160));
    document.addEventListener('click', e => { if (!e.target.closest('#tree-search-wrap')) results.classList.add('hidden'); });

    /* ---------- toolbar ---------- */
    document.querySelectorAll('[data-action]').forEach(b => {
        b.addEventListener('click', () => {
            const a = b.dataset.action;
            if (a === 'reset') resetView();
            if (a === 'rotate') { state.wantAutoRotate = !state.wantAutoRotate; b.classList.toggle('on', state.wantAutoRotate); controls.autoRotate = state.wantAutoRotate; }
            if (a === 'labels') { state.showLabels = !state.showLabels; b.classList.toggle('on', state.showLabels); }
            if (a === 'rings') { state.showRings = !state.showRings; b.classList.toggle('on', state.showRings); ringGroup.visible = state.showRings; }
            if (a === 'layout') switchLayout();
            if (a === 'fullscreen') { document.fullscreenElement ? document.exitFullscreen() : qs('main').requestFullscreen && qs('main').requestFullscreen(); }
        });
    });
    function switchLayout() {
        state.layout = state.layout === 'organic' ? 'rings' : 'organic';
        const visible = state.people.filter(p => state.visibleRoots.includes(rootIdOf(p)));
        const pos = state.layout === 'organic' ? layoutOrganic(visible.filter(p => p.parent_id === null), state.childrenOf, state.byId) : layoutRings(visible);
        const bm = treeGroup.userData.barkMat;
        gsap.to(bm, {
            opacity: 0, duration: .3, onComplete: () => {
                // rebuild branch geometry for the new positions
                treeGroup.children.slice().forEach(mesh => { if (mesh.geometry) { mesh.geometry.dispose(); treeGroup.remove(mesh); } });
                visible.forEach(p => {
                    if (p.parent_id === null) return;
                    const A = pos.get(p.parent_id), B = pos.get(p.id), g = genOf(p, state.byId);
                    const mid = A.clone().lerp(B, .5); mid.y += state.layout === 'organic' ? .55 : .25;
                    const curve = new THREE.CatmullRomCurve3([A.clone().add(new THREE.Vector3(0, .45, 0)), mid, B.clone().add(new THREE.Vector3(0, -.55, 0))]);
                    const node = state.nodeById.get(p.id); node.curveToParent = curve;
                    treeGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 14, Math.max(.05, .3 * Math.pow(.7, g - 1)), 6, false), bm));
                });
                gsap.to(bm, { opacity: 1, duration: .5, delay: .6 });
            }
        });
        state.nodes.forEach(n => gsap.to(n.group.position, { x: pos.get(n.person.id).x, y: pos.get(n.person.id).y, z: pos.get(n.person.id).z, duration: 1.1, ease: 'power2.inOut', stagger: .006 }));
        if (state.selected) setTimeout(() => highlightPath(state.selected), 1200);
        setTimeout(buildGuides, 1150);
    }

    /* ---------- pointer interaction ---------- */
    const tipEl = document.createElement('div'); tipEl.className = 'tree-tooltip';
    const tip = new CSS2DObject(tipEl);
    renderer.domElement.addEventListener('pointermove', e => {
        const n = pick(e);
        if (n !== state.hovered) {
            if (state.hovered) gsap.to(state.hovered.group.scale, { x: 1, y: 1, z: 1, duration: .35, ease: 'power2.out' });
            state.hovered = n;
            renderer.domElement.style.cursor = n ? 'pointer' : '';
            if (n) {
                gsap.to(n.group.scale, { x: 1.3, y: 1.3, z: 1.3, duration: .35, ease: 'back.out(2)' });
                gsap.to(n.glow.material, { opacity: .95, duration: .3 });
                tipEl.innerHTML = '<b>' + n.person.first_name + ' ' + n.person.last_name + '</b><br>' + faYears(n.person);
                n.face.add(tip);
            } else if (tip.parent) tip.parent.remove(tip);
        }
    });
    renderer.domElement.addEventListener('pointerdown', e => { state._downAt = { x: e.clientX, y: e.clientY }; });
    renderer.domElement.addEventListener('pointerup', e => {
        // treat as click only when the pointer barely moved (avoid orbit drags)
        const d = state._downAt; if (!d) return;
        if (Math.hypot(e.clientX - d.x, e.clientY - d.y) > 6) return;
        const n = pick(e);
        if (n) select(n); else if (state.selected) { state.selected = null; clearHighlight(); closePanel(); }
    });
    document.addEventListener('keydown', e => { if (e.key === 'Escape' && state.selected) { state.selected = null; clearHighlight(); closePanel(); } });

    // auto-rotate: stop on interaction, resume after idle
    let idleT = null;
    controls.addEventListener('start', () => { controls.autoRotate = false; clearTimeout(idleT); });
    controls.addEventListener('end', () => { clearTimeout(idleT); idleT = setTimeout(() => { controls.autoRotate = state.wantAutoRotate; }, 4000); });

    /* ---------- hint overlay ---------- */
    const hint = qs('#tree-hint');
    if (localStorage.getItem('treeHintSeen')) hint.remove();
    else {
        const dismiss = () => { localStorage.setItem('treeHintSeen', '1'); hint.style.opacity = '0'; setTimeout(() => hint.remove(), 700); };
        hint.querySelector('#hint-ok').addEventListener('click', dismiss);
        setTimeout(dismiss, 7000);
    }

    /* ---------- render loop (paused when hidden/offscreen) ---------- */
    let raf = null;
    function running() { return state.running && !document.hidden; }
    new IntersectionObserver(es => { state.running = es[0].isIntersecting; }, { threshold: .02 }).observe(renderer.domElement);
    const clock = new THREE.Clock();
    function frame() {
        raf = requestAnimationFrame(frame);
        if (!running()) return;
        const t = clock.getElapsedTime();
        controls.update();
        state.nodes.forEach(n => {
            n.face.lookAt(camera.position); // billboard portraits
            n.label.visible = state.showLabels && camera.position.distanceTo(n.group.position) < 46; // label LOD
        });
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
    }
    frame();

    /* ---------- resize (throttled) ---------- */
    addEventListener('resize', U.debounce(() => {
        camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
        renderer.setSize(innerWidth, innerHeight); labelRenderer.setSize(innerWidth, innerHeight);
    }, 120));

    /* ---------- boot the tree + deep-linking ---------- */
    buildFamilyChips();
    buildTree(state.roots.map(r => r.id), true);
    buildLegend();
    const deepId = U.getQuery('person');
    if (deepId) setTimeout(() => { const n = state.nodeById.get(+deepId); if (n) select(n); }, 1400);

    /* ---------- full disposal ---------- */
    addEventListener('pagehide', () => {
        state.disposed = true; cancelAnimationFrame(raf);
        scene.traverse(o => {
            if (o.geometry) o.geometry.dispose();
            if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach(m => { if (m.map) m.map.dispose(); m.dispose(); });
        });
        state.nodes.forEach(n => n.label.element && n.label.element.remove());
        renderer.dispose(); controls.dispose();
    }, { once: true });
}

function webglOK() {
    try { const c = document.createElement('canvas'); return !!(c.getContext('webgl2') || c.getContext('webgl')); } catch (e) { return false; }
}

init().catch(err => { console.error('[family-tree]', err); window.__showTreeFallback && window.__showTreeFallback(); });