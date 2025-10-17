<template>
    <div ref="canvasContainer" class="w-full h-screen"></div>
</template>

<script setup>
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { onMounted, ref } from 'vue';

const canvasContainer = ref(null);

onMounted(() => {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);

    const camera = new THREE.PerspectiveCamera(
        50,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
    );
    camera.position.set(130, 70, 180);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    canvasContainer.value.appendChild(renderer.domElement);

    // Światło
    const ambientLight = new THREE.AmbientLight(0xffffff, 1);
    scene.add(ambientLight);

    // Ładowanie modelu
    const loader = new GLTFLoader();
    loader.load(
        '/models/nissan_gtr.glb',
        gltf => {
            scene.add(gltf.scene);
            gltf.scene.traverse(child => {
                if (child.isMesh) {
                    child.material.roughness = 0.5; // niskie = błyszczące
                    child.material.metalness = 0.9; // wysoki = metaliczny połysk
                    child.material.clearcoat = 1.0; // dodaje warstwę lakieru
                    child.material.clearcoatRoughness = 0.03; // gładki lakier
                }
            });
        },
        undefined,
        error => {
            console.error(error);
        }
    );

    // Kontrolki
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // Animacja
    const animate = function () {
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);

        // console.log(
        //     `Camera position: x=${camera.position.x.toFixed(
        //         2
        //     )}, y=${camera.position.y.toFixed(
        //         2
        //     )}, z=${camera.position.z.toFixed(2)}`
        // );
    };
    animate();

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
});
</script>

<style scoped>
canvas {
    display: block;
}
</style>
