import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import webExtension from "vite-plugin-web-extension";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        // react(),
        webExtension(),],
    // build: {
    //     // TODO: how to build both html and library?
    //     lib: {
    //         entry: 'src/background.ts',
    //         name: 'background',
    //         fileName: 'background',
    //     },
    //     rollupOptions: {
    //         input: {
    //             main: 'src/main.tsx',
    //         }
    //     }
    // }
})

