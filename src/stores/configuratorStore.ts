import { defineStore } from 'pinia';
import type {
    availableBodyColors,
    availableCaliperColors,
    availableRimsColors,
    availableWindowTints,
    bodyAttributes,
    calipersAttributes,
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
            metalness: 0.2,
            roughness: 0.6,
        },
    }),

    getters: {
        getBodyConfig: state => state.bodyConfig,
        getWindowsConfig: state => state.windowsConfig,
        getRimsConfig: state => state.rimsConfig,
        getCalipersConfig: state => state.calipersConfig,
        getSideMirrorsConfig: state => state.sideMirrorsConfig,
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
    },
});
