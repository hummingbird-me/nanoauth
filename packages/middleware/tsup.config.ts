import type { Options } from 'tsup';

export const tsup: Options = {
  splitting: false,
  target: 'esnext',
  sourcemap: true,
  clean: true,
  entryPoints: ['src/index.ts', 'src/handleRedirect.ts'],
  format: ['cjs', 'esm'],
  dts: true,
  minify: true,
};
