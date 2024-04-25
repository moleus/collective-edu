import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    build: {
        // TODO: how to build both html and library?
        lib: {
            entry: 'src/background.ts',
            name: 'background',
            fileName: 'background',
        },
        rollupOptions: {
            input: {
                main: 'src/main.tsx',
            }
        }
    }
})

