import { defineStore } from 'pinia';
import type {
    bodyAttributes,
    windowsAttributes,
    rimsAttributes,
    calipersAttributes,
    sideMirrorsAttributes,
    availableCarParts,
    CarPartValueMap,
} from '../types/3dModelTypes';

export const useConfigurationStore = defineStore('configurationStore', {
    state: () => ({
        bodyConfig: {
            color: 'white',
            metalness: 0.8,
            roughness: 0.8,
            clearcoat: 0.1,
            clearcoatRoughness: 0.01,
        } as bodyAttributes,

        windowsConfig: {
            color: 'grey',
            metalness: 0.25,
            roughness: 0,
            transmission: 1,
        } as windowsAttributes,

        rimsConfig: {
            color: 'silver',
            metalness: 1,
            roughness: 0.01,
        } as rimsAttributes,

        calipersConfig: {
            color: 'blue',
            metalness: 0.8,
            roughness: 0.9,
        } as calipersAttributes,

        sideMirrorsConfig: {
            color: 'black',
            metalness: 0.8,
            roughness: 0.8,
            clearcoat: 0.1,
            clearcoatRoughness: 0.01,
        } as sideMirrorsAttributes,

        modelPath: '/models/golf/r_modded.glb',

        engine: '2.0 TSI 300 HP',
        gearbox: 'DSG',
        drive: 'AWD 4Motion',
        package: 'Sport',
    }),

    actions: {
        setCarPartValue<K extends availableCarParts>(
            carPart: K,
            value: CarPartValueMap[K]
        ) {
            switch (carPart) {
                case 'body':
                    this.bodyConfig.color = value as CarPartValueMap['body'];
                    break;

                case 'all_windows':
                    this.windowsConfig.color = value as CarPartValueMap['all_windows'];
                    break;

                case 'rims':
                    this.rimsConfig.color = value as CarPartValueMap['rims'];
                    break;

                case 'calipers':
                    this.calipersConfig.color = value as CarPartValueMap['calipers'];
                    break;

                case 'side_mirrors':
                    this.sideMirrorsConfig.color =
                        value as CarPartValueMap['side_mirrors'];
                    break;

                case 'engine':
                    this.engine = value as CarPartValueMap['engine'];
                    break;

                case 'gearbox':
                    this.gearbox = value as CarPartValueMap['gearbox'];
                    break;

                case 'drive':
                    this.drive = value as CarPartValueMap['drive'];
                    break;
            }
        },
    },
});
