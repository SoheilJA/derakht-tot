import * as THREE from 'three';
import gsap from 'gsap';
import { listen, onCleanup } from '../lib/lifecycle';
import { debounce, reduced } from '../lib/utils';

const CFG = {
    dprCap: 2,
    fireflies: 120,
    leaves: 22,
    camBase: new THREE.Vector3(0, 4.6, 16.5),
    lookAt: new THREE.Vector3(0, 5.2, 0),
};

const PAL = {
    bark: 0x4b3321,
    leafA: 0x3e8e41,
    leafB: 0x1f4d2b,
    leafC: 0x8bc17a,
    berry: 0x8e2c63,
    berry2: 0x5a1a3f,
    skyStops: ['#2B0A1F', '#5A1A3F', '#8E2C63', '#D4A24C'],
};

/* ---------- ابزارهای کمکی ---------- */

// تولید عدد تصادفی با seed ثابت تا درخت در هر بار بارگذاری یکسان باشه
function mulberry32(a) {
    return function () {
        a |= 0;
        a = (a + 0x6d2b79f5) | 0;
        let t = Math.imul(a ^ (a >>> 15), 1 | a);
        t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
}

function glowTexture(hex) {
    const c = document.createElement('canvas');
    c.width = c.height = 64;
    const x = c.getContext('2d');
    const g = x.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, hex);
    g.addColorStop(1, 'rgba(0,0,0,0)');
    x.fillStyle = g;
    x.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(c);
}

function leafTexture() {
    const c = document.createElement('canvas');
    c.width = 48;
    c.height = 64;
    const x = c.getContext('2d');
    x.fillStyle = 'rgba(255,255,255,.95)';
    x.beginPath();
    x.moveTo(24, 4);
    x.quadraticCurveTo(46, 28, 24, 60);
    x.quadraticCurveTo(2, 28, 24, 4);
    x.fill();
    x.strokeStyle = 'rgba(120,90,50,.6)';
    x.lineWidth = 2;
    x.beginPath();
    x.moveTo(24, 6);
    x.lineTo(24, 58);
    x.stroke();
    return new THREE.CanvasTexture(c);
}

function skyTexture(stops) {
    const c = document.createElement('canvas');
    c.width = 8;
    c.height = 256;
    const x = c.getContext('2d');
    const g = x.createLinearGradient(0, 0, 0, 256);
    stops.forEach((s, i) => g.addColorStop(i / (stops.length - 1), s));
    x.fillStyle = g;
    x.fillRect(0, 0, 8, 256);
    const t = new THREE.CanvasTexture(c);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
}

/* ---------- درخت توت پروسیجرال ---------- */
function buildTree(seed) {
    const rnd = mulberry32(seed);
    const barkMat = new THREE.MeshStandardMaterial({ color: PAL.bark, roughness: 0.95, flatShading: true });
    const leafMats = [PAL.leafA, PAL.leafB, PAL.leafC].map(
        (cl) => new THREE.MeshStandardMaterial({ color: cl, roughness: 0.9, flatShading: true })
    );
    const berryMat = new THREE.MeshStandardMaterial({ color: PAL.berry, roughness: 0.5 });
    const berry2Mat = new THREE.MeshStandardMaterial({ color: PAL.berry2, roughness: 0.5 });

    const group = new THREE.Group();
    const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.62, 5.2, 8, 3), barkMat);
    trunk.position.y = 2.4;
    group.add(trunk);

    (function branch(parent, y, len, radius, depth) {
        if (depth === 0) {
            const l = new THREE.Mesh(
                new THREE.IcosahedronGeometry(0.85 + rnd() * 0.7, 0),
                leafMats[Math.floor(rnd() * 3)]
            );
            l.position.set(0, y + len * 0.9, 0);
            l.rotation.set(rnd() * 6, rnd() * 6, rnd() * 6);
            parent.add(l);

            for (let i = 0; i < 3; i++) {
                const b = new THREE.Mesh(new THREE.SphereGeometry(0.09, 6, 5), rnd() > 0.5 ? berryMat : berry2Mat);
                const a = rnd() * Math.PI * 2;
                const rr = 0.5 + rnd() * 0.6;
                b.position.set(
                    l.position.x + Math.cos(a) * rr,
                    l.position.y + (rnd() - 0.5) * 0.8,
                    Math.sin(a) * rr
                );
                parent.add(b);
            }
            return;
        }

        const n = 2 + (rnd() < 0.45 ? 1 : 0);
        for (let i = 0; i < n; i++) {
            const pivot = new THREE.Group();
            pivot.position.y = y + len * (0.45 + rnd() * 0.4);
            pivot.rotation.set(
                (rnd() * 0.5 + 0.22) * (rnd() < 0.5 ? -1 : 1),
                rnd() * Math.PI * 2,
                (rnd() * 0.5 + 0.22) * (rnd() < 0.5 ? -1 : 1)
            );

            const seg = new THREE.Mesh(
                new THREE.CylinderGeometry(Math.max(radius * 0.55, 0.04), radius, len, 7, 1),
                barkMat
            );
            seg.geometry.translate(0, len / 2, 0);
            pivot.add(seg);
            parent.add(pivot);

            branch(pivot, 0, len * (0.6 + rnd() * 0.16), radius * 0.6, depth - 1);
        }
    })(group, 4.6, 2.1, 0.42, 3);

    return group;
}

/* ---------- بررسی توانایی دستگاه ---------- */
function webglOK() {
    try {
        const c = document.createElement('canvas');
        return !!(c.getContext('webgl2') || c.getContext('webgl'));
    } catch (e) {
        return false;
    }
}

function lowPower() {
    return (
        (navigator.hardwareConcurrency || 8) <= 2 ||
        (navigator.deviceMemory && navigator.deviceMemory <= 2)
    );
}

function disposeAll(scene, renderer) {
    scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose();
        if (o.material) {
            (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => {
                if (m.map) m.map.dispose();
                m.dispose();
            });
        }
    });
    renderer.dispose();
}

/* ================= صحنه‌ی هیرو ================= */
export function initHeroScene() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;

    const showFallback = () => {
        canvas.style.display = 'none';
        const f = document.getElementById('hero-fallback');
        if (f) f.classList.remove('hidden');
    };

    if (!webglOK() || lowPower() || reduced()) return showFallback();

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: false });
    } catch (e) {
        return showFallback();
    }

    renderer.setPixelRatio(Math.min(devicePixelRatio, CFG.dprCap));
    renderer.setSize(innerWidth, innerHeight);

    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x5a1a3f, 20, 78);

    const camera = new THREE.PerspectiveCamera(45, innerWidth / innerHeight, 0.1, 200);
    camera.position.copy(CFG.camBase).add(new THREE.Vector3(0, 0, 10)); // شروع انیمیشن: دورتر
    camera.lookAt(CFG.lookAt);

    // آسمان غروب
    scene.add(
        new THREE.Mesh(
            new THREE.SphereGeometry(110, 24, 16),
            new THREE.MeshBasicMaterial({ map: skyTexture(PAL.skyStops), side: THREE.BackSide, fog: false })
        )
    );

    // تپه
    const hill = new THREE.Mesh(
        new THREE.SphereGeometry(60, 32, 16),
        new THREE.MeshStandardMaterial({ color: 0x1f4d2b, roughness: 1, flatShading: true })
    );
    hill.scale.set(1, 0.22, 1);
    hill.position.y = -13.3;
    scene.add(hill);

    // درخت
    const tree = buildTree(7);
    tree.position.y = -0.3;
    scene.add(tree);

    // کرم‌های شب‌تاب
    const ffGeo = new THREE.BufferGeometry();
    const ffPos = new Float32Array(CFG.fireflies * 3);
    const ffBase = [];
    for (let i = 0; i < CFG.fireflies; i++) {
        ffBase.push({
            x: (Math.random() - 0.5) * 26,
            y: Math.random() * 12 + 0.5,
            z: (Math.random() - 0.5) * 20,
            ph: Math.random() * 6.28,
            sp: 0.4 + Math.random() * 0.8,
        });
    }
    ffGeo.setAttribute('position', new THREE.BufferAttribute(ffPos, 3));
    scene.add(
        new THREE.Points(
            ffGeo,
            new THREE.PointsMaterial({
                size: 0.22,
                map: glowTexture('rgba(212,162,76,.9)'),
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
                opacity: 0.85,
            })
        )
    );

    // برگ‌های در حال سقوط
    const leafMat = new THREE.MeshBasicMaterial({
        map: leafTexture(),
        transparent: true,
        side: THREE.DoubleSide,
        opacity: 0.8,
        color: 0x8bc17a,
    });
    const leafMat2 = leafMat.clone();
    leafMat2.color.set(0xc26a97);

    const leaves = [];
    for (let i = 0; i < CFG.leaves; i++) {
        const m = new THREE.Mesh(new THREE.PlaneGeometry(0.26, 0.34), i % 3 ? leafMat : leafMat2);
        m.position.set((Math.random() - 0.5) * 22, Math.random() * 12, (Math.random() - 0.5) * 16);
        m.userData = { vy: 0.35 + Math.random() * 0.5, ph: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.02 };
        scene.add(m);
        leaves.push(m);
    }

    // نورها
    scene.add(new THREE.AmbientLight(0x8e2c63, 0.75));
    const sun = new THREE.DirectionalLight(0xffd9a0, 2.2);
    sun.position.set(12, 9, 7);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0xc26a97, 0.8);
    rim.position.set(-10, 6, -8);
    scene.add(rim);

    // پارالکس موس
    const px = { t: 0, c: 0 };
    const py = { t: 0, c: 0 };
    listen(
        window,
        'pointermove',
        (e) => {
            px.t = (e.clientX / innerWidth - 0.5) * 1.4;
            py.t = (e.clientY / innerHeight - 0.5) * 0.7;
        },
        { passive: true }
    );

    // انیمیشن ورود دوربین بعد از پریلودر
    let introDone = false;
    const intro = () => {
        if (introDone) return;
        introDone = true;
        gsap.to(camera.position, { z: CFG.camBase.z, duration: 2.4, ease: 'power3.out' });
    };

    // اگر پریلودر وجود نداره (ناوبری داخلی)، همین الان شروع کن
    let introTimer = null;
    if (!document.getElementById('preloader')) {
        intro();
    } else {
        listen(window, 'village:ready', intro);
        introTimer = setTimeout(intro, 3200);
    }

    // توقف رندر وقتی دیده نمی‌شه
    let running = true;
    let raf = 0;
    const io = new IntersectionObserver(
        (es) => {
            running = es[0].isIntersecting;
        },
        { threshold: 0.02 }
    );
    io.observe(canvas);

    listen(document, 'visibilitychange', () => {
        running = !document.hidden;
    });

    function render(t) {
        t /= 1000;
        px.c += (px.t - px.c) * 0.05;
        py.c += (py.t - py.c) * 0.05;

        camera.position.x = CFG.camBase.x + px.c;
        camera.position.y = CFG.camBase.y - py.c;
        camera.lookAt(CFG.lookAt);

        const pos = ffGeo.attributes.position;
        for (let i = 0; i < CFG.fireflies; i++) {
            const b = ffBase[i];
            pos.setXYZ(
                i,
                b.x + Math.sin(t * b.sp + b.ph) * 0.6,
                b.y + Math.sin(t * b.sp * 0.7 + b.ph) * 0.9,
                b.z + Math.cos(t * b.sp + b.ph) * 0.5
            );
        }
        pos.needsUpdate = true;

        leaves.forEach((l) => {
            l.position.y -= l.userData.vy * 0.1536;
            l.position.x += Math.sin(t + l.userData.ph) * 0.008;
            l.rotation.z += l.userData.vr;
            if (l.position.y < -1.5) {
                l.position.y = 12 + Math.random() * 3;
                l.position.x = (Math.random() - 0.5) * 22;
            }
        });

        tree.rotation.y = Math.sin(t * 0.1) * 0.04; // نسیم ملایم
        renderer.render(scene, camera);
    }

    const loop = (t) => {
        raf = requestAnimationFrame(loop);
        if (running) render(t);
    };
    raf = requestAnimationFrame(loop);

    listen(
        window,
        'resize',
        debounce(() => {
            camera.aspect = innerWidth / innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(innerWidth, innerHeight);
        }, 150)
    );

    // پاکسازی کامل موقع ترک صفحه
    onCleanup(() => {
        cancelAnimationFrame(raf);
        clearTimeout(introTimer);
        io.disconnect();
        gsap.killTweensOf(camera.position);
        disposeAll(scene, renderer);
    });
}

/* ================= صحنه‌ی شبانه (بخش teaser) ================= */
export function initTeaserScene() {
    const canvas = document.getElementById('teaser-canvas');
    if (!canvas) return;

    if (!webglOK() || lowPower() || reduced()) {
        canvas.style.opacity = '.35';
        return;
    }

    let renderer;
    try {
        renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
    } catch (e) {
        return;
    }

    renderer.setPixelRatio(Math.min(devicePixelRatio, CFG.dprCap));

    const sizeOf = () => ({
        w: canvas.clientWidth || innerWidth,
        h: canvas.parentElement ? canvas.parentElement.offsetHeight : 500,
    });

    const { w, h } = sizeOf();
    renderer.setSize(w, h);

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x14081f, 0.03);

    const camera = new THREE.PerspectiveCamera(42, w / h, 0.1, 200);

    const tree = buildTree(21);
    tree.traverse((o) => {
        if (o.material && o.material.isMeshStandardMaterial) o.material.emissive = new THREE.Color(0x1a0f2e);
    });
    scene.add(tree);

    scene.add(
        new THREE.Mesh(
            new THREE.SphereGeometry(90, 20, 14),
            new THREE.MeshBasicMaterial({
                map: skyTexture(['#0d0616', '#1c0b2e', '#2B0A1F', '#3d1440']),
                side: THREE.BackSide,
                fog: false,
            })
        )
    );

    const ground = new THREE.Mesh(new THREE.CircleGeometry(24, 48), new THREE.MeshBasicMaterial({ color: 0x120a1c }));
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.5;
    scene.add(ground);

    const glow = new THREE.Sprite(
        new THREE.SpriteMaterial({
            map: glowTexture('rgba(142,44,99,.5)'),
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
        })
    );
    glow.scale.set(10, 10, 1);
    glow.position.y = 4;
    scene.add(glow);

    // کرم‌های شب‌تاب انبوه‌تر
    const n = 300;
    const geo = new THREE.BufferGeometry();
    const arr = new Float32Array(n * 3);
    for (let i = 0; i < n; i++) {
        arr[i * 3] = (Math.random() - 0.5) * 30;
        arr[i * 3 + 1] = Math.random() * 14;
        arr[i * 3 + 2] = (Math.random() - 0.5) * 24;
    }
    geo.setAttribute('position', new THREE.BufferAttribute(arr, 3));
    scene.add(
        new THREE.Points(
            geo,
            new THREE.PointsMaterial({
                size: 0.16,
                map: glowTexture('rgba(212,162,76,.95)'),
                transparent: true,
                depthWrite: false,
                blending: THREE.AdditiveBlending,
            })
        )
    );

    scene.add(new THREE.AmbientLight(0x5a2a66, 1.4));
    const p1 = new THREE.PointLight(0x8e2c63, 160, 0, 1.9);
    p1.position.set(0, 10, 4);
    scene.add(p1);
    const p2 = new THREE.PointLight(0xd4a24c, 60, 0, 2);
    p2.position.set(6, 3, 6);
    scene.add(p2);

    let running = true;
    let raf = 0;
    let angle = 0;

    const io = new IntersectionObserver(
        (es) => {
            running = es[0].isIntersecting;
        },
        { threshold: 0.05 }
    );
    io.observe(canvas);

    listen(document, 'visibilitychange', () => {
        if (document.hidden) running = false;
    });

    const loop = (t) => {
        raf = requestAnimationFrame(loop);
        if (!running) return;

        t /= 1000;
        angle += 0.0012;
        camera.position.set(Math.sin(angle) * 17, 8 + Math.sin(t * 0.3) * 0.6, Math.cos(angle) * 17);
        camera.lookAt(0, 4.5, 0);
        glow.material.opacity = 0.35 + Math.sin(t * 1.4) * 0.15;
        renderer.render(scene, camera);
    };
    raf = requestAnimationFrame(loop);

    listen(
        window,
        'resize',
        debounce(() => {
            const s = sizeOf();
            camera.aspect = s.w / s.h;
            camera.updateProjectionMatrix();
            renderer.setSize(s.w, s.h);
        }, 200)
    );

    onCleanup(() => {
        cancelAnimationFrame(raf);
        io.disconnect();
        disposeAll(scene, renderer);
    });
}