import { defineConfig } from 'vite';

// GitHub Pagesのプロジェクトサイト（/test1/）でも動く相対パスにする。
export default defineConfig({
    base: './'
});
