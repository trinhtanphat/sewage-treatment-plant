// 引入threejs
import * as THREE from 'three';
// 引入gltf模型加载器
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

async function loadPlantModels () {
    const gltfLoader = new GLTFLoader();
    const [pine, tree5, tree6] = await Promise.all([
        gltfLoader.loadAsync('./plant/pine.glb'),
        gltfLoader.loadAsync('./plant/tree5.glb'),
        gltfLoader.loadAsync('./plant/tree6.glb'),
    ]);
    pine.scene.scale.set(2, 2, 2);
    return { pine, tree5, tree6 };
}

async function addPlant (model) {
    const { pine, tree5, tree6 } = await loadPlantModels();
    // 树木名称对象，通过键名匹配对应的模型变量
    const treeNameObj = {
        '松树坐标': pine,
        '秋天树2坐标': tree6,
        '秋天树坐标': tree5,
        '矮树坐标': tree6,
        '大树坐标': tree6,
        '小树2坐标': tree6,
        '高树坐标': tree6,
        '旧树坐标': tree6,
    };
    // 创建一个植物组对象，存储所有植物
    const plantGroup = new THREE.Group();
    plantGroup.position.y = -0.1;
    plantGroup.name = '植物';

    for (const name in treeNameObj) {
        const treePos = model.getObjectByName(name);
        const treeModel = treeNameObj[name];
        if (!treePos || !treeModel?.scene) continue;
        const tree = treeModel.scene;
        // 给树模型添加阴影效果
        tree.traverse(obj => {
            obj.position.set(0, 0, 0);
            if (obj.isMesh) obj.castShadow = true;
        });
        treePos.children.map(item => {
            // 每次遍历克隆新的树
            const cloneTree = tree.clone();
            cloneTree.position.copy(treePos.position);
            cloneTree.position.add(item.position);
            plantGroup.add(cloneTree);
        });
    }
    model.add(plantGroup);
}

export { addPlant };
