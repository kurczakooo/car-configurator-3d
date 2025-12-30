export type availableCarParts =
    | 'body'
    | 'all_windows'
    | 'rims'
    | 'calipers'
    | 'side_mirrors';

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

export type availableWindowTints = 'black' | 'grey' | 'silver' | 'white';

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
}
