import { defineStore } from 'pinia';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useConfigurationStore } from './configuratorStore';
import { markRaw } from 'vue';
import type {
    bodyAttributes,
    calipersAttributes,
    rimsAttributes,
    sideMirrorsAttributes,
    windowsAttributes,
} from '../types/3dModelTypes';

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
        materials: {
            body: null,
            windows: null,
            rims: null,
            calipers: null,
            sideMirrors: null,
        },
    }),

    getters: {},

    actions: {
        init3dScene(width: number, height: number, devicePixelRatio: number) {
            this.width = width;
            this.height = height;

            // Camera
            this.camera = markRaw(
                new THREE.PerspectiveCamera(
                    40,
                    this.width / this.height,
                    0.1,
                    100
                )
            );
            this.camera.position.set(2.92, 1.23, 4.18);

            // Renderer
            this.renderer.setSize(this.width, this.height);
            this.renderer.setPixelRatio(devicePixelRatio);
            this.renderer.shadowMap.enabled = true;
            this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

            // Lights
            this.scene.add(this.ambientLight);
            this.dirLight.position.set(5, 10, 5);
            this.dirLight.castShadow = true;
            this.scene.add(this.dirLight);

            // Skybox
            this.skybox = markRaw(
                new THREE.CubeTextureLoader().setPath('/env/').load([
                    '20250701_162804_0694_lf.png', // px → right
                    '20250701_162804_0694_rt.png', // nx → left
                    '20250701_162804_0694_up.png', // py → up
                    '20250701_162804_0694_dn.png', // ny → down
                    '20250701_162804_0694_ft.png', // nz → back
                    '20250701_162804_0694_bk.png', // pz → front
                ])
            );
            this.scene.environment = this.skybox;
            this.scene.background = this.skybox;

            // Ground
            const groundTexture = markRaw(
                new THREE.TextureLoader().load(
                    '/env/concrete.jpg',
                    (texture: THREE.Texture) => {
                        texture.wrapS = THREE.RepeatWrapping;
                        texture.wrapT = THREE.RepeatWrapping;
                        texture.repeat.set(3, 3);
                        texture.colorSpace = THREE.SRGBColorSpace;
                    }
                )
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

            // Controls
            this.controls = markRaw(
                new OrbitControls(this.camera, this.renderer.domElement)
            );
            this.controls.target.set(0, 0.5, 0); // set the center of the car to spin the camera around
            this.controls.maxDistance = 8;
            this.controls.minDistance = 4;
            this.controls.enablePan = false; // disable any camera movement besides around the model
            this.controls.maxPolarAngle = Math.PI / 2;
            this.controls.enableDamping = true; // smooth moving around the model
            this.controls.update();
        },

        loadModel(configuratorStore: ReturnType<typeof useConfigurationStore>) {
            // Materials
            this.materials.body = markRaw(
                new THREE.MeshPhysicalMaterial(configuratorStore.getBodyConfig)
            );
            this.materials.windows = markRaw(
                new THREE.MeshPhysicalMaterial(
                    configuratorStore.getWindowsConfig
                )
            );
            this.materials.rims = markRaw(
                new THREE.MeshPhysicalMaterial(configuratorStore.getRimsConfig)
            );
            this.materials.calipers = markRaw(
                new THREE.MeshPhysicalMaterial(
                    configuratorStore.getCalipersConfig
                )
            );
            this.materials.sideMirrors = markRaw(
                new THREE.MeshPhysicalMaterial(
                    configuratorStore.getSideMirrorsConfig
                )
            );

        // Load model
        this.loader.load(
        configuratorStore.modelPath,
        (gltf: GLTF) => {
            const car = gltf.scene.children[0];

            this.scaleToSize(car, 4);

            const body = car.getObjectByName('body');
            const glass = car.getObjectByName('all_windows');
            const calipers = car.getObjectByName('calipers');
            const rims = car.getObjectByName('rims');
            const sideMirrors = car.getObjectByName('side_mirrors');

            if (body && this.materials.body) body.material = this.materials.body;
            if (glass && this.materials.windows) glass.material = this.materials.windows;
            if (calipers && this.materials.calipers) calipers.material = this.materials.calipers;
            if (rims && this.materials.rims) rims.material = this.materials.rims;
            if (sideMirrors && this.materials.sideMirrors)
                sideMirrors.material = this.materials.sideMirrors;

            gltf.scene.traverse(obj => {
                if ((obj as THREE.Mesh).isMesh) {
                    obj.castShadow = true;
                    obj.receiveShadow = true;
                }
            });

            this.scene.add(car);
            }
        );
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
            this.materials.sideMirrors.clearcoatRoughness =
                config.clearcoatRoughness;
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
