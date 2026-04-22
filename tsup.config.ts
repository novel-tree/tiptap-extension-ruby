import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  treeshake: true,
  target: 'es2022',
  outDir: 'dist',
  // CSS is injected manually (see src/style.css copy step) — keep tsup CSS-agnostic.
  // peerDependencies are externalized by default.
  external: ['@tiptap/core', '@tiptap/pm'],
  onSuccess: 'cp src/style.css dist/style.css',
});