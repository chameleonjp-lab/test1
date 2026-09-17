import {
    Application,
    Color,
    Entity,
    FILLMODE_FILL_WINDOW,
    RESOLUTION_AUTO,
    StandardMaterial,
    math
} from 'playcanvas';
import {
    BOARD_LIMIT,
    createPosition,
    getPositionLabel,
    movePosition
} from './game-logic.js';
import './style.css';

const canvas = document.querySelector('#application');
const positionReadout = document.querySelector('#position-readout');
const resetButton = document.querySelector('#reset-button');
const directionButtons = [...document.querySelectorAll('[data-direction]')];

const app = new Application(canvas, {
    graphicsDeviceOptions: {
        antialias: true,
        alpha: false
    }
});

app.setCanvasFillMode(FILLMODE_FILL_WINDOW);
app.setCanvasResolution(RESOLUTION_AUTO);
// iPhoneの高密度画面で描画負荷が上がりすぎないよう、最大倍率を2倍に抑える。
app.graphicsDevice.maxPixelRatio = Math.min(window.devicePixelRatio || 1, 2);
window.addEventListener('resize', () => app.resizeCanvas());

const color = (hex) => {
    const value = hex.replace('#', '');
    return new Color(
        Number.parseInt(value.slice(0, 2), 16) / 255,
        Number.parseInt(value.slice(2, 4), 16) / 255,
        Number.parseInt(value.slice(4, 6), 16) / 255
    );
};

const makeMaterial = (hex, shininess = 25) => {
    const material = new StandardMaterial();
    material.diffuse = color(hex);
    material.shininess = shininess;
    material.update();
    return material;
};

const makeBox = (name, scale, position, material, options = {}) => {
    const entity = new Entity(name);
    entity.addComponent('render', {
        type: 'box',
        castShadows: options.castShadows ?? false,
        receiveShadows: options.receiveShadows ?? true,
        material
    });
    entity.setLocalScale(...scale);
    entity.setLocalPosition(...position);
    app.root.addChild(entity);
    return entity;
};

app.scene.ambientLightColor = color('#8390b8');

const floorMaterial = makeMaterial('#304268');
const gridMaterial = makeMaterial('#58719d');
const edgeMaterial = makeMaterial('#6e8fc2');
const boxMaterial = makeMaterial('#ffb84a', 55);
const boxTopMaterial = makeMaterial('#ffe6a3', 35);

// 床は外部素材を使わず、Engineの標準形状だけで作る。
makeBox('床', [14, 0.4, 12], [0, -0.2, 0], floorMaterial, { receiveShadows: true });

// 1マスごとの目印を置き、箱の移動先を画面上で確認しやすくする。
for (let index = -BOARD_LIMIT; index <= BOARD_LIMIT; index += 1) {
    makeBox(`横の目印${index}`, [0.025, 0.025, 11.2], [index, 0.01, 0], gridMaterial);
    makeBox(`縦の目印${index}`, [13.2, 0.025, 0.025], [0, 0.012, index], gridMaterial);
}

makeBox('手前の縁', [14, 0.18, 0.18], [0, 0.08, 5.75], edgeMaterial);
makeBox('奥の縁', [14, 0.18, 0.18], [0, 0.08, -5.75], edgeMaterial);
makeBox('左の縁', [0.18, 0.18, 11.5], [-6.75, 0.08, 0], edgeMaterial);
makeBox('右の縁', [0.18, 0.18, 11.5], [6.75, 0.08, 0], edgeMaterial);

const box = makeBox('動かす箱', [0.86, 0.86, 0.86], [0, 0.52, 0], boxMaterial, {
    castShadows: true,
    receiveShadows: true
});

// 箱の上面に小さな明るい面を重ね、向きと立体感を見やすくする。
const boxTop = makeBox('箱の上面', [0.64, 0.025, 0.64], [0, 0.955, 0], boxTopMaterial, {
    castShadows: true,
    receiveShadows: false
});

const camera = new Entity('カメラ');
camera.addComponent('camera', {
    clearColor: color('#101a32'),
    fov: 48,
    farClip: 100
});
camera.setLocalPosition(9.4, 10.5, 12.8);
camera.lookAt(0, 0, 0);
app.root.addChild(camera);

const sun = new Entity('太陽の光');
sun.addComponent('light', {
    type: 'directional',
    color: color('#fff4dc'),
    intensity: 2.2,
    castShadows: true,
    shadowDistance: 30,
    shadowResolution: 1024
});
sun.setEulerAngles(48, 32, 0);
app.root.addChild(sun);

const fill = new Entity('補助光');
fill.addComponent('light', {
    type: 'omni',
    color: color('#8bb8ff'),
    intensity: 0.8,
    range: 30
});
fill.setLocalPosition(-3, 6, 4);
app.root.addChild(fill);

let position = createPosition();
let targetPosition = { ...position };
let elapsed = 0;

const updatePositionReadout = () => {
    positionReadout.textContent = `位置：${getPositionLabel(position)}（${position.x}, ${position.z}）`;
};

const move = (directionName) => {
    const next = movePosition(targetPosition, directionName);
    if (next.x === targetPosition.x && next.z === targetPosition.z) {
        return;
    }

    targetPosition = next;
    position = { ...next };
    updatePositionReadout();
};

const reset = () => {
    targetPosition = createPosition();
    position = createPosition();
    updatePositionReadout();
};

resetButton.addEventListener('click', reset);

let heldDirection = null;
let repeatTimer = null;

const stopHolding = () => {
    heldDirection = null;
    if (repeatTimer !== null) {
        window.clearInterval(repeatTimer);
        repeatTimer = null;
    }
};

const startHolding = (event) => {
    event.preventDefault();
    stopHolding();

    const button = event.currentTarget;
    heldDirection = button.dataset.direction;
    move(heldDirection);
    if (typeof button.setPointerCapture === 'function') {
        button.setPointerCapture(event.pointerId);
    }

    repeatTimer = window.setInterval(() => {
        if (heldDirection) {
            move(heldDirection);
        }
    }, 130);
};

directionButtons.forEach((button) => {
    button.addEventListener('pointerdown', startHolding);
    button.addEventListener('pointerup', stopHolding);
    button.addEventListener('pointercancel', stopHolding);
    button.addEventListener('lostpointercapture', stopHolding);
});

window.addEventListener('pointerup', stopHolding);
window.addEventListener('blur', stopHolding);
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        stopHolding();
    }
});

window.addEventListener('keydown', (event) => {
    const keyToDirection = {
        ArrowUp: 'up',
        ArrowDown: 'down',
        ArrowLeft: 'left',
        ArrowRight: 'right'
    };
    const direction = keyToDirection[event.key];
    if (!direction) {
        return;
    }

    event.preventDefault();
    move(direction);
});

app.on('update', (dt) => {
    elapsed += dt;
    const blend = Math.min(1, dt * 14);
    const current = box.getLocalPosition();
    const nextX = math.lerp(current.x, targetPosition.x, blend);
    const nextZ = math.lerp(current.z, targetPosition.z, blend);
    const bounce = Math.sin(elapsed * 3.2) * 0.025;

    box.setLocalPosition(nextX, 0.52 + bounce, nextZ);
    box.rotate(0, dt * 18, 0);
    boxTop.setLocalPosition(nextX, 0.955 + bounce, nextZ);
    boxTop.setLocalEulerAngles(0, box.getLocalEulerAngles().y, 0);
});

updatePositionReadout();
app.start();
