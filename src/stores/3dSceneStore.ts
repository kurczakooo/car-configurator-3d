import { defineStore } from 'pinia';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader, type GLTF } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useConfigurationStore } from './configuratorStore';
import { markRaw } from 'vue';
import type {
    bodyAttributes,
    calipersAttributes,
    rimsAttributes,
    sideMirrorsAttributes,
    windowsAttributes,
} from '../types/3dModelTypes';

type CameraView = 'EXTERIOR' | 'INTERIOR';

type InteriorStateShape = {
    seatTone: string;
    screenColor: string;
};

type InteriorTargets = {
    seats: THREE.Mesh[];
    display: THREE.Mesh[];
};

type MatBase = {
    color?: THREE.Color;
    roughness?: number;
    metalness?: number;
    emissive?: THREE.Color;
    emissiveIntensity?: number;
};

export const use3dSceneStore = defineStore('3dSceneStore', {
    state: (): {
        width: number;
        height: number;

        scene: THREE.Scene;
        camera: THREE.PerspectiveCamera | null;
        renderer: THREE.WebGLRenderer;

        ambientLight: THREE.AmbientLight;
        dirLight: THREE.DirectionalLight;
        skybox: THREE.CubeTextureLoader | null;

        ground: THREE.Mesh | null;
        controls: OrbitControls | null;
        loader: GLTFLoader;

        cameraPosition: { x: any; y: any; z: any };

        cameraView: CameraView;
        carCenter: THREE.Vector3 | null;

        carRoot: THREE.Object3D | null;
        interiorTargets: InteriorTargets;
        interiorBase: Record<string, MatBase>;

        materials: {
            body: THREE.MeshPhysicalMaterial | null;
            windows: THREE.MeshPhysicalMaterial | null;
            rims: THREE.MeshPhysicalMaterial | null;
            calipers: THREE.MeshPhysicalMaterial | null;
            sideMirrors: THREE.MeshPhysicalMaterial | null;
        };
    } => ({
        width: 1,
        height: 1,

        scene: markRaw(new THREE.Scene()),
        camera: null,
        renderer: markRaw(new THREE.WebGLRenderer({ antialias: true })),

        ambientLight: markRaw(new THREE.AmbientLight(0xffffff, 0.8)),
        dirLight: markRaw(new THREE.DirectionalLight(0xffffff, 1)),
        skybox: null,

        ground: null,
        controls: null,
        loader: markRaw(new GLTFLoader()),

        cameraPosition: { x: 0, y: 0, z: 0 },

        cameraView: 'EXTERIOR',
        carCenter: null,

        carRoot: null,
        interiorTargets: { seats: [], display: [] },
        interiorBase: {},

        materials: {
            body: null,
            windows: null,
            rims: null,
            calipers: null,
            sideMirrors: null,
        },
    }),

    actions: {
        init3dScene(width: number, height: number, devicePixelRatio: number) {
            this.width = width;
            this.height = height;

            this.camera = markRaw(
                new THREE.PerspectiveCamera(40, this.width / this.height, 0.1, 100)
            );
            this.camera.position.set(2.92, 1.23, 4.18);

            this.renderer.setSize(this.width, this.height);
            this.renderer.setPixelRatio(devicePixelRatio);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            this.scene.add(this.ambientLight);

            this.dirLight.position.set(5, 10, 5);
            this.dirLight.castShadow = true;
            this.dirLight.shadow.mapSize.width = 2048;
            this.dirLight.shadow.mapSize.height = 2048;
            this.dirLight.shadow.camera.near = 0.5;
            this.dirLight.shadow.camera.far = 50;
            this.scene.add(this.dirLight);

            this.skybox = markRaw(
                new THREE.CubeTextureLoader().load([
                    '/env/20250701_162804_0694_rt.png',
                    '/env/20250701_162804_0694_lf.png',
                    '/env/20250701_162804_0694_up.png',
                    '/env/20250701_162804_0694_dn.png',
                    '/env/20250701_162804_0694_bk.png',
                    '/env/20250701_162804_0694_ft.png',
                ])
            );
            this.scene.environment = this.skybox;
            this.scene.background = this.skybox;

            const groundTexture = markRaw(
                new THREE.TextureLoader().load('/env/concrete.jpg', (texture: THREE.Texture) => {
                    texture.wrapS = THREE.RepeatWrapping;
                    texture.wrapT = THREE.RepeatWrapping;
                    texture.repeat.set(3, 3);
                    texture.colorSpace = THREE.SRGBColorSpace;
                })
            );

            this.ground = markRaw(
                new THREE.Mesh(
                    new THREE.PlaneGeometry(20, 20),
                    new THREE.MeshStandardMaterial({
                        map: groundTexture,
                        roughness: 0.9,
                        metalness: 0,
                    })
                )
            );
            this.ground.rotation.x = -Math.PI / 2;
            this.ground.receiveShadow = true;
            this.scene.add(this.ground);

            this.controls = markRaw(new OrbitControls(this.camera, this.renderer.domElement));
            this.controls.enableDamping = true;
            this.controls.target.set(0, 0.5, 0);

            this.applyCameraMode();
            this.controls.update();
        },

        loadModel(configuratorStore: ReturnType<typeof useConfigurationStore>) {
            this.materials.body = markRaw(new THREE.MeshPhysicalMaterial(configuratorStore.getBodyConfig));
            this.materials.windows = markRaw(new THREE.MeshPhysicalMaterial(configuratorStore.getWindowsConfig));
            this.materials.rims = markRaw(new THREE.MeshPhysicalMaterial(configuratorStore.getRimsConfig));
            this.materials.calipers = markRaw(new THREE.MeshPhysicalMaterial(configuratorStore.getCalipersConfig));
            this.materials.sideMirrors = markRaw(new THREE.MeshPhysicalMaterial(configuratorStore.getSideMirrorsConfig));

            this.loader.load(configuratorStore.modelPath, (gltf: GLTF) => {
                const car = gltf.scene.children[0];
                this.scaleToSize(car, 4);

                this.carRoot = car;

                this.carCenter = markRaw(
                    new THREE.Box3().setFromObject(car).getCenter(new THREE.Vector3())
                );

                const body = car.getObjectByName('body');
                const glass = car.getObjectByName('all_windows');
                const calipers = car.getObjectByName('calipers');
                const rims = car.getObjectByName('rims');
                const sideMirrors = car.getObjectByName('side_mirrors');

                if (body && this.materials.body) (body as any).material = this.materials.body;
                if (glass && this.materials.windows) (glass as any).material = this.materials.windows;
                if (calipers && this.materials.calipers) (calipers as any).material = this.materials.calipers;
                if (rims && this.materials.rims) (rims as any).material = this.materials.rims;
                if (sideMirrors && this.materials.sideMirrors) (sideMirrors as any).material = this.materials.sideMirrors;

                gltf.scene.traverse((obj: any) => {
                    if (obj.isMesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });

                this.scene.add(car);

                this.refreshInteriorTargets();
                this.captureInteriorBase();

                this.applyCameraMode();
            });
        },

        setCameraView(view: CameraView) {
            this.cameraView = view;
            this.applyCameraMode();
        },

        applyCameraMode() {
            if (!this.camera || !this.controls) return;

            if (this.cameraView === 'INTERIOR') {
                this.applyInteriorCamera();
                this.applyControlsForInterior();
            } else {
                this.applyExteriorCamera();
                this.applyControlsForExterior();
            }

            this.controls.update();
        },

        applyExteriorCamera() {
            if (!this.camera || !this.controls) return;

            this.camera.fov = 40;
            this.camera.updateProjectionMatrix();

            this.controls.target.set(0, 0.5, 0);
            this.camera.position.set(2.92, 1.23, 4.18);
        },

        applyInteriorCamera() {
            if (!this.camera || !this.controls) return;

            const c = this.carCenter ?? new THREE.Vector3(0, 0.9, 0);

            const seatPivot = c.clone().add(new THREE.Vector3(0.0, 0.30, -0.35));
            const camPos = seatPivot.clone().add(new THREE.Vector3(0.0, 0.0, -0.06));

            this.camera.fov = 65;
            this.camera.updateProjectionMatrix();

            this.controls.target.copy(seatPivot);
            this.camera.position.copy(camPos);
        },

        applyControlsForExterior() {
            if (!this.controls) return;

            this.controls.enablePan = false;
            this.controls.enableZoom = true;
            this.controls.enableRotate = true;

            this.controls.rotateSpeed = 1;

            this.controls.minDistance = 4;
            this.controls.maxDistance = 8;

            this.controls.minPolarAngle = 0;
            this.controls.maxPolarAngle = Math.PI / 2;

            this.controls.minAzimuthAngle = -Infinity;
            this.controls.maxAzimuthAngle = Infinity;
        },

        applyControlsForInterior() {
            if (!this.controls) return;

            this.controls.enablePan = false;
            this.controls.enableZoom = true;
            this.controls.enableRotate = true;

            this.controls.rotateSpeed = -1;

            this.controls.minDistance = 0.02;
            this.controls.maxDistance = 1.2;

            this.controls.minPolarAngle = 0;
            this.controls.maxPolarAngle = Math.PI;

            this.controls.minAzimuthAngle = -Infinity;
            this.controls.maxAzimuthAngle = Infinity;
        },

        refreshInteriorTargets() {
            this.interiorTargets = { seats: [], display: [] };
            if (!this.carRoot) return;

            this.carRoot.traverse((obj: any) => {
                if (!obj?.isMesh) return;
                const mesh = obj as THREE.Mesh;
                const n = String(mesh.name || '');

                if (n.includes('Leather_Int')) this.interiorTargets.seats.push(mesh);
                if (n.includes('display')) this.interiorTargets.display.push(mesh);
            });
        },

        captureInteriorBase() {
            this.interiorBase = {};
            const all = [...this.interiorTargets.seats, ...this.interiorTargets.display];

            for (const mesh of all) {
                const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                for (const m of mats as any[]) {
                    if (!m?.uuid) continue;
                    if (this.interiorBase[m.uuid]) continue;

                    const base: MatBase = {};
                    if (m.color) base.color = m.color.clone();
                    if (typeof m.roughness === 'number') base.roughness = m.roughness;
                    if (typeof m.metalness === 'number') base.metalness = m.metalness;
                    if (m.emissive) base.emissive = m.emissive.clone();
                    if (typeof m.emissiveIntensity === 'number') base.emissiveIntensity = m.emissiveIntensity;

                    this.interiorBase[m.uuid] = base;
                }
            }
        },

        applyInteriorFromState(state: InteriorStateShape) {
            if (!this.carRoot) return;

            if (Object.keys(this.interiorBase).length === 0) {
                this.refreshInteriorTargets();
                this.captureInteriorBase();
            }

            const seat = this.mapSeatTone(state.seatTone);
            this.tintGroup(this.interiorTargets.seats, seat.tint, seat.roughnessDelta, 0, seat.strength);

            const screen = this.mapScreenColor(state.screenColor);
            this.setEmissiveGroup(this.interiorTargets.display, screen.color, screen.intensity);
        },

        tintGroup(
            meshes: THREE.Mesh[],
            tintColor: THREE.Color,
            roughnessDelta: number,
            metalnessDelta: number,
            strength: number
        ) {
            for (const mesh of meshes) {
                const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                for (const m of mats as any[]) {
                    const base = this.interiorBase[m?.uuid];
                    if (!base) continue;

                    if (m.color && base.color) {
                        m.color.copy(base.color.clone().lerp(tintColor, strength));
                        m.needsUpdate = true;
                    }

                    if (typeof base.roughness === 'number' && typeof m.roughness === 'number') {
                        m.roughness = this.clamp01(base.roughness + roughnessDelta);
                        m.needsUpdate = true;
                    }

                    if (typeof base.metalness === 'number' && typeof m.metalness === 'number') {
                        m.metalness = this.clamp01(base.metalness + metalnessDelta);
                        m.needsUpdate = true;
                    }
                }
            }
        },

        setEmissiveGroup(meshes: THREE.Mesh[], color: THREE.Color, intensity: number) {
            for (const mesh of meshes) {
                const mats = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
                for (const m of mats as any[]) {
                    const base = this.interiorBase[m?.uuid];
                    if (!base) continue;

                    if (!m.emissive || typeof m.emissiveIntensity !== 'number') continue;

                    const baseEm = base.emissive ? base.emissive.clone() : new THREE.Color('#000000');
                    const baseInt = typeof base.emissiveIntensity === 'number' ? base.emissiveIntensity : 0;

                    m.emissive.copy(baseEm.clone().lerp(color, 0.9));
                    m.emissiveIntensity = Math.max(baseInt, intensity);
                    m.needsUpdate = true;
                }
            }
        },

        mapSeatTone(v: string) {
            if (v === 'Alcantara') return { tint: new THREE.Color('#151515'), roughnessDelta: 0.18, strength: 0.16 };
            return { tint: new THREE.Color('#1f1f1f'), roughnessDelta: 0.08, strength: 0.12 };
        },

        mapScreenColor(v: string) {
            const color =
                v === 'Red' ? new THREE.Color('#ff3b30')
                    : v === 'White' ? new THREE.Color('#ffffff')
                        : v === 'Green' ? new THREE.Color('#34c759')
                            : new THREE.Color('#2b6cff');

            return { color, intensity: 1.4 };
        },

        clamp01(n: number) {
            return Math.max(0, Math.min(1, n));
        },

        updateBodyMaterial(config: bodyAttributes) {
            if (!this.materials.body) return;

            this.materials.body.color.set(config.color);
            this.materials.body.metalness = config.metalness;
            this.materials.body.roughness = config.roughness;
            this.materials.body.clearcoat = config.clearcoat;
            this.materials.body.clearcoatRoughness = config.clearcoatRoughness;
            this.materials.body.needsUpdate = true;
        },

        updateWindowsMaterial(config: windowsAttributes) {
            if (!this.materials.windows) return;

            this.materials.windows.color.set(config.color);
            this.materials.windows.metalness = config.metalness;
            this.materials.windows.roughness = config.roughness;
            this.materials.windows.transmission = config.transmission;
            this.materials.windows.needsUpdate = true;
        },

        updateRimsMaterial(config: rimsAttributes) {
            if (!this.materials.rims) return;

            this.materials.rims.color.set(config.color);
            this.materials.rims.metalness = config.metalness;
            this.materials.rims.roughness = config.roughness;
            this.materials.rims.needsUpdate = true;
        },

        updateSideMirrorsMaterial(config: sideMirrorsAttributes) {
            if (!this.materials.sideMirrors) return;

            this.materials.sideMirrors.color.set(config.color);
            this.materials.sideMirrors.metalness = config.metalness;
            this.materials.sideMirrors.roughness = config.roughness;
            this.materials.sideMirrors.clearcoat = config.clearcoat;
            this.materials.sideMirrors.clearcoatRoughness = config.clearcoatRoughness;
            this.materials.sideMirrors.needsUpdate = true;
        },

        updateCalipersMaterial(config: calipersAttributes) {
            if (!this.materials.calipers) return;

            this.materials.calipers.color.set(config.color);
            this.materials.calipers.metalness = config.metalness;
            this.materials.calipers.roughness = config.roughness;
            this.materials.calipers.needsUpdate = true;
        },

        scaleToSize(object: THREE.Object3D, targetLength = 4) {
            const box = markRaw(new THREE.Box3().setFromObject(object));
            const size = markRaw(new THREE.Vector3());
            box.getSize(size);

            const currentLength = Math.max(size.x, size.z);
            const scale = targetLength / currentLength;
            object.scale.setScalar(scale);

            box.setFromObject(object);
            const center = markRaw(new THREE.Vector3());
            box.getCenter(center);

            object.position.sub(center);
            object.position.y += (size.y * scale) / 2;
        },

        updateCameraPosition() {
            if (!this.camera) return;

            this.cameraPosition.x = this.camera.position.x;
            this.cameraPosition.y = this.camera.position.y;
            this.cameraPosition.z = this.camera.position.z;
        },
    },
});
