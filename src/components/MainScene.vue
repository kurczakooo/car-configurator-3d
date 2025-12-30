<template>
    <div class="screen-container">
        <ConfigSelectionComponent />
        <div ref="container" class="viewer"></div>
        <!-- <div class="camera-debug">
            {{ cameraInfo }}
        </div> -->
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, nextTick, computed } from 'vue';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useConfigurationStore } from '../stores/configuratorStore';
import { use3dSceneStore } from '../stores/3dSceneStore';
import ConfigSelectionComponent from './ConfigSelectionComponent.vue';

const container = ref(null);
const sceneStore = use3dSceneStore();
const configuratorStore = useConfigurationStore();
let animationId;

// const cameraInfo = computed(() => {
//     const p = sceneStore.cameraPosition;
//     return `x: ${p.x.toFixed(2)} y: ${p.y.toFixed(2)} z: ${p.z.toFixed(2)}`;
// });

onMounted(async () => {
    await nextTick();

    sceneStore.init3dScene(
        container.value.clientWidth,
        container.value.clientHeight,
        window.devicePixelRatio,
        configuratorStore
    );
    sceneStore.loadModel('/models/golf/r_modded.glb', configuratorStore);

    container.value.appendChild(sceneStore.renderer.domElement);

    animate();
    window.addEventListener('resize', onResize);
});

function animate() {
    animationId = requestAnimationFrame(animate);
    // sceneStore.updateCameraPosition();
    sceneStore.controls.update();
    sceneStore.renderer.render(sceneStore.scene, sceneStore.camera);
}

function onResize() {
    const w = container.value.clientWidth;
    const h = container.value.clientHeight;
    sceneStore.camera.aspect = w / h;
    sceneStore.camera.updateProjectionMatrix();
    sceneStore.renderer.setSize(w, h);
}

onBeforeUnmount(() => {
    cancelAnimationFrame(animationId);
    sceneStore.renderer.dispose();
    window.removeEventListener('resize', onResize);
});
</script>
