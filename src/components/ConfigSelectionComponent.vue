<script setup lang="ts">
import { use3dSceneStore } from '../stores/3dSceneStore';
import { useConfigurationStore } from '../stores/configuratorStore';
import type {
    availableBodyColors,
    availableCaliperColors,
    availableCarParts,
    availableRimsColors,
    availableWindowTints,
} from '../types/3dModelTypes';

const configuratorStore = useConfigurationStore();
const sceneStore = use3dSceneStore();

function toggleColorChange(
    carPart: availableCarParts,
    color:
        | availableBodyColors
        | availableCaliperColors
        | availableRimsColors
        | availableWindowTints
) {
    configuratorStore.setCarPartColor(carPart, color);
    // sceneStore.removeCarModelFromScene();
    // sceneStore.loadModel(configuratorStore);
}
</script>

<template>
    <div class="right-side-config-container">
        <h1>Volkswagen Golf 7 R</h1>
        <button @click="toggleColorChange('body', 'black')">Body: black</button>
        <button @click="toggleColorChange('body', 'white')">Body: white</button>
        <button @click="toggleColorChange('body', 'grey')">Body: grey</button>
        <button @click="toggleColorChange('body', 'red')">Body: red</button>
        <button @click="toggleColorChange('body', 'silver')">
            Body: silver
        </button>

        <p>===============================================</p>
        <button @click="toggleColorChange('rims', 'black')">Rims: black</button>
        <button @click="toggleColorChange('rims', 'silver')">
            Rims: silver
        </button>

        <p>===============================================</p>
        <button @click="toggleColorChange('calipers', 'black')">
            Calipers: black
        </button>
        <button @click="toggleColorChange('calipers', 'blue')">
            Calipers: blue
        </button>
        <button @click="toggleColorChange('calipers', 'grey')">
            Calipers: grey
        </button>
        <button @click="toggleColorChange('calipers', 'red')">
            Calipers: red
        </button>
        <button @click="toggleColorChange('calipers', 'yellow')">
            Calipers: yellow
        </button>

        <p>===============================================</p>
        <button @click="toggleColorChange('all_windows', 'black')">
            Windows: 5%
        </button>
        <button @click="toggleColorChange('all_windows', 'grey')">
            Windows: 25%
        </button>
        <button @click="toggleColorChange('all_windows', 'silver')">
            Windows: 50%
        </button>
        <button @click="toggleColorChange('all_windows', 'white')">
            Windows: 90%
        </button>

        <p>===============================================</p>
        <button @click="toggleColorChange('side_mirrors', 'black')">
            Mirrors: black
        </button>
        <button @click="toggleColorChange('side_mirrors', 'white')">
            Mirrors: white
        </button>
        <button @click="toggleColorChange('side_mirrors', 'grey')">
            Mirrors: grey
        </button>
        <button @click="toggleColorChange('side_mirrors', 'red')">
            Mirrors: red
        </button>
        <button @click="toggleColorChange('side_mirrors', 'silver')">
            Mirrors: silver
        </button>

        <p>===============================================</p>
    </div>
</template>
