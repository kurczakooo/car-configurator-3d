<script setup lang="ts">
import { useConfigurationStore } from '../stores/configuratorStore';
import type {
    availableCarParts,
    CarPartValueMap,
} from '../types/3dModelTypes';

const configuratorStore = useConfigurationStore();

type ConfigOption<T> = {
    label: string;
    value: T;
};

type ConfigSection<K extends availableCarParts> = {
    title: string;
    carPart: K;
    selected: () => CarPartValueMap[K];
    options: ConfigOption<CarPartValueMap[K]>[];
};

const configSections: ConfigSection<any>[] = [
    {
        title: 'Body color',
        carPart: 'body',
        selected: () => configuratorStore.bodyConfig.color,
        options: [
            { label: 'Black', value: 'black' },
            { label: 'White', value: 'white' },
            { label: 'Grey', value: 'grey' },
            { label: 'Red', value: 'red' },
            { label: 'Silver', value: 'silver' },
        ],
    },
    {
        title: 'Rims',
        carPart: 'rims',
        selected: () => configuratorStore.rimsConfig.color,
        options: [
            { label: 'Black', value: 'black' },
            { label: 'Silver', value: 'silver' },
        ],
    },
    {
        title: 'Brake calipers',
        carPart: 'calipers',
        selected: () => configuratorStore.calipersConfig.color,
        options: [
            { label: 'Black', value: 'black' },
            { label: 'Blue', value: 'blue' },
            { label: 'Grey', value: 'grey' },
            { label: 'Red', value: 'red' },
            { label: 'Yellow', value: 'yellow' },
        ],
    },
    {
        title: 'Window tint',
        carPart: 'all_windows',
        selected: () => configuratorStore.windowsConfig.color,
        options: [
            { label: '5%', value: 'black' },
            { label: '25%', value: 'grey' },
            { label: '50%', value: 'silver' },
            { label: '90%', value: 'white' },
        ],
    },
    {
        title: 'Engine',
        carPart: 'engine',
        selected: () => configuratorStore.engine,
        options: [
            { label: '2.0 TSI 245 HP', value: '2.0 TSI 245 HP' },
            { label: '2.0 TSI 300 HP', value: '2.0 TSI 300 HP' },
            { label: '2.0 TSI 320 HP', value: '2.0 TSI 320 HP' },
        ],
    },
    {
        title: 'Gearbox',
        carPart: 'gearbox',
        selected: () => configuratorStore.gearbox,
        options: [
            { label: 'Manual', value: 'Manual' },
            { label: 'DSG', value: 'DSG' },
        ],
    },
    {
        title: 'Drive',
        carPart: 'drive',
        selected: () => configuratorStore.drive,
        options: [
            { label: 'FWD', value: 'FWD' },
            { label: 'AWD 4Motion', value: 'AWD 4Motion' },
        ],
    },
];
</script>

<template>
    <div class="right-side-config-container">
        <h1 class="car-title">Volkswagen Golf 7 R</h1>

        <div
            v-for="section in configSections"
            :key="section.title"
            class="config-section"
        >
            <h2>{{ section.title }}</h2>

            <div class="option-grid">
                <button
                    v-for="option in section.options"
                    :key="option.value"
                    :class="{ selected: section.selected() === option.value }"
                    @click="
                        configuratorStore.setCarPartValue(
                            section.carPart,
                            option.value
                        )
                    "
                >
                    {{ option.label }}
                </button>
            </div>
        </div>
    </div>
</template>
