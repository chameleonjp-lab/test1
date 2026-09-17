import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

const indexHtml = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const styles = await readFile(new URL('../src/style.css', import.meta.url), 'utf8');
const workflow = await readFile(new URL('../.github/workflows/deploy-pages.yml', import.meta.url), 'utf8');

test('公開用HTMLは日本語とゲーム操作を含む', () => {
    assert.match(indexHtml, /<html lang="ja">/);
    assert.match(indexHtml, /id="application"/);
    assert.equal((indexHtml.match(/data-direction=/g) ?? []).length, 4);
    assert.match(indexHtml, /方向ボタンを押して/);
});

test('スマートフォン向けの重なり対策がある', () => {
    assert.match(styles, /overflow:\s*hidden/);
    assert.match(styles, /touch-action:\s*none/);
    assert.match(styles, /safe-area-inset-bottom/);
    assert.match(styles, /grid-template-columns:\s*repeat\(3/);
    assert.match(styles, /min-height:\s*56px/);
});

test('GitHub Pagesの公開処理はmainへの取り込み後に動く', () => {
    assert.match(workflow, /branches:\s*\[main\]/);
    assert.match(workflow, /npm ci/);
    assert.match(workflow, /npm test/);
    assert.match(workflow, /npm run build/);
    assert.match(workflow, /actions\/deploy-pages@v4/);
});
