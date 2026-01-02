import { defineStore } from 'pinia';
import type {
    availableBodyColors,
    availableCaliperColors,
    availableCarParts,
    availableRimsColors,
    availableWindowTints,
    bodyAttributes,
    calipersAttributes,
    CarPartColorMap,
    rimsAttributes,
    sideMirrorsAttributes,
    windowsAttributes,
} from '../types/3dModelTypes';

export const useConfigurationStore = defineStore('configurationStore', {
    state: (): {
        bodyConfig: bodyAttributes;
        windowsConfig: windowsAttributes;
        rimsConfig: rimsAttributes;
        calipersConfig: calipersAttributes;
        sideMirrorsConfig: sideMirrorsAttributes;
        modelPath: string;
    } => ({
        bodyConfig: {
            color: 'white',
            metalness: 0.8,
            roughness: 0.8,
            clearcoat: 0.1,
            clearcoatRoughness: 0.01,
        },
        windowsConfig: {
            color: 'grey',
            metalness: 0.25,
            roughness: 0,
            transmission: 1,
        },
        rimsConfig: {
            color: 'silver',
            metalness: 1,
            roughness: 0.01,
        },
        calipersConfig: {
            color: 'blue',
            metalness: 0.8,
            roughness: 0.9,
        },
        sideMirrorsConfig: {
            color: 'black',
            metalness: 0.8,
            roughness: 0.8,
            clearcoat: 0.1,
            clearcoatRoughness: 0.01,
        },
        modelPath: '/models/golf/r_modded.glb',
    }),

    getters: {
        getBodyConfig: state => state.bodyConfig,
        getWindowsConfig: state => state.windowsConfig,
        getRimsConfig: state => state.rimsConfig,
        getCalipersConfig: state => state.calipersConfig,
        getSideMirrorsConfig: state => state.sideMirrorsConfig,
        getModelPath: state => state.modelPath,
    },

    actions: {
        setBodyColor(color: availableBodyColors) {
            this.bodyConfig.color = color;
        },
        setWindowsColor(color: availableWindowTints) {
            this.windowsConfig.color = color;
        },
        setRimsColor(color: availableRimsColors) {
            this.rimsConfig.color = color;
        },
        setCalipersColor(color: availableCaliperColors) {
            this.calipersConfig.color = color;
        },
        setSideMirrorsColor(color: availableBodyColors) {
            this.sideMirrorsConfig.color = color;
        },
        setCarPartColor(
            carPart: availableCarParts,
            color:
                | availableBodyColors
                | availableCaliperColors
                | availableRimsColors
                | availableWindowTints
        ) {
            switch (carPart) {
                case 'all_windows':
                    this.setWindowsColor(color);
                    break;
                case 'body':
                    this.setBodyColor(color);
                    break;
                case 'calipers':
                    this.setCalipersColor(color);
                    break;
                case 'rims':
                    this.setRimsColor(color);
                    break;
                case 'side_mirrors':
                    this.setSideMirrorsColor(color);
                    break;
            }
            console.log(this.bodyConfig.color);
        },
    },
});
