# 箱を動かそう

PlayCanvas Engineをコードから直接使って作った、小さな3Dゲームの試作品です。
3Dの床の上にある箱を、画面内の方向ボタンで1マスずつ動かせます。

## この試作品の方針

- PlayCanvas Editorは使わず、npmの `playcanvas` をゲームコードへ組み込んでいます。
- Viteで公開用ファイルを作り、GitHub Pagesで配信できる構成にしています。
- 画面の文字と操作説明は日本語です。
- 画面下の安全領域を考慮した方向ボタンを使い、スマートフォンでボタンが重ならないようにしています。
- 画像・音声などの有料素材や外部素材は使っていません。

## 開発者向けコマンド

Node.js 20.19以上、または22.12以上を使える環境で、次を実行します。

```bash
npm install
npm test
npm run dev
```

公開用ファイルの検査と作成は次で行えます。

```bash
npm run build
```

## GitHub Pagesで公開する方法

リポジトリの `main` に変更を取り込むと、`.github/workflows/deploy-pages.yml` が自動で検査・ビルド・公開を行います。

初回だけGitHubのリポジトリ画面で次を確認してください。

1. `Settings` → `Pages`を開く。
2. `Build and deployment` の公開元を `GitHub Actions` にする。
3. `main`への取り込み後、`Actions`で「GitHub Pagesへ公開」が成功することを確認する。

公開先は通常、次の形になります。

`https://chameleonjp-lab.github.io/test1/`

## 公式資料

- [PlayCanvas Engine](https://developer.playcanvas.com/user-manual/engine/)
- [Using the Engine Standalone](https://developer.playcanvas.com/user-manual/engine/standalone/)
- [PlayCanvas Engine公式リポジトリ](https://github.com/playcanvas/engine)
- [PlayCanvas Engineのライセンス](https://github.com/playcanvas/engine/blob/main/LICENSE)

ライセンス表記は [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md) に残しています。
