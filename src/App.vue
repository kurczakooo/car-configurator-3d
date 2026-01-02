<script setup>
import MainScene from './components/MainScene.vue';
import { useConfigurationStore } from './stores/configuratorStore';
import { use3dSceneStore } from './stores/3dSceneStore';
import { watchEffect } from 'vue';

const configStore = useConfigurationStore();
const sceneStore = use3dSceneStore();

// watch(
//     () => configStore.bodyConfig,
//     newConfig => {
//         sceneStore.updateBodyMaterial(newConfig);
//     },
//     { deep: true }
// );
watchEffect(() => {
    sceneStore.updateBodyMaterial(configStore.bodyConfig);
    sceneStore.updateWindowsMaterial(configStore.windowsConfig);
    sceneStore.updateRimsMaterial(configStore.rimsConfig);
    sceneStore.updateCalipersMaterial(configStore.calipersConfig);
    sceneStore.updateSideMirrorsMaterial(configStore.sideMirrorsConfig);
});
</script>

<template>
    <MainScene />
</template>
