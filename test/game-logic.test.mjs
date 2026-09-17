import test from 'node:test';
import assert from 'node:assert/strict';
import {
    BOARD_LIMIT,
    createPosition,
    getPositionLabel,
    movePosition
} from '../src/game-logic.js';

test('方向ごとに1マス移動する', () => {
    assert.deepEqual(movePosition(createPosition(), 'up'), { x: 0, z: -1 });
    assert.deepEqual(movePosition(createPosition(), 'down'), { x: 0, z: 1 });
    assert.deepEqual(movePosition(createPosition(), 'left'), { x: -1, z: 0 });
    assert.deepEqual(movePosition(createPosition(), 'right'), { x: 1, z: 0 });
});

test('床の範囲から箱が出ない', () => {
    assert.deepEqual(movePosition({ x: BOARD_LIMIT, z: -BOARD_LIMIT }, 'right'), {
        x: BOARD_LIMIT,
        z: -BOARD_LIMIT
    });
    assert.deepEqual(movePosition({ x: -BOARD_LIMIT, z: BOARD_LIMIT }, 'down'), {
        x: -BOARD_LIMIT,
        z: BOARD_LIMIT
    });
});

test('知らない方向では位置を変えない', () => {
    const position = { x: 2, z: -3 };
    assert.deepEqual(movePosition(position, 'unknown'), position);
});

test('位置表示は日本語で読める', () => {
    assert.equal(getPositionLabel({ x: 0, z: 0 }), '中央');
    assert.equal(getPositionLabel({ x: -1, z: -1 }), '上左');
    assert.equal(getPositionLabel({ x: 1, z: 1 }), '下右');
});
