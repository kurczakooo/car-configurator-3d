<script setup lang="ts">
import { computed, watch } from 'vue';
import { useConfigurationStore } from '../stores/configuratorStore';
import {
    use3dSceneStore,
    type EnvPresetName,
    type GroundPresetName,
} from '../stores/3dSceneStore';
import { useInteriorStore } from '../stores/interiorStore';
import type { availableCarParts, CarPartValueMap } from '../types/3dModelTypes';

const configuratorStore = useConfigurationStore();
const sceneStore = use3dSceneStore();
const interiorStore = useInteriorStore();

const ENV_OPTIONS: { label: string; value: EnvPresetName }[] = [
    { label: 'Studio', value: 'Studio' },
    { label: 'City', value: 'City' },
];

const GROUND_OPTIONS: { label: string; value: GroundPresetName }[] = [
    { label: 'Concrete', value: 'Concrete' },
    { label: 'Asphalt', value: 'Asphalt' },
    { label: 'Tiles', value: 'Tiles' },
];

const BASE_PRICE_USD = 32000;

const PRICE_ENGINE: Record<string, number> = {
    '2.0 TSI 245 HP': 0,
    '2.0 TSI 300 HP': 1800,
    '2.0 TSI 320 HP': 3200,
};

const PRICE_RIMS: Record<string, number> = {
    silver: 0,
    black: 650,
};

const PRICE_GEARBOX: Record<string, number> = {
    Manual: 0,
    DSG: 1900,
};

const PRICE_DRIVE: Record<string, number> = {
    FWD: 0,
    'AWD 4Motion': 2400,
};

const PRICE_SEAT_TONE: Record<string, number> = {
    Leather: 0,
    Alcantara: 1100,
};

const PRICE_SCREEN_COLOR: Record<string, number> = {
    Blue: 0,
    Red: 0,
    White: 0,
    Green: 0,
};

const PRICE_BODY_COLOR: Record<string, number> = {
    black: 0,
    white: 350,
    blue: 520,
    red: 480,
    silver: 290,
};

const PRICE_CALIPERS_COLOR: Record<string, number> = {
    black: 0,
    blue: 70,
    grey: 40,
    red: 95,
    yellow: 110,
};

const PRICE_WINDOW_TINT: Record<string, number> = {
    black: 180,
    grey: 120,
    silver: 60,
    white: 0,
};

const PRICE_MIRRORS_COLOR: Record<string, number> = {
    black: 0,
    white: 80,
    blue: 120,
    red: 120,
    silver: 60,
};

type ConfigOption<T> = { label: string; value: T; priceUsd?: number };

type ExteriorSection<K extends availableCarParts> = {
    title: string;
    carPart: K;
    selected: () => CarPartValueMap[K];
    options: ConfigOption<CarPartValueMap[K]>[];
};

type InteriorSection<T extends string> = {
    title: string;
    selected: () => T;
    setSelected: (v: T) => void;
    options: ConfigOption<T>[];
};

const exteriorSections: ExteriorSection<availableCarParts>[] = [
    {
        title: 'Body',
        carPart: 'body',
        selected: () => configuratorStore.bodyConfig.color,
        options: [
            {
                label: 'Black',
                value: 'black',
                priceUsd: PRICE_BODY_COLOR.black,
            },
            {
                label: 'White',
                value: 'white',
                priceUsd: PRICE_BODY_COLOR.white,
            },
            { label: 'Blue', value: 'blue', priceUsd: PRICE_BODY_COLOR.blue },
            { label: 'Red', value: 'red', priceUsd: PRICE_BODY_COLOR.red },
            {
                label: 'Silver',
                value: 'silver',
                priceUsd: PRICE_BODY_COLOR.silver,
            },
        ],
    },
    {
        title: 'Rims',
        carPart: 'rims',
        selected: () => configuratorStore.rimsConfig.color,
        options: [
            { label: 'Silver', value: 'silver', priceUsd: PRICE_RIMS.silver },
            { label: 'Black', value: 'black', priceUsd: PRICE_RIMS.black },
        ],
    },
    {
        title: 'Brake calipers',
        carPart: 'calipers',
        selected: () => configuratorStore.calipersConfig.color,
        options: [
            {
                label: 'Black',
                value: 'black',
                priceUsd: PRICE_CALIPERS_COLOR.black,
            },
            {
                label: 'Blue',
                value: 'blue',
                priceUsd: PRICE_CALIPERS_COLOR.blue,
            },
            {
                label: 'Grey',
                value: 'grey',
                priceUsd: PRICE_CALIPERS_COLOR.grey,
            },
            { label: 'Red', value: 'red', priceUsd: PRICE_CALIPERS_COLOR.red },
            {
                label: 'Yellow',
                value: 'yellow',
                priceUsd: PRICE_CALIPERS_COLOR.yellow,
            },
        ],
    },
    {
        title: 'Window tint',
        carPart: 'all_windows',
        selected: () => configuratorStore.windowsConfig.color,
        options: [
            {
                label: 'Black',
                value: 'black',
                priceUsd: PRICE_WINDOW_TINT.black,
            },
            { label: 'Grey', value: 'grey', priceUsd: PRICE_WINDOW_TINT.grey },
            {
                label: 'Silver',
                value: 'silver',
                priceUsd: PRICE_WINDOW_TINT.silver,
            },
            {
                label: 'White',
                value: 'white',
                priceUsd: PRICE_WINDOW_TINT.white,
            },
        ],
    },
    {
        title: 'Side mirrors',
        carPart: 'side_mirrors',
        selected: () => configuratorStore.sideMirrorsConfig.color,
        options: [
            {
                label: 'Black',
                value: 'black',
                priceUsd: PRICE_MIRRORS_COLOR.black,
            },
            {
                label: 'White',
                value: 'white',
                priceUsd: PRICE_MIRRORS_COLOR.white,
            },
            {
                label: 'Blue',
                value: 'blue',
                priceUsd: PRICE_MIRRORS_COLOR.blue,
            },
            { label: 'Red', value: 'red', priceUsd: PRICE_MIRRORS_COLOR.red },
            {
                label: 'Silver',
                value: 'silver',
                priceUsd: PRICE_MIRRORS_COLOR.silver,
            },
        ],
    },
    {
        title: 'Engine',
        carPart: 'engine',
        selected: () => configuratorStore.engine,
        options: [
            {
                label: '2.0 TSI 245 HP',
                value: '2.0 TSI 245 HP',
                priceUsd: PRICE_ENGINE['2.0 TSI 245 HP'],
            },
            {
                label: '2.0 TSI 300 HP',
                value: '2.0 TSI 300 HP',
                priceUsd: PRICE_ENGINE['2.0 TSI 300 HP'],
            },
            {
                label: '2.0 TSI 320 HP',
                value: '2.0 TSI 320 HP',
                priceUsd: PRICE_ENGINE['2.0 TSI 320 HP'],
            },
        ],
    },
    {
        title: 'Gearbox',
        carPart: 'gearbox',
        selected: () => configuratorStore.gearbox,
        options: [
            {
                label: 'Manual',
                value: 'Manual',
                priceUsd: PRICE_GEARBOX.Manual,
            },
            { label: 'DSG', value: 'DSG', priceUsd: PRICE_GEARBOX.DSG },
        ],
    },
    {
        title: 'Drive',
        carPart: 'drive',
        selected: () => configuratorStore.drive,
        options: [
            { label: 'FWD', value: 'FWD', priceUsd: PRICE_DRIVE.FWD },
            {
                label: 'AWD 4Motion',
                value: 'AWD 4Motion',
                priceUsd: PRICE_DRIVE['AWD 4Motion'],
            },
        ],
    },
];

const interiorSections: InteriorSection<string>[] = [
    {
        title: 'Seat tone',
        selected: () => interiorStore.seatTone,
        setSelected: v => interiorStore.setSeatTone(v as any),
        options: [
            {
                label: 'Leather',
                value: 'Leather',
                priceUsd: PRICE_SEAT_TONE.Leather,
            },
            {
                label: 'Alcantara',
                value: 'Alcantara',
                priceUsd: PRICE_SEAT_TONE.Alcantara,
            },
        ],
    },
    {
        title: 'Screen color',
        selected: () => interiorStore.screenColor,
        setSelected: v => interiorStore.setScreenColor(v as any),
        options: [
            { label: 'Blue', value: 'Blue', priceUsd: PRICE_SCREEN_COLOR.Blue },
            { label: 'Red', value: 'Red', priceUsd: PRICE_SCREEN_COLOR.Red },
            {
                label: 'White',
                value: 'White',
                priceUsd: PRICE_SCREEN_COLOR.White,
            },
            {
                label: 'Green',
                value: 'Green',
                priceUsd: PRICE_SCREEN_COLOR.Green,
            },
        ],
    },
];

const isExterior = computed(() => sceneStore.cameraView === 'EXTERIOR');

watch(
    () => [interiorStore.seatTone, interiorStore.screenColor],
    () => {
        sceneStore.applyInteriorFromState(interiorStore.$state as any);
    },
    { immediate: true }
);

function getPrice(map: Record<string, number>, key: unknown) {
    return map[String(key)] ?? 0;
}

const addOnPriceUsd = computed(() => {
    const body = getPrice(PRICE_BODY_COLOR, configuratorStore.bodyConfig.color);
    const rims = getPrice(PRICE_RIMS, configuratorStore.rimsConfig.color);
    const calipers = getPrice(
        PRICE_CALIPERS_COLOR,
        configuratorStore.calipersConfig.color
    );
    const windows = getPrice(
        PRICE_WINDOW_TINT,
        configuratorStore.windowsConfig.color
    );
    const mirrors = getPrice(
        PRICE_MIRRORS_COLOR,
        configuratorStore.sideMirrorsConfig.color
    );

    const engine = getPrice(PRICE_ENGINE, configuratorStore.engine);
    const gearbox = getPrice(PRICE_GEARBOX, configuratorStore.gearbox);
    const drive = getPrice(PRICE_DRIVE, configuratorStore.drive);

    const seat = getPrice(PRICE_SEAT_TONE, interiorStore.seatTone);
    const screen = getPrice(PRICE_SCREEN_COLOR, interiorStore.screenColor);

    return (
        body +
        rims +
        calipers +
        windows +
        mirrors +
        engine +
        gearbox +
        drive +
        seat +
        screen
    );
});

const totalPriceUsd = computed(() => BASE_PRICE_USD + addOnPriceUsd.value);

function formatUsd(v: number) {
    return `$${v.toLocaleString('en-US')}`;
}
</script>

<template>
    <div class="right-side-config-container panel-layout">
        <div class="panel-header">
            <h1 class="car-title">Volkswagen Golf 7 R</h1>

            <div class="camera-switch-wrap">
                <div class="option-grid camera-switch-grid">
                    <button
                        :class="{
                            selected: sceneStore.cameraView === 'EXTERIOR',
                        }"
                        @click="sceneStore.setCameraView('EXTERIOR')"
                    >
                        <div class="btn-label">Exterior</div>
                        <div class="btn-price">View</div>
                    </button>

                    <button
                        :class="{
                            selected: sceneStore.cameraView === 'INTERIOR',
                        }"
                        @click="sceneStore.setCameraView('INTERIOR')"
                    >
                        <div class="btn-label">Interior</div>
                        <div class="btn-price">View</div>
                    </button>
                </div>
            </div>
        </div>

        <div class="panel-scroll">
            <div class="config-section">
                <h2>Environment</h2>
                <div class="option-grid">
                    <button
                        v-for="o in ENV_OPTIONS"
                        :key="o.value"
                        :class="{
                            selected: sceneStore.environmentName === o.value,
                        }"
                        @click="sceneStore.setEnvironment(o.value)"
                    >
                        <div class="btn-label">{{ o.label }}</div>
                        <div class="btn-price">Background</div>
                    </button>
                </div>
            </div>

            <div class="config-section">
                <h2>Ground</h2>
                <div class="option-grid">
                    <button
                        v-for="o in GROUND_OPTIONS"
                        :key="o.value"
                        :class="{ selected: sceneStore.groundName === o.value }"
                        @click="sceneStore.setGround(o.value)"
                    >
                        <div class="btn-label">{{ o.label }}</div>
                        <div class="btn-price">Surface</div>
                    </button>
                </div>
            </div>

            <template v-if="isExterior">
                <div
                    v-for="section in exteriorSections"
                    :key="section.title"
                    class="config-section"
                >
                    <h2>{{ section.title }}</h2>

                    <div class="option-grid">
                        <button
                            v-for="option in section.options"
                            :key="String(option.value)"
                            :class="{
                                selected: section.selected() === option.value,
                            }"
                            @click="
                                configuratorStore.setCarPartValue(
                                    section.carPart,
                                    option.value
                                )
                            "
                        >
                            <div class="btn-label">{{ option.label }}</div>
                            <div class="btn-price">
                                {{ formatUsd(option.priceUsd ?? 0) }}
                            </div>
                        </button>
                    </div>
                </div>
            </template>

            <template v-else>
                <div
                    v-for="section in interiorSections"
                    :key="section.title"
                    class="config-section"
                >
                    <h2>{{ section.title }}</h2>

                    <div class="option-grid">
                        <button
                            v-for="option in section.options"
                            :key="String(option.value)"
                            :class="{
                                selected: section.selected() === option.value,
                            }"
                            @click="section.setSelected(option.value)"
                        >
                            <div class="btn-label">{{ option.label }}</div>
                            <div class="btn-price">
                                {{ formatUsd(option.priceUsd ?? 0) }}
                            </div>
                        </button>
                    </div>
                </div>
            </template>

            <div class="scroll-spacer"></div>
        </div>

        <div class="panel-footer">
            <div class="pricing-rows">
                <div class="pricing-row">
                    <div class="pricing-label">Base price</div>
                    <div class="pricing-value">
                        {{ formatUsd(BASE_PRICE_USD) }}
                    </div>
                </div>
                <div class="pricing-row">
                    <div class="pricing-label">Options</div>
                    <div class="pricing-value">
                        {{ formatUsd(addOnPriceUsd) }}
                    </div>
                </div>
                <div class="pricing-row total">
                    <div class="pricing-label">Total</div>
                    <div class="pricing-value">
                        {{ formatUsd(totalPriceUsd) }}
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
.panel-layout {
    height: 100%;
    display: flex;
    flex-direction: column;
    min-height: 0;
    overflow: hidden;
}

.panel-header {
    flex: 0 0 auto;
}

.panel-scroll {
    flex: 1 1 auto;
    min-height: 0;
    overflow-y: auto;
    padding-bottom: 0;
}

.panel-footer {
    margin-bottom: 30px;
    flex: 0 0 auto;
    padding: 14px 12px calc(14px + env(safe-area-inset-bottom));
    border-radius: 12px;
}

.scroll-spacer {
    height: 10px;
}

.camera-switch-wrap {
    display: flex;
    justify-content: center;
    margin: 10px 0 14px;
}

.camera-switch-grid {
    width: min(420px, 100%);
}

.btn-label {
    font-weight: 600;
    line-height: 1.1;
}

.btn-price {
    margin-top: 6px;
    font-size: 12px;
    opacity: 0.8;
}

.pricing-rows {
    display: grid;
    gap: 8px;
}

.pricing-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
}

.pricing-row.total .pricing-label,
.pricing-row.total .pricing-value {
    font-size: 16px;
    font-weight: 700;
}
</style>
