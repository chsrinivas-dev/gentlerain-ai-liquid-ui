/* ===============================
   HERO OPENING CINEMATIC ANIMATION
================================ */

gsap.set(".hero-content h1", { opacity: 0, y: 120, scale: 0.9 });
gsap.set(".hero-content p", { opacity: 0, y: 80 });
gsap.set(".cta-btn", { opacity: 0, y: 60 });

window.addEventListener("load", () => {
    const tl = gsap.timeline({ ease: "power4.out" });

    tl.to(".hero-content h1", {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1.4
    })
    .to(".hero-content p", {
        opacity: 1,
        y: 0,
        duration: 1
    }, "-=0.8")
    .to(".cta-btn", {
        opacity: 1,
        y: 0,
        duration: 0.8
    }, "-=0.6");
});

/* ===============================
   BASIC INIT
================================ */
AOS.init();

/* ===============================
   MAGNETIC CURSOR
================================ */
const cursor = document.querySelector(".cursor");

document.addEventListener("mousemove", e => {
    gsap.to(cursor, {
        x: e.clientX,
        y: e.clientY,
        duration: 0.15
    });
});

document.querySelectorAll("a, button, .card").forEach(el => {
    el.addEventListener("mouseenter", () => cursor.classList.add("expand"));
    el.addEventListener("mouseleave", () => cursor.classList.remove("expand"));
});

/* ===============================
   HERO TEXT ANIMATION
================================ */
gsap.from(".hero-content h1", {
    y: 80,
    opacity: 0,
    duration: 1.2,
    ease: "power4.out"
});

gsap.from(".hero-content p", {
    y: 50,
    opacity: 0,
    delay: 0.3,
    duration: 1
});

/* ===============================
   AI TYPING EFFECT
================================ */
const words = ["Build", "Train", "Scale", "Deploy"];
let wi = 0, ci = 0;
const textEl = document.getElementById("rotating-words");

function type() {
    if (ci < words[wi].length) {
        textEl.textContent += words[wi][ci++];
        setTimeout(type, 120);
    } else {
        setTimeout(erase, 1200);
    }
}
function erase() {
    if (ci > 0) {
        textEl.textContent = words[wi].slice(0, --ci);
        setTimeout(erase, 80);
    } else {
        wi = (wi + 1) % words.length;
        setTimeout(type, 300);
    }
}
type();

/* ===============================
   SCROLL REVEAL
================================ */
gsap.utils.toArray("section").forEach(sec => {
    gsap.from(sec, {
        scrollTrigger: {
            trigger: sec,
            start: "top 85%"
        },
        opacity: 0,
        y: 80,
        duration: 1
    });
});

/* ===============================
   THREE.JS GLASS + GLOW HERO
================================ */
const threeCanvas = document.getElementById("three-canvas");

/* Scene */
const scene = new THREE.Scene();

/* Camera */
const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);
camera.position.z = 6;

/* Renderer */
const renderer = new THREE.WebGLRenderer({
    canvas: threeCanvas,
    alpha: true,
    antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

/* Geometry */
const geometry = new THREE.IcosahedronGeometry(2.3, 1);

/* Glass Material */
const material = new THREE.MeshPhysicalMaterial({
    color: 0x00d4ff,
    metalness: 0.85,
    roughness: 0.15,
    transmission: 0.8,
    thickness: 1.4,
    clearcoat: 1,
    clearcoatRoughness: 0.05,
    ior: 1.5,
    envMapIntensity: 1.5
});

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

/* Lights */
scene.add(new THREE.AmbientLight(0x66ccff, 0.6));

const keyLight = new THREE.PointLight(0xffffff, 2);
keyLight.position.set(6, 6, 6);
scene.add(keyLight);

const rimLight = new THREE.PointLight(0x00d4ff, 3);
rimLight.position.set(-6, -6, 6);
scene.add(rimLight);

/* Animate */
function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.002;
    mesh.rotation.y += 0.003;
    particles.rotation.y += 0.0004;
    particles.rotation.x += 0.0002;

    /* ===============================
   POST PROCESSING (BLOOM SHADER)
================================ */
const composer = new THREE.EffectComposer(renderer);
composer.addPass(new THREE.RenderPass(scene, camera));

const bloomPass = new THREE.UnrealBloomPass(
    new THREE.Vector2(window.innerWidth, window.innerHeight),
    1.4,   // strength
    0.4,   // radius
    0.85   // threshold
);
composer.addPass(bloomPass);

/* UPDATED ANIMATE */
function animate() {
    requestAnimationFrame(animate);
    mesh.rotation.x += 0.002;
    mesh.rotation.y += 0.003;
    composer.render();
}
animate();

}
animate();

/* Mouse Interaction */
document.addEventListener("mousemove", e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 1.2;
    const y = (e.clientY / window.innerHeight - 0.5) * 1.2;

    gsap.to(mesh.rotation, {
        x: y,
        y: x,
        duration: 1,
        ease: "power3.out"
    });
});

/* Resize */
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    composer.setSize(window.innerWidth, window.innerHeight);
});
/* ===============================
   TRUE WATER FLUID DISTORTION
================================ */

let fluidMouse = { x: 0.5, y: 0.5 };

document.addEventListener("mousemove", e => {
    fluidMouse.x = e.clientX / window.innerWidth;
    fluidMouse.y = 1 - e.clientY / window.innerHeight;
});

const waterGeometry = new THREE.PlaneGeometry(14, 14, 128, 128);

const waterMaterial = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2(0.5, 0.5) }
    },
    vertexShader: `
        uniform float time;
        uniform vec2 mouse;
        varying vec2 vUv;

        void main() {
            vUv = uv;
            vec3 pos = position;

            float wave1 = sin((uv.x + time) * 10.0) * 0.15;
            float wave2 = sin((uv.y + time) * 8.0) * 0.12;

            float dist = distance(uv, mouse);
            float ripple = sin(dist * 30.0 - time * 6.0) * 0.35;

            pos.z += wave1 + wave2 + ripple;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;

        void main() {
            float alpha = 0.18;
            gl_FragColor = vec4(0.0, 0.83, 1.0, alpha);
        }
    `
});

const waterMesh = new THREE.Mesh(waterGeometry, waterMaterial);
waterMesh.position.z = -1.8;
scene.add(waterMesh);

/* Animate water */
const waterClock = new THREE.Clock();

function animateWater() {
    waterMaterial.uniforms.time.value = waterClock.getElapsedTime();
    waterMaterial.uniforms.mouse.value.set(fluidMouse.x, fluidMouse.y);
    requestAnimationFrame(animateWater);
}
animateWater();

/* ===============================
   3D PARTICLES SYSTEM
================================ */
const particleCount = 1200;

const particlesGeometry = new THREE.BufferGeometry();
const positions = new Float32Array(particleCount * 3);
const speeds = new Float32Array(particleCount);

for (let i = 0; i < particleCount; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 12;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 12;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 12;
    speeds[i] = Math.random() * 0.02 + 0.005;
}

particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positions, 3)
);

const particlesMaterial = new THREE.PointsMaterial({
    color: 0x00d4ff,
    size: 0.035,
    transparent: true,
    opacity: 0.8,
    blending: THREE.AdditiveBlending,
    depthWrite: false
});

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

/* Mouse interaction */
let pMouseX = 0;
let pMouseY = 0;

document.addEventListener("mousemove", e => {
    pMouseX = (e.clientX / window.innerWidth - 0.5) * 2;
    pMouseY = (e.clientY / window.innerHeight - 0.5) * 2;
});

/* Animate particles */
function animateParticles() {
    const pos = particlesGeometry.attributes.position.array;

    for (let i = 0; i < particleCount; i++) {
        pos[i * 3 + 1] += speeds[i];

        if (pos[i * 3 + 1] > 6) {
            pos[i * 3 + 1] = -6;
        }
    }

    particles.rotation.y += 0.0008;
    particles.rotation.x += pMouseY * 0.001;
    particles.rotation.z += pMouseX * 0.001;

    particlesGeometry.attributes.position.needsUpdate = true;
    requestAnimationFrame(animateParticles);
}
animateParticles();
/* ===============================
   HERO PARALLAX WATER FEEL
================================ */
document.addEventListener("mousemove", e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 18;
    const y = (e.clientY / window.innerHeight - 0.5) * 18;

    gsap.to(".hero-content", {
        rotationY: x * 0.2,
        rotationX: -y * 0.2,
        duration: 0.6,
        ease: "power3.out"
    });
});
/* ===============================
   VISIBLE WATER RIPPLE TEST
================================ */

const testGeo = new THREE.PlaneGeometry(12, 12, 64, 64);

const testMat = new THREE.ShaderMaterial({
    transparent: true,
    uniforms: {
        time: { value: 0 },
        mouse: { value: new THREE.Vector2(0.5, 0.5) }
    },
    vertexShader: `
        uniform float time;
        uniform vec2 mouse;
        varying vec2 vUv;

        void main() {
            vUv = uv;
            vec3 pos = position;

            float d = distance(uv, mouse);
            pos.z += sin(d * 25.0 - time * 6.0) * 0.6;

            gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
        }
    `,
    fragmentShader: `
        varying vec2 vUv;
        void main() {
            gl_FragColor = vec4(0.0, 1.0, 1.0, 0.35);
        }
    `
});

const testWater = new THREE.Mesh(testGeo, testMat);
testWater.position.z = 1.5;   // 👈 IMPORTANT: IN FRONT
scene.add(testWater);

document.addEventListener("mousemove", e => {
    testMat.uniforms.mouse.value.set(
        e.clientX / window.innerWidth,
        1 - e.clientY / window.innerHeight
    );
});

const testClock = new THREE.Clock();

function testAnimate() {
    testMat.uniforms.time.value = testClock.getElapsedTime();
    requestAnimationFrame(testAnimate);
}
testAnimate();
/* ===============================
   STRONG LIQUID WATER ANIMATION
================================ */

const liquid = document.getElementById("liquidPath");

let mx = window.innerWidth / 2;
let my = window.innerHeight / 2;

document.addEventListener("mousemove", (e) => {
    mx = e.clientX;
    my = e.clientY;
});

function strongLiquid() {
    const x = mx / window.innerWidth;
    const y = my / window.innerHeight;

    const wave = `
        M0,${360 + y * 120}
        C180,${120 + y * 300}
         360,${580 - x * 300}
         540,${360 + y * 250}
        C720,${120 + x * 350}
         900,${580 - y * 300}
         1080,${360 + x * 200}
        C1260,${150 + y * 350}
         1380,${600 - x * 300}
         1440,${360 + y * 120}
        L1440,0 L0,0 Z
    `;

    gsap.to(liquid, {
        attr: { d: wave },
        duration: 0.45,
        ease: "power4.out"
    });

    requestAnimationFrame(strongLiquid);
}

strongLiquid();
