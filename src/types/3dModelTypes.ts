export type availableCarParts =
    | 'body'
    | 'all_windows'
    | 'rims'
    | 'side_mirrors'
    | 'calipers'
    | 'engine'
    | 'gearbox'
    | 'drive'
    | 'package';

export type availableBodyColors =
    | 'white'
    | 'blue'
    | 'silver'
    | 'black'
    | 'grey'
    | 'red';

export type availableCaliperColors =
    | 'blue'
    | 'black'
    | 'grey'
    | 'red'
    | 'yellow';

export type availableRimsColors = 'silver' | 'black';

export type availableWindowTints =
    | 'black'
    | 'grey'
    | 'silver'
    | 'white';

export type availableEngines =
    | '2.0 TSI 245 HP'
    | '2.0 TSI 300 HP'
    | '2.0 TSI 320 HP';

export type availableGearboxes = 'Manual' | 'DSG';

export type availableDrives = 'FWD' | 'AWD 4Motion';

export type availablePackages = 'Standard' | 'Sport' | 'Performance';

export interface bodyAttributes {
    color: availableBodyColors;
    metalness: number;
    roughness: number;
    clearcoat: number;
    clearcoatRoughness: number;
}

export interface windowsAttributes {
    color: availableWindowTints;
    metalness: number;
    roughness: number;
    transmission: number;
}

export interface calipersAttributes {
    color: availableCaliperColors;
    metalness: number;
    roughness: number;
}

export interface rimsAttributes {
    color: availableRimsColors;
    metalness: number;
    roughness: number;
}

export interface sideMirrorsAttributes {
    color: availableBodyColors;
    metalness: number;
    roughness: number;
    clearcoat: number;
    clearcoatRoughness: number;
}

export type CarPartValueMap = {
    body: availableBodyColors;
    all_windows: availableWindowTints;
    rims: availableRimsColors;
    calipers: availableCaliperColors;
    side_mirrors: availableBodyColors;

    engine: availableEngines;
    gearbox: availableGearboxes;
    drive: availableDrives;
    package: availablePackages;
};
