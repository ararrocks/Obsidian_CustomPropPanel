const esbuild = require('esbuild');
const inlineCssPlugin = require('esbuild-plugin-inline-css');

esbuild.build({
  entryPoints: ['./src/main.ts'],
  bundle: true,
  minify: false,
  sourcemap: false, // Disable source maps
  outfile: './dist/main.js',
  platform: 'browser',
  external: ['obsidian'],
  format: 'cjs',
  target: ['es2020'],
  plugins: [inlineCssPlugin()],
}).catch(() => process.exit(1));