export const BOARD_LIMIT = 5;

export const DIRECTIONS = Object.freeze({
    up: Object.freeze({ x: 0, z: -1 }),
    down: Object.freeze({ x: 0, z: 1 }),
    left: Object.freeze({ x: -1, z: 0 }),
    right: Object.freeze({ x: 1, z: 0 })
});

export function createPosition(x = 0, z = 0) {
    return { x, z };
}

export function movePosition(position, directionName) {
    const direction = DIRECTIONS[directionName];

    if (!direction) {
        return { ...position };
    }

    return {
        x: Math.max(-BOARD_LIMIT, Math.min(BOARD_LIMIT, position.x + direction.x)),
        z: Math.max(-BOARD_LIMIT, Math.min(BOARD_LIMIT, position.z + direction.z))
    };
}

export function getPositionLabel(position) {
    if (position.x === 0 && position.z === 0) {
        return '中央';
    }

    const vertical = position.z < 0 ? '上' : position.z > 0 ? '下' : '';
    const horizontal = position.x < 0 ? '左' : position.x > 0 ? '右' : '';

    return `${vertical}${horizontal}`;
}
