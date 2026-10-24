import gsap from 'gsap';
import * as THREE from 'three';
import {OrbitControls} from 'three/addons/controls/OrbitControls.js';
import {CSS2DObject, CSS2DRenderer} from 'three/addons/renderers/CSS2DRenderer.js';
import {listen, onCleanup} from '../lib/lifecycle';
import {debounce, escapeHtml, getQuery, qs, qsa, reduced, toFa} from '../lib/utils';

const CFG = {
    dprCap: 2,
    genHeight: 3.1, // ارتفاع هر نسل
    genRadius: (g) => 6.0 * Math.pow(g, 0.92), // شعاع هر نسل در آرایش ارگانیک
    ringRadius: (g) => 2.2 + g * 4.9, // شعاع هر نسل در آرایش حلقه‌ای
    ringHeight: 1.35,
    nodeSize: 0.8,
    fireflies: 900,
    camHome: {pos: new THREE.Vector3(17, 11, 21), tgt: new THREE.Vector3(0, 6, 0)},
    colors: {male: 0xd4a24c, female: 0xc26a97, bark: 0x3a2818},
    genColors: ['#D4A24C', '#8BC17A', '#3E8E41', '#C26A97', '#8E2C63', '#5A1A3F', '#2B0A1F'],
};

/* ---------- ابزارهای کمکی ---------- */
function webglOK() {
    try {
        const c = document.createElement('canvas');
        return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch (e) {
        return false;
    }
}

function glowTexture(hex) {
    const c = document.createElement('canvas');
    c.width = c.height = 128;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(64, 64, 4, 64, 64, 64);
    g.addColorStop(0, hex);
    g.addColorStop(0.35, hex.replace(/[\d.]+\)$/, '.35)'));
    g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
}

/** دیسک تیره‌ی زمین با حلقه‌های کم‌نور */
function groundTexture() {
    const c = document.createElement('canvas');
    c.width = c.height = 512;
    const x = c.getContext('2d');
    x.fillStyle = '#100718';
    x.beginPath();
    x.arc(256, 256, 256, 0, 7);
    x.fill();
    for (let r = 40; r < 250; r += 34) {
        x.strokeStyle = 'rgba(212,162,76,' + 0.16 * (r / 250) + ')';
        x.lineWidth = 1.6;
        x.beginPath();
        x.arc(256, 256, r, 0, 7);
        x.stroke();
    }
    const g = x.createRadialGradient(256, 256, 0, 256, 256, 90);
    g.addColorStop(0, 'rgba(142,44,99,.5)');
    g.addColorStop(1, 'rgba(142,44,99,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 512, 512);
    return new THREE.CanvasTexture(c);
}

/** نام کامل روی آواتار؛ اندازه‌ی فونت به‌اندازه‌ی نام کوچک می‌شود */
function drawAvatarName(x, p, size) {
    const name = `${p.first_name} ${p.last_name}`.trim();
    const maxW = size * 0.82;
    let fs = Math.round(size * 0.3);
    x.font = `900 ${fs}px Vazirmatn, sans-serif`;
    while (fs > 10 && x.measureText(name).width > maxW) {
        fs -= 2;
        x.font = `900 ${fs}px Vazirmatn, sans-serif`;
    }
    x.fillStyle = '#FBF6EC';
    x.textAlign = 'center';
    x.textBaseline = 'middle';
    x.fillText(name, size / 2, size / 2 + fs * 0.06);
}

function avatarTexture(p) {
    const c = document.createElement('canvas');
    c.width = c.height = 256;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 256, 256);
    g.addColorStop(0, p.gender === 'f' ? '#5A1A3F' : '#1F4D2B');
    g.addColorStop(1, p.gender === 'f' ? '#8E2C63' : '#3E8E41');
    x.fillStyle = g;
    x.fillRect(0, 0, 256, 256);
    drawAvatarName(x, p, 256);
    return new THREE.CanvasTexture(c);
}

function avatarDataUrl(p) {
    const c = document.createElement('canvas');
    c.width = c.height = 96;
    const x = c.getContext('2d');
    x.fillStyle = p.gender === 'f' ? '#5A1A3F' : '#1F4D2B';
    x.fillRect(0, 0, 96, 96);
    drawAvatarName(x, p, 96);
    return c.toDataURL();
}

function faYears(p) {
    const born = p.birth_year ? toFa(p.birth_year) : '';
    if (p.death_year) return (born ? born + '–' : '') + toFa(p.death_year);
    return born ? born + ' — در قید حیات' : '';
}

const fullName = (p) => `${p.first_name} ${p.last_name}`.trim();

/* ---------- محاسبات چیدمان ---------- */
function countLeaves(p, childrenOf) {
    const kids = childrenOf.get(p.id) || [];
    return kids.length ? kids.reduce((s, k) => s + countLeaves(k, childrenOf), 0) : 1;
}

/** با محافظ در برابر چرخه (مثلاً دو نفر که پدر هم‌دیگرند) */
function genOf(p, byId) {
    let g = 0;
    let c = p;
    while (c.parent_id != null && g < 60) {
        c = byId.get(c.parent_id);
        if (!c) break;
        g++;
    }
    return g;
}

/** شناسه‌ی ریشه‌ی یک فرد؛ برای داده‌ی دارای چرخه null است */
function rootIdOf(p, byId) {
    let c = p;
    for (let i = 0; i < 60; i++) {
        if (c.parent_id == null) return c.id;
        c = byId.get(c.parent_id);
        if (!c) return null;
    }
    return null;
}

/** درخت ارگانیک شعاعی: هر ریشه به‌اندازه‌ی تعداد برگ‌هایش از دایره سهم می‌گیرد */
function layoutOrganic(roots, childrenOf, byId) {
    const pos = new Map();
    const weights = roots.map((r) => countLeaves(r, childrenOf));
    const total = weights.reduce((a, b) => a + b, 0) || 1;
    // ریشه‌ها روی یک دایره‌ی کوچک می‌نشینند تا روی هم نیفتند
    const rootRadius = roots.length > 1 ? Math.min(1.6 + roots.length * 0.5, 4.5) : 0;

    function assign(p, s0, s1) {
        const kids = childrenOf.get(p.id) || [];
        const kidLeaves = kids.map((k) => countLeaves(k, childrenOf));
        const sum = kidLeaves.reduce((a, b) => a + b, 0) || 1;
        let acc = s0;

        kids.forEach((k, i) => {
            const w = (kidLeaves[i] / sum) * (s1 - s0);
            assign(k, acc, acc + w);
            acc += w;
        });

        const mid = (s0 + s1) / 2;
        const g = genOf(p, byId);
        const r = g === 0 ? rootRadius : CFG.genRadius(g);
        pos.set(p.id, new THREE.Vector3(Math.cos(mid) * r, g * CFG.genHeight, Math.sin(mid) * r));
    }

    let a0 = Math.PI / 2;
    roots.forEach((root, i) => {
        const sector = (weights[i] / total) * Math.PI * 2;
        assign(root, a0, a0 + sector);
        a0 += sector;
    });

    return pos;
}

/** حلقه‌های تخت: هر نسل یکنواخت روی یک حلقه */
function layoutRings(people, byId) {
    const pos = new Map();
    const byGen = new Map();

    people.forEach((p) => {
        const g = genOf(p, byId);
        if (!byGen.has(g)) byGen.set(g, []);
        byGen.get(g).push(p);
    });

    byGen.forEach((arr, g) => {
        arr.forEach((p, i) => {
            const a = (i / arr.length) * Math.PI * 2 + g * 0.4;
            pos.set(
                p.id,
                new THREE.Vector3(
                    Math.cos(a) * CFG.ringRadius(g),
                    g * CFG.ringHeight,
                    Math.sin(a) * CFG.ringRadius(g)
                )
            );
        });
    });

    return pos;
}

/* ---------- جایگزین فهرستی ---------- */
function showFallback(people) {
    const wrap = qs('#tree-fallback');
    const list = qs('#tree-fallback-list');
    if (!wrap || !list) return;

    const hint = qs('#tree-hint');
    if (hint) hint.remove();

    wrap.classList.remove('hidden');

    const ids = new Set(people.map((p) => p.id));
    const byParent = new Map();
    people.forEach((p) => {
        const key = p.parent_id != null && ids.has(p.parent_id) ? p.parent_id : null;
        if (!byParent.has(key)) byParent.set(key, []);
        byParent.get(key).push(p);
    });

    function node(p, depth) {
        if (depth > 40) return '';
        const years = faYears(p);
        const kids = byParent.get(p.id) || [];

        return (
            `<details ${depth < 2 ? 'open' : ''} class="bg-mulberry-900/50 border border-mulberry-300/20 rounded-xl">` +
            '<summary class="p-3 cursor-pointer hover:bg-mulberry-700/40 transition-colors rounded-xl flex items-center gap-2">' +
            `<span class="w-2.5 h-2.5 rounded-full ${p.gender === 'f' ? 'bg-mulberry-300' : 'bg-gold-500'}"></span>` +
            `<b>${escapeHtml(fullName(p))}</b>` +
            (years ? `<span class="text-xs text-cream-100/50">${years}</span>` : '') +
            (p.death_year
                ? '<span class="text-[10px] border border-cream-100/30 rounded px-1">درگذشته</span>'
                : '') +
            '</summary>' +
            '<div class="px-4 pb-3 text-xs text-cream-100/60 leading-7">' +
            escapeHtml(p.short_bio || '') +
            (p.spouse_name ? ' — همسر: ' + escapeHtml(p.spouse_name) : '') +
            '</div>' +
            (kids.length
                ? `<div class="pr-5 pb-3 space-y-2">${kids.map((k) => node(k, depth + 1)).join('')}</div>`
                : '') +
            '</details>'
        );
    }

    list.innerHTML = (byParent.get(null) || []).map((r) => node(r, 0)).join('');
}

/* ================= راه‌اندازی صفحه ================= */
export async function initFamilyTree() {
    const stage = qs('#tree-stage');
    const dataEl = qs('#tree-data');
    if (!stage || !dataEl) return;

    let people = [];
    try {
        people = JSON.parse(dataEl.textContent);
    } catch (e) {
        people = [];
    }

    let disposed = false;
    onCleanup(() => {
        disposed = true;
    });

    if (!people.length) {
        const hint = qs('#tree-hint');
        if (hint) hint.remove();
        const empty = qs('#tree-empty');
        if (empty) empty.classList.remove('hidden');
        return;
    }

    if (!webglOK()) {
        showFallback(people);
        return;
    }

    try {
        await run(people, stage, () => disposed);
    } catch (err) {
        console.error('[family-tree]', err);
        showFallback(people);
    }
}

async function run(people, stage, isDisposed) {
    // انتظار برای فونت (آواتارها از آن استفاده می‌کنند)، با مهلت کوتاه
    await Promise.race([
        document.fonts ? document.fonts.load('900 24px Vazirmatn') : Promise.resolve(),
        new Promise((r) => setTimeout(r, 900)),
    ]).catch(() => {
    });
    if (isDisposed()) return;

    /* --- داده --- */
    const byId = new Map(people.map((p) => [p.id, p]));
    // اگر والدی در فهرست نبود، فرد ریشه حساب می‌شود
    people.forEach((p) => {
        if (p.parent_id != null && !byId.has(p.parent_id)) p.parent_id = null;
    });

    const childrenOf = new Map(people.map((p) => [p.id, []])); // فرزندان در درخت (از سمت پدر)
    const realChildrenOf = new Map(people.map((p) => [p.id, []])); // همه‌ی فرزندان (پدر یا مادر)
    people.forEach((p) => {
        if (p.parent_id != null) childrenOf.get(p.parent_id).push(p);
        if (p.father_id != null && realChildrenOf.has(p.father_id)) realChildrenOf.get(p.father_id).push(p);
        if (p.mother_id != null && realChildrenOf.has(p.mother_id)) realChildrenOf.get(p.mother_id).push(p);
    });

    const rootIdMap = new Map(people.map((p) => [p.id, rootIdOf(p, byId)]));
    const roots = people.filter((p) => p.parent_id == null);
    const familyRoots = roots.filter((r) => childrenOf.get(r.id).length > 0);

    function descendantsOf(id) {
        const seen = new Set([id]);
        const queue = [id];
        let count = 0;
        while (queue.length) {
            const cur = queue.shift();
            (realChildrenOf.get(cur) || []).forEach((k) => {
                if (!seen.has(k.id)) {
                    seen.add(k.id);
                    count++;
                    queue.push(k.id);
                }
            });
        }
        return count;
    }

    const state = {
        layout: 'organic',
        selected: null,
        hovered: null,
        wantAutoRotate: true,
        showLabels: true,
        showRings: false,
        running: true,
        nodes: [],
        nodeById: new Map(),
        visibleRoots: roots.map((r) => r.id),
        highlight: [],
        highlightTweens: [],
    };

    /* --- هسته‌ی three.js --- */
    const renderer = new THREE.WebGLRenderer({antialias: true});
    renderer.setPixelRatio(Math.min(devicePixelRatio, CFG.dprCap));
    renderer.setSize(innerWidth, innerHeight);
    stage.appendChild(renderer.domElement);

    const labelRenderer = new CSS2DRenderer();
    labelRenderer.setSize(innerWidth, innerHeight);
    labelRenderer.domElement.style.cssText = 'position:absolute;inset:0;pointer-events:none;';
    stage.appendChild(labelRenderer.domElement);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x180b26, 0.014);

    const camera = new THREE.PerspectiveCamera(48, innerWidth / innerHeight, 0.1, 300);
    camera.position.copy(CFG.camHome.pos);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.copy(CFG.camHome.tgt);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.minDistance = 4;
    controls.maxDistance = 70;
    controls.maxPolarAngle = Math.PI * 0.62;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.55;

    // آسمان شب
    const skyCanvas = document.createElement('canvas');
    skyCanvas.width = 8;
    skyCanvas.height = 256;
    const sx = skyCanvas.getContext('2d');
    const sg = sx.createLinearGradient(0, 0, 0, 256);
    ['#0a0512', '#160a24', '#2B0A1F', '#3d1440'].forEach((s, i) => sg.addColorStop(i / 3, s));
    sx.fillStyle = sg;
    sx.fillRect(0, 0, 8, 256);
    const skyTex = new THREE.CanvasTexture(skyCanvas);
    skyTex.colorSpace = THREE.SRGBColorSpace;
    scene.add(
        new THREE.Mesh(
            new THREE.SphereGeometry(140, 24, 16),
            new THREE.MeshBasicMaterial({map: skyTex, side: THREE.BackSide, fog: false})
        )
    );

    // زمین
    const ground = new THREE.Mesh(
        new THREE.CircleGeometry(34, 64),
        new THREE.MeshBasicMaterial({map: groundTexture()})
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -1.5;
    scene.add(ground);

    // کرم‌های شب‌تاب
    const ffGeo = new THREE.BufferGeometry();
    const ffArr = new Float32Array(CFG.fireflies * 3);
    for (let i = 0; i < CFG.fireflies; i++) {
        const a = Math.random() * Math.PI * 2;
        const r = Math.random() * 30;
        ffArr[i * 3] = Math.cos(a) * r;
        ffArr[i * 3 + 1] = Math.random() * 22 - 1;
        ffArr[i * 3 + 2] = Math.sin(a) * r;
    }
    ffGeo.setAttribute('position', new THREE.BufferAttribute(ffArr, 3));
    scene.add(
        new THREE.Points(
            ffGeo,
            new THREE.PointsMaterial({
                size: 0.17,
                map: glowTexture('rgba(212,162,76,.95)'),
                transparent: true,
                opacity: 0.8,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            })
        )
    );

    // نورها
    scene.add(new THREE.AmbientLight(0x5a2a66, 1.5));
    const p1 = new THREE.PointLight(0x8e2c63, 260, 0, 1.9);
    p1.position.set(0, 16, 0);
    scene.add(p1);
    const p2 = new THREE.PointLight(0xd4a24c, 90, 0, 2);
    p2.position.set(8, 2, 8);
    scene.add(p2);

    const treeGroup = new THREE.Group();
    scene.add(treeGroup);
    const ringGroup = new THREE.Group();
    ringGroup.visible = false;
    scene.add(ringGroup);

    // بافت درخشش (برای همه‌ی گره‌ها مشترک)
    const glowMale = glowTexture('rgba(212,162,76,.55)');
    const glowFemale = glowTexture('rgba(194,106,151,.55)');

    /* ---------- ساخت درخت ---------- */
    function visiblePeople(rootIds) {
        return people.filter((p) => rootIds.includes(rootIdMap.get(p.id)));
    }

    function computePositions(visible) {
        const visibleRoots = visible.filter((p) => p.parent_id == null);
        return state.layout === 'organic'
            ? layoutOrganic(visibleRoots, childrenOf, byId)
            : layoutRings(visible, byId);
    }

    function buildTree(rootIds, animateIntro) {
        disposeTree();

        const visible = visiblePeople(rootIds);
        state.visibleRoots = rootIds;

        const posMap = computePositions(visible);
        const barkMat = new THREE.MeshStandardMaterial({
            color: CFG.colors.bark,
            roughness: 0.95,
            transparent: true,
            opacity: 1,
        });
        treeGroup.userData.barkMat = barkMat;

        visible.forEach((p) => makeNode(p, posMap.get(p.id)));

        // والد هر گره (بعد از ساخته‌شدن همه‌ی گره‌ها، برای هایلایت مسیر)
        state.nodes.forEach((n) => {
            n.parent = n.person.parent_id != null ? state.nodeById.get(n.person.parent_id) || null : null;
        });

        addBranches(visible, posMap, barkMat);
        buildGuides();

        if (animateIntro && !reduced()) introGrow();
        else state.nodes.forEach((n) => n.group.scale.setScalar(1));
    }

    /** شاخه‌ی هر فرد به والدش، و تنه‌ی کوتاه از زمین تا ریشه‌ها */
    function addBranches(visible, posMap, bm) {
        visible.forEach((p) => {
            const node = state.nodeById.get(p.id);
            const b = posMap.get(p.id);
            if (!node || !b) return;

            if (p.parent_id == null) {
                const curve = new THREE.CatmullRomCurve3([
                    new THREE.Vector3(b.x * 0.3, -1.5, b.z * 0.3),
                    b.clone().add(new THREE.Vector3(0, -0.4, 0)),
                ]);
                treeGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 6, 0.34, 6, false), bm));
                node.curveToParent = curve;
                return;
            }

            const a = posMap.get(p.parent_id);
            if (!a) return;

            const mid = a.clone().lerp(b, 0.5);
            if (state.layout === 'organic') {
                mid.y += 0.55;
                mid.x += (b.x - a.x) * 0.18;
                mid.z += (b.z - a.z) * 0.18;
            } else {
                mid.y += 0.25;
            }

            const curve = new THREE.CatmullRomCurve3([
                a.clone().add(new THREE.Vector3(0, 0.45, 0)),
                mid,
                b.clone().add(new THREE.Vector3(0, -0.55, 0)),
            ]);

            treeGroup.add(new THREE.Mesh(new THREE.TubeGeometry(curve, 14, node.branchRadius, 6, false), bm));
            node.curveToParent = curve;
        });
    }

    function makeNode(p, pos) {
        const g = genOf(p, byId);
        const group = new THREE.Group();
        group.position.copy(pos);
        const face = new THREE.Group(); // هر فریم رو به دوربین می‌چرخد
        group.add(face);

        const dead = !!p.death_year;
        const ringColor = p.gender === 'f' ? CFG.colors.female : CFG.colors.male;

        const photoMat = new THREE.MeshBasicMaterial({map: avatarTexture(p), transparent: true});
        if (dead) photoMat.color.set(0x9d938e); // رنگ ملایم برای درگذشتگان

        const photo = new THREE.Mesh(new THREE.CircleGeometry(CFG.nodeSize, 40), photoMat);
        photo.userData.personId = p.id;

        const ring = new THREE.Mesh(
            new THREE.TorusGeometry(CFG.nodeSize + 0.07, dead ? 0.035 : 0.06, 12, 56),
            new THREE.MeshBasicMaterial({color: ringColor, transparent: true, opacity: dead ? 0.45 : 0.95})
        );

        const glow = new THREE.Sprite(
            new THREE.SpriteMaterial({
                map: p.gender === 'f' ? glowFemale : glowMale,
                transparent: true,
                opacity: dead ? 0.18 : 0.5,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            })
        );
        glow.scale.setScalar(3);
        face.add(glow, photo, ring);

        if (dead) {
            const marker = new THREE.Mesh(
                new THREE.ConeGeometry(0.12, 0.34, 8),
                new THREE.MeshBasicMaterial({color: 0xd4a24c, transparent: true, opacity: 0.8})
            );
            marker.rotation.x = Math.PI;
            marker.position.y = -(CFG.nodeSize + 0.3);
            face.add(marker);
        }

        // برچسب نام
        const labelEl = document.createElement('div');
        labelEl.className = 'tree-label' + (dead ? ' deceased' : '');
        labelEl.textContent = fullName(p);
        const label = new CSS2DObject(labelEl);
        label.position.set(0, CFG.nodeSize + 0.85, 0);
        group.add(label);

        treeGroup.add(group);

        // اگر عکس واقعی هست، جایگزین آواتار می‌شود
        if (p.photo) {
            const loader = new THREE.TextureLoader();
            loader.setCrossOrigin('anonymous');
            loader.load(
                p.photo,
                (t) => {
                    if (isDisposed()) {
                        t.dispose();
                        return;
                    }
                    t.colorSpace = THREE.SRGBColorSpace;
                    photoMat.map.dispose();
                    photoMat.map = t;
                    photoMat.needsUpdate = true;
                },
                undefined,
                () => {
                }
            );
        }

        const branchRadius = p.parent_id == null ? 0.34 : Math.max(0.05, 0.3 * Math.pow(0.7, g - 1));
        const node = {
            person: p,
            gen: g,
            group,
            face,
            photo,
            ring,
            glow,
            label,
            curveToParent: null,
            branchRadius,
            parent: null,
        };

        state.nodes.push(node);
        state.nodeById.set(p.id, node);
        return node;
    }

    /** حلقه‌های راهنمای نسل (با دکمه‌ی نوار ابزار) */
    function buildGuides() {
        while (ringGroup.children.length) {
            const c = ringGroup.children.pop();
            c.geometry.dispose();
            c.material.dispose();
        }

        const gens = state.nodes.length ? Math.max(...state.nodes.map((n) => n.gen)) : 0;
        for (let g = 1; g <= gens; g++) {
            const y = state.layout === 'organic' ? g * CFG.genHeight : g * CFG.ringHeight;
            const r = state.layout === 'organic' ? CFG.genRadius(g) : CFG.ringRadius(g);
            const m = new THREE.Mesh(
                new THREE.TorusGeometry(r, 0.022, 6, 96),
                new THREE.MeshBasicMaterial({
                    color: new THREE.Color(CFG.genColors[g % CFG.genColors.length]),
                    transparent: true,
                    opacity: 0.28,
                })
            );
            m.rotation.x = Math.PI / 2;
            m.position.y = y;
            ringGroup.add(m);
        }
        ringGroup.visible = state.showRings;
    }

    /** انیمیشن رشد: شاخه‌ها محو می‌شوند و گره‌ها نسل‌به‌نسل ظاهر می‌شوند */
    function introGrow() {
        const byGen = {};
        state.nodes.forEach((n) => (byGen[n.gen] = byGen[n.gen] || []).push(n));

        const tl = gsap.timeline();
        treeGroup.userData.barkMat.opacity = 0;
        tl.to(treeGroup.userData.barkMat, {opacity: 1, duration: 0.9, ease: 'power1.out'}, 0);

        Object.keys(byGen)
            .map(Number)
            .sort((a, b) => a - b)
            .forEach((g, gi) => {
                tl.fromTo(
                    byGen[g].map((n) => n.group.scale),
                    {x: 0, y: 0, z: 0},
                    {x: 1, y: 1, z: 1, duration: 0.55, stagger: 0.04, ease: 'back.out(2.2)'},
                    0.12 + gi * 0.34
                );
            });
    }

    function killNodeTweens() {
        state.nodes.forEach((n) => {
            gsap.killTweensOf([
                n.photo.material,
                n.ring.material,
                n.glow.material,
                n.group.scale,
                n.group.position,
            ]);
        });
    }

    function disposeTree() {
        killNodeTweens();
        state.highlightTweens.forEach((t) => t.kill());
        state.highlightTweens = [];
        state.highlight = [];
        state.hovered = null;

        state.nodes.forEach((n) => {
            if (n.label && n.label.element) n.label.element.remove();
        });
        state.nodes = [];
        state.nodeById.clear();

        treeGroup.traverse((o) => {
            if (o.geometry) o.geometry.dispose();
            if (o.material && o.material !== treeGroup.userData.barkMat) {
                if (o.material.map) o.material.map.dispose();
                o.material.dispose();
            }
        });
        if (treeGroup.userData.barkMat) {
            treeGroup.userData.barkMat.dispose();
            treeGroup.userData.barkMat = null;
        }
        while (treeGroup.children.length) treeGroup.remove(treeGroup.children[0]);
    }

    /* ---------- انتخاب، پرواز دوربین، هایلایت مسیر ---------- */
    const raycaster = new THREE.Raycaster();
    const pointer = new THREE.Vector2();

    function pick(e) {
        pointer.x = (e.clientX / innerWidth) * 2 - 1;
        pointer.y = -(e.clientY / innerHeight) * 2 + 1;
        raycaster.setFromCamera(pointer, camera);
        const hit = raycaster.intersectObjects(
            state.nodes.map((n) => n.photo),
            false
        )[0];
        return hit ? state.nodeById.get(hit.object.userData.personId) : null;
    }

    function flyTo(node) {
        const t = node.group.position.clone();
        const dir = camera.position.clone().sub(t).normalize();
        gsap.to(camera.position, {
            x: t.x + dir.x * 9,
            y: t.y + dir.y * 9 + 2,
            z: t.z + dir.z * 9,
            duration: 1.3,
            ease: 'power3.inOut',
        });
        gsap.to(controls.target, {x: t.x, y: t.y, z: t.z, duration: 1.3, ease: 'power3.inOut'});
    }

    function clearHighlight(restore) {
        state.highlightTweens.forEach((t) => t.kill());
        state.highlightTweens = [];
        state.highlight.forEach((m) => {
            if (m.geometry) m.geometry.dispose();
            if (m.material) m.material.dispose();
            treeGroup.remove(m);
        });
        state.highlight = [];

        if (restore !== false) {
            state.nodes.forEach((nd) => {
                gsap.to([nd.photo.material, nd.ring.material], {
                    opacity: nd.person.death_year ? 0.9 : 1,
                    duration: 0.4,
                });
                gsap.to(nd.glow.material, {opacity: nd.person.death_year ? 0.18 : 0.5, duration: 0.4});
                nd.label.element.classList.remove('dim');
            });
        }
    }

    function highlightPath(node) {
        clearHighlight(false);

        const chain = [];
        for (let n = node; n && chain.length < 60; n = n.parent) chain.push(n);

        // لوله‌های درخشان در طول مسیر
        chain.forEach((c) => {
            if (!c.curveToParent || c.gen === 0) return;
            const geo = new THREE.TubeGeometry(c.curveToParent, 16, c.branchRadius * 1.35, 6, false);
            const mat = new THREE.MeshBasicMaterial({
                color: 0xd4a24c,
                transparent: true,
                opacity: 0.5,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
            });
            const m = new THREE.Mesh(geo, mat);
            treeGroup.add(m);
            state.highlight.push(m);
            state.highlightTweens.push(
                gsap.to(mat, {opacity: 0.12, duration: 0.8, repeat: -1, yoyo: true, ease: 'sine.inOut'})
            );
        });

        // کم‌رنگ‌کردن بقیه
        state.nodes.forEach((nd) => {
            const on = chain.includes(nd);
            gsap.to([nd.photo.material, nd.ring.material], {opacity: on ? 1 : 0.14, duration: 0.5});
            gsap.to(nd.glow.material, {
                opacity: on ? (nd.person.death_year ? 0.3 : 0.85) : 0.04,
                duration: 0.5,
            });
            nd.label.element.classList.toggle('dim', !on);
        });
    }

    function select(node) {
        if (!node) return;
        state.selected = node;
        flyTo(node);
        highlightPath(node);
        openPanel(node);
    }

    function deselect() {
        state.selected = null;
        clearHighlight();
        closePanel();
    }

    function resetView() {
        deselect();
        gsap.to(camera.position, {
            x: CFG.camHome.pos.x,
            y: CFG.camHome.pos.y,
            z: CFG.camHome.pos.z,
            duration: 1.4,
            ease: 'power3.inOut',
        });
        gsap.to(controls.target, {
            x: CFG.camHome.tgt.x,
            y: CFG.camHome.tgt.y,
            z: CFG.camHome.tgt.z,
            duration: 1.4,
            ease: 'power3.inOut',
        });
    }

    /* ---------- پنل کناری ---------- */
    const panel = qs('#tree-panel');
    if (panel) gsap.set(panel, {x: '105%'});

    function openPanel(node) {
        if (!panel) return;
        const p = node.person;
        const kids = realChildrenOf.get(p.id) || [];
        const father = p.father_id != null ? byId.get(p.father_id) : null;
        const mother = p.mother_id != null ? byId.get(p.mother_id) : null;

        const chip = (r) =>
            `<button class="chip !text-cream-100 !border-mulberry-300/40 !bg-black/25 hover:!bg-mulberry-500" data-rel="${r.id}">${escapeHtml(fullName(r))}</button>`;

        const parents = [father && ['پدر', father], mother && ['مادر', mother]].filter(Boolean);
        const years = faYears(p);

        panel.innerHTML =
            '<div class="p-6 md:p-8">' +
            '<div class="flex items-start justify-between gap-4 mb-6">' +
            '<div class="arch w-24 h-32 shrink-0 overflow-hidden border-2 border-gold-500/70">' +
            `<img src="${escapeHtml(p.photo || avatarDataUrl(p))}" alt="${escapeHtml(fullName(p))}" class="w-full h-full object-cover"></div>` +
            '<button id="panel-close" class="tree-tool" aria-label="بستن پنل"><svg width="15" height="15" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2" fill="none"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>' +
            `<span class="text-xs px-2.5 py-0.5 rounded-full border ${p.gender === 'f' ? 'text-mulberry-300 border-mulberry-300/40' : 'text-gold-500 border-gold-500/40'}">نسل ${toFa(node.gen + 1)}</span>` +
            `<h2 class="font-display text-3xl mt-3">${escapeHtml(fullName(p))}</h2>` +
            (years ? `<p class="text-gold-500 text-sm mt-1">${years}</p>` : '') +
            (p.spouse_name
                ? `<p class="text-cream-100/70 text-sm mt-2">همسر: ${escapeHtml(p.spouse_name)}</p>`
                : '') +
            (parents.length
                ? '<div class="mt-4 space-y-2">' +
                parents
                    .map(
                        ([label, r]) =>
                            `<div class="flex items-center gap-2 text-sm"><span class="text-cream-100/60 w-12 shrink-0">${label}</span>${chip(r)}</div>`
                    )
                    .join('') +
                '</div>'
                : '') +
            (p.short_bio
                ? `<p class="text-cream-100/75 text-sm leading-8 mt-4">${escapeHtml(p.short_bio)}</p>`
                : '') +
            '<div class="grid grid-cols-2 gap-3 my-6">' +
            `<div class="bg-black/25 rounded-2xl p-4 text-center"><b class="font-display text-2xl text-gold-500">${toFa(kids.length)}</b><span class="block text-xs text-cream-100/60 mt-1">فرزند</span></div>` +
            `<div class="bg-black/25 rounded-2xl p-4 text-center"><b class="font-display text-2xl text-mulberry-300">${toFa(descendantsOf(p.id))}</b><span class="block text-xs text-cream-100/60 mt-1">فرزند و نوه</span></div></div>` +
            (kids.length
                ? '<h3 class="font-display text-xl mb-3">فرزندان</h3><div class="flex flex-wrap gap-2 mb-6">' +
                kids.map(chip).join('') +
                '</div>'
                : '') +
            '<div class="space-y-3">' +
            (p.elder_slug
                ? `<a href="/elders/${encodeURIComponent(p.elder_slug)}" class="btn-primary w-full justify-center">مشاهده صفحه کامل</a>`
                : '') +
            '<button id="panel-reset" class="btn-ghost on-dark w-full justify-center">بازگشت به نمای کلی</button></div></div>';

        panel.setAttribute('aria-hidden', 'false');
        gsap.to(panel, {x: 0, duration: 0.6, ease: 'power3.out'});

        qsa('[data-rel]', panel).forEach((b) =>
            b.addEventListener('click', () => select(state.nodeById.get(+b.dataset.rel)))
        );
        qs('#panel-close', panel).addEventListener('click', deselect);
        qs('#panel-reset', panel).addEventListener('click', resetView);
        qs('#panel-close', panel).focus();
    }

    function closePanel() {
        if (!panel) return;
        panel.setAttribute('aria-hidden', 'true');
        gsap.to(panel, {x: '105%', duration: 0.45, ease: 'power3.in'});
    }

    /* ---------- انتخاب خانواده ---------- */
    function buildFamilyChips() {
        const wrap = qs('#family-chips');
        if (!wrap) return;
        if (familyRoots.length < 2) {
            wrap.remove();
            return;
        }

        const chips = [{id: 0, label: 'همه خانواده‌ها'}].concat(
            familyRoots.map((r) => ({id: r.id, label: 'خانواده ' + r.last_name}))
        );

        wrap.innerHTML = chips
            .map(
                (c, i) =>
                    `<button class="tree-tool !w-auto !px-4 !text-sm !rounded-full ${i === 0 ? 'on' : ''}" data-family="${c.id}">${escapeHtml(c.label)}</button>`
            )
            .join('');

        qsa('[data-family]', wrap).forEach((b) =>
            b.addEventListener('click', () => {
                qsa('[data-family]', wrap).forEach((x) => x.classList.remove('on'));
                b.classList.add('on');
                const id = +b.dataset.family;
                resetView();
                buildTree(id === 0 ? roots.map((r) => r.id) : [id], true);
                buildLegend();
            })
        );
    }

    /* ---------- راهنمای نسل‌ها ---------- */
    function focusGen(g, on) {
        state.nodes.forEach((nd) => {
            const match = nd.gen === g;
            gsap.to([nd.photo.material, nd.ring.material], {
                opacity: on && !match ? 0.12 : nd.person.death_year ? 0.9 : 1,
                duration: 0.35,
            });
            nd.label.element.classList.toggle('dim', on && !match);
        });
    }

    function buildLegend() {
        const el = qs('#legend');
        if (!el || !state.nodes.length) return;

        const gens = Math.max(...state.nodes.map((n) => n.gen));
        el.innerHTML = Array.from(
            {length: gens + 1},
            (_, g) =>
                `<button class="legend-item" data-gen="${g}"><span class="w-3 h-3 rounded-full shrink-0" style="background:${CFG.genColors[g % CFG.genColors.length]}"></span>نسل ${toFa(g + 1)}</button>`
        ).join('');

        qsa('[data-gen]', el).forEach((b) => {
            const g = +b.dataset.gen;
            b.addEventListener('mouseenter', () => focusGen(g, true));
            b.addEventListener('mouseleave', () => focusGen(g, false));
            b.addEventListener('focus', () => focusGen(g, true));
            b.addEventListener('blur', () => focusGen(g, false));
        });
    }

    /* ---------- جست‌وجو ---------- */
    const search = qs('#tree-search');
    const results = qs('#search-results');

    if (search && results) {
        listen(
            search,
            'input',
            debounce(() => {
                const q = search.value.trim().replace(/ي/g, 'ی').replace(/ك/g, 'ک');
                if (!q) {
                    results.classList.add('hidden');
                    return;
                }

                const matches = people.filter((p) => fullName(p).includes(q)).slice(0, 8);

                results.innerHTML = matches.length
                    ? matches
                        .map(
                            (p) =>
                                `<button class="w-full text-right px-4 py-2.5 text-sm hover:bg-mulberry-500/40 transition-colors flex items-center gap-2" data-pid="${p.id}">` +
                                `<span class="w-2 h-2 rounded-full ${p.gender === 'f' ? 'bg-mulberry-300' : 'bg-gold-500'}"></span>` +
                                `${escapeHtml(fullName(p))}<span class="text-xs text-cream-100/40 mr-auto">نسل ${toFa(genOf(p, byId) + 1)}</span></button>`
                        )
                        .join('')
                    : '<p class="px-4 py-3 text-sm text-cream-100/50">کسی با این نام نیست.</p>';

                results.classList.remove('hidden');

                qsa('[data-pid]', results).forEach((b) =>
                    b.addEventListener('click', () => {
                        results.classList.add('hidden');
                        search.value = '';
                        const node = state.nodeById.get(+b.dataset.pid);
                        if (node) select(node);
                    })
                );
            }, 160)
        );
    }

    listen(document, 'click', (e) => {
        if (results && !e.target.closest('#tree-search-wrap')) results.classList.add('hidden');
    });

    /* ---------- نوار ابزار ---------- */
    function switchLayout() {
        state.layout = state.layout === 'organic' ? 'rings' : 'organic';

        const visible = visiblePeople(state.visibleRoots);
        const pos = computePositions(visible);
        const bm = treeGroup.userData.barkMat;

        gsap.to(bm, {
            opacity: 0,
            duration: 0.3,
            onComplete: () => {
                if (isDisposed()) return;
                clearHighlight(false);
                // شاخه‌ها از نو ساخته می‌شوند (گره‌ها می‌مانند)
                treeGroup.children.slice().forEach((o) => {
                    if (o.isMesh) {
                        o.geometry.dispose();
                        treeGroup.remove(o);
                    }
                });
                addBranches(visible, pos, bm);
                gsap.to(bm, {opacity: 1, duration: 0.5, delay: 0.6});
            },
        });

        state.nodes.forEach((n) => {
            const t = pos.get(n.person.id);
            if (t) gsap.to(n.group.position, {x: t.x, y: t.y, z: t.z, duration: 1.1, ease: 'power2.inOut'});
        });

        if (state.selected) setTimeout(() => !isDisposed() && highlightPath(state.selected), 1200);
        setTimeout(() => !isDisposed() && buildGuides(), 1150);
    }

    qsa('[data-action]').forEach((b) => {
        listen(b, 'click', () => {
            const a = b.dataset.action;

            if (a === 'reset') resetView();

            if (a === 'rotate') {
                state.wantAutoRotate = !state.wantAutoRotate;
                b.classList.toggle('on', state.wantAutoRotate);
                controls.autoRotate = state.wantAutoRotate;
            }

            if (a === 'labels') {
                state.showLabels = !state.showLabels;
                b.classList.toggle('on', state.showLabels);
            }

            if (a === 'rings') {
                state.showRings = !state.showRings;
                b.classList.toggle('on', state.showRings);
                ringGroup.visible = state.showRings;
            }

            if (a === 'layout') switchLayout();

            if (a === 'fullscreen') {
                if (document.fullscreenElement) document.exitFullscreen();
                else if (qs('main').requestFullscreen) qs('main').requestFullscreen();
            }
        });
    });

    /* ---------- تعامل با اشاره‌گر ---------- */
    const tipEl = document.createElement('div');
    tipEl.className = 'tree-tooltip';
    const tip = new CSS2DObject(tipEl);
    let downAt = null;

    listen(renderer.domElement, 'pointermove', (e) => {
        const n = pick(e);
        if (n === state.hovered) return;

        if (state.hovered) {
            gsap.to(state.hovered.group.scale, {x: 1, y: 1, z: 1, duration: 0.35, ease: 'power2.out'});
        }
        state.hovered = n;
        renderer.domElement.style.cursor = n ? 'pointer' : '';

        if (n) {
            gsap.to(n.group.scale, {x: 1.3, y: 1.3, z: 1.3, duration: 0.35, ease: 'back.out(2)'});
            gsap.to(n.glow.material, {opacity: 0.95, duration: 0.3});
            tipEl.innerHTML = `<b>${escapeHtml(fullName(n.person))}</b><br>${faYears(n.person)}`;
            n.face.add(tip);
        } else if (tip.parent) {
            tip.parent.remove(tip);
        }
    });

    listen(renderer.domElement, 'pointerdown', (e) => {
        downAt = {x: e.clientX, y: e.clientY};
    });

    listen(renderer.domElement, 'pointerup', (e) => {
        // فقط وقتی اشاره‌گر تقریباً تکان نخورده کلیک حساب می‌شود (نه چرخاندن)
        if (!downAt) return;
        if (Math.hypot(e.clientX - downAt.x, e.clientY - downAt.y) > 6) return;

        const n = pick(e);
        if (n) select(n);
        else if (state.selected) deselect();
    });

    listen(document, 'keydown', (e) => {
        if (e.key === 'Escape' && state.selected) deselect();
    });

    // چرخش خودکار: با تعامل متوقف و بعد از چند ثانیه بی‌کاری ادامه می‌یابد
    let idleT = null;
    controls.addEventListener('start', () => {
        controls.autoRotate = false;
        clearTimeout(idleT);
    });
    controls.addEventListener('end', () => {
        clearTimeout(idleT);
        idleT = setTimeout(() => {
            controls.autoRotate = state.wantAutoRotate;
        }, 4000);
    });

    /* ---------- راهنمای بار اول ---------- */
    let hintTimer = null;
    const hint = qs('#tree-hint');
    if (hint) {
        let seen = false;
        try {
            seen = !!localStorage.getItem('treeHintSeen');
        } catch (e) {
            /* storage در دسترس نیست */
        }

        if (seen) {
            hint.remove();
        } else {
            const dismiss = () => {
                try {
                    localStorage.setItem('treeHintSeen', '1');
                } catch (e) {
                    /* storage در دسترس نیست */
                }
                hint.style.opacity = '0';
                setTimeout(() => hint.remove(), 700);
            };
            qs('#hint-ok', hint).addEventListener('click', dismiss);
            hintTimer = setTimeout(dismiss, 7000);
        }
    }

    /* ---------- حلقه‌ی رندر (با توقف وقتی دیده نمی‌شود) ---------- */
    let raf = 0;
    const io = new IntersectionObserver(
        (es) => {
            state.running = es[0].isIntersecting;
        },
        {threshold: 0.02}
    );
    io.observe(renderer.domElement);

    const frame = () => {
        raf = requestAnimationFrame(frame);
        if (!state.running || document.hidden) return;

        controls.update();
        state.nodes.forEach((n) => {
            n.face.lookAt(camera.position); // عکس‌ها همیشه رو به دوربین
            n.label.visible = state.showLabels && camera.position.distanceTo(n.group.position) < 46;
        });
        renderer.render(scene, camera);
        labelRenderer.render(scene, camera);
    };
    raf = requestAnimationFrame(frame);

    listen(
        window,
        'resize',
        debounce(() => {
            camera.aspect = innerWidth / innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(innerWidth, innerHeight);
            labelRenderer.setSize(innerWidth, innerHeight);
        }, 120)
    );

    /* ---------- شروع ---------- */
    buildFamilyChips();
    buildTree(roots.map((r) => r.id), true);
    buildLegend();

    let deepTimer = null;
    const deepId = getQuery('person');
    if (deepId) {
        deepTimer = setTimeout(() => {
            if (!isDisposed()) select(state.nodeById.get(+deepId));
        }, 1400);
    }

    /* ---------- پاکسازی کامل موقع ترک صفحه ---------- */
    onCleanup(() => {
        cancelAnimationFrame(raf);
        clearTimeout(idleT);
        clearTimeout(hintTimer);
        clearTimeout(deepTimer);
        io.disconnect();

        gsap.killTweensOf([camera.position, controls.target]);
        if (panel) gsap.killTweensOf(panel);
        killNodeTweens();
        state.highlightTweens.forEach((t) => t.kill());

        state.nodes.forEach((n) => n.label.element && n.label.element.remove());

        scene.traverse((o) => {
            if (o.geometry) o.geometry.dispose();
            if (o.material) {
                (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
                    if (m.map) m.map.dispose();
                    m.dispose();
                });
            }
        });

        controls.dispose();
        renderer.dispose();
        renderer.domElement.remove();
        labelRenderer.domElement.remove();

        if (document.fullscreenElement) document.exitFullscreen().catch(() => {
        });
    });
}
