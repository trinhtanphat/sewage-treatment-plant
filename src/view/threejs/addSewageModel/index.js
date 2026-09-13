
// 引入threejs
import * as THREE from 'three';
// 引入gltf模型加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
// 添加围栏函数
import { addFence } from '../addFence/index.js';
// 添加树模型函数
import { addPlant } from "../addPlant/index.js";
import { detectModelCapabilities, supportsModelFeature } from "../modelCapabilities.js";
import { inferGenericAxisScale } from "../modelNormalization.js";
import { getModelLoadPercent } from "../modelProgress.js";



function fitGenericModel(root) {
    root.updateMatrixWorld(true);
    let box = new THREE.Box3().setFromObject(root);
    if (box.isEmpty()) return;
    let size = box.getSize(new THREE.Vector3());
    let center = box.getCenter(new THREE.Vector3());
    const axisScale = inferGenericAxisScale({ center, size });
    root.scale.multiply(new THREE.Vector3(axisScale.x, axisScale.y, axisScale.z));
    root.updateMatrixWorld(true);
    box = new THREE.Box3().setFromObject(root);
    size = box.getSize(new THREE.Vector3());
    const maxDimension = Math.max(size.x, size.y, size.z);
    if (maxDimension > 0) root.scale.multiplyScalar(160 / maxDimension);
    root.updateMatrixWorld(true);
    const fittedBox = new THREE.Box3().setFromObject(root);
    center = fittedBox.getCenter(new THREE.Vector3());
    root.position.x -= center.x;
    root.position.z -= center.z;
    root.position.y -= fittedBox.min.y;
    root.updateMatrixWorld(true);
}

// 添加污水厂模型函数
async function addSewageModel (envMap) {
    // 创建模型组对象
    const model = new THREE.Group();
    model.rotateY(-Math.PI / 2);
    model.name = '污水厂模型';

    // 进度条元素
    const progressDiv = document.getElementsByClassName('ant-progress-bg')[0];
    // 进度条文字百分比元素
    const progressText = document.getElementsByClassName('ant-progress-text')[0];

    // 创建gltf模型加载器
    const gltfLoader = new GLTFLoader();

    return new Promise(resolve => {
        // http://211.143.122.110:18062/model/sewage.glb
        // 加载污水厂模型
        gltfLoader.load('./sewageModel.glb', async (gltf) => {
            gltf.scene.traverse(function (obj) {
                if (obj.name.includes('玻璃')) {
                    console.log(obj, 'obj')
                    obj.material.envMap = envMap;
                    obj.material.metalness = 0.3;
                    obj.material.roughness = 0.5;
                    obj.material.transparent = true;
                    obj.material.opacity = 0.9;
                    obj.material.refractionRatio = 0.5;
                    obj.material.envMapIntensity = 1;
                    obj.material.reflectivity = 0.9;
                    obj.material.transmission = 1.0;
                    obj.material.thickness = 0.5;


                    // obj.material = new THREE.MeshPhysicalMaterial({
                    //     color: '#A0CDE8',
                    //     metalness: 0.3,
                    //     roughness: 0.3,
                    //     transparent: true,
                    //     transmission: 0.5,
                    //     refractionRatio: 0.5,
                    //     reflectivity: 0.9,
                    //     opacity: 0.9,
                    //     thickness: 0.5,
                    //     envMap: envMap
                    // })
                }
                if (obj.isMesh) {
                    // 开启产生阴影
                    obj.castShadow = true;
                    // 开启接受阴影
                    obj.receiveShadow = true;
                }
            })
            const capabilities = detectModelCapabilities(gltf.scenes[0]);
            model.userData.modelCapabilities = capabilities;
            if (capabilities.kind === 'generic') fitGenericModel(gltf.scenes[0]);
            model.add(gltf.scenes[0]);
            // 添加围栏
            if (supportsModelFeature(capabilities, 'fence')) addFence(gltf.scenes[0]);
            // 添加树模型
            if (supportsModelFeature(capabilities, 'plants')) await addPlant(gltf.scenes[0]);

            // Only a successful GLTF load may report 100%.
            progressDiv.style.width = '100%';
            progressText.innerHTML = `项目正在初始化`;

            // 延迟几秒再隐藏进度条
            setTimeout(() => {
                // 隐藏进度条
                document.getElementsByClassName('progress')[0].style.display = 'none';
            }, 2000);
            resolve(model);
        },
            (xhr) => {
                const percent = getModelLoadPercent(xhr.loaded, xhr.total);
                if (percent === null) {
                    progressText.innerHTML = `模型加载中`;
                    return;
                }
                const displayPercent = percent.toFixed(1);
                progressDiv.style.width = `${Math.min(99.9, percent + 6)}%`;
                progressText.innerHTML = `模型加载中${displayPercent}%`;
            })
    })
}

export { addSewageModel }
