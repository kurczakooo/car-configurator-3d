import { defineStore } from 'pinia';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { useConfigurationStore } from './configuratorStore';
import { markRaw } from 'vue';

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
        car: THREE.Object3D | null;
        cameraPosition: { x: any; y: any; z: any };
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
        car: null,
        cameraPosition: { x: 0, y: 0, z: 0 },
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

        loadModel(
            model_path: string,
            configuratorStore: ReturnType<typeof useConfigurationStore>
        ) {
            // Materials
            const bodyMaterial = markRaw(
                new THREE.MeshPhysicalMaterial(configuratorStore.getBodyConfig)
            );
            const glassMaterial = markRaw(
                new THREE.MeshPhysicalMaterial(
                    configuratorStore.getWindowsConfig
                )
            );
            const calipersMaterial = markRaw(
                new THREE.MeshPhysicalMaterial(
                    configuratorStore.getCalipersConfig
                )
            );
            const rimsMaterial = markRaw(
                new THREE.MeshPhysicalMaterial(configuratorStore.getRimsConfig)
            );
            const sideMirrorsMaterial = markRaw(
                new THREE.MeshPhysicalMaterial(
                    configuratorStore.getSideMirrorsConfig
                )
            );

            // Load model
            this.loader.load(model_path, (gltf: GLTFLoader) => {
                const car = gltf.scene.children[0];

                this.scaleToSize(car, 4);

                const body = car.getObjectByName('body');
                const glass = car.getObjectByName('all_windows');
                const calipers = car.getObjectByName('calipers');
                const rims = car.getObjectByName('rims');
                const sideMirrors = car.getObjectByName('side_mirrors');

                if (body) body.material = bodyMaterial;
                if (glass) glass.material = glassMaterial;
                if (calipers) calipers.material = calipersMaterial;
                if (rims) rims.material = rimsMaterial;
                if (sideMirrors) sideMirrors.material = sideMirrorsMaterial;

                gltf.scene.traverse((obj: THREE.Object3D) => {
                    if (obj.isMesh) {
                        obj.castShadow = true;
                        obj.receiveShadow = true;
                    }
                });

                this.car = car;
                this.scene.add(car);
            });
        },

        removeCarModelFromScene() {
            if (!this.car) return;

            this.scene.remove(this.car);

            this.car.traverse((obj: THREE.Object3D) => {
                if ((obj as THREE.Mesh).isMesh) {
                    const mesh = obj as THREE.Mesh;

                    mesh.geometry.dispose();

                    if (Array.isArray(mesh.material)) {
                        mesh.material.forEach((mat: THREE.Material) =>
                            this.disposeMaterial(mat)
                        );
                    } else {
                        this.disposeMaterial(mesh.material);
                    }
                }
            });

            this.car = null;
        },

        disposeMaterial(material: THREE.Material) {
            for (const key in material) {
                const value = material[key];
                if (value && value.isTexture) {
                    value.dispose();
                }
            }
            material.dispose();
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
