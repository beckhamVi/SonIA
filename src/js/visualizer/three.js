import * as THREE from 'three';
import {GUI} from 'dat.gui';
import {EffectComposer} from 'three/examples/jsm/postprocessing/EffectComposer';
import {RenderPass} from 'three/examples/jsm/postprocessing/RenderPass';
import {UnrealBloomPass} from 'three/examples/jsm/postprocessing/UnrealBloomPass';
import {OutputPass} from 'three/examples/jsm/postprocessing/OutputPass';

// Configuración inicial de Three.js
const renderer = new THREE.WebGLRenderer({antialias: true});
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
);

// Parámetros visuales
const params = {
    red: 1.0,
    green: 1.0,
    blue: 1.0,
    threshold: 0.5,
    strength: 0.5,
    radius: 0.8
}

// Configuración del renderer y efectos
renderer.outputColorSpace = THREE.SRGBColorSpace;
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(new THREE.Vector2(window.innerWidth, window.innerHeight));
bloomPass.threshold = params.threshold;
bloomPass.strength = params.strength;
bloomPass.radius = params.radius;

const bloomComposer = new EffectComposer(renderer);
bloomComposer.addPass(renderScene);
bloomComposer.addPass(bloomPass);

const outputPass = new OutputPass();
bloomComposer.addPass(outputPass);

// Configuración de la cámara
camera.position.set(0, -2, 14);
camera.lookAt(0, 0, 0);

// Uniforms para los shaders
const uniforms = {
    u_time: {type: 'f', value: 0.0},
    u_frequency: {type: 'f', value: 0.0},
    u_red: {type: 'f', value: 1.0},
    u_green: {type: 'f', value: 1.0},
    u_blue: {type: 'f', value: 1.0}
}

// Material y geometría
const mat = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: document.getElementById('vertexshader').textContent,
    fragmentShader: document.getElementById('fragmentshader').textContent
});

const geo = new THREE.IcosahedronGeometry(4, 30);
const mesh = new THREE.Mesh(geo, mat);
scene.add(mesh);
mesh.material.wireframe = true;

// Configuración del audio
let analyser;
const listener = new THREE.AudioListener();
camera.add(listener);
const sound = new THREE.Audio(listener);

// Función para cargar y conectar el audio del localStorage
function initAudioFromStorage() {
    const currentTrack = JSON.parse(localStorage.getItem("currentTrack"));
    
    if (currentTrack && currentTrack.previewUrl) {
        // Crear elemento de audio HTML
        const audioElement = document.createElement('audio');
        audioElement.src = currentTrack.previewUrl;
        audioElement.crossOrigin = "anonymous";
        
        // Crear el analizador de audio
        analyser = new THREE.AudioAnalyser(sound, 32);
        
        // Conectar el audio con Three.js
        sound.setMediaElementSource(audioElement);
        
        // Agregar controles de audio si es necesario
        document.body.appendChild(audioElement);
        
        // Reproducir cuando esté listo
        audioElement.addEventListener('canplaythrough', () => {
            audioElement.play();
        });

        // Manejar errores
        audioElement.addEventListener('error', (e) => {
            console.error('Error loading audio:', e);
        });

        // Actualizar la UI si existe
        if (document.getElementById("track-title")) {
            document.getElementById("track-title").textContent = currentTrack.name;
        }
        if (document.getElementById("track-artist")) {
            document.getElementById("track-artist").textContent = currentTrack.artist;
        }
        if (document.getElementById("album-cover")) {
            document.getElementById("album-cover").src = currentTrack.albumCover;
        }
    }
}

// GUI para controles
const gui = new GUI();

const colorsFolder = gui.addFolder('Colors');
colorsFolder.add(params, 'red', 0, 1).onChange(function(value) {
    uniforms.u_red.value = Number(value);
});
colorsFolder.add(params, 'green', 0, 1).onChange(function(value) {
    uniforms.u_green.value = Number(value);
});
colorsFolder.add(params, 'blue', 0, 1).onChange(function(value) {
    uniforms.u_blue.value = Number(value);
});

const bloomFolder = gui.addFolder('Bloom');
bloomFolder.add(params, 'threshold', 0, 1).onChange(function(value) {
    bloomPass.threshold = Number(value);
});
bloomFolder.add(params, 'strength', 0, 3).onChange(function(value) {
    bloomPass.strength = Number(value);
});
bloomFolder.add(params, 'radius', 0, 1).onChange(function(value) {
    bloomPass.radius = Number(value);
});

// Control del mouse
let mouseX = 0;
let mouseY = 0;
document.addEventListener('mousemove', function(e) {
    let windowHalfX = window.innerWidth / 2;
    let windowHalfY = window.innerHeight / 2;
    mouseX = (e.clientX - windowHalfX) / 100;
    mouseY = (e.clientY - windowHalfY) / 100;
});

// Animación
const clock = new THREE.Clock();
function animate() {
    camera.position.x += (mouseX - camera.position.x) * .05;
    camera.position.y += (-mouseY - camera.position.y) * 0.5;
    camera.lookAt(scene.position);
    uniforms.u_time.value = clock.getElapsedTime();
    
    // Actualizar frecuencia solo si el analizador existe
    if (analyser) {
        uniforms.u_frequency.value = analyser.getAverageFrequency();
    }
    
    bloomComposer.render();
    requestAnimationFrame(animate);
}

// Manejo de redimensionamiento
window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    bloomComposer.setSize(window.innerWidth, window.innerHeight);
});

// Inicializar todo cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    initAudioFromStorage();
    animate();
});

// Asegurar que el audio se inicie con interacción del usuario
document.addEventListener('click', () => {
    if (sound && !sound.isPlaying) {
        sound.play();
    }
});